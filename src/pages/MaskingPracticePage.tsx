import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Button, RadioGroup, Radio,
  FormControlLabel, FormControl, FormLabel, TextField, Alert, AlertTitle,
  LinearProgress, Chip, Divider, Accordion, AccordionSummary,
  AccordionDetails, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Stack, Link as MuiLink, useMediaQuery,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  ExpandMore, CheckCircle, Cancel, School, NavigateNext, Replay,
  HearingOutlined,
} from '@mui/icons-material';
import { Frequency, Ear, HearingProfile, ThresholdPoint } from '../interfaces/AudioTypes';
import patientService from '../services/PatientService';

// ---------------------------------------------------------------------------
// Clinical constants — values from ASHA (2005), BSA (2018), Martin & Clark
// ---------------------------------------------------------------------------

/** Minimum interaural attenuation by transducer (dB). Conservative clinical values. */
const INTERAURAL_ATTENUATION: Record<string, number> = {
  supraaural: 40,   // TDH-39/49 supra-aural headphones (range 40-65, use 40)
  insert: 70,       // ER-3A insert earphones (standard clinical: 70; conservative floor: 55)
  boneConduction: 0, // BC signal reaches both cochleae with ~0 dB loss
};

/** Occlusion effect (dB) by masking-delivery transducer and frequency.
 *  Added to starting EML for BC testing at low frequencies.
 *  Deep-insertion insert earphones effectively eliminate the OE. */
const OCCLUSION_EFFECT: Record<string, Record<number, number>> = {
  supraaural: { 250: 15, 500: 15, 1000: 10, 2000: 0, 3000: 0, 4000: 0 },
  insert:     { 250: 0,  500: 0,  1000: 0,  2000: 0, 3000: 0, 4000: 0 },
};

const TRANSDUCER_LABELS: Record<string, string> = {
  supraaural: 'Supra-aural headphones',
  insert: 'Insert earphones',
};

const SCENARIO_FREQUENCIES: Frequency[] = [250, 500, 1000, 2000, 4000];
const SAFETY_FACTOR = 10;
const SCENARIOS_PER_SESSION = 20;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TransducerType = 'supraaural' | 'insert';

interface MaskingScenario {
  patientName: string;
  frequency: Frequency;
  testEar: Ear;
  testType: 'air' | 'bone';
  transducer: TransducerType;
  rightAC: number | null;
  rightBC: number | null;
  leftAC: number | null;
  leftBC: number | null;
  correctMaskingRequired: boolean;
  correctMaskingEar: 'non-test' | null;
  correctStartingEML: number | null;
  correctMaxMasking: number | null;
  explanation: string;
  clinicalNote: string;
}

interface ScenarioAnswer {
  maskingRequired: boolean | null;
  maskingEar: string | null;
  startingEML: string;
  submitted: boolean;
  correct: boolean;
}

interface PracticeResults {
  date: string;
  totalScenarios: number;
  correctAnswers: number;
  accuracy: number;
  scenarioDetails: Array<{
    patientName: string;
    frequency: number;
    testEar: string;
    testType: string;
    transducer: string;
    correct: boolean;
  }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getThreshold(
  thresholds: ThresholdPoint[], ear: Ear, testType: 'air' | 'bone', frequency: Frequency,
): number | null {
  const types = testType === 'air' ? ['air', 'masked_air'] : ['bone', 'masked_bone'];
  const pt = thresholds.find(
    (t) => t.ear === ear && types.includes(t.testType) && t.frequency === frequency && t.responseStatus === 'threshold',
  );
  return pt ? pt.hearingLevel : null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getOE(transducer: TransducerType, freq: number): number {
  return OCCLUSION_EFFECT[transducer]?.[freq] ?? 0;
}

function generateScenarios(patients: HearingProfile[]): MaskingScenario[] {
  const scenarios: MaskingScenario[] = [];

  for (const patient of patients) {
    for (const freq of SCENARIO_FREQUENCIES) {
      for (const testEar of ['right', 'left'] as Ear[]) {
        const nonTestEar: Ear = testEar === 'right' ? 'left' : 'right';
        const teAC = getThreshold(patient.thresholds, testEar, 'air', freq);
        const teBC = getThreshold(patient.thresholds, testEar, 'bone', freq);
        const nteAC = getThreshold(patient.thresholds, nonTestEar, 'air', freq);
        const nteBC = getThreshold(patient.thresholds, nonTestEar, 'bone', freq);

        const row = {
          patientName: patient.name,
          frequency: freq,
          testEar,
          rightAC: getThreshold(patient.thresholds, 'right', 'air', freq),
          rightBC: getThreshold(patient.thresholds, 'right', 'bone', freq),
          leftAC: getThreshold(patient.thresholds, 'left', 'air', freq),
          leftBC: getThreshold(patient.thresholds, 'left', 'bone', freq),
        };

        // ----- AC scenarios for both transducer types -----
        if (teAC !== null && nteBC !== null) {
          for (const transducer of ['supraaural', 'insert'] as TransducerType[]) {
            const ia = INTERAURAL_ATTENUATION[transducer];
            const diff = teAC - nteBC;
            const required = diff >= ia;
            const startEML = required ? nteBC + SAFETY_FACTOR : null;
            const maxMask = required && teBC !== null ? teBC + ia : null;

            let explanation: string;
            let clinicalNote = '';

            if (required) {
              const parts = [`Masking IS required. Test ear AC (${teAC} dB) \u2212 non-test ear BC (${nteBC} dB) = ${diff} dB \u2265 IA of ${ia} dB for ${TRANSDUCER_LABELS[transducer]}.`];
              if (startEML !== null) {
                parts.push(`Starting EML = ${nteBC} + ${SAFETY_FACTOR} = ${startEML} dB.`);
              }
              if (maxMask !== null && teBC !== null && startEML !== null) {
                parts.push(`Max masking = ${teBC} + ${ia} = ${maxMask} dB. Plateau range: ${startEML}\u2013${maxMask} dB (${maxMask - startEML} dB).`);
              }
              explanation = parts.join(' ');

              if (transducer === 'supraaural' && diff < INTERAURAL_ATTENUATION.insert) {
                clinicalNote = `Insert earphones (IA = ${INTERAURAL_ATTENUATION.insert} dB) would eliminate the need for masking here (${diff} dB < ${INTERAURAL_ATTENUATION.insert} dB).`;
              }
              if (startEML !== null && maxMask !== null && startEML > maxMask) {
                clinicalNote = 'Masking dilemma: minimum EML exceeds maximum safe masking. Consider insert earphones or report unmasked thresholds with notation.';
              }
            } else {
              explanation = `Masking is NOT required. Test ear AC (${teAC} dB) \u2212 non-test ear BC (${nteBC} dB) = ${diff} dB, below IA of ${ia} dB for ${TRANSDUCER_LABELS[transducer]}.`;
            }

            scenarios.push({
              ...row, testType: 'air', transducer,
              correctMaskingRequired: required, correctMaskingEar: required ? 'non-test' : null,
              correctStartingEML: startEML, correctMaxMasking: maxMask,
              explanation, clinicalNote,
            });
          }
        }

        // ----- BC scenarios for both masking-delivery transducers -----
        if (teBC !== null && teAC !== null) {
          for (const transducer of ['supraaural', 'insert'] as TransducerType[]) {
            const teABG = teAC - teBC;
            const nteABG = nteAC !== null && nteBC !== null ? nteAC - nteBC : 0;
            const required = teABG >= 10 || nteABG >= 10;
            const oe = getOE(transducer, freq);
            const startEML = required && nteBC !== null ? nteBC + oe + SAFETY_FACTOR : null;
            const maxMask = required ? teBC + INTERAURAL_ATTENUATION[transducer] : null;

            const gaps: string[] = [];
            if (teABG >= 10) gaps.push(`test ear ABG = ${teABG} dB`);
            if (nteABG >= 10) gaps.push(`non-test ear ABG = ${nteABG} dB`);

            let explanation: string;
            let clinicalNote = '';

            if (required) {
              const parts = [`Masking IS required for BC. IA for bone conduction = 0 dB. Air-bone gap \u2265 10 dB detected (${gaps.join('; ')}).`];
              if (startEML !== null && nteBC !== null) {
                if (oe > 0) {
                  parts.push(`Starting EML = ${nteBC} + ${oe} (OE) + ${SAFETY_FACTOR} = ${startEML} dB.`);
                  clinicalNote = `Occlusion effect of ${oe} dB at ${freq} Hz with ${TRANSDUCER_LABELS[transducer]} added to starting EML.`;
                } else {
                  parts.push(`Starting EML = ${nteBC} + ${SAFETY_FACTOR} = ${startEML} dB.`);
                  if (transducer === 'insert') {
                    clinicalNote = 'Deep-insertion insert earphones eliminate the occlusion effect.';
                  }
                }
              }
              if (maxMask !== null) {
                parts.push(`Max masking = ${teBC} + ${INTERAURAL_ATTENUATION[transducer]} = ${maxMask} dB.`);
              }
              explanation = parts.join(' ');
            } else {
              explanation = `Masking is NOT required for BC. Air-bone gaps < 10 dB in both ears (test ear: ${teABG} dB${nteAC !== null && nteBC !== null ? `, non-test ear: ${nteABG} dB` : ''}). Both ears have similar cochlear sensitivity with no significant conductive component.`;
            }

            scenarios.push({
              ...row, testType: 'bone', transducer,
              correctMaskingRequired: required, correctMaskingEar: required ? 'non-test' : null,
              correctStartingEML: startEML, correctMaxMasking: maxMask,
              explanation, clinicalNote,
            });
          }
        }
      }
    }
  }
  return scenarios;
}

function selectBalancedScenarios(all: MaskingScenario[], count: number): MaskingScenario[] {
  const byCategory: Record<string, MaskingScenario[]> = {};
  for (const s of all) {
    const key = `${s.testType}_${s.transducer}_${s.correctMaskingRequired ? 'y' : 'n'}`;
    (byCategory[key] ??= []).push(s);
  }

  // Target distribution ensures students see every combination
  const targets: [string, number][] = [
    ['air_supraaural_y', 3], ['air_supraaural_n', 2],
    ['air_insert_y', 2],     ['air_insert_n', 2],
    ['bone_supraaural_y', 3], ['bone_supraaural_n', 2],
    ['bone_insert_y', 2],     ['bone_insert_n', 2],
  ];

  const result: MaskingScenario[] = [];
  for (const [cat, n] of targets) {
    result.push(...shuffle(byCategory[cat] || []).slice(0, n));
  }

  if (result.length < count) {
    const used = new Set(result);
    result.push(...shuffle(all.filter((s) => !used.has(s))).slice(0, count - result.length));
  }

  return shuffle(result).slice(0, count);
}

function emptyAnswer(): ScenarioAnswer {
  return { maskingRequired: null, maskingEar: null, startingEML: '', submitted: false, correct: false };
}

// ---------------------------------------------------------------------------
// Educational content
// ---------------------------------------------------------------------------

const EducationalIntro: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);
  const toggle = (p: string) => (_: React.SyntheticEvent, open: boolean) => setExpanded(open ? p : false);
  const sectionSx = { bgcolor: alpha(theme.palette.primary.main, 0.04) };
  const pearlSx = { p: 2, bgcolor: alpha(theme.palette.info.main, 0.06), borderLeft: `4px solid ${theme.palette.info.main}` };
  const mistakeSx = { p: 2, bgcolor: alpha(theme.palette.error.main, 0.04), borderLeft: `4px solid ${theme.palette.error.main}` };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <School color="primary" />
        <Typography variant="h5" component="h2">Clinical Masking in Audiometry</Typography>
      </Box>
      <Typography variant="body1" paragraph>
        Masking ensures thresholds represent the test ear, not the non-test ear responding via
        cross-hearing. It is one of the most critical &mdash; and most commonly tested &mdash; clinical
        skills in audiology. See the{' '}
        <MuiLink component={Link} to="/reference/audiogram-patterns">Audiogram Patterns Guide</MuiLink>{' '}
        for masking requirements by loss type (e.g., unilateral, asymmetric, conductive).
      </Typography>

      {/* ==== Section 1: Why Masking Is Needed ==== */}
      <Accordion expanded={expanded === 'why'} onChange={toggle('why')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>1. Why Masking Is Needed</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Sound can travel across the skull and stimulate the opposite (non-test) cochlea &mdash; this is
            called <strong>cross-hearing</strong>. The minimum intensity at which this occurs is the
            <strong> interaural attenuation (IA)</strong>. Without masking, you may unknowingly record the
            better ear&apos;s threshold instead of the test ear&apos;s, producing a <strong>shadow curve</strong>.
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Transducer</strong></TableCell>
                  <TableCell align="center"><strong>Clinical IA (dB)</strong></TableCell>
                  <TableCell><strong>Measured Range</strong></TableCell>
                  <TableCell><strong>Clinical Significance</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Supra-aural (TDH-39/49)</TableCell>
                  <TableCell align="center"><strong>40</strong></TableCell>
                  <TableCell>40&ndash;65 dB</TableCell>
                  <TableCell>Masking needed more often; narrower plateau</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Insert earphones (ER-3A)</TableCell>
                  <TableCell align="center"><strong>70</strong></TableCell>
                  <TableCell>55&ndash;79 dB</TableCell>
                  <TableCell>Masking needed far less often; wider plateau; no OE</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bone oscillator</TableCell>
                  <TableCell align="center"><strong>0</strong></TableCell>
                  <TableCell>0 dB</TableCell>
                  <TableCell>Sound reaches both cochleae equally &mdash; always mask</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
            <AlertTitle>Insert Earphone IA: The Evidence</AlertTitle>
            <Typography variant="body2" component="div">
              <strong>Standard clinical value: 70 dB</strong> &mdash; used for board exams and clinical decision-making
              (Katz, <em>Handbook of Clinical Audiology</em>, 7th ed.; Martin &amp; Clark, <em>Introduction to Audiology</em>, 13th ed.).<br /><br />
              <strong>Measured range: 55&ndash;79 dB</strong> (Sklare &amp; Denenberg, 1987, <em>Ear and Hearing</em>). The range
              varies with frequency and insertion depth.<br /><br />
              <strong>Conservative floor: 55 dB</strong> &mdash; some clinicians use this to be maximally
              safe, since the lowest measured IA in the literature was 55 dB. This approach increases masking
              frequency but eliminates any risk of under-masking.<br /><br />
              <strong>For board exams and clinical practice: use 70 dB</strong> unless your program or facility
              explicitly specifies otherwise.
            </Typography>
          </Alert>

          <Alert severity="warning" variant="outlined">
            Insert earphones provide <strong>30 dB</strong> more IA than supra-aural headphones (70 vs 40 dB).
            This dramatically reduces masking needs, widens the masking plateau, and often eliminates the
            masking dilemma entirely. <strong>Many audiometry trainers incorrectly use 40 or 55 dB for inserts</strong> &mdash;
            always verify the transducer-specific IA value.
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 2: When to Mask — AC ==== */}
      <Accordion expanded={expanded === 'ac'} onChange={toggle('ac')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>2. When to Mask: Air Conduction</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>AC Masking Rule (ASHA)</AlertTitle>
            <strong>Mask when: Test ear AC &minus; Non-test ear BC &ge; IA</strong><br />
            Supra-aural: &ge; 40 dB &nbsp;|&nbsp; Insert: &ge; 70 dB
          </Alert>
          <Typography variant="body2" paragraph>
            <strong>Critical distinction:</strong> Compare AC of the <em>test ear</em> to BC of the
            <em> non-test ear</em>. The reason for using non-test ear BC (not AC) is explained in detail
            in Section 4 below, but the key point is: <strong>cross-hearing occurs via bone conduction</strong>,
            so what matters is how sensitive the opposite cochlea is &mdash; and BC measures cochlear sensitivity.
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="subtitle2" gutterBottom>Worked Example</Typography>
            <Typography variant="body2">
              Patient: Right ear AC = 60 dB, Left ear BC = 15 dB<br />
              Difference = 60 &minus; 15 = 45 dB<br />
              &bull; Supra-aural (IA = 40): 45 &ge; 40 &rarr; <strong>Masking REQUIRED</strong><br />
              &bull; Insert (IA = 70): 45 &lt; 70 &rarr; <strong>Masking NOT required</strong><br />
              <em>Using insert earphones eliminates the need for masking in this case &mdash; a 30 dB advantage.</em>
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={mistakeSx}>
            <Typography variant="subtitle2" color="error.main" gutterBottom>Common Student Mistake</Typography>
            <Typography variant="body2">
              <strong>Wrong:</strong> &quot;Right AC = 60, Left AC = 50. Difference = 10 dB. No masking needed.&quot;<br />
              <strong>Right:</strong> Compare TE <em>AC</em> to NTE <em>BC</em>, not AC to AC. If Left BC = 5 dB,
              then difference = 60 &minus; 5 = 55 dB &ge; 40 &rarr; masking IS required with supra-aural headphones.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 3: When to Mask — BC ==== */}
      <Accordion expanded={expanded === 'bc'} onChange={toggle('bc')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>3. When to Mask: Bone Conduction</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>BC Masking Rule</AlertTitle>
            <strong>Mask whenever an air-bone gap (ABG) &ge; 10 dB exists in EITHER ear.</strong><br />
            BC IA = 0 dB &mdash; you can never assume which cochlea is responding.
          </Alert>
          <Typography variant="body2" paragraph>
            Since bone-conducted sound reaches both cochleae with essentially zero attenuation,
            the unmasked BC threshold always represents the <em>better</em> cochlea. Any air-bone gap
            &ge; 10 dB indicates possible conductive involvement and requires masking to determine
            the true BC threshold of each ear individually.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Rule of thumb:</strong> Almost always mask for bone conduction. The only exception
            is symmetric sensorineural hearing loss with no air-bone gap in either ear &mdash; an uncommon
            clinical scenario.
          </Typography>
          <Paper variant="outlined" sx={pearlSx}>
            <Typography variant="subtitle2" color="info.main" gutterBottom>Clinical Pearl</Typography>
            <Typography variant="body2">
              Test the <strong>better ear first</strong> for bone conduction. Since unmasked BC always
              reflects the better cochlea, testing the better ear first establishes a known reference point
              before masking is applied.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 4: Why NTE BC in EML Formula ==== */}
      <Accordion expanded={expanded === 'whybc'} onChange={toggle('whybc')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>4. Why We Use Non-Test Ear BC (Not AC) in Masking Formulas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            This is one of the most important &mdash; and most misunderstood &mdash; concepts in clinical masking.
            Every masking formula uses <strong>non-test ear BC threshold</strong>, never AC. Here is why:
          </Typography>

          <Box component="ol" sx={{ pl: 2, mb: 2, '& li': { mb: 1.5 } }}>
            <li>
              <Typography variant="body2">
                <strong>Cross-hearing goes to the cochlea.</strong> When a loud tone in the test ear crosses the
                skull, it arrives at the non-test ear <em>cochlea</em> via bone conduction. The outer and middle
                ear of the non-test ear are bypassed entirely.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>BC threshold = cochlear sensitivity.</strong> The bone conduction threshold tells you
                the lowest level at which the cochlea can detect sound. This is exactly the threshold you need
                to cover (&quot;mask&quot;) with noise.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>AC threshold includes middle ear loss.</strong> Air conduction threshold reflects
                both the middle ear <em>and</em> cochlea. If the non-test ear has a conductive component
                (middle ear pathology), the AC threshold overstates how much stimulation is needed to reach
                the cochlea.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>The goal is to &quot;occupy&quot; the cochlea.</strong> Masking noise must keep the
                non-test ear cochlea busy so it cannot detect the crossed-over signal. You need enough noise
                to exceed the cochlea&apos;s sensitivity &mdash; that sensitivity is the BC threshold.
              </Typography>
            </li>
          </Box>

          <Paper variant="outlined" sx={{
            p: 2, mb: 2,
            bgcolor: alpha(theme.palette.error.main, 0.06),
            border: `2px solid ${theme.palette.error.main}`,
          }}>
            <Typography variant="subtitle2" color="error.main" gutterBottom>
              Why Using AC Would Be Wrong: A Worked Example
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Patient:</strong> Testing right ear AC at 1000 Hz.<br />
              Right ear: AC = 70 dB, BC = 65 dB (sensorineural loss)<br />
              Left ear (non-test): AC = 60 dB, BC = 10 dB (conductive loss &mdash; large 50 dB air-bone gap)
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Step 1 &mdash; Masking decision (should we mask?):</strong><br />
              TE AC &minus; NTE BC = 70 &minus; 10 = 60 dB<br />
              With supra-aural headphones (IA = 40): 60 &ge; 40 &rarr; <strong>masking IS required</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>If you mistakenly used NTE AC instead:</strong><br />
              TE AC &minus; NTE AC = 70 &minus; 60 = 10 dB &lt; 40 &rarr; you would conclude &quot;no masking needed&quot;<br />
              <strong>This is dangerously wrong!</strong> The left cochlea is very sensitive (BC = 10 dB).
              The 70 dB tone presented to the right ear can cross the skull and stimulate this sensitive
              cochlea. Without masking, you record the left cochlea&apos;s response &mdash; a shadow curve, not
              the right ear&apos;s threshold.
            </Typography>
            <Alert severity="error" sx={{ mt: 1 }}>
              <strong>Result of using AC instead of BC:</strong> You skip masking when it is critically
              needed. The patient&apos;s audiogram shows a shadow curve at ~50 dB in the right ear
              (the left cochlea responding), not the true right ear threshold of 70 dB. This 20 dB
              error could change the diagnosis and treatment plan entirely.
            </Alert>
          </Paper>

          <Paper variant="outlined" sx={pearlSx}>
            <Typography variant="subtitle2" color="info.main" gutterBottom>Clinical Pearl &mdash; Exam Tip</Typography>
            <Typography variant="body2">
              On board exams, if you see a patient with unilateral conductive hearing loss, <strong>always
              check if the good ear&apos;s BC threshold is far below the test ear&apos;s AC threshold</strong>. This
              is the classic setup for a masking question. The conductive component makes the AC-to-AC difference
              look small, but the AC-to-BC difference reveals the true cross-hearing risk.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 5: Effective Masking Level ==== */}
      <Accordion expanded={expanded === 'eml'} onChange={toggle('eml')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>5. Effective Masking Level (EML)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Starting EML Formulas</AlertTitle>
            <strong>AC testing:</strong> Starting EML = Non-test ear BC + 10 dB (safety factor)<br />
            <strong>BC testing:</strong> Starting EML = Non-test ear BC + Occlusion Effect + 10 dB
          </Alert>
          <Typography variant="body2" paragraph>
            The masking noise must be loud enough at the non-test ear cochlea to prevent it from
            detecting the crossed-over test signal. The <strong>10 dB safety factor</strong> is a clinical
            convention ensuring adequate masking above the cochlear threshold &mdash; it accounts for
            normal variability in threshold measurement and the central masking effect (~5 dB).
          </Typography>
          <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
            <AlertTitle>Maximum Masking (Overmasking Limit)</AlertTitle>
            <strong>Maximum safe masking = Test ear BC + IA of masking transducer</strong><br />
            Supra-aural: BC(TE) + 40 &nbsp;|&nbsp; Insert: BC(TE) + 70<br />
            Exceeding this risks masking noise crossing to the test ear cochlea.
          </Alert>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="subtitle2" gutterBottom>Worked Example (AC Testing)</Typography>
            <Typography variant="body2">
              Test ear: Right AC = 65 dB, Right BC = 20 dB | Non-test ear: Left BC = 10 dB<br />
              &bull; Starting EML = 10 + 10 = <strong>20 dB</strong><br />
              &bull; Max masking (supra-aural) = 20 + 40 = <strong>60 dB</strong><br />
              &bull; Max masking (insert) = 20 + 70 = <strong>90 dB</strong><br />
              &bull; Plateau range (supra-aural): 20&ndash;60 dB (40 dB range)<br />
              &bull; Plateau range (insert): 20&ndash;90 dB (70 dB range &mdash; far wider and safer)
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={pearlSx}>
            <Typography variant="subtitle2" color="info.main" gutterBottom>Clinical Pearl</Typography>
            <Typography variant="body2">
              <strong>What if NTE BC is unknown?</strong> If you have not yet tested bone conduction for the
              non-test ear, use the NTE AC threshold as a conservative estimate. Since BC &le; AC by
              definition, using AC gives a starting EML that is at least as high as the true minimum &mdash;
              you may over-mask slightly, but you will not under-mask. Once BC is available, recalculate.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 6: Step-by-Step Clinical Masking Guide ==== */}
      <Accordion expanded={expanded === 'stepbystep'} onChange={toggle('stepbystep')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>6. Step-by-Step Clinical Masking Guide</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* --- Step A: Initial Masking Level --- */}
          <Typography variant="h6" gutterBottom sx={{ mt: 1, color: theme.palette.primary.main }}>
            Step A: Calculate the Initial Masking Level
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Formula</AlertTitle>
            <strong>AC testing:</strong> Starting EML = NTE BC + 10 dB<br />
            <strong>BC testing:</strong> Starting EML = NTE BC + Occlusion Effect + 10 dB
          </Alert>
          <Box component="ol" sx={{ pl: 2, mb: 2, '& li': { mb: 1 } }}>
            <li><Typography variant="body2">
              <strong>Look up the non-test ear BC threshold</strong> at the frequency you are testing.
              This value represents the cochlear sensitivity of the ear you need to mask.
            </Typography></li>
            <li><Typography variant="body2">
              <strong>Add the 10 dB safety factor.</strong> This ensures the noise exceeds the cochlear
              threshold with a comfortable margin. The 10 dB convention accounts for test&ndash;retest
              variability (&plusmn;5 dB) and the central masking effect (~5 dB).
            </Typography></li>
            <li><Typography variant="body2">
              <strong>For BC testing only:</strong> add the occlusion effect (OE) for supra-aural
              headphones at 250, 500, and 1000 Hz. Insert earphones with deep insertion have OE = 0 dB.
            </Typography></li>
            <li><Typography variant="body2">
              <strong>Set the masking dial</strong> on the audiometer to the calculated starting EML.
              Use narrowband noise (NBN) centered at the test frequency.
            </Typography></li>
          </Box>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="subtitle2" gutterBottom>Example: AC at 1000 Hz</Typography>
            <Typography variant="body2">
              NTE BC at 1000 Hz = 15 dB HL<br />
              Starting EML = 15 + 10 = <strong>25 dB EML</strong><br />
              &rarr; Set the masking dial to 25 dB of narrowband noise at 1000 Hz.
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="subtitle2" gutterBottom>Example: BC at 500 Hz with Supra-aural Masking</Typography>
            <Typography variant="body2">
              NTE BC at 500 Hz = 10 dB HL, OE at 500 Hz (supra-aural) = 15 dB<br />
              Starting EML = 10 + 15 + 10 = <strong>35 dB EML</strong>
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={pearlSx}>
            <Typography variant="subtitle2" color="info.main" gutterBottom>What If NTE BC Is Not Yet Known?</Typography>
            <Typography variant="body2">
              If you have not tested NTE bone conduction yet, use the NTE AC threshold as a starting estimate.
              Since AC &ge; BC always, this gives a starting EML that is equal to or higher than the true minimum.
              Once you obtain NTE BC, recalculate. Alternatively, test NTE BC first before masking.
            </Typography>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* --- Step B: Presenting Masking --- */}
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Step B: Present Masking and Re-Test
          </Typography>
          <Box component="ol" sx={{ pl: 2, mb: 2, '& li': { mb: 1 } }}>
            <li><Typography variant="body2">
              <strong>Turn on the masking noise</strong> to the non-test ear at the calculated starting EML.
              Always use <strong>narrowband noise (NBN)</strong> for pure tone audiometry &mdash; not white
              noise or speech noise.
            </Typography></li>
            <li><Typography variant="body2">
              <strong>Re-test the test ear threshold</strong> using the standard bracketing method
              (down 10, up 5) with the masking noise continuously present in the non-test ear.
            </Typography></li>
            <li><Typography variant="body2">
              <strong>Record this threshold</strong> as the masked threshold at this masking level.
              This is your first data point for the plateau search.
            </Typography></li>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* --- Step C: Maximum Masking Level --- */}
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Step C: Know Your Maximum Masking Level
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Why Max Masking Exists</AlertTitle>
            <strong>Over-masking</strong> occurs when the masking noise is so loud that it crosses the skull
            via bone conduction and reaches the <em>test ear</em> cochlea. When this happens, the masking
            noise itself becomes a signal in the test ear, artificially elevating the threshold. You then
            record a threshold that is <strong>worse than the patient&apos;s actual hearing</strong>.
          </Alert>
          <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
            <AlertTitle>Max Masking Formula</AlertTitle>
            <strong>Maximum masking = Test ear BC + IA of masking transducer</strong><br />
            &bull; Supra-aural: TE BC + 40 dB<br />
            &bull; Insert: TE BC + 70 dB
          </Alert>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="subtitle2" gutterBottom>Worked Example</Typography>
            <Typography variant="body2">
              Test ear BC = 25 dB | Non-test ear BC = 10 dB<br />
              &bull; Starting EML = 10 + 10 = 20 dB<br />
              &bull; Max masking (supra-aural) = 25 + 40 = <strong>65 dB</strong><br />
              &bull; Max masking (insert) = 25 + 70 = <strong>95 dB</strong><br /><br />
              If you dial above 65 dB of masking with supra-aural headphones, the noise
              (65 &minus; 40 = 25 dB at the test ear cochlea) starts to mask the test ear itself.
              With inserts, you can safely go up to 95 dB.
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={mistakeSx}>
            <Typography variant="subtitle2" color="error.main" gutterBottom>Real Consequence of Over-Masking</Typography>
            <Typography variant="body2">
              If a patient&apos;s true test ear threshold is 30 dB but you over-mask and record 50 dB,
              you have artificially worsened the result by 20 dB. This could lead to an incorrect diagnosis
              of sensorineural hearing loss, unnecessary hearing aid recommendation, or inappropriate treatment.
            </Typography>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* --- Step D: Hood Plateau Method --- */}
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Step D: Find the Plateau (Hood Method)
          </Typography>
          <Typography variant="body2" paragraph>
            The Hood (1960) plateau method is the gold standard for determining true masked thresholds.
            You systematically increase masking and watch for a stable threshold.
          </Typography>
          <Box component="ol" sx={{ pl: 2, mb: 2, '& li': { mb: 1 } }}>
            <li><Typography variant="body2">
              Start at the <strong>initial EML</strong> calculated in Step A.
            </Typography></li>
            <li><Typography variant="body2">
              <strong>Increase masking by 10 dB.</strong> Re-test the threshold each time.
            </Typography></li>
            <li><Typography variant="body2">
              <strong>Look for the plateau:</strong> the threshold stays stable across at least
              <strong> 2 consecutive 10 dB increases</strong> (a plateau spanning &ge; 20 dB of masking).
            </Typography></li>
            <li><Typography variant="body2">
              The <strong>stable threshold</strong> on the plateau is the true masked threshold. Record this.
            </Typography></li>
            <li><Typography variant="body2">
              <strong>Stop increasing</strong> once you find the plateau or approach the maximum masking level.
            </Typography></li>
          </Box>

          <Typography variant="subtitle2" gutterBottom>Plateau Demonstration: Numerical Example</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Patient: Right AC = 65 dB (test ear), Left BC = 5 dB (non-test ear). Supra-aural headphones.
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Masking Level</strong></TableCell>
                  <TableCell align="center"><strong>Threshold Obtained</strong></TableCell>
                  <TableCell><strong>Interpretation</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Unmasked</TableCell>
                  <TableCell align="center">25 dB</TableCell>
                  <TableCell><em>Possibly a shadow curve</em></TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
                  <TableCell>15 dB (starting EML)</TableCell>
                  <TableCell align="center">30 dB</TableCell>
                  <TableCell>Undermasking &mdash; threshold shifted 5 dB</TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
                  <TableCell>25 dB</TableCell>
                  <TableCell align="center">40 dB</TableCell>
                  <TableCell>Undermasking &mdash; still shifting</TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
                  <TableCell>35 dB</TableCell>
                  <TableCell align="center">45 dB</TableCell>
                  <TableCell>Undermasking &mdash; still shifting</TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.12) }}>
                  <TableCell><strong>45 dB</strong></TableCell>
                  <TableCell align="center"><strong>50 dB</strong></TableCell>
                  <TableCell><strong>Plateau begins</strong></TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.12) }}>
                  <TableCell><strong>55 dB</strong></TableCell>
                  <TableCell align="center"><strong>50 dB</strong></TableCell>
                  <TableCell><strong>Plateau holds (+10 masking, 0 shift)</strong></TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.12) }}>
                  <TableCell><strong>65 dB</strong></TableCell>
                  <TableCell align="center"><strong>50 dB</strong></TableCell>
                  <TableCell><strong>Plateau confirmed! TRUE threshold = 50 dB</strong></TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.error.main, 0.08) }}>
                  <TableCell>75 dB</TableCell>
                  <TableCell align="center">60 dB</TableCell>
                  <TableCell>Over-masking begins &mdash; 1:1 shift (stop here!)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Reading the Plateau Table</AlertTitle>
            <Typography variant="body2">
              &bull; <strong>Undermasking (rows 2&ndash;4):</strong> Each 10 dB masking increase shifts the
              threshold &mdash; the NTE cochlea is still participating.<br />
              &bull; <strong>Plateau (rows 5&ndash;7):</strong> Threshold stays at 50 dB across 20 dB of
              masking increases (45 &rarr; 55 &rarr; 65). The NTE is now fully masked; only the test ear
              responds. <strong>50 dB is the true threshold.</strong><br />
              &bull; <strong>Over-masking (row 8):</strong> The 1:1 shift (masking +10, threshold +10) signals
              that noise is crossing to the test ear cochlea. Stop immediately.
            </Typography>
          </Alert>

          <Paper variant="outlined" sx={pearlSx}>
            <Typography variant="subtitle2" color="info.main" gutterBottom>Clinical Pearl &mdash; Exam Tip</Typography>
            <Typography variant="body2">
              If the threshold <strong>keeps rising</strong> at every masking step with no plateau, two
              possibilities: (1) you are already over-masking from the start (check your calculations), or
              (2) the initial unmasked threshold was entirely a shadow curve and the true threshold is beyond
              the audiometer&apos;s output limits.
            </Typography>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* --- Step E: The Masking Dilemma --- */}
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Step E: Recognizing and Resolving the Masking Dilemma
          </Typography>
          <Typography variant="body2" paragraph>
            The <strong>masking dilemma</strong> occurs when the minimum effective masking level exceeds the
            maximum safe masking level. You cannot mask without over-masking &mdash; there is no usable
            plateau.
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.warning.main, 0.06) }}>
            <Typography variant="subtitle2" gutterBottom>Masking Dilemma Example: Bilateral Conductive Loss, BC Testing at 500 Hz</Typography>
            <Typography variant="body2" paragraph>
              Right ear: AC = 70 dB, BC = 10 dB (test ear) | Left ear: AC = 75 dB, BC = 15 dB (non-test ear)<br />
              Both ears have large air-bone gaps (~60 dB) &mdash; masking is required for BC.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>With supra-aural headphones:</strong><br />
              &bull; Starting EML = NTE BC + OE + 10 = 15 + 15 + 10 = <strong>40 dB</strong><br />
              &bull; Max masking = TE BC + IA = 10 + 40 = <strong>50 dB</strong><br />
              &bull; Plateau range: 40&ndash;50 dB = only 10 dB &mdash; <strong>practically impossible</strong> to
              find a reliable plateau in 10 dB.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>With insert earphones (problem solved!):</strong><br />
              &bull; Starting EML = NTE BC + OE + 10 = 15 + 0 + 10 = <strong>25 dB</strong> (no OE with inserts)<br />
              &bull; Max masking = TE BC + IA = 10 + 70 = <strong>80 dB</strong><br />
              &bull; Plateau range: 25&ndash;80 dB = <strong>55 dB range</strong> &mdash; comfortable plateau search!
            </Typography>
            <Alert severity="success" variant="outlined">
              Insert earphones resolved this dilemma by: (1) eliminating the occlusion effect (saving 15 dB), and
              (2) providing 30 dB more IA (raising the max from 50 to 80 dB). Combined: the plateau grew from
              10 dB to 55 dB.
            </Alert>
          </Paper>
          <Typography variant="body2" paragraph>
            <strong>When insert earphones cannot resolve the dilemma:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2, '& li': { mb: 0.5 } }}>
            <li><Typography variant="body2">Report the unmasked threshold with the notation &quot;NM&quot; (not masked) or &quot;CNT&quot; (could not test).</Typography></li>
            <li><Typography variant="body2">Document that a masking dilemma was present.</Typography></li>
            <li><Typography variant="body2">Consider bone-anchored hearing device assessment or ABR for frequency-specific threshold estimation.</Typography></li>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 7: Over-Masking, Under-Masking Summary ==== */}
      <Accordion expanded={expanded === 'errors'} onChange={toggle('errors')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>7. Over-Masking, Under-Masking &amp; Central Masking</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderLeft: `4px solid ${theme.palette.warning.main}` }}>
              <Typography variant="subtitle2" color="warning.main">Under-Masking</Typography>
              <Typography variant="body2" paragraph>
                Masking noise is insufficient &mdash; the non-test ear cochlea still responds to the test
                signal. The recorded &quot;threshold&quot; is a shadow curve, not the test ear&apos;s true threshold.
              </Typography>
              <Typography variant="body2">
                <strong>How to detect:</strong> On the plateau search, the threshold shifts with each masking
                increase. <strong>Fix:</strong> Continue increasing masking (you have not reached the plateau yet).
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderLeft: `4px solid ${theme.palette.error.main}` }}>
              <Typography variant="subtitle2" color="error.main">Over-Masking</Typography>
              <Typography variant="body2" paragraph>
                Masking noise crosses the skull via bone conduction and reaches the test ear cochlea,
                artificially elevating the test ear threshold. Occurs when masking level exceeds
                test ear BC + IA.
              </Typography>
              <Typography variant="body2">
                <strong>Hallmark:</strong> 1:1 relationship &mdash; every 10 dB masking increase raises the
                threshold by 10 dB. <strong>Fix:</strong> Stop immediately. The last plateau value (before the
                1:1 shift) is the true threshold.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderLeft: `4px solid ${theme.palette.grey[500]}` }}>
              <Typography variant="subtitle2">Central Masking Effect</Typography>
              <Typography variant="body2">
                Presenting masking noise near the cochlear threshold can cause a <strong>5 dB threshold
                elevation</strong> even without acoustic crossover. This is a normal neural phenomenon
                at the level of the brainstem, not over-masking. It is why the true masked threshold may
                be 5 dB higher than the unmasked threshold even when no cross-hearing existed. The 10 dB
                safety factor already accounts for this.
              </Typography>
            </Paper>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 8: Occlusion Effect ==== */}
      <Accordion expanded={expanded === 'oe'} onChange={toggle('oe')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>8. Occlusion Effect</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            When earphones are placed over the ear for masking delivery during BC testing, occluding the
            ear canal enhances low-frequency bone-conducted sound at that cochlea. This means the non-test
            ear receives a louder BC signal, requiring additional masking noise to compensate.
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Frequency</strong></TableCell>
                  <TableCell align="center"><strong>Supra-aural OE (dB)</strong></TableCell>
                  <TableCell align="center"><strong>Insert OE (dB)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>250 Hz</TableCell><TableCell align="center">15</TableCell><TableCell align="center">0</TableCell></TableRow>
                <TableRow><TableCell>500 Hz</TableCell><TableCell align="center">15</TableCell><TableCell align="center">0</TableCell></TableRow>
                <TableRow><TableCell>1000 Hz</TableCell><TableCell align="center">10</TableCell><TableCell align="center">0</TableCell></TableRow>
                <TableRow><TableCell>&ge; 2000 Hz</TableCell><TableCell align="center">0</TableCell><TableCell align="center">0</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Alert severity="success" variant="outlined">
            Deep insertion of insert earphones effectively eliminates the occlusion effect &mdash; another
            major advantage of insert earphones for masking during BC testing.
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 9: Clinical Pearls & Common Student Mistakes ==== */}
      <Accordion expanded={expanded === 'pearls'} onChange={toggle('pearls')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>9. Clinical Pearls &amp; Common Student Mistakes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.error.main }}>
            Common Mistakes
          </Typography>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Paper variant="outlined" sx={mistakeSx}>
              <Typography variant="body2">
                <strong>Mistake:</strong> Comparing two AC thresholds to decide if masking is needed.<br />
                <strong>Correct:</strong> Compare test ear AC to non-test ear <em>BC</em>. Cross-hearing is
                a bone conduction phenomenon (see Section 4).
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={mistakeSx}>
              <Typography variant="body2">
                <strong>Mistake:</strong> Using white noise for masking during pure tone audiometry.<br />
                <strong>Correct:</strong> Use narrow-band noise (NBN) centered at the test frequency.
                White noise spreads energy across all frequencies, requiring more total intensity and
                increasing the risk of over-masking.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={mistakeSx}>
              <Typography variant="body2">
                <strong>Mistake:</strong> Assuming the same IA for supra-aural and insert earphones.<br />
                <strong>Correct:</strong> Insert earphones have IA of 70 dB (vs 40 dB for supra-aural).
                This 30 dB difference is clinically significant and changes masking decisions.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={mistakeSx}>
              <Typography variant="body2">
                <strong>Mistake:</strong> Forgetting the occlusion effect for BC masking at low frequencies.<br />
                <strong>Correct:</strong> Add OE to starting EML at 250, 500, and 1000 Hz with supra-aural.
                Insert earphones (deep insertion) eliminate this requirement.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={mistakeSx}>
              <Typography variant="body2">
                <strong>Mistake:</strong> Stopping the plateau search after one stable measurement.<br />
                <strong>Correct:</strong> You need at least 2 consecutive 10 dB masking increases with no
                threshold change (a 20+ dB plateau) to confirm the true threshold.
              </Typography>
            </Paper>
          </Stack>

          <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.info.main }}>
            Clinical Pearls for Exams
          </Typography>
          <Stack spacing={1}>
            <Paper variant="outlined" sx={pearlSx}>
              <Typography variant="body2">
                <strong>Pearl:</strong> Always mask for bone conduction unless both ears have symmetric
                thresholds with no air-bone gap. This situation is uncommon in clinical practice.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={pearlSx}>
              <Typography variant="body2">
                <strong>Pearl:</strong> Masking is always delivered to the <strong>non-test ear</strong>.
                If you are testing the right ear, masking goes in the left ear. Never mask the test ear.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={pearlSx}>
              <Typography variant="body2">
                <strong>Pearl:</strong> When in doubt, mask. Under-masking (failing to mask when needed) is a
                more serious clinical error than masking unnecessarily, because it produces incorrect
                thresholds on the audiogram.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={pearlSx}>
              <Typography variant="body2">
                <strong>Pearl:</strong> If a patient has bilateral conductive hearing loss, expect masking
                challenges. Switch to insert earphones preemptively to gain the most plateau room.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={pearlSx}>
              <Typography variant="body2">
                <strong>Pearl:</strong> The insert earphone IA of 70 dB is used on board exams (Praxis,
                ABA). Some programs teach 55 dB as a conservative floor. Know which value your program
                expects and be able to justify either.
              </Typography>
            </Paper>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* ==== Section 10: References ==== */}
      <Accordion expanded={expanded === 'references'} onChange={toggle('references')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>10. Evidence-Based References</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            The masking procedures, IA values, and formulas in this module are based on the following
            peer-reviewed and textbook sources:
          </Typography>
          <Box component="ol" sx={{ pl: 2, '& li': { mb: 1.5 } }}>
            <li>
              <Typography variant="body2">
                <strong>Hood JD</strong> (1960). The principles and practice of bone conduction audiometry: A review
                of the present position. <em>The Laryngoscope</em>, 70, 1211&ndash;1228.
                &mdash; Established the plateau method as the clinical standard for masked threshold determination.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Sklare DA, Denenberg LJ</strong> (1987). Interaural attenuation for Tubephone insert
                earphones. <em>Ear and Hearing</em>, 8(5), 298&ndash;300.
                &mdash; Measured insert earphone IA range of 55&ndash;79 dB, establishing the evidence base for
                the 70 dB clinical standard.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Katz J</strong> (Ed.). <em>Handbook of Clinical Audiology</em>, 7th ed. Philadelphia:
                Lippincott Williams &amp; Wilkins.
                &mdash; Standard audiology textbook; uses 70 dB IA for insert earphones and 40 dB for supra-aural.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>Martin FN, Clark JG</strong>. <em>Introduction to Audiology</em>, 13th ed. Boston: Pearson.
                &mdash; Widely used in AuD programs; comprehensive masking chapter using 70 dB insert IA.
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>American Speech-Language-Hearing Association (ASHA)</strong>. Guidelines for Manual
                Pure-Tone Threshold Audiometry.
                &mdash; Professional practice guidelines defining when and how to apply clinical masking.
              </Typography>
            </li>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

// ---------------------------------------------------------------------------
// Audiogram table component
// ---------------------------------------------------------------------------

const AudiogramTable: React.FC<{ scenario: MaskingScenario }> = ({ scenario }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fmt = (v: number | null) => (v !== null ? `${v}` : '--');

  const rows = [
    { label: 'Right AC', values: scenario.rightAC, ear: 'right' as Ear, isAC: true },
    { label: 'Right BC', values: scenario.rightBC, ear: 'right' as Ear, isAC: false },
    { label: 'Left AC',  values: scenario.leftAC,  ear: 'left' as Ear, isAC: true },
    { label: 'Left BC',  values: scenario.leftBC,  ear: 'left' as Ear, isAC: false },
  ];

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Ear / Type</strong></TableCell>
            {SCENARIO_FREQUENCIES.map((f) => (
              <TableCell key={f} align="center" sx={{
                fontWeight: f === scenario.frequency ? 700 : 400,
                bgcolor: f === scenario.frequency ? alpha(theme.palette.warning.main, 0.1) : undefined,
              }}>
                {f >= 1000 ? `${f / 1000}k` : f} Hz
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ label, values, ear, isAC }) => {
            const isTestEarRow = ear === scenario.testEar;
            const isTargetRow = isTestEarRow && ((scenario.testType === 'air') === isAC);
            return (
              <TableRow key={label} sx={{
                bgcolor: isTestEarRow ? alpha(theme.palette.primary.main, 0.05) : undefined,
              }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{
                      width: 10, height: 10, borderRadius: '50%',
                      bgcolor: isAC ? (ear === 'right' ? theme.palette.error.main : theme.palette.info.main) : 'transparent',
                      border: !isAC ? `2px solid ${ear === 'right' ? theme.palette.error.main : theme.palette.info.main}` : undefined,
                    }} />
                    <Typography variant="body2" fontWeight={isTargetRow ? 700 : 400}>{label}</Typography>
                  </Box>
                </TableCell>
                {SCENARIO_FREQUENCIES.map((f) => (
                  <TableCell key={f} align="center" sx={{
                    fontWeight: f === scenario.frequency && isTargetRow ? 700 : 400,
                    bgcolor: f === scenario.frequency && isTargetRow
                      ? alpha(theme.palette.warning.main, 0.15) : undefined,
                  }}>
                    {f === scenario.frequency ? fmt(values) : '--'}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const MaskingPracticePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [scenarios, setScenarios] = useState<MaskingScenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ScenarioAnswer[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadScenarios = useCallback(() => {
    setLoading(true);
    const patients = patientService.getAllPatients();
    const selected = selectBalancedScenarios(generateScenarios(patients), SCENARIOS_PER_SESSION);
    setScenarios(selected);
    setAnswers(selected.map(() => emptyAnswer()));
    setCurrentIndex(0);
    setPracticeComplete(false);
    setLoading(false);
  }, []);

  useEffect(() => { loadScenarios(); }, [loadScenarios]);

  const scenario = scenarios[currentIndex] ?? null;
  const answer = answers[currentIndex] ?? null;

  const score = useMemo(() => {
    const sub = answers.filter((a) => a.submitted);
    return { total: sub.length, correct: sub.filter((a) => a.correct).length };
  }, [answers]);

  const progress = scenarios.length > 0
    ? ((currentIndex + (answer?.submitted ? 1 : 0)) / scenarios.length) * 100 : 0;

  const updateAnswer = useCallback((u: Partial<ScenarioAnswer>) => {
    setAnswers((prev) => { const n = [...prev]; n[currentIndex] = { ...n[currentIndex], ...u }; return n; });
  }, [currentIndex]);

  const canSubmit = useMemo(() => {
    if (!answer || answer.submitted || answer.maskingRequired === null) return false;
    if (answer.maskingRequired && (!answer.maskingEar || !answer.startingEML.trim())) return false;
    return true;
  }, [answer]);

  const handleSubmit = useCallback(() => {
    if (!scenario || !answer) return;
    let correct = answer.maskingRequired === scenario.correctMaskingRequired;
    if (scenario.correctMaskingRequired && answer.maskingRequired) {
      if (answer.maskingEar !== 'non-test') correct = false;
      if (scenario.correctStartingEML !== null) {
        const v = parseFloat(answer.startingEML);
        if (isNaN(v) || Math.abs(v - scenario.correctStartingEML) > 5) correct = false;
      }
    }
    updateAnswer({ submitted: true, correct });
  }, [scenario, answer, updateAnswer]);

  const saveResults = useCallback(() => {
    const details = answers.map((a, i) => ({
      patientName: scenarios[i]?.patientName ?? '',
      frequency: scenarios[i]?.frequency ?? 0,
      testEar: scenarios[i]?.testEar ?? '',
      testType: scenarios[i]?.testType ?? '',
      transducer: scenarios[i]?.transducer ?? '',
      correct: a.correct,
    }));
    const correctCount = details.filter((d) => d.correct).length;
    const results: PracticeResults = {
      date: new Date().toISOString(),
      totalScenarios: scenarios.length,
      correctAnswers: correctCount,
      accuracy: scenarios.length > 0 ? Math.round((correctCount / scenarios.length) * 100) : 0,
      scenarioDetails: details,
    };
    try {
      const prev = JSON.parse(localStorage.getItem('maskingPracticeResults') ?? '[]') as PracticeResults[];
      prev.push(results);
      localStorage.setItem('maskingPracticeResults', JSON.stringify(prev));
    } catch {
      localStorage.setItem('maskingPracticeResults', JSON.stringify([results]));
    }
  }, [answers, scenarios]);

  const handleNext = useCallback(() => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      setPracticeComplete(true);
      saveResults();
    }
  }, [currentIndex, scenarios.length, saveResults]);

  const handleRestart = useCallback(() => {
    setShowIntro(false);
    setPracticeStarted(true);
    setPracticeComplete(false);
    loadScenarios();
  }, [loadScenarios]);

  // ---------------------------------------------------------------------------
  // Render: results
  // ---------------------------------------------------------------------------

  if (practiceComplete) {
    const correctCount = answers.filter((a) => a.correct).length;
    const accuracy = scenarios.length > 0 ? Math.round((correctCount / scenarios.length) * 100) : 0;
    const grade = accuracy >= 90 ? 'Excellent' : accuracy >= 70 ? 'Good' : accuracy >= 50 ? 'Needs Improvement' : 'Review Material';
    const gradeColor = accuracy >= 90 ? 'success' : accuracy >= 70 ? 'primary' : accuracy >= 50 ? 'warning' : 'error';

    // Category breakdown
    const byCategory: Record<string, { total: number; correct: number }> = {};
    scenarios.forEach((s, i) => {
      const key = `${s.testType === 'air' ? 'AC' : 'BC'} / ${TRANSDUCER_LABELS[s.transducer]}`;
      if (!byCategory[key]) byCategory[key] = { total: 0, correct: 0 };
      byCategory[key].total++;
      if (answers[i]?.correct) byCategory[key].correct++;
    });

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: isMobile ? 2 : 4 }}>
          <Typography variant="h4" gutterBottom align="center">Practice Complete</Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center', my: 3 }}>
            <Typography variant="h2" color={accuracy >= 70 ? 'success.main' : 'error.main'}>{accuracy}%</Typography>
            <Typography variant="h6" color="text.secondary">{correctCount} / {scenarios.length} correct</Typography>
            <Chip label={grade} color={gradeColor} sx={{ mt: 1, fontWeight: 600 }} />
          </Box>

          {/* Category breakdown */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Performance by Category</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Accuracy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(byCategory).map(([key, v]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell align="center">{v.correct}/{v.total}</TableCell>
                    <TableCell align="center">{v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Scenario list */}
          <Typography variant="h6" gutterBottom>Scenario Breakdown</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Test</TableCell>
                  <TableCell>Transducer</TableCell>
                  <TableCell align="center">Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scenarios.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{s.patientName}</TableCell>
                    <TableCell>{s.testEar === 'right' ? 'R' : 'L'} {s.testType.toUpperCase()} @ {s.frequency} Hz</TableCell>
                    <TableCell>{s.transducer === 'supraaural' ? 'Supra-aural' : 'Insert'}</TableCell>
                    <TableCell align="center">
                      {answers[i]?.correct ? <CheckCircle color="success" fontSize="small" /> : <Cancel color="error" fontSize="small" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" startIcon={<Replay />} onClick={handleRestart}>Practice Again</Button>
            <Button variant="outlined" onClick={() => { setShowIntro(true); setPracticeStarted(false); setPracticeComplete(false); }}>Review Material</Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: intro + practice
  // ---------------------------------------------------------------------------

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <HearingOutlined fontSize="large" color="primary" />
          <Typography variant="h4" component="h1">Masking Practice</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Learn when and how to apply clinical masking during audiometric testing.
          Scenarios include both supra-aural and insert earphone transducers.
        </Typography>
      </Box>

      {showIntro && (
        <>
          <EducationalIntro />
          {!practiceStarted && (
            <Box sx={{ textAlign: 'center', mt: 2, mb: 3 }}>
              <Button variant="contained" size="large" startIcon={<NavigateNext />}
                onClick={() => { setShowIntro(false); setPracticeStarted(true); }}
                disabled={loading || scenarios.length === 0}>
                Start Practice ({scenarios.length} Scenarios)
              </Button>
            </Box>
          )}
        </>
      )}

      {practiceStarted && !practiceComplete && scenario && answer && (
        <>
          {/* Progress */}
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Scenario {currentIndex + 1} of {scenarios.length}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip icon={<CheckCircle />} label={`${score.correct} correct`} color="success" size="small" variant="outlined" />
                <Chip label={`${score.total - score.correct} incorrect`} color="error" size="small" variant="outlined" />
              </Stack>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Paper>

          {/* Scenario */}
          <Paper elevation={2} sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>Patient: {scenario.patientName}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`Test ear: ${scenario.testEar === 'right' ? 'Right' : 'Left'}`}
                  color={scenario.testEar === 'right' ? 'error' : 'info'} size="small" />
                <Chip label={scenario.testType === 'air' ? 'Air Conduction' : 'Bone Conduction'} size="small" variant="outlined" />
                <Chip label={`${scenario.frequency} Hz`} size="small" variant="outlined" />
                <Chip
                  label={scenario.testType === 'air'
                    ? TRANSDUCER_LABELS[scenario.transducer]
                    : `Masking via ${TRANSDUCER_LABELS[scenario.transducer].toLowerCase()}`
                  }
                  size="small" variant="outlined"
                  color={scenario.transducer === 'insert' ? 'success' : 'default'}
                />
              </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Review the thresholds at {scenario.frequency} Hz below. The highlighted cell is under evaluation.
              {scenario.testType === 'air'
                ? ` IA for ${TRANSDUCER_LABELS[scenario.transducer].toLowerCase()} = ${INTERAURAL_ATTENUATION[scenario.transducer]} dB.`
                : ' IA for bone conduction = 0 dB.'}
            </Typography>

            <AudiogramTable scenario={scenario} />
            <Divider sx={{ my: 2 }} />

            {/* Q1: masking required? */}
            <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                1. Is masking required for {scenario.testEar === 'right' ? 'right' : 'left'} ear{' '}
                {scenario.testType === 'air' ? 'air conduction' : 'bone conduction'} at {scenario.frequency} Hz
                {scenario.testType === 'air' ? ` with ${TRANSDUCER_LABELS[scenario.transducer].toLowerCase()}` : ''}?
              </FormLabel>
              <RadioGroup row
                value={answer.maskingRequired === null ? '' : answer.maskingRequired ? 'yes' : 'no'}
                onChange={(e) => {
                  const yes = e.target.value === 'yes';
                  updateAnswer({ maskingRequired: yes, ...(yes ? {} : { maskingEar: null, startingEML: '' }) });
                }}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" disabled={answer.submitted} />
                <FormControlLabel value="no" control={<Radio />} label="No" disabled={answer.submitted} />
              </RadioGroup>
            </FormControl>

            {/* Conditional follow-ups */}
            {answer.maskingRequired && (
              <>
                <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                    2. Which ear should receive the masking noise?
                  </FormLabel>
                  <RadioGroup row value={answer.maskingEar ?? ''}
                    onChange={(e) => updateAnswer({ maskingEar: e.target.value })}>
                    <FormControlLabel value="test" control={<Radio />} label="Test ear" disabled={answer.submitted} />
                    <FormControlLabel value="non-test" control={<Radio />} label="Non-test ear" disabled={answer.submitted} />
                  </RadioGroup>
                </FormControl>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                    3. What is the starting effective masking level? (dB)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {scenario.testType === 'air'
                      ? 'Formula: Non-test ear BC + 10 dB'
                      : `Formula: Non-test ear BC + OE (${getOE(scenario.transducer, scenario.frequency)} dB) + 10 dB`}
                  </Typography>
                  <TextField type="number" value={answer.startingEML}
                    onChange={(e) => updateAnswer({ startingEML: e.target.value })}
                    disabled={answer.submitted} size="small" placeholder="Enter dB value"
                    label="Starting EML (dB)"
                    slotProps={{ htmlInput: { min: -10, max: 120, step: 5, 'aria-label': 'Starting effective masking level in decibels' } }}
                    sx={{ width: 200 }} />
                </Box>
              </>
            )}

            {/* Submit */}
            {!answer.submitted && (
              <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>Submit Answer</Button>
            )}

            {/* Feedback */}
            {answer.submitted && (
              <Box sx={{ mt: 2 }}>
                <Alert severity={answer.correct ? 'success' : 'error'} sx={{ mb: 2 }}>
                  <AlertTitle>{answer.correct ? 'Correct!' : 'Incorrect'}</AlertTitle>
                  {!answer.correct && (
                    <Box component="ul" sx={{ pl: 2, mb: 1 }}>
                      {answer.maskingRequired !== scenario.correctMaskingRequired && (
                        <li>Masking {scenario.correctMaskingRequired ? 'IS' : 'is NOT'} required in this scenario.</li>
                      )}
                      {scenario.correctMaskingRequired && answer.maskingRequired && answer.maskingEar !== 'non-test' && (
                        <li>Masking noise should always be delivered to the <strong>non-test ear</strong>.</li>
                      )}
                      {scenario.correctMaskingRequired && answer.maskingRequired && scenario.correctStartingEML !== null && (() => {
                        const v = parseFloat(answer.startingEML);
                        return (isNaN(v) || Math.abs(v - scenario.correctStartingEML) > 5)
                          ? <li>Starting EML = <strong>{scenario.correctStartingEML} dB</strong>.</li>
                          : null;
                      })()}
                    </Box>
                  )}
                  <Typography variant="body2">{scenario.explanation}</Typography>
                </Alert>

                {/* Clinical note */}
                {scenario.clinicalNote && (
                  <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                    <AlertTitle>Clinical Note</AlertTitle>
                    {scenario.clinicalNote}
                  </Alert>
                )}

                {/* Max masking info (shown for all masking-required scenarios) */}
                {scenario.correctMaskingRequired && scenario.correctMaxMasking !== null && scenario.correctStartingEML !== null && (
                  <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                    <AlertTitle>Masking Plateau Range</AlertTitle>
                    Minimum (starting EML): <strong>{scenario.correctStartingEML} dB</strong> &nbsp;|&nbsp;
                    Maximum (overmasking limit): <strong>{scenario.correctMaxMasking} dB</strong><br />
                    Plateau width: <strong>{scenario.correctMaxMasking - scenario.correctStartingEML} dB</strong>
                    {scenario.correctMaxMasking - scenario.correctStartingEML < 15 && (
                      <> &mdash; <strong>Very narrow plateau!</strong> Risk of masking dilemma.</>
                    )}
                    {scenario.correctStartingEML > scenario.correctMaxMasking && (
                      <> &mdash; <strong>Masking dilemma:</strong> minimum exceeds maximum.</>
                    )}
                  </Alert>
                )}

                <Button variant="contained" endIcon={currentIndex < scenarios.length - 1 ? <NavigateNext /> : undefined}
                  onClick={handleNext}>
                  {currentIndex < scenarios.length - 1 ? 'Next Scenario' : 'Review Results'}
                </Button>
              </Box>
            )}
          </Paper>

          {!showIntro && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Button variant="text" size="small" startIcon={<School />} onClick={() => setShowIntro(true)}>
                Show Educational Reference
              </Button>
            </Box>
          )}
        </>
      )}

      {practiceStarted && !practiceComplete && scenarios.length === 0 && !loading && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No scenarios could be generated from the available patient data.
        </Alert>
      )}
    </Container>
  );
};

export default MaskingPracticePage;
