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
// Clinical constants
// ---------------------------------------------------------------------------

const INTERAURAL_ATTENUATION = {
  supraaural: 40,
  insert: 55,
  boneConduction: 0,
};

const SCENARIO_FREQUENCIES: Frequency[] = [500, 1000, 2000, 4000];
const SAFETY_FACTOR = 10;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MaskingScenario {
  patientName: string;
  frequency: Frequency;
  testEar: Ear;
  testType: 'air' | 'bone';
  rightAC: number | null;
  rightBC: number | null;
  leftAC: number | null;
  leftBC: number | null;
  correctMaskingRequired: boolean;
  correctMaskingEar: 'non-test' | null;
  correctMinimumMasking: number | null;
  explanation: string;
}

interface ScenarioAnswer {
  maskingRequired: boolean | null;
  maskingEar: string | null;
  minimumMasking: string;
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
          patientName: patient.name, frequency: freq, testEar,
          rightAC: getThreshold(patient.thresholds, 'right', 'air', freq),
          rightBC: getThreshold(patient.thresholds, 'right', 'bone', freq),
          leftAC: getThreshold(patient.thresholds, 'left', 'air', freq),
          leftBC: getThreshold(patient.thresholds, 'left', 'bone', freq),
        };

        // AC scenario
        if (teAC !== null && nteBC !== null) {
          const ia = INTERAURAL_ATTENUATION.supraaural;
          const diff = teAC - nteBC;
          const required = diff >= ia;
          scenarios.push({
            ...row, testType: 'air',
            correctMaskingRequired: required,
            correctMaskingEar: required ? 'non-test' : null,
            correctMinimumMasking: required ? nteBC + SAFETY_FACTOR : null,
            explanation: required
              ? `Masking IS required. Test ear AC (${teAC} dB) - non-test ear BC (${nteBC} dB) = ${diff} dB, which meets or exceeds IA of ${ia} dB for supra-aural headphones.`
              : `Masking is NOT required. Test ear AC (${teAC} dB) - non-test ear BC (${nteBC} dB) = ${diff} dB, below the ${ia} dB IA threshold.`,
          });
        }

        // BC scenario
        if (teBC !== null && teAC !== null) {
          const teABG = teAC - teBC;
          const nteABG = nteAC !== null && nteBC !== null ? nteAC - nteBC : 0;
          const required = teABG >= 10 || nteABG >= 10;
          const gaps: string[] = [];
          if (teABG >= 10) gaps.push(`test ear ABG = ${teABG} dB`);
          if (nteABG >= 10) gaps.push(`non-test ear ABG = ${nteABG} dB`);
          scenarios.push({
            ...row, testType: 'bone',
            correctMaskingRequired: required,
            correctMaskingEar: required ? 'non-test' : null,
            correctMinimumMasking: required && nteBC !== null ? nteBC + SAFETY_FACTOR : null,
            explanation: required
              ? `Masking IS required for BC. IA for bone conduction is 0 dB. Air-bone gap >= 10 dB detected (${gaps.join('; ')}). Cannot determine which cochlea is responding without masking.`
              : `Masking is NOT required for BC. Air-bone gaps are < 10 dB in both ears (test ear: ${teABG} dB${nteAC !== null && nteBC !== null ? `, non-test ear: ${nteABG} dB` : ''}). Unmasked BC likely represents the test ear.`,
          });
        }
      }
    }
  }
  return scenarios;
}

function selectBalancedScenarios(all: MaskingScenario[], count: number): MaskingScenario[] {
  const needed = all.filter((s) => s.correctMaskingRequired);
  const notNeeded = all.filter((s) => !s.correctMaskingRequired);
  const nMask = Math.min(Math.ceil(count * 0.6), needed.length);
  const nNoMask = Math.min(count - nMask, notNeeded.length);
  return shuffle([...shuffle(needed).slice(0, nMask), ...shuffle(notNeeded).slice(0, nNoMask)]);
}

function emptyAnswer(): ScenarioAnswer {
  return { maskingRequired: null, maskingEar: null, minimumMasking: '', submitted: false, correct: false };
}

// ---------------------------------------------------------------------------
// Sub-components
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
        Masking ensures thresholds truly represent the test ear rather than the non-test ear responding
        via cross-hearing. It is one of the most critical clinical skills in audiometry.
      </Typography>

      <Accordion expanded={expanded === 'why'} onChange={toggle('why')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>Why Is Masking Needed?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" paragraph>
            Sound can travel across the skull and stimulate the opposite cochlea (cross-hearing).
            The minimum intensity for this is the interaural attenuation (IA):
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Transducer</strong></TableCell>
                  <TableCell align="center"><strong>IA (dB)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>Supra-aural headphones</TableCell><TableCell align="center">{INTERAURAL_ATTENUATION.supraaural}</TableCell></TableRow>
                <TableRow><TableCell>Insert earphones</TableCell><TableCell align="center">{INTERAURAL_ATTENUATION.insert}</TableCell></TableRow>
                <TableRow><TableCell>Bone oscillator</TableCell><TableCell align="center">{INTERAURAL_ATTENUATION.boneConduction}</TableCell></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'ac'} onChange={toggle('ac')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>When to Mask: Air Conduction</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 1 }}>
            <AlertTitle>AC Masking Rule</AlertTitle>
            Test ear AC - Non-test ear BC &ge; IA ({INTERAURAL_ATTENUATION.supraaural} dB supra-aural / {INTERAURAL_ATTENUATION.insert} dB insert)
          </Alert>
          <Typography variant="body2">
            Example: Right AC = 60 dB, Left BC = 15 dB. Difference = 45 dB &ge; 40 dB, so masking is required.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'bc'} onChange={toggle('bc')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>When to Mask: Bone Conduction</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="warning" sx={{ mb: 1 }}>
            <AlertTitle>BC Masking Rule</AlertTitle>
            Mask whenever air-bone gap &ge; 10 dB in <strong>either</strong> ear (BC IA = 0 dB).
          </Alert>
          <Typography variant="body2">
            With 0 dB IA, you can never be sure which cochlea responds. Any air-bone gap suggests
            conductive involvement requiring masking to determine the true BC threshold.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'formula'} onChange={toggle('formula')} sx={sectionSx}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" fontWeight={600}>Minimum Effective Masking Level</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 1 }}>
            <AlertTitle>Formula</AlertTitle>
            Minimum Effective Masking = Non-test ear BC threshold + {SAFETY_FACTOR} dB (safety factor)
          </Alert>
          <Typography variant="body2">
            Masking noise is always delivered to the non-test ear. The safety factor ensures
            the noise is sufficient to prevent the non-test cochlea from participating.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

const AudiogramTable: React.FC<{ scenario: MaskingScenario }> = ({ scenario }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fmt = (v: number | null) => (v !== null ? `${v}` : '--');

  const vals: Record<string, (number | null)[]> = {
    'Right AC': [scenario.rightAC, null, null, null],
    'Right BC': [scenario.rightBC, null, null, null],
    'Left AC':  [scenario.leftAC, null, null, null],
    'Left BC':  [scenario.leftBC, null, null, null],
  };
  // We only have data at the scenario frequency; place each value in its column
  const freqIdx = SCENARIO_FREQUENCIES.indexOf(scenario.frequency);
  vals['Right AC'][freqIdx] = scenario.rightAC;
  vals['Right BC'][freqIdx] = scenario.rightBC;
  vals['Left AC'][freqIdx] = scenario.leftAC;
  vals['Left BC'][freqIdx] = scenario.leftBC;

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
          {Object.entries(vals).map(([label, data]) => {
            const isRight = label.startsWith('Right');
            const isAC = label.endsWith('AC');
            const ear: Ear = isRight ? 'right' : 'left';
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
                      bgcolor: isAC ? (isRight ? theme.palette.error.main : theme.palette.info.main) : 'transparent',
                      border: !isAC ? `2px solid ${isRight ? theme.palette.error.main : theme.palette.info.main}` : undefined,
                    }} />
                    <Typography variant="body2" fontWeight={isTargetRow ? 700 : 400}>{label}</Typography>
                  </Box>
                </TableCell>
                {data.map((v, i) => (
                  <TableCell key={i} align="center" sx={{
                    fontWeight: SCENARIO_FREQUENCIES[i] === scenario.frequency && isTargetRow ? 700 : 400,
                    bgcolor: SCENARIO_FREQUENCIES[i] === scenario.frequency && isTargetRow
                      ? alpha(theme.palette.warning.main, 0.15) : undefined,
                  }}>
                    {SCENARIO_FREQUENCIES[i] === scenario.frequency ? fmt(v) : '--'}
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
    const selected = selectBalancedScenarios(generateScenarios(patients), 15);
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
    if (answer.maskingRequired && (!answer.maskingEar || !answer.minimumMasking.trim())) return false;
    return true;
  }, [answer]);

  const handleSubmit = useCallback(() => {
    if (!scenario || !answer) return;
    let correct = answer.maskingRequired === scenario.correctMaskingRequired;
    if (scenario.correctMaskingRequired && answer.maskingRequired) {
      if (answer.maskingEar !== 'non-test') correct = false;
      if (scenario.correctMinimumMasking !== null) {
        const v = parseFloat(answer.minimumMasking);
        if (isNaN(v) || Math.abs(v - scenario.correctMinimumMasking) > 5) correct = false;
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
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Scenario Breakdown</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Test</TableCell>
                  <TableCell align="center">Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scenarios.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{s.patientName}</TableCell>
                    <TableCell>{s.testEar === 'right' ? 'R' : 'L'} {s.testType.toUpperCase()} @ {s.frequency} Hz</TableCell>
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
              </Stack>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Review the thresholds at {scenario.frequency} Hz below. The highlighted cell is under evaluation. Values in dB HL.
            </Typography>

            <AudiogramTable scenario={scenario} />
            <Divider sx={{ my: 2 }} />

            {/* Q1: masking required? */}
            <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                1. Is masking required for {scenario.testEar === 'right' ? 'right' : 'left'} ear{' '}
                {scenario.testType === 'air' ? 'air conduction' : 'bone conduction'} at {scenario.frequency} Hz?
              </FormLabel>
              <RadioGroup row
                value={answer.maskingRequired === null ? '' : answer.maskingRequired ? 'yes' : 'no'}
                onChange={(e) => {
                  const yes = e.target.value === 'yes';
                  updateAnswer({ maskingRequired: yes, ...(yes ? {} : { maskingEar: null, minimumMasking: '' }) });
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
                    3. What is the minimum effective masking level? (dB)
                  </Typography>
                  <TextField type="number" value={answer.minimumMasking}
                    onChange={(e) => updateAnswer({ minimumMasking: e.target.value })}
                    disabled={answer.submitted} size="small" placeholder="Enter dB value"
                    label="Minimum masking level (dB)"
                    slotProps={{ htmlInput: { min: -10, max: 120, step: 5, 'aria-label': 'Minimum effective masking level in decibels' } }}
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
                      {scenario.correctMaskingRequired && answer.maskingRequired && scenario.correctMinimumMasking !== null && (() => {
                        const v = parseFloat(answer.minimumMasking);
                        return (isNaN(v) || Math.abs(v - scenario.correctMinimumMasking) > 5)
                          ? <li>Minimum effective masking = <strong>{scenario.correctMinimumMasking} dB</strong> (non-test ear BC {scenario.correctMinimumMasking - SAFETY_FACTOR} dB + {SAFETY_FACTOR} dB safety).</li>
                          : null;
                      })()}
                    </Box>
                  )}
                  <Typography variant="body2">{scenario.explanation}</Typography>
                </Alert>
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
