import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Grid,
  Snackbar,
  Tabs,
  Tab,
  Badge,
  Collapse,
} from '@mui/material';
import {
  VolumeUp,
  Person,
  MenuBook,
  KeyboardTab,
  Info as InfoIcon,
  Hearing as HearingIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { HearingProfile, TestSession } from '../interfaces/AudioTypes';
import { useTestingSession } from '../hooks/useTestingSession';
import GuidancePanel from './GuidancePanel';
import TabPanel, { a11yProps } from './shared/TabPanel';
import TestProgress from './testing/TestProgress';
import FrequencySelector from './testing/FrequencySelector';
import ToneControls from './testing/ToneControls';
import ResponseTracker from './testing/ResponseTracker';
import { useTheme, alpha } from '@mui/material/styles';

interface TestingInterfaceProps {
  patient: HearingProfile;
  onComplete: (session: TestSession) => void;
  onCancel: () => void;
}

const TestingInterface: React.FC<TestingInterfaceProps> = ({
  patient,
  onComplete,
  onCancel
}): React.ReactElement => {
  const hookState = useTestingSession({ patient, onComplete, onCancel });
  const theme = useTheme();

  const {
    session,
    currentStep,
    testProgress,
    errorMessage,
    patientResponse,
    showResponseIndicator,
    toneActive,
    trainerMode,
    currentGuidance,
    procedurePhase,
    suggestedAction,
    patientJustResponded,
    activeTab,
    showMainGuidance,
    thresholds,
    actionMap,
    setShowMainGuidance,
    setErrorMessage,
    handleTabChange,
    handleStoreThreshold,
    handleAudiogramClick,
    handleSuggestedAction,
    canStoreThreshold,
  } = hookState;

  if (!session || !currentStep) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Initializing test session...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {/* Test progress */}
        <Grid item xs={12}>
          <TestProgress currentStep={currentStep} testProgress={testProgress} />
        </Grid>

        {/* Audiogram */}
        <Grid item xs={12}>
          <FrequencySelector
            thresholds={thresholds}
            currentFrequency={currentStep?.frequency}
            currentLevel={currentStep?.currentLevel}
            toneActive={Boolean(toneActive)}
            onPositionClick={handleAudiogramClick}
            interactive={!!currentStep && !toneActive}
          />
        </Grid>

        {/* Current Guidance Panel */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 2,
              borderLeft: showResponseIndicator && Boolean(patientResponse) ? '4px solid #4caf50' : '4px solid #3f51b5'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight="500">
                  Current Guidance
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMainGuidance(!showMainGuidance);
                  }}
                  sx={{ ml: 1 }}
                  aria-label={showMainGuidance ? 'Collapse guidance panel' : 'Expand guidance panel'}
                >
                  {showMainGuidance ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
              </Box>
              <Box>
                {showMainGuidance && suggestedAction === 'store_threshold' && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckIcon />}
                    disabled={!canStoreThreshold()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStoreThreshold();
                    }}
                  >
                    Store Threshold
                  </Button>
                )}
                {showMainGuidance && suggestedAction !== 'store_threshold' && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSuggestedAction();
                    }}
                  >
                    {actionMap[suggestedAction]?.label || 'Apply Suggestion'}
                  </Button>
                )}
              </Box>
            </Box>
            <Collapse in={showMainGuidance}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {currentGuidance}
              </Typography>
              {showResponseIndicator && Boolean(patientResponse) && (
                <Alert severity="success" sx={{ mt: 1, py: 0.5 }} icon={<HearingIcon />}>
                  Patient responded to the tone
                </Alert>
              )}
            </Collapse>
          </Paper>
        </Grid>

        {/* Tabbed interface */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 0, mb: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="testing interface tabs"
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: '39px',
                    fontSize: { xs: '0.52rem', sm: '0.585rem' },
                    padding: { xs: 0.65, sm: 1.3 }
                  }
                }}
              >
                <Tab
                  icon={<VolumeUp />}
                  label="Testing"
                  {...a11yProps(0, 'testing')}
                />
                <Tab
                  icon={
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!patientResponse}
                    >
                      <Person />
                    </Badge>
                  }
                  label="Patient Response"
                  {...a11yProps(1, 'testing')}
                />
                {trainerMode && (
                  <Tab
                    icon={<MenuBook />}
                    label="Training Guide"
                    {...a11yProps(2, 'testing')}
                  />
                )}
              </Tabs>
            </Box>

            {/* Testing Tab */}
            <TabPanel value={activeTab} index={0} idPrefix="testing">
              <ToneControls hookState={hookState} />
            </TabPanel>

            {/* Patient Response Tab */}
            <TabPanel value={activeTab} index={1} idPrefix="testing">
              <ResponseTracker hookState={hookState} />
            </TabPanel>

            {/* Trainer Guide Tab */}
            {trainerMode && (
              <TabPanel value={activeTab} index={2} idPrefix="testing">
                <GuidancePanel
                  guidance={currentGuidance}
                  action={suggestedAction}
                  phase={procedurePhase}
                  onStoreThreshold={handleStoreThreshold}
                  canStoreThreshold={canStoreThreshold()}
                  patientResponded={patientJustResponded}
                  onImplementSuggestion={handleSuggestedAction}
                  showResponseAlert={showResponseIndicator && Boolean(patientResponse)}
                />
              </TabPanel>
            )}
          </Paper>
        </Grid>

        {/* Back button at the bottom */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Tooltip title="Go back">
            <IconButton
              onClick={onCancel}
              color="primary"
              aria-label="Go back"
              sx={{
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.action.active, 0.1)
                  : 'rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.action.active, 0.2)
                    : 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <KeyboardTab sx={{ transform: 'rotate(180deg)' }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {errorMessage && (
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
          <Alert onClose={() => setErrorMessage('')} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TestingInterface;
