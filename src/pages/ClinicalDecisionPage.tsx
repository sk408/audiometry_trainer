import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, List, ListItem, ListItemIcon, ListItemText,
  Card, CardContent, Button, ButtonGroup,
  Accordion, AccordionSummary, AccordionDetails,
  useTheme, useMediaQuery,
} from '@mui/material';
import {
  ExpandMore, Tune, RecordVoiceOver, LocalHospital,
  ArrowForward, FiberManualRecord, CheckCircle, Warning,
  FormatQuote, Help, Assignment, MedicalServices,
} from '@mui/icons-material';
import {
  DECISION_CATEGORIES,
  CATEGORY_DISCRIMINATORS,
  FITTING_PROBLEM_INDICATORS,
  EXPECTATION_PROBLEM_INDICATORS,
  MEDICAL_PROBLEM_INDICATORS,
  COMMON_COMBINATIONS,
  ADJUSTMENT_CRITERIA,
  INFORMATION_BEFORE_ADJUSTING,
  ADJUSTMENT_PRIORITIZATION,
  WHEN_NOT_TO_ADJUST,
  ADAPTATION_TIMELINE,
  REALISTIC_EXPECTATIONS,
  COUNSELING_WHEN_APPROPRIATE,
  COUNSELING_STRATEGIES,
  THERAPEUTIC_TRIAL_STEPS,
  REFERRAL_PATHWAYS,
  CLINICAL_RED_FLAGS,
  URGENCY_COMMUNICATION,
  REFERRAL_INFORMATION_CHECKLIST,
  AUDIOGRAM_DECISION_MAPPINGS,
  CLINICAL_SCENARIOS,
  TRADEOFF_SCENARIOS,
  TRADEOFF_PRINCIPLES,
  SHARED_DECISION_STEPS,
  DOCUMENTATION_TIPS,
  TOC_SECTIONS,
  type DecisionCategory,
} from '../data/clinicalDecisionData';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const categoryIcon = (id: string) => {
  switch (id) {
    case 'Tune': return <Tune />;
    case 'RecordVoiceOver': return <RecordVoiceOver />;
    case 'LocalHospital': return <LocalHospital />;
    default: return <Help />;
  }
};

const categoryColor = (id: DecisionCategory): 'primary' | 'success' | 'error' => {
  const map: Record<DecisionCategory, 'primary' | 'success' | 'error'> = {
    adjust: 'primary',
    counsel: 'success',
    refer: 'error',
  };
  return map[id];
};

const urgencyChip = (urgency: 'urgent' | 'priority' | 'routine') => {
  const map: Record<typeof urgency, { color: 'error' | 'warning' | 'success'; label: string }> = {
    urgent: { color: 'error', label: 'URGENT' },
    priority: { color: 'warning', label: 'Priority' },
    routine: { color: 'success', label: 'Routine' },
  };
  const { color, label } = map[urgency];
  return <Chip label={label} color={color} size="small" />;
};

// ---------------------------------------------------------------------------
// Section 1: Core Framework
// ---------------------------------------------------------------------------

function CoreFrameworkSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Box id="section-1" sx={{ scrollMarginTop: '80px' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assignment color="primary" /> 1. The Core Framework
      </Typography>
      <Typography paragraph color="text.secondary">
        Every clinical finding falls into one (or more) of three response categories. The first step
        is always to ask: <strong>Is this a fitting problem, an expectation problem, or a medical problem?</strong>
      </Typography>

      {/* Three category cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        {DECISION_CATEGORIES.map((cat) => (
          <Card key={cat.id} variant="outlined" sx={{ borderColor: `${cat.color}.main`, borderWidth: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {categoryIcon(cat.icon)}
                <Typography variant="h6" sx={{ ml: 1 }} color={`${cat.color}.main`}>
                  {cat.label}
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>{cat.definition}</Typography>
              <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">{cat.centralQuestion}</Typography>
              </Alert>
              <List dense disablePadding>
                {cat.examples.map((ex, i) => (
                  <ListItem key={i} sx={{ py: 0, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <FiberManualRecord sx={{ fontSize: 8 }} color={cat.color as 'primary' | 'success' | 'error'} />
                    </ListItemIcon>
                    <ListItemText primary={ex} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Discriminator checklist */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>How to Tell Them Apart</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Ask Yourself...</strong></TableCell>
                <TableCell><strong>If Yes &rarr;</strong></TableCell>
                <TableCell><strong>Explanation</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CATEGORY_DISCRIMINATORS.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.question}</TableCell>
                  <TableCell>
                    <Chip label={d.ifYes.toUpperCase()} color={categoryColor(d.ifYes)} size="small" />
                  </TableCell>
                  <TableCell>{d.explanation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Indicator lists */}
      <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
        {[
          { title: 'Fitting Problem Indicators', items: FITTING_PROBLEM_INDICATORS, color: 'primary' as const },
          { title: 'Expectation Problem Indicators', items: EXPECTATION_PROBLEM_INDICATORS, color: 'success' as const },
          { title: 'Medical Problem Indicators', items: MEDICAL_PROBLEM_INDICATORS, color: 'error' as const },
        ].map((group) => (
          <Paper key={group.title} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" color={`${group.color}.main`} gutterBottom>
              {group.title}
            </Typography>
            <List dense disablePadding>
              {group.items.map((item, i) => (
                <ListItem key={i} sx={{ py: 0.25, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <ArrowForward fontSize="small" color={group.color} />
                  </ListItemIcon>
                  <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        ))}
      </Box>

      {/* Combinations */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Combinations Are Common</Typography>
        <Typography variant="body2">
          Most clinical situations require more than one response. The categories are not mutually exclusive.
        </Typography>
      </Alert>
      <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 2 }}>
        {COMMON_COMBINATIONS.map((combo, i) => (
          <Paper key={i} variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>{combo.combination}</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>{combo.description}</Typography>
            <Typography variant="body2"><em>Example: {combo.example}</em></Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Section 2: Adjustment Decision Tree
// ---------------------------------------------------------------------------

function AdjustmentSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Box id="section-2" sx={{ scrollMarginTop: '80px' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tune color="primary" /> 2. Adjustment Decision Tree
      </Typography>

      {/* When a complaint is clearly a fitting issue */}
      <Typography variant="h6" gutterBottom>When a Complaint Is Clearly a Fitting Issue</Typography>
      <Typography paragraph color="text.secondary">
        A complaint is clearly a fitting issue when <strong>ALL</strong> of the following are true:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <List dense>
          {ADJUSTMENT_CRITERIA.map((c, i) => (
            <ListItem key={i}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Chip label={i + 1} size="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography fontWeight="bold">{c.criterion}</Typography>}
                secondary={c.explanation}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Information needed */}
      <Typography variant="h6" gutterBottom>Information Needed Before Adjusting</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Information</strong></TableCell>
              <TableCell><strong>Why It Matters</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {INFORMATION_BEFORE_ADJUSTING.map((row, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.information}</TableCell>
                <TableCell>{row.whyItMatters}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Prioritization */}
      <Typography variant="h6" gutterBottom>How to Prioritize Multiple Complaints</Typography>
      <Typography paragraph color="text.secondary">
        When a patient presents with multiple complaints at one visit, address them in this order:
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Rationale</strong></TableCell>
              <TableCell><strong>Examples</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ADJUSTMENT_PRIORITIZATION.map((row) => (
              <TableRow key={row.priority}>
                <TableCell><Chip label={row.priority} size="small" color="primary" /></TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.category}</TableCell>
                <TableCell>{row.rationale}</TableCell>
                <TableCell>{row.examples.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Clinical principle:</strong> Address no more than 2&ndash;3 complaints per visit. Making too many
        changes at once makes it impossible to determine what helped and what didn&rsquo;t.
      </Alert>

      {/* When NOT to adjust */}
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">When NOT to Adjust</Typography>
      </Alert>
      <TableContainer component={Paper} variant="outlined">
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Situation</strong></TableCell>
              <TableCell><strong>Reason</strong></TableCell>
              <TableCell><strong>What to Do Instead</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {WHEN_NOT_TO_ADJUST.map((row, i) => (
              <TableRow key={i} sx={{ backgroundColor: (t) => `${t.palette.warning.main}08` }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.situation}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>{row.whatToDo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          For specific adjustment guidance by complaint type, see the{' '}
          <Typography component={Link} to="/hearing-aids/adjustments" color="primary" variant="body2">
            Complaint-Based Adjustments
          </Typography>{' '}page.
        </Typography>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Section 3: Counseling Decision Tree
// ---------------------------------------------------------------------------

function CounselingSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Box id="section-3" sx={{ scrollMarginTop: '80px' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RecordVoiceOver color="success" /> 3. Counseling Decision Tree
      </Typography>

      {/* Adaptation timeline */}
      <Typography variant="h6" gutterBottom>Adaptation Period: What Is Normal</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Phase</strong></TableCell>
              <TableCell><strong>Timeframe</strong></TableCell>
              <TableCell><strong>What to Expect</strong></TableCell>
              <TableCell><strong>When to Intervene</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ADAPTATION_TIMELINE.map((row, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.phase}</TableCell>
                <TableCell><Chip label={row.timeframe} size="small" variant="outlined" /></TableCell>
                <TableCell>{row.whatToExpect}</TableCell>
                <TableCell>{row.whenToIntervene}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Critical distinction:</strong> A complaint that is IMPROVING over the first 2&ndash;4 weeks is normal adaptation.
        A complaint that is STATIC or WORSENING is likely a fitting issue. Always ask: &ldquo;Has this gotten better, worse, or stayed the same since you first noticed it?&rdquo;
      </Alert>

      {/* Realistic Expectations */}
      <Typography variant="h6" gutterBottom>Realistic Expectations</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {REALISTIC_EXPECTATIONS.map((re, i) => (
          <Card key={i} variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                Patient says: {re.expectation}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Reality:</strong> {re.reality}
              </Typography>
              <Box sx={{ display: 'flex', mt: 1 }}>
                <FormatQuote color="disabled" sx={{ mr: 1, transform: 'scaleX(-1)', alignSelf: 'flex-start', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {re.howToExplain}
                </Typography>
                <FormatQuote color="disabled" sx={{ ml: 1, alignSelf: 'flex-end', flexShrink: 0 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* When counseling alone is appropriate */}
      <Typography variant="h6" gutterBottom>When Counseling Alone Is Appropriate</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <List dense>
          {COUNSELING_WHEN_APPROPRIATE.map((item, i) => (
            <ListItem key={i}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Communication strategies */}
      <Typography variant="h6" gutterBottom>Communication Strategies</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {COUNSELING_STRATEGIES.map((s, i) => (
          <Card key={i} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RecordVoiceOver color="success" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">{s.scenario}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Approach:</strong> {s.approach}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', mt: 1 }}>
                <FormatQuote color="disabled" sx={{ mr: 1, transform: 'scaleX(-1)', alignSelf: 'flex-start', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  {s.exampleScript}
                </Typography>
                <FormatQuote color="disabled" sx={{ ml: 1, alignSelf: 'flex-end', flexShrink: 0 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Therapeutic trial */}
      <Paper variant="outlined" sx={{ p: 2, bgcolor: (t) => t.palette.mode === 'dark' ? 'grey.900' : 'grey.50' }}>
        <Typography variant="h6" gutterBottom>The Therapeutic Trial Concept</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          A <strong>therapeutic trial</strong> is a structured period (typically 2&ndash;4 weeks) during which the patient
          wears the hearing aids consistently in their daily environments before any judgment about benefit is made.
          Many patients form an opinion within the first 2 hours &mdash; this is too soon.
        </Typography>
        <List dense>
          {THERAPEUTIC_TRIAL_STEPS.map((step, i) => (
            <ListItem key={i}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Chip label={i + 1} size="small" color="success" />
              </ListItemIcon>
              <ListItemText primary={step} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Section 4: Referral Decision Tree
// ---------------------------------------------------------------------------

function ReferralSection({ isMobile }: { isMobile: boolean }) {
  const theme = useTheme();
  const medicalPathways = REFERRAL_PATHWAYS.filter((p) => p.type === 'medical');
  const audiologicalPathways = REFERRAL_PATHWAYS.filter((p) => p.type === 'audiological');

  return (
    <Box id="section-4" sx={{ scrollMarginTop: '80px' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalHospital color="error" /> 4. Referral Decision Tree
      </Typography>

      {/* Red flags */}
      <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          STOP AND REFER IMMEDIATELY
        </Typography>
        <List dense disablePadding>
          {CLINICAL_RED_FLAGS.map((flag, i) => (
            <ListItem key={i} sx={{ py: 0, color: 'inherit' }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Warning sx={{ color: 'inherit', fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" fontWeight="bold" sx={{ color: 'inherit' }}>{flag.sign}</Typography>}
                secondary={<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>{flag.action}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </Alert>

      {/* Medical referrals */}
      <Typography variant="h6" gutterBottom>Medical Referrals (ENT / Otolaryngology)</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Condition</strong></TableCell>
              <TableCell><strong>Criteria</strong></TableCell>
              <TableCell><strong>Urgency</strong></TableCell>
              <TableCell><strong>Refer To</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicalPathways.map((p, i) => (
              <TableRow key={i} sx={{
                backgroundColor: p.urgency === 'urgent'
                  ? `${theme.palette.error.main}10`
                  : p.urgency === 'priority'
                    ? `${theme.palette.warning.main}10`
                    : undefined,
              }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{p.subtype}</TableCell>
                <TableCell>{p.criteria.join('; ')}</TableCell>
                <TableCell>{urgencyChip(p.urgency)}</TableCell>
                <TableCell>{p.referTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Audiological referrals */}
      <Typography variant="h6" gutterBottom>Audiological Referrals</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Condition</strong></TableCell>
              <TableCell><strong>Criteria</strong></TableCell>
              <TableCell><strong>Refer To</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audiologicalPathways.map((p, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontWeight: 'bold' }}>{p.subtype}</TableCell>
                <TableCell>{p.criteria.join('; ')}</TableCell>
                <TableCell>{p.referTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Urgency communication */}
      <Typography variant="h6" gutterBottom>How to Communicate Urgency</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {URGENCY_COMMUNICATION.map((uc, i) => (
          <Card key={i} variant="outlined" sx={{
            borderColor: uc.urgency === 'urgent' ? 'error.main' : uc.urgency === 'priority' ? 'warning.main' : 'success.main',
            borderWidth: 2,
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RecordVoiceOver color={uc.urgency === 'urgent' ? 'error' : uc.urgency === 'priority' ? 'warning' : 'success'} sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {uc.urgency.charAt(0).toUpperCase() + uc.urgency.slice(1)} Referral
                </Typography>
                <Box sx={{ ml: 'auto' }}>{urgencyChip(uc.urgency)}</Box>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Approach:</strong> {uc.approach}
              </Typography>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <FormatQuote color="disabled" sx={{ mr: 1, transform: 'scaleX(-1)', alignSelf: 'flex-start', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  {uc.exampleScript}
                </Typography>
                <FormatQuote color="disabled" sx={{ ml: 1, alignSelf: 'flex-end', flexShrink: 0 }} />
              </Box>
              <Alert severity="warning" variant="outlined">
                <Typography variant="body2"><strong>Pitfalls to avoid:</strong></Typography>
                <List dense disablePadding>
                  {uc.pitfalls.map((p, j) => (
                    <ListItem key={j} sx={{ py: 0, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <FiberManualRecord sx={{ fontSize: 8 }} color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={p} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  ))}
                </List>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Referral checklist */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Assignment color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">What to Include in a Referral</Typography>
        </Box>
        <List dense>
          {REFERRAL_INFORMATION_CHECKLIST.map((item, i) => (
            <ListItem key={i}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          For the full referral criteria matrix and red flags guide, see the{' '}
          <Typography component={Link} to="/assessment/referrals" color="primary" variant="body2">
            Referrals
          </Typography>{' '}page.
        </Typography>
      </Paper>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Section 5: Audiogram Cross-Reference
// ---------------------------------------------------------------------------

function AudiogramSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Box id="section-5" sx={{ scrollMarginTop: '80px' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MedicalServices color="primary" /> 5. Audiogram-Specific Decision Guidance
      </Typography>
      <Typography paragraph color="text.secondary">
        This cross-reference table links each audiogram pattern to its most likely clinical decision pathway.
        Click the arrow to view the full pattern details.
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Audiogram Pattern</strong></TableCell>
              <TableCell><strong>Primary Pathway</strong></TableCell>
              {!isMobile && <TableCell><strong>Secondary</strong></TableCell>}
              <TableCell><strong>Key Decision Point</strong></TableCell>
              <TableCell align="center"><strong>Details</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {AUDIOGRAM_DECISION_MAPPINGS.map((m) => (
              <TableRow key={m.patternId} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{m.patternName}</TableCell>
                <TableCell>
                  <Chip label={m.primaryPathway.toUpperCase()} color={categoryColor(m.primaryPathway)} size="small" />
                  {m.secondaryPathway && (
                    <Chip label={`+ ${m.secondaryPathway.toUpperCase()}`} color={categoryColor(m.secondaryPathway)} size="small" variant="outlined" sx={{ ml: 0.5 }} />
                  )}
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    {m.secondaryPathway
                      ? <Chip label={m.secondaryPathway.toUpperCase()} color={categoryColor(m.secondaryPathway)} size="small" variant="outlined" />
                      : '\u2014'
                    }
                  </TableCell>
                )}
                <TableCell>{m.keyDecisionPoint}</TableCell>
                <TableCell align="center">
                  <Button
                    component={Link}
                    to="/reference/audiogram-patterns"
                    size="small"
                    endIcon={<ArrowForward />}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Section 6: Clinical Scenarios
// ---------------------------------------------------------------------------

function ScenarioCard({ scenario }: { scenario: typeof CLINICAL_SCENARIOS[number] }) {
  const [answer, setAnswer] = useState<DecisionCategory | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleAnswer = (choice: DecisionCategory) => {
    setAnswer(choice);
    setRevealed(true);
  };

  const isCorrect = answer === scenario.correctDecision;

  return (
    <Card variant="outlined" sx={{
      borderColor: revealed ? (isCorrect ? 'success.main' : 'error.main') : 'divider',
      borderWidth: revealed ? 2 : 1,
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {scenario.title}
          </Typography>
          {revealed && (
            <Chip
              label={isCorrect ? 'CORRECT' : 'INCORRECT'}
              color={isCorrect ? 'success' : 'error'}
              size="small"
            />
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2"><strong>Patient:</strong> {scenario.patientDescription}</Typography>
          <Typography variant="body2"><strong>Audiogram:</strong> {scenario.audiogramSummary}</Typography>
          <Typography variant="body2"><strong>Time:</strong> {scenario.timeContext}</Typography>
          <Typography variant="body2"><strong>Additional:</strong> {scenario.additionalInfo}</Typography>
        </Box>

        <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Complaint:</strong> {scenario.complaint}
          </Typography>
        </Alert>

        {!revealed ? (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              What is the primary response?
            </Typography>
            <ButtonGroup variant="outlined" fullWidth>
              <Button color="primary" onClick={() => handleAnswer('adjust')} startIcon={<Tune />}>
                Adjust
              </Button>
              <Button color="success" onClick={() => handleAnswer('counsel')} startIcon={<RecordVoiceOver />}>
                Counsel
              </Button>
              <Button color="error" onClick={() => handleAnswer('refer')} startIcon={<LocalHospital />}>
                Refer
              </Button>
            </ButtonGroup>
          </Box>
        ) : (
          <Box>
            <Alert severity={isCorrect ? 'success' : 'warning'} sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Correct answer:</strong>{' '}
                <Chip label={scenario.correctDecision.toUpperCase()} color={categoryColor(scenario.correctDecision)} size="small" />
                {scenario.secondaryDecision && (
                  <> + <Chip label={scenario.secondaryDecision.toUpperCase()} color={categoryColor(scenario.secondaryDecision)} size="small" variant="outlined" /></>
                )}
              </Typography>
            </Alert>

            <Typography variant="body2" paragraph>
              <strong>Reasoning:</strong> {scenario.reasoning}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Action Plan:</Typography>
            <List dense>
              {scenario.actionPlan.map((step, i) => (
                <ListItem key={i} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Chip label={i + 1} size="small" color="primary" sx={{ height: 20, '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' } }} />
                  </ListItemIcon>
                  <ListItemText primary={step} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
            </List>

            <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Common mistake:</strong>{' '}
                <Chip label={scenario.commonWrongAnswer.toUpperCase()} size="small" variant="outlined" /> &mdash;{' '}
                {scenario.whyWrongAnswerIsWrong}
              </Typography>
            </Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function ScenariosSection() {
  return (
    <Box id="section-6" sx={{ scrollMarginTop: '80px' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Help color="primary" /> 6. Common Clinical Scenarios
      </Typography>
      <Typography paragraph color="text.secondary">
        Read each scenario, then select your answer. Click a button to reveal the expert reasoning
        and action plan.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {CLINICAL_SCENARIOS.map((s) => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Section 7: Tradeoff Communication
// ---------------------------------------------------------------------------

function TradeoffSection({ isMobile }: { isMobile: boolean }) {
  return (
    <Box id="section-7" sx={{ scrollMarginTop: '80px' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RecordVoiceOver color="primary" /> 7. The Tradeoff Communication Framework
      </Typography>

      {/* Principles */}
      <Typography variant="h6" gutterBottom>How to Explain Tradeoffs in Plain Language</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <List dense>
          {TRADEOFF_PRINCIPLES.map((p, i) => (
            <ListItem key={i}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Chip label={i + 1} size="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary={p} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Tradeoff script cards */}
      <Typography variant="h6" gutterBottom>Example Tradeoff Scripts</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {TRADEOFF_SCENARIOS.map((ts) => (
          <Card key={ts.id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{ts.tradeoff}</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Context:</strong> {ts.clinicalContext}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', my: 2 }}>
                <FormatQuote color="disabled" sx={{ mr: 1, transform: 'scaleX(-1)', alignSelf: 'flex-start', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  {ts.exampleScript}
                </Typography>
                <FormatQuote color="disabled" sx={{ ml: 1, alignSelf: 'flex-end', flexShrink: 0 }} />
              </Box>
              <Alert severity="info" variant="outlined">
                <Typography variant="body2">
                  <strong>Ask the patient:</strong> &ldquo;{ts.sharedDecisionQuestion}&rdquo;
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Shared decision-making model */}
      <Typography variant="h6" gutterBottom>Shared Decision-Making Model</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <List dense>
          {SHARED_DECISION_STEPS.map((step, i) => (
            <ListItem key={i}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Chip label={i + 1} size="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary={step} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Documentation tips */}
      <Typography variant="h6" gutterBottom>Documentation Tips</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>What to Document</strong></TableCell>
              <TableCell><strong>Example</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DOCUMENTATION_TIPS.map((tip, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontWeight: 'bold' }}>{tip.category}</TableCell>
                <TableCell>
                  <List dense disablePadding>
                    {tip.whatToDocument.map((item, j) => (
                      <ListItem key={j} sx={{ py: 0, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <FiberManualRecord sx={{ fontSize: 6 }} />
                        </ListItemIcon>
                        <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{tip.example}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Table of Contents (Sidebar / Mobile)
// ---------------------------------------------------------------------------

function TableOfContents({
  activeSection,
  isMobile,
}: {
  activeSection: string;
  isMobile: boolean;
}) {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (isMobile) {
    return (
      <Accordion sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" fontWeight="bold">In This Guide</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense disablePadding>
            {TOC_SECTIONS.map((s, i) => (
              <ListItem
                key={s.id}
                component="button"
                onClick={() => handleClick(s.id)}
                sx={{
                  border: 'none',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                  ...(activeSection === s.id && { bgcolor: 'action.selected' }),
                }}
              >
                <ListItemText
                  primary={`${i + 1}. ${s.label}`}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: activeSection === s.id ? 'bold' : 'normal',
                    color: activeSection === s.id ? 'primary' : 'text.primary',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'sticky',
        top: 80,
        p: 2,
        width: 220,
        flexShrink: 0,
        alignSelf: 'flex-start',
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
        IN THIS GUIDE
      </Typography>
      <List dense disablePadding>
        {TOC_SECTIONS.map((s, i) => (
          <ListItem
            key={s.id}
            component="button"
            onClick={() => handleClick(s.id)}
            sx={{
              border: 'none',
              bgcolor: 'transparent',
              cursor: 'pointer',
              borderRadius: 1,
              py: 0.5,
              '&:hover': { bgcolor: 'action.hover' },
              ...(activeSection === s.id && { bgcolor: 'action.selected' }),
            }}
          >
            <ListItemText
              primary={`${i + 1}. ${s.shortLabel}`}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: activeSection === s.id ? 'bold' : 'normal',
                color: activeSection === s.id ? 'primary' : 'text.primary',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

const ClinicalDecisionPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState('section-1');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for active TOC highlighting
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    const sectionIds = TOC_SECTIONS.map((s) => s.id);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        {/* Header */}
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Clinical Decision-Making
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            A framework for responding to any clinical finding
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
            When you encounter a finding, ask: Is this a fitting problem, an expectation problem, or a medical problem?
          </Typography>
        </Box>

        {/* Mobile TOC */}
        {isMobile && <TableOfContents activeSection={activeSection} isMobile />}

        {/* Content with desktop sidebar */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {!isMobile && <TableOfContents activeSection={activeSection} isMobile={false} />}

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <CoreFrameworkSection isMobile={isMobile} />
            <Divider sx={{ my: 4 }} />
            <AdjustmentSection isMobile={isMobile} />
            <Divider sx={{ my: 4 }} />
            <CounselingSection isMobile={isMobile} />
            <Divider sx={{ my: 4 }} />
            <ReferralSection isMobile={isMobile} />
            <Divider sx={{ my: 4 }} />
            <AudiogramSection isMobile={isMobile} />
            <Divider sx={{ my: 4 }} />
            <ScenariosSection />
            <Divider sx={{ my: 4 }} />
            <TradeoffSection isMobile={isMobile} />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClinicalDecisionPage;
