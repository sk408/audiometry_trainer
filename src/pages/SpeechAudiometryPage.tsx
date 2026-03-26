import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Container, Typography, Paper, Card, CardContent, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, Radio, RadioGroup,
  FormControlLabel, Button, Alert, Accordion, AccordionSummary,
  AccordionDetails, Chip, Divider, useTheme, useMediaQuery, SelectChangeEvent,
} from '@mui/material';
import {
  HearingOutlined, RecordVoiceOver, Calculate, Quiz, ExpandMore,
  CheckCircle, Cancel, MenuBook, TrendingUp,
} from '@mui/icons-material';
import { HearingProfile, Frequency } from '../interfaces/AudioTypes';
import patientService from '../services/PatientService';

interface QuizQuestion {
  id: number; question: string; options: string[];
  correctIndex: number; explanation: string;
}

const PTA_FREQUENCIES: Frequency[] = [500, 1000, 2000];

const WRS_RANGES: { range: string; label: string; significance: string; color: string }[] = [
  { range: '90-100%', label: 'Normal', significance: 'Normal word recognition ability', color: 'success' },
  { range: '76-89%', label: 'Slight difficulty', significance: 'Mild reduction in speech understanding', color: 'info' },
  { range: '60-75%', label: 'Moderate difficulty', significance: 'Hearing aid benefit likely', color: 'warning' },
  { range: '40-59%', label: 'Poor', significance: 'Limited hearing aid benefit expected', color: 'warning' },
  { range: '<40%', label: 'Very poor', significance: 'Consider cochlear implant evaluation', color: 'error' },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: 'A patient has a PTA of 45 dB HL. What is the expected SRT range?',
    options: ['25-45 dB HL', '35-55 dB HL', '45-65 dB HL', '55-75 dB HL'], correctIndex: 1,
    explanation: 'SRT should agree with PTA within +/-10 dB. A PTA of 45 dB HL predicts an SRT between 35 and 55 dB HL.' },
  { id: 2, question: "A patient's SRT is 20 dB but PTA is 50 dB. What might this indicate?",
    options: ['Normal finding', 'Equipment malfunction', 'Possible non-organic hearing loss (malingering)', 'Auditory processing disorder'],
    correctIndex: 2,
    explanation: 'When SRT is significantly better (lower) than PTA, it suggests the patient may not be giving reliable responses on the pure-tone test, raising concern for non-organic hearing loss.' },
  { id: 3, question: 'A patient with PTA of 55 dB has WRS of 92%. What does this suggest about the type of hearing loss?',
    options: ['Sensorineural loss with poor prognosis', 'Conductive loss -- speech clarity preserved despite elevated thresholds',
      'Mixed loss with retrocochlear involvement', 'Central auditory processing disorder'],
    correctIndex: 1,
    explanation: 'Conductive hearing loss typically preserves word recognition because the cochlea and auditory nerve are intact. High WRS despite elevated PTA is characteristic of conductive pathology.' },
  { id: 4, question: 'At what level is WRS typically administered relative to PTA?',
    options: ['At the PTA level', '10-20 dB above PTA', '30-40 dB above PTA', '50-60 dB above PTA'],
    correctIndex: 2,
    explanation: 'WRS is measured at a suprathreshold level, typically PTA + 30-40 dB, to ensure stimuli are comfortably loud. This allows assessment of clarity rather than audibility.' },
  { id: 5, question: "A patient's SRT is 60 dB but PTA is 40 dB. What might this indicate?",
    options: ['Non-organic hearing loss', 'Conductive hearing loss', 'Normal variation',
      'Possible auditory processing disorder or cognitive factors'],
    correctIndex: 3,
    explanation: 'When SRT is worse (higher) than PTA, it may suggest auditory processing difficulties, cognitive factors, or language barriers affecting speech recognition despite adequate pure-tone sensitivity.' },
];

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  if (value !== index) return null;
  return <Box role="tabpanel" id={`speech-tabpanel-${index}`} aria-labelledby={`speech-tab-${index}`} sx={{ pt: 3 }}>{children}</Box>;
}

function computePTA(patient: HearingProfile, ear: 'left' | 'right'): number | null {
  const vals = PTA_FREQUENCIES.map((freq) => {
    const pt = patient.thresholds.find(
      (t) => t.frequency === freq && t.ear === ear &&
        (t.testType === 'air' || t.testType === 'masked_air') && t.responseStatus === 'threshold',
    );
    return pt ? pt.hearingLevel : null;
  });
  if (vals.some((v) => v === null)) return null;
  return Math.round(((vals as number[]).reduce((a, b) => a + b, 0) / 3) * 10) / 10;
}

function findThreshold(patient: HearingProfile, freq: Frequency, ear: 'left' | 'right') {
  return patient.thresholds.find(
    (t) => t.frequency === freq && t.ear === ear &&
      (t.testType === 'air' || t.testType === 'masked_air') && t.responseStatus === 'threshold',
  );
}

const SpeechAudiometryPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [patients, setPatients] = useState<HearingProfile[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [ptaInput, setPtaInput] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => { setPatients(patientService.getAllPatients()); }, []);

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId) ?? null,
    [patients, selectedPatientId],
  );

  const ptaResults = useMemo(() => {
    if (!selectedPatient) return null;
    return { right: computePTA(selectedPatient, 'right'), left: computePTA(selectedPatient, 'left') };
  }, [selectedPatient]);

  const handleTabChange = useCallback((_: React.SyntheticEvent, v: number) => setActiveTab(v), []);
  const handlePatientChange = useCallback((e: SelectChangeEvent) => setSelectedPatientId(e.target.value), []);

  const handleQuizAnswer = useCallback((qId: number, idx: number) => {
    if (!quizSubmitted) setQuizAnswers((prev) => ({ ...prev, [qId]: idx }));
  }, [quizSubmitted]);

  const handleQuizSubmit = useCallback(() => setQuizSubmitted(true), []);
  const handleQuizReset = useCallback(() => { setQuizAnswers({}); setQuizSubmitted(false); }, []);

  const quizScore = useMemo(() => {
    if (!quizSubmitted) return 0;
    return QUIZ_QUESTIONS.reduce((s, q) => s + (quizAnswers[q.id] === q.correctIndex ? 1 : 0), 0);
  }, [quizAnswers, quizSubmitted]);

  const estimatedWRSLevel = useMemo(() => {
    const pta = parseFloat(ptaInput);
    if (isNaN(pta)) return null;
    return { low: pta + 30, high: Math.min(pta + 40, 100) };
  }, [ptaInput]);

  // -- Section 1: Overview --
  const renderOverview = () => (
    <Box>
      <Typography variant="h5" gutterBottom>What is Speech Audiometry?</Typography>
      <Typography paragraph color="text.secondary">
        Speech audiometry evaluates how well a patient understands speech, complementing
        pure-tone results. It provides critical information about real-world communication
        ability and helps cross-check pure-tone findings.
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 2, mt: 2 }}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <RecordVoiceOver color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">SRT</Typography>
            </Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>Speech Reception Threshold</Typography>
            <Typography variant="body2" color="text.secondary">
              The lowest hearing level at which a patient can correctly repeat
              spondaic (two-syllable, equal-stress) words 50% of the time.
              Examples: &quot;baseball,&quot; &quot;hotdog,&quot; &quot;airplane.&quot;
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HearingOutlined color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6">WRS</Typography>
            </Box>
            <Typography variant="subtitle2" color="secondary" gutterBottom>Word Recognition Score</Typography>
            <Typography variant="body2" color="text.secondary">
              The percentage of monosyllabic words correctly repeated at a
              comfortable suprathreshold level, typically PTA + 30-40 dB.
              Assesses speech clarity, not just audibility.
            </Typography>
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Calculate color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">PTA</Typography>
            </Box>
            <Typography variant="subtitle2" color="info.main" gutterBottom>Pure Tone Average</Typography>
            <Typography variant="body2" color="text.secondary">
              The average of air-conduction thresholds at 500, 1000, and 2000 Hz.
              These frequencies carry most speech energy and serve as the
              benchmark for SRT agreement.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  // -- Section 2: PTA-SRT Relationship --
  const renderRelationship = () => (
    <Box>
      <Typography variant="h5" gutterBottom>PTA-SRT Relationship</Typography>
      <Typography paragraph color="text.secondary">
        A key cross-check in any audiometric evaluation is comparing the SRT to the PTA.
        They should agree within +/-10 dB. Significant discrepancies are clinically meaningful.
      </Typography>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">Agreement (within +/-10 dB)</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="text.secondary">
            When SRT and PTA agree, it confirms the reliability of both the pure-tone
            audiogram and the speech test. This is the expected finding in most patients
            with organic hearing loss.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp color="warning" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">SRT better than PTA (SRT significantly lower)</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Possible non-organic hearing loss (malingering / functional hearing loss)
          </Alert>
          <Typography color="text.secondary">
            If the patient can understand speech at levels below what their pure-tone
            thresholds predict, the pure-tone results may be exaggerated. Consider
            additional tests such as OAE or ABR to establish organic thresholds.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Cancel color="error" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">SRT worse than PTA (SRT significantly higher)</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 2 }}>
            Possible auditory processing disorder or cognitive factors
          </Alert>
          <Typography color="text.secondary">
            When a patient requires higher levels for speech recognition than pure-tone
            thresholds predict, consider auditory processing difficulties, cognitive
            decline, language barriers, or neural (retrocochlear) pathology.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  // -- Section 3: Interactive PTA Calculator --
  const renderCalculator = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Interactive PTA Calculator</Typography>
      <Typography paragraph color="text.secondary">
        Select a patient to view their thresholds at the PTA frequencies and see the
        calculated Pure Tone Average with predicted SRT range.
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="patient-select-label">Select Patient</InputLabel>
        <Select labelId="patient-select-label" value={selectedPatientId}
          label="Select Patient" onChange={handlePatientChange}>
          {patients.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name} ({p.hearingLossType} -- {p.difficulty})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedPatient && ptaResults && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {(['right', 'left'] as const).map((ear) => {
            const pta = ptaResults[ear];
            return (
              <Paper key={ear} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color={ear === 'right' ? 'error.main' : 'primary.main'}>
                  {ear === 'right' ? 'Right Ear' : 'Left Ear'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Thresholds at PTA frequencies:</Typography>
                  {PTA_FREQUENCIES.map((freq) => {
                    const pt = findThreshold(selectedPatient, freq, ear);
                    return (
                      <Chip key={freq}
                        label={pt ? `${freq} Hz: ${pt.hearingLevel} dB HL` : `${freq} Hz: N/A`}
                        color={pt ? 'primary' : 'default'} variant="outlined" sx={{ m: 0.5 }} />
                    );
                  })}
                </Box>
                <Divider sx={{ my: 1 }} />
                {pta !== null ? (
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      PTA = ({PTA_FREQUENCIES.map((f) => findThreshold(selectedPatient, f, ear)?.hearingLevel ?? '?').join(' + ')}) / 3 = {pta} dB HL
                    </Typography>
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Predicted SRT range: <strong>{Math.round(pta - 10)} to {Math.round(pta + 10)} dB HL</strong>
                    </Alert>
                  </Box>
                ) : (
                  <Alert severity="warning">Insufficient threshold data at 500, 1000, and 2000 Hz for this ear.</Alert>
                )}
              </Paper>
            );
          })}
          <Alert severity="success" icon={<MenuBook />}>
            <Typography variant="subtitle2" fontWeight="bold">Clinical note</Typography>
            <Typography variant="body2">
              The PTA summarizes hearing sensitivity in the speech-frequency range. It is used
              to predict the SRT, set WRS presentation levels, and classify degree of hearing
              loss. A PTA of 0-25 dB HL is considered normal for adults.
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );

  // -- Section 4: WRS Interpretation Guide --
  const renderWRS = () => (
    <Box>
      <Typography variant="h5" gutterBottom>WRS Interpretation Guide</Typography>
      <Typography paragraph color="text.secondary">
        Word Recognition Score indicates speech clarity. Unlike SRT (which tests audibility),
        WRS tests how well a patient can discriminate individual words when they are loud enough to hear.
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>WRS Range</strong></TableCell>
              <TableCell><strong>Classification</strong></TableCell>
              <TableCell><strong>Clinical Significance</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {WRS_RANGES.map((row) => (
              <TableRow key={row.range}>
                <TableCell>
                  <Chip label={row.range} color={row.color as 'success' | 'info' | 'warning' | 'error'} size="small" />
                </TableCell>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.significance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>WRS Presentation Level Estimator</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter a PTA value to estimate the appropriate WRS presentation level (PTA + 30-40 dB,
          capped at a comfortable maximum of 100 dB HL).
        </Typography>
        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel id="pta-input-label">PTA (dB HL)</InputLabel>
          <Select labelId="pta-input-label" value={ptaInput} label="PTA (dB HL)"
            onChange={(e) => setPtaInput(e.target.value)}>
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map((v) => (
              <MenuItem key={v} value={String(v)}>{v} dB HL</MenuItem>
            ))}
          </Select>
        </FormControl>
        {estimatedWRSLevel && (
          <Alert severity="info">
            <Typography variant="body2">
              For a PTA of <strong>{ptaInput} dB HL</strong>, present WRS stimuli at approximately{' '}
              <strong>{estimatedWRSLevel.low}-{estimatedWRSLevel.high} dB HL</strong>.
              {estimatedWRSLevel.high >= 100 && <> (Capped at 100 dB HL to avoid discomfort.)</>}
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );

  // -- Section 5: Clinical Decision Making Quiz --
  const renderQuiz = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Clinical Decision Making Quiz</Typography>
      <Typography paragraph color="text.secondary">
        Test your understanding of speech audiometry concepts with the questions below.
      </Typography>
      {quizSubmitted && (
        <Alert severity={quizScore >= 4 ? 'success' : quizScore >= 3 ? 'info' : 'warning'} sx={{ mb: 3 }}>
          You scored <strong>{quizScore} out of {QUIZ_QUESTIONS.length}</strong>.
          {quizScore === QUIZ_QUESTIONS.length ? ' Excellent work!'
            : quizScore >= 3 ? ' Good understanding -- review the explanations below for questions you missed.'
            : ' Review the material above and try again.'}
        </Alert>
      )}
      {QUIZ_QUESTIONS.map((q) => {
        const userAnswer = quizAnswers[q.id];
        const isCorrect = userAnswer === q.correctIndex;
        return (
          <Paper key={q.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {q.id}. {q.question}
            </Typography>
            <RadioGroup value={userAnswer !== undefined ? String(userAnswer) : ''}
              onChange={(_, val) => handleQuizAnswer(q.id, parseInt(val, 10))}>
              {q.options.map((opt, idx) => (
                <FormControlLabel key={idx} value={String(idx)} control={<Radio size="small" />}
                  label={opt} disabled={quizSubmitted}
                  sx={{
                    ...(quizSubmitted && idx === q.correctIndex ? { color: theme.palette.success.main } : {}),
                    ...(quizSubmitted && userAnswer === idx && !isCorrect ? { color: theme.palette.error.main } : {}),
                  }} />
              ))}
            </RadioGroup>
            {quizSubmitted && (
              <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mt: 1 }}>{q.explanation}</Alert>
            )}
          </Paper>
        );
      })}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        {!quizSubmitted ? (
          <Button variant="contained" onClick={handleQuizSubmit}
            disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}>
            Submit Answers
          </Button>
        ) : (
          <Button variant="outlined" onClick={handleQuizReset}>Retake Quiz</Button>
        )}
      </Box>
    </Box>
  );

  const tabItems = [
    { label: 'Overview', icon: <MenuBook /> },
    { label: 'PTA-SRT', icon: <TrendingUp /> },
    { label: 'Calculator', icon: <Calculate /> },
    { label: 'WRS Guide', icon: <RecordVoiceOver /> },
    { label: 'Quiz', icon: <Quiz /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Speech Audiometry
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            Understanding SRT, WRS, and their clinical significance
          </Typography>
        </Box>
        <Tabs value={activeTab} onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {tabItems.map((t, i) => (
            <Tab key={i} label={isMobile ? undefined : t.label}
              icon={t.icon} iconPosition="start" aria-label={t.label} />
          ))}
        </Tabs>
        <TabPanel value={activeTab} index={0}>{renderOverview()}</TabPanel>
        <TabPanel value={activeTab} index={1}>{renderRelationship()}</TabPanel>
        <TabPanel value={activeTab} index={2}>{renderCalculator()}</TabPanel>
        <TabPanel value={activeTab} index={3}>{renderWRS()}</TabPanel>
        <TabPanel value={activeTab} index={4}>{renderQuiz()}</TabPanel>
      </Paper>
    </Container>
  );
};

export default SpeechAudiometryPage;
