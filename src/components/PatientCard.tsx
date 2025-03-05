import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { HearingProfile } from '../interfaces/AudioTypes';

interface PatientCardProps {
  patient: HearingProfile;
  onSelect: (patient: HearingProfile) => void;
  selected?: boolean;
}

// Difficulty level color mapping
const difficultyColors = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error'
};

// Hearing loss type color mapping
const hearingLossColors = {
  normal: 'success',
  conductive: 'info',
  sensorineural: 'warning',
  mixed: 'error',
  asymmetrical: 'secondary'
};

// Get initials from patient name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect, selected = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card 
      elevation={selected ? 8 : 3} 
      sx={{ 
        maxWidth: '100%', 
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        border: selected ? '2px solid #3f51b5' : 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          mb: 2 
        }}>
          <Avatar 
            sx={{ 
              bgcolor: selected ? '#3f51b5' : '#9c27b0',
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1, sm: 0 }
            }}
          >
            {getInitials(patient.name)}
          </Avatar>
          <Box sx={{ 
            width: '100%',
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Typography variant="h6" component="div" gutterBottom>
              {patient.name}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-start' } 
            }}>
              <Chip 
                label={patient.difficulty} 
                size="small" 
                color={difficultyColors[patient.difficulty] as any}
              />
              <Chip 
                label={patient.hearingLossType.replace('_', ' ')} 
                size="small" 
                color={hearingLossColors[patient.hearingLossType] as any}
              />
            </Box>
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        >
          {patient.description}
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Profile ID:</strong> {patient.id}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            <strong>Thresholds:</strong> {patient.thresholds.length} data points
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: { xs: 1, sm: 1.5 } }}>
        <Button 
          size={isMobile ? "medium" : "small"}
          variant={selected ? "contained" : "outlined"} 
          color="primary"
          onClick={() => onSelect(patient)}
          fullWidth
        >
          {selected ? 'Selected' : 'Select Patient'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PatientCard; 