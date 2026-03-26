import React from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  VolumeUp,
  Check,
  ArrowUpward,
  ArrowDownward,
  ArrowBackIosNew,
  ArrowForwardIos,
} from '@mui/icons-material';
import { UseTestingSessionReturn } from '../../hooks/useTestingSession';

interface ToneControlsProps {
  hookState: UseTestingSessionReturn;
}

const ToneControls: React.FC<ToneControlsProps> = ({ hookState }) => {
  const {
    currentStep,
    toneActive,
    handleAdjustLevel,
    handleAdjustFrequency,
    handleStoreThreshold,
    startTone,
    stopTone,
    canStoreThreshold,
  } = hookState;

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, touchAction: 'manipulation' }}>
      {/* Current level display */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="body1" gutterBottom>
          Current Level:
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 1
        }}>
          <Tooltip title="Decrease by 10 dB (descending phase)">
            <IconButton
              color="secondary"
              disabled={!currentStep || toneActive}
              onClick={() => handleAdjustLevel(-10)}
              size="medium"
              aria-label="Decrease level by 10 dB"
            >
              <ArrowDownward />
            </IconButton>
          </Tooltip>

          <Chip
            label={`${currentStep ? currentStep.currentLevel : '--'} dB HL`}
            color="primary"
            sx={{
              fontSize: '0.9rem',
              height: 'auto',
              p: 0.7,
              mx: 1
            }}
          />

          <Box>
            <Tooltip title="Increase by 5 dB (ascending phase)">
              <IconButton
                color="primary"
                disabled={!currentStep || toneActive}
                onClick={() => handleAdjustLevel(5)}
                size="small"
                aria-label="Increase level by 5 dB"
              >
                <ArrowUpward />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Frequency adjustment buttons */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          ml: 2
        }}>
          <Typography variant="body2" color="textSecondary">
            Frequency
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Decrease frequency">
              <IconButton
                color="secondary"
                disabled={!currentStep || toneActive}
                onClick={() => handleAdjustFrequency(-1)}
                size="small"
                aria-label="Decrease frequency"
              >
                <ArrowBackIosNew fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Increase frequency">
              <IconButton
                color="secondary"
                disabled={!currentStep || toneActive}
                onClick={() => handleAdjustFrequency(1)}
                size="small"
                aria-label="Increase frequency"
              >
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Present tone button — click to play, auto-stops after pulsed duration */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          position: 'relative'
        }}
        className="tone-button-container"
      >
        <Button
          color="primary"
          variant="contained"
          size="large"
          disabled={!currentStep}
          onClick={(e) => {
            e.preventDefault();
            if (toneActive) {
              stopTone();
            } else {
              startTone();
            }
          }}
          startIcon={<VolumeUp />}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            backgroundColor: toneActive ? 'success.main' : 'primary.main',
            '&:hover': {
              backgroundColor: toneActive ? 'success.dark' : 'primary.dark',
            },
            userSelect: 'none',
          }}
        >
          {toneActive ? 'Tone Playing...' : 'Present Tone'}
        </Button>
      </Box>

      {/* Store threshold button */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2
      }}>
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          disabled={!currentStep || toneActive || !canStoreThreshold()}
          onClick={handleStoreThreshold}
          startIcon={<Check />}
          fullWidth
        >
          Store Threshold
        </Button>
      </Box>
    </Box>
  );
};

export default ToneControls;
