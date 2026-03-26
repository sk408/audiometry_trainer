import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, Divider, List, ListItem, ListItemText, ListItemIcon,
  Accordion, AccordionSummary, AccordionDetails,
  TextField, InputAdornment, Chip, Card, CardContent,
  useTheme, useMediaQuery,
} from '@mui/material';
import {
  ExpandMore, Search as SearchIcon, CheckCircle, Close as CloseIcon,
  Circle, ArrowRight,
} from '@mui/icons-material';
import {
  AUDIOGRAM_PATTERNS, PATTERN_QUICK_REF, PATTERN_CATEGORIES,
  type AudiogramPattern, type PatternCategory,
} from '../data/audiogramPatternsData';

// ---------------------------------------------------------------------------
// TabPanel helper
// ---------------------------------------------------------------------------

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  if (value !== index) return null;
  return (
    <Box role="tabpanel" id={`patterns-tabpanel-${index}`} aria-labelledby={`patterns-tab-${index}`} sx={{ pt: 3 }}>
      {children}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
      {children}
    </Typography>
  );
}

// ---------------------------------------------------------------------------
// Urgency chip helper
// ---------------------------------------------------------------------------

function urgencyColor(urgency: string): 'default' | 'success' | 'info' | 'warning' | 'error' {
  switch (urgency) {
    case 'none': return 'success';
    case 'routine': return 'info';
    case 'priority': return 'warning';
    case 'urgent': return 'error';
    default: return 'default';
  }
}

function maskingLabel(needed: boolean): string {
  return needed ? 'Yes / Sometimes' : 'Rarely';
}

// ---------------------------------------------------------------------------
// Pattern Detail Card (renders inside each accordion)
// ---------------------------------------------------------------------------

function PatternDetailCard({ pattern }: { pattern: AudiogramPattern }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Audiogram Signature */}
      <SectionHeading>Audiogram Signature</SectionHeading>
      <Typography paragraph color="text.secondary">{pattern.audiogramSignature.description}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {pattern.audiogramSignature.distinguishingFeatures.map((f) => (
          <Chip key={f} label={f} size="small" variant="outlined" />
        ))}
        <Chip
          label={pattern.audiogramSignature.airBoneGap ? 'Air-Bone Gap Present' : 'No Air-Bone Gap'}
          size="small"
          color={pattern.audiogramSignature.airBoneGap ? 'warning' : 'default'}
          variant="outlined"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Typical Complaints & Fitting Approach — side by side on desktop */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
        {/* Typical Complaints */}
        <Box sx={{ flex: 1 }}>
          <SectionHeading>Typical Complaints</SectionHeading>
          <List dense disablePadding>
            {pattern.typicalComplaints.map((c, i) => (
              <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 24 }}><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
                <ListItemText primary={c} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            <Link to="/hearing-aids/adjustments" style={{ color: 'inherit' }}>
              See Complaint-Based Adjustments
            </Link>
          </Typography>
        </Box>

        {/* Fitting Approach */}
        <Box sx={{ flex: 1 }}>
          <SectionHeading>Fitting Approach</SectionHeading>
          <List dense disablePadding>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 24 }}><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText primary="Transducer" secondary={pattern.fittingApproach.transducerChoice} primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }} />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 24 }}><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText primary="Coupling" secondary={pattern.fittingApproach.earmoldCoupling} primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }} />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 24 }}><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText primary="Vent" secondary={pattern.fittingApproach.ventSize} primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }} />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 24 }}><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText primary="Prescriptive Target" secondary={pattern.fittingApproach.prescriptiveTarget} primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }} />
            </ListItem>
            <ListItem disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 24 }}><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText primary="Key Frequency Regions" secondary={pattern.fittingApproach.keyFrequencyRegions} primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }} />
            </ListItem>
          </List>
          {pattern.fittingApproach.additionalConsiderations.length > 0 && (
            <Alert severity="info" sx={{ mt: 1 }}>
              {pattern.fittingApproach.additionalConsiderations.map((c, i) => (
                <Typography key={i} variant="body2">{c}</Typography>
              ))}
            </Alert>
          )}
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            <Link to="/hearing-aids/earmolds" style={{ color: 'inherit' }}>
              See Earmolds & Amplification
            </Link>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Masking Requirements */}
      <SectionHeading>Masking Requirements</SectionHeading>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Chip
          label={maskingLabel(pattern.maskingGuidance.typicallyNeeded)}
          color={pattern.maskingGuidance.typicallyNeeded ? 'warning' : 'success'}
          size="small"
        />
      </Box>
      <Typography paragraph color="text.secondary">{pattern.maskingGuidance.explanation}</Typography>
      {pattern.maskingGuidance.criticalScenarios.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Critical Scenarios:</Typography>
          {pattern.maskingGuidance.criticalScenarios.map((s, i) => (
            <Typography key={i} variant="body2">- {s}</Typography>
          ))}
        </Alert>
      )}
      <Typography variant="body2" color="primary">
        <Link to="/assessment/masking" style={{ color: 'inherit' }}>
          See Masking Practice
        </Link>
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Tradeoffs */}
      <SectionHeading>Tradeoffs</SectionHeading>
      <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 2, mb: 2 }}>
        {pattern.tradeoffs.map((t, i) => (
          <Card key={i} variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>{t.tradeoff}</Typography>
              <Typography variant="body2" color="text.secondary">{t.explanation}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Adjust vs. Counsel */}
      <SectionHeading>Adjustment vs. Counseling Guide</SectionHeading>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Complaint</strong></TableCell>
              <TableCell align="center"><strong>Adjust?</strong></TableCell>
              <TableCell align="center"><strong>Counsel?</strong></TableCell>
              <TableCell><strong>Rationale</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pattern.adjustVsCounsel.map((row, i) => (
              <TableRow key={i}>
                <TableCell sx={{ fontWeight: 500 }}>{row.complaint}</TableCell>
                <TableCell align="center">
                  {row.isAdjustment ? <CheckCircle color="success" fontSize="small" /> : <CloseIcon color="disabled" fontSize="small" />}
                </TableCell>
                <TableCell align="center">
                  {row.isCounseling ? <CheckCircle color="info" fontSize="small" /> : <CloseIcon color="disabled" fontSize="small" />}
                </TableCell>
                <TableCell>{row.rationale}</TableCell>
                <TableCell>{row.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      {/* Referral Criteria */}
      <SectionHeading>Referral Criteria</SectionHeading>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Chip
          label={pattern.referralGuidance.urgency.charAt(0).toUpperCase() + pattern.referralGuidance.urgency.slice(1)}
          color={urgencyColor(pattern.referralGuidance.urgency)}
          size="small"
        />
        {pattern.referralGuidance.referralPossible && (
          <Typography variant="body2" color="text.secondary">Refer to: {pattern.referralGuidance.referTo}</Typography>
        )}
      </Box>
      <List dense disablePadding>
        {pattern.referralGuidance.criteria.map((c, i) => (
          <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 24 }}><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
            <ListItemText primary={c} />
          </ListItem>
        ))}
      </List>
      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
        <Link to="/assessment/referrals" style={{ color: 'inherit' }}>
          See Referrals Guide
        </Link>
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Common Student Mistakes */}
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Common Student Mistakes</Typography>
        {pattern.commonMistakes.map((m, i) => (
          <Box key={i} sx={{ mb: i < pattern.commonMistakes.length - 1 ? 2 : 0 }}>
            <Typography variant="body2"><strong>Mistake:</strong> {m.mistake}</Typography>
            <Typography variant="body2"><strong>Consequence:</strong> {m.consequence}</Typography>
            <Typography variant="body2"><strong>Correction:</strong> {m.correction}</Typography>
          </Box>
        ))}
      </Alert>

      {/* Clinical Pearls */}
      <Alert severity="info">
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Clinical Pearls</Typography>
        {pattern.clinicalPearls.map((p, i) => (
          <Typography key={i} variant="body2" sx={{ mb: i < pattern.clinicalPearls.length - 1 ? 1 : 0 }}>
            {i + 1}. {p.pearl}
          </Typography>
        ))}
      </Alert>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

const AudiogramPatternsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PatternCategory | 'All'>('All');
  const [expandedPattern, setExpandedPattern] = useState<string | false>(false);

  const handleTabChange = useCallback((_: React.SyntheticEvent, v: number) => setActiveTab(v), []);

  const handleAccordionChange = useCallback(
    (patternId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPattern(isExpanded ? patternId : false);
    },
    [],
  );

  const filteredPatterns = useMemo(() => {
    let result = [...AUDIOGRAM_PATTERNS];
    if (categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.shortName.toLowerCase().includes(lower) ||
          p.audiogramSignature.distinguishingFeatures.some((f) => f.toLowerCase().includes(lower)) ||
          p.typicalComplaints.some((c) => c.toLowerCase().includes(lower)),
      );
    }
    return result;
  }, [categoryFilter, searchText]);

  // Jump from quick-ref table row to the pattern accordion in Tab 1
  const jumpToPattern = useCallback((patternId: string) => {
    setActiveTab(0);
    setCategoryFilter('All');
    setSearchText('');
    setExpandedPattern(patternId);
    // Allow state to update before scrolling
    setTimeout(() => {
      const el = document.getElementById(`pattern-accordion-${patternId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  // ========================================================================
  // Tab 1 — By Pattern
  // ========================================================================
  const renderByPattern = () => (
    <Box>
      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search patterns by name, feature, or complaint..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon /></InputAdornment>
          ),
        }}
      />

      {/* Category filter chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip
          label="All"
          onClick={() => setCategoryFilter('All')}
          variant={categoryFilter === 'All' ? 'filled' : 'outlined'}
          color={categoryFilter === 'All' ? 'primary' : 'default'}
        />
        {PATTERN_CATEGORIES.map((cat) => (
          <Chip
            key={cat.category}
            label={cat.label}
            onClick={() => setCategoryFilter(cat.category)}
            variant={categoryFilter === cat.category ? 'filled' : 'outlined'}
            color={categoryFilter === cat.category ? cat.color : 'default'}
          />
        ))}
      </Box>

      {/* Results count */}
      {(categoryFilter !== 'All' || searchText.trim()) && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredPatterns.length} of {AUDIOGRAM_PATTERNS.length} patterns
        </Typography>
      )}

      {/* Pattern accordions */}
      {filteredPatterns.map((pattern) => (
        <Accordion
          key={pattern.id}
          id={`pattern-accordion-${pattern.id}`}
          expanded={expandedPattern === pattern.id}
          onChange={handleAccordionChange(pattern.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', width: '100%' }}>
              <Chip
                label={PATTERN_CATEGORIES.find((c) => c.category === pattern.category)?.label ?? pattern.category}
                size="small"
                color={PATTERN_CATEGORIES.find((c) => c.category === pattern.category)?.color ?? 'default'}
              />
              <Typography variant="subtitle1" fontWeight={600} sx={{ flexGrow: 1 }}>
                {pattern.name}
              </Typography>
              {pattern.prevalence && (
                <Chip label={pattern.prevalence} size="small" variant="outlined" />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <PatternDetailCard pattern={pattern} />
          </AccordionDetails>
        </Accordion>
      ))}

      {filteredPatterns.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No patterns match your search. Try a different search term or category filter.
        </Alert>
      )}
    </Box>
  );

  // ========================================================================
  // Tab 2 — Quick Reference Matrix
  // ========================================================================
  const renderQuickRef = () => (
    <Box>
      <Typography paragraph color="text.secondary">
        Dense comparison of all 12 patterns. Click any row to view the full pattern detail.
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Pattern</strong></TableCell>
              <TableCell><strong>Degree</strong></TableCell>
              <TableCell><strong>Transducer</strong></TableCell>
              <TableCell><strong>Vent</strong></TableCell>
              <TableCell><strong>Masking?</strong></TableCell>
              <TableCell><strong>Referral?</strong></TableCell>
              <TableCell><strong>Top Complaint</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PATTERN_QUICK_REF.map((row) => {
              const pattern = AUDIOGRAM_PATTERNS.find((p) => p.id === row.patternId);
              return (
                <TableRow
                  key={row.patternId}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => jumpToPattern(row.patternId)}
                >
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {pattern?.shortName ?? row.patternId}
                  </TableCell>
                  <TableCell>{row.typicalDegree}</TableCell>
                  <TableCell>{row.transducer}</TableCell>
                  <TableCell>{row.vent}</TableCell>
                  <TableCell>{row.maskingNeeded}</TableCell>
                  <TableCell>{row.referralNeeded}</TableCell>
                  <TableCell>{row.topComplaint}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // ========================================================================
  // Render
  // ========================================================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Audiogram Patterns & Clinical Action
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Connecting audiogram configurations to clinical decision-making
      </Typography>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="By Pattern" id="patterns-tab-0" aria-controls="patterns-tabpanel-0" />
          <Tab label="Quick Reference Matrix" id="patterns-tab-1" aria-controls="patterns-tabpanel-1" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {renderByPattern()}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {renderQuickRef()}
      </TabPanel>
    </Container>
  );
};

export default AudiogramPatternsPage;
