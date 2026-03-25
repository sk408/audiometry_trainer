/**
 * REMSetup — Steps 0 (Setup Equipment) and 1 (Position Probe Tube)
 *
 * Handles patient selection, hearing aid selection, ear selection,
 * session initialization, and probe tube positioning.
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
  IconButton,
  Tooltip,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { Info } from '@mui/icons-material';

import {
  ProbePosition,
  VirtualHearingAid,
} from '../../interfaces/RealEarMeasurementTypes';
import { PROBE_DEPTH_MARKS } from '../../data/remData';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface REMSetupProps {
  activeStep: number;

  // Patient state
  patients: Array<{ id: string; name: string; age: number; hearingLoss: string }>;
  selectedPatient: string;
  onPatientChange: (event: SelectChangeEvent) => void;

  // Hearing aid state
  hearingAids: VirtualHearingAid[];
  selectedHearingAid: string;
  onHearingAidChange: (event: SelectChangeEvent) => void;

  // Ear state
  selectedEar: 'left' | 'right';
  onEarChange: (event: SelectChangeEvent) => void;

  // Session
  onStartSession: () => void;
  hasSession: boolean;

  // Probe tube
  probeTubeDepth: number;
  onProbeTubeDepthChange: (depth: number) => void;
  probePosition: ProbePosition;
  onPositionProbeTube: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const REMSetup: React.FC<REMSetupProps> = ({
  activeStep,
  patients,
  selectedPatient,
  onPatientChange,
  hearingAids,
  selectedHearingAid,
  onHearingAidChange,
  selectedEar,
  onEarChange,
  onStartSession,
  probeTubeDepth,
  onProbeTubeDepthChange,
  probePosition,
  onPositionProbeTube,
}) => {
  if (activeStep === 0) {
    return (
      <Box>
        <Typography variant="h6">Setup Equipment</Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Patient</InputLabel>
              <Select
                value={selectedPatient}
                onChange={onPatientChange}
                label="Select Patient"
              >
                {patients.map((patient) => (
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
                onChange={onHearingAidChange}
                label="Select Hearing Aid"
              >
                {hearingAids.map((aid) => (
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
                onChange={onEarChange}
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
              onClick={onStartSession}
              disabled={!selectedPatient || !selectedHearingAid}
            >
              Initialize Setup
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // activeStep === 1 — Probe Tube Positioning
  return (
    <Box>
      <Typography variant="h6">Position Probe Tube</Typography>
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
        <Typography gutterBottom>
          Adjust probe tube depth (mm). The correct insertion depth is between
          20mm and 30mm.
        </Typography>
        <Slider
          value={probeTubeDepth}
          onChange={(_e, newValue) => onProbeTubeDepthChange(newValue as number)}
          step={1}
          marks={PROBE_DEPTH_MARKS as unknown as { value: number; label: string }[]}
          min={0}
          max={40}
          valueLabelDisplay="on"
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onPositionProbeTube}
          >
            Check Position
          </Button>

          <Tooltip title="Correct position is typically 25-28mm from the tragus.">
            <IconButton aria-label="Probe position information">
              <Info />
            </IconButton>
          </Tooltip>
        </Box>

        {probePosition !== ProbePosition.NOT_INSERTED && (
          <Alert
            severity={probePosition === ProbePosition.CORRECT ? 'success' : 'error'}
            sx={{ mt: 2 }}
          >
            Probe position: {probePosition.replace('_', ' ')}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default REMSetup;
