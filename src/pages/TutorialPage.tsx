import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme
} from '@mui/material';
import {
  VolumeUp,
  Hearing,
  MusicNote,
  CheckCircleOutline,
  PlayArrow,
  NavigateNext,
  KeyboardArrowDown,
  Help,
  School,
  Psychology,
  WarningAmber
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import audiogramImage from '../assets/audiogram_sample.png';
import audioService from '../services/AudioService';
import { Frequency } from '../interfaces/AudioTypes';

const TutorialPage: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);
  const [playingTone, setPlayingTone] = useState<number | null>(null);

  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  // Play demonstration tone with enhanced functionality
  const playSampleTone = (frequency: number) => {
    // Resume audio context on first interaction
    audioService.resumeAudioContext().then(() => {
      // Set the currently playing tone
      setPlayingTone(frequency);
      
      // Play a medium-loud tone (40 dB) in the right ear for 1 second
      audioService.playTone(frequency as Frequency, 40, 'right', 1000);
      
      // Reset playing status after tone completes
      setTimeout(() => {
        setPlayingTone(null);
      }, 1100); // Slightly longer than tone duration to ensure it completes
    });
  };

  // Handle FAQ expansion
  const handleFaqChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  // Tutorial steps content
  const steps = [
    {
      label: 'Introduction to Pure Tone Audiometry',
      description: (
        <>
          <Typography paragraph>
            Pure Tone Audiometry (PTA) is the gold standard for measuring hearing 
            thresholds. It determines the faintest tones a person can hear at 
            different frequencies.
          </Typography>
          <Typography paragraph>
            In this tutorial, you'll learn how to conduct a PTA test using the 
            Hughson-Westlake procedure (also known as the "5-up, 10-down" method).
          </Typography>
          <Card sx={{ mb: 2 }}>
            <CardMedia
              component="img"
              height="250"
              image={audiogramImage}
              alt="Sample Audiogram"
              sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f5' }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                An audiogram is a graph showing hearing thresholds across different 
                frequencies. The X-axis shows frequencies in Hz, and the Y-axis shows 
                intensity in decibels (dB HL).
              </Typography>
            </CardContent>
          </Card>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Audiometric Equipment:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <VolumeUp color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Audiometer" 
                secondary="Device used to generate pure tones at specific frequencies and intensities" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Hearing color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Transducers" 
                secondary="Headphones (air conduction) or bone conductors (bone conduction)" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MusicNote color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Test Frequencies" 
                secondary="Typically 250, 500, 1000, 2000, 4000, and 8000 Hz" 
              />
            </ListItem>
          </List>
        </>
      ),
    },
    {
      label: 'Understanding the Audiogram',
      description: (
        <>
          <Typography paragraph>
            The audiogram is a standardized graph used to record hearing thresholds.
            Understanding how to read and plot on an audiogram is essential for 
            audiometric testing.
          </Typography>
          
          <Box sx={{ bgcolor: theme.palette.background.paper, p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Key Components of an Audiogram:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutline fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="X-axis: Frequency (Hz)" 
                  secondary="From low (250 Hz) to high (8000 Hz) frequencies" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutline fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Y-axis: Intensity (dB HL)" 
                  secondary="From -10 dB HL (very soft) to 120 dB HL (very loud)" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutline fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Symbols" 
                  secondary="Different symbols for right ear (circles), left ear (X's), and bone conduction" 
                />
              </ListItem>
            </List>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Interpreting Results:
          </Typography>
          <Box sx={{ ml: 2, mb: 2 }}>
            <Typography variant="body2" paragraph>
              <strong>Normal hearing:</strong> Thresholds between -10 and 20 dB HL
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Mild hearing loss:</strong> Thresholds between 21 and 40 dB HL
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Moderate hearing loss:</strong> Thresholds between 41 and 55 dB HL
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Moderately severe hearing loss:</strong> Thresholds between 56 and 70 dB HL
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Severe hearing loss:</strong> Thresholds between 71 and 90 dB HL
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Profound hearing loss:</strong> Thresholds greater than 90 dB HL
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Types of Hearing Loss:
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f0f7ff', height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Conductive Hearing Loss
                </Typography>
                <Typography variant="body2">
                  Problem in outer or middle ear. Air conduction thresholds elevated, 
                  bone conduction thresholds normal.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff4f0', height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Sensorineural Hearing Loss
                </Typography>
                <Typography variant="body2">
                  Problem in inner ear or auditory nerve. Both air and bone conduction 
                  thresholds reduced similarly.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f7f0ff', height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Mixed Hearing Loss
                </Typography>
                <Typography variant="body2">
                  Combination of conductive and sensorineural. Both pathways affected, 
                  but air conduction worse than bone.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      ),
    },
    {
      label: 'The Hughson-Westlake Procedure',
      description: (
        <>
          <Typography paragraph>
            The Hughson-Westlake procedure is the standard method for determining 
            hearing thresholds. It is sometimes called the "5-up, 10-down" method 
            because of its testing pattern.
          </Typography>
          
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Basic Procedure:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NavigateNext color="primary" />
                </ListItemIcon>
                <ListItemText primary="Start at a comfortable level (usually 30-40 dB HL)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NavigateNext color="primary" />
                </ListItemIcon>
                <ListItemText primary="If the patient responds, decrease intensity by 10 dB" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NavigateNext color="primary" />
                </ListItemIcon>
                <ListItemText primary="If the patient does not respond, increase intensity by 5 dB" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NavigateNext color="primary" />
                </ListItemIcon>
                <ListItemText primary="The threshold is the lowest level at which the patient responds at least 50% of the time" />
              </ListItem>
            </List>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Step-by-Step Testing Sequence:
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              1. Familiarize the patient
            </Typography>
            <Typography variant="body2" paragraph>
              Explain the procedure to the patient. Instruct them to respond (e.g., raise a hand) 
              whenever they hear a tone, even if it's very faint.
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              2. Begin testing
            </Typography>
            <Typography variant="body2" paragraph>
              Begin with 1000 Hz at 30-40 dB HL. This is a comfortable listening level for most 
              people with normal hearing.
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              3. Find the approximate threshold
            </Typography>
            <Typography variant="body2" paragraph>
              - If the patient responds, decrease by 10 dB and present again<br />
              - If the patient does not respond, increase by 5 dB and present again<br />
              - Continue until you have a response after an increase and no response after a decrease
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              4. Determine the threshold
            </Typography>
            <Typography variant="body2" paragraph>
              - From the level where the patient last responded, decrease by 10 dB<br />
              - Present tones, increasing by 5 dB each time until the patient responds<br />
              - Repeat this ascending pattern until the patient responds at the same level in 2 out of 3 or 3 out of 5 presentations<br />
              - This level is recorded as the threshold
            </Typography>
            
            <Typography variant="subtitle2" gutterBottom>
              5. Test the frequencies
            </Typography>
            <Typography variant="body2" paragraph>
              Test the following frequencies in this order:<br />
              • 1000 Hz (as a starting point)<br />
              • 2000 Hz<br />
              • 4000 Hz<br />
              • 8000 Hz<br />
              • 500 Hz<br />
              • 250 Hz<br />
              • Retest 1000 Hz (to verify reliability)
            </Typography>
          </Box>
          
          {/* Add practical demonstration of the Hughson-Westlake procedure */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            Practical Demonstration: Up 5, Down 10 Procedure
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" paragraph>
              Click the buttons below to hear how the Hughson-Westlake procedure works in practice. This demonstrates the "up 5 dB, down 10 dB" approach, starting with an audible tone and finding threshold.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Testing sequence at 1000 Hz
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(1000)} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 1000}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      40 dB
                    </Button>
                    <Typography variant="body2">Step 1: Present at 40 dB (patient should hear this)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => {
                        audioService.resumeAudioContext().then(() => {
                          setPlayingTone(1000);
                          audioService.playTone(1000 as Frequency, 30, 'right', 1000);
                          setTimeout(() => setPlayingTone(null), 1100);
                        });
                      }} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      30 dB
                    </Button>
                    <Typography variant="body2">Step 2: Descend by 10 dB to 30 dB</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => {
                        audioService.resumeAudioContext().then(() => {
                          setPlayingTone(1000);
                          audioService.playTone(1000 as Frequency, 20, 'right', 1000);
                          setTimeout(() => setPlayingTone(null), 1100);
                        });
                      }} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      20 dB
                    </Button>
                    <Typography variant="body2">Step 3: Descend by 10 dB to 20 dB</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => {
                        audioService.resumeAudioContext().then(() => {
                          setPlayingTone(1000);
                          audioService.playTone(1000 as Frequency, 10, 'right', 1000);
                          setTimeout(() => setPlayingTone(null), 1100);
                        });
                      }} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      10 dB
                    </Button>
                    <Typography variant="body2">Step 4: Descend by 10 dB to 10 dB</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => {
                        audioService.resumeAudioContext().then(() => {
                          setPlayingTone(1000);
                          audioService.playTone(1000 as Frequency, 0, 'right', 1000);
                          setTimeout(() => setPlayingTone(null), 1100);
                        });
                      }} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      0 dB
                    </Button>
                    <Typography variant="body2">Step 5: Descend by 10 dB to 0 dB (no response)</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Finding threshold
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => {
                        audioService.resumeAudioContext().then(() => {
                          setPlayingTone(1000);
                          audioService.playTone(1000 as Frequency, 5, 'right', 1000);
                          setTimeout(() => setPlayingTone(null), 1100);
                        });
                      }} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      5 dB
                    </Button>
                    <Typography variant="body2">Step 6: Ascend by 5 dB to 5 dB</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => {
                        audioService.resumeAudioContext().then(() => {
                          setPlayingTone(1000);
                          audioService.playTone(1000 as Frequency, 5, 'right', 1000);
                          setTimeout(() => setPlayingTone(null), 1100);
                        });
                      }} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      5 dB
                    </Button>
                    <Typography variant="body2">Step 7: Present at 5 dB again (response 1/2)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => {
                        audioService.resumeAudioContext().then(() => {
                          setPlayingTone(1000);
                          audioService.playTone(1000 as Frequency, 5, 'right', 1000);
                          setTimeout(() => setPlayingTone(null), 1100);
                        });
                      }} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      5 dB
                    </Button>
                    <Typography variant="body2">Step 8: Present at 5 dB again (response 2/3)</Typography>
                  </Box>
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>Result:</strong> Threshold is 5 dB at 1000 Hz (responded to 2/3 presentations)
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              Note: You may not be able to hear the very soft tones (5 dB, 0 dB) depending on your device's audio capabilities and your environment.
            </Typography>
          </Paper>
          
          {/* Interactive tone samples section */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
            Frequency Samples - What Do Different Tones Sound Like?
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" paragraph>
              Click on the buttons below to hear sample tones at different frequencies. Understanding how different frequencies sound will help you identify them during testing.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Low Frequencies
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(125)} 
                      color={playingTone === 125 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 125}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      125 Hz
                    </Button>
                    <Typography variant="body2">Very low pitch (like a deep hum)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(250)} 
                      color={playingTone === 250 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 250}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      250 Hz
                    </Button>
                    <Typography variant="body2">Low pitch (like a low note on piano)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(500)} 
                      color={playingTone === 500 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 500}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      500 Hz
                    </Button>
                    <Typography variant="body2">Low-medium pitch</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Mid Frequencies
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(1000)} 
                      color={playingTone === 1000 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 1000}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      1000 Hz
                    </Button>
                    <Typography variant="body2">Medium pitch (speech clarity)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(1500)} 
                      color={playingTone === 1500 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 1500}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      1500 Hz
                    </Button>
                    <Typography variant="body2">Medium-high pitch</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(2000)} 
                      color={playingTone === 2000 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 2000}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      2000 Hz
                    </Button>
                    <Typography variant="body2">Speech consonants</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  High Frequencies
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(4000)} 
                      color={playingTone === 4000 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 4000}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      4000 Hz
                    </Button>
                    <Typography variant="body2">High pitch (consonant sounds)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(6000)} 
                      color={playingTone === 6000 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 6000}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      6000 Hz
                    </Button>
                    <Typography variant="body2">Very high pitch</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<VolumeUp />}
                      onClick={() => playSampleTone(8000)} 
                      color={playingTone === 8000 ? "secondary" : "primary"}
                      disabled={playingTone !== null && playingTone !== 8000}
                      size="small"
                      sx={{ minWidth: '100px', mr: 1 }}
                    >
                      8000 Hz
                    </Button>
                    <Typography variant="body2">Extremely high pitch (like a whistle)</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              Note: The actual perception of tones may vary depending on your device's speakers or headphones. For best results, use headphones in a quiet environment.
            </Typography>
          </Paper>
        </>
      ),
    },
    {
      label: 'Special Considerations and Masking',
      description: (
        <>
          <Typography paragraph>
            In some cases, additional techniques are needed to obtain accurate results. 
            One important technique is masking, which prevents the non-test ear from 
            hearing the test sounds.
          </Typography>
          
          <Box sx={{ bgcolor: theme.palette.error.light, color: theme.palette.error.contrastText, p: 2, borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningAmber sx={{ mr: 1 }} />
              When is masking necessary?
            </Typography>
            <Typography variant="body2" paragraph sx={{ mt: 1 }}>
              Masking is required when there's a risk that the non-test ear might be hearing 
              the test tones due to crossover. This typically occurs when:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutline sx={{ color: theme.palette.error.contrastText }} />
                </ListItemIcon>
                <ListItemText primary="Air-bone gap ≥ 10 dB (for bone conduction)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutline sx={{ color: theme.palette.error.contrastText }} />
                </ListItemIcon>
                <ListItemText primary="Difference between ears ≥ 40 dB (for air conduction)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutline sx={{ color: theme.palette.error.contrastText }} />
                </ListItemIcon>
                <ListItemText primary="When the non-test ear threshold is better than the test ear threshold" />
              </ListItem>
            </List>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Masking Procedure:
          </Typography>
          
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, mb: 3 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NavigateNext color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Set initial masking level" 
                  secondary="Start with the non-test ear threshold + 10 dB (minimum effective masking)" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NavigateNext color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Present the test tone to the test ear at the previously established threshold" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NavigateNext color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="If the patient still responds, continue testing" 
                  secondary="If not, increase the test tone level until the patient responds again"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NavigateNext color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Increase masking by 5-10 dB and retest" 
                  secondary="Continue until the threshold remains stable with increasing masking (plateau method)"
                />
              </ListItem>
            </List>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Other Special Considerations:
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  False Responses
                </Typography>
                <Typography variant="body2">
                  Be alert for false positive responses. Use silent trials (no tone presented) 
                  occasionally to check reliability.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Patient Fatigue
                </Typography>
                <Typography variant="body2">
                  Testing can be tiring. Watch for signs of fatigue and take breaks 
                  as needed to maintain accuracy.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Asymmetrical Hearing Loss
                </Typography>
                <Typography variant="body2">
                  Significant differences between ears may indicate medical conditions 
                  requiring referral.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Background Noise
                </Typography>
                <Typography variant="body2">
                  Testing should be conducted in a quiet environment. Background noise 
                  can elevate thresholds, especially at lower frequencies.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      ),
    },
    {
      label: 'Practice and Next Steps',
      description: (
        <>
          <Typography paragraph>
            Now that you understand the theoretical aspects of Pure Tone Audiometry and 
            the Hughson-Westlake procedure, it's time to practice with virtual patients.
          </Typography>
          
          <Paper elevation={0} sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Practice with Virtual Patients
            </Typography>
            <Typography paragraph>
              Our virtual patient system allows you to practice audiometry with 
              simulated cases of varying difficulty and types of hearing loss.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              to="/patients"
              sx={{ mt: 1 }}
            >
              Go to Virtual Patients
            </Button>
          </Paper>
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Tips for Effective Testing:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <School color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Be systematic and consistent" 
                secondary="Follow the same procedure for each patient for comparable results" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Psychology color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Observe the patient carefully" 
                secondary="Watch for signs of understanding, concentration, or fatigue" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Help color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="When in doubt, repeat" 
                secondary="If results seem inconsistent, it's better to retest than to record uncertain values" 
              />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Further Learning Resources:
            </Typography>
            <List>
              <ListItem 
                component="a" 
                href="https://www.asha.org/practice-portal/clinical-topics/adult-hearing-screening/" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                American Speech-Language-Hearing Association (ASHA) Guidelines
              </ListItem>
              <ListItem 
                component="a" 
                href="https://www.thebsa.org.uk/resources/pure-tone-air-bone-conduction-threshold-audiometry-with-without-masking/" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                British Society of Audiology Recommended Procedures
              </ListItem>
              <ListItem 
                component="a" 
                href="https://www.audiology.org/publications-resources/journal-american-academy-audiology/" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Journal of the American Academy of Audiology
              </ListItem>
            </List>
          </Box>
        </>
      ),
    },
  ];

  // FAQ content
  const faqs = [
    {
      id: 'faq1',
      question: 'What is the difference between air and bone conduction testing?',
      answer: 'Air conduction testing measures the entire auditory system (outer, middle, and inner ear) using headphones. Bone conduction testing bypasses the outer and middle ear by using a vibrator placed on the mastoid bone, measuring inner ear function directly.'
    },
    {
      id: 'faq2',
      question: 'Why test specific frequencies in a particular order?',
      answer: 'Testing starts at 1000 Hz because it\'s in the speech range and easily heard by most people. We then test higher frequencies (which are often affected first in hearing loss), followed by lower frequencies. Retesting 1000 Hz verifies reliability.'
    },
    {
      id: 'faq3',
      question: 'What does the "5-up, 10-down" name refer to?',
      answer: 'This refers to the pattern of intensity changes: when a patient doesn\'t hear a tone, we increase the intensity by 5 dB; when they do hear it, we decrease by 10 dB. This approach efficiently narrows down to the threshold.'
    },
    {
      id: 'faq4',
      question: 'How accurate is pure-tone audiometry?',
      answer: 'When performed correctly in a controlled environment by a trained audiologist, pure-tone audiometry is highly accurate. Test-retest reliability is typically within 5-10 dB, depending on the frequency tested and patient factors.'
    },
    {
      id: 'faq5',
      question: 'Why are there different symbols on the audiogram?',
      answer: 'Different symbols help distinguish between ears and testing methods. Typically: O = right ear air conduction, X = left ear air conduction, < = right ear bone conduction, > = left ear bone conduction, and brackets [ ] indicate masking was used.'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pure Tone Audiometry Tutorial
      </Typography>
      <Typography variant="subtitle1" paragraph color="text.secondary">
        Learn the Hughson-Westlake procedure, understand audiogram interpretation, 
        and master practical skills for hearing assessment.
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label} completed={completed[index]}>
                  <StepLabel>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {step.label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    {step.description}
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleReset : handleComplete}
                        sx={{ mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Start Again' : 'Complete Step'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Button
                        disabled={index === steps.length - 1}
                        onClick={handleNext}
                        sx={{ mr: 1 }}
                      >
                        Skip
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Frequently Asked Questions
            </Typography>
            
            {faqs.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expandedFaq === faq.id}
                onChange={handleFaqChange(faq.id)}
                elevation={0}
                sx={{ 
                  '&:before': { display: 'none' },
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <AccordionSummary expandIcon={<KeyboardArrowDown />}>
                  <Typography fontWeight="medium">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
          
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Key Terms to Know
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label="Threshold" size="small" />
                <Chip label="dB HL" size="small" />
                <Chip label="Air-bone gap" size="small" />
                <Chip label="Masking" size="small" />
                <Chip label="Conductive" size="small" />
                <Chip label="Sensorineural" size="small" />
                <Chip label="Audiogram" size="small" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Ready to Practice?
              </Typography>
              <Typography variant="body2" paragraph>
                Apply what you've learned by testing virtual patients with various hearing profiles.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                component={Link}
                to="/patients"
              >
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TutorialPage; 