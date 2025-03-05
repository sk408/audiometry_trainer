import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  VolumeUp,
  Brightness4,
  Brightness7,
  Save,
  Refresh,
  KeyboardTab,
  AccessibilityNew,
  Info,
  HelpOutline
} from '@mui/icons-material';
import { DEFAULT_TONE_DURATION, DEFAULT_STARTING_LEVEL } from '../constants/AudioConstants';

// Mock settings service - in a real app, this would be a proper service
const saveSettings = (settings: any) => {
  try {
    localStorage.setItem('audiometryTrainerSettings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
    
    // Dispatch a custom event to notify the App component of settings changes within the same tab
    window.dispatchEvent(new Event('audiometrySettingsChanged'));
    
    return Promise.resolve(true);
  } catch (error) {
    console.error('Error saving settings:', error);
    return Promise.reject(error);
  }
};

const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('audiometryTrainerSettings');
    const parsedSettings = savedSettings ? JSON.parse(savedSettings) : null;
    console.log('Settings loaded:', parsedSettings);
    return parsedSettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

const SettingsPage: React.FC = () => {
  // Default settings
  const defaultSettings = {
    darkMode: false,
    volume: 80,
    toneDuration: DEFAULT_TONE_DURATION,
    startingLevel: DEFAULT_STARTING_LEVEL,
    useKeyboardShortcuts: true,
    showFrequencyLabels: true,
    showIntensityLabels: true,
    autoSaveResults: true,
    calibrationMode: false,
    highContrastMode: false,
    notificationSounds: true,
    fontSize: 'medium',
    language: 'en'
  };

  // State for settings
  const [settings, setSettings] = useState(defaultSettings);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadSettings();
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...savedSettings });
    }
  }, [defaultSettings]);

  // Handle settings changes
  const handleChange = (setting: string, value: any) => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    setSettings(updatedSettings);
    
    // Auto-save settings whenever they change
    saveSettings(updatedSettings)
      .then(() => {
        // Only show the success message for important changes
        if (['darkMode', 'highContrastMode', 'fontSize', 'language'].includes(setting)) {
          setSavedSuccessfully(true);
          setTimeout(() => setSavedSuccessfully(false), 2000);
        }
      })
      .catch(error => console.error('Failed to save setting:', setting, error));
  };

  // Handle save button click
  const handleSave = async () => {
    await saveSettings(settings);
    setSavedSuccessfully(true);
  };

  // Handle reset to defaults
  const handleReset = () => {
    setSettings(defaultSettings);
    setShowResetConfirm(false);
    
    // Save default settings
    saveSettings(defaultSettings)
      .then(() => {
        setSavedSuccessfully(true);
        setTimeout(() => setSavedSuccessfully(false), 2000);
      })
      .catch(error => console.error('Failed to save default settings', error));
  };

  // Close success message
  const handleCloseSnackbar = () => {
    setSavedSuccessfully(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Customize your audiometry training experience with these settings.
        Changes are saved automatically.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Display Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={(e) => handleChange('darkMode', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {settings.darkMode ? <Brightness4 sx={{ mr: 1 }} /> : <Brightness7 sx={{ mr: 1 }} />}
                    <Typography>Dark Mode</Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.highContrastMode}
                    onChange={(e) => handleChange('highContrastMode', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessibilityNew sx={{ mr: 1 }} />
                    <Typography>High Contrast Mode</Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Font Size</InputLabel>
                <Select
                  value={settings.fontSize}
                  onChange={(e) => handleChange('fontSize', e.target.value)}
                  label="Font Size"
                >
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  label="Language"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="de">Deutsch</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Audio Settings
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Volume
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VolumeUp sx={{ mr: 2 }} />
                <Slider
                  value={settings.volume}
                  onChange={(_, value) => handleChange('volume', value)}
                  aria-labelledby="volume-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Tone Duration (seconds)
              </Typography>
              <Slider
                value={settings.toneDuration}
                onChange={(_, value) => handleChange('toneDuration', value)}
                aria-labelledby="tone-duration-slider"
                valueLabelDisplay="auto"
                step={0.1}
                marks
                min={0.5}
                max={2.0}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Default Starting Level (dB HL)
              </Typography>
              <Slider
                value={settings.startingLevel}
                onChange={(_, value) => handleChange('startingLevel', value)}
                aria-labelledby="starting-level-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={20}
                max={60}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notificationSounds}
                    onChange={(e) => handleChange('notificationSounds', e.target.checked)}
                    color="primary"
                  />
                }
                label="Play notification sounds"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Testing Interface Settings
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.useKeyboardShortcuts}
                    onChange={(e) => handleChange('useKeyboardShortcuts', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <KeyboardTab sx={{ mr: 1 }} />
                    <Typography>Enable Keyboard Shortcuts</Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showFrequencyLabels}
                    onChange={(e) => handleChange('showFrequencyLabels', e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Frequency Labels on Audiogram"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showIntensityLabels}
                    onChange={(e) => handleChange('showIntensityLabels', e.target.checked)}
                    color="primary"
                  />
                }
                label="Show Intensity Labels on Audiogram"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoSaveResults}
                    onChange={(e) => handleChange('autoSaveResults', e.target.checked)}
                    color="primary"
                  />
                }
                label="Automatically Save Test Results"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.calibrationMode}
                    onChange={(e) => handleChange('calibrationMode', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography>Calibration Mode</Typography>
                    <Tooltip title="For advanced users. Enables precise calibration of output levels.">
                      <IconButton size="small">
                        <HelpOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Refresh />}
                onClick={() => setShowResetConfirm(true)}
              >
                Reset to Defaults
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Keyboard Shortcuts
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Space" secondary="Present tone" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Up/Down Arrows" secondary="Adjust intensity" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Left/Right Arrows" secondary="Change frequency" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="R" secondary="Switch to right ear" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="L" secondary="Switch to left ear" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="M" secondary="Toggle masking" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Enter" secondary="Record threshold" />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Info sx={{ mr: 1 }} />
              About Settings
            </Typography>
            <Typography variant="body2" paragraph>
              Settings are automatically saved to your browser's local storage.
              They will persist between sessions on this device.
            </Typography>
            <Typography variant="body2">
              For optimal audio performance, we recommend using headphones
              and calibrating your system volume.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation dialog for reset */}
      <Snackbar
        open={showResetConfirm}
        autoHideDuration={6000}
        onClose={() => setShowResetConfirm(false)}
      >
        <Alert
          severity="warning"
          action={
            <>
              <Button color="inherit" size="small" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button color="inherit" size="small" onClick={handleReset}>
                Confirm
              </Button>
            </>
          }
        >
          Are you sure you want to reset all settings to defaults?
        </Alert>
      </Snackbar>

      {/* Success message */}
      <Snackbar
        open={savedSuccessfully}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">Settings saved successfully!</Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage; 