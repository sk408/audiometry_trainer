import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Alert,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ArrowForward, 
  ArrowBack, 
  VolumeUp, 
  HearingOutlined,
  AccessTime,
  BarChart,
  School,
  Info
} from '@mui/icons-material';
import audioService from '../services/AudioService';
import { Frequency } from '../interfaces/AudioTypes';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [playingTone, setPlayingTone] = useState<number | null>(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    onComplete();
  };

  // Play a sample tone
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

  // Tutorial steps for audiometric testing
  const steps = [
    {
      label: 'Introduction to Pure Tone Audiometry',
      description: `Pure tone audiometry is a behavioral test used to measure hearing sensitivity 
                   across different frequencies. This test identifies the softest sound a person can 
                   hear at each frequency tested. The results are plotted on an audiogram which 
                   provides a visual representation of a person's hearing threshold levels.`,
      content: (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Key Concepts
                </Typography>
                <Typography variant="body2" paragraph>
                  1. <strong>Frequency (pitch)</strong>: Measured in Hertz (Hz)
                </Typography>
                <Typography variant="body2" paragraph>
                  2. <strong>Intensity (loudness)</strong>: Measured in decibels (dB HL)
                </Typography>
                <Typography variant="body2" paragraph>
                  3. <strong>Threshold</strong>: The softest level a sound can be perceived 50% of the time
                </Typography>
                <Typography variant="body2">
                  4. <strong>Air and Bone Conduction</strong>: Testing methods to distinguish between types of hearing loss
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Equipment Used
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Audiometer</strong>: Electronic device generating pure tones
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Headphones</strong>: For air conduction testing
                </Typography>
                <Typography variant="body2" paragraph>
                  • <strong>Bone Conductor</strong>: For bone conduction testing
                </Typography>
                <Typography variant="body2">
                  • <strong>Sound-treated Room</strong>: For minimizing background noise
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info" icon={<Info />}>
              This tutorial will guide you through the entire process of conducting a pure tone audiometry test following the Hughson-Westlake procedure.
            </Alert>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Understanding the Audiogram',
      description: `The audiogram is a graph used to record hearing thresholds. Frequency (Hz) is displayed 
                   on the horizontal axis and intensity (dB HL) on the vertical axis. Lower numbers 
                   on the vertical axis represent better hearing.`,
      content: (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Standard Audiogram Symbols
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Right Ear
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'red', mr: 1 }} />
                    <Typography variant="body2">Air Conduction (O)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-block', 
                        width: 0, 
                        height: 0, 
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderLeft: '12px solid red',
                        mr: 1 
                      }} 
                    />
                    <Typography variant="body2">Bone Conduction (&lt;)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'transparent', border: '2px solid red', mr: 1 }} />
                    <Typography variant="body2">Masked Air Conduction (△)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: 'transparent', border: '2px solid red', mr: 1 }} />
                    <Typography variant="body2">Masked Bone Conduction ([)</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Left Ear
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ position: 'relative', width: 12, height: 12, mr: 1 }}>
                      <Box sx={{ position: 'absolute', width: 12, height: 2, bgcolor: 'blue', top: 5, transform: 'rotate(45deg)' }} />
                      <Box sx={{ position: 'absolute', width: 12, height: 2, bgcolor: 'blue', top: 5, transform: 'rotate(-45deg)' }} />
                    </Box>
                    <Typography variant="body2">Air Conduction (X)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-block', 
                        width: 0, 
                        height: 0, 
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                        borderRight: '12px solid blue',
                        mr: 1 
                      }} 
                    />
                    <Typography variant="body2">Bone Conduction (&gt;)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: 'transparent', border: '2px solid blue', mr: 1 }} />
                    <Typography variant="body2">Masked Air Conduction (□)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: 'transparent', border: '2px solid blue', borderRadius: '0 3px 3px 0', mr: 1 }} />
                    <Typography variant="body2">Masked Bone Conduction (])</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Interpreting Hearing Loss
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Degree of Hearing Loss
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li><Typography variant="body2">-10 to 25 dB HL: Normal hearing</Typography></li>
                  <li><Typography variant="body2">26 to 40 dB HL: Mild hearing loss</Typography></li>
                  <li><Typography variant="body2">41 to 55 dB HL: Moderate hearing loss</Typography></li>
                  <li><Typography variant="body2">56 to 70 dB HL: Moderately severe hearing loss</Typography></li>
                  <li><Typography variant="body2">71 to 90 dB HL: Severe hearing loss</Typography></li>
                  <li><Typography variant="body2">91+ dB HL: Profound hearing loss</Typography></li>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Types of Hearing Loss
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li><Typography variant="body2"><strong>Conductive:</strong> Air-bone gap ≥ 10 dB at ≥ 2 frequencies</Typography></li>
                  <li><Typography variant="body2"><strong>Sensorineural:</strong> Similar air and bone thresholds</Typography></li>
                  <li><Typography variant="body2"><strong>Mixed:</strong> Elevated bone and air thresholds with air-bone gap</Typography></li>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
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
                    <Tooltip title="Play 125 Hz tone (very low pitch)">
                      <IconButton 
                        onClick={() => playSampleTone(125)} 
                        color={playingTone === 125 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 125}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">125 Hz - Very low pitch (like a deep hum)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 250 Hz tone (low pitch)">
                      <IconButton 
                        onClick={() => playSampleTone(250)} 
                        color={playingTone === 250 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 250}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">250 Hz - Low pitch (like a low note on piano)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 500 Hz tone (low-medium pitch)">
                      <IconButton 
                        onClick={() => playSampleTone(500)} 
                        color={playingTone === 500 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 500}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">500 Hz - Low-medium pitch</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Mid Frequencies
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 1000 Hz tone (medium pitch)">
                      <IconButton 
                        onClick={() => playSampleTone(1000)} 
                        color={playingTone === 1000 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 1000}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">1000 Hz - Medium pitch (speech clarity)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 1500 Hz tone">
                      <IconButton 
                        onClick={() => playSampleTone(1500)} 
                        color={playingTone === 1500 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 1500}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">1500 Hz - Medium-high pitch</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 2000 Hz tone">
                      <IconButton 
                        onClick={() => playSampleTone(2000)} 
                        color={playingTone === 2000 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 2000}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">2000 Hz - Speech consonants</Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  High Frequencies
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 4000 Hz tone (high pitch)">
                      <IconButton 
                        onClick={() => playSampleTone(4000)} 
                        color={playingTone === 4000 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 4000}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">4000 Hz - High pitch (consonant sounds)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 6000 Hz tone (very high pitch)">
                      <IconButton 
                        onClick={() => playSampleTone(6000)} 
                        color={playingTone === 6000 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 6000}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">6000 Hz - Very high pitch</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 8000 Hz tone (extremely high pitch)">
                      <IconButton 
                        onClick={() => playSampleTone(8000)} 
                        color={playingTone === 8000 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 8000}
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">8000 Hz - Extremely high pitch (like a whistle)</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> The actual perception of tones may vary depending on your device's speakers or headphones. For best results, use headphones or quality speakers in a quiet environment.
              </Typography>
            </Alert>
          </Paper>
          
          <Alert severity="info">
            The audiogram provides a visual representation of a patient's hearing sensitivity across frequencies. Understanding how to read and interpret an audiogram is essential for audiologists.
          </Alert>
        </Box>
      )
    },
    {
      label: 'The Hughson-Westlake Procedure',
      description: `The Hughson-Westlake procedure is a standardized method for determining hearing thresholds. 
                   It uses an "up 5 dB, down 10 dB" approach to efficiently find the softest level a patient can hear.`,
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Step-by-Step Procedure
                </Typography>
                <Box component="ol" sx={{ pl: 2, mt: 0 }}>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Begin at 1000 Hz</strong> in the better ear (or right ear if unknown)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Present an audible tone</strong> (typically 40 dB HL for adults with no known hearing loss)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      If the patient responds, <strong>decrease by 10 dB</strong> and present again
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      Continue decreasing by 10 dB until <strong>no response is obtained</strong>
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      Then <strong>increase by 5 dB</strong> and present the tone
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Threshold is established</strong> when patient responds to 2 out of 3 presentations at the same level
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Test other frequencies</strong> in order: 2000, 4000, 8000, then 500, 250 Hz
                    </Typography>
                  </li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Testing Tips
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <AccessTime fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Presentation Timing
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Present tones for 1-2 seconds<br />
                    • Vary intervals between presentations (1-5 seconds)<br />
                    • Avoid rhythmic patterns that patients might anticipate
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    <VolumeUp fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Signal Quality
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Ensure proper headphone/bone conductor placement<br />
                    • Watch for extraneous noise or distractions<br />
                    • Note any inconsistent responses for follow-up
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    <HearingOutlined fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Response Instructions
                  </Typography>
                  <Typography variant="body2">
                    • Instruct patients to respond when they hear a tone, no matter how faint<br />
                    • Accept consistent response method (finger raise, button press, etc.)<br />
                    • Remind patients not to guess - only respond when they're sure
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Always retest 1000 Hz at the end to verify test reliability. A difference of more than 5 dB suggests inconsistent responses and requires retesting.
            </Typography>
          </Alert>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Practical Demonstration: Up 5, Down 10 Procedure
          </Typography>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
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
                    <Tooltip title="Play 1000 Hz at 40 dB (starting level)">
                      <IconButton 
                        onClick={() => playSampleTone(1000)} 
                        color={playingTone === 1000 ? "secondary" : "primary"}
                        disabled={playingTone !== null && playingTone !== 1000}
                        size="small"
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">Step 1: Present at 40 dB (patient should hear this)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 1000 Hz at 30 dB (descending)">
                      <IconButton 
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
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">Step 2: Descend by 10 dB to 30 dB</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 1000 Hz at 20 dB (descending)">
                      <IconButton 
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
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">Step 3: Descend by 10 dB to 20 dB</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 1000 Hz at 10 dB (descending)">
                      <IconButton 
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
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">Step 4: Descend by 10 dB to 10 dB</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 1000 Hz at 0 dB (descending, might not be audible)">
                      <IconButton 
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
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
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
                    <Tooltip title="Play 1000 Hz at 5 dB (ascending)">
                      <IconButton 
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
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">Step 6: Ascend by 5 dB to 5 dB</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 1000 Hz at 5 dB again (test for threshold)">
                      <IconButton 
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
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">Step 7: Present at 5 dB again (response 1/2)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Play 1000 Hz at 5 dB a third time (confirming threshold)">
                      <IconButton 
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
                      >
                        <VolumeUp />
                      </IconButton>
                    </Tooltip>
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
          </Paper>
        </Box>
      )
    },
    {
      label: 'Masking Procedures',
      description: `Masking is used to prevent crossover of sound to the non-test ear. This is critical 
                   when there are significant differences between ears or when testing bone conduction.`,
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  When to Mask
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Air Conduction:</strong> When the difference between air conduction thresholds in two ears exceeds 40 dB
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Bone Conduction:</strong> Almost always required due to minimal interaural attenuation
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Air-Bone Gap:</strong> When an air-bone gap ≥ 10 dB exists in the test ear
                    </Typography>
                  </li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Masking Process
                </Typography>
                <Box component="ol" sx={{ pl: 2, mt: 0 }}>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Determine initial masking level</strong> based on the non-test ear's threshold
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Present the test signal</strong> at the previously determined threshold
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      If response changes, <strong>increase masking level</strong> in 10 dB steps
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Plateau is reached</strong> when threshold remains stable despite increasing masking by 10 dB twice
                    </Typography>
                  </li>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Interaural Attenuation Values
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Supra-aural Headphones
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li><Typography variant="body2">250 Hz: 40 dB</Typography></li>
                  <li><Typography variant="body2">500 Hz: 40 dB</Typography></li>
                  <li><Typography variant="body2">1000 Hz: 40 dB</Typography></li>
                  <li><Typography variant="body2">2000 Hz: 45 dB</Typography></li>
                  <li><Typography variant="body2">4000 Hz: 50 dB</Typography></li>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Insert Earphones
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li><Typography variant="body2">250 Hz: 60 dB</Typography></li>
                  <li><Typography variant="body2">500 Hz: 60 dB</Typography></li>
                  <li><Typography variant="body2">1000 Hz: 60 dB</Typography></li>
                  <li><Typography variant="body2">2000 Hz: 70 dB</Typography></li>
                  <li><Typography variant="body2">4000 Hz: 70 dB</Typography></li>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Bone Conduction
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li><Typography variant="body2">250 Hz: 0 dB</Typography></li>
                  <li><Typography variant="body2">500 Hz: 0 dB</Typography></li>
                  <li><Typography variant="body2">1000 Hz: 0-5 dB</Typography></li>
                  <li><Typography variant="body2">2000 Hz: 0-10 dB</Typography></li>
                  <li><Typography variant="body2">4000 Hz: 0-15 dB</Typography></li>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Masking procedures are more complex and can be challenging for beginners. Proper masking is essential for accurate threshold determination and appropriate treatment planning.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      label: 'Common Testing Errors',
      description: `Being aware of common testing errors will help you improve your testing technique 
                   and produce more accurate results. Here are errors to avoid:`,
      content: (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="error">
                  Procedural Errors
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Improper Step Sizes:</strong> Not using the 10 dB down, 5 dB up approach consistently
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Rhythmic Presentations:</strong> Creating patterns that allow patients to anticipate tones
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Threshold Definition:</strong> Not requiring 2 out of 3 responses at threshold level
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Visual Cues:</strong> Giving unintentional visual hints when presenting tones
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Skipping Frequencies:</strong> Not testing all required frequencies or ears
                    </Typography>
                  </li>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="error">
                  Technical Errors
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Inadequate Masking:</strong> Not masking when necessary or using incorrect levels
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Overmasking:</strong> Using excessive masking that crosses back to test ear
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Equipment Placement:</strong> Improper headphone or bone conductor positioning
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Ambient Noise:</strong> Testing in environments with excessive background noise
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Collapsing Ear Canals:</strong> Not identifying or addressing this issue in elderly patients
                    </Typography>
                  </li>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <School fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
              Educational Best Practices
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Practice regularly</strong> with different types of hearing loss patterns
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Request feedback</strong> from supervisors or experienced audiologists
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Analyze your accuracy</strong> by comparing your results to known thresholds
                    </Typography>
                  </li>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Record test duration</strong> to monitor efficiency improvements
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" paragraph>
                      <strong>Review difficult cases</strong> to understand challenging testing scenarios
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Stay updated</strong> on best practices and guidelines
                    </Typography>
                  </li>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Pro Tip:</strong> Audiometric testing improves with practice. Being aware of common errors and actively working to avoid them will make you a more effective clinician over time.
            </Typography>
          </Alert>
        </Box>
      )
    },
    {
      label: 'Ready to Practice',
      description: `You've completed the tutorial and are now ready to practice pure tone audiometry!`,
      content: (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Congratulations!
          </Typography>
          <Typography variant="body1" paragraph>
            You've learned the essentials of pure tone audiometry testing using the Hughson-Westlake procedure.
          </Typography>
          <Typography variant="body1" paragraph>
            Now it's time to put your knowledge into practice with virtual patients.
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              gap: 2,
              my: 3
            }}
          >
            <Paper elevation={3} sx={{ p: 2, width: 200, textAlign: 'center' }}>
              <VolumeUp fontSize="large" color="primary" />
              <Typography variant="subtitle1" gutterBottom>
                Present Tones
              </Typography>
              <Typography variant="body2">
                Practice presenting tones at various frequencies and intensities
              </Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, width: 200, textAlign: 'center' }}>
              <BarChart fontSize="large" color="primary" />
              <Typography variant="subtitle1" gutterBottom>
                Track Thresholds
              </Typography>
              <Typography variant="body2">
                Plot thresholds on an audiogram to visualize hearing sensitivity
              </Typography>
            </Paper>
            <Paper elevation={3} sx={{ p: 2, width: 200, textAlign: 'center' }}>
              <School fontSize="large" color="primary" />
              <Typography variant="subtitle1" gutterBottom>
                Receive Feedback
              </Typography>
              <Typography variant="body2">
                Get instant feedback on your testing technique and accuracy
              </Typography>
            </Paper>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleFinish}
            sx={{ mt: 2 }}
          >
            Start Testing
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Pure Tone Audiometry Training
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        Learn the proper procedure for conducting hearing tests
      </Typography>
      
      <Divider sx={{ my: 3 }} />
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              <Typography variant="h6">{step.label}</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" color="text.secondary" paragraph>
                {step.description}
              </Typography>
              
              {step.content}
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={index === steps.length - 1 ? handleFinish : handleNext}
                  endIcon={index === steps.length - 1 ? undefined : <ArrowForward />}
                  color={index === steps.length - 1 ? "success" : "primary"}
                >
                  {index === steps.length - 1 ? 'Finish Tutorial' : 'Continue'}
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default Tutorial; 