import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  IconButton,
  Rating,
  Alert,
  Chip,
  useTheme,
  useMediaQuery,
  Checkbox
} from '@mui/material';
import {
  HearingOutlined,
  VolumeUp,
  Settings,
  Check,
  Help,
  ExpandMore,
  ArrowForward,
  Assignment,
  EmojiPeople,
  RecordVoiceOver,
  SelfImprovement,
  QuestionAnswer,
  Build,
  EventAvailable
} from '@mui/icons-material';

const FollowUpPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [satisfactionRating, setSatisfactionRating] = useState<number | null>(null);
  
  // Demo data for the follow-up form
  const [followUpData, setFollowUpData] = useState({
    wearTime: '',
    environments: '',
    hearingDifficulties: '',
    physicalComfort: '',
    soundQuality: '',
    batteryLife: '',
    feedback: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFollowUpData({
      ...followUpData,
      [field]: value
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Steps for follow-up appointment
  const steps = [
    {
      label: 'Interview',
      description: 'Assess satisfaction and identify any concerns',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Patient Interview</Typography>
          
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Daily wear time (hours)"
            placeholder="Ask: How many hours per day do you wear your hearing aids?"
            value={followUpData.wearTime}
            onChange={(e) => handleInputChange('wearTime', e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Listening environments"
            placeholder="Ask: In what environments do you use your hearing aids? (home, work, restaurants, etc.)"
            value={followUpData.environments}
            onChange={(e) => handleInputChange('environments', e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Hearing difficulties"
            placeholder="Ask: Are there any situations where you still experience hearing difficulties?"
            value={followUpData.hearingDifficulties}
            onChange={(e) => handleInputChange('hearingDifficulties', e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Overall satisfaction</Typography>
            <Rating
              name="satisfaction"
              value={satisfactionRating}
              onChange={(event, newValue) => {
                setSatisfactionRating(newValue);
              }}
              icon={<HearingOutlined fontSize="large" />}
              emptyIcon={<HearingOutlined fontSize="large" />}
              max={5}
            />
            {satisfactionRating && (
              <Typography variant="body2" color="text.secondary">
                {satisfactionRating < 3 ? 'Not satisfied' : satisfactionRating < 5 ? 'Moderately satisfied' : 'Very satisfied'}
              </Typography>
            )}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Continue to Physical Check
          </Button>
        </Box>
      )
    },
    {
      label: 'Physical Check',
      description: 'Inspect hearing aids for damage and proper function',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Physical Inspection</Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Physical Inspection Checklist</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Check for cracks or damage to the case" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Check battery door for proper function" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Examine tubing/wires for damage or stiffening" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Check earmold/dome for wax buildup or damage" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Check color="primary" /></ListItemIcon>
                <ListItemText primary="Clean microphone ports and receiver openings" />
              </ListItem>
            </List>
          </Paper>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Physical comfort notes"
            placeholder="Document any issues with physical comfort, fit, or irritation"
            value={followUpData.physicalComfort}
            onChange={(e) => handleInputChange('physicalComfort', e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Continue to Listening Check
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Listening Check',
      description: 'Verify hearing aid function and sound quality',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Listening Check</Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Use a listening stethoscope to verify the hearing aid is functioning properly. 
            Check for distortion, intermittency, or feedback.
          </Alert>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Listening Check Procedure</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><VolumeUp color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Test multiple input levels" 
                  secondary="Soft, moderate, and loud speech" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><VolumeUp color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Check for clear sound quality" 
                  secondary="No distortion or intermittency" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><VolumeUp color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Test all programs/memories" 
                  secondary="Program switching, volume control, other features" 
                />
              </ListItem>
            </List>
          </Paper>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Sound quality notes"
            placeholder="Document any issues with sound quality, distortion, or feedback"
            value={followUpData.soundQuality}
            onChange={(e) => handleInputChange('soundQuality', e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Continue to Adjustments
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Adjustments',
      description: 'Make programming changes as needed',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Hearing Aid Adjustments</Typography>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            Connect to manufacturer's fitting software to make adjustments. 
            Always verify changes with real-ear measurements when possible.
          </Alert>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Volume Adjustments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" gutterBottom>
                Adjust overall gain or specific frequency regions based on patient feedback.
              </Typography>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography id="low-freq-slider" gutterBottom>
                  Low Frequencies (250-1000 Hz)
                </Typography>
                <Slider
                  aria-labelledby="low-freq-slider"
                  defaultValue={0}
                  step={1}
                  marks
                  min={-10}
                  max={10}
                  valueLabelDisplay="auto"
                />
                
                <Typography id="mid-freq-slider" gutterBottom>
                  Mid Frequencies (1000-3000 Hz)
                </Typography>
                <Slider
                  aria-labelledby="mid-freq-slider"
                  defaultValue={0}
                  step={1}
                  marks
                  min={-10}
                  max={10}
                  valueLabelDisplay="auto"
                />
                
                <Typography id="high-freq-slider" gutterBottom>
                  High Frequencies (3000-8000 Hz)
                </Typography>
                <Slider
                  aria-labelledby="high-freq-slider"
                  defaultValue={0}
                  step={1}
                  marks
                  min={-10}
                  max={10}
                  valueLabelDisplay="auto"
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Program Adjustments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                Modify existing programs or add new ones for specific listening environments.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Select program to adjust</FormLabel>
                    <RadioGroup
                      row
                      aria-label="program"
                      name="program"
                      defaultValue="everyday"
                    >
                      <FormControlLabel value="everyday" control={<Radio />} label="Everyday" />
                      <FormControlLabel value="noisy" control={<Radio />} label="Noisy" />
                      <FormControlLabel value="restaurant" control={<Radio />} label="Restaurant" />
                      <FormControlLabel value="music" control={<Radio />} label="Music" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography>Additional Features</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Noise Reduction"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Directional Microphones"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Wind Noise Reduction"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Feedback Cancellation"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 2 }}>
            <Button
              color="inherit"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Continue to Education
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Patient Education',
      description: 'Review care instructions and usage tips',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Patient Education and Care Instructions</Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardHeader 
                  avatar={<Build color="primary" />} 
                  title="Daily Care" 
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    • Clean hearing aids daily with a soft, dry cloth
                    <br/>
                    • Remove batteries at night (if non-rechargeable)
                    <br/>
                    • Store in a dry, safe place
                    <br/>
                    • Check for and remove earwax from openings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardHeader 
                  avatar={<SelfImprovement color="primary" />} 
                  title="Usage Tips" 
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    • Start with shorter wear times and gradually increase
                    <br/>
                    • Begin in quieter environments before more challenging ones
                    <br/>
                    • Take breaks if experiencing fatigue
                    <br/>
                    • Use appropriate programs for different environments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardHeader 
                  avatar={<RecordVoiceOver color="primary" />} 
                  title="Communication Strategies" 
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    • Face the speaker when possible
                    <br/>
                    • Reduce background noise
                    <br/>
                    • Ask for clarification when needed
                    <br/>
                    • Inform others of your hearing needs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Troubleshooting Common Issues
          </Typography>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1b-content"
              id="panel1b-header"
            >
              <Typography>Whistling or Feedback</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                • Check for proper insertion of earmold/dome<br/>
                • Make sure the dome/mold is the correct size<br/>
                • Check for wax buildup in the ear canal<br/>
                • Consult your audiologist if problem persists
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2b-content"
              id="panel2b-header"
            >
              <Typography>No Sound</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                • Check if hearing aid is turned on<br/>
                • Check/replace battery<br/>
                • Check if volume is turned up<br/>
                • Make sure sound outlet is not blocked by wax<br/>
                • Try a different program
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel3b-content"
              id="panel3b-header"
            >
              <Typography>Sound Quality Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                • Check/clean microphone openings<br/>
                • Check/replace wax filter<br/>
                • Check for moisture (use a drying kit if available)<br/>
                • Consult your audiologist for reprogramming if needed
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel4b-content"
              id="panel4b-header"
            >
              <Typography>Own Voice Perception Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                • Reassure patients this is normal and temporary (occlusion effect)<br/>
                • Check for proper venting in the earmold/dome<br/>
                • Adjust gain in low frequencies if voice sounds "boomy"<br/>
                • Consider open fit if appropriate for the hearing loss<br/>
                • Explain adaptation process may take 2-4 weeks<br/>
                • Try reading aloud daily to speed up adaptation
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel5b-content"
              id="panel5b-header"
            >
              <Typography>Loudness/Sound Tolerance Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                • Verify appropriate gain settings for patient's hearing loss<br/>
                • Check if appropriate acclimatization settings are enabled<br/>
                • Consider gradual increase in amplification over several weeks<br/>
                • Show patient how to adjust volume (if available)<br/>
                • Create a quieter program for sensitive situations<br/>
                • For sudden loud sounds, ensure appropriate compression settings
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel6b-content"
              id="panel6b-header"
            >
              <Typography>Hearing in Noisy Situations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                • Ensure directional microphones are activated<br/>
                • Set up a specific "restaurant" or "noise" program<br/>
                • Verify noise reduction features are enabled<br/>
                • Teach proper positioning (face speaker, back to noise)<br/>
                • Consider accessory microphones for very difficult situations<br/>
                • Explain realistic expectations about hearing in noise
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel7b-content"
              id="panel7b-header"
            >
              <Typography>Environmental Sounds Issues (Water, Dishes)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                • Explain that these sounds were previously inaudible to the patient<br/>
                • For running water: adjust high frequency gain if too sharp/harsh<br/>
                • For dishes clattering: consider reducing gain above 4000 Hz<br/>
                • Create a "home" program with reduced high frequencies<br/>
                • Reassure that brain adaptation will reduce awareness over time<br/>
                • Recommend gradual exposure to re-learn environmental sounds
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, mt: 2 }}>
            <Button
              color="inherit"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Complete Follow-Up
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Summary & Follow-Up Plan',
      description: 'Summarize findings and create a follow-up plan',
      content: (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success" sx={{ mb: 4 }}>
            Follow-up appointment completed!
          </Alert>
          
          <Typography variant="h6" gutterBottom>Appointment Summary</Typography>
          
          <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Key Findings</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Daily Usage:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {followUpData.wearTime || "Not specified"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Remaining Difficulties:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {followUpData.hearingDifficulties || "Not specified"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Physical Condition:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {followUpData.physicalComfort || "No issues reported"}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Sound Quality:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {followUpData.soundQuality || "No issues reported"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Adjustments Made</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="Volume adjustments" />
                  <Chip label="Program modifications" />
                  <Chip label="Feature settings" />
                  <Chip label="Physical maintenance" />
                </Box>
                
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Overall Satisfaction</Typography>
                <Rating
                  value={satisfactionRating || 0}
                  readOnly
                  icon={<HearingOutlined fontSize="large" />}
                  emptyIcon={<HearingOutlined fontSize="large" />}
                  max={5}
                />
              </Grid>
            </Grid>
          </Paper>
          
          <Typography variant="h6" gutterBottom>Follow-Up Plan</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventAvailable color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Next Appointment</Typography>
                  </Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel>Recommended follow-up timeframe:</FormLabel>
                    <RadioGroup
                      row
                      defaultValue="3months"
                    >
                      <FormControlLabel value="1month" control={<Radio />} label="1 month" />
                      <FormControlLabel value="3months" control={<Radio />} label="3 months" />
                      <FormControlLabel value="6months" control={<Radio />} label="6 months" />
                      <FormControlLabel value="1year" control={<Radio />} label="1 year" />
                    </RadioGroup>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Additional comments"
                    multiline
                    rows={2}
                    placeholder="Add any additional notes for the next appointment"
                    value={followUpData.feedback}
                    onChange={(e) => handleInputChange('feedback', e.target.value)}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <QuestionAnswer color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Support Between Visits</Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Patient is encouraged to contact the clinic if:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Check color="primary" /></ListItemIcon>
                      <ListItemText primary="Sound quality changes or deteriorates" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Check color="primary" /></ListItemIcon>
                      <ListItemText primary="Physical discomfort develops" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Check color="primary" /></ListItemIcon>
                      <ListItemText primary="Persistent feedback occurs" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Check color="primary" /></ListItemIcon>
                      <ListItemText primary="Hearing aid is damaged or malfunctions" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3, mt: 2 }}>
            <Button
              color="inherit"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleReset}
            >
              Start New Follow-Up
            </Button>
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 4, md: 6 },
          px: 2,
          textAlign: 'center'
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
            A comprehensive guide for audiology students to conduct effective hearing aid follow-up appointments
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Left Side - Information */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                About Follow-Up Appointments
              </Typography>
              <Typography variant="body1" paragraph>
                Follow-up appointments are crucial for ensuring patient satisfaction and optimal benefit from hearing aids.
                They allow audiologists to address concerns, make adjustments, and provide additional counseling.
              </Typography>
              <Typography variant="body1">
                Key aspects of a successful follow-up include:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><EmojiPeople color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Patient Experience Assessment" 
                    secondary="Evaluate satisfaction and identify challenges" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Build color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Technical Evaluation" 
                    secondary="Check physical condition and performance" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Settings color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Adjustments & Fine-Tuning" 
                    secondary="Optimize settings based on feedback" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><RecordVoiceOver color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Counseling & Education" 
                    secondary="Reinforce proper use and care techniques" 
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Resources
              </Typography>
              <List>
                <ListItem component="a" href="/apprentice/assets/follow_up_checklist.html" target="_blank">
                  <ListItemIcon><Assignment color="primary" /></ListItemIcon>
                  <ListItemText primary="Follow-Up Appointment Checklist" />
                </ListItem>
                <ListItem component="a" href="#" target="_blank">
                  <ListItemIcon><Help color="primary" /></ListItemIcon>
                  <ListItemText primary="Troubleshooting Guide" />
                </ListItem>
                <ListItem component="a" href="#" target="_blank">
                  <ListItemIcon><HearingOutlined color="primary" /></ListItemIcon>
                  <ListItemText primary="Hearing Aid User Guides" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Right Side - Interactive Process */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Follow-Up Appointment Workflow
              </Typography>
              <Typography variant="body1" paragraph>
                Work through each step of a typical hearing aid follow-up appointment. This interactive guide will help you practice the essential components of a thorough follow-up.
              </Typography>
              
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>
                      <Typography variant="subtitle1">{step.label}</Typography>
                      <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                    </StepLabel>
                    <StepContent>
                      {step.content}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FollowUpPage;