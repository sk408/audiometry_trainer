import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  LogarithmicScale
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { ThresholdPoint } from '../interfaces/AudioTypes';
import { Box, Paper, Typography } from '@mui/material';

// Register ChartJS components
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

// Define standard audiometric frequencies
const STANDARD_FREQUENCIES = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];

// Define major frequencies to show labels for on mobile devices
const MAJOR_FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];


interface AudiogramProps {
  thresholds: ThresholdPoint[];
  width?: number;
  height?: number;
  showLegend?: boolean;
  title?: string;
  compareThresholds?: ThresholdPoint[]; // For comparing student results to actual thresholds
  currentFrequency?: number; // Current frequency being tested
  currentLevel?: number; // Current hearing level being tested
  toneActive?: boolean; // Whether a tone is currently being presented
  onPositionClick?: (frequency: number, level: number) => void; // Callback for when chart is clicked
  interactive?: boolean; // Whether chart should respond to clicks/touches
}

const Audiogram: React.FC<AudiogramProps> = ({
  thresholds,
  width = 600,
  height = 400,
  showLegend = true,
  title = 'Audiogram',
  compareThresholds,
  currentFrequency,
  currentLevel,
  toneActive = false,
  onPositionClick,
  interactive = false
}) => {
  const chartRef = useRef<ChartJS<'scatter'>>(null);
  const [reticleFlash, setReticleFlash] = useState(false);

  // Flash the reticle when tone is active
  useEffect(() => {
    let flashInterval: NodeJS.Timeout | null = null;

    if (toneActive && currentFrequency && currentLevel !== undefined) {
      flashInterval = setInterval(() => {
        setReticleFlash(prev => !prev);
      }, 200);
    } else {
      setReticleFlash(false);
    }

    return () => {
      if (flashInterval) {
        clearInterval(flashInterval);
      }
    };
  }, [toneActive, currentFrequency, currentLevel]);

  // Memoize threshold datasets — only rebuild when threshold data changes,
  // not on every reticle flash (5x/second)
  const thresholdDatasets = useMemo(() => {
    const datasets = [];

    datasets.push({
      label: 'Right Ear (Air)',
      data: thresholds
        .filter(point => point.ear === 'right' && point.testType === 'air')
        .map(point => ({ x: point.frequency, y: point.hearingLevel, responseStatus: point.responseStatus })),
      pointStyle: 'circle' as const,
      borderColor: 'red',
      backgroundColor: 'red',
      borderWidth: 2,
      pointRadius: 6,
      showLine: true,
      tension: 0.1
    });

    datasets.push({
      label: 'Left Ear (Air)',
      data: thresholds
        .filter(point => point.ear === 'left' && point.testType === 'air')
        .map(point => ({ x: point.frequency, y: point.hearingLevel, responseStatus: point.responseStatus })),
      pointStyle: 'crossRot' as const,
      borderColor: 'blue',
      backgroundColor: 'blue',
      borderWidth: 2,
      pointRadius: 6,
      showLine: true,
      tension: 0.1
    });

    datasets.push({
      label: 'Right Ear (Bone)',
      data: thresholds
        .filter(point => point.ear === 'right' && point.testType === 'bone')
        .map(point => ({ x: point.frequency, y: point.hearingLevel, responseStatus: point.responseStatus })),
      pointStyle: 'triangle' as const,
      borderColor: 'red',
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderWidth: 2,
      pointRadius: 6,
      showLine: true,
      tension: 0.1
    });

    datasets.push({
      label: 'Left Ear (Bone)',
      data: thresholds
        .filter(point => point.ear === 'left' && point.testType === 'bone')
        .map(point => ({ x: point.frequency, y: point.hearingLevel, responseStatus: point.responseStatus })),
      pointStyle: 'triangle' as const,
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
      borderWidth: 2,
      pointRadius: 6,
      showLine: true,
      tension: 0.1,
      rotation: 180
    });

    if (compareThresholds) {
      datasets.push({
        label: 'Right Ear Air (Expected)',
        data: compareThresholds
          .filter(point => point.ear === 'right' && point.testType === 'air')
          .map(point => ({ x: point.frequency, y: point.hearingLevel, responseStatus: point.responseStatus })),
        pointStyle: 'circle' as const,
        borderColor: 'rgba(255, 0, 0, 0.5)',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderWidth: 1,
        pointRadius: 4,
        showLine: true,
        tension: 0.1,
        borderDash: [5, 5]
      });

      datasets.push({
        label: 'Left Ear Air (Expected)',
        data: compareThresholds
          .filter(point => point.ear === 'left' && point.testType === 'air')
          .map(point => ({ x: point.frequency, y: point.hearingLevel, responseStatus: point.responseStatus })),
        pointStyle: 'crossRot' as const,
        borderColor: 'rgba(0, 0, 255, 0.5)',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
        borderWidth: 1,
        pointRadius: 4,
        showLine: true,
        tension: 0.1,
        borderDash: [5, 5]
      });

      datasets.push({
        label: 'Right Ear Bone (Expected)',
        data: compareThresholds
          .filter(point => point.ear === 'right' && point.testType === 'bone')
          .map(point => ({ x: point.frequency, y: point.hearingLevel, responseStatus: point.responseStatus })),
        pointStyle: 'triangle' as const,
        borderColor: 'rgba(255, 0, 0, 0.5)',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderWidth: 1,
        pointRadius: 4,
        showLine: true,
        tension: 0.1,
        borderDash: [5, 5]
      });

      datasets.push({
        label: 'Left Ear Bone (Expected)',
        data: compareThresholds
          .filter(point => point.ear === 'left' && point.testType === 'bone')
          .map(point => ({ x: point.frequency, y: point.hearingLevel, responseStatus: point.responseStatus })),
        pointStyle: 'triangle' as const,
        borderColor: 'rgba(0, 0, 255, 0.5)',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderWidth: 1,
        pointRadius: 4,
        showLine: true,
        tension: 0.1,
        borderDash: [5, 5],
        rotation: 180
      });
    }

    return datasets;
  }, [thresholds, compareThresholds]);

  // Build final chart data combining memoized thresholds with reticle overlay
  const chartData = useMemo((): ChartData<'scatter'> => {
    const datasets = [...thresholdDatasets];

    if (currentFrequency !== undefined && currentLevel !== undefined) {
      datasets.push({
        label: 'Current Frequency',
        data: [
          { x: currentFrequency, y: -10 },
          { x: currentFrequency, y: 120 }
        ],
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
        borderColor: reticleFlash ? 'rgba(255, 165, 0, 1)' : 'rgba(255, 165, 0, 0.7)',
        borderWidth: reticleFlash ? 3 : 1,
        borderDash: [5, 5],
        pointRadius: 0,
        showLine: true,
        tension: 0
      } as any);

      datasets.push({
        label: 'Current Level',
        data: [
          { x: 125, y: currentLevel },
          { x: 8000, y: currentLevel }
        ],
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
        borderColor: reticleFlash ? 'rgba(255, 165, 0, 1)' : 'rgba(255, 165, 0, 0.7)',
        borderWidth: reticleFlash ? 3 : 1,
        borderDash: [5, 5],
        pointRadius: 0,
        showLine: true,
        tension: 0
      } as any);

      datasets.push({
        label: 'Current Position',
        data: [{ x: currentFrequency, y: currentLevel }],
        backgroundColor: reticleFlash ? 'rgba(255, 165, 0, 1)' : 'rgba(255, 165, 0, 0.7)',
        borderColor: reticleFlash ? 'rgb(255, 165, 0)' : 'rgba(255, 100, 0, 0.7)',
        pointStyle: 'circle' as const,
        pointRadius: reticleFlash ? 9 : 7,
        borderWidth: 2,
        showLine: false
      } as any);
    }

    return { datasets };
  }, [thresholdDatasets, currentFrequency, currentLevel, reticleFlash]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'logarithmic' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Frequency (Hz)'
        },
        ticks: {
          callback: (value: any) => {
            // Only show labels for major frequencies to avoid crowding on mobile
            if (MAJOR_FREQUENCIES.includes(value)) {
              return value.toString();
            }
            return '';
          },
          autoSkip: false,
          maxRotation: 0
        },
        min: 125,
        max: 8000,
        grid: {
          display: true,
          color: (context: any) => {
            // Still show grid lines for all standard frequencies
            if (STANDARD_FREQUENCIES.includes(context.tick.value)) {
              return 'rgba(0, 0, 0, 0.1)';
            }
            return 'rgba(0, 0, 0, 0)';
          }
        }
      },
      y: {
        reverse: true, // Invert y-axis (negative values at top)
        title: {
          display: true,
          text: 'Hearing Level (dB HL)'
        },
        min: -10,
        max: 120,
        ticks: {
          stepSize: 10
        },
        grid: {
          color: (context: any) => {
            // Highlight key lines at 0 dB HL and other significant levels
            if (context.tick.value === 0) return 'rgba(0, 0, 0, 0.5)';
            if (context.tick.value % 20 === 0) return 'rgba(0, 0, 0, 0.2)';
            return 'rgba(0, 0, 0, 0.1)';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false, // Hide the chart's built-in legend
        position: 'bottom' as const
      },
      title: {
        display: !!title,
        text: title
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw;
            return `${context.dataset.label}: ${point.x} Hz, ${point.y} dB HL`;
          }
        }
      }
    }
  };

  // Handle chart click events
  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive || !onPositionClick || !chartRef.current) return;
    
    // Don't allow clicks when tone is active
    if (toneActive) return;
    
    const chart = chartRef.current;
    const canvas = chart.canvas;
    
    // Get click position relative to chart
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert to chart coordinates
    const xScale = chart.scales.x;
    const yScale = chart.scales.y;
    
    if (!xScale || !yScale) return;
    
    // Get the value in data coordinates
    const frequency = xScale.getValueForPixel(x);
    const level = yScale.getValueForPixel(y);
    
    if (frequency === undefined || level === undefined) return;
    
    // Find the nearest standard frequency
    const nearestFrequency = STANDARD_FREQUENCIES.reduce((prev, curr) => {
      return (Math.abs(curr - frequency) < Math.abs(prev - frequency)) ? curr : prev;
    });
    
    // Round the level to the nearest 5
    const roundedLevel = Math.round(level / 5) * 5;
    
    // Ensure level is within valid range (-10 to 120)
    const clampedLevel = Math.max(-10, Math.min(120, roundedLevel));
    
    // Call the callback with the nearest standard frequency and rounded level
    onPositionClick(nearestFrequency, clampedLevel);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      position: 'relative',
      height: '100%',
      width: '100%',
      cursor: interactive && !toneActive ? 'crosshair' : 'default'
    }}>
      <Scatter
        data={chartData}
        options={options}
        ref={chartRef}
        onClick={handleChartClick}
      />
    </Box>
  );
};

export default Audiogram; 