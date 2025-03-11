import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Card,
  CardContent,
  Alert,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Divider,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Info,
  Refresh,
  Help,
  Hearing
} from '@mui/icons-material';

import RealEarMeasurementService from '../services/RealEarMeasurementService';
import REMChart from '../components/REMChart';
import {
  REMType,
  REMFrequency,
  REMSignalType,
  REMLevel,
  ProbePosition,
  REMCurve,
  REMTarget,
  VirtualHearingAid,
  REMSession,
  VentType
} from '../interfaces/RealEarMeasurementTypes';

// Sample patient data
const SAMPLE_PATIENTS = [
  { id: 'p1', name: 'John Smith', age: 68, hearingLoss: 'Moderate-to-severe sensorineural' },
  { id: 'p2', name: 'Mary Johnson', age: 75, hearingLoss: 'Mild-to-moderate sensorineural' },
  { id: 'p3', name: 'Robert Davis', age: 52, hearingLoss: 'Moderate conductive' },
];

// Measurement legend component for consistency
const MeasurementLegend: React.FC<{ measurements: REMCurve[] }> = ({ measurements }) => (
  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
    <Typography variant="subtitle1" gutterBottom>Completed Measurements:</Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {measurements.map((measurement) => (
        <Box 
          key={measurement.type} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: 'background.paper',
            p: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              bgcolor: measurement.type === 'REUR' ? '#2196F3' : 
                       measurement.type === 'REOR' ? '#FF9800' : 
                       measurement.type === 'REAR' ? '#4CAF50' : 
                       measurement.type === 'REIG' ? '#9C27B0' :
                       measurement.type === 'RECD' ? '#F44336' : 
                       '#795548',
              mr: 1,
              borderRadius: '50%'
            }} 
          />
          <Typography variant="body2">{measurement.type}</Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

/**
 * RealEarMeasurementPage - Interactive page for practicing real ear measurements
 */
const RealEarMeasurementPage: React.FC = () => {
  // Services
  const [remService, setRemService] = useState<RealEarMeasurementService | null>(null);
  
  // Session state
  const [session, setSession] = useState<REMSession | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Measurement parameters
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedHearingAid, setSelectedHearingAid] = useState<string>('');
  const [hearingAids, setHearingAids] = useState<VirtualHearingAid[]>([]);
  const [selectedEar, setSelectedEar] = useState<'left' | 'right'>('right');
  const [probeTubeDepth, setProbeTubeDepth] = useState<number>(15); // in millimeters
  const [probePosition, setProbePosition] = useState<ProbePosition>(ProbePosition.NOT_INSERTED);
  const [signalType, setSignalType] = useState<REMSignalType>('pure_tone_sweep');
  const [inputLevel, setInputLevel] = useState<REMLevel>(65);
  const [currentMeasurement, setCurrentMeasurement] = useState<REMCurve | null>(null);
  const [allMeasurements, setAllMeasurements] = useState<REMCurve[]>([]);
  const [currentTarget, setCurrentTarget] = useState<REMTarget | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [measurementType, setMeasurementType] = useState<REMType>('REUR');
  const [prescriptionMethod, setPrescriptionMethod] = useState<'NAL-NL2' | 'DSL' | 'NAL-NL1' | 'custom'>('NAL-NL2');
  const [selectedVentType, setSelectedVentType] = useState<VentType>(VentType.OCCLUDED);
  
  // New state for adjustable REAR
  const [adjustedREAR, setAdjustedREAR] = useState<REMCurve | null>(null);
  const [matchAccuracy, setMatchAccuracy] = useState<number | null>(null);
  const [adjustmentFeedback, setAdjustmentFeedback] = useState<string | null>(null);
  
  // Steps for the REM procedure
  const remSteps = [
    'Setup Equipment',
    'Position Probe Tube',
    'REUR Measurement',
    'REOR Measurement',
    'REAR Measurement',
    'REIG Calculation',
    'Compare to Target',
    'Adjust Frequency Response'
  ];
  
  // Initialize services
  useEffect(() => {
    const service = new RealEarMeasurementService();
    setRemService(service);
    
    // Get available hearing aids
    setHearingAids(service.getHearingAids());

    return () => {
      service.dispose();
    };
  }, []);
  
  // Initialize adjustable REAR when on adjustment step
  useEffect(() => {
    if (activeStep === 7 && !adjustedREAR) {
      initializeAdjustableREAR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, adjustedREAR]);
  
  // Initialize a new session
  const startNewSession = () => {
    if (remService && selectedPatient && selectedHearingAid) {
      const newSession = remService.createSession(selectedPatient, selectedHearingAid);
      setSession(newSession);
      setActiveStep(0);
      setError(null);
      setSuccess(null);
      setProbePosition(ProbePosition.NOT_INSERTED);
      setCurrentMeasurement(null);
      setCurrentTarget(null);
      setSuccess('Session initialized. Proceed to position the probe tube.');
    } else {
      setError('Please select a patient and hearing aid to continue');
    }
  };
  
  // Handle probe tube positioning
  const handlePositionProbeTube = () => {
    if (remService) {
      try {
        const position = remService.positionProbeTube(probeTubeDepth);
        setProbePosition(position);
        
        if (position === ProbePosition.CORRECT) {
          setSuccess('Probe tube correctly positioned');
          setError(null);
        } else if (position === ProbePosition.TOO_SHALLOW) {
          setError('Probe tube is too shallow - adjust depth');
          setSuccess(null);
        } else if (position === ProbePosition.TOO_DEEP) {
          setError('Probe tube is too deep - adjust depth');
          setSuccess(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setSuccess(null);
      }
    }
  };
  
  // Perform measurement
  const performMeasurement = async () => {
    if (!remService || !session) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For REOR measurements, make sure the vent type is set in the session
      if (measurementType === 'REOR') {
        const updatedSession = { ...session, ventType: selectedVentType };
        setSession(updatedSession);
      }
      
      // Perform the measurement
      const measurement = await remService.performMeasurement(
        measurementType,
        selectedEar,
        signalType,
        inputLevel
      );
      
      // Add the measurement to the session
      const updatedMeasurements = [...session.measurements.filter(m => m.type !== measurementType), measurement];
      
      const updatedSession = {
        ...session,
        measurements: updatedMeasurements,
        currentStep: measurementType
      };
      
      setAllMeasurements(updatedMeasurements);
      setCurrentMeasurement(measurement);
      setSession(updatedSession);
      setSuccess(`${measurementType} measurement completed successfully`);
      
      // Move to the next step if we are in the measurement steps (2, 3, 4)
      if (activeStep >= 2 && activeStep <= 4) {
        setActiveStep(activeStep + 1);
        
        // Update the measurement type for the next step
        if (activeStep === 2) { // After REUR, go to REOR
          setMeasurementType('REOR');
        } else if (activeStep === 3) { // After REOR, go to REAR
          setMeasurementType('REAR');
        } else if (activeStep === 4) { // After REAR, go to REIG
          setMeasurementType('REIG');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during measurement');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate targets
  const generateTargets = () => {
    if (remService && selectedPatient) {
      try {
        const targets = remService.generateTargets(selectedPatient, prescriptionMethod);
        if (targets.length > 0) {
          // Find target matching current measurement type
          const matchingTarget = targets.find(t => t.type === measurementType);
          if (matchingTarget) {
            setCurrentTarget(matchingTarget);
            setSuccess(`Generated ${prescriptionMethod} targets for ${measurementType}`);
          } else {
            setCurrentTarget(targets[0]);
            setSuccess(`Generated ${prescriptionMethod} targets`);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }
  };
  
  // Play test signal
  const playTestSignal = () => {
    if (remService) {
      remService.playTestSignal(signalType, inputLevel, selectedEar);
      setIsPlaying(true);
    }
  };
  
  // Stop test signal
  const stopTestSignal = () => {
    if (remService) {
      remService.stopTestSignal();
      setIsPlaying(false);
    }
  };
  
  // Navigate through steps
  const handleNext = () => {
    setActiveStep((prevStep) => {
      // Auto-update measurement type based on step
      const newStep = prevStep + 1;
      if (newStep === 2) {
        setMeasurementType('REUR');
      } else if (newStep === 3) {
        setMeasurementType('REOR');
      } else if (newStep === 4) {
        setMeasurementType('REAR');
      } else if (newStep === 5) {
        setMeasurementType('REIG');
      } else if (newStep === 7) {
        // Initialize adjustable REAR when reaching the adjustment step
        setMatchAccuracy(null);
        setAdjustmentFeedback(null);
        initializeAdjustableREAR();
      }
      
      return newStep;
    });
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Change active tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Handle select changes
  const handlePatientChange = (event: SelectChangeEvent) => {
    setSelectedPatient(event.target.value);
  };
  
  const handleHearingAidChange = (event: SelectChangeEvent) => {
    setSelectedHearingAid(event.target.value);
  };
  
  const handleEarChange = (event: SelectChangeEvent) => {
    setSelectedEar(event.target.value as 'left' | 'right');
  };
  
  const handleSignalTypeChange = (event: SelectChangeEvent) => {
    setSignalType(event.target.value as REMSignalType);
  };
  
  const handleMeasurementTypeChange = (event: SelectChangeEvent) => {
    setMeasurementType(event.target.value as REMType);
  };
  
  const handleInputLevelChange = (event: Event, newValue: number | number[]) => {
    setInputLevel(newValue as REMLevel);
  };
  
  const handlePrescriptionMethodChange = (event: SelectChangeEvent) => {
    setPrescriptionMethod(event.target.value as 'NAL-NL2' | 'DSL' | 'NAL-NL1' | 'custom');
  };
  
  // Create a copy of the REAR measurement for adjustments
  const initializeAdjustableREAR = () => {
    if (allMeasurements.length > 0) {
      // Find the REAR measurement
      const rearMeasurement = allMeasurements.find(m => m.type === 'REAR');
      if (rearMeasurement) {
        // Create a copy for adjustments
        const adjustable: REMCurve = {
          ...rearMeasurement,
          type: 'REAR', // ensure it's REAR type
          timestamp: new Date().toISOString(),
          // Make a copy of measurement points to avoid modifying the original
          measurementPoints: [...rearMeasurement.measurementPoints.map(p => ({...p}))]
        };
        setAdjustedREAR(adjustable);
        return adjustable;
      }
    }
    return null;
  };
  
  // Adjust gain at a specific frequency
  const adjustGainAtFrequency = (frequency: REMFrequency, adjustment: number) => {
    if (!adjustedREAR) {
      const initialized = initializeAdjustableREAR();
      if (!initialized) return;
    }
    
    setAdjustedREAR(prevAdjusted => {
      if (!prevAdjusted) return null;
      
      // Create a new adjusted measurement
      const newAdjusted: REMCurve = {
        ...prevAdjusted,
        measurementPoints: prevAdjusted.measurementPoints.map(point => {
          if (point.frequency === frequency) {
            return {
              ...point,
              gain: Math.max(0, Math.min(80, point.gain + adjustment)) // Clamp between 0-80 dB
            };
          }
          return point;
        }),
        timestamp: new Date().toISOString()
      };
      
      return newAdjusted;
    });
  };
  
  // Check if adjustments match the target
  const checkTargetMatch = () => {
    if (remService && adjustedREAR && session) {
      // Look for REIG target specifically, which is most commonly used for matching
      let targetToCompare = currentTarget;
      
      // If available, use the REIG target from session
      const reigTarget = session.targets.find(t => t.type === 'REIG');
      if (reigTarget) {
        targetToCompare = reigTarget;
      }
      
      if (targetToCompare) {
        const accuracy = remService.calculateAccuracy(adjustedREAR, targetToCompare);
        setMatchAccuracy(accuracy);
        
        // Provide feedback based on accuracy
        if (accuracy >= 90) {
          setAdjustmentFeedback("Excellent match! The adjustments are within clinical standards.");
          setSuccess("Target match successful!");
        } else if (accuracy >= 80) {
          setAdjustmentFeedback("Good match, but some frequencies could be adjusted further for optimal results.");
        } else if (accuracy >= 70) {
          setAdjustmentFeedback("Acceptable match, but consider further adjustments, especially in the speech frequencies (1000-4000 Hz).");
        } else {
          setAdjustmentFeedback("Poor match to target. Significant adjustments are needed across multiple frequencies.");
        }
      }
    }
  };
  
  // Reset adjustments
  const resetAdjustments = () => {
    initializeAdjustableREAR();
    setMatchAccuracy(null);
    setAdjustmentFeedback(null);
  };
  
  // Set vent type in the service
  useEffect(() => {
    if (remService && session && measurementType === 'REOR') {
      // Only update if ventType is different to avoid infinite loop
      if (session.ventType !== selectedVentType) {
        const updatedSession = { ...session, ventType: selectedVentType };
        setSession(updatedSession);
      }
    }
  }, [selectedVentType, remService, session, measurementType]);
  
  // Handle vent type change
  const handleVentTypeChange = (event: SelectChangeEvent) => {
    setSelectedVentType(event.target.value as VentType);
  };
  
  // Render different steps based on activeStep
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Setup Equipment
        return (
          <Box>
            <Typography variant="h6">Setup Equipment</Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Patient</InputLabel>
                  <Select
                    value={selectedPatient}
                    onChange={handlePatientChange}
                    label="Select Patient"
                  >
                    {SAMPLE_PATIENTS.map(patient => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.age} y/o - {patient.hearingLoss}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Hearing Aid</InputLabel>
                  <Select
                    value={selectedHearingAid}
                    onChange={handleHearingAidChange}
                    label="Select Hearing Aid"
                  >
                    {hearingAids.map(aid => (
                      <MenuItem key={aid.id} value={aid.id}>
                        {aid.manufacturer} {aid.name} ({aid.type})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Ear</InputLabel>
                  <Select
                    value={selectedEar}
                    onChange={handleEarChange}
                    label="Select Ear"
                  >
                    <MenuItem value="left">Left Ear</MenuItem>
                    <MenuItem value="right">Right Ear</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={startNewSession}
                  disabled={!selectedPatient || !selectedHearingAid}
                >
                  Initialize Setup
                </Button>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1: // Position Probe Tube
        return (
          <Box>
            <Typography variant="h6">Position Probe Tube</Typography>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
              <Typography gutterBottom>
                Adjust probe tube depth (mm). The correct insertion depth is between 20mm and 30mm.
              </Typography>
              <Slider
                value={probeTubeDepth}
                onChange={(e, newValue) => setProbeTubeDepth(newValue as number)}
                step={1}
                marks={[
                  { value: 0, label: '0mm' },
                  { value: 10, label: '10mm' },
                  { value: 20, label: '20mm (min)' },
                  { value: 30, label: '30mm (max)' },
                  { value: 40, label: '40mm' }
                ]}
                min={0}
                max={40}
                valueLabelDisplay="on"
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handlePositionProbeTube}
                >
                  Check Position
                </Button>
                
                <Tooltip title="Correct position is typically 25-28mm from the tragus.">
                  <IconButton>
                    <Info />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {probePosition !== ProbePosition.NOT_INSERTED && (
                <Alert 
                  severity={probePosition === ProbePosition.CORRECT ? "success" : "error"}
                  sx={{ mt: 2 }}
                >
                  Probe position: {probePosition.replace('_', ' ')}
                </Alert>
              )}
            </Paper>
          </Box>
        );
      
      case 2: // REUR Measurement
      case 3: // REOR Measurement
      case 4: // REAR Measurement
        return (
          <Box>
            <Typography variant="h6">{measurementType} Measurement</Typography>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Measurement Type</InputLabel>
                    <Select
                      value={measurementType}
                      onChange={handleMeasurementTypeChange}
                      label="Measurement Type"
                    >
                      <MenuItem value="REUR">REUR - Real Ear Unaided Response</MenuItem>
                      <MenuItem value="REOR">REOR - Real Ear Occluded Response</MenuItem>
                      <MenuItem value="REAR">REAR - Real Ear Aided Response</MenuItem>
                      <MenuItem value="REIG">REIG - Real Ear Insertion Gain</MenuItem>
                      <MenuItem value="RECD">RECD - Real Ear to Coupler Difference</MenuItem>
                      <MenuItem value="RESR">RESR - Real Ear Saturation Response</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Signal Type</InputLabel>
                    <Select
                      value={signalType}
                      onChange={handleSignalTypeChange}
                      label="Signal Type"
                    >
                      <MenuItem value="pure_tone_sweep">Pure Tone Sweep</MenuItem>
                      <MenuItem value="speech_noise">Speech Noise</MenuItem>
                      <MenuItem value="pink_noise">Pink Noise</MenuItem>
                      <MenuItem value="white_noise">White Noise</MenuItem>
                      <MenuItem value="ISTS_noise">ISTS Noise</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography gutterBottom>Input Level (dB SPL)</Typography>
                  <Slider
                    value={inputLevel}
                    onChange={handleInputLevelChange}
                    step={5}
                    marks
                    min={50}
                    max={90}
                    valueLabelDisplay="on"
                  />
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={isPlaying ? <Stop /> : <PlayArrow />}
                      onClick={isPlaying ? stopTestSignal : playTestSignal}
                    >
                      {isPlaying ? 'Stop Signal' : 'Play Signal'}
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={performMeasurement}
                      disabled={isLoading || probePosition !== ProbePosition.CORRECT}
                    >
                      {isLoading ? (
                        <>
                          <CircularProgress size={24} sx={{ mr: 1 }} />
                          Measuring...
                        </>
                      ) : (
                        'Run Measurement'
                      )}
                    </Button>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Information about {measurementType}
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    {measurementType === 'REUR' && (
                      <>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          Real Ear Unaided Response measures the natural resonance of the ear canal without a hearing aid. 
                          This is an important baseline measurement.
                        </Typography>
                        <Alert severity="info" sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            <strong>Tips for proper REUR response:</strong>
                          </Typography>
                          <Typography variant="body2" component="div">
                            <ul>
                              <li>The resonance peak should be around 2.7kHz-3kHz</li>
                              <li>The 6kHz response should not drop below 0 dB</li>
                              <li>Typical gain at peak should be around 10-15 dB</li>
                              <li>The response should be smooth without sharp peaks or valleys</li>
                            </ul>
                          </Typography>
                        </Alert>
                      </>
                    )}
                    {measurementType === 'REOR' && (
                      <>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          Real Ear Occluded Response measures the response with the hearing aid in place but turned off. 
                          This shows the impact of blocking the ear canal.
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel>Dome/Earmold Vent Type</InputLabel>
                          <Select
                            value={selectedVentType}
                            onChange={handleVentTypeChange}
                            label="Dome/Earmold Vent Type"
                          >
                            <MenuItem value={VentType.OCCLUDED}>Occluded (No Vent)</MenuItem>
                            <MenuItem value={VentType.SMALL_VENT}>Small Vent</MenuItem>
                            <MenuItem value={VentType.MEDIUM_VENT}>Medium Vent</MenuItem>
                            <MenuItem value={VentType.LARGE_VENT}>Large Vent</MenuItem>
                            <MenuItem value={VentType.OPEN_DOME}>Open Dome</MenuItem>
                          </Select>
                        </FormControl>
                        <Alert severity="info">
                          <Typography variant="body2">
                            Vent size affects the sound pressure at the ear drum. More open fittings (larger vents) will 
                            result in a response closer to REUR, while more closed fittings will show greater occlusion 
                            effect at low frequencies and more high-frequency attenuation.
                          </Typography>
                        </Alert>
                      </>
                    )}
                    {measurementType === 'REAR' && (
                      <Typography variant="body2">
                        Real Ear Aided Response measures the response with the hearing aid in place and turned on. 
                        This is compared with targets to verify the fitting.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
              <Typography variant="h6" gutterBottom>Measurement Results</Typography>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <REMChart 
                  measurements={allMeasurements.length > 0 ? allMeasurements : null}
                  target={currentTarget}
                  height={300}
                  width={window.innerWidth < 600 ? window.innerWidth - 50 : 700}
                />
              </Box>
              
              {allMeasurements.length > 0 && <MeasurementLegend measurements={allMeasurements} />}
            </Paper>
          </Box>
        );
      
      case 5: // REIG Calculation
        return (
          <Box>
            <Typography variant="h6">REIG Calculation</Typography>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
              <Typography gutterBottom>
                Real Ear Insertion Gain (REIG) is calculated as the difference between REAR and REUR.
                This shows the actual gain provided by the hearing aid in the patient's ear.
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                onClick={performMeasurement}
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                Calculate REIG
              </Button>
              
              <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
                <REMChart 
                  measurements={allMeasurements.length > 0 ? allMeasurements : null}
                  target={currentTarget}
                  height={300}
                  width={window.innerWidth < 600 ? window.innerWidth - 50 : 700}
                />
              </Box>
            </Paper>
          </Box>
        );
      
      case 6: // Compare to Target
        return (
          <Box>
            <Typography variant="h6">Compare to Target</Typography>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Prescription Method</InputLabel>
                    <Select
                      value={prescriptionMethod}
                      onChange={handlePrescriptionMethodChange}
                      label="Prescription Method"
                    >
                      <MenuItem value="NAL-NL2">NAL-NL2</MenuItem>
                      <MenuItem value="DSL">DSL v5.0</MenuItem>
                      <MenuItem value="NAL-NL1">NAL-NL1</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={generateTargets}
                    sx={{ mt: 1 }}
                  >
                    Generate Targets
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    About {prescriptionMethod}
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    {prescriptionMethod === 'NAL-NL2' && (
                      <Typography variant="body2">
                        NAL-NL2 is the second-generation nonlinear prescription procedure from NAL. 
                        It aims to maximize speech intelligibility while maintaining comfortable loudness.
                      </Typography>
                    )}
                    {prescriptionMethod === 'DSL' && (
                      <Typography variant="body2">
                        DSL v5.0 is designed to provide audibility of speech across a wide range of inputs,
                        with special considerations for pediatric fittings.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
                <REMChart 
                  measurements={allMeasurements.length > 0 ? allMeasurements : null}
                  target={currentTarget}
                  height={300}
                  width={window.innerWidth < 600 ? window.innerWidth - 50 : 700}
                />
              </Box>
              
              {allMeasurements.length > 0 && <MeasurementLegend measurements={allMeasurements} />}
            </Paper>
          </Box>
        );
      
      case 7: // Adjust Frequency Response
        // Get the frequencies array for controls
        const frequencies: REMFrequency[] = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
        
        // Find REIG target if available
        const reigTarget = session?.targets.find(t => t.type === 'REIG') || null;
        
        return (
          <Box>
            <Typography variant="h6">Adjust Frequency Response</Typography>
            <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
              <Typography gutterBottom>
                Adjust the REAR response to match the target by using the up and down buttons for each frequency.
                These adjustments simulate the process of fine-tuning a hearing aid's frequency response.
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                You should adjust the REAR response to match the REAR target (dotted line). This represents the ideal response needed to achieve the prescribed amplification for the patient.
              </Alert>
              
              <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
                <REMChart 
                  measurements={
                    adjustedREAR 
                      ? [...allMeasurements.filter(m => m.type !== 'REAR'), adjustedREAR] 
                      : allMeasurements
                  }
                  target={reigTarget || currentTarget}
                  height={300}
                  width={window.innerWidth < 600 ? window.innerWidth - 50 : 700}
                />
              </Box>
              
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                Adjust Gain at Each Frequency (dB)
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)', lg: 'repeat(11, 1fr)' }, 
                  gap: 2,
                  mb: 3
                }}
              >
                {frequencies.map((freq) => {
                  const currentGain = adjustedREAR?.measurementPoints.find(p => p.frequency === freq)?.gain || 0;
                  
                  return (
                    <Box key={freq} sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {freq} Hz
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => adjustGainAtFrequency(freq, 1)}
                        >
                          <Box sx={{ fontSize: '1.5rem' }}>↑</Box>
                        </IconButton>
                        
                        <Typography variant="body1" fontWeight="bold">
                          {currentGain.toFixed(1)}
                        </Typography>
                        
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => adjustGainAtFrequency(freq, -1)}
                        >
                          <Box sx={{ fontSize: '1.5rem' }}>↓</Box>
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={checkTargetMatch}
                  disabled={!adjustedREAR}
                >
                  Check Target Match
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={resetAdjustments}
                  disabled={!adjustedREAR}
                >
                  Reset Adjustments
                </Button>
                
                {matchAccuracy !== null && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setSuccess("REM procedure completed successfully!");
                      if (session) {
                        // Save adjusted REAR to session and mark as completed
                        const updatedMeasurements = [...allMeasurements.filter(m => m.type !== 'REAR')];
                        if (adjustedREAR) {
                          updatedMeasurements.push(adjustedREAR);
                          setAllMeasurements(updatedMeasurements);
                        }
                        
                        const updatedSession = {
                          ...session, 
                          completed: true,
                          measurements: updatedMeasurements,
                          accuracy: matchAccuracy || 0
                        };
                        setSession(updatedSession);
                      }
                    }}
                  >
                    Complete REM Procedure
                  </Button>
                )}
              </Box>
              
              {adjustmentFeedback && (
                <Alert 
                  severity={matchAccuracy && matchAccuracy >= 80 ? "success" : matchAccuracy && matchAccuracy >= 70 ? "info" : "warning"} 
                  sx={{ mt: 3 }}
                >
                  {adjustmentFeedback}
                  {matchAccuracy !== null && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Accuracy score: {matchAccuracy.toFixed(1)}%
                    </Typography>
                  )}
                </Alert>
              )}
              
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="subtitle2">Clinical best practices for target matching:</Typography>
                <ul>
                  <li>Speech frequencies (1000-4000 Hz) should be within ±3 dB of target</li>
                  <li>Low frequencies (125-750 Hz) should be within ±5 dB of target</li>
                  <li>High frequencies (6000-8000 Hz) should be within ±8 dB of target</li>
                  <li>Overall RMS difference should be less than 5 dB for an optimal fit</li>
                </ul>
              </Alert>
            </Paper>
          </Box>
        );
      
      default:
        return <Typography>Unknown step</Typography>;
    }
  };
  
  // Render tutorial tab content
  const renderTutorialContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Real Ear Measurement Tutorial</Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>What is Real Ear Measurement?</Typography>
      <Typography paragraph>
        Real Ear Measurement (REM) is a verification procedure used to measure the performance
        of hearing aids in an individual's ear. It helps ensure that the hearing aid is providing
        the appropriate amount of amplification across frequencies based on the patient's hearing loss.
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>Types of REM Measurements</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="primary">REUR</Typography>
              <Typography variant="body2">
                Real Ear Unaided Response - Measures the natural acoustic response of the ear canal
                without a hearing aid. This shows the natural resonance of the ear canal.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="primary">REOR</Typography>
              <Typography variant="body2">
                Real Ear Occluded Response - Measures the response with the hearing aid in place
                but turned off. Shows the impact of blocking the ear canal.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="primary">REAR</Typography>
              <Typography variant="body2">
                Real Ear Aided Response - Measures the response with the hearing aid in place
                and turned on. This is the actual output of the hearing aid in the ear.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="primary">REIG</Typography>
              <Typography variant="body2">
                Real Ear Insertion Gain - The difference between REAR and REUR, showing the
                actual gain provided by the hearing aid in the patient's ear.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h6" sx={{ mt: 3 }}>REM Procedure Steps</Typography>
      <ol>
        <li>
          <Typography paragraph>
            <strong>Setup the equipment:</strong> Select the appropriate patient, hearing aid, and ear.
          </Typography>
        </li>
        <li>
          <Typography paragraph>
            <strong>Position the probe tube:</strong> Insert the probe tube to the correct depth in the ear canal,
            typically 25-28mm from the tragus for an adult.
          </Typography>
        </li>
        <li>
          <Typography paragraph>
            <strong>Measure REUR:</strong> Record the unaided response of the ear canal.
          </Typography>
        </li>
        <li>
          <Typography paragraph>
            <strong>Insert hearing aid and measure REOR:</strong> With the hearing aid in place but turned off.
          </Typography>
        </li>
        <li>
          <Typography paragraph>
            <strong>Turn on hearing aid and measure REAR:</strong> With the hearing aid providing amplification.
          </Typography>
        </li>
        <li>
          <Typography paragraph>
            <strong>Calculate REIG:</strong> Compare REAR to REUR to determine insertion gain.
          </Typography>
        </li>
        <li>
          <Typography paragraph>
            <strong>Compare to targets:</strong> Compare the measurements to prescriptive targets (NAL-NL2, DSL v5.0, etc.).
          </Typography>
        </li>
        <li>
          <Typography paragraph>
            <strong>Make adjustments:</strong> Adjust the hearing aid settings to better match the targets if needed.
          </Typography>
        </li>
      </ol>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" sx={{ mt: 3 }}>How to Instruct Patients</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" color="primary" gutterBottom>Before the Procedure</Typography>
          <ul>
            <li>
              <Typography paragraph>
                <strong>Explain the purpose:</strong> "This test helps us make sure your hearing aids are providing the right amount of 
                sound specifically for your ears. It's a quick, painless procedure that will help us get the best results from your hearing aids."
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Set expectations:</strong> "You'll feel me placing a thin, soft tube in your ear canal, followed by your hearing aid. 
                You'll hear different sounds during the test. You don't need to respond to these sounds - just sit still and remain quiet."
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Position instructions:</strong> "Please sit facing forward and try not to move your head during the measurements. 
                This helps us get accurate readings."
              </Typography>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" color="primary" gutterBottom>During the Procedure</Typography>
          <ul>
            <li>
              <Typography paragraph>
                <strong>Provide ongoing guidance:</strong> "I'm going to place the tube in your ear now. You may feel a slight tickle, but it shouldn't be uncomfortable."
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Reassurance:</strong> "You're doing great. The test will take just a few more minutes."
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Movement reminders:</strong> "Please try to stay as still as possible while the measurement is running."
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Silence during measurements:</strong> "I'll need you to remain quiet during the actual measurements. I'll let you know when each one starts and ends."
              </Typography>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="subtitle1" color="primary" gutterBottom>After the Procedure</Typography>
          <ul>
            <li>
              <Typography paragraph>
                <strong>Explain the results:</strong> "These graphs show how your hearing aids are performing in your ears. The dotted line shows our target, and the solid line shows what your hearing aids are actually doing."
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Address adjustments:</strong> "Based on these measurements, I'm going to make some fine-tuning adjustments to your hearing aids to better match your specific needs."
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Encourage feedback:</strong> "After we make these adjustments, please let me know how things sound to you. Your subjective experience is also important."
              </Typography>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Typography variant="h6" sx={{ mt: 4 }}>Common Challenges and How to Overcome Them</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>

        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Challenge: Probe Tube Placement</Typography>
              <Typography variant="body2" paragraph>
                Incorrect probe tube placement is one of the most common sources of error.
              </Typography>
              <Typography variant="subtitle2">Solutions:</Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    Mark the probe tube at appropriate depths (25-28mm adults, 20-22mm children).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Use otoscopy before placement to understand individual ear canal anatomy.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Check placement with otoscopy after insertion when possible.
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Challenge: Feedback</Typography>
              <Typography variant="body2" paragraph>
                Acoustic feedback during REAR measurements can disrupt results.
              </Typography>
              <Typography variant="subtitle2">Solutions:</Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    Ensure proper hearing aid fit and seal before measurements.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Temporarily reduce gain in regions causing feedback, then estimate target match.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Consider using a larger dome or custom earmold if feedback persists.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Position the probe tube so it's not touching the hearing aid receiver.
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Challenge: Small or Curved Ear Canals</Typography>
              <Typography variant="body2" paragraph>
                Anatomical variations can make probe placement difficult.
              </Typography>
              <Typography variant="subtitle2">Solutions:</Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    For very small canals, adjust depth expectations (but ensure minimum 15mm past canal entrance).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Apply slight pressure to the pinna to straighten the canal during insertion.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Move very slowly and gently with nervous patients or difficult anatomies.
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Challenge: Cerumen (Earwax)</Typography>
              <Typography variant="body2" paragraph>
                Excessive cerumen can block the probe tube or affect measurements.
              </Typography>
              <Typography variant="subtitle2">Solutions:</Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    Always perform otoscopy before beginning REM procedures.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Refer for cerumen management if the canal is significantly occluded.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Check probe tube openings for cerumen after each use and clean as needed.
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Challenge: Ambient Noise</Typography>
              <Typography variant="body2" paragraph>
                Background noise can interfere with accurate measurements.
              </Typography>
              <Typography variant="subtitle2">Solutions:</Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    Conduct REM in the quietest available environment.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Use equipment features designed to reduce ambient noise effects.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Consider using higher intensity test signals (65-70 dB SPL instead of 50-55 dB SPL).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Take a baseline measurement of room noise before beginning.
                  </Typography>
                </li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Typography variant="h6" sx={{ mt: 4 }}>Things to Avoid</Typography>
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Never Force the Probe Tube</Typography>
        <Typography variant="body2">
          If you encounter resistance, pull back slightly and try a different angle. Forcing can cause discomfort.
        </Typography>
      </Alert>
      
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Don't Skip Otoscopy</Typography>
        <Typography variant="body2">
          Always examine the ear canal before insertion to check for obstructions, irritation, or unusual anatomy.
        </Typography>
      </Alert>
      
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Avoid Comparing Incompatible Measurements</Typography>
        <Typography variant="body2">
          Make sure you're comparing the correct measurement types (e.g., REAR with REAR targets, not REIG targets).
        </Typography>
      </Alert>
      
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Don't Rush Through Measurements</Typography>
        <Typography variant="body2">
          Take time to ensure proper probe placement and patient positioning. Rushing leads to inaccurate results.
        </Typography>
      </Alert>
      
      <Alert severity="warning" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Avoid Making Programming Changes Between REAR and REUG</Typography>
        <Typography variant="body2">
          When calculating REIG, ensure no hearing aid setting changes were made between these measurements.
        </Typography>
      </Alert>
      
      <Alert severity="warning">
        <Typography variant="subtitle1">Don't Rely Solely on REM</Typography>
        <Typography variant="body2">
          While REM is crucial for verification, also consider patient subjective feedback to ensure comfort and satisfaction.
        </Typography>
      </Alert>
      
      <Typography variant="h6" sx={{ mt: 4 }}>Pro Tips for New Clinicians</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Practice on Colleagues</Typography>
              <Typography variant="body2">
                Before working with patients, practice probe tube placement on willing colleagues or classmates to build confidence and skill.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Double-Check Equipment</Typography>
              <Typography variant="body2">
                Perform regular calibration checks and ensure your equipment is functioning properly before each session.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Document Everything</Typography>
              <Typography variant="body2">
                Keep detailed records of all measurements, including probe depth, test signals used, and any challenges encountered.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Use Visual Aids</Typography>
              <Typography variant="body2">
                Have diagrams or models to show patients what you're doing, especially for their first REM experience.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Standardize Your Process</Typography>
              <Typography variant="body2">
                Develop a consistent routine for REM to ensure you don't miss any steps, regardless of patient variables.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">Explain as You Go</Typography>
              <Typography variant="body2">
                Narrate your actions to the patient, which both reassures them and helps you maintain your procedural flow.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
  
  // Render reference tab content
  const renderReferenceContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Reference Materials</Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>Prescription Methods</Typography>
      <Typography paragraph>
        <strong>NAL-NL2:</strong> The National Acoustic Laboratories' nonlinear prescription, version 2.
        This formula aims to maximize speech intelligibility while maintaining comfortable loudness.
        It's widely used for adults with acquired hearing loss.
      </Typography>
      <Typography paragraph>
        <strong>DSL v5.0:</strong> Desired Sensation Level, version 5.0. This method focuses on audibility
        across a wide range of input levels and is commonly used for pediatric fittings.
      </Typography>

      <Card sx={{ mb: 4, mt: 2 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>NAL-NL2 In-Depth</Typography>
          
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Calculation Methodology</Typography>
          <Typography variant="body2" paragraph>
            NAL-NL2 uses a complex calculation process that considers multiple variables to generate prescriptive targets:
          </Typography>
          <ol>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Loudness Normalization:</strong> The fundamental principle is to make all frequency bands contribute equally to 
                loudness perception. This differs from previous methods that focused on equalizing specific sensation levels.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Input Level Compensation:</strong> NAL-NL2 applies different gain prescriptions based on input level 
                (typically 50, 65, and 80 dB SPL). This creates a compression response that mimics normal loudness growth.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Individual Factors Adjustment:</strong> The formula includes corrections for:
                <ul>
                  <li>Gender (typically less gain for males)</li>
                  <li>Age (reduced high-frequency gain for older adults)</li>
                  <li>Experience level (gradual increase in gain for new users)</li>
                  <li>Language background (tonal vs. non-tonal languages)</li>
                </ul>
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Binaural Summation:</strong> When fitting binaurally, NAL-NL2 reduces gain by approximately 2-3 dB 
                compared to monaural fittings, accounting for binaural loudness summation.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Severe-to-Profound Adaptation:</strong> For severe and profound hearing losses, NAL-NL2 provides 
                proportionally more gain in low and mid frequencies and less in high frequencies compared to moderate losses.
              </Typography>
            </li>
          </ol>
          
          <Typography variant="subtitle1" sx={{ mt: 2 }}>The NAL-NL2 Formula Components</Typography>
          <Typography variant="body2" paragraph>
            While the exact mathematical formula is complex, NAL-NL2 essentially calculates Real Ear Insertion Gain (REIG) using this conceptual framework:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.light', mb: 2 }}>
            <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
              REIG = Base gain × Level adjustment × Individual factors
            </pre>
            <p>Where:</p>
            <ul>
              <li>Base gain is determined from the audiogram and frequency</li>
              <li>Level adjustment creates the compression characteristics</li>
              <li>Individual factors include age, gender, experience, and hearing loss configuration</li>
            </ul>
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mt: 3 }}>Rationale Behind NAL-NL2</Typography>
          <Typography variant="body2" paragraph>
            NAL-NL2 was developed based on research with over 200 hearing aid users and was designed to address limitations in NAL-NL1:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Preferred Gain:</strong> NAL-NL2 provides approximately 2-3 dB less gain than NAL-NL1, based on studies of 
                user preference.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Speech Intelligibility Models:</strong> It incorporates updated speech intelligibility models that account for 
                hearing aid processing effects.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Loudness Restoration:</strong> NAL-NL2 aims to restore loudness perception to normal levels without overamplifying, 
                which can cause discomfort.
              </Typography>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>Comparison: NAL-NL2 vs. Manufacturer Formulas</Typography>
          
          <Typography variant="body2" paragraph>
            Manufacturer-specific fitting formulas often differ from NAL-NL2 in significant ways. Understanding these differences is crucial 
            for clinical decision-making.
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>Key Differences</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="primary">Gain Differences</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>NAL-NL2:</strong> Typically prescribes less gain, especially in low frequencies. Targets highest gain in mid-frequencies where 
                    speech information is most important.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Manufacturer Formulas:</strong> Often prescribe 3-8 dB more overall gain than NAL-NL2, particularly in low frequencies. 
                    This can make hearing aids sound "fuller" initially but may lead to issues with occlusion and user comfort.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="primary">Compression Characteristics</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>NAL-NL2:</strong> Uses moderate compression ratios tailored to hearing loss severity. Focuses on maintaining speech intelligibility.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Manufacturer Formulas:</strong> May implement more aggressive compression, especially in proprietary "comfort" programs. 
                    Some formulas use frequency-specific compression ratios that differ substantially from research-based approaches.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="primary">First-Fit Accuracy</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>NAL-NL2:</strong> Research shows when properly implemented, NAL-NL2 can achieve close matches to targets. 
                    However, this requires accurate audiometric data and real-ear verification.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Manufacturer Formulas:</strong> Studies show first-fits from manufacturers often deviate from NAL-NL2 targets by 
                    7-10 dB at certain frequencies, even when the software claims to implement NAL-NL2.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="primary">Adaptation Management</Typography>
                  <Typography variant="body2" paragraph>
                    <strong>NAL-NL2:</strong> Includes a one-time adaptation adjustment based on hearing aid experience, reducing gain by approximately 
                    2-6 dB for new users.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Manufacturer Formulas:</strong> Often implement progressive adaptation with multiple stages, automatically increasing 
                    gain over weeks or months. Some manufacturers may reduce gain by 10-15 dB initially, which can compromise early benefit.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" sx={{ mt: 3 }}>Common Proprietary Formula Characteristics</Typography>
          <Typography variant="body2" paragraph>
            While each manufacturer uses different approaches, some patterns emerge in proprietary formulas:
          </Typography>
          <ul>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Phonak (APD/Adaptive Phonak Digital):</strong> Tends to prescribe more low and high-frequency gain than NAL-NL2. 
                Uses speech-based processing that can result in different real-world gains than static measurements.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Oticon (VAC+/Voice Aligned Compression):</strong> Generally prescribes more low-frequency gain and may use 
                less compression at certain input levels compared to NAL-NL2.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Widex (DREAM/COMPASS):</strong> Typically applies more low-frequency gain and may use different compression time 
                constants than assumed in NAL-NL2 development.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>Signia/Sivantos (Nx-Fit):</strong> Often provides less gain in mid frequencies and more in low frequencies than 
                NAL-NL2 prescribes.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                <strong>ReSound (Audiogram+):</strong> Generally closer to NAL-NL2 in mid-frequencies but may apply different gain for 
                soft and loud inputs.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="subtitle1" sx={{ mt: 3 }}>Clinical Implications</Typography>
          <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
            <Typography variant="body2">
              <strong>Always verify:</strong> Due to significant variations between prescribed and delivered gain, real ear measurement 
              verification is essential regardless of which formula is selected.
            </Typography>
          </Alert>
          <Typography variant="body2" paragraph>
            When REM verification shows substantial deviations from NAL-NL2 targets, clinicians must decide whether to:
          </Typography>
          <ol>
            <li>
              <Typography variant="body2" paragraph>
                Adjust the hearing aid to match NAL-NL2 targets (evidence-based approach)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Trust the manufacturer's proprietary approach (may reflect unique signal processing benefits)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Find a middle ground based on patient feedback and clinical judgment
              </Typography>
            </li>
          </ol>
          <Typography variant="body2" paragraph>
            This decision should consider patient preferences, previous hearing aid experience, and the specific 
            features of the hearing aid being fitted.
          </Typography>
        </CardContent>
      </Card>
      
      <Typography variant="h6" sx={{ mt: 3 }}>Proper Probe Tube Placement</Typography>
      <Typography paragraph>
        For accurate measurements, the probe tube should be placed within 5-6mm of the tympanic membrane.
        For average adults, this is approximately 25-28mm from the tragus. Placement that is too shallow
        will result in inaccurate high-frequency measurements.
      </Typography>
      
      <Typography variant="h6" sx={{ mt: 3 }}>Common Issues and Troubleshooting</Typography>
      <Box sx={{ mt: 1 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Feedback during measurement</Typography>
          <Typography variant="body2">
            If feedback occurs, check that the hearing aid is properly sealed in the ear canal and
            that gain settings are appropriate for the patient's hearing loss.
          </Typography>
        </Alert>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Probe tube movement</Typography>
          <Typography variant="body2">
            If the probe tube moves during measurements, results will be inconsistent.
            Ensure the tube is securely placed and minimize patient movement.
          </Typography>
        </Alert>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Poor match to targets</Typography>
          <Typography variant="body2">
            If measurements don't match targets despite adjustments, consider:
            <ul>
              <li>Different hearing aid style or model</li>
              <li>Acoustic modifications (vent size, dome type)</li>
              <li>Different prescription method</li>
            </ul>
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}>
          <Hearing sx={{ fontSize: 40, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 }, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Real Ear Measurement Practice
          </Typography>
        </Box>
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Practice" />
          <Tab label="Tutorial" />
          <Tab label="Reference" />
        </Tabs>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        {activeTab === 0 && (
          <>
            <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
              <Stepper activeStep={activeStep}>
                {remSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {remSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            
            {renderStepContent()}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !session) ||
                  (activeStep === 1 && probePosition !== ProbePosition.CORRECT) ||
                  isLoading
                }
              >
                {activeStep === remSteps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </>
        )}
        
        {activeTab === 1 && renderTutorialContent()}
        
        {activeTab === 2 && renderReferenceContent()}
      </Paper>
    </Container>
  );
};

export default RealEarMeasurementPage; 