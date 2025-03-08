import React, { ReactElement, useEffect, useState } from 'react';
import { Paper, Typography, Box, Chip, Button, Divider, Alert, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from '@mui/icons-material/Check';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SchoolIcon from '@mui/icons-material/School';
import HearingIcon from '@mui/icons-material/Hearing';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Define interface for component props
interface GuidancePanelProps {
  guidance: string;
  action: string;
  phase: string;
  onStoreThreshold?: () => void;
  canStoreThreshold: boolean;
  patientResponded?: boolean;
  onImplementSuggestion?: () => void;
  showResponseAlert?: boolean;
}

// Define animations
const flash = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

// Styled components
const ActionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(1),
  fontWeight: 'bold',
  padding: theme.spacing(2, 1),
  height: 'auto',
  '& .MuiChip-label': {
    padding: theme.spacing(0.5, 1),
  },
  '& .MuiChip-icon': {
    fontSize: '1.2rem',
  }
}));

const PhaseContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  display: 'flex',
  alignItems: 'center',
}));

const ResponseAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  animation: `${flash} 1.5s infinite ease-in-out`,
  boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
  border: '1px solid #4caf50'
}));

const PhaseBadge = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '0.85rem',
  padding: theme.spacing(0.5, 1),
  marginBottom: theme.spacing(1),
}));

const HelpButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  textTransform: 'none',
  fontWeight: '500',
}));

const GuidancePanel: React.FC<GuidancePanelProps> = ({
  guidance,
  action,
  phase,
  onStoreThreshold,
  canStoreThreshold,
  patientResponded = false,
  onImplementSuggestion,
  showResponseAlert = false
}) => {
  const [responseDetected, setResponseDetected] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const theme = useTheme();
  
  // Update effect to handle responseDetected
  useEffect(() => {
    console.log('GuidancePanel received patientResponded:', patientResponded);
    
    if (patientResponded) {
      console.log('Setting responseDetected to true');
      setResponseDetected(true);
      
      // Keep a record that a response was detected recently
      const timer = setTimeout(() => {
        setResponseDetected(false);
      }, 8000); // Keep the styling for 8 seconds
      
      return () => {
        console.log('Cleaning up timer');
        clearTimeout(timer);
      };
    }
  }, [patientResponded]);

  // Map of actions to their display info
  const actionMap: Record<string, { label: string, icon: ReactElement, color: "primary" | "secondary" | "success" | "error" | "info" | "warning", description: string }> = {
    increase: { 
      label: 'Increase Level (+5 dB)', 
      icon: <ArrowUpwardIcon />, 
      color: 'primary',
      description: 'Increase the hearing level by 5 dB. This smaller step size is used during the ascending phase and after no-response during bracketing to precisely identify the threshold.'
    },
    decrease: { 
      label: 'Decrease Level (-10 dB)', 
      icon: <ArrowDownwardIcon />, 
      color: 'secondary',
      description: 'Decrease the hearing level by 10 dB. After ANY positive response, the Hughson-Westlake protocol requires an immediate 10 dB decrease to prevent adaptation and maintain stimulus uncertainty.'
    },
    present: { 
      label: 'Present Tone', 
      icon: <VolumeUpIcon />, 
      color: 'info',
      description: 'Present a 1-2 second tone burst to check if the patient can hear it at the current level. Short tone bursts enhance detectability compared to continuous tones.'
    },
    store_threshold: { 
      label: 'Store Threshold', 
      icon: <CheckIcon />, 
      color: 'success',
      description: 'The threshold has been determined (≥2 responses out of 3 presentations at the same level). This is the lowest intensity that achieves a 50% or greater response rate during ascending trials.'
    },
    next: { 
      label: 'Next Frequency', 
      icon: <SkipNextIcon />, 
      color: 'warning',
      description: 'Move to the next test frequency. The standard sequence (1→2→4→8 kHz then 0.25→0.5 kHz) minimizes cross-frequency masking effects.'
    }
  };

  // Get action display info
  const actionInfo = actionMap[action] || { 
    label: 'Continue Testing', 
    icon: <PlayArrowIcon />, 
    color: 'primary',
    description: 'Continue with the testing procedure following the Hughson-Westlake protocol.' 
  };

  // Phase display names and descriptions
  const phaseInfo: Record<string, { name: string, description: string, tips: string[] }> = {
    initial: {
      name: 'Initial Presentation',
      description: 'Start with a comfortable level that the patient is likely to hear (30-40 dB HL).',
      tips: [
        'Begin at a level 30-40 dB above estimated threshold (typically 1 kHz initially)',
        'Present a clearly audible tone for 1-2 seconds to establish baseline',
        'Short tone bursts are more detectable than continuous tones',
        'If no response, increase in 10-15 dB steps until response is obtained'
      ]
    },
    descending: {
      name: 'Descending Phase',
      description: 'Decrease intensity in 10 dB steps until the patient no longer responds.',
      tips: [
        'After each response, immediately decrease by 10 dB steps',
        'Continue the descent until the patient fails to respond',
        'The descending phase identifies the sub-threshold boundary',
        'This large step size (10 dB) efficiently approaches the threshold region'
      ]
    },
    ascending: {
      name: 'Ascending Phase',
      description: 'From the last non-responsive level, increase intensity in 5 dB steps until the patient responds again.',
      tips: [
        'After no response, increase by 5 dB steps',
        'Smaller step size (5 dB) provides more precise threshold determination',
        'Continue until the patient responds again',
        'This first response marks the beginning of threshold determination'
      ]
    },
    threshold: {
      name: 'Threshold Determination (Bracketing)',
      description: 'Use the 10 dB down / 5 dB up bracketing technique to determine threshold.',
      tips: [
        'After each response: immediately reduce level by 10 dB',
        'After no response: increase by 5 dB steps',
        'Threshold is defined as the lowest level with ≥50% response rate',
        'Required: 2/3 responses at the same level for automated testing',
        'Must not stagnate at a single level; each response triggers a mandatory 10 dB descent',
        'Continue the oscillatory pattern until meeting threshold criteria'
      ]
    },
    complete: {
      name: 'Threshold Complete',
      description: 'The threshold has been established. Record this value and proceed to the next frequency.',
      tips: [
        'Store the current level as the threshold for this frequency',
        'The threshold is defined as the lowest level at which at least 2 out of 3 responses are obtained',
        'Verify the threshold with a non-response at 5 dB below the threshold level',
        'Move to the next test frequency and repeat the procedure',
        'Standard sequence is 1→2→4→8 kHz then 0.25→0.5 kHz to minimize cross-frequency masking'
      ]
    }
  };

  // Get phase info
  const currentPhaseInfo = phaseInfo[phase] || phaseInfo.initial;

  // Force showing the response alert if showResponseAlert is true
  const shouldShowAlert = showResponseAlert || patientResponded;
  const isResponseRelevant = shouldShowAlert || responseDetected;

  // Handle implementation of suggestion
  const handleImplementSuggestion = () => {
    if (onImplementSuggestion) {
      onImplementSuggestion();
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 2, 
        backgroundColor: isResponseRelevant 
          ? theme.palette.mode === 'dark' 
            ? alpha(theme.palette.success.dark, 0.1) 
            : '#f5fff5' 
          : theme.palette.mode === 'dark' 
            ? theme.palette.background.paper 
            : '#f8f9fa', 
        borderLeft: isResponseRelevant ? '4px solid #4caf50' : '4px solid #3f51b5',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}
    >
      {shouldShowAlert && (
        <ResponseAlert 
          icon={<HearingIcon sx={{ fontSize: 24 }} />}
          severity="success"
        >
          Patient has responded to the tone! Follow the suggested action below.
        </ResponseAlert>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SchoolIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold">
          Hughson-Westlake Training Guide
        </Typography>
      </Box>

      {/* Current Phase Section */}
      <Box sx={{ mb: 3 }}>
        <PhaseBadge 
          label={currentPhaseInfo.name}
          size="medium"
          color={phase === 'complete' ? 'success' : 'primary'} 
          sx={{ fontWeight: 'bold', px: 1 }}
        />
        
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
          {currentPhaseInfo.description}
        </Typography>
        
        <HelpButton 
          startIcon={showHelp ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setShowHelp(!showHelp)}
          color="primary"
          variant="text"
          size="small"
        >
          {showHelp ? "Hide Details" : "Show Procedure Details"}
        </HelpButton>
        
        <Collapse in={showHelp}>
          <Box sx={{ 
            mt: 1, 
            p: 2, 
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.6) 
              : '#f5f5f5', 
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              {currentPhaseInfo.name} - Procedure Tips:
            </Typography>
            <List dense>
              {currentPhaseInfo.tips.map((tip, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Collapse>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Current Action Guidance */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Current Guidance:
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            p: 2, 
            backgroundColor: isResponseRelevant 
              ? theme.palette.mode === 'dark' 
                ? alpha(theme.palette.success.dark, 0.2) 
                : '#e8f5e9' 
              : theme.palette.mode === 'dark' 
                ? alpha(theme.palette.primary.dark, 0.1) 
                : '#e3f2fd', 
            borderRadius: 2, 
            fontWeight: 500,
            border: isResponseRelevant 
              ? `1px solid ${theme.palette.success.main}` 
              : `1px solid ${theme.palette.mode === 'dark' ? theme.palette.primary.dark : '#bbdefb'}`,
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}
        >
          {guidance}
        </Typography>
      </Box>
      
      {/* Suggested Action Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Suggested Action:
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: 1,
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.6) 
            : '#f8f9fa',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          animation: action === 'store_threshold' || action === 'present' ? 
            `${pulse} 2s infinite` : 'none',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 2 }}>
            <Typography variant="body1" fontWeight="medium" gutterBottom>
              {actionInfo.label}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {actionInfo.description}
            </Typography>
          </Box>
          
          {/* New Implementation Button */}
          {action !== 'present' && onImplementSuggestion && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleImplementSuggestion}
              startIcon={actionInfo.icon}
              sx={{
                mt: 1,
                alignSelf: 'flex-end'
              }}
            >
              Implement This Suggestion
            </Button>
          )}
        </Box>
        
        {action === 'store_threshold' && canStoreThreshold && onStoreThreshold && (
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<CheckIcon />}
            onClick={onStoreThreshold}
            sx={{ 
              mt: 2, 
              px: 3, 
              py: 1.5,
              boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
              fontWeight: 'bold'
            }}
            fullWidth
          >
            Store This Threshold & Continue
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default GuidancePanel; 