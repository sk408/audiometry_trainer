import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  useMediaQuery,
  Slider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Palette as PaletteIcon,
  Tune as TuneIcon,
  HearingDisabled as MaskingIcon,
  DeleteForever as DeleteIcon,
  RestartAlt as ResetIcon,
  Storage as StorageIcon,
  Contrast as ContrastIcon,
} from '@mui/icons-material';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Settings {
  darkMode: boolean;
  highContrastMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  audiogramConvention: 'asha' | 'bsa';
  frequencyRange: number[];
  includeAirConduction: boolean;
  includeBoneConduction: boolean;
  startingLevel: number;
  toneType: 'pulsed' | 'continuous';
  maskingProtocol: 'hood' | 'formula';
}

type ConfirmAction = 'clearProgress' | 'clearPatients' | 'resetSettings' | null;

const ALL_FREQUENCIES = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  highContrastMode: false,
  fontSize: 'medium',
  audiogramConvention: 'asha',
  frequencyRange: [...ALL_FREQUENCIES],
  includeAirConduction: true,
  includeBoneConduction: true,
  startingLevel: 40,
  toneType: 'pulsed',
  maskingProtocol: 'hood',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'audiometryTrainerSettings';

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(patch: Partial<Settings>) {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, unknown>;
    const merged = { ...current, ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event('audiometrySettingsChanged'));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

function estimateStorageUsage(): string {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += key.length + (localStorage.getItem(key)?.length ?? 0);
      }
    }
    const kb = (total * 2) / 1024; // UTF-16 ~ 2 bytes per char
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  } catch {
    return 'unknown';
  }
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  // Reload settings if changed externally
  useEffect(() => {
    const reload = () => setSettings(loadSettings());
    window.addEventListener('storage', reload);
    return () => window.removeEventListener('storage', reload);
  }, []);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings({ [key]: value });
      return next;
    });
  }, []);

  // Derive theme mode value for the radio group
  const themeMode = settings.highContrastMode
    ? 'highContrast'
    : settings.darkMode
      ? 'dark'
      : 'light';

  const handleThemeChange = (mode: string) => {
    const patch: Partial<Settings> = {
      darkMode: mode === 'dark' || mode === 'highContrast',
      highContrastMode: mode === 'highContrast',
    };
    setSettings((prev) => ({ ...prev, ...patch }));
    saveSettings(patch);
  };

  const handleFrequencyToggle = (freq: number) => {
    const current = settings.frequencyRange;
    const next = current.includes(freq) ? current.filter((f) => f !== freq) : [...current, freq].sort((a, b) => a - b);
    if (next.length === 0) return; // keep at least one
    update('frequencyRange', next);
  };

  // Confirmation dialogs
  const executeConfirmAction = () => {
    switch (confirmAction) {
      case 'clearProgress':
        localStorage.removeItem('progressData');
        setSnackbar('Progress data cleared.');
        break;
      case 'clearPatients':
        localStorage.removeItem('customPatients');
        setSnackbar('Custom patients cleared.');
        break;
      case 'resetSettings':
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event('audiometrySettingsChanged'));
        setSettings({ ...DEFAULT_SETTINGS });
        setSnackbar('Settings reset to defaults.');
        break;
    }
    setConfirmAction(null);
  };

  const confirmLabels: Record<string, { title: string; body: string }> = {
    clearProgress: {
      title: 'Clear Progress Data?',
      body: 'This will permanently delete all your training progress and scores. This action cannot be undone.',
    },
    clearPatients: {
      title: 'Clear Custom Patients?',
      body: 'This will permanently delete all custom patient cases you have created. This action cannot be undone.',
    },
    resetSettings: {
      title: 'Reset All Settings?',
      body: 'This will restore every setting to its default value. Your progress data and custom patients will not be affected.',
    },
  };

  const fontSizeMarks = [
    { value: 0, label: 'Small' },
    { value: 1, label: 'Medium' },
    { value: 2, label: 'Large' },
  ];
  const fontSizeMap: Record<number, 'small' | 'medium' | 'large'> = { 0: 'small', 1: 'medium', 2: 'large' };
  const fontSizeIndex = settings.fontSize === 'small' ? 0 : settings.fontSize === 'large' ? 2 : 1;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Settings
      </Typography>

      {/* ---- Section 1: Appearance ---- */}
      <Section icon={<PaletteIcon color="primary" />} title="Appearance">
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Theme Mode</FormLabel>
          <RadioGroup
            row={!isMobile}
            value={themeMode}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            <FormControlLabel value="highContrast" control={<Radio />} label="High Contrast" />
          </RadioGroup>
        </FormControl>

        <Box sx={{ mb: 2, maxWidth: 300 }}>
          <FormLabel component="legend">Font Size</FormLabel>
          <Slider
            value={fontSizeIndex}
            min={0}
            max={2}
            step={1}
            marks={fontSizeMarks}
            valueLabelDisplay="off"
            onChange={(_, v) => update('fontSize', fontSizeMap[v as number])}
            aria-label="Font size"
            sx={{ mt: 1 }}
          />
        </Box>

        {/* Live preview */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: settings.darkMode ? '#121212' : '#fafafa',
            color: settings.darkMode ? '#fff' : '#000',
            border: settings.highContrastMode ? '2px solid' : undefined,
            borderColor: settings.highContrastMode ? 'primary.main' : undefined,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize:
                settings.fontSize === 'small' ? '0.8rem' : settings.fontSize === 'large' ? '1.1rem' : '0.95rem',
              mb: 0.5,
            }}
          >
            Preview
          </Typography>
          <Typography
            sx={{
              fontSize:
                settings.fontSize === 'small' ? '0.85rem' : settings.fontSize === 'large' ? '1.15rem' : '1rem',
            }}
          >
            This is how text will appear with the current theme and font size settings.
          </Typography>
        </Paper>
      </Section>

      {/* ---- Section 2: Audiogram Conventions ---- */}
      <Section icon={<ContrastIcon color="primary" />} title="Audiogram Conventions">
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Symbol Convention</FormLabel>
          <RadioGroup
            value={settings.audiogramConvention}
            onChange={(e) => update('audiogramConvention', e.target.value as 'asha' | 'bsa')}
          >
            <FormControlLabel
              value="asha"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1">ASHA</Typography>
                  <Typography variant="caption" color="text.secondary">
                    O / X for right/left air conduction; {'<'} / {'>'} for right/left bone unmasked
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="bsa"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1">BSA</Typography>
                  <Typography variant="caption" color="text.secondary">
                    O / X for right/left air conduction; [ / ] for right/left bone
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">Frequency Display Range</FormLabel>
          <FormGroup row sx={{ mt: 1 }} aria-label="Frequency display range checkboxes">
            {ALL_FREQUENCIES.map((freq) => (
              <FormControlLabel
                key={freq}
                control={
                  <Checkbox
                    checked={settings.frequencyRange.includes(freq)}
                    onChange={() => handleFrequencyToggle(freq)}
                    size="small"
                  />
                }
                label={freq >= 1000 ? `${freq / 1000}k` : String(freq)}
                sx={{ minWidth: isMobile ? 72 : 80 }}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Section>

      {/* ---- Section 3: Test Configuration ---- */}
      <Section icon={<TuneIcon color="primary" />} title="Test Configuration">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.includeAirConduction}
                onChange={(e) => update('includeAirConduction', e.target.checked)}
              />
            }
            label="Include Air Conduction"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.includeBoneConduction}
                onChange={(e) => update('includeBoneConduction', e.target.checked)}
              />
            }
            label="Include Bone Conduction"
          />

          <FormControl sx={{ maxWidth: 200, mt: 1 }}>
            <FormLabel>Starting Level (dB HL)</FormLabel>
            <Select
              size="small"
              value={settings.startingLevel}
              onChange={(e) => update('startingLevel', e.target.value as number)}
              sx={{ mt: 0.5 }}
            >
              <MenuItem value={30}>30 dB HL</MenuItem>
              <MenuItem value={40}>40 dB HL</MenuItem>
              <MenuItem value={50}>50 dB HL</MenuItem>
            </Select>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <FormLabel component="legend">Tone Type</FormLabel>
            <RadioGroup
              row
              value={settings.toneType}
              onChange={(e) => update('toneType', e.target.value as 'pulsed' | 'continuous')}
            >
              <FormControlLabel value="pulsed" control={<Radio />} label="Pulsed" />
              <FormControlLabel value="continuous" control={<Radio />} label="Continuous" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Section>

      {/* ---- Section 4: Masking Protocol ---- */}
      <Section icon={<MaskingIcon color="primary" />} title="Masking Protocol">
        <FormControl component="fieldset">
          <FormLabel component="legend">Protocol Preference</FormLabel>
          <RadioGroup
            value={settings.maskingProtocol}
            onChange={(e) => update('maskingProtocol', e.target.value as 'hood' | 'formula')}
          >
            <FormControlLabel
              value="hood"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1">Hood Plateau Method</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Incrementally increase masking noise in the non-test ear until the threshold in the test ear
                    stabilises across a plateau of masking levels.
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="formula"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1">Formula-Based</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Calculate the required masking level using the air-bone gap, interaural attenuation, and the
                    occlusion effect to determine initial and maximum masking values.
                  </Typography>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
      </Section>

      {/* ---- Section 5: Data Management ---- */}
      <Section icon={<StorageIcon color="primary" />} title="Data Management">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Estimated localStorage usage: <strong>{estimateStorageUsage()}</strong>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 320 }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmAction('clearProgress')}
          >
            Clear Progress Data
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<DeleteIcon />}
            onClick={() => setConfirmAction('clearPatients')}
          >
            Clear Custom Patients
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ResetIcon />}
            onClick={() => setConfirmAction('resetSettings')}
          >
            Reset All Settings
          </Button>
        </Box>
      </Section>

      {/* ---- Confirmation Dialog ---- */}
      <Dialog open={confirmAction !== null} onClose={() => setConfirmAction(null)}>
        {confirmAction && (
          <>
            <DialogTitle>{confirmLabels[confirmAction].title}</DialogTitle>
            <DialogContent>
              <DialogContentText>{confirmLabels[confirmAction].body}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmAction(null)}>Cancel</Button>
              <Button color="error" variant="contained" onClick={executeConfirmAction}>
                Confirm
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ---- Snackbar ---- */}
      <Snackbar
        open={snackbar !== null}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(null)} severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;
