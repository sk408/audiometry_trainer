import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  IconButton,
  Grid,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { ContourTestLoudnessRating, ContourTestResults } from '../types/ContourTest';
import { ContourTestService } from '../services/ContourTestService';

interface ContourTestFormProps {
  onSaveResults: (results: ContourTestResults) => void;
  initialResults?: ContourTestResults;
}

const ContourTestForm: React.FC<ContourTestFormProps> = ({ onSaveResults, initialResults }) => {
  const defaultResults: ContourTestResults = {
    testDate: new Date(),
    frequency: 1000,
    ratings: [],
    notes: '',
  };

  const [testResults, setTestResults] = useState<ContourTestResults>(initialResults || defaultResults);
  const [newIntensity, setNewIntensity] = useState<number>(50);
  const [newRating, setNewRating] = useState<number>(4);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update MCL and UCL when ratings change
  useEffect(() => {
    if (testResults.ratings.length > 0) {
      const mcl = ContourTestService.findMCL(testResults.ratings);
      const ucl = ContourTestService.findUCL(testResults.ratings);
      
      setTestResults(prev => ({
        ...prev,
        mcl,
        ucl
      }));
    }
  }, [testResults.ratings]);

  const handleFrequencyChange = (event: SelectChangeEvent<number>) => {
    setTestResults({
      ...testResults,
      frequency: event.target.value as number
    });
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTestResults({
      ...testResults,
      notes: event.target.value
    });
  };

  const handleAddRating = () => {
    // Check if this intensity already has a rating
    const existingRating = testResults.ratings.find(r => r.intensity === newIntensity);
    
    if (existingRating) {
      setErrorMessage(`Intensity ${newIntensity} dB HL already has a rating. Please use a different intensity or remove the existing rating first.`);
      return;
    }
    
    setErrorMessage(null);
    
    const updatedRatings = [
      ...testResults.ratings,
      { intensity: newIntensity, rating: newRating }
    ].sort((a, b) => a.intensity - b.intensity);
    
    setTestResults({
      ...testResults,
      ratings: updatedRatings
    });
    
    // Reset for next entry
    setNewIntensity(prev => prev + 5); // Increment for convenience
  };

  const handleDeleteRating = (intensity: number) => {
    setTestResults({
      ...testResults,
      ratings: testResults.ratings.filter(r => r.intensity !== intensity)
    });
  };

  const handleSaveResults = () => {
    if (testResults.ratings.length < 3) {
      setErrorMessage('Please add at least 3 loudness ratings for a valid contour test.');
      return;
    }
    
    setErrorMessage(null);
    onSaveResults(testResults);
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Contour Test Data Entry
      </Typography>
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="frequency-select-label">Test Frequency</InputLabel>
            <Select
              labelId="frequency-select-label"
              id="frequency-select"
              value={testResults.frequency}
              label="Test Frequency"
              onChange={handleFrequencyChange}
            >
              <MenuItem value={500}>500 Hz</MenuItem>
              <MenuItem value={1000}>1000 Hz</MenuItem>
              <MenuItem value={2000}>2000 Hz</MenuItem>
              <MenuItem value={4000}>4000 Hz</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Add Loudness Ratings
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: '30%', mr: 2 }}>
              <Typography id="intensity-slider-label" gutterBottom>
                Intensity (dB HL): {newIntensity}
              </Typography>
              <Slider
                value={newIntensity}
                onChange={(_, value) => setNewIntensity(value as number)}
                aria-labelledby="intensity-slider-label"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={120}
              />
            </Box>
            
            <Box sx={{ width: '40%', mx: 2 }}>
              <Typography id="rating-slider-label" gutterBottom>
                Loudness Rating: {ContourTestService.LOUDNESS_CATEGORIES[newRating]}
              </Typography>
              <Slider
                value={newRating}
                onChange={(_, value) => setNewRating(value as number)}
                aria-labelledby="rating-slider-label"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={7}
              />
            </Box>
            
            <Box sx={{ ml: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddRating}
              >
                Add Rating
              </Button>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Intensity (dB HL)</TableCell>
                  <TableCell>Loudness Rating</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testResults.ratings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No ratings added yet. Add ratings using the controls above.
                    </TableCell>
                  </TableRow>
                ) : (
                  testResults.ratings.map((rating) => (
                    <TableRow key={rating.intensity}>
                      <TableCell>{rating.intensity}</TableCell>
                      <TableCell>{rating.rating}</TableCell>
                      <TableCell>{ContourTestService.LOUDNESS_CATEGORIES[rating.rating]}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteRating(rating.intensity)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={4}
            value={testResults.notes}
            onChange={handleNotesChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveResults}
              disabled={testResults.ratings.length < 3}
            >
              Save Results
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ContourTestForm; 