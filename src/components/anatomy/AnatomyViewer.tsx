import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { ThreeDRotation } from '@mui/icons-material';
import EarModel3D from '../EarModel3D';
import ErrorBoundary from '../shared/ErrorBoundary';

interface AnatomyViewerProps {
  height?: number;
}

const AnatomyViewer: React.FC<AnatomyViewerProps> = ({ height = 450 }) => {
  return (
    <Box mb={4}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <ThreeDRotation color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Interactive 3D Ear Model
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Explore this interactive 3D model of the human ear. Click and drag to rotate, scroll to zoom.
          </Typography>
          <ErrorBoundary>
            <EarModel3D height={height} />
          </ErrorBoundary>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnatomyViewer;
