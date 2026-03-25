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
  LinearProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { CheckCircle, PlayArrow, RadioButtonUnchecked, EmojiEvents } from '@mui/icons-material';
import { HearingProfile } from '../interfaces/AudioTypes';
import { PatientProgress } from '../types/ProgressTypes';

interface PatientCardProps {
  patient: HearingProfile;
  onSelect: (patient: HearingProfile) => void;
  selected?: boolean;
  progress?: PatientProgress;
}

// Difficulty level color mapping
const difficultyColors: Record<string, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error'
};

// Hearing loss type color mapping
const hearingLossColors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'secondary'> = {
  normal: 'success',
  conductive: 'info',
  sensorineural: 'warning',
  mixed: 'error',
  asymmetrical: 'secondary',
  'noise-induced': 'warning',
  presbycusis: 'info'
};

// Get initials from patient name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle fontSize="small" color="success" />;
    case 'in_progress':
      return <PlayArrow fontSize="small" color="warning" />;
    default:
      return <RadioButtonUnchecked fontSize="small" color="disabled" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'in_progress': return 'In Progress';
    default: return 'Not Started';
  }
};

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect, selected = false, progress }) => {
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
                color={difficultyColors[patient.difficulty] ?? 'default'}
              />
              <Chip
                label={patient.hearingLossType.replace(/[-_]/g, ' ')}
                size="small"
                color={hearingLossColors[patient.hearingLossType] ?? 'default'}
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

        {/* Progress section */}
        {progress ? (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              {getStatusIcon(progress.completionStatus)}
              <Typography variant="body2" color="text.secondary">
                {getStatusLabel(progress.completionStatus)}
              </Typography>
              {progress.bestAccuracy >= 90 && (
                <EmojiEvents fontSize="small" sx={{ color: '#ffc107', ml: 'auto' }} />
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Best: {progress.bestAccuracy}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sessions: {progress.sessionsCompleted}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progress.bestAccuracy, 100)}
              color={progress.bestAccuracy >= 90 ? 'success' : progress.bestAccuracy >= 60 ? 'primary' : 'warning'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            {getStatusIcon('not_started')}
            <Typography variant="body2" color="text.secondary">
              Not Started
            </Typography>
          </Box>
        )}
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
