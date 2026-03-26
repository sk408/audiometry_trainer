import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box, Container } from '@mui/material';
import { Home as HomeIcon, NavigateNext } from '@mui/icons-material';

const ROUTE_LABELS: Record<string, string> = {
  'assessment': 'Assessment',
  'pure-tone': 'Pure Tone Audiometry',
  'masking': 'Masking Practice',
  'speech': 'Speech Audiometry',
  'otoscopy': 'Otoscopy',
  'special-tests': 'Special Tests',
  'referrals': 'Referrals',
  'hearing-aids': 'Hearing Aids',
  'follow-up': 'Follow-Up Appointments',
  'adjustments': 'Complaint-Based Adjustments',
  'troubleshooting': 'Troubleshooting & Handouts',
  'rem': 'Real Ear Measurement',
  'earmolds': 'Earmolds & Amplification',
  'reference': 'Reference',
  'anatomy': 'Ear Anatomy',
  'practice': 'Practice',
  'patients': 'Virtual Patients',
  'quizzes': 'Quizzes & Scenarios',
};

const AppBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <MuiBreadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <HomeIcon sx={{ fontSize: 18, mr: 0.5 }} />
          Home
        </Box>
        {pathSegments.map((segment, index) => {
          const path = '/' + pathSegments.slice(0, index + 1).join('/');
          const label = ROUTE_LABELS[segment] || segment;
          const isLast = index === pathSegments.length - 1;

          if (isLast) {
            return (
              <Typography key={path} color="text.primary" variant="body2" fontWeight="medium">
                {label}
              </Typography>
            );
          }

          return (
            <Typography
              key={path}
              variant="body2"
              color="text.secondary"
            >
              {label}
            </Typography>
          );
        })}
      </MuiBreadcrumbs>
    </Container>
  );
};

export default AppBreadcrumbs;
