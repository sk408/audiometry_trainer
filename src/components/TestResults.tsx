import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  AlertTitle,
  Stack,
  Tab,
  Tabs
} from '@mui/material';
import {
  PictureAsPdf,
  Share,
  CheckCircle,
  Error,
  Warning,
  InfoOutlined
} from '@mui/icons-material';
import { TestSession, TestResult } from '../interfaces/AudioTypes';
import Audiogram from './Audiogram';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import patientService from '../services/PatientService';

interface TestResultsProps {
  session: TestSession;
  onNewTest: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`results-tabpanel-${index}`}
      aria-labelledby={`results-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const TestResults: React.FC<TestResultsProps> = ({ session, onNewTest }) => {
  const [tabValue, setTabValue] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Get results from session
  const results = session.results as TestResult;
  
  // Get patient details
  const patient = patientService.getPatientById(session.patientId);
  
  // Calculate the accuracy metrics if actual thresholds are available
  const calculateAccuracyMetrics = () => {
    if (!patient) return { accuracy: 0, exactMatch: 0, within5dB: 0, within10dB: 0, missedThresholds: 0 };
    
    const userThresholds = results.userThresholds;
    const actualThresholds = patient.thresholds;
    
    let exactMatchCount = 0;
    let within5dBCount = 0;
    let within10dBCount = 0;
    let comparedCount = 0;
    
    // Compare each user threshold to the corresponding actual threshold
    userThresholds.forEach(userT => {
      // Find matching actual threshold
      const matchingActual = actualThresholds.find(
        actT => 
          actT.frequency === userT.frequency && 
          actT.ear === userT.ear && 
          actT.testType === userT.testType
      );
      
      if (matchingActual && userT.responseStatus === 'threshold' && matchingActual.responseStatus === 'threshold') {
        const difference = Math.abs(userT.hearingLevel - matchingActual.hearingLevel);
        comparedCount++;
        
        if (difference === 0) {
          exactMatchCount++;
          within5dBCount++;
          within10dBCount++;
        } else if (difference <= 5) {
          within5dBCount++;
          within10dBCount++;
        } else if (difference <= 10) {
          within10dBCount++;
        }
      }
    });
    
    const totalActualThresholds = actualThresholds.filter(t => t.responseStatus === 'threshold').length;
    const totalTestedThresholds = userThresholds.filter(t => t.responseStatus === 'threshold').length;
    
    return {
      accuracy: comparedCount > 0 ? Math.round((within5dBCount / comparedCount) * 100) : 0,
      exactMatch: comparedCount > 0 ? Math.round((exactMatchCount / comparedCount) * 100) : 0,
      within5dB: comparedCount > 0 ? Math.round((within5dBCount / comparedCount) * 100) : 0,
      within10dB: comparedCount > 0 ? Math.round((within10dBCount / comparedCount) * 100) : 0,
      missedThresholds: totalActualThresholds - totalTestedThresholds
    };
  };
  
  const metrics = calculateAccuracyMetrics();
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Export report to PDF
  const exportToPDF = async () => {
    setExportLoading(true);
    
    try {
      const resultsElement = document.getElementById('test-results-container');
      if (!resultsElement) {
        console.error('Results element not found');
        setExportLoading(false);
        return;
      }
      
      const canvas = await html2canvas(resultsElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 10, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`audiometry_results_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
    
    setExportLoading(false);
  };
  
  // Get severity rating based on accuracy
  const getSeverityRating = (accuracy: number) => {
    if (accuracy >= 90) return { color: 'success', label: 'Excellent', icon: <CheckCircle /> };
    if (accuracy >= 75) return { color: 'info', label: 'Good', icon: <InfoOutlined /> };
    if (accuracy >= 60) return { color: 'warning', label: 'Fair', icon: <Warning /> };
    return { color: 'error', label: 'Needs Improvement', icon: <Error /> };
  };
  
  const severityRating = getSeverityRating(metrics.accuracy);
  
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, maxWidth: 1200, mx: 'auto' }} id="test-results-container">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Test Results
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {patient?.name} | {new Date(results.timestamp).toLocaleString()}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="results tabs">
              <Tab label="Overview" id="results-tab-0" aria-controls="results-tabpanel-0" />
              <Tab label="Audiogram" id="results-tab-1" aria-controls="results-tabpanel-1" />
              <Tab label="Technique Analysis" id="results-tab-2" aria-controls="results-tabpanel-2" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" gutterBottom>
                    Test Summary
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Patient ID:</strong> {session.patientId}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Test Duration:</strong> {results.testDuration} seconds
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Tested Frequencies:</strong> {results.userThresholds.filter(t => t.responseStatus === 'threshold').length}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Hearing Loss Type:</strong> {patient?.hearingLossType.replace('_', ' ')}
                  </Typography>
                </Paper>
                
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      Accuracy Rating
                    </Typography>
                    <Chip 
                      label={severityRating.label} 
                      color={severityRating.color as any} 
                      icon={severityRating.icon}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell><strong>Overall Accuracy</strong></TableCell>
                          <TableCell align="right">{metrics.accuracy}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Exact Matches</TableCell>
                          <TableCell align="right">{metrics.exactMatch}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Within 5 dB</TableCell>
                          <TableCell align="right">{metrics.within5dB}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Within 10 dB</TableCell>
                          <TableCell align="right">{metrics.within10dB}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Missed Thresholds</TableCell>
                          <TableCell align="right">{metrics.missedThresholds}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                {results.technicalErrors.length > 0 && (
                  <Alert 
                    severity="warning" 
                    sx={{ mb: 3 }}
                  >
                    <AlertTitle>Technical Errors Detected</AlertTitle>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {results.technicalErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </Alert>
                )}
                
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Educational Notes
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {patient?.hearingLossType === 'normal' && 
                      'This patient has normal hearing across all frequencies tested. Key indicators include thresholds better than 25dB HL across the spectrum.'
                    }
                    {patient?.hearingLossType === 'conductive' && 
                      'This patient shows a conductive hearing loss pattern, characterized by air-bone gaps. This indicates a problem in the outer or middle ear affecting sound transmission.'
                    }
                    {patient?.hearingLossType === 'sensorineural' && 
                      'This patient has a sensorineural hearing loss pattern. Air and bone conduction thresholds are similar, indicating the loss is in the cochlea or neural pathway.'
                    }
                    {patient?.hearingLossType === 'mixed' && 
                      'This patient shows a mixed hearing loss with both conductive and sensorineural components. Note the elevated bone conduction thresholds and additional air-bone gaps.'
                    }
                    {patient?.hearingLossType === 'asymmetrical' && 
                      'This patient has asymmetrical hearing loss with different thresholds between the left and right ears. This pattern requires additional diagnostic testing and may indicate unilateral pathology.'
                    }
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Hughson-Westlake Protocol Reminder:
                  </Typography>
                  <ul>
                    <li>Begin testing at 1000 Hz in the better ear</li>
                    <li>Present tones for 1-2 seconds with varied intervals</li>
                    <li>Use 10 dB steps down after response until no response</li>
                    <li>Use 5 dB steps up until response</li>
                    <li>Threshold is the lowest level with 2 out of 3 responses</li>
                    <li>Proceed with 2000, 4000, 8000, then 500, 250 Hz</li>
                    <li>Retest 1000 Hz to verify reliability</li>
                  </ul>
                </Paper>
              </Box>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Audiogram 
                thresholds={results.userThresholds} 
                compareThresholds={patient?.thresholds} 
                height={500}
                width={800}
                title="Test Results vs. Actual Thresholds"
              />
              
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Solid lines: Your test results | Dashed lines: Actual patient thresholds
              </Typography>
              
              <Alert severity="info" sx={{ mt: 3, width: '100%' }}>
                <AlertTitle>Audiogram Interpretation Guide</AlertTitle>
                <Typography variant="body2">
                  <strong>Normal hearing:</strong> Thresholds better than 25 dB HL<br />
                  <strong>Mild hearing loss:</strong> 26-40 dB HL<br />
                  <strong>Moderate hearing loss:</strong> 41-55 dB HL<br />
                  <strong>Moderately severe hearing loss:</strong> 56-70 dB HL<br />
                  <strong>Severe hearing loss:</strong> 71-90 dB HL<br />
                  <strong>Profound hearing loss:</strong> Greater than 90 dB HL
                </Typography>
              </Alert>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <TableContainer component={Paper} elevation={2}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Frequency (Hz)</TableCell>
                    <TableCell>Ear</TableCell>
                    <TableCell>Test Type</TableCell>
                    <TableCell>Your Result (dB HL)</TableCell>
                    <TableCell>Actual Threshold (dB HL)</TableCell>
                    <TableCell>Difference</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.userThresholds.map((threshold, index) => {
                    const actualThreshold = patient?.thresholds.find(
                      t => 
                        t.frequency === threshold.frequency && 
                        t.ear === threshold.ear && 
                        t.testType === threshold.testType
                    );
                    
                    let difference = 0;
                    let status = 'Untested';
                    
                    if (actualThreshold && threshold.responseStatus === 'threshold' && actualThreshold.responseStatus === 'threshold') {
                      difference = Math.abs(threshold.hearingLevel - actualThreshold.hearingLevel);
                      
                      if (difference === 0) status = 'Exact Match';
                      else if (difference <= 5) status = 'Within 5 dB';
                      else if (difference <= 10) status = 'Within 10 dB';
                      else status = 'Significant Deviation';
                    } else if (threshold.responseStatus === 'threshold') {
                      status = 'Tested';
                    }
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>{threshold.frequency}</TableCell>
                        <TableCell>{threshold.ear === 'left' ? 'Left' : 'Right'}</TableCell>
                        <TableCell>{threshold.testType.replace('_', ' ')}</TableCell>
                        <TableCell>{threshold.hearingLevel}</TableCell>
                        <TableCell>{actualThreshold?.hearingLevel || 'N/A'}</TableCell>
                        <TableCell>{threshold.responseStatus === 'threshold' ? `${difference} dB` : 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={status} 
                            size="small"
                            color={
                              status === 'Exact Match' ? 'success' :
                              status === 'Within 5 dB' ? 'primary' :
                              status === 'Within 10 dB' ? 'info' :
                              status === 'Significant Deviation' ? 'error' :
                              'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            {results.technicalErrors.length > 0 && (
              <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Technical Errors Analysis
                </Typography>
                <ul>
                  {results.technicalErrors.map((error, index) => (
                    <li key={index}>
                      <Typography variant="body2">{error}</Typography>
                    </li>
                  ))}
                </ul>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <AlertTitle>Improvement Suggestions</AlertTitle>
                  <Typography variant="body2">
                    {results.technicalErrors.some(e => e.includes('Skipped')) && 
                      '• Ensure all frequencies are tested for complete assessment\n'
                    }
                    {results.technicalErrors.some(e => e.includes('Insufficient')) && 
                      '• Collect at least 3 responses at threshold level\n'
                    }
                    {results.technicalErrors.some(e => e.includes('too high')) && 
                      '• Start at more appropriate levels (typically 30-40 dB HL)\n'
                    }
                    Practice proper step sizes: 10 dB down after response, 5 dB up until response
                  </Typography>
                </Alert>
              </Paper>
            )}
          </TabPanel>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={onNewTest}
            >
              Start New Test
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<Share />}
              disabled
            >
              Share Results
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<PictureAsPdf />}
              onClick={exportToPDF}
              disabled={exportLoading}
            >
              {exportLoading ? 'Exporting...' : 'Export PDF'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TestResults; 