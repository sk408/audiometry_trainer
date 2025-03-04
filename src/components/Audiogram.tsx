import React, { useRef, useEffect, useState } from 'react';
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
  toneActive = false
}) => {
  const chartRef = useRef<ChartJS<'scatter'>>(null);
  const [reticleFlash, setReticleFlash] = useState(false);
  
  // Cleanup chart instance when component unmounts
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Flash the reticle when tone is active
  useEffect(() => {
    let flashInterval: NodeJS.Timeout | null = null;
    
    if (toneActive && currentFrequency && currentLevel !== undefined) {
      // Start flashing - alternate every 200ms
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

  // Define standard audiogram symbols and colors
  const symbols = {
    right: {
      air: { symbol: 'circle', color: 'rgb(255, 0, 0)', borderColor: 'rgb(255, 0, 0)', fillColor: 'rgb(255, 0, 0)' },
      bone: { symbol: '<', color: 'rgb(255, 0, 0)', borderColor: 'rgb(255, 0, 0)', fillColor: 'transparent' },
      masked_air: { symbol: 'triangle', color: 'rgb(255, 0, 0)', borderColor: 'rgb(255, 0, 0)', fillColor: 'transparent' },
      masked_bone: { symbol: '[', color: 'rgb(255, 0, 0)', borderColor: 'rgb(255, 0, 0)', fillColor: 'transparent' }
    },
    left: {
      air: { symbol: 'crossRot', color: 'rgb(0, 0, 255)', borderColor: 'rgb(0, 0, 255)', fillColor: 'rgb(0, 0, 255)' },
      bone: { symbol: '>', color: 'rgb(0, 0, 255)', borderColor: 'rgb(0, 0, 255)', fillColor: 'transparent' },
      masked_air: { symbol: 'rect', color: 'rgb(0, 0, 255)', borderColor: 'rgb(0, 0, 255)', fillColor: 'transparent' },
      masked_bone: { symbol: ']', color: 'rgb(0, 0, 255)', borderColor: 'rgb(0, 0, 255)', fillColor: 'transparent' }
    }
  };

  // Convert threshold data to chart format
  const prepareChartData = (): ChartData<'scatter'> => {
    // Filter out any thresholds that don't have 'threshold' responseStatus
    const validThresholds = thresholds.filter(t => t.responseStatus === 'threshold');
    
    // Split thresholds by ear and test type
    const rightAir = validThresholds.filter(t => t.ear === 'right' && t.testType === 'air');
    const leftAir = validThresholds.filter(t => t.ear === 'left' && t.testType === 'air');
    const rightBone = validThresholds.filter(t => t.ear === 'right' && t.testType === 'bone');
    const leftBone = validThresholds.filter(t => t.ear === 'left' && t.testType === 'bone');
    
    // Convert to scatter plot format
    const datasets = [];
    
    // Right ear air conduction
    datasets.push({
      label: 'Right Air',
      data: rightAir.map(t => ({ x: t.frequency, y: t.hearingLevel })),
      backgroundColor: symbols.right.air.fillColor,
      borderColor: symbols.right.air.borderColor,
      pointStyle: symbols.right.air.symbol,
      pointRadius: 8,
      borderWidth: 2,
      showLine: true,
      tension: 0.1
    });
    
    // Left ear air conduction
    datasets.push({
      label: 'Left Air',
      data: leftAir.map(t => ({ x: t.frequency, y: t.hearingLevel })),
      backgroundColor: symbols.left.air.fillColor,
      borderColor: symbols.left.air.borderColor,
      pointStyle: symbols.left.air.symbol,
      pointRadius: 8,
      borderWidth: 2,
      showLine: true,
      tension: 0.1
    });
    
    // Right ear bone conduction
    datasets.push({
      label: 'Right Bone',
      data: rightBone.map(t => ({ x: t.frequency, y: t.hearingLevel })),
      backgroundColor: symbols.right.bone.fillColor,
      borderColor: symbols.right.bone.borderColor,
      pointStyle: symbols.right.bone.symbol,
      pointRadius: 10,
      borderWidth: 2,
      showLine: false
    });
    
    // Left ear bone conduction
    datasets.push({
      label: 'Left Bone',
      data: leftBone.map(t => ({ x: t.frequency, y: t.hearingLevel })),
      backgroundColor: symbols.left.bone.fillColor,
      borderColor: symbols.left.bone.borderColor,
      pointStyle: symbols.left.bone.symbol,
      pointRadius: 10,
      borderWidth: 2,
      showLine: false
    });
    
    // Add comparison thresholds if provided
    if (compareThresholds && compareThresholds.length > 0) {
      // Split compare thresholds by ear and test type
      const compareRightAir = compareThresholds.filter(t => t.ear === 'right' && t.testType === 'air');
      const compareLeftAir = compareThresholds.filter(t => t.ear === 'left' && t.testType === 'air');
      
      // Right ear comparison (dashed line)
      datasets.push({
        label: 'Actual Right Thresholds',
        data: compareRightAir.map(t => ({ x: t.frequency, y: t.hearingLevel })),
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        borderColor: 'rgba(255, 0, 0, 0.7)',
        pointStyle: 'circle',
        pointRadius: 4,
        borderWidth: 2,
        borderDash: [5, 5],
        showLine: true,
        tension: 0.1
      });
      
      // Left ear comparison (dashed line)
      datasets.push({
        label: 'Actual Left Thresholds',
        data: compareLeftAir.map(t => ({ x: t.frequency, y: t.hearingLevel })),
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
        borderColor: 'rgba(0, 0, 255, 0.7)',
        pointStyle: 'crossRot',
        pointRadius: 4,
        borderWidth: 2,
        borderDash: [5, 5],
        showLine: true,
        tension: 0.1
      });
    }
    
    // Add reticle dataset if current frequency and level are provided
    if (currentFrequency !== undefined && currentLevel !== undefined) {
      // Reticle horizontal line (frequency indicator)
      datasets.push({
        label: 'Current Frequency',
        data: [
          // Create a line at the current frequency from -10 to 120 dB
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
      });
      
      // Reticle vertical line (level indicator)
      datasets.push({
        label: 'Current Level',
        data: [
          // Create a line at the current level across all frequencies
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
      });
      
      // Reticle intersection point
      datasets.push({
        label: 'Current Position',
        data: [{ x: currentFrequency, y: currentLevel }],
        backgroundColor: reticleFlash ? 'rgba(255, 165, 0, 1)' : 'rgba(255, 165, 0, 0.7)',
        borderColor: reticleFlash ? 'rgb(255, 165, 0)' : 'rgba(255, 100, 0, 0.7)',
        pointStyle: 'circle',
        pointRadius: reticleFlash ? 9 : 7,
        borderWidth: 2,
        showLine: false
      });
    }
    
    return { datasets };
  };

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
            // Only show standard frequencies
            if (STANDARD_FREQUENCIES.includes(value)) {
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
            // Only show grid lines for standard frequencies
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

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <Scatter data={prepareChartData()} options={options} ref={chartRef} />
      </Box>
      {/* Custom legend at the bottom */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'red', mr: 1 }} />
          <Typography variant="caption">Right Air</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'blue', mr: 1 }} />
          <Typography variant="caption">Left Air</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="span" 
            sx={{ 
              display: 'inline-block', 
              width: 0, 
              height: 0, 
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '12px solid red',
              mr: 1 
            }} 
          />
          <Typography variant="caption">Right Bone</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="span" 
            sx={{ 
              display: 'inline-block', 
              width: 0, 
              height: 0, 
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: '12px solid blue',
              mr: 1 
            }} 
          />
          <Typography variant="caption">Left Bone</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Audiogram; 