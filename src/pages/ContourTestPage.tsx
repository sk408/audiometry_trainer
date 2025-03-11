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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  VolumeUp,
  ExpandMore,
  HearingOutlined,
  School as SchoolIcon,
  Psychology,
  Assignment,
  CheckCircle,
  SpeakerPhone,
  Help,
  ArrowForward
} from '@mui/icons-material';

import ContourTestForm from '../components/ContourTestForm';
import ContourTestResults from '../components/ContourTestResults';
import { ContourTestResults as ContourResults } from '../types/ContourTest';
import { ContourTestService } from '../services/ContourTestService';

const ContourTestPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [testResults, setTestResults] = useState<ContourResults | null>(null);
  const [testCompleted, setTestCompleted] = useState(false);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setTestResults(null);
    setTestCompleted(false);
  };
  
  const handleSaveResults = (results: ContourResults) => {
    setTestResults(results);
    setTestCompleted(true);
    handleNext();
  };
  
  // Steps for contour test procedure
  const steps = [
    {
      label: 'Introduction',
      description: 'Learn about the contour test and its purpose',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>What is a Contour Test?</Typography>
          
          <Typography variant="body1" paragraph>
            The contour test is a psychoacoustic procedure used to evaluate a patient's subjective 
            perception of loudness across different intensity levels. It is particularly useful for 
            patients with loudness complaints, such as recruitment or hyperacusis.
          </Typography>
          
          <Typography variant="body1" paragraph>
            The test maps a patient's subjective loudness growth by having them rate sounds at 
            different intensity levels using standardized loudness categories. This helps audiologists 
            understand how the patient perceives loudness across their hearing range.
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">
              When to use the Contour Test:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
                <ListItemText primary="When patients complain that sounds become uncomfortably loud too quickly" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
                <ListItemText primary="To assess recruitment (abnormal growth of loudness perception)" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
                <ListItemText primary="To determine appropriate gain and output settings for hearing aids" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
                <ListItemText primary="To evaluate hyperacusis (decreased sound tolerance)" />
              </ListItem>
            </List>
          </Alert>
          
          <Typography variant="h6" gutterBottom>Key Measurements</Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader 
                  avatar={<VolumeUp color="success" />}
                  title="MCL"
                  subheader="Most Comfortable Level"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    The intensity level that the patient reports as comfortably loud. 
                    Typically corresponds to category 4 ("Comfortable") on the loudness scale.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader 
                  avatar={<VolumeUp color="warning" />}
                  title="UCL"
                  subheader="Uncomfortable Level"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    The lowest intensity level that the patient reports as uncomfortably loud.
                    Typically corresponds to category 7 ("Uncomfortably Loud") on the loudness scale.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader 
                  avatar={<VolumeUp color="info" />}
                  title="Dynamic Range"
                  subheader="UCL - MCL"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    The range between comfortable and uncomfortable loudness levels.
                    Important for proper hearing aid fitting and compression settings.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Continue to Procedure
          </Button>
        </Box>
      )
    },
    {
      label: 'Test Procedure',
      description: 'Learn how to administer the contour test',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Contour Test Procedure</Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Required Equipment:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary="Audiometer with frequency-specific pure tone capability" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary="Headphones or insert earphones" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary="Loudness categories chart (visual aid for patient)" />
              </ListItem>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary="Recording form or software" />
              </ListItem>
            </List>
          </Paper>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Step-by-Step Procedure:
          </Typography>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1">1. Patient Instructions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                Begin by explaining the purpose of the test and the procedure to the patient:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "In this test, I'll play tones at different loudness levels, and I want you to rate how loud they sound to you using this scale from 0 to 7. Zero means you cannot hear the sound, 1 is very soft, 4 is comfortably loud, and 7 is uncomfortably loud. Please be honest with your ratings - there are no right or wrong answers. We're trying to understand how you perceive different loudness levels."
                </Typography>
              </Paper>
              
              <Typography variant="body2" sx={{ mt: 2 }}>
                Show the patient the loudness categories chart and make sure they understand all categories:
              </Typography>
              
              <List dense>
                {ContourTestService.LOUDNESS_CATEGORIES.map((category, index) => (
                  <ListItem key={index}>
                    <ListItemIcon><Typography variant="body1">{index}</Typography></ListItemIcon>
                    <ListItemText primary={category} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="subtitle1">2. Frequency Selection</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                Typically, contour tests are performed at specific frequencies relevant to the patient's complaints or audiogram:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><SpeakerPhone color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="500 Hz" 
                    secondary="Low-frequency assessment (useful for patients with low-frequency hearing loss)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SpeakerPhone color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="1000 Hz" 
                    secondary="Mid-frequency assessment (often good for general loudness assessment)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SpeakerPhone color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="2000 Hz" 
                    secondary="High-frequency assessment (often shows recruitment in patients with sensorineural loss)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SpeakerPhone color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="4000 Hz" 
                    secondary="High-frequency assessment (useful for noise-induced hearing loss assessments)" 
                  />
                </ListItem>
              </List>
              <Typography variant="body2" paragraph>
                For clinical efficiency, start with 1000 Hz or the frequency where the patient reports the most 
                loudness issues. Multiple frequencies can be tested if time permits.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography variant="subtitle1">3. Testing Procedure</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                Follow these steps for each frequency being tested:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Begin near the patient's threshold for the test frequency (typically 10-15 dB above their threshold)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Present a 1-2 second pure tone at the selected intensity level" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Ask the patient to rate the loudness using the 0-7 scale" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Record the intensity level and the corresponding loudness rating" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Increase intensity by 5-10 dB and repeat until the patient reports a rating of 7 (uncomfortably loud) or until you reach the maximum safe output limit (typically 110-120 dB HL)" 
                    secondary="Note: Ensure you don't exceed safe exposure levels. Stop if patient reports discomfort."
                  />
                </ListItem>
              </List>
              <Alert severity="warning" sx={{ mt: 2 }}>
                Never exceed safe exposure levels. If the patient reports significant discomfort, stop increasing the intensity immediately.
              </Alert>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography variant="subtitle1">4. Data Collection & Analysis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                As you collect ratings at different intensity levels, you'll build a loudness growth function for the patient:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Record at least 5-7 data points across the intensity range" 
                    secondary="More data points provide a more accurate loudness growth function"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Identify the Most Comfortable Level (MCL)" 
                    secondary="This is typically the intensity level rated as category 4"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Identify the Uncomfortable Level (UCL)" 
                    secondary="This is the lowest intensity level rated as category 7"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Calculate the dynamic range (UCL - MCL)" 
                    secondary="This is important for hearing aid fitting"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Examine the slope of the loudness growth function" 
                    secondary="A steep slope may indicate recruitment"
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
          
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
              Continue to Data Entry
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Data Entry',
      description: 'Enter contour test measurements',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Enter Contour Test Data</Typography>
          
          <Typography variant="body1" paragraph>
            Enter the loudness ratings collected during the contour test. For each intensity level presented, 
            record the corresponding loudness rating provided by the patient.
          </Typography>
          
          <ContourTestForm 
            onSaveResults={handleSaveResults}
            initialResults={testResults || undefined}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          </Box>
        </Box>
      )
    },
    {
      label: 'Results & Analysis',
      description: 'View test results and recommendations',
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Contour Test Results & Analysis</Typography>
          
          {testCompleted && testResults ? (
            <>
              <Typography variant="body1" paragraph>
                Below are the results of the contour test and analysis of the patient's loudness perception.
                Use this information to guide hearing aid programming and counseling.
              </Typography>
              
              <ContourTestResults 
                results={testResults}
                analysis={ContourTestService.analyzeResults(testResults)}
              />
            </>
          ) : (
            <Alert severity="warning">
              Please complete the contour test data entry before viewing results.
            </Alert>
          )}
          
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
              onClick={handleReset}
            >
              Start New Test
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
          <VolumeUp sx={{ fontSize: { xs: 40, md: 60 }, mb: 2 }} />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}
          >
            Contour Test for Loudness Perception
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }, maxWidth: '800px', mx: 'auto' }}
          >
            A tool for evaluating subjective loudness perception to guide hearing aid fittings and manage loudness complaints
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
                Understanding Loudness Perception
              </Typography>
              <Typography variant="body1" paragraph>
                Loudness perception is a complex psychoacoustic phenomenon that varies among individuals, especially those with hearing loss.
              </Typography>
              <Typography variant="body1">
                Key concepts in loudness perception:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Psychology color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Loudness Recruitment" 
                    secondary="Abnormally rapid growth of loudness, common in cochlear hearing loss" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><HearingOutlined color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Hyperacusis" 
                    secondary="Increased sensitivity to everyday sounds that others find comfortable" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><VolumeUp color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Dynamic Range" 
                    secondary="The range between threshold and uncomfortable loudness" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SpeakerPhone color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Frequency-Specific Effects" 
                    secondary="Loudness perception can vary by frequency" 
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Clinical Applications
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Assignment color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Hearing Aid Fitting" 
                    secondary="Guide compression settings and maximum output" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Patient Counseling" 
                    secondary="Help explain loudness perception issues to patients" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Help color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Troubleshooting" 
                    secondary="Diagnose complaints about hearing aid loudness" 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Right Side - Interactive Process */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Contour Test Guide
              </Typography>
              <Typography variant="body1" paragraph>
                This interactive guide will help you administer a contour test, record the results, and interpret the findings for clinical application.
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

export default ContourTestPage; 