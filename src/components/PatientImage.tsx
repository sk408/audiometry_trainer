import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HearingIcon from '@mui/icons-material/Hearing';
import { styled, keyframes } from '@mui/material/styles';

interface PatientImageProps {
  patientId?: string;
  responding: boolean;
  idle: boolean;
}

// Define animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(76, 175, 80, 0.5);
    transform: scale(1.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    transform: scale(1);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const PatientContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease'
}));

const PatientAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'responding' && prop !== 'wasResponding'
})<{ responding?: boolean; wasResponding?: boolean }>(({ theme, responding, wasResponding }) => ({
  width: 140,
  height: 140,
  backgroundColor: (responding || wasResponding) ? theme.palette.success.light : theme.palette.primary.light,
  transition: 'background-color 0.3s ease',
  ...(responding && {
    animation: `${pulse} 1.5s infinite`
  })
}));

const ResponseIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  right: -15,
  backgroundColor: theme.palette.success.main,
  borderRadius: '50%',
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadows[5],
  animation: `${pulse} 1.5s infinite`
}));

const ResponseLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 'bold',
  color: theme.palette.success.main,
  animation: `${fadeIn} 0.5s ease`
}));

const PatientImage: React.FC<PatientImageProps> = ({ patientId, responding, idle }) => {
  // Add local state to debounce response changes and prevent flickering
  const [isResponding, setIsResponding] = useState(responding);
  const [wasResponding, setWasResponding] = useState(false);
  
  // Handle responding state changes with minimal delay
  useEffect(() => {
    console.log('PatientImage: responding prop =', responding);
    
    if (responding) {
      // Immediately show response
      setIsResponding(true);
      setWasResponding(true);
    } else {
      // FIXED: Use 100ms delay instead of 1500ms
      // This provides a much faster return to default state
      const timeoutId = setTimeout(() => {
        if (!responding) {
          console.log('PatientImage: quickly resetting isResponding to false');
          setIsResponding(false);
          
          // Also reset wasResponding quickly (after just a tiny additional delay)
          // This prevents the lingering "Response Detected" message
          setTimeout(() => {
            setWasResponding(false);
          }, 100); // FIXED: 100ms instead of 3000ms
        }
      }, 100); // FIXED: 100ms instead of 1500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [responding]);
  
  // Use the debounced state for rendering
  const effectiveResponding = isResponding || responding;
  
  return (
    <PatientContainer sx={{ 
      opacity: idle ? 0.7 : 1,
      transform: effectiveResponding ? 'scale(1.05)' : 'scale(1)',
      border: effectiveResponding ? '6px solid #4caf50' : wasResponding ? '3px solid #a5d6a7' : '1px solid #e0e0e0',
      boxShadow: effectiveResponding ? '0 0 25px rgba(76, 175, 80, 0.7)' : wasResponding ? '0 0 15px rgba(76, 175, 80, 0.3)' : 'none',
      // FIXED: Make transition faster for a snappier response
      transition: 'all 0.1s ease',
      borderRadius: '12px',
      backgroundColor: effectiveResponding ? '#f0fff0' : wasResponding ? '#f8fff8' : '#ffffff'
    }}>
      <PatientAvatar 
        responding={effectiveResponding}
        wasResponding={wasResponding}
      >
        <PersonIcon sx={{ 
          fontSize: 90, 
          color: effectiveResponding ? '#1b5e20' : wasResponding ? '#2e7d32' : undefined 
        }} />
      </PatientAvatar>
      
      {effectiveResponding && (
        <>
          <ResponseIndicator>
            <HearingIcon sx={{ fontSize: 30 }} color="inherit" />
          </ResponseIndicator>
          <ResponseLabel variant="h6">
            Patient Responding!
          </ResponseLabel>
        </>
      )}
      
      {!effectiveResponding && wasResponding && (
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mt: 2, 
            color: '#2e7d32', 
            fontWeight: 500,
            opacity: 0.8
          }}
        >
          Response Detected
        </Typography>
      )}
    </PatientContainer>
  );
};

export default PatientImage; 