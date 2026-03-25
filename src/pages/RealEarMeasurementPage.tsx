import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  Tab,
  Tabs,
  useMediaQuery,
} from '@mui/material';
import { Hearing } from '@mui/icons-material';

import { ProbePosition } from '../interfaces/RealEarMeasurementTypes';
import { REMSetup, REMProcedure, REMResults, REMTutorialTab, REMReferenceTab } from '../components/rem';
import { useREMSession } from '../components/rem/useREMSession';
import { REM_STEP_LABELS } from '../data/remData';

/**
 * RealEarMeasurementPage — Orchestrator for the 8-step REM practice workflow.
 *
 * All session state lives in the useREMSession hook. This component is responsible
 * only for layout, tab/step routing, and passing props to child components:
 *   - REMSetup      (steps 0-1)
 *   - REMProcedure  (steps 2-5)
 *   - REMResults    (steps 6-7)
 *   - REMTutorialTab / REMReferenceTab (tabs 1-2)
 */
const RealEarMeasurementPage: React.FC = () => {
  const s = useREMSession();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);

  const remSteps = useMemo(() => REM_STEP_LABELS, []);

  // ---------------------------------------------------------------------------
  // Step content router
  // ---------------------------------------------------------------------------

  const renderStepContent = () => {
    if (s.activeStep <= 1) {
      return (
        <REMSetup
          activeStep={s.activeStep}
          patients={s.patients}
          selectedPatient={s.selectedPatient}
          onPatientChange={s.handlePatientChange}
          hearingAids={s.hearingAids}
          selectedHearingAid={s.selectedHearingAid}
          onHearingAidChange={s.handleHearingAidChange}
          selectedEar={s.selectedEar}
          onEarChange={s.handleEarChange}
          onStartSession={s.startNewSession}
          hasSession={!!s.session}
          probeTubeDepth={s.probeTubeDepth}
          onProbeTubeDepthChange={s.setProbeTubeDepth}
          probePosition={s.probePosition}
          onPositionProbeTube={s.handlePositionProbeTube}
        />
      );
    }

    if (s.activeStep >= 2 && s.activeStep <= 5) {
      return (
        <REMProcedure
          activeStep={s.activeStep}
          measurementType={s.measurementType}
          onMeasurementTypeChange={s.handleMeasurementTypeChange}
          signalType={s.signalType}
          onSignalTypeChange={s.handleSignalTypeChange}
          inputLevel={s.inputLevel}
          onInputLevelChange={s.handleInputLevelChange}
          selectedVentType={s.selectedVentType}
          onVentTypeChange={s.handleVentTypeChange}
          isPlaying={s.isPlaying}
          onPlaySignal={s.playTestSignal}
          onStopSignal={s.stopTestSignal}
          isLoading={s.isLoading}
          probePosition={s.probePosition}
          onPerformMeasurement={s.performMeasurement}
          allMeasurements={s.allMeasurements}
          currentTarget={s.currentTarget}
          isSmallScreen={isSmallScreen}
        />
      );
    }

    if (s.activeStep >= 6) {
      return (
        <REMResults
          activeStep={s.activeStep}
          prescriptionMethod={s.prescriptionMethod}
          onPrescriptionMethodChange={s.handlePrescriptionMethodChange}
          onGenerateTargets={s.generateTargets}
          allMeasurements={s.allMeasurements}
          currentTarget={s.currentTarget}
          isSmallScreen={isSmallScreen}
          session={s.session}
          adjustedREAR={s.adjustedREAR}
          matchAccuracy={s.matchAccuracy}
          adjustmentFeedback={s.adjustmentFeedback}
          onAdjustGain={s.adjustGainAtFrequency}
          onCheckTargetMatch={s.checkTargetMatch}
          onResetAdjustments={s.resetAdjustments}
          onCompleteSession={s.completeSession}
        />
      );
    }

    return <Typography>Unknown step</Typography>;
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}>
          <Hearing sx={{ fontSize: 40, mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 }, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Real Ear Measurement Practice
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Practice" />
          <Tab label="Tutorial" />
          <Tab label="Reference" />
        </Tabs>

        {/* Alerts */}
        {s.error && <Alert severity="error" sx={{ mb: 2 }}>{s.error}</Alert>}
        {s.success && <Alert severity="success" sx={{ mb: 2 }}>{s.success}</Alert>}

        {/* Practice tab */}
        {activeTab === 0 && (
          <>
            {/* Horizontal stepper (desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
              <Stepper activeStep={s.activeStep}>
                {remSteps.map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>
            </Box>

            {/* Vertical stepper (mobile) */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
              <Stepper activeStep={s.activeStep} orientation="vertical">
                {remSteps.map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>
            </Box>

            {renderStepContent()}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button variant="outlined" disabled={s.activeStep === 0} onClick={() => s.setActiveStep(p => p - 1)}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => s.setActiveStep(p => p + 1)}
                disabled={
                  (s.activeStep === 0 && !s.session) ||
                  (s.activeStep === 1 && s.probePosition !== ProbePosition.CORRECT) ||
                  s.isLoading
                }
              >
                {s.activeStep === remSteps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </>
        )}

        {/* Tutorial tab */}
        {activeTab === 1 && <REMTutorialTab />}

        {/* Reference tab */}
        {activeTab === 2 && <REMReferenceTab />}
      </Paper>
    </Container>
  );
};

export default RealEarMeasurementPage;
