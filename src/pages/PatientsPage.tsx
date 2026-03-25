import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Pagination,
  useMediaQuery
} from '@mui/material';
import { Search, FilterList, HearingOutlined, PersonAdd } from '@mui/icons-material';
import { HearingProfile, TestSession } from '../interfaces/AudioTypes';
import patientService from '../services/PatientService';
import PatientCard from '../components/PatientCard';
import TestingInterface from '../components/TestingInterface';
import TestResults from '../components/TestResults';
import { useTheme, alpha } from '@mui/material/styles';
import { useProgress } from '../hooks/useProgress';

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<HearingProfile[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<HearingProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<HearingProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [hearingLossTypeFilter, setHearingLossTypeFilter] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestSession | null>(null);
  const [page, setPage] = useState(1);
  const [patientsPerPage] = useState(6);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { patientProgressMap, getCompletionStatusForPatient, refresh: refreshProgress } = useProgress();

  // Load patients on component mount
  useEffect(() => {
    const allPatients = patientService.getAllPatients();
    setPatients(allPatients);
    setFilteredPatients(allPatients);
  }, []);

  // Apply filters, search, and sort
  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(
        patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(patient => patient.difficulty === difficultyFilter);
    }

    if (hearingLossTypeFilter !== 'all') {
      filtered = filtered.filter(patient => patient.hearingLossType === hearingLossTypeFilter);
    }

    if (completionFilter !== 'all') {
      filtered = filtered.filter(patient => getCompletionStatusForPatient(patient.id) === completionFilter);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'difficulty': {
          const order: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };
          return (order[a.difficulty] ?? 0) - (order[b.difficulty] ?? 0);
        }
        case 'accuracy': {
          const aProgress = patientProgressMap.get(a.id);
          const bProgress = patientProgressMap.get(b.id);
          return (bProgress?.bestAccuracy ?? -1) - (aProgress?.bestAccuracy ?? -1);
        }
        case 'recent': {
          const aProgress = patientProgressMap.get(a.id);
          const bProgress = patientProgressMap.get(b.id);
          const aDate = aProgress?.lastTestedDate ?? '';
          const bDate = bProgress?.lastTestedDate ?? '';
          return bDate.localeCompare(aDate);
        }
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredPatients(filtered);
    setPage(1);
  }, [searchTerm, difficultyFilter, hearingLossTypeFilter, completionFilter, sortBy, patients, patientProgressMap, getCompletionStatusForPatient]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
  };

  const handleHearingLossTypeChange = (event: SelectChangeEvent) => {
    setHearingLossTypeFilter(event.target.value);
  };

  const handlePatientSelect = (patient: HearingProfile) => {
    setSelectedPatient(patient);
  };

  const handleStartTesting = () => {
    setIsTesting(true);
    setTestResults(null);
  };

  const handleCancelTesting = () => {
    setIsTesting(false);
    setTestResults(null);
  };

  const handleTestComplete = (results: TestSession) => {
    setIsTesting(false);
    setTestResults(results);
    refreshProgress();
  };

  const handleNewTest = () => {
    setTestResults(null);
    setSelectedPatient(null);
  };

  const handleTryAgain = () => {
    setTestResults(null);
    setIsTesting(true);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const indexOfLastPatient = page * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDifficultyFilter('all');
    setHearingLossTypeFilter('all');
    setCompletionFilter('all');
    setSortBy('name');
    setIsFiltersOpen(false);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (difficultyFilter !== 'all') count++;
    if (hearingLossTypeFilter !== 'all') count++;
    if (completionFilter !== 'all') count++;
    if (sortBy !== 'name') count++;
    return count;
  }, [difficultyFilter, hearingLossTypeFilter, completionFilter, sortBy]);

  if (testResults) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <TestResults session={testResults} onNewTest={handleNewTest} onTryAgain={handleTryAgain} />
      </Container>
    );
  }

  if (isTesting && selectedPatient) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <TestingInterface
          patient={selectedPatient}
          onComplete={handleTestComplete}
          onCancel={handleCancelTesting}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        Virtual Patients
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Select a virtual patient to practice your audiometry skills. Each patient has a unique
        hearing profile that simulates different types of hearing loss.
      </Typography>

      <Box sx={{ mb: { xs: 2, md: 4 } }}>
        <Grid container spacing={{ xs: 1, md: 2 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{ mb: { xs: 1, md: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              display: 'flex',
              gap: { xs: 1, md: 2 },
              justifyContent: { xs: 'space-between', md: 'flex-end' },
              flexWrap: 'wrap'
            }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setIsFiltersOpen(true)}
                size="small"
                sx={{ flex: { xs: 1, sm: 'initial' } }}
              >
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Button>
              {selectedPatient ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<HearingOutlined />}
                  onClick={handleStartTesting}
                  size="small"
                  sx={{ flex: { xs: 1, sm: 'initial' } }}
                >
                  Start Testing
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<PersonAdd />}
                  disabled
                  size="small"
                  sx={{ flex: { xs: 1, sm: 'initial' } }}
                >
                  Add Patient
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Active filters display */}
      {(difficultyFilter !== 'all' || hearingLossTypeFilter !== 'all' || completionFilter !== 'all' || sortBy !== 'name') && (
        <Box sx={{ mb: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            <Typography variant="body2">Active Filters:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {difficultyFilter !== 'all' && (
                <Chip
                  label={`Difficulty: ${difficultyFilter}`}
                  onDelete={() => setDifficultyFilter('all')}
                  size="small"
                  color="primary"
                />
              )}
              {hearingLossTypeFilter !== 'all' && (
                <Chip
                  label={`Type: ${hearingLossTypeFilter.replace(/[-_]/g, ' ')}`}
                  onDelete={() => setHearingLossTypeFilter('all')}
                  size="small"
                  color="secondary"
                />
              )}
              {completionFilter !== 'all' && (
                <Chip
                  label={`Status: ${completionFilter.replace(/_/g, ' ')}`}
                  onDelete={() => setCompletionFilter('all')}
                  size="small"
                  color="info"
                />
              )}
              {sortBy !== 'name' && (
                <Chip
                  label={`Sort: ${sortBy}`}
                  onDelete={() => setSortBy('name')}
                  size="small"
                />
              )}
              <Button size="small" onClick={handleResetFilters}>
                Clear All
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Filter dialog */}
      <Dialog
        open={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Filter & Sort Patients</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              value={difficultyFilter}
              onChange={handleDifficultyChange}
              label="Difficulty Level"
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Hearing Loss Type</InputLabel>
            <Select
              value={hearingLossTypeFilter}
              onChange={handleHearingLossTypeChange}
              label="Hearing Loss Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="normal">Normal Hearing</MenuItem>
              <MenuItem value="conductive">Conductive</MenuItem>
              <MenuItem value="sensorineural">Sensorineural</MenuItem>
              <MenuItem value="mixed">Mixed</MenuItem>
              <MenuItem value="asymmetrical">Asymmetrical</MenuItem>
              <MenuItem value="noise-induced">Noise-Induced</MenuItem>
              <MenuItem value="presbycusis">Presbycusis</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Completion Status</InputLabel>
            <Select
              value={completionFilter}
              onChange={(e: SelectChangeEvent) => setCompletionFilter(e.target.value)}
              label="Completion Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="not_started">Not Started</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e: SelectChangeEvent) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="difficulty">Difficulty</MenuItem>
              <MenuItem value="accuracy">Best Accuracy</MenuItem>
              <MenuItem value="recent">Recently Tested</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters}>
            Reset
          </Button>
          <Button onClick={() => setIsFiltersOpen(false)} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Divider sx={{ mb: { xs: 2, md: 4 } }} />

      {/* Patient cards */}
      {filteredPatients.length > 0 ? (
        <>
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {currentPatients.map((patient) => (
              <Grid item xs={12} sm={6} md={4} key={patient.id}>
                <PatientCard
                  patient={patient}
                  onSelect={handlePatientSelect}
                  selected={selectedPatient?.id === patient.id}
                  progress={patientProgressMap.get(patient.id)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, md: 4 } }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              size="small"
            />
          </Box>
        </>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            textAlign: 'center',
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.6)
              : '#f5f5f5',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            No matching patients found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters to find a patient.
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleResetFilters}
          >
            Clear All Filters
          </Button>
        </Paper>
      )}

      {/* Selected patient summary */}
      {selectedPatient && (
        <Paper
          elevation={3}
          sx={{
            mt: { xs: 2, md: 4 },
            p: { xs: 2, md: 3 },
            bgcolor: theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : '#f9f9f9',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h5" gutterBottom>
            Selected Patient: {selectedPatient.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedPatient.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`Difficulty: ${selectedPatient.difficulty}`}
              color={
                selectedPatient.difficulty === 'beginner' ? 'success' :
                selectedPatient.difficulty === 'intermediate' ? 'warning' : 'error'
              }
            />
            <Chip
              label={`Type: ${selectedPatient.hearingLossType.replace(/[-_]/g, ' ')}`}
              color="secondary"
            />
            {patientProgressMap.get(selectedPatient.id) && (
              <Chip
                label={`Best: ${patientProgressMap.get(selectedPatient.id)!.bestAccuracy}%`}
                color="info"
                variant="outlined"
              />
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HearingOutlined />}
            onClick={handleStartTesting}
            size="large"
            fullWidth
            sx={{ display: { xs: 'flex', md: 'inline-flex' }, width: { xs: '100%', md: 'auto' } }}
          >
            Begin Audiometry Test
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default PatientsPage;
