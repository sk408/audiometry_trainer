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
  Avatar
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
  KeyboardArrowDown
} from '@mui/icons-material';

// Import pages
import HomePage from './pages/HomePage';
import TutorialPage from './pages/TutorialPage';
import PatientsPage from './pages/PatientsPage';
import SettingsPage from './pages/SettingsPage';

// Import settings context
import { SettingsProvider, useSettings } from './contexts/SettingsContext';

function AppContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { settings, updateSetting } = useSettings();

  // Create theme based on settings
  const appTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: settings.darkMode ? 'dark' : 'light',
          primary: {
            main: settings.highContrastMode ? '#ffffff' : '#2196f3',
          },
          secondary: {
            main: settings.highContrastMode ? '#ffff00' : '#f50057',
          },
          background: {
            default: settings.highContrastMode 
              ? (settings.darkMode ? '#000000' : '#ffffff')
              : (settings.darkMode ? '#121212' : '#f5f5f5'),
            paper: settings.highContrastMode 
              ? (settings.darkMode ? '#121212' : '#f5f5f5')
              : (settings.darkMode ? '#1e1e1e' : '#ffffff'),
          },
          text: {
            primary: settings.highContrastMode 
              ? (settings.darkMode ? '#ffffff' : '#000000')
              : (settings.darkMode ? '#e0e0e0' : '#212121'),
            secondary: settings.highContrastMode 
              ? (settings.darkMode ? '#cccccc' : '#333333')
              : (settings.darkMode ? '#a0a0a0' : '#757575'),
          },
          contrastThreshold: settings.highContrastMode ? 4.5 : 3,
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: settings.fontSize === 'small' ? 12 : settings.fontSize === 'large' ? 16 : 14,
          h1: {
            fontWeight: 500,
            fontSize: settings.fontSize === 'small' ? '2rem' : settings.fontSize === 'large' ? '3rem' : '2.5rem',
          },
          h2: {
            fontWeight: 500,
            fontSize: settings.fontSize === 'small' ? '1.75rem' : settings.fontSize === 'large' ? '2.75rem' : '2.25rem',
          },
          h3: {
            fontWeight: 500,
            fontSize: settings.fontSize === 'small' ? '1.5rem' : settings.fontSize === 'large' ? '2.5rem' : '2rem',
          },
          h4: {
            fontWeight: 500,
            fontSize: settings.fontSize === 'small' ? '1.25rem' : settings.fontSize === 'large' ? '2.25rem' : '1.75rem',
          },
          h5: {
            fontWeight: 500,
            fontSize: settings.fontSize === 'small' ? '1.1rem' : settings.fontSize === 'large' ? '2rem' : '1.5rem',
          },
          h6: {
            fontWeight: 500,
            fontSize: settings.fontSize === 'small' ? '1rem' : settings.fontSize === 'large' ? '1.75rem' : '1.25rem',
          },
          body1: {
            fontSize: settings.fontSize === 'small' ? '0.875rem' : settings.fontSize === 'large' ? '1.25rem' : '1rem',
          },
          body2: {
            fontSize: settings.fontSize === 'small' ? '0.75rem' : settings.fontSize === 'large' ? '1.1rem' : '0.875rem',
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
    [settings.darkMode, settings.highContrastMode, settings.fontSize]
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
    updateSetting('darkMode', !settings.darkMode);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Tutorial', icon: <SchoolIcon />, path: '/tutorial' },
    { text: 'Patients', icon: <PersonIcon />, path: '/patients' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
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
            {settings.darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText primary={settings.darkMode ? 'Light Mode' : 'Dark Mode'} />
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
                {settings.darkMode ? <LightModeIcon /> : <DarkModeIcon />}
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
                <MenuItem onClick={handleMenuClose} component={Link} to="/settings">
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
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
              <Route path="/settings" element={<SettingsPage />} />
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
                  <Link to="/settings" style={{ color: 'inherit' }}>
                    Settings
                  </Link>
                </Box>
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
