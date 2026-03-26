import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Divider,
  Container,
  useMediaQuery,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress,
  GlobalStyles,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  School,
  Person,
  Hearing as HearingIcon,
  Assessment as AssessmentIcon,
  Help,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  KeyboardArrowDown,
  HearingDisabled,
  ZoomIn,
  VolumeUp,
  Settings as SettingsIcon,
  RecordVoiceOver,
  Shield,
  MenuBook,
  ViewInAr,
  Quiz,
  Tune,
  Biotech,
  Warning,
  Assignment,
} from '@mui/icons-material';
import NavDropdown from './components/shared/NavDropdown';
import type { NavGroup } from './components/shared/NavDropdown';
import NavDrawer from './components/shared/NavDrawer';
import type { NavEntry } from './components/shared/NavDrawer';
import AppBreadcrumbs from './components/shared/Breadcrumbs';

// Lazy-loaded page components for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const TutorialPage = React.lazy(() => import('./pages/TutorialPage'));
const PatientsPage = React.lazy(() => import('./pages/PatientsPage'));
const FollowUpPage = React.lazy(() => import('./pages/FollowUpPage'));
const TroubleshootingGuidePage = React.lazy(() => import('./pages/TroubleshootingGuidePage'));
const RealEarMeasurementPage = React.lazy(() => import('./pages/RealEarMeasurementPage'));
const EarAnatomyPage = React.lazy(() => import('./pages/EarAnatomyPage'));
const OtoscopyPage = React.lazy(() => import('./pages/OtoscopyPage'));
const ContourTestPage = React.lazy(() => import('./pages/ContourTestPage'));
const ProgressPage = React.lazy(() => import('./pages/ProgressPage'));
const MaskingPracticePage = React.lazy(() => import('./pages/MaskingPracticePage'));
const SpeechAudiometryPage = React.lazy(() => import('./pages/SpeechAudiometryPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const ReferralsPage = React.lazy(() => import('./pages/ReferralsPage'));
const EarmoldsPage = React.lazy(() => import('./pages/EarmoldsPage'));
const ComplaintAdjustmentsPage = React.lazy(() => import('./pages/ComplaintAdjustmentsPage'));
const ClinicalDecisionPage = React.lazy(() => import('./pages/ClinicalDecisionPage'));
const AudiogramPatternsPage = React.lazy(() => import('./pages/AudiogramPatternsPage'));

// Import logo for splash screen
import logo from './logo512.png';

// Load settings from localStorage
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('audiometryTrainerSettings');
    return savedSettings ? JSON.parse(savedSettings) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

// Navigation structure: 5 grouped top-level items
const navigation: NavEntry[] = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  {
    label: 'Assessment', icon: <HearingIcon />, basePath: '/assessment',
    children: [
      { label: 'Pure Tone Audiometry', path: '/assessment/pure-tone', icon: <School /> },
      { label: 'Masking Practice', path: '/assessment/masking', icon: <Shield /> },
      { label: 'Speech Audiometry', path: '/assessment/speech', icon: <RecordVoiceOver /> },
      { label: 'Otoscopy', path: '/assessment/otoscopy', icon: <ZoomIn /> },
      { label: 'Special Tests', path: '/assessment/special-tests', icon: <VolumeUp /> },
      { label: 'Referrals', path: '/assessment/referrals', icon: <Warning /> },
    ],
  },
  {
    label: 'Hearing Aids', icon: <HearingDisabled />, basePath: '/hearing-aids',
    children: [
      { label: 'Follow-Up Appointments', path: '/hearing-aids/follow-up', icon: <Assignment /> },
      { label: 'Complaint-Based Adjustments', path: '/hearing-aids/adjustments', icon: <Tune /> },
      { label: 'Troubleshooting & Handouts', path: '/hearing-aids/troubleshooting', icon: <Help /> },
      { label: 'Real Ear Measurement', path: '/hearing-aids/rem', icon: <Biotech /> },
      { label: 'Earmolds & Amplification', path: '/hearing-aids/earmolds', icon: <HearingIcon /> },
    ],
  },
  {
    label: 'Reference', icon: <MenuBook />, basePath: '/reference',
    children: [
      { label: 'Ear Anatomy', path: '/reference/anatomy', icon: <ViewInAr /> },
      { label: 'Audiogram Patterns', path: '/reference/audiogram-patterns', icon: <AssessmentIcon /> },
      { label: 'Clinical Decision-Making', path: '/reference/clinical-decisions', icon: <Assignment /> },
    ],
  },
  {
    label: 'Practice', icon: <School />, basePath: '/practice',
    children: [
      { label: 'Virtual Patients', path: '/practice/patients', icon: <Person /> },
      { label: 'Quizzes & Scenarios', path: '/practice/quizzes', icon: <Quiz /> },
    ],
  },
];

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadAndApplySettings = () => {
      const settings = loadSettings();
      if (settings) {
        if (settings.darkMode !== undefined) setDarkMode(settings.darkMode);
        if (settings.highContrastMode !== undefined) setHighContrastMode(settings.highContrastMode);
        if (settings.fontSize !== undefined) setFontSize(settings.fontSize);
      }
    };

    loadAndApplySettings();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'audiometryTrainerSettings') loadAndApplySettings();
    };
    const handleCustomStorageChange = () => loadAndApplySettings();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('audiometrySettingsChanged', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('audiometrySettingsChanged', handleCustomStorageChange);
    };
  }, []);

  const appTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: highContrastMode ? '#0066cc' : '#2196f3' },
          secondary: { main: highContrastMode ? '#cc0066' : '#f50057' },
          contrastThreshold: highContrastMode ? 4.5 : 3,
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: fontSize === 'small' ? 14 : fontSize === 'large' ? 16 : 15,
          h1: { fontWeight: 500 },
          h2: { fontWeight: 500 },
          h3: { fontWeight: 500 },
          h4: { fontWeight: 500 },
          h5: { fontWeight: 500 },
          h6: { fontWeight: 500 },
        },
        components: {
          MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
          MuiPaper: { styleOverrides: { rounded: { borderRadius: 12 } } },
          MuiLink: { styleOverrides: { root: { color: 'inherit', '&:visited': { color: 'inherit' } } } },
        },
      }),
    [darkMode, highContrastMode, fontSize]
  );

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    try {
      const settings = loadSettings() || {};
      settings.darkMode = newDarkMode;
      localStorage.setItem('audiometryTrainerSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  };

  if (showSplash) {
    return (
      <Box
        sx={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: darkMode ? '#121212' : '#ffffff',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
        }}
      >
        <Box component="img" src={logo} alt="Audiometry Trainer Logo"
          sx={{ width: '80%', height: '80%', objectFit: 'contain' }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <GlobalStyles styles={{ 'a': { color: 'inherit', textDecoration: 'none' }, 'a:visited': { color: 'inherit' } }} />
      <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </ThemeProvider>
  );
}

function AppContent({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) return;
    setDrawerOpen(open);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <HearingIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Audiometry Trainer
            </Typography>

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navigation.map((entry) =>
                  isNavGroup(entry) ? (
                    <NavDropdown key={entry.label} group={entry} />
                  ) : (
                    <Button key={entry.label} color="inherit" component={Link} to={entry.path} sx={{ mx: 0.5 }}>
                      {entry.label}
                    </Button>
                  )
                )}
              </Box>
            )}

            <IconButton color="inherit" onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            <Button
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={isMobile ? null : <KeyboardArrowDown />}
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 32, height: 32, mr: isMobile ? 0 : 1, bgcolor: 'primary.dark' }}>S</Avatar>
              {!isMobile && "Student"}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem component={Link} to="/progress" onClick={() => setAnchorEl(null)}>
                <ListItemIcon><AssessmentIcon fontSize="small" /></ListItemIcon>
                My Progress
              </MenuItem>
              <MenuItem component={Link} to="/settings" onClick={() => setAnchorEl(null)}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem component="a" href="https://github.com/sk408/audiometry_trainer" target="_blank" onClick={() => setAnchorEl(null)}>
                <ListItemIcon><Help fontSize="small" /></ListItemIcon>
                Help & Resources
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <NavDrawer navigation={navigation} darkMode={darkMode} toggleDarkMode={toggleDarkMode} onClose={() => setDrawerOpen(false)} />
        </Drawer>

        <AppBreadcrumbs />

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomePage />} />

              {/* Assessment */}
              <Route path="/assessment/pure-tone" element={<TutorialPage />} />
              <Route path="/assessment/masking" element={<MaskingPracticePage />} />
              <Route path="/assessment/speech" element={<SpeechAudiometryPage />} />
              <Route path="/assessment/otoscopy" element={<OtoscopyPage />} />
              <Route path="/assessment/special-tests" element={<ContourTestPage />} />
              <Route path="/assessment/referrals" element={<ReferralsPage />} />

              {/* Hearing Aids */}
              <Route path="/hearing-aids/follow-up" element={<FollowUpPage />} />
              <Route path="/hearing-aids/adjustments" element={<ComplaintAdjustmentsPage />} />
              <Route path="/hearing-aids/troubleshooting" element={<TroubleshootingGuidePage />} />
              <Route path="/hearing-aids/rem" element={<RealEarMeasurementPage />} />
              <Route path="/hearing-aids/earmolds" element={<EarmoldsPage />} />

              {/* Reference */}
              <Route path="/reference/anatomy" element={<EarAnatomyPage />} />
              <Route path="/reference/audiogram-patterns" element={<AudiogramPatternsPage />} />
              <Route path="/reference/clinical-decisions" element={<ClinicalDecisionPage />} />

              {/* Practice */}
              <Route path="/practice/patients" element={<PatientsPage />} />
              <Route path="/practice/quizzes" element={<MaskingPracticePage />} />

              {/* Utility */}
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Redirects from old routes */}
              <Route path="/tutorial" element={<Navigate to="/assessment/pure-tone" replace />} />
              <Route path="/masking-practice" element={<Navigate to="/assessment/masking" replace />} />
              <Route path="/speech-audiometry" element={<Navigate to="/assessment/speech" replace />} />
              <Route path="/otoscopy" element={<Navigate to="/assessment/otoscopy" replace />} />
              <Route path="/contour-test" element={<Navigate to="/assessment/special-tests" replace />} />
              <Route path="/ear-anatomy" element={<Navigate to="/reference/anatomy" replace />} />
              <Route path="/patients" element={<Navigate to="/practice/patients" replace />} />
              <Route path="/custom-patients" element={<Navigate to="/practice/patients" replace />} />
              <Route path="/followup" element={<Navigate to="/hearing-aids/follow-up" replace />} />
              <Route path="/troubleshooting" element={<Navigate to="/hearing-aids/troubleshooting" replace />} />
              <Route path="/real-ear-measurement" element={<Navigate to="/hearing-aids/rem" replace />} />
            </Routes>
          </Suspense>
        </Box>

        {/* Footer - grouped columns */}
        <Box
          component="footer"
          sx={{
            py: 4, px: 2, mt: 'auto',
            backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[200] : t.palette.grey[800],
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 3, mb: 3 }}>
              <Box sx={{ minWidth: 140 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Assessment</Typography>
                <Typography variant="body2"><Link to="/assessment/pure-tone" style={{ color: 'inherit', textDecoration: 'none' }}>Pure Tone</Link></Typography>
                <Typography variant="body2"><Link to="/assessment/otoscopy" style={{ color: 'inherit', textDecoration: 'none' }}>Otoscopy</Link></Typography>
                <Typography variant="body2"><Link to="/assessment/speech" style={{ color: 'inherit', textDecoration: 'none' }}>Speech Audiometry</Link></Typography>
                <Typography variant="body2"><Link to="/assessment/referrals" style={{ color: 'inherit', textDecoration: 'none' }}>Referrals</Link></Typography>
              </Box>
              <Box sx={{ minWidth: 140 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Hearing Aids</Typography>
                <Typography variant="body2"><Link to="/hearing-aids/follow-up" style={{ color: 'inherit', textDecoration: 'none' }}>Follow-Up</Link></Typography>
                <Typography variant="body2"><Link to="/hearing-aids/adjustments" style={{ color: 'inherit', textDecoration: 'none' }}>Adjustments Guide</Link></Typography>
                <Typography variant="body2"><Link to="/hearing-aids/rem" style={{ color: 'inherit', textDecoration: 'none' }}>Real Ear</Link></Typography>
                <Typography variant="body2"><Link to="/hearing-aids/earmolds" style={{ color: 'inherit', textDecoration: 'none' }}>Earmolds</Link></Typography>
              </Box>
              <Box sx={{ minWidth: 140 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Reference</Typography>
                <Typography variant="body2"><Link to="/reference/anatomy" style={{ color: 'inherit', textDecoration: 'none' }}>Ear Anatomy</Link></Typography>
                <Typography variant="body2"><Link to="/reference/audiogram-patterns" style={{ color: 'inherit', textDecoration: 'none' }}>Audiogram Patterns</Link></Typography>
                <Typography variant="body2"><Link to="/reference/clinical-decisions" style={{ color: 'inherit', textDecoration: 'none' }}>Clinical Decisions</Link></Typography>
              </Box>
              <Box sx={{ minWidth: 140 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Practice</Typography>
                <Typography variant="body2"><Link to="/practice/patients" style={{ color: 'inherit', textDecoration: 'none' }}>Virtual Patients</Link></Typography>
                <Typography variant="body2"><Link to="/practice/quizzes" style={{ color: 'inherit', textDecoration: 'none' }}>Quizzes</Link></Typography>
              </Box>
              <Box sx={{ minWidth: 140 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Support</Typography>
                <Typography variant="body2"><Link to="/settings" style={{ color: 'inherit', textDecoration: 'none' }}>Settings</Link></Typography>
                <Typography variant="body2"><a href="https://github.com/sk408/audiometry_trainer" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a></Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              &copy; 2025 Stephen Kanney. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
