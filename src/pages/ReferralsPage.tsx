import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, Chip, Divider, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemIcon, ListItemText, Card, CardContent,
  Link as MuiLink, useTheme, useMediaQuery,
} from '@mui/material';
import {
  ExpandMore, CheckCircle, Cancel, Warning, LocalHospital,
  MedicalServices, RecordVoiceOver, FormatQuote, Assignment,
  ArrowForward, FiberManualRecord,
} from '@mui/icons-material';
import {
  REFERRAL_CRITERIA,
  WHEN_NOT_TO_REFER,
  RED_FLAGS,
  CLINICAL_EXAMPLES,
  COMMUNICATION_SCRIPTS,
  COMMUNICATION_PRINCIPLES,
  REFERRAL_LETTER_CONTENTS,
} from '../data/referralData';

// ---------------------------------------------------------------------------
// Tab panel helper (matches SpeechAudiometryPage pattern)
// ---------------------------------------------------------------------------

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  if (value !== index) return null;
  return (
    <Box role="tabpanel" id={`referrals-tabpanel-${index}`} aria-labelledby={`referrals-tab-${index}`} sx={{ pt: 3 }}>
      {children}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Urgency chip helper
// ---------------------------------------------------------------------------

function urgencyChip(urgency: 'urgent' | 'priority' | 'routine') {
  const map: Record<typeof urgency, { color: 'error' | 'warning' | 'success'; label: string }> = {
    urgent: { color: 'error', label: 'URGENT' },
    priority: { color: 'warning', label: 'Priority' },
    routine: { color: 'success', label: 'Routine' },
  };
  const { color, label } = map[urgency];
  return <Chip label={label} color={color} size="small" />;
}

// ---------------------------------------------------------------------------
// ReferralsPage Component
// ---------------------------------------------------------------------------

const ReferralsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = useCallback((_: React.SyntheticEvent, v: number) => setActiveTab(v), []);

  // -----------------------------------------------------------------------
  // Tab 1: When to Refer
  // -----------------------------------------------------------------------
  const renderWhenToRefer = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Referral Criteria Matrix</Typography>
      <Typography paragraph color="text.secondary">
        The following table summarises findings that should prompt a medical referral.
        The urgency level guides how quickly the referral should be made.
      </Typography>

      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalHospital color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Asymmetric Sensorineural Hearing Loss (SNHL)
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Rule:</strong> Refer when there is an interaural asymmetry of &ge; 15 dB at 3 or more
            frequencies, OR &ge; 20 dB at 2 or more frequencies, in the absence of a known cause.
            See <MuiLink component={Link} to="/reference/audiogram-patterns">Audiogram Patterns</MuiLink> for
            identifying asymmetric configurations on the audiogram.
          </Alert>
        </AccordionDetails>
      </Accordion>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Finding</strong></TableCell>
              <TableCell><strong>Threshold</strong></TableCell>
              <TableCell><strong>Urgency</strong></TableCell>
              <TableCell><strong>Refer To</strong></TableCell>
              <TableCell><strong>Reason</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {REFERRAL_CRITERIA.map((row, idx) => (
              <TableRow key={idx} sx={{
                backgroundColor: row.urgency === 'urgent'
                  ? `${theme.palette.error.main}10`
                  : row.urgency === 'priority'
                    ? `${theme.palette.warning.main}10`
                    : undefined,
              }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.finding}</TableCell>
                <TableCell>{row.threshold}</TableCell>
                <TableCell>{urgencyChip(row.urgency)}</TableCell>
                <TableCell>{row.referTo}</TableCell>
                <TableCell>{row.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom>When NOT to Refer</Typography>
      <Typography paragraph color="text.secondary">
        Avoid unnecessary referrals in the following situations:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <List dense>
          {WHEN_NOT_TO_REFER.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Cancel color="disabled" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );

  // -----------------------------------------------------------------------
  // Tab 2: Red Flags
  // -----------------------------------------------------------------------
  const renderRedFlags = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Urgency-Based Triage</Typography>
      <Typography paragraph color="text.secondary">
        Red flags are grouped by urgency. Use this as a quick-reference guide during clinical encounters.
      </Typography>

      {/* URGENT (Red) */}
      <Alert severity="error" variant="outlined" sx={{ mb: 1 }}>
        <Typography variant="h6" color="error.main">
          RED &mdash; Immediate / Urgent Referral (Same Day)
        </Typography>
      </Alert>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderColor: 'error.main', borderWidth: 2 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Sign</strong></TableCell>
              <TableCell><strong>Why It&rsquo;s Urgent</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RED_FLAGS.urgent.map((flag, idx) => (
              <TableRow key={idx} sx={{ backgroundColor: `${theme.palette.error.main}08` }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{flag.sign}</TableCell>
                <TableCell>{flag.why}</TableCell>
                <TableCell>{flag.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PRIORITY (Yellow) */}
      <Alert severity="warning" variant="outlined" sx={{ mb: 1 }}>
        <Typography variant="h6" color="warning.main">
          YELLOW &mdash; Priority Referral (Within 2&ndash;4 Weeks)
        </Typography>
      </Alert>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderColor: 'warning.main', borderWidth: 2 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Sign</strong></TableCell>
              <TableCell><strong>Why It&rsquo;s Concerning</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RED_FLAGS.priority.map((flag, idx) => (
              <TableRow key={idx} sx={{ backgroundColor: `${theme.palette.warning.main}08` }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{flag.sign}</TableCell>
                <TableCell>{flag.why}</TableCell>
                <TableCell>{flag.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ROUTINE (Green) */}
      <Alert severity="success" variant="outlined" sx={{ mb: 1 }}>
        <Typography variant="h6" color="success.main">
          GREEN &mdash; Routine Referral (4&ndash;6 Weeks)
        </Typography>
      </Alert>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderColor: 'success.main', borderWidth: 2 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Sign</strong></TableCell>
              <TableCell><strong>Reason</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RED_FLAGS.routine.map((flag, idx) => (
              <TableRow key={idx} sx={{ backgroundColor: `${theme.palette.success.main}08` }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{flag.sign}</TableCell>
                <TableCell>{flag.why}</TableCell>
                <TableCell>{flag.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // -----------------------------------------------------------------------
  // Tab 3: Acoustic Neuroma / Vestibular Schwannoma
  // -----------------------------------------------------------------------
  const renderAcousticNeuroma = () => (
    <Box>
      {/* What It Is */}
      <Typography variant="h5" gutterBottom>Acoustic Neuroma / Vestibular Schwannoma</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>What It Is</Typography>
        <Typography paragraph color="text.secondary">
          A benign (non-cancerous) tumor growing on the vestibulocochlear nerve (CN VIII), specifically
          the vestibular branch. It grows slowly (1&ndash;2 mm/year typically) but can compress the brainstem
          and adjacent cranial nerves.
        </Typography>
      </Paper>

      {/* Prevalence */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Prevalence</Typography>
        <List dense>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><FiberManualRecord sx={{ fontSize: 8 }} /></ListItemIcon>
            <ListItemText primary="Incidence: approximately 1-2 per 100,000 per year" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><FiberManualRecord sx={{ fontSize: 8 }} /></ListItemIcon>
            <ListItemText primary="Accounts for ~6-10% of all intracranial tumors" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><FiberManualRecord sx={{ fontSize: 8 }} /></ListItemIcon>
            <ListItemText primary="Peak diagnosis age: 40-60 years" />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><FiberManualRecord sx={{ fontSize: 8 }} /></ListItemIcon>
            <ListItemText primary="Bilateral tumors associated with Neurofibromatosis Type 2 (NF2)" />
          </ListItem>
        </List>
      </Paper>

      {/* Audiometric Profile */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>How It Presents on Audiometric Testing</Typography>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Classic audiometric profile:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><ArrowForward color="primary" fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Unilateral or asymmetric SNHL"
              secondary="Typically high-frequency sloping, but can be any configuration"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><ArrowForward color="primary" fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Disproportionately poor WRS relative to PTA"
              secondary="The hallmark retrocochlear sign"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><ArrowForward color="primary" fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Rollover"
              secondary="WRS decreases at higher presentation levels (PI-PB function shows rollover)"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><ArrowForward color="primary" fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="Abnormal acoustic reflexes"
              secondary="May be elevated, absent, or decaying"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><ArrowForward color="primary" fontSize="small" /></ListItemIcon>
            <ListItemText
              primary="ABR findings"
              secondary="May show prolonged Wave I-V interwave latency"
            />
          </ListItem>
        </List>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold">The WRS Red Flag</Typography>
          <Typography variant="body2">
            A patient with a PTA of 40 dB HL might be expected to have a WRS of 80&ndash;100%.
            If their WRS is 52%, that discrepancy is a retrocochlear warning sign. The neural pathway
            is compromised even though the cochlea may be relatively intact.
          </Typography>
        </Alert>
      </Paper>

      {/* Rollover explanation */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>What Rollover Means</Typography>
        <Typography paragraph color="text.secondary">
          <strong>Rollover</strong> occurs when WRS decreases as presentation level increases beyond
          the optimal level. In a normal ear, WRS plateaus or stays stable as level increases. In
          retrocochlear pathology, WRS peaks and then drops (rolls over).
        </Typography>
        <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'grey.100', fontFamily: 'monospace', mb: 2 }}>
          <Typography variant="body1" fontFamily="monospace">
            Rollover Index (RI) = (PBmax - PBmin) / PBmax
          </Typography>
        </Paper>
        <Typography variant="body2" color="text.secondary" paragraph>
          Where <strong>PBmax</strong> = maximum WRS score, and <strong>PBmin</strong> = WRS at the
          highest tested level.
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><FiberManualRecord sx={{ fontSize: 8 }} color="error" /></ListItemIcon>
            <ListItemText
              primary="RI > 0.45 is considered significant for retrocochlear pathology (Jerger & Jerger criteria)"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 32 }}><FiberManualRecord sx={{ fontSize: 8 }} color="warning" /></ListItemIcon>
            <ListItemText
              primary="Some clinicians use RI > 0.25 as a more conservative criterion"
            />
          </ListItem>
        </List>
      </Paper>

      {/* Clinical Examples */}
      <Typography variant="h6" gutterBottom>Clinical Examples</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {CLINICAL_EXAMPLES.map((ex, idx) => (
          <Card key={idx} variant="outlined" sx={{
            borderColor: ex.shouldRefer ? 'error.main' : 'success.main',
            borderWidth: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {ex.shouldRefer
                  ? <Warning color="error" sx={{ mr: 1 }} />
                  : <CheckCircle color="success" sx={{ mr: 1 }} />}
                <Typography variant="subtitle1" fontWeight="bold">{ex.title}</Typography>
                <Chip
                  label={ex.shouldRefer ? 'REFER' : 'No Referral Needed'}
                  color={ex.shouldRefer ? 'error' : 'success'}
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="error.main" fontWeight="bold">Right Ear</Typography>
                  <Typography variant="body2">PTA: {ex.rightEar.pta} dB HL</Typography>
                  <Typography variant="body2">WRS: {ex.rightEar.wrs}% at PTA+40</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="primary.main" fontWeight="bold">Left Ear</Typography>
                  <Typography variant="body2">PTA: {ex.leftEar.pta} dB HL</Typography>
                  <Typography variant="body2">WRS: {ex.leftEar.wrs}% at PTA+40</Typography>
                </Box>
              </Box>
              <Alert severity={ex.shouldRefer ? 'warning' : 'success'} variant="outlined">
                <Typography variant="body2"><strong>Assessment:</strong> {ex.assessment}</Typography>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Diagnostic Pathway */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Diagnostic Pathway After Referral</Typography>
        <Box sx={{ pl: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip label="1" size="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">Audiometric suspicion identified</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 2 }}>
            <ArrowForward fontSize="small" sx={{ mr: 1 }} color="action" />
            <Chip label="2" size="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">ENT referral with audiogram</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pl: 4 }}>
            <ArrowForward fontSize="small" sx={{ mr: 1 }} color="action" />
            <Chip label="3" size="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">MRI with gadolinium contrast</Typography>
          </Box>
          <Alert severity="info" sx={{ ml: 4 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>If tumor is found:</Typography>
            <List dense disablePadding>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary={<><strong>Small ({'<'} 1.5 cm):</strong> Watch-and-wait with serial MRI</>}
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary={<><strong>Medium (1.5&ndash;2.5 cm):</strong> Stereotactic radiosurgery (Gamma Knife) or surgery</>}
                />
              </ListItem>
              <ListItem sx={{ py: 0 }}>
                <ListItemText
                  primary={<><strong>Large ({'>'} 2.5 cm):</strong> Microsurgery (middle fossa, retrosigmoid, or translabyrinthine approach)</>}
                />
              </ListItem>
            </List>
          </Alert>
        </Box>
      </Paper>
    </Box>
  );

  // -----------------------------------------------------------------------
  // Tab 4: Communicating Referrals
  // -----------------------------------------------------------------------
  const renderCommunicating = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Communicating Referrals to Patients</Typography>
      <Typography paragraph color="text.secondary">
        How you communicate a referral is as important as making one. Patients may feel anxious.
        Your language should be reassuring, honest, and action-oriented.
        For additional referral communication scripts and clinical scenarios, see{' '}
        <MuiLink component={Link} to="/reference/clinical-decisions">Clinical Decision-Making</MuiLink>.
      </Typography>

      {/* Principles */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Communication Principles</Typography>
        <List>
          {COMMUNICATION_PRINCIPLES.map((p, idx) => (
            <ListItem key={idx} alignItems="flex-start">
              <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                <Chip label={idx + 1} size="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="bold">{p.principle}</Typography>}
                secondary={p.example}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Example Scripts */}
      <Typography variant="h6" gutterBottom>Example Scripts</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {COMMUNICATION_SCRIPTS.map((script, idx) => (
          <Card key={idx} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RecordVoiceOver color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {script.scenario}
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  {urgencyChip(script.urgency)}
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', mt: 1 }}>
                <FormatQuote color="disabled" sx={{ mr: 1, transform: 'scaleX(-1)', alignSelf: 'flex-start' }} />
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  {script.script}
                </Typography>
                <FormatQuote color="disabled" sx={{ ml: 1, alignSelf: 'flex-end' }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Referral Letter Contents Checklist */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Assignment color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">What to Include in a Referral Letter</Typography>
        </Box>
        <List dense>
          {REFERRAL_LETTER_CONTENTS.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );

  // -----------------------------------------------------------------------
  // Tab config
  // -----------------------------------------------------------------------
  const tabItems = [
    { label: 'When to Refer', icon: <MedicalServices /> },
    { label: 'Red Flags', icon: <Warning /> },
    { label: 'Acoustic Neuroma', icon: <LocalHospital /> },
    { label: 'Communicating Referrals', icon: <RecordVoiceOver /> },
  ];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            When to Refer: Medical Referral Guide for Audiologists
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            Identifying audiometric patterns that require medical evaluation
          </Typography>
        </Box>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabItems.map((t, i) => (
            <Tab key={i} label={isMobile ? undefined : t.label}
              icon={t.icon} iconPosition="start" aria-label={t.label} />
          ))}
        </Tabs>
        <TabPanel value={activeTab} index={0}>{renderWhenToRefer()}</TabPanel>
        <TabPanel value={activeTab} index={1}>{renderRedFlags()}</TabPanel>
        <TabPanel value={activeTab} index={2}>{renderAcousticNeuroma()}</TabPanel>
        <TabPanel value={activeTab} index={3}>{renderCommunicating()}</TabPanel>
      </Paper>
    </Container>
  );
};

export default ReferralsPage;
