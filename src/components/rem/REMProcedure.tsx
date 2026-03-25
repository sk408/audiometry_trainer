/**
 * REMProcedure — Steps 2-5 of the REM workflow
 *
 * Steps 2/3/4: Running measurements (REUR / REOR / REAR)
 * Step 5: REIG Calculation
 *
 * Displays the measurement controls, signal type selection, info panels,
 * the chart, and the measurement legend.
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';

import {
  REMType,
  REMSignalType,
  REMLevel,
  REMCurve,
  REMTarget,
  ProbePosition,
  VentType,
} from '../../interfaces/RealEarMeasurementTypes';
import REMChart from '../REMChart';
import MeasurementLegend from './MeasurementLegend';
import {
  MEASUREMENT_TYPE_OPTIONS,
  SIGNAL_TYPE_OPTIONS,
  MEASUREMENT_INFO,
} from '../../data/remData';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface REMProcedureProps {
  activeStep: number;

  // Measurement params
  measurementType: REMType;
  onMeasurementTypeChange: (event: SelectChangeEvent) => void;
  signalType: REMSignalType;
  onSignalTypeChange: (event: SelectChangeEvent) => void;
  inputLevel: REMLevel;
  onInputLevelChange: (event: Event, newValue: number | number[]) => void;

  // Vent type (REOR)
  selectedVentType: VentType;
  onVentTypeChange: (event: SelectChangeEvent) => void;

  // Playback
  isPlaying: boolean;
  onPlaySignal: () => void;
  onStopSignal: () => void;

  // Measurement action
  isLoading: boolean;
  probePosition: ProbePosition;
  onPerformMeasurement: () => void;

  // Chart data
  allMeasurements: REMCurve[];
  currentTarget: REMTarget | null;
  isSmallScreen: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const REMProcedure: React.FC<REMProcedureProps> = ({
  activeStep,
  measurementType,
  onMeasurementTypeChange,
  signalType,
  onSignalTypeChange,
  inputLevel,
  onInputLevelChange,
  selectedVentType,
  onVentTypeChange,
  isPlaying,
  onPlaySignal,
  onStopSignal,
  isLoading,
  probePosition,
  onPerformMeasurement,
  allMeasurements,
  currentTarget,
  isSmallScreen,
}) => {
  // Step 5: REIG Calculation
  if (activeStep === 5) {
    return (
      <Box>
        <Typography variant="h6">REIG Calculation</Typography>
        <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
          <Typography gutterBottom>
            Real Ear Insertion Gain (REIG) is calculated as the difference between
            REAR and REUR. This shows the actual gain provided by the hearing aid
            in the patient's ear.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={onPerformMeasurement}
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
              width={isSmallScreen ? 550 : 700}
            />
          </Box>
        </Paper>
      </Box>
    );
  }

  // Steps 2/3/4: REUR / REOR / REAR measurements
  const info = MEASUREMENT_INFO[measurementType];
  const hasReur = allMeasurements.some((m) => m.type === 'REUR');

  return (
    <Box>
      <Typography variant="h6">{measurementType} Measurement</Typography>
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
        <Grid container spacing={3}>
          {/* Left column: controls */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Measurement Type</InputLabel>
              <Select
                value={measurementType}
                onChange={onMeasurementTypeChange}
                label="Measurement Type"
              >
                {MEASUREMENT_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Signal Type</InputLabel>
              <Select
                value={signalType}
                onChange={onSignalTypeChange}
                label="Signal Type"
              >
                {SIGNAL_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography gutterBottom>Input Level (dB SPL)</Typography>
            <Slider
              value={inputLevel}
              onChange={onInputLevelChange}
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
                onClick={isPlaying ? onStopSignal : onPlaySignal}
              >
                {isPlaying ? 'Stop Signal' : 'Play Signal'}
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={onPerformMeasurement}
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

          {/* Right column: info */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Information about {measurementType}
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              {/* REUR info */}
              {measurementType === 'REUR' && info && (
                <>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {info.description}
                  </Typography>
                  {info.tips && (
                    <Alert severity="info" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Tips for proper REUR response:</strong>
                      </Typography>
                      <Typography variant="body2" component="div">
                        <ul>
                          {info.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </Typography>
                    </Alert>
                  )}
                </>
              )}

              {/* REOR info + vent selector */}
              {measurementType === 'REOR' && (
                <>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {info?.description ??
                      'Real Ear Occluded Response measures the response with the hearing aid in place but turned off.'}
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Dome/Earmold Vent Type</InputLabel>
                    <Select
                      value={selectedVentType}
                      onChange={onVentTypeChange}
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
                      Vent size affects the sound pressure at the ear drum. More open
                      fittings (larger vents) will result in a response closer to REUR,
                      while more closed fittings will show greater occlusion effect at
                      low frequencies and more high-frequency attenuation.
                    </Typography>
                  </Alert>
                </>
              )}

              {/* REAR info */}
              {measurementType === 'REAR' && (
                <>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {info?.description ??
                      'Real Ear Aided Response measures the response with the hearing aid in place and turned on.'}
                  </Typography>
                  {hasReur && (
                    <Alert severity="info">
                      <Typography variant="body2">
                        The REAR should show the combined effect of the ear canal
                        resonance (REUR) plus the hearing aid gain. Compare the green
                        REAR curve with the blue REUR curve — the difference is the
                        actual insertion gain (REIG).
                      </Typography>
                    </Alert>
                  )}
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Chart */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Measurement Results
        </Typography>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <REMChart
            measurements={allMeasurements.length > 0 ? allMeasurements : null}
            target={currentTarget}
            height={300}
            width={isSmallScreen ? 550 : 700}
          />
        </Box>

        {allMeasurements.length > 0 && (
          <MeasurementLegend measurements={allMeasurements} />
        )}
      </Paper>
    </Box>
  );
};

export default REMProcedure;
