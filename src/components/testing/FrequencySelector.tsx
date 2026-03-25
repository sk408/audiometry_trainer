import React from 'react';
import { Box, Paper } from '@mui/material';
import { ThresholdPoint } from '../../interfaces/AudioTypes';
import Audiogram from '../Audiogram';

interface FrequencySelectorProps {
  thresholds: ThresholdPoint[];
  currentFrequency?: number;
  currentLevel?: number;
  toneActive: boolean;
  onPositionClick: (frequency: number, level: number) => void;
  interactive: boolean;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  thresholds,
  currentFrequency,
  currentLevel,
  toneActive,
  onPositionClick,
  interactive,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box sx={{
        height: { xs: 320, sm: 380, md: 450 },
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Audiogram
          thresholds={thresholds}
          currentFrequency={currentFrequency}
          currentLevel={currentLevel}
          toneActive={toneActive}
          onPositionClick={onPositionClick}
          interactive={interactive}
        />
      </Box>
    </Paper>
  );
};

export default FrequencySelector;
