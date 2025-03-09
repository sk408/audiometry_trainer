import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Hearing as HearingIcon,
  Assessment as AssessmentIcon,
  Help as HelpIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  KeyboardArrowDown,
  HearingDisabled
} from '@mui/icons-material';

// Import pages
import HomePage from './pages/HomePage';
import TutorialPage from './pages/TutorialPage';
import PatientsPage from './pages/PatientsPage';
import FollowUpPage from './pages/FollowUpPage';
import TroubleshootingGuidePage from './pages/TroubleshootingGuidePage';
// import SettingsPage from './pages/SettingsPage';

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

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [includeAirConduction, setIncludeAirConduction] = useState<boolean>(true);
  const [includeBoneConduction, setIncludeBoneConduction] = useState<boolean>(true);
  // Add state for the splash screen
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen for 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Load settings on mount
  useEffect(() => {
    const loadAndApplySettings = () => {
      const settings = loadSettings();
      if (settings) {
        if (settings.darkMode !== undefined) {
          setDarkMode(settings.darkMode);
        }
        if (settings.highContrastMode !== undefined) {
          setHighContrastMode(settings.highContrastMode);
        }
        if (settings.fontSize !== undefined) {
          setFontSize(settings.fontSize);
        }
        if (settings.includeAirConduction !== undefined) {
          setIncludeAirConduction(settings.includeAirConduction);
        }
        if (settings.includeBoneConduction !== undefined) {
          setIncludeBoneConduction(settings.includeBoneConduction);
        }
      }
    };

    // Initial load
    loadAndApplySettings();
    
    // Listen for storage events (when settings are changed in another tab/component)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'audiometryTrainerSettings') {
        console.log('Settings changed in another component, reloading settings');
        loadAndApplySettings();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleCustomStorageChange = () => {
      console.log('Settings changed in same tab, reloading settings');
      loadAndApplySettings();
    };
    
    window.addEventListener('audiometrySettingsChanged', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('audiometrySettingsChanged', handleCustomStorageChange);
    };
  }, []);

  // Create theme based on settings
  const appTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: highContrastMode ? '#0066cc' : '#2196f3',
          },
          secondary: {
            main: highContrastMode ? '#cc0066' : '#f50057',
          },
          contrastThreshold: highContrastMode ? 4.5 : 3,
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: fontSize === 'small' ? 14 : fontSize === 'large' ? 16 : 15,
          h1: {
            fontWeight: 500,
          },
          h2: {
            fontWeight: 500,
          },
          h3: {
            fontWeight: 500,
          },
          h4: {
            fontWeight: 500,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [darkMode, highContrastMode, fontSize]
  );

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Save to localStorage
    try {
      const settings = loadSettings() || {};
      settings.darkMode = newDarkMode;
      localStorage.setItem('audiometryTrainerSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Tutorial', icon: <SchoolIcon />, path: '/tutorial' },
    { text: 'Patients', icon: <PersonIcon />, path: '/patients' },
    { text: 'Follow-Up', icon: <HearingDisabled />, path: '/followup' },
    { text: 'Troubleshooting', icon: <HelpIcon />, path: '/troubleshooting' },
    // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HearingIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Audiometry Trainer
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem onClick={toggleDarkMode}>
          <ListItemIcon>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
        <ListItem component="a" href="https://github.com/sk408/audiometry_trainer" target="_blank">
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help & Resources" />
        </ListItem>
      </List>
    </Box>
  );

  const renderTestSettings = () => {
    return (
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Test Settings</Typography>
        
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Test Types</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={includeAirConduction} 
                  onChange={(e) => setIncludeAirConduction(e.target.checked)}
                />
              }
              label="Air Conduction"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={includeBoneConduction} 
                  onChange={(e) => setIncludeBoneConduction(e.target.checked)}
                />
              }
              label="Bone Conduction"
            />
          </FormGroup>
        </FormControl>
        
        {/* Other settings */}
        
      </Box>
    );
  };

  // If splash screen should be shown, render it
  if (showSplash) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: darkMode ? '#121212' : '#ffffff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Audiometry Trainer Logo"
          sx={{
            width: '80%',
            height: '80%',
            objectFit: 'contain',
          }}
        />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <HearingIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Audiometry Trainer
              </Typography>
              
              {!isMobile && (
                <Box sx={{ display: 'flex' }}>
                  {menuItems.map((item) => (
                    <Button 
                      key={item.text} 
                      color="inherit" 
                      component={Link} 
                      to={item.path}
                      sx={{ mx: 0.5 }}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
              )}
              
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
              <Button 
                color="inherit" 
                onClick={handleMenuOpen}
                endIcon={isMobile ? null : <KeyboardArrowDown />}
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, mr: isMobile ? 0 : 1, bgcolor: 'primary.dark' }}>
                  S
                </Avatar>
                {!isMobile && "Student"}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {/* <MenuItem onClick={handleMenuClose} component={Link} to="/settings">
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem> */}
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <AssessmentIcon fontSize="small" />
                  </ListItemIcon>
                  My Progress
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <HelpIcon fontSize="small" />
                  </ListItemIcon>
                  Help & Resources
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {drawer}
          </Drawer>
          
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tutorial" element={<TutorialPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/followup" element={<FollowUpPage />} />
              <Route path="/troubleshooting" element={<TroubleshootingGuidePage />} />
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
            </Routes>
          </Box>
          
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[200]
                  : theme.palette.grey[800],
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © 2025 Stephen Kanney. All rights reserved.
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 1, sm: 2 } }}>
                  <Link to="/tutorial" style={{ color: 'inherit' }}>
                    Tutorial
                  </Link>
                  <Link to="/patients" style={{ color: 'inherit' }}>
                    Practice
                  </Link>
                  <Link to="/followup" style={{ color: 'inherit' }}>
                    Follow-Up
                  </Link>
                  <Link to="/troubleshooting" style={{ color: 'inherit' }}>
                    Troubleshooting
                  </Link>
                  {/* <Link to="/settings" style={{ color: 'inherit' }}>
                    Settings
                  </Link> */}
                </Box>
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
