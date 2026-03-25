import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { REMCurve, REMTarget, REMFrequency } from '../interfaces/RealEarMeasurementTypes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface REMChartProps {
  measurements?: REMCurve[] | null;
  measurement?: REMCurve | null;
  target?: REMTarget | null;
  title?: string;
  showLegend?: boolean;
  height?: number;
  width?: number;
}

const MEASUREMENT_COLORS: Record<string, string> = {
  'REUR': '#2196F3',
  'REOR': '#FF9800',
  'REAR': '#4CAF50',
  'REIG': '#9C27B0',
  'RECD': '#F44336',
  'RESR': '#795548'
};

/** Canonical frequency order for the X axis */
const FREQ_ORDER: REMFrequency[] = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
const FREQ_LABELS = FREQ_ORDER.map(String);

/**
 * Build a data array aligned to FREQ_ORDER from explicit {frequency, gain}
 * points. Missing frequencies get null (gap in the line).
 *
 * This fixes M14: the chart no longer relies on array-index matching
 * hard-coded labels — it maps each data point by its frequency value.
 */
function alignToFrequencyAxis(points: { frequency: number; gain: number }[]): (number | null)[] {
  const lookup = new Map<number, number>();
  for (const p of points) lookup.set(p.frequency, p.gain);
  return FREQ_ORDER.map(f => lookup.get(f) ?? null);
}

const REMChart: React.FC<REMChartProps> = ({
  measurements = null,
  measurement = null,
  target,
  title = 'Real Ear Measurement',
  showLegend = true,
  height = 400,
  width = 800
}) => {
  const theme = useTheme();

  const getChartData = () => {
    const datasets: any[] = [];

    // Single measurement (backward compat)
    if (measurement && measurement.measurementPoints.length > 0) {
      datasets.push({
        label: `${measurement.type} Measurement`,
        data: alignToFrequencyAxis(measurement.measurementPoints),
        borderColor: MEASUREMENT_COLORS[measurement.type] || theme.palette.primary.main,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: MEASUREMENT_COLORS[measurement.type] || theme.palette.primary.main,
        tension: 0.3,
        spanGaps: true
      });
    }

    // Multiple measurements
    if (measurements && measurements.length > 0) {
      measurements.forEach(meas => {
        if (meas && meas.measurementPoints.length > 0) {
          datasets.push({
            label: `${meas.type} Measurement`,
            data: alignToFrequencyAxis(meas.measurementPoints),
            borderColor: MEASUREMENT_COLORS[meas.type] || theme.palette.primary.main,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: MEASUREMENT_COLORS[meas.type] || theme.palette.primary.main,
            tension: 0.3,
            spanGaps: true
          });
        }
      });
    }

    // Target curve
    if (target && target.targetPoints.length > 0) {
      datasets.push({
        label: `${target.type} Target`,
        data: alignToFrequencyAxis(target.targetPoints),
        borderColor: theme.palette.secondary.main,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 4,
        pointBackgroundColor: theme.palette.secondary.main,
        tension: 0.3,
        spanGaps: true
      });
    }

    return { labels: FREQ_LABELS, datasets };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category' as const,
        title: { display: true, text: 'Frequency (Hz)' }
      },
      y: {
        title: { display: true, text: 'Gain (dB)' },
        min: -10,
        max: 80
      }
    },
    plugins: {
      legend: { display: showLegend, position: 'top' as const },
      title: { display: !!title, text: title },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const freq = FREQ_LABELS[context.dataIndex];
            return `${context.dataset.label}: ${context.raw} dB at ${freq} Hz`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ height, width, maxWidth: '100%' }}>
      {(!measurement && !measurements?.length && !target) ? (
        <Typography variant="body1" align="center" sx={{ mt: 8 }}>
          No measurement data available. Complete a measurement to see results.
        </Typography>
      ) : (
        <Line data={getChartData()} options={options} />
      )}
    </Box>
  );
};

export default REMChart;
