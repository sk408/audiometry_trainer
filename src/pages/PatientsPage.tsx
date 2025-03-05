import React, { useState, useEffect } from 'react';
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
  Pagination
} from '@mui/material';
import { Search, FilterList, HearingOutlined, PersonAdd } from '@mui/icons-material';
import { HearingProfile } from '../interfaces/AudioTypes';
import patientService from '../services/PatientService';
import PatientCard from '../components/PatientCard';
import TestingInterface from '../components/TestingInterface';
import TestResults from '../components/TestResults';

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<HearingProfile[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<HearingProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<HearingProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [hearingLossTypeFilter, setHearingLossTypeFilter] = useState<string>('all');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [patientsPerPage] = useState(6);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Load patients on component mount
  useEffect(() => {
    const allPatients = patientService.getAllPatients();
    setPatients(allPatients);
    setFilteredPatients(allPatients);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = patients;
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        patient => 
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(patient => patient.difficulty === difficultyFilter);
    }
    
    // Apply hearing loss type filter
    if (hearingLossTypeFilter !== 'all') {
      filtered = filtered.filter(patient => patient.hearingLossType === hearingLossTypeFilter);
    }
    
    setFilteredPatients(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, difficultyFilter, hearingLossTypeFilter, patients]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
  };

  // Handle hearing loss type filter change
  const handleHearingLossTypeChange = (event: SelectChangeEvent) => {
    setHearingLossTypeFilter(event.target.value);
  };

  // Handle patient selection
  const handlePatientSelect = (patient: HearingProfile) => {
    setSelectedPatient(patient);
  };

  // Handle start testing
  const handleStartTesting = () => {
    setIsTesting(true);
    setTestResults(null);
  };

  // Handle cancel testing
  const handleCancelTesting = () => {
    setIsTesting(false);
    setTestResults(null);
  };

  // Handle test completion
  const handleTestComplete = (results: any) => {
    setIsTesting(false);
    setTestResults(results);
  };

  // Handle new test after viewing results
  const handleNewTest = () => {
    setTestResults(null);
    setSelectedPatient(null);
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Get current patients for pagination
  const indexOfLastPatient = page * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setDifficultyFilter('all');
    setHearingLossTypeFilter('all');
    setIsFiltersOpen(false);
  };

  // Render test results if available
  if (testResults) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <TestResults session={testResults} onNewTest={handleNewTest} />
      </Container>
    );
  }

  // Render testing interface if in testing mode
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
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
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
                Filters
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
      {(difficultyFilter !== 'all' || hearingLossTypeFilter !== 'all') && (
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
                  label={`Type: ${hearingLossTypeFilter.replace('_', ' ')}`}
                  onDelete={() => setHearingLossTypeFilter('all')}
                  size="small"
                  color="secondary"
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
        <DialogTitle>Filter Patients</DialogTitle>
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
            bgcolor: '#f5f5f5',
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
            bgcolor: '#f9f9f9',
            borderRadius: 2,
            border: '1px solid #e0e0e0'
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
              label={`Type: ${selectedPatient.hearingLossType.replace('_', ' ')}`} 
              color="secondary"
            />
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