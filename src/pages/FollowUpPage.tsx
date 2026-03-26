import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  HearingOutlined,
  VolumeUp,
  Check,
  ExpandMore,
  Assignment,
  EmojiPeople,
  RecordVoiceOver,
  SelfImprovement,
  Build,
  EventAvailable,
  Tune,
  Help,
} from '@mui/icons-material';

const FollowUpPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 4, md: 6 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <HearingOutlined sx={{ fontSize: { xs: 40, md: 60 }, mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}
          >
            Hearing Aid Follow-Up Appointment Guide
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }, maxWidth: '800px', mx: 'auto' }}
          >
            A reference guide for audiology students covering all components of an effective hearing aid follow-up
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Section 1: Patient Interview */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmojiPeople color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6">1. Patient Interview</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Key Questions to Ask:</Typography>
            <List dense>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="How many hours per day are you wearing your hearing aids?" secondary="Assess daily wear time and consistency" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="In what environments do you use your hearing aids?" secondary="Home, work, restaurants, social gatherings, etc." /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Are there situations where you still have difficulty hearing?" secondary="Identify specific challenging environments" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="How would you rate your overall satisfaction?" secondary="Use a structured scale (1-10 or very dissatisfied to very satisfied)" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Have you noticed any changes in your hearing?" secondary="Changes may indicate need for retesting or medical referral" /></ListItem>
            </List>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>What to listen for:</strong> Pay attention to specific complaints about sound quality, comfort, or situations.
                These will guide your adjustment decisions.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* Section 2: Physical Inspection */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Build color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6">2. Physical Inspection</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Physical Inspection Checklist:</Typography>
            <List dense>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Check for cracks or damage to the case" secondary="Inspect housing, battery door, and receiver" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Check battery door for proper function" secondary="Door should open/close smoothly; check contacts" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Examine tubing/wires for damage or stiffening" secondary="Replace tubing that is yellowed, stiff, or cracked" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Check earmold/dome for wax buildup or damage" secondary="Clean or replace as needed" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Clean microphone ports and receiver openings" secondary="Use cleaning tools appropriate for the device" /></ListItem>
            </List>
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>When to flag for repair:</strong> Visible cracks in housing, intermittent sound, battery door not closing,
                moisture damage indicators triggered, or loose receiver wire.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* Section 3: Listening Check */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VolumeUp color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6">3. Listening Check</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Procedure Steps:</Typography>
            <List dense>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Test multiple input levels" secondary="Soft, moderate, and loud speech to verify WDRC performance" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Check for clear sound quality" secondary="Listen for distortion, intermittency, or static" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Test all programs/memories" secondary="Verify program switching, volume control, and feature toggling" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Check telecoil function" secondary="If equipped, verify telecoil pickup with a phone or loop system" /></ListItem>
            </List>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2 }} gutterBottom>What to Listen for with Stethoscope:</Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                <li><strong>Distortion:</strong> Indicates receiver damage or excessive gain</li>
                <li><strong>Intermittency:</strong> May indicate loose wire, corroded contacts, or moisture</li>
                <li><strong>Feedback/whistling:</strong> Check fit, tubing, and gain settings</li>
                <li><strong>Weak output:</strong> Check battery, wax guard, and receiver</li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Section 4: Adjustments — Cross-link */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tune color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6">4. Adjustments</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                For detailed complaint-based adjustment guidance, see the{' '}
                <Link to="/hearing-aids/adjustments" style={{ color: 'inherit', fontWeight: 'bold' }}>
                  Complaint-Based Adjustments Guide
                </Link>.
              </Typography>
            </Alert>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>When to Adjust vs. When to Counsel:</Typography>
            <List dense>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Adjust when complaints are specific and reproducible" secondary="E.g., 'speech sounds muffled' → increase mid-frequency gain" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Counsel when the issue is adaptation-related" secondary="E.g., 'everything sounds different' in the first 2 weeks → explain acclimatization" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Combine both for best results" secondary="Make small adjustments AND set expectations for adaptation" /></ListItem>
            </List>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Key principle:</strong> Always verify changes with real-ear measurements when possible.
              Make small adjustments (2-3 dB) and confirm with the patient before making additional changes.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Section 5: Patient Education & Counseling */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RecordVoiceOver color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6">5. Patient Education & Counseling</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardHeader avatar={<Build color="primary" />} title="Daily Care" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    • Clean hearing aids daily with a soft, dry cloth<br />
                    • Remove batteries at night (if non-rechargeable)<br />
                    • Store in a dry, safe place<br />
                    • Check for and remove earwax from openings
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardHeader avatar={<SelfImprovement color="primary" />} title="Usage Tips" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    • Start with shorter wear times and gradually increase<br />
                    • Begin in quieter environments before more challenging ones<br />
                    • Take breaks if experiencing fatigue<br />
                    • Use appropriate programs for different environments
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardHeader avatar={<RecordVoiceOver color="primary" />} title="Communication Strategies" />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    • Face the speaker when possible<br />
                    • Reduce background noise<br />
                    • Ask for clarification when needed<br />
                    • Inform others of your hearing needs
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Alert severity="info">
              <Typography variant="body2">
                For patient troubleshooting guides and printable handouts, see the{' '}
                <Link to="/hearing-aids/troubleshooting" style={{ color: 'inherit', fontWeight: 'bold' }}>
                  Troubleshooting & Handouts page
                </Link>.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* Section 6: Follow-Up Planning */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventAvailable color="primary" sx={{ mr: 1.5 }} />
              <Typography variant="h6">6. Follow-Up Planning</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Recommended Follow-Up Intervals:</Typography>
            <List dense>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="2 weeks after initial fitting" secondary="Address early adaptation issues; verify basic function" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="1 month" secondary="Fine-tune based on real-world experience; increase gain toward targets" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="3 months" secondary="Confirm acclimatization; address remaining complaints; REM verification" /></ListItem>
              <ListItem><ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="6-12 months (ongoing)" secondary="Annual hearing retest; hearing aid performance check; programming update" /></ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>When to Schedule Sooner:</Typography>
            <List dense>
              <ListItem><ListItemIcon><Check color="warning" /></ListItemIcon>
                <ListItemText primary="Patient reports significant dissatisfaction" /></ListItem>
              <ListItem><ListItemIcon><Check color="warning" /></ListItemIcon>
                <ListItemText primary="Sound quality changes or hearing aid malfunctions" /></ListItem>
              <ListItem><ListItemIcon><Check color="warning" /></ListItemIcon>
                <ListItemText primary="Physical discomfort or persistent feedback" /></ListItem>
              <ListItem><ListItemIcon><Check color="warning" /></ListItemIcon>
                <ListItemText primary="Change in hearing (sudden or gradual)" /></ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Resources */}
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Resources</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Assignment />}
              component="a"
              href="/audiometry_trainer/assets/follow_up_checklist.html"
              target="_blank"
            >
              Print Follow-Up Checklist
            </Button>
            <Button
              variant="outlined"
              startIcon={<Tune />}
              component={Link}
              to="/hearing-aids/adjustments"
            >
              Complaint-Based Adjustments
            </Button>
            <Button
              variant="outlined"
              startIcon={<Help />}
              component={Link}
              to="/hearing-aids/troubleshooting"
            >
              Troubleshooting & Handouts
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default FollowUpPage;
