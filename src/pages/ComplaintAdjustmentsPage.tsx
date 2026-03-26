import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Tabs, Tab, Accordion, AccordionSummary,
  AccordionDetails, Chip, Card, CardContent, TextField, InputAdornment,
  Divider, Alert, Link as MuiLink, useTheme, useMediaQuery,
} from '@mui/material';
import {
  ExpandMore, Search, VolumeUp, GraphicEq, Tune, Pattern,
  Warning, CheckCircle, HelpOutline, Build,
} from '@mui/icons-material';
import {
  COMPLAINT_ENTRIES, FREQUENCY_GUIDELINES, INPUT_LEVEL_GUIDELINES,
  VOICE_QUALITY_GUIDE, ADJUSTMENT_PATTERNS, ALL_CATEGORIES,
  CATEGORY_COLORS, ComplaintCategory,
} from '../data/complaintAdjustmentData';

// ---------------------------------------------------------------------------
// TabPanel helper
// ---------------------------------------------------------------------------

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  if (value !== index) return null;
  return (
    <Box role="tabpanel" id={`complaint-tabpanel-${index}`} aria-labelledby={`complaint-tab-${index}`} sx={{ pt: 3 }}>
      {children}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ComplaintAdjustmentsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | 'All'>('All');
  const [expandedComplaint, setExpandedComplaint] = useState<string | false>(false);

  const handleTabChange = useCallback((_: React.SyntheticEvent, v: number) => setActiveTab(v), []);

  const handleAccordionChange = useCallback(
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedComplaint(isExpanded ? panel : false);
    },
    [],
  );

  const filteredComplaints = useMemo(() => {
    const lower = searchText.toLowerCase();
    return COMPLAINT_ENTRIES.filter((entry) => {
      const matchesSearch =
        !lower ||
        entry.complaint.toLowerCase().includes(lower) ||
        entry.whatPatientExperiences.toLowerCase().includes(lower) ||
        entry.whatToAdjust.toLowerCase().includes(lower) ||
        entry.category.toLowerCase().includes(lower);
      const matchesCategory = categoryFilter === 'All' || entry.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, categoryFilter]);

  // -----------------------------------------------------------------------
  // Tab 1: By Complaint
  // -----------------------------------------------------------------------
  const renderByComplaint = () => (
    <Box>
      <Typography variant="h5" gutterBottom>By Complaint</Typography>
      <Typography paragraph color="text.secondary">
        When a patient describes a problem, find the matching complaint below.
        Each entry explains what the patient is experiencing, what to adjust,
        why the adjustment works, how to verify, and what to watch out for.
      </Typography>

      {/* Search & filter controls */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search complaints, adjustments, or categories..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Category chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
        <Chip
          label="All"
          size="small"
          color={categoryFilter === 'All' ? 'primary' : 'default'}
          variant={categoryFilter === 'All' ? 'filled' : 'outlined'}
          onClick={() => setCategoryFilter('All')}
        />
        {ALL_CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            size="small"
            color={categoryFilter === cat ? CATEGORY_COLORS[cat] : 'default'}
            variant={categoryFilter === cat ? 'filled' : 'outlined'}
            onClick={() => setCategoryFilter(cat)}
          />
        ))}
      </Box>

      {/* Results count */}
      {(searchText || categoryFilter !== 'All') && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredComplaints.length} of {COMPLAINT_ENTRIES.length} complaints
        </Typography>
      )}

      {/* Complaint accordions */}
      {filteredComplaints.map((entry) => (
        <Accordion
          key={entry.id}
          expanded={expandedComplaint === entry.id}
          onChange={handleAccordionChange(entry.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', width: '100%', pr: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
                &ldquo;{entry.complaint}&rdquo;
              </Typography>
              <Chip
                label={entry.category}
                size="small"
                color={CATEGORY_COLORS[entry.category]}
                variant="outlined"
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* What the patient is experiencing */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <HelpOutline fontSize="small" color="info" />
                  <Typography variant="subtitle2" fontWeight="bold" color="info.main">
                    What the Patient Is Experiencing
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {entry.whatPatientExperiences}
                </Typography>
              </Box>

              <Divider />

              {/* What to adjust */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Build fontSize="small" color="primary" />
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    What to Adjust
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {entry.whatToAdjust}
                </Typography>
              </Box>

              <Divider />

              {/* Why */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <GraphicEq fontSize="small" color="secondary" />
                  <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">
                    Why This Adjustment Helps
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {entry.why}
                </Typography>
              </Box>

              <Divider />

              {/* Verification */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CheckCircle fontSize="small" color="success" />
                  <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                    Verification
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {entry.verification}
                </Typography>
              </Box>

              <Divider />

              {/* Caution */}
              <Alert severity="warning" icon={<Warning />} sx={{ mt: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Caution</Typography>
                <Typography variant="body2">{entry.caution}</Typography>
              </Alert>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}

      {filteredComplaints.length === 0 && (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No complaints match your search. Try a different term or clear the filter.
          </Typography>
        </Paper>
      )}
    </Box>
  );

  // -----------------------------------------------------------------------
  // Tab 2: By Frequency
  // -----------------------------------------------------------------------
  const renderByFrequency = () => (
    <Box>
      <Typography variant="h5" gutterBottom>By Frequency</Typography>
      <Typography paragraph color="text.secondary">
        Quick reference for frequency-based gain adjustments. Use this when you know
        which frequency region is causing the issue. See the{' '}
        <MuiLink component={Link} to="/reference/audiogram-patterns">Audiogram Patterns Guide</MuiLink>{' '}
        for typical loss configurations and their fitting approaches.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {FREQUENCY_GUIDELINES.map((fg) => (
          <Card key={fg.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <GraphicEq color="primary" />
                <Typography variant="h6">{fg.label}</Typography>
                <Chip label={fg.range} size="small" color="primary" variant="outlined" />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 2 }}>
                {/* Increase */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.main', color: 'success.contrastText', opacity: 0.9 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Increase When:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {fg.increaseWhen.map((item, i) => (
                      <li key={i}>
                        <Typography variant="body2">{item}</Typography>
                      </li>
                    ))}
                  </Box>
                </Paper>

                {/* Decrease */}
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText', opacity: 0.9 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Decrease When:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {fg.decreaseWhen.map((item, i) => (
                      <li key={i}>
                        <Typography variant="body2">{item}</Typography>
                      </li>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // -----------------------------------------------------------------------
  // Tab 3: By Input Level
  // -----------------------------------------------------------------------
  const renderByInputLevel = () => (
    <Box>
      <Typography variant="h5" gutterBottom>By Input Level</Typography>
      <Typography paragraph color="text.secondary">
        Hearing aids apply different amounts of gain depending on the input level.
        Adjusting gain for soft, medium, or loud inputs independently addresses
        specific complaints.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {INPUT_LEVEL_GUIDELINES.map((il) => (
          <Card key={il.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <VolumeUp color="secondary" />
                <Typography variant="h6">{il.label}</Typography>
                <Chip label={il.inputLevel} size="small" color="secondary" variant="outlined" />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 2 }}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.main', color: 'success.contrastText', opacity: 0.9 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Increase When:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {il.increaseWhen.map((item, i) => (
                      <li key={i}>
                        <Typography variant="body2">{item}</Typography>
                      </li>
                    ))}
                  </Box>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.main', color: 'error.contrastText', opacity: 0.9 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Decrease When:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {il.decreaseWhen.map((item, i) => (
                      <li key={i}>
                        <Typography variant="body2">{item}</Typography>
                      </li>
                    ))}
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Voice Quality Sub-Guide */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>Voice Quality Guide</Typography>
      <Typography paragraph color="text.secondary">
        When a patient describes the overall quality of amplified sound using one of these
        descriptors, use the corresponding adjustment as a starting point.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 2 }}>
        {VOICE_QUALITY_GUIDE.map((vq) => (
          <Card key={vq.id} variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                {vq.quality}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {vq.description}
              </Typography>
              <Alert severity="info" icon={<Tune />}>
                <Typography variant="body2">{vq.adjustment}</Typography>
              </Alert>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // -----------------------------------------------------------------------
  // Tab 4: Common Patterns
  // -----------------------------------------------------------------------
  const renderCommonPatterns = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Common Adjustment Patterns</Typography>
      <Typography paragraph color="text.secondary">
        These patterns represent the most frequent clinical scenarios. Each includes
        a typical symptom cluster, recommended adjustments, verification steps,
        and an expected timeline. For guidance on when to adjust vs. counsel vs. refer, see{' '}
        <MuiLink component={Link} to="/reference/clinical-decisions">Clinical Decision-Making</MuiLink>.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {ADJUSTMENT_PATTERNS.map((pattern) => (
          <Card key={pattern.id} variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                {pattern.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {pattern.description}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 2 }}>
                {/* Symptoms */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HelpOutline fontSize="small" color="error" />
                    <Typography variant="subtitle2" fontWeight="bold" color="error.main">
                      Symptoms
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {pattern.symptoms.map((s, i) => (
                      <li key={i}>
                        <Typography variant="body2" color="text.secondary">{s}</Typography>
                      </li>
                    ))}
                  </Box>
                </Paper>

                {/* Adjustments */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Build fontSize="small" color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                      Adjustments
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {pattern.adjustments.map((a, i) => (
                      <li key={i}>
                        <Typography variant="body2" color="text.secondary">{a}</Typography>
                      </li>
                    ))}
                  </Box>
                </Paper>

                {/* Verification */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircle fontSize="small" color="success" />
                    <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                      Verification
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {pattern.verification.map((v, i) => (
                      <li key={i}>
                        <Typography variant="body2" color="text.secondary">{v}</Typography>
                      </li>
                    ))}
                  </Box>
                </Paper>

                {/* Timeline */}
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Pattern fontSize="small" color="info" />
                    <Typography variant="subtitle2" fontWeight="bold" color="info.main">
                      Timeline
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {pattern.timeline}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );

  // -----------------------------------------------------------------------
  // Tab items
  // -----------------------------------------------------------------------
  const tabItems = [
    { label: 'By Complaint', icon: <VolumeUp /> },
    { label: 'By Frequency', icon: <GraphicEq /> },
    { label: 'By Input Level', icon: <Tune /> },
    { label: 'Common Patterns', icon: <Pattern /> },
  ];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Complaint-Based Adjustments
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            Mapping patient complaints to hearing aid adjustments
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
            <Tab
              key={i}
              label={isMobile ? undefined : t.label}
              icon={t.icon}
              iconPosition="start"
              aria-label={t.label}
            />
          ))}
        </Tabs>

        <TabPanel value={activeTab} index={0}>{renderByComplaint()}</TabPanel>
        <TabPanel value={activeTab} index={1}>{renderByFrequency()}</TabPanel>
        <TabPanel value={activeTab} index={2}>{renderByInputLevel()}</TabPanel>
        <TabPanel value={activeTab} index={3}>{renderCommonPatterns()}</TabPanel>
      </Paper>
    </Container>
  );
};

export default ComplaintAdjustmentsPage;
