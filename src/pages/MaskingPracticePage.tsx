import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Container, Typography, Paper, Button, RadioGroup, Radio,
  FormControlLabel, FormControl, FormLabel, TextField, Alert, AlertTitle,
  LinearProgress, Chip, Divider, Accordion, AccordionSummary,
  AccordionDetails, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Stack, useMediaQuery,
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
  insert: 55,       // ER-3A insert earphones (range 55-70, use 55)
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
                clinicalNote = `Insert earphones (IA = 55 dB) would eliminate the need for masking here (${diff} dB < 55 dB).`;
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

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <School color="primary" />
        <Typography variant="h5" component="h2">Clinical Masking in Audiometry</Typography>
      </Box>
      <Typography variant="body1" paragraph>
        Masking ensures thresholds represent the test ear, not the non-test ear responding via
        cross-hearing. It is one of the most critical &mdash; and most commonly tested &mdash; clinical
        skills in audiology.
      </Typography>

      {/* ---- Section 1: Why Masking Is Needed ---- */}
      <Accordion expanded={expanded === 'why'} onChange={toggle('why')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>Why Masking Is Needed</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Sound can travel across the skull and stimulate the opposite (non-test) cochlea &mdash; this is
            called <strong>cross-hearing</strong>. The minimum intensity at which this occurs is the
            <strong> interaural attenuation (IA)</strong>. Without masking, you may unknowingly record the
            better ear&apos;s threshold instead of the test ear&apos;s, producing a <strong>shadow curve</strong>.
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Transducer</strong></TableCell>
                  <TableCell align="center"><strong>Min IA (dB)</strong></TableCell>
                  <TableCell><strong>Clinical Significance</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Supra-aural headphones (TDH-39/49)</TableCell>
                  <TableCell align="center">40</TableCell>
                  <TableCell>Masking needed more often; narrower plateau</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Insert earphones (ER-3A)</TableCell>
                  <TableCell align="center">55</TableCell>
                  <TableCell>Masking needed less often; wider plateau; less OE</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bone oscillator</TableCell>
                  <TableCell align="center">0</TableCell>
                  <TableCell>Sound reaches both cochleae equally</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
            Insert earphones provide 15 dB more IA than supra-aural headphones. This significantly reduces
            masking needs, widens the masking plateau, and reduces the risk of a masking dilemma.
            <strong> Many audiometry trainers incorrectly use 40 dB for both</strong> &mdash; always check
            which transducer is specified.
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* ---- Section 2: When to Mask — AC ---- */}
      <Accordion expanded={expanded === 'ac'} onChange={toggle('ac')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>When to Mask: Air Conduction</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>AC Masking Rule (ASHA)</AlertTitle>
            <strong>Mask when: Test ear AC &minus; Non-test ear BC &ge; IA</strong><br />
            Supra-aural: &ge; 40 dB &nbsp;|&nbsp; Insert: &ge; 55 dB
          </Alert>
          <Typography variant="body2" paragraph>
            <strong>Critical distinction:</strong> Compare AC of the <em>test ear</em> to BC of the
            <em> non-test ear</em>. A common student error is comparing the two AC thresholds &mdash;
            this is incorrect because cross-hearing occurs via bone conduction, not air conduction.
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 1, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="subtitle2" gutterBottom>Worked Example</Typography>
            <Typography variant="body2">
              Patient: Right ear AC = 60 dB, Left ear BC = 15 dB<br />
              Difference = 60 &minus; 15 = 45 dB<br />
              &bull; Supra-aural (IA = 40): 45 &ge; 40 &rarr; <strong>Masking REQUIRED</strong><br />
              &bull; Insert (IA = 55): 45 &lt; 55 &rarr; <strong>Masking NOT required</strong><br />
              <em>Using insert earphones eliminates the need for masking in this case.</em>
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* ---- Section 3: When to Mask — BC ---- */}
      <Accordion expanded={expanded === 'bc'} onChange={toggle('bc')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>When to Mask: Bone Conduction</Typography>
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
          <Typography variant="body2">
            <strong>Rule of thumb:</strong> Almost always mask for bone conduction. The only exception
            is symmetric sensorineural hearing loss with no air-bone gap in either ear &mdash; an uncommon
            clinical scenario.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* ---- Section 4: Effective Masking Level ---- */}
      <Accordion expanded={expanded === 'eml'} onChange={toggle('eml')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>Effective Masking Level (EML)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Starting EML Formulas</AlertTitle>
            <strong>AC testing:</strong> Starting EML = Non-test ear BC + 10 dB (safety factor)<br />
            <strong>BC testing:</strong> Starting EML = Non-test ear BC + Occlusion Effect + 10 dB
          </Alert>
          <Typography variant="body2" paragraph>
            The masking noise must be loud enough at the non-test ear cochlea to prevent it from
            detecting the crossed-over test signal. The 10 dB safety factor ensures adequate masking
            above the cochlear threshold.
          </Typography>
          <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
            <AlertTitle>Maximum Masking (Overmasking Limit)</AlertTitle>
            <strong>Maximum safe masking = Test ear BC + IA of masking transducer</strong><br />
            Supra-aural: BC(TE) + 40 &nbsp;|&nbsp; Insert: BC(TE) + 55<br />
            Exceeding this risks masking noise crossing to the test ear cochlea.
          </Alert>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Typography variant="subtitle2" gutterBottom>Worked Example (AC Testing)</Typography>
            <Typography variant="body2">
              Test ear: Right AC = 65 dB, Right BC = 20 dB | Non-test ear: Left BC = 10 dB<br />
              &bull; Starting EML = 10 + 10 = <strong>20 dB</strong><br />
              &bull; Max masking (supra-aural) = 20 + 40 = <strong>60 dB</strong><br />
              &bull; Max masking (insert) = 20 + 55 = <strong>75 dB</strong><br />
              &bull; Plateau range (supra-aural): 20&ndash;60 dB (40 dB range)<br />
              &bull; Plateau range (insert): 20&ndash;75 dB (55 dB range &mdash; wider, safer)
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* ---- Section 5: Hood Plateau Method ---- */}
      <Accordion expanded={expanded === 'plateau'} onChange={toggle('plateau')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>Hood Plateau Method</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            The Hood (1960) plateau method is the gold standard for clinical masking. It incrementally
            increases masking noise until the test ear threshold stabilises across a range of masking levels.
          </Typography>
          <Box component="ol" sx={{ pl: 2, mb: 2 }}>
            <li><Typography variant="body2" paragraph>
              <strong>Obtain unmasked thresholds</strong> in both ears. Test the better ear first.
            </Typography></li>
            <li><Typography variant="body2" paragraph>
              <strong>Set initial masking level</strong> at starting EML (non-test ear BC + 10 dB for AC;
              add occlusion effect for BC at low frequencies).
            </Typography></li>
            <li><Typography variant="body2" paragraph>
              <strong>Re-establish the test ear threshold</strong> with masking noise present in the non-test ear.
            </Typography></li>
            <li><Typography variant="body2" paragraph>
              <strong>Increase masking in 10 dB steps.</strong> After each increase, re-measure the test ear threshold.
            </Typography></li>
            <li><Typography variant="body2" paragraph>
              <strong>Identify the plateau:</strong> Threshold remains stable across <strong>3 consecutive
              10 dB masking increases</strong>. This stable threshold is the true masked threshold.
            </Typography></li>
          </Box>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Phase</strong></TableCell>
                  <TableCell><strong>What Happens</strong></TableCell>
                  <TableCell><strong>Meaning</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Undermasking</TableCell>
                  <TableCell>Threshold shifts with each masking increase</TableCell>
                  <TableCell>Non-test ear still contributing</TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
                  <TableCell><strong>Plateau</strong></TableCell>
                  <TableCell>Threshold stable across &ge; 3 increases (&ge; 20 dB range)</TableCell>
                  <TableCell><strong>True threshold found</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Overmasking</TableCell>
                  <TableCell>1:1 threshold shift with masking increase</TableCell>
                  <TableCell>Masking noise reaching test ear cochlea</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Alert severity="info" variant="outlined">
            A valid plateau should span at least <strong>20&ndash;30 dB</strong>. A very narrow plateau
            (&lt; 15 dB) or no plateau at all may indicate a masking dilemma.
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* ---- Section 6: Over-Masking, Under-Masking, Masking Dilemma ---- */}
      <Accordion expanded={expanded === 'errors'} onChange={toggle('errors')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>Over-Masking, Under-Masking &amp; the Masking Dilemma</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderLeft: `4px solid ${theme.palette.warning.main}` }}>
              <Typography variant="subtitle2" color="warning.main">Under-Masking</Typography>
              <Typography variant="body2">
                Masking noise is insufficient &mdash; the non-test ear still responds to the test signal.
                The recorded &quot;threshold&quot; is a shadow curve, not the test ear&apos;s true threshold.
                Occurs when masking level &lt; non-test ear BC + 10 dB.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderLeft: `4px solid ${theme.palette.error.main}` }}>
              <Typography variant="subtitle2" color="error.main">Over-Masking</Typography>
              <Typography variant="body2">
                Masking noise is so loud it crosses the skull and reaches the test ear cochlea, artificially
                elevating the test ear threshold. Occurs when masking level &minus; IA &ge; test ear BC.
                Hallmark: 1:1 relationship between masking increase and threshold shift.
              </Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderLeft: `4px solid ${theme.palette.grey[500]}` }}>
              <Typography variant="subtitle2">Masking Dilemma</Typography>
              <Typography variant="body2">
                When minimum effective masking exceeds maximum safe masking, true thresholds cannot be
                determined. Typically occurs in bilateral conductive hearing loss. Insert earphones help
                by providing higher IA, widening the plateau. If the dilemma persists, report unmasked
                thresholds with appropriate notation.
              </Typography>
            </Paper>
            <Alert severity="info" variant="outlined">
              <strong>Central masking effect:</strong> Presenting masking noise near threshold can cause a
              5 dB threshold elevation even without acoustic crossover &mdash; this is a normal neural
              phenomenon, not overmasking.
            </Alert>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* ---- Section 7: Occlusion Effect ---- */}
      <Accordion expanded={expanded === 'oe'} onChange={toggle('oe')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>Occlusion Effect</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            When earphones are placed over the ear for masking delivery during BC testing, occluding the
            ear canal enhances low-frequency bone-conducted sound at that cochlea. This means the non-test
            ear receives a louder BC signal, requiring additional masking noise to compensate.
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
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
            advantage of insert earphones for masking during BC testing.
          </Alert>
        </AccordionDetails>
      </Accordion>

      {/* ---- Section 8: Clinical Pearls ---- */}
      <Accordion expanded={expanded === 'pearls'} onChange={toggle('pearls')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>Clinical Pearls &amp; Common Student Mistakes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            <Alert severity="error" variant="outlined">
              <strong>Mistake:</strong> Comparing two AC thresholds to decide if masking is needed.<br />
              <strong>Correct:</strong> Compare test ear AC to non-test ear <em>BC</em>.
            </Alert>
            <Alert severity="error" variant="outlined">
              <strong>Mistake:</strong> Using white noise for masking during pure tone audiometry.<br />
              <strong>Correct:</strong> Use narrow-band noise (NBN) centred at the test frequency.
              White noise spreads energy across all frequencies, requiring more total intensity and
              increasing the risk of overmasking.
            </Alert>
            <Alert severity="error" variant="outlined">
              <strong>Mistake:</strong> Assuming the same IA for supra-aural and insert earphones.<br />
              <strong>Correct:</strong> Insert earphones have IA of 55 dB (vs 40 dB for supra-aural).
              This 15 dB difference is clinically significant and changes masking decisions.
            </Alert>
            <Alert severity="error" variant="outlined">
              <strong>Mistake:</strong> Forgetting to add occlusion effect for BC masking at low frequencies.<br />
              <strong>Correct:</strong> Add OE to starting EML at 250, 500, and 1000 Hz with supra-aural.
              Insert earphones (deep) eliminate this requirement.
            </Alert>
            <Alert severity="info" variant="outlined">
              <strong>Tip:</strong> Always mask for bone conduction unless both ears have symmetric
              thresholds with no air-bone gap &mdash; this situation is uncommon in clinical practice.
            </Alert>
            <Alert severity="info" variant="outlined">
              <strong>Tip:</strong> Masking is always delivered to the <strong>non-test ear</strong>. Never
              mask the test ear.
            </Alert>
            <Alert severity="info" variant="outlined">
              <strong>Tip:</strong> When in doubt, mask. Under-masking (not masking when needed) is a more
              serious clinical error than masking unnecessarily.
            </Alert>
          </Stack>
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
