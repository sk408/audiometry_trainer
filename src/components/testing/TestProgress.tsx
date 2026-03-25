import React from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import { TestStep } from '../../interfaces/AudioTypes';

interface TestProgressProps {
  currentStep: TestStep | null;
  testProgress: number;
}

const TestProgress: React.FC<TestProgressProps> = ({ currentStep, testProgress }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          {currentStep ?
            `Testing ${currentStep.ear} ear at ${currentStep.frequency} Hz (${
              currentStep.testType === 'air' ? 'Air Conduction' :
              currentStep.testType === 'bone' ? 'Bone Conduction' :
              currentStep.testType === 'masked_air' ? 'Masked Air' :
              currentStep.testType === 'masked_bone' ? 'Masked Bone' :
              currentStep.testType
            })` :
            'Ready to start'}
        </Typography>
        <Chip
          label={`${testProgress}%`}
          color="primary"
        />
      </Box>
      <LinearProgress
        variant="determinate"
        value={testProgress}
        sx={{ height: 10, borderRadius: 5 }}
      />
    </Box>
  );
};

export default TestProgress;
