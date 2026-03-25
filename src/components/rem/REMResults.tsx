/**
 * REMResults — Steps 6 (Compare to Target) and 7 (Adjust Frequency Response)
 *
 * Step 6: prescription method selection, target generation, target comparison chart.
 * Step 7: per-frequency gain adjustment, target match checking, fit quality report,
 *          and session completion.
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
  Alert,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';

import remService from '../../services/RealEarMeasurementService';
import REMChart from '../REMChart';
import MeasurementLegend from './MeasurementLegend';
import {
  REMType,
  REMFrequency,
  REMCurve,
  REMTarget,
  REMSession,
} from '../../interfaces/RealEarMeasurementTypes';
import {
  PRESCRIPTION_METHOD_OPTIONS,
  PRESCRIPTION_DESCRIPTIONS,
  REM_FREQUENCIES_UI,
} from '../../data/remData';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface REMResultsProps {
  activeStep: number;

  // Prescription method
  prescriptionMethod: 'NAL-NL2' | 'DSL' | 'NAL-NL1' | 'custom';
  onPrescriptionMethodChange: (event: SelectChangeEvent) => void;
  onGenerateTargets: () => void;

  // Chart data
  allMeasurements: REMCurve[];
  currentTarget: REMTarget | null;
  isSmallScreen: boolean;

  // Session
  session: REMSession | null;

  // Adjustment state (step 7)
  adjustedREAR: REMCurve | null;
  matchAccuracy: number | null;
  adjustmentFeedback: string | null;
  onAdjustGain: (frequency: REMFrequency, adjustment: number) => void;
  onCheckTargetMatch: () => void;
  onResetAdjustments: () => void;
  onCompleteSession: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const REMResults: React.FC<REMResultsProps> = ({
  activeStep,
  prescriptionMethod,
  onPrescriptionMethodChange,
  onGenerateTargets,
  allMeasurements,
  currentTarget,
  isSmallScreen,
  session,
  adjustedREAR,
  matchAccuracy,
  adjustmentFeedback,
  onAdjustGain,
  onCheckTargetMatch,
  onResetAdjustments,
  onCompleteSession,
}) => {
  // -------------------------------------------------------------------------
  // Step 6: Compare to Target
  // -------------------------------------------------------------------------
  if (activeStep === 6) {
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
                  onChange={onPrescriptionMethodChange}
                  label="Prescription Method"
                >
                  {PRESCRIPTION_METHOD_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={onGenerateTargets}
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
                <Typography variant="body2">
                  {PRESCRIPTION_DESCRIPTIONS[prescriptionMethod] ?? ''}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
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
  }

  // -------------------------------------------------------------------------
  // Step 7: Adjust Frequency Response
  // -------------------------------------------------------------------------

  const reigTarget = session?.targets.find((t) => t.type === 'REIG') || null;

  // Build the measurements array that swaps in the adjusted REAR
  const chartMeasurements = adjustedREAR
    ? [...allMeasurements.filter((m) => m.type !== 'REAR'), adjustedREAR]
    : allMeasurements;

  // For fit quality report
  const targetForMatch = reigTarget || currentTarget;

  return (
    <Box>
      <Typography variant="h6">Adjust Frequency Response</Typography>
      <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 2 }}>
        <Typography gutterBottom>
          Adjust the REAR response to match the target by using the up and down
          buttons for each frequency. These adjustments simulate the process of
          fine-tuning a hearing aid's frequency response.
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          You should adjust the REAR response to match the REAR target (dotted
          line). This represents the ideal response needed to achieve the
          prescribed amplification for the patient.
        </Alert>

        {/* Chart */}
        <Box sx={{ mt: 3, width: '100%', overflowX: 'auto' }}>
          <REMChart
            measurements={chartMeasurements}
            target={reigTarget || currentTarget}
            height={300}
            width={isSmallScreen ? 550 : 700}
          />
        </Box>

        {/* Per-frequency adjustment controls */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
          Adjust Gain at Each Frequency (dB)
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(6, 1fr)',
              lg: 'repeat(11, 1fr)',
            },
            gap: 2,
            mb: 3,
          }}
        >
          {REM_FREQUENCIES_UI.map((freq) => {
            const currentGain =
              adjustedREAR?.measurementPoints.find((p) => p.frequency === freq)
                ?.gain || 0;

            return (
              <Box key={freq} sx={{ textAlign: 'center' }}>
                <Typography variant="body2" fontWeight="bold">
                  {freq} Hz
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onAdjustGain(freq, 1)}
                    aria-label={`Increase gain at ${freq} Hz`}
                  >
                    <Box sx={{ fontSize: '1.5rem' }}>↑</Box>
                  </IconButton>

                  <Typography variant="body1" fontWeight="bold">
                    {currentGain.toFixed(1)}
                  </Typography>

                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onAdjustGain(freq, -1)}
                    aria-label={`Decrease gain at ${freq} Hz`}
                  >
                    <Box sx={{ fontSize: '1.5rem' }}>↓</Box>
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onCheckTargetMatch}
            disabled={!adjustedREAR}
          >
            Check Target Match
          </Button>

          <Button
            variant="outlined"
            onClick={onResetAdjustments}
            disabled={!adjustedREAR}
          >
            Reset Adjustments
          </Button>

          {matchAccuracy !== null && (
            <Button
              variant="contained"
              color="success"
              onClick={onCompleteSession}
            >
              Complete REM Procedure
            </Button>
          )}
        </Box>

        {/* Adjustment feedback */}
        {adjustmentFeedback && (
          <Alert
            severity={
              matchAccuracy && matchAccuracy >= 80
                ? 'success'
                : matchAccuracy && matchAccuracy >= 70
                ? 'info'
                : 'warning'
            }
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

        {/* Per-frequency fit quality report */}
        {matchAccuracy !== null && adjustedREAR && targetForMatch && (
          <FitQualityReport
            adjustedREAR={adjustedREAR}
            target={targetForMatch}
            matchAccuracy={matchAccuracy}
          />
        )}

        {/* Best practices */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="subtitle2">
            Clinical best practices for target matching:
          </Typography>
          <ul>
            <li>
              Speech frequencies (1000-4000 Hz) should be within ±3 dB of target
            </li>
            <li>
              Low frequencies (125-750 Hz) should be within ±5 dB of target
            </li>
            <li>
              High frequencies (6000-8000 Hz) should be within ±8 dB of target
            </li>
            <li>
              Overall RMS difference should be less than 5 dB for an optimal fit
            </li>
          </ul>
        </Alert>
      </Paper>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Internal sub-component: Fit Quality Report
// ---------------------------------------------------------------------------

interface FitQualityReportProps {
  adjustedREAR: REMCurve;
  target: REMTarget;
  matchAccuracy: number;
}

const FitQualityReport: React.FC<FitQualityReportProps> = ({
  adjustedREAR,
  target,
  matchAccuracy,
}) => {
  const perFreq = remService.getPerFrequencyMatch(adjustedREAR, target);
  const passCount = perFreq.filter((p) => p.withinTolerance).length;
  const interpretation = remService.getFitInterpretation(matchAccuracy);

  return (
    <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
      <Typography variant="h6" gutterBottom>
        Fit Quality Report
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {passCount} of {perFreq.length} frequencies within clinical tolerance
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(6, 1fr)',
            lg: 'repeat(11, 1fr)',
          },
          gap: 1,
          mb: 2,
        }}
      >
        {perFreq.map((p) => (
          <Box
            key={p.frequency}
            sx={{
              textAlign: 'center',
              p: 1,
              borderRadius: 1,
              bgcolor: p.withinTolerance ? 'success.light' : 'error.light',
              color: p.withinTolerance
                ? 'success.contrastText'
                : 'error.contrastText',
            }}
          >
            <Typography variant="caption" display="block">
              {p.frequency} Hz
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {p.difference > 0 ? '+' : ''}
              {p.difference.toFixed(1)}
            </Typography>
            <Typography variant="caption" display="block">
              {p.withinTolerance ? 'PASS' : 'FAIL'}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ opacity: 0.8 }}
            >
              ±{p.tolerance} dB
            </Typography>
          </Box>
        ))}
      </Box>

      <Alert
        severity={
          matchAccuracy >= 85
            ? 'success'
            : matchAccuracy >= 70
            ? 'info'
            : 'warning'
        }
        sx={{ mt: 2 }}
      >
        <Typography variant="subtitle2">Clinical Interpretation</Typography>
        <Typography variant="body2">{interpretation}</Typography>
      </Alert>
    </Paper>
  );
};

export default REMResults;
