import React, { useState, useCallback } from 'react';
import {
  Box, Container, Typography, Paper, Card, CardContent, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, Divider, List, ListItem, ListItemText, ListItemIcon,
  useTheme, useMediaQuery,
} from '@mui/material';
import {
  ExpandMore, Hearing, Build, Science, ChildCare, ElderlyWoman,
  CheckCircle, Warning, ArrowRight, Circle,
} from '@mui/icons-material';
import {
  EARMOLD_STYLES, MATERIALS, VENT_TYPES, HORN_TYPES, DAMPER_TYPES,
  IMPRESSION_STEPS, IMPRESSION_COMPLICATIONS, REMAKE_CRITERIA,
  VENT_FEEDBACK_LIMITS, VENT_TRADEOFFS,
} from '../data/earmoldData';

// ---------------------------------------------------------------------------
// TabPanel helper (mirrors SpeechAudiometryPage pattern)
// ---------------------------------------------------------------------------

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  if (value !== index) return null;
  return (
    <Box role="tabpanel" id={`earmold-tabpanel-${index}`} aria-labelledby={`earmold-tab-${index}`} sx={{ pt: 3 }}>
      {children}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Reusable sub-heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
      {children}
    </Typography>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

const EarmoldsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = useCallback((_: React.SyntheticEvent, v: number) => setActiveTab(v), []);

  // ========================================================================
  // Tab 1 — Types & Styles
  // ========================================================================
  const renderTypesAndStyles = () => (
    <Box>
      <SectionHeading>Earmold / Coupling Styles Overview</SectionHeading>
      <Typography paragraph color="text.secondary">
        Earmold style selection depends on degree of hearing loss, feedback management needs, patient
        dexterity, cosmetic preference, and ear canal anatomy. The table below compares the nine most
        common coupling styles.
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Style</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Best For</strong></TableCell>
              <TableCell><strong>HL Range</strong></TableCell>
              <TableCell><strong>Occlusion</strong></TableCell>
              <TableCell><strong>Retention</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {EARMOLD_STYLES.map((s) => (
              <TableRow key={s.name}>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{s.name}</TableCell>
                <TableCell>{s.description}</TableCell>
                <TableCell>{s.bestFor}</TableCell>
                <TableCell>{s.hearingLossRange}</TableCell>
                <TableCell>{s.occlusion}</TableCell>
                <TableCell>{s.retention}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Selection Decision Flow */}
      <SectionHeading>Selection Decision Flow</SectionHeading>
      <Typography paragraph color="text.secondary">
        Use the following decision tree to guide earmold style selection based on degree of hearing loss
        and patient factors.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>What is the degree of hearing loss?</Typography>

        {/* Mild (high-freq only) */}
        <List disablePadding>
          <ListItem>
            <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
            <ListItemText
              primary="Mild (high-frequency only)"
              secondary="Open dome or micro mold"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <List disablePadding sx={{ pl: 6 }}>
            <ListItem>
              <ListItemIcon><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
              <ListItemText primary="Feedback issues?" secondary="Consider closed dome or canal mold" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
              <ListItemText primary="Retention issues?" secondary="Canal lock or half shell" />
            </ListItem>
          </List>

          {/* Mild-Moderate */}
          <ListItem>
            <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
            <ListItemText
              primary="Mild-Moderate"
              secondary="Closed dome, canal mold, or half shell"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <List disablePadding sx={{ pl: 6 }}>
            <ListItem>
              <ListItemIcon><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
              <ListItemText primary="Good dexterity?" secondary="Canal or skeleton" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
              <ListItemText primary="Poor dexterity?" secondary="Half shell or full shell" />
            </ListItem>
          </List>

          {/* Moderate-Severe */}
          <ListItem>
            <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
            <ListItemText
              primary="Moderate-Severe"
              secondary="Half shell or full shell"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <List disablePadding sx={{ pl: 6 }}>
            <ListItem>
              <ListItemIcon><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
              <ListItemText primary="Feedback?" secondary="Full shell with no vent or pressure vent" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
              <ListItemText primary="Occlusion complaints?" secondary="Maximum venting allowed without feedback" />
            </ListItem>
          </List>

          {/* Severe-Profound */}
          <ListItem>
            <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
            <ListItemText
              primary="Severe-Profound"
              secondary="Full shell (required for seal)"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <List disablePadding sx={{ pl: 6 }}>
            <ListItem>
              <ListItemIcon><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
              <ListItemText primary="Pediatric?" secondary="Full shell, soft material, with retention lock" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Circle sx={{ fontSize: 8 }} /></ListItemIcon>
              <ListItemText primary="Adult?" secondary="Full shell, material based on preference" />
            </ListItem>
          </List>
        </List>
      </Paper>
    </Box>
  );

  // ========================================================================
  // Tab 2 — Materials
  // ========================================================================
  const renderMaterials = () => (
    <Box>
      <SectionHeading>Earmold Materials Comparison</SectionHeading>
      <Typography paragraph color="text.secondary">
        Material selection affects comfort, seal quality, durability, modifiability, and patient
        satisfaction. The right material balances clinical requirements with patient-specific factors.
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Material</strong></TableCell>
              <TableCell><strong>Properties</strong></TableCell>
              <TableCell><strong>Advantages</strong></TableCell>
              <TableCell><strong>Disadvantages</strong></TableCell>
              <TableCell><strong>Best For</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MATERIALS.map((m) => (
              <TableRow key={m.name}>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{m.name}</TableCell>
                <TableCell>{m.properties}</TableCell>
                <TableCell>{m.advantages}</TableCell>
                <TableCell>{m.disadvantages}</TableCell>
                <TableCell>{m.bestFor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Material Selection Guide */}
      <SectionHeading>Material Selection Guide</SectionHeading>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <List disablePadding>
          <ListItem>
            <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
            <ListItemText
              primary="Default starting point: Hard acrylic"
              secondary="Most versatile, easiest to modify"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><ArrowRight color="info" /></ListItemIcon>
            <ListItemText
              primary="Switch to soft when:"
              secondary="Patient has skin sensitivity, severe-profound loss needing seal, pediatric patient, or complaints of discomfort with hard acrylic"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><ArrowRight color="info" /></ListItemIcon>
            <ListItemText
              primary="Silicone when:"
              secondary="Allergy concerns, pediatric, or patient strongly prefers soft"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Warning color="warning" /></ListItemIcon>
            <ListItemText
              primary="Avoid soft vinyl when:"
              secondary="Long-term use expected (shrinkage) or patient has vinyl sensitivity"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );

  // ========================================================================
  // Tab 3 — Acoustic Modifications
  // ========================================================================
  const renderAcousticModifications = () => (
    <Box>
      {/* ---- Venting ---- */}
      <SectionHeading>Venting</SectionHeading>
      <Typography paragraph color="text.secondary">
        A vent is a channel through the earmold that connects the ear canal to the outside air.
        It allows low-frequency sound (both amplified and environmental) to escape, reducing the
        occlusion effect and low-frequency amplification.
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Vent Type</strong></TableCell>
              <TableCell><strong>Diameter</strong></TableCell>
              <TableCell><strong>Low-Freq Effect</strong></TableCell>
              <TableCell><strong>Use When</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {VENT_TYPES.map((v) => (
              <TableRow key={v.name}>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{v.name}</TableCell>
                <TableCell>{v.diameter}</TableCell>
                <TableCell>{v.lowFreqEffect}</TableCell>
                <TableCell>{v.useWhen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">Key Clinical Principle</Typography>
        <Typography variant="body2">
          Larger vent = less low-frequency gain = less occlusion BUT more feedback risk.
          The clinician must balance occlusion relief against feedback control and low-frequency
          amplification needs.
        </Typography>
      </Alert>

      <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          IROS (Intentional Reduction of Output at Specific Frequencies)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A large vent (3 mm+) intentionally reduces low-frequency output. Used when the audiogram
          shows near-normal low-frequency hearing with high-frequency loss -- the patient needs
          high-frequency amplification but not low-frequency amplification.
        </Typography>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* ---- Horn Effect ---- */}
      <SectionHeading>Horn Effect (Libby Horn)</SectionHeading>
      <Typography paragraph color="text.secondary">
        A horn bore is a gradually widening sound channel in the earmold tubing, increasing the
        diameter from the hearing aid end to the canal tip. This boosts high-frequency output
        (typically 2-4 kHz) by 5-10 dB, similar to an acoustic horn.
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Bore Type</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {HORN_TYPES.map((h) => (
              <TableRow key={h.name}>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{h.name}</TableCell>
                <TableCell>{h.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Alert severity="success" sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight="bold">When to Use</Typography>
        <Typography variant="body2">
          Additional high-frequency gain is needed beyond what programming can provide; patient needs
          natural high-frequency boost.
        </Typography>
      </Alert>

      <Divider sx={{ my: 3 }} />

      {/* ---- Acoustic Dampers ---- */}
      <SectionHeading>Acoustic Dampers</SectionHeading>
      <Typography paragraph color="text.secondary">
        Filters placed in the earmold tubing that smooth the frequency response by damping resonance
        peaks (typically the ~1 kHz peak in BTE tubing).
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Damper</strong></TableCell>
              <TableCell><strong>Effect</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DAMPER_TYPES.map((d) => (
              <TableRow key={d.name}>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{d.name}</TableCell>
                <TableCell>{d.effect}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Alert severity="success" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">When to Use</Typography>
        <Typography variant="body2">
          Patient reports &quot;harshness&quot; or &quot;ringing quality&quot; that frequency adjustment
          alone does not resolve; the response curve shows sharp resonance peaks.
        </Typography>
      </Alert>

      <Divider sx={{ my: 3 }} />

      {/* ---- Feedback Management & Vent Size Limits ---- */}
      <SectionHeading>Feedback Management &amp; Vent Size Limits</SectionHeading>
      <Typography paragraph color="text.secondary">
        As vent diameter increases, low-frequency gain decreases (beneficial for reducing occlusion),
        but feedback risk increases proportionally. Feedback occurs when amplified sound leaks back
        through the vent, reaches the microphone, and is re-amplified — creating a loop that produces
        whistling or squealing.
      </Typography>

      <Typography paragraph color="text.secondary">
        The feedback threshold depends on four interacting factors: vent size, gain required at the
        leaking frequencies, ear canal residual volume, and the microphone-to-receiver distance.
        Larger canals tolerate larger vents because the greater volume absorbs more leaked energy
        before it reaches the microphone.
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Vent Diameter</strong></TableCell>
              <TableCell><strong>Low-Freq Effect</strong></TableCell>
              <TableCell><strong>Feedback Risk</strong></TableCell>
              <TableCell><strong>Suitable For</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {VENT_FEEDBACK_LIMITS.map((v) => (
              <TableRow key={v.diameter}>
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{v.diameter}</TableCell>
                <TableCell>{v.lowFreqEffect}</TableCell>
                <TableCell>{v.feedbackRisk}</TableCell>
                <TableCell>{v.suitableFor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">Practical Limits</Typography>
        <Typography variant="body2">
          Vents larger than 2 mm commonly cause feedback at moderate-to-high gain levels. Vents larger
          than 3 mm (including IROS) generally only work with mild losses where minimal gain is needed.
          When feedback occurs with a clinically needed vent size, the options are: (1) reduce vent
          diameter, (2) enable the hearing aid&apos;s feedback management algorithm, or (3) counsel
          the patient on the tradeoff between occlusion relief and feedback control.
        </Typography>
      </Alert>

      <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          IROS Vent (Individually Realistic Open Sound)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A large-diameter vent (3 mm+) designed to vent away low-frequency energy while retaining
          high-frequency amplification. Only viable when gain requirements are minimal — typically
          patients with normal or near-normal low-frequency thresholds and high-frequency loss only.
          If the patient needs meaningful low-frequency gain, an IROS vent will vent away the very
          amplification they require.
        </Typography>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* ---- Own Voice Perception & Occlusion Tradeoff ---- */}
      <SectionHeading>Own Voice Perception &amp; Occlusion Tradeoff</SectionHeading>
      <Typography paragraph color="text.secondary">
        The occlusion effect occurs when bone-conducted sound from the patient&apos;s own voice is
        trapped in a sealed ear canal, producing a hollow, boomy, or &quot;barrel-like&quot; quality.
        The more occluded the fitting (smaller or no vent, full shell, shallow canal depth), the
        worse the own-voice perception — but the better the feedback control and low-frequency
        gain retention.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Does the Patient Need Low-Frequency Gain?</Typography>
        <List disablePadding>
          <ListItem>
            <ListItemIcon><ArrowRight color="success" /></ListItemIcon>
            <ListItemText
              primary="Good low-frequency thresholds (normal at 250-1000 Hz)"
              secondary="Use open coupling or large vent — dramatically reduces occlusion with minimal cost, because the patient does not need low-frequency amplification"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><ArrowRight color="warning" /></ListItemIcon>
            <ListItemText
              primary="Poor low-frequency thresholds (loss at 250-1000 Hz)"
              secondary="Needs gain at those frequencies — must accept more occlusion to retain amplification. Counsel patient on the reason for the sealed fitting and set expectations"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><ArrowRight color="info" /></ListItemIcon>
            <ListItemText
              primary="Sloping loss (good lows, poor highs)"
              secondary="Good candidate for open or vented fitting. The low frequencies are heard naturally while high frequencies are amplified — best of both worlds for own voice perception"
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
        </List>
      </Paper>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight="bold">Counseling vs. Adjustment</Typography>
        <Typography variant="body2">
          If occlusion is mild and the patient is new to hearing aids, counsel first — the brain
          typically adapts over 2-6 weeks and own-voice perception improves. If occlusion is severe
          and persistent despite an adaptation period, adjust the fitting: enlarge the vent (if
          feedback allows), switch to an open dome (if the loss permits), or consider a deeper canal
          fitting which moves the mold tip past the cartilaginous portion of the canal.
        </Typography>
      </Alert>

      <Divider sx={{ my: 3 }} />

      {/* ---- Clinical Tradeoffs ---- */}
      <SectionHeading>Clinical Tradeoffs</SectionHeading>
      <Typography paragraph color="text.secondary">
        Earmold acoustics involve fundamental tradeoffs — improving one parameter often worsens
        another. Understanding these tradeoffs is essential for making informed clinical decisions
        and setting realistic patient expectations.
      </Typography>

      {/* Vent Size Tradeoffs Table */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Vent Size Tradeoffs</Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Want</strong></TableCell>
              <TableCell><strong>Cost</strong></TableCell>
              <TableCell><strong>When Worth It</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {VENT_TRADEOFFS.map((t) => (
              <TableRow key={t.want}>
                <TableCell sx={{ fontWeight: 'bold' }}>{t.want}</TableCell>
                <TableCell>{t.cost}</TableCell>
                <TableCell>{t.whenWorthIt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Counseling vs Adjustment Framework */}
      <Typography variant="h6" gutterBottom>Counseling vs. Adjustment Framework</Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="error.main" gutterBottom>
          When to ADJUST
        </Typography>
        <List disablePadding dense>
          <ListItem>
            <ListItemIcon><Build color="error" sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Feedback is occurring — modify vent, remake earmold, or enable feedback management algorithm" />
          </ListItem>
          <ListItem>
            <ListItemIcon><Build color="error" sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Patient cannot hear adequately — gain adjustment or coupling change needed" />
          </ListItem>
          <ListItem>
            <ListItemIcon><Build color="error" sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Own voice is objectively too resonant for the loss configuration — venting change is clinically appropriate" />
          </ListItem>
        </List>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="success.main" gutterBottom>
          When to COUNSEL
        </Typography>
        <List disablePadding dense>
          <ListItem>
            <ListItemIcon><Hearing color="success" sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="New user experiencing mild occlusion — adaptation period (2-6 weeks); most patients improve significantly" />
          </ListItem>
          <ListItem>
            <ListItemIcon><Hearing color="success" sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Patient wants zero occlusion but needs low-frequency gain — explain the physics and set realistic expectations" />
          </ListItem>
          <ListItem>
            <ListItemIcon><Hearing color="success" sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Mild own-voice awareness without significant distress — normalize the experience and explain it will fade" />
          </ListItem>
        </List>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="info.main" gutterBottom>
          When BOTH (Adjust + Counsel)
        </Typography>
        <List disablePadding dense>
          <ListItem>
            <ListItemIcon><ArrowRight color="info" /></ListItemIcon>
            <ListItemText primary="Patient frustrated with own voice AND needs some low-frequency gain — partial adjustment (moderate vent) plus counseling on remaining adaptation needed" />
          </ListItem>
          <ListItem>
            <ListItemIcon><ArrowRight color="info" /></ListItemIcon>
            <ListItemText primary="Feedback risk limits venting — explain why the vent cannot be larger, and offer feedback management algorithm as a bridge solution" />
          </ListItem>
        </List>
      </Paper>

      {/* Good Low-Frequency Thresholds Special Case */}
      <Alert severity="success" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          Special Case: Good Low-Frequency Thresholds (Normal at 250-1000 Hz)
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Patient profile:</strong> Normal or near-normal thresholds at 250-1000 Hz with
          hearing loss only at 2000 Hz and above.
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          <strong>Recommendation:</strong> Excellent candidate for open fitting or large vent.
          Dramatically reduces occlusion, preserves natural sound quality, and own voice sounds
          normal — because the patient does not need low-frequency gain, venting it away costs
          nothing clinically.
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          <strong>Contrast:</strong> A patient with 40 dB HL at 500 Hz needs amplification at that
          frequency. An open fitting or large vent would vent away the very gain they require,
          causing audibility problems in the low frequencies despite adequate high-frequency
          amplification.
        </Typography>
      </Alert>
    </Box>
  );

  // ========================================================================
  // Tab 4 — Impressions
  // ========================================================================
  const renderImpressions = () => (
    <Box>
      <SectionHeading>When to Take Earmold Impressions</SectionHeading>
      <List disablePadding>
        {[
          'New custom earmold fitting',
          'Remake due to poor fit, feedback, or discomfort',
          'Pediatric patients (every 3-6 months due to growth for young children)',
          'Change in ear canal shape (weight loss/gain, surgery)',
          'Switching from dome to custom mold',
          'Swim molds or musician\'s earplugs',
        ].map((item) => (
          <ListItem key={item} dense>
            <ListItemIcon><CheckCircle color="primary" sx={{ fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />

      {/* Impression Procedure */}
      <SectionHeading>Impression Procedure (9 Steps)</SectionHeading>
      <Typography paragraph color="text.secondary">
        A high-quality ear impression is the foundation of a well-fitting earmold. Follow each step
        carefully to avoid complications and ensure an accurate result.
      </Typography>

      {IMPRESSION_STEPS.map((step) => (
        <Paper key={step.stepNumber} variant="outlined" sx={{ p: 2, mb: 1.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box
            sx={{
              minWidth: 32, height: 32, borderRadius: '50%',
              bgcolor: 'primary.main', color: 'primary.contrastText',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '0.875rem', flexShrink: 0,
            }}
          >
            {step.stepNumber}
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">{step.title}</Typography>
            <Typography variant="body2" color="text.secondary">{step.detail}</Typography>
          </Box>
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* What Can Go Wrong */}
      <SectionHeading>What Can Go Wrong</SectionHeading>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Problem</strong></TableCell>
              <TableCell><strong>Cause</strong></TableCell>
              <TableCell><strong>Prevention</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {IMPRESSION_COMPLICATIONS.map((c) => (
              <TableRow key={c.problem}>
                <TableCell sx={{ fontWeight: 'bold' }}>{c.problem}</TableCell>
                <TableCell>{c.cause}</TableCell>
                <TableCell>{c.prevention}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Contraindications */}
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">Contraindications</Typography>
        <Typography variant="body2">
          Active infection, perforated tympanic membrane (unless ENT-approved), recent ear surgery,
          excessive cerumen that cannot be safely removed. Always perform otoscopy and place an
          otoblock before injecting impression material.
        </Typography>
      </Alert>
    </Box>
  );

  // ========================================================================
  // Tab 5 — Special Populations
  // ========================================================================
  const renderSpecialPopulations = () => (
    <Box>
      {/* Pediatric */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ChildCare color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">Pediatric Considerations</Typography>
          </Box>

          <List disablePadding>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText
                primary="Remake frequency"
                secondary="Every 3-6 months for infants/toddlers; every 6-12 months for school-age children; annually for teens"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText
                primary="Material"
                secondary="Soft materials preferred (silicone or soft vinyl) for safety and comfort"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText
                primary="Style"
                secondary="Full shell for maximum retention; consider tethering clips for young children"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText
                primary="Safety"
                secondary="No small parts; supervise insertion/removal for young children"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText
                primary="Bilateral"
                secondary="Both ears fitted simultaneously whenever possible"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText
                primary="Parent education"
                secondary="Demonstrate insertion, removal, cleaning, troubleshooting"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText
                primary="Feedback management"
                secondary="Children's smaller ears change rapidly -- feedback often means remake time"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="primary" /></ListItemIcon>
              <ListItemText
                primary="Color options"
                secondary="Fun colors increase acceptance and wear time in older children"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Geriatric */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ElderlyWoman color="secondary" sx={{ mr: 1 }} />
            <Typography variant="h5">Geriatric Considerations</Typography>
          </Box>

          <List disablePadding>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="secondary" /></ListItemIcon>
              <ListItemText
                primary="Dexterity"
                secondary="Larger styles (full shell, half shell) easier to handle; consider canal lock for canal molds"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="secondary" /></ListItemIcon>
              <ListItemText
                primary="Vision"
                secondary="High-contrast molds (colored vs. clear) easier to see; tactile markers for left/right identification"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="secondary" /></ListItemIcon>
              <ListItemText
                primary="Skin changes"
                secondary="Aging ear canals may be dryer, more fragile; soft materials may be more comfortable"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem dense>
              <ListItemIcon><ArrowRight color="secondary" /></ListItemIcon>
              <ListItemText
                primary="Cerumen"
                secondary="Increased cerumen production common; regular cleaning schedule critical"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Remake Criteria */}
      <SectionHeading>Remake Criteria</SectionHeading>
      <Typography paragraph color="text.secondary">
        When to remake an earmold -- recognizing the signs and acting promptly prevents patient
        dissatisfaction and potential hearing aid rejection.
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Indicator</strong></TableCell>
              <TableCell><strong>Reason</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {REMAKE_CRITERIA.map((r) => (
              <TableRow key={r.indicator}>
                <TableCell sx={{ fontWeight: 'bold' }}>{r.indicator}</TableCell>
                <TableCell>{r.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // ========================================================================
  // Tab definitions
  // ========================================================================
  const tabItems = [
    { label: 'Types & Styles', icon: <Hearing /> },
    { label: 'Materials', icon: <Science /> },
    { label: 'Acoustic Modifications', icon: <Build /> },
    { label: 'Impressions', icon: <ExpandMore /> },
    { label: 'Special Populations', icon: <ChildCare /> },
  ];

  // ========================================================================
  // Render
  // ========================================================================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Earmolds &amp; Amplification Coupling
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            Types, materials, acoustic modifications, impressions, and clinical decision-making
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

        <TabPanel value={activeTab} index={0}>{renderTypesAndStyles()}</TabPanel>
        <TabPanel value={activeTab} index={1}>{renderMaterials()}</TabPanel>
        <TabPanel value={activeTab} index={2}>{renderAcousticModifications()}</TabPanel>
        <TabPanel value={activeTab} index={3}>{renderImpressions()}</TabPanel>
        <TabPanel value={activeTab} index={4}>{renderSpecialPopulations()}</TabPanel>
      </Paper>
    </Container>
  );
};

export default EarmoldsPage;
