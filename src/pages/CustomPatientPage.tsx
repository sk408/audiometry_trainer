import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  useMediaQuery,
  SelectChangeEvent,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Save,
  Delete,
  Edit,
  Refresh,
  PersonAdd,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import type {
  Frequency,
  HearingLevel,
  HearingProfile,
  ThresholdPoint,
} from '../interfaces/AudioTypes';

const STORAGE_KEY = 'customPatients';

const AIR_FREQUENCIES: Frequency[] = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
const BONE_FREQUENCIES: Frequency[] = [250, 500, 1000, 2000, 3000, 4000];

const HL_VALUES: HearingLevel[] = [
  -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120,
];

const LOSS_TYPES: HearingProfile['hearingLossType'][] = [
  'normal', 'conductive', 'sensorineural', 'mixed',
  'asymmetrical', 'noise-induced', 'presbycusis',
];

const DIFFICULTIES: HearingProfile['difficulty'][] = ['beginner', 'intermediate', 'advanced'];

type ThresholdGrid = Record<string, HearingLevel>;

function gridKey(ear: 'left' | 'right', type: 'air' | 'bone', freq: Frequency): string {
  return `${ear}-${type}-${freq}`;
}

function buildDefaultGrid(): ThresholdGrid {
  const grid: ThresholdGrid = {};
  for (const ear of ['right', 'left'] as const) {
    for (const f of AIR_FREQUENCIES) grid[gridKey(ear, 'air', f)] = 20;
    for (const f of BONE_FREQUENCIES) grid[gridKey(ear, 'bone', f)] = 20;
  }
  return grid;
}

interface PresetConfig {
  label: string;
  build: () => ThresholdGrid;
}

const PRESETS: PresetConfig[] = [
  {
    label: 'Normal Hearing',
    build: () => {
      const g: ThresholdGrid = {};
      for (const ear of ['right', 'left'] as const) {
        for (const f of AIR_FREQUENCIES) g[gridKey(ear, 'air', f)] = 15;
        for (const f of BONE_FREQUENCIES) g[gridKey(ear, 'bone', f)] = 15;
      }
      return g;
    },
  },
  {
    label: 'Mild Sloping SNHL',
    build: () => {
      const g: ThresholdGrid = {};
      const airMap: Record<number, HearingLevel> = {
        250: 20, 500: 25, 1000: 30, 2000: 35, 3000: 40, 4000: 45, 6000: 50, 8000: 50,
      };
      for (const ear of ['right', 'left'] as const) {
        for (const f of AIR_FREQUENCIES) g[gridKey(ear, 'air', f)] = airMap[f];
        for (const f of BONE_FREQUENCIES) g[gridKey(ear, 'bone', f)] = airMap[f];
      }
      return g;
    },
  },
  {
    label: 'Moderate Flat SNHL',
    build: () => {
      const g: ThresholdGrid = {};
      for (const ear of ['right', 'left'] as const) {
        for (const f of AIR_FREQUENCIES) g[gridKey(ear, 'air', f)] = 50;
        for (const f of BONE_FREQUENCIES) g[gridKey(ear, 'bone', f)] = 50;
      }
      return g;
    },
  },
  {
    label: 'Severe SNHL',
    build: () => {
      const g: ThresholdGrid = {};
      for (const ear of ['right', 'left'] as const) {
        for (const f of AIR_FREQUENCIES) g[gridKey(ear, 'air', f)] = 80;
        for (const f of BONE_FREQUENCIES) g[gridKey(ear, 'bone', f)] = 75;
      }
      return g;
    },
  },
  {
    label: 'Conductive Loss',
    build: () => {
      const g: ThresholdGrid = {};
      for (const ear of ['right', 'left'] as const) {
        for (const f of AIR_FREQUENCIES) g[gridKey(ear, 'air', f)] = 45;
        for (const f of BONE_FREQUENCIES) g[gridKey(ear, 'bone', f)] = 10;
      }
      return g;
    },
  },
];

interface ValidationError {
  key: string;
  message: string;
}

function validateGrid(grid: ThresholdGrid): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const ear of ['right', 'left'] as const) {
    for (const f of BONE_FREQUENCIES) {
      const airVal = grid[gridKey(ear, 'air', f)];
      const boneVal = grid[gridKey(ear, 'bone', f)];
      if (boneVal > airVal) {
        errors.push({
          key: gridKey(ear, 'bone', f),
          message: `Bone (${boneVal}) > Air (${airVal}) at ${f} Hz`,
        });
      }
    }
  }
  return errors;
}

function gridToThresholds(grid: ThresholdGrid): ThresholdPoint[] {
  const points: ThresholdPoint[] = [];
  for (const ear of ['right', 'left'] as const) {
    for (const f of AIR_FREQUENCIES) {
      points.push({
        frequency: f,
        hearingLevel: grid[gridKey(ear, 'air', f)],
        ear,
        testType: 'air',
        responseStatus: 'threshold',
      });
    }
    for (const f of BONE_FREQUENCIES) {
      points.push({
        frequency: f,
        hearingLevel: grid[gridKey(ear, 'bone', f)],
        ear,
        testType: 'bone',
        responseStatus: 'threshold',
      });
    }
  }
  return points;
}

function thresholdsToGrid(thresholds: ThresholdPoint[]): ThresholdGrid {
  const grid = buildDefaultGrid();
  for (const t of thresholds) {
    if (t.testType === 'air' || t.testType === 'bone') {
      const key = gridKey(t.ear, t.testType, t.frequency);
      if (key in grid) grid[key] = t.hearingLevel;
    }
  }
  return grid;
}

function loadCustomPatients(): HearingProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HearingProfile[]) : [];
  } catch {
    return [];
  }
}

function saveCustomPatients(patients: HearingProfile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

// Audiogram preview symbol positions
const PREVIEW_FREQS = AIR_FREQUENCIES;
const PREVIEW_MIN = -10;
const PREVIEW_MAX = 120;

const CustomPatientPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [difficulty, setDifficulty] = useState<HearingProfile['difficulty']>('beginner');
  const [lossType, setLossType] = useState<HearingProfile['hearingLossType']>('normal');
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [grid, setGrid] = useState<ThresholdGrid>(buildDefaultGrid);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Saved patients
  const [savedPatients, setSavedPatients] = useState<HearingProfile[]>(loadCustomPatients);

  // UI state
  const [snackMsg, setSnackMsg] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    setSavedPatients(loadCustomPatients());
  }, []);

  const validationErrors = useMemo(() => validateGrid(grid), [grid]);
  const errorKeys = useMemo(() => new Set(validationErrors.map((e) => e.key)), [validationErrors]);
  const isFormValid = name.trim().length > 0 && validationErrors.length === 0;

  const handleCellChange = useCallback((key: string, value: HearingLevel) => {
    setGrid((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setName('');
    setAge('');
    setGender('male');
    setDifficulty('beginner');
    setLossType('normal');
    setComplaint('');
    setDiagnosis('');
    setGrid(buildDefaultGrid());
    setEditingId(null);
  }, []);

  const handleSave = useCallback(() => {
    if (!isFormValid) return;
    const id = editingId ?? `custom-${crypto.randomUUID()}`;
    const profile: HearingProfile = {
      id,
      name: name.trim(),
      description: diagnosis || `Custom patient: ${name.trim()}`,
      thresholds: gridToThresholds(grid),
      difficulty,
      hearingLossType: lossType,
      ...(age !== '' && { age: Number(age) }),
      gender,
      ...(complaint && {
        caseHistory: {
          chiefComplaint: complaint,
          medicalHistory: [],
          noiseExposure: '',
          otoscopicFindings: { rightEar: 'Normal', leftEar: 'Normal' },
        },
      }),
      ...(diagnosis && { expectedDiagnosis: diagnosis }),
    };
    const existing = loadCustomPatients();
    const idx = existing.findIndex((p) => p.id === id);
    if (idx >= 0) existing[idx] = profile;
    else existing.push(profile);
    saveCustomPatients(existing);
    setSavedPatients(existing);
    setSnackMsg(editingId ? 'Patient updated!' : 'Patient saved!');
    resetForm();
  }, [isFormValid, editingId, name, grid, difficulty, lossType, age, gender, complaint, diagnosis, resetForm]);

  const handleEdit = useCallback((p: HearingProfile) => {
    setName(p.name);
    setAge(p.age ?? '');
    setGender(p.gender ?? 'male');
    setDifficulty(p.difficulty);
    setLossType(p.hearingLossType);
    setComplaint(p.caseHistory?.chiefComplaint ?? '');
    setDiagnosis(p.expectedDiagnosis ?? '');
    setGrid(thresholdsToGrid(p.thresholds));
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    const remaining = loadCustomPatients().filter((p) => p.id !== deleteTarget);
    saveCustomPatients(remaining);
    setSavedPatients(remaining);
    setDeleteTarget(null);
    setSnackMsg('Patient deleted.');
    if (editingId === deleteTarget) resetForm();
  }, [deleteTarget, editingId, resetForm]);

  const applyPreset = useCallback((build: () => ThresholdGrid) => {
    setGrid(build());
  }, []);

  // Render a threshold select cell
  const renderCell = (key: string) => {
    const hasError = errorKeys.has(key);
    const [ear, type, freq] = key.split('-');
    const ariaLabel = `${ear === 'right' ? 'Right' : 'Left'} ear ${type} conduction at ${freq} Hz`;
    return (
      <FormControl size="small" fullWidth error={hasError}>
        <Select
          value={grid[key]}
          onChange={(e: SelectChangeEvent<number>) => handleCellChange(key, e.target.value as HearingLevel)}
          aria-label={ariaLabel}
          sx={{
            fontSize: '0.75rem',
            minWidth: 64,
            ...(hasError && { border: `2px solid ${theme.palette.error.main}` }),
          }}
        >
          {HL_VALUES.map((v) => (
            <MenuItem key={v} value={v} sx={{ fontSize: '0.75rem' }}>{v}</MenuItem>
          ))}
        </Select>
        {hasError && (
          <Typography variant="caption" color="error" sx={{ position: 'absolute', bottom: -16, fontSize: '0.6rem', whiteSpace: 'nowrap' }}>
            {validationErrors.find((e) => e.key === key)?.message}
          </Typography>
        )}
      </FormControl>
    );
  };

  // Render the threshold table for one ear
  const renderEarTable = (ear: 'right' | 'left') => {
    const isRight = ear === 'right';
    const color = isRight ? theme.palette.error.main : theme.palette.info.main;
    const label = isRight ? 'Right Ear' : 'Left Ear';
    return (
      <TableContainer component={Paper} sx={{ mb: 2, overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: alpha(color, 0.15), color, fontWeight: 700, minWidth: 100 }}>
                {label}
              </TableCell>
              {AIR_FREQUENCIES.map((f) => (
                <TableCell key={f} align="center" sx={{ bgcolor: alpha(color, 0.08), fontWeight: 600, fontSize: '0.75rem' }}>
                  {f >= 1000 ? `${f / 1000}k` : f}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Air Conduction</TableCell>
              {AIR_FREQUENCIES.map((f) => (
                <TableCell key={f} align="center" sx={{ position: 'relative', pb: 3 }}>
                  {renderCell(gridKey(ear, 'air', f))}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Bone Conduction</TableCell>
              {AIR_FREQUENCIES.map((f) => (
                <TableCell key={f} align="center" sx={{ position: 'relative', pb: 3 }}>
                  {BONE_FREQUENCIES.includes(f)
                    ? renderCell(gridKey(ear, 'bone', f))
                    : <Typography variant="caption" color="text.disabled">--</Typography>}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Audiogram preview
  const renderPreview = () => {
    const height = 180;
    const width = PREVIEW_FREQS.length;
    const hlToY = (hl: HearingLevel) =>
      Math.round(((hl - PREVIEW_MIN) / (PREVIEW_MAX - PREVIEW_MIN)) * (height - 20));
    const symbols: { freq: Frequency; y: number; sym: string; color: string }[] = [];
    for (const f of PREVIEW_FREQS) {
      symbols.push({ freq: f, y: hlToY(grid[gridKey('right', 'air', f)]), sym: 'O', color: theme.palette.error.main });
      symbols.push({ freq: f, y: hlToY(grid[gridKey('left', 'air', f)]), sym: 'X', color: theme.palette.info.main });
    }
    for (const f of BONE_FREQUENCIES) {
      symbols.push({ freq: f, y: hlToY(grid[gridKey('right', 'bone', f)]), sym: '<', color: theme.palette.error.main });
      symbols.push({ freq: f, y: hlToY(grid[gridKey('left', 'bone', f)]), sym: '>', color: theme.palette.info.main });
    }
    const freqIdx = (f: Frequency) => PREVIEW_FREQS.indexOf(f);
    const colWidth = 100 / width;
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Audiogram Preview</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, px: 1 }}>
          {PREVIEW_FREQS.map((f) => (
            <Typography key={f} variant="caption" sx={{ width: `${colWidth}%`, textAlign: 'center', fontSize: '0.6rem' }}>
              {f >= 1000 ? `${f / 1000}k` : f}
            </Typography>
          ))}
        </Box>
        <Box role="img" aria-label="Audiogram preview showing threshold symbols for both ears" sx={{ position: 'relative', height, bgcolor: alpha(theme.palette.divider, 0.1), borderRadius: 1, overflow: 'hidden' }}>
          {/* Horizontal grid lines */}
          {[0, 20, 40, 60, 80, 100, 120].map((hl) => (
            <Box
              key={hl}
              sx={{
                position: 'absolute',
                top: hlToY(hl as HearingLevel),
                left: 0,
                right: 0,
                borderBottom: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
              }}
            >
              <Typography variant="caption" sx={{ position: 'absolute', left: -2, top: -8, fontSize: '0.5rem', color: 'text.secondary' }}>
                {hl}
              </Typography>
            </Box>
          ))}
          {/* Symbols */}
          {symbols.map((s, i) => (
            <Typography
              key={i}
              sx={{
                position: 'absolute',
                top: s.y - 8,
                left: `${freqIdx(s.freq) * colWidth + colWidth / 2}%`,
                transform: 'translateX(-50%)',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.sym}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Typography variant="caption"><Box component="span" sx={{ color: 'error.main', fontWeight: 700 }}>O</Box> R Air</Typography>
          <Typography variant="caption"><Box component="span" sx={{ color: 'info.main', fontWeight: 700 }}>X</Box> L Air</Typography>
          <Typography variant="caption"><Box component="span" sx={{ color: 'error.main', fontWeight: 700 }}>&lt;</Box> R Bone</Typography>
          <Typography variant="caption"><Box component="span" sx={{ color: 'info.main', fontWeight: 700 }}>&gt;</Box> L Bone</Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonAdd fontSize="large" /> Custom Patient Builder
      </Typography>

      {/* Metadata form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Patient Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              error={name.length > 0 && name.trim().length === 0}
              helperText={name.length > 0 && name.trim().length === 0 ? 'Name is required' : ''}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') setAge('');
                else { const n = parseInt(v, 10); if (n >= 1 && n <= 120) setAge(n); }
              }}
              fullWidth
              slotProps={{ htmlInput: { min: 1, max: 120 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select value={gender} label="Gender" onChange={(e: SelectChangeEvent) => setGender(e.target.value as 'male' | 'female')}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select value={difficulty} label="Difficulty" onChange={(e: SelectChangeEvent) => setDifficulty(e.target.value as HearingProfile['difficulty'])}>
                {DIFFICULTIES.map((d) => (
                  <MenuItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Hearing Loss Type</InputLabel>
              <Select value={lossType} label="Hearing Loss Type" onChange={(e: SelectChangeEvent) => setLossType(e.target.value as HearingProfile['hearingLossType'])}>
                {LOSS_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Expected Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Chief Complaint" value={complaint} onChange={(e) => setComplaint(e.target.value)} fullWidth multiline rows={2} />
          </Grid>
        </Grid>
      </Paper>

      {/* Quick presets */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Quick Presets</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {PRESETS.map((p) => (
            <Button key={p.label} variant="outlined" size="small" onClick={() => applyPreset(p.build)}>
              {p.label}
            </Button>
          ))}
        </Stack>
      </Paper>

      {/* Threshold grids and preview side by side on desktop */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 3 }}>
        <Box sx={{ flex: 2, minWidth: 0 }}>
          {renderEarTable('right')}
          {renderEarTable('left')}
        </Box>
        <Box sx={{ flex: 1, minWidth: 240 }}>
          {renderPreview()}
        </Box>
      </Box>

      {/* Validation summary */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Validation Errors:</Typography>
          {validationErrors.map((e, i) => (
            <Typography key={i} variant="body2">{e.message}</Typography>
          ))}
        </Alert>
      )}
      {validationErrors.length === 0 && name.trim().length > 0 && (
        <Alert severity="success" sx={{ mb: 2 }}>All thresholds are valid. Ready to save.</Alert>
      )}

      {/* Action buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          disabled={!isFormValid}
          onClick={handleSave}
        >
          {editingId ? 'Update Patient' : 'Save Patient'}
        </Button>
        <Button variant="outlined" startIcon={<Refresh />} onClick={resetForm}>
          Reset Form
        </Button>
      </Stack>

      {/* Saved patients list */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Saved Custom Patients
          <Chip label={savedPatients.length} size="small" color="primary" />
        </Typography>
        {savedPatients.length === 0 ? (
          <Typography color="text.secondary">No custom patients saved yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {savedPatients.map((p) => (
              <Paper
                key={p.id}
                variant="outlined"
                sx={{ p: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography variant="subtitle1" fontWeight={600}>{p.name}</Typography>
                    <Chip label="Custom" size="small" color="secondary" />
                    <Chip label={p.difficulty} size="small" variant="outlined" />
                    <Chip label={p.hearingLossType.replace('-', ' ')} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {p.age ? `Age ${p.age}` : ''}{p.age && p.gender ? ' | ' : ''}{p.gender ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1) : ''}
                    {p.expectedDiagnosis ? ` | ${p.expectedDiagnosis}` : ''}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(p)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => setDeleteTarget(p.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Custom Patient?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{savedPatients.find((p) => p.id === deleteTarget)?.name}&quot;? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackMsg !== ''}
        autoHideDuration={3000}
        onClose={() => setSnackMsg('')}
        message={snackMsg}
      />
    </Container>
  );
};

export default CustomPatientPage;
