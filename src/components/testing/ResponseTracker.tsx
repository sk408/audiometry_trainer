import React from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import PatientImage from '../PatientImage';
import { UseTestingSessionReturn } from '../../hooks/useTestingSession';

interface ResponseTrackerProps {
  hookState: UseTestingSessionReturn;
}

const ResponseTracker: React.FC<ResponseTrackerProps> = ({ hookState }) => {
  const {
    patient,
    currentStep,
    toneActive,
    patientResponse,
    showResponseIndicator,
    handlePatientResponse,
  } = hookState;

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Patient information in this tab */}
      <Box sx={{
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: 2
      }}>
        <PatientImage
          patientId={patient.id}
          responding={Boolean(patientResponse)}
          idle={!toneActive && !showResponseIndicator}
        />
        <Box sx={{
          mt: { xs: 2, sm: 0 },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Typography variant="h6">{patient.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {patient.description}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Patient response UI */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: patientResponse ? 'success.light' : 'background.paper',
        transition: 'background-color 0.3s'
      }}>
        <Typography variant="h6">
          {patientResponse
            ? 'Patient has responded! \ud83d\udc4d'
            : 'Waiting for patient response...'}
        </Typography>

        <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color={patientResponse ? 'success' : 'primary'}
            size="large"
            disabled={!currentStep || !toneActive}
            onClick={handlePatientResponse}
            startIcon={<Check />}
            fullWidth
            sx={{ py: 2 }}
          >
            Patient Heard Tone
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResponseTracker;
