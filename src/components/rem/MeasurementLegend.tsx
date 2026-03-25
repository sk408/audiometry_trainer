/**
 * MeasurementLegend — shows coloured dots for completed REM measurement types.
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { REMCurve } from '../../interfaces/RealEarMeasurementTypes';
import { MEASUREMENT_COLORS } from '../../data/remData';

interface MeasurementLegendProps {
  measurements: REMCurve[];
}

const MeasurementLegend: React.FC<MeasurementLegendProps> = ({ measurements }) => (
  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
    <Typography variant="subtitle1" gutterBottom>
      Completed Measurements:
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {measurements.map((measurement) => (
        <Box
          key={measurement.type}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.paper',
            p: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              bgcolor: MEASUREMENT_COLORS[measurement.type] || '#795548',
              mr: 1,
              borderRadius: '50%',
            }}
          />
          <Typography variant="body2">{measurement.type}</Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

export default MeasurementLegend;
