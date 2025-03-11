import React from 'react';
import {
  Box, 
  Typography, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Alert,
  Chip,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { 
  CheckCircleOutline, 
  ErrorOutline, 
  InfoOutlined, 
  ArrowRight,
  Settings,
  VolumeUp
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ContourTestResults as ContourResults, ContourTestAnalysis } from '../types/ContourTest';
import { ContourTestService } from '../services/ContourTestService';

interface ContourTestResultsProps {
  results: ContourResults;
  analysis: ContourTestAnalysis;
}

const ContourTestResults: React.FC<ContourTestResultsProps> = ({ results, analysis }) => {
  // Prepare chart data
  const chartData = results.ratings.map(rating => ({
    intensity: rating.intensity,
    loudness: rating.rating,
    category: ContourTestService.LOUDNESS_CATEGORIES[rating.rating]
  }));
  
  // Get recommendations for hearing aid settings
  const hearingAidRecommendations = ContourTestService.getHearingAidRecommendations(results);
  
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Contour Test Results - {results.frequency} Hz
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ height: 300, mb: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="intensity" 
                    label={{ value: 'Intensity (dB HL)', position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis 
                    domain={[0, 7]}
                    ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                    label={{ value: 'Loudness Rating', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'loudness') {
                        return [`${value} - ${ContourTestService.LOUDNESS_CATEGORIES[value as number]}`, 'Loudness'];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="loudness" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Key Measurements:
              </Typography>
              <List dense>
                {results.mcl !== undefined && (
                  <ListItem>
                    <ListItemIcon>
                      <VolumeUp color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Most Comfortable Level (MCL)" 
                      secondary={`${results.mcl} dB HL`} 
                    />
                  </ListItem>
                )}
                {results.ucl !== undefined && (
                  <ListItem>
                    <ListItemIcon>
                      <VolumeUp color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Uncomfortable Level (UCL)" 
                      secondary={`${results.ucl} dB HL`} 
                    />
                  </ListItem>
                )}
                {results.mcl !== undefined && results.ucl !== undefined && (
                  <ListItem>
                    <ListItemIcon>
                      <InfoOutlined color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Dynamic Range" 
                      secondary={`${results.ucl - results.mcl} dB`} 
                    />
                  </ListItem>
                )}
              </List>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Analysis:
              </Typography>
              
              {analysis.isNormal ? (
                <Alert severity="success" icon={<CheckCircleOutline />}>
                  Normal loudness growth pattern detected
                </Alert>
              ) : (
                <Alert severity="warning" icon={<ErrorOutline />}>
                  {analysis.abnormalitiesDescription}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {analysis.recruitment && <Chip label="Recruitment" color="warning" />}
                {analysis.hyperacusis && <Chip label="Hyperacusis" color="error" />}
                {!analysis.normalGrowth && <Chip label="Abnormal Growth" color="warning" />}
                {analysis.isNormal && <Chip label="Normal Growth" color="success" />}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Clinical Recommendations" 
              titleTypographyProps={{ variant: 'h6' }}
              avatar={<InfoOutlined color="primary" />}
            />
            <CardContent>
              {analysis.recommendations && analysis.recommendations.length > 0 ? (
                <List dense>
                  {analysis.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <ArrowRight color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">
                  No specific clinical recommendations generated from this test.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Hearing Aid Settings Guidance" 
              titleTypographyProps={{ variant: 'h6' }}
              avatar={<Settings color="primary" />}
            />
            <CardContent>
              {hearingAidRecommendations.length > 0 ? (
                <List dense>
                  {hearingAidRecommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <ArrowRight color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">
                  Insufficient data to provide hearing aid setting recommendations.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {results.notes && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Notes:
          </Typography>
          <Typography variant="body1">
            {results.notes}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ContourTestResults; 