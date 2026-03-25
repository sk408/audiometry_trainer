import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Audiogram from '../Audiogram';
import { ThresholdPoint } from '../../interfaces/AudioTypes';

// Mock chart.js and react-chartjs-2 since they need canvas
vi.mock('react-chartjs-2', () => ({
  Scatter: ({ data, options }: any) => (
    <div data-testid="scatter-chart">
      <span data-testid="dataset-count">{data.datasets.length}</span>
      {data.datasets.map((ds: any, i: number) => (
        <span key={i} data-testid={`dataset-${i}`}>{ds.label}</span>
      ))}
    </div>
  ),
}));

const sampleThresholds: ThresholdPoint[] = [
  { frequency: 1000, hearingLevel: 25, ear: 'right', testType: 'air', responseStatus: 'threshold' },
  { frequency: 2000, hearingLevel: 30, ear: 'right', testType: 'air', responseStatus: 'threshold' },
  { frequency: 1000, hearingLevel: 20, ear: 'left', testType: 'air', responseStatus: 'threshold' },
  { frequency: 1000, hearingLevel: 15, ear: 'right', testType: 'bone', responseStatus: 'threshold' },
  { frequency: 1000, hearingLevel: 10, ear: 'left', testType: 'bone', responseStatus: 'threshold' },
];

describe('Audiogram', () => {
  it('renders without crashing', () => {
    render(<Audiogram thresholds={[]} />);
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
  });

  it('renders with threshold data', () => {
    render(<Audiogram thresholds={sampleThresholds} />);
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
    // Should have 4 datasets: right air, left air, right bone, left bone
    expect(screen.getByTestId('dataset-0')).toHaveTextContent('Right Ear (Air)');
    expect(screen.getByTestId('dataset-1')).toHaveTextContent('Left Ear (Air)');
    expect(screen.getByTestId('dataset-2')).toHaveTextContent('Right Ear (Bone)');
    expect(screen.getByTestId('dataset-3')).toHaveTextContent('Left Ear (Bone)');
  });

  it('includes reticle datasets when currentFrequency and currentLevel provided', () => {
    render(
      <Audiogram
        thresholds={sampleThresholds}
        currentFrequency={1000}
        currentLevel={40}
      />
    );
    // 4 threshold datasets + 3 reticle datasets (frequency line, level line, position)
    expect(screen.getByTestId('dataset-count')).toHaveTextContent('7');
    expect(screen.getByTestId('dataset-4')).toHaveTextContent('Current Frequency');
    expect(screen.getByTestId('dataset-5')).toHaveTextContent('Current Level');
    expect(screen.getByTestId('dataset-6')).toHaveTextContent('Current Position');
  });

  it('includes comparison datasets when compareThresholds provided', () => {
    const compareThresholds: ThresholdPoint[] = [
      { frequency: 1000, hearingLevel: 20, ear: 'right', testType: 'air', responseStatus: 'threshold' },
      { frequency: 1000, hearingLevel: 15, ear: 'left', testType: 'air', responseStatus: 'threshold' },
      { frequency: 1000, hearingLevel: 10, ear: 'right', testType: 'bone', responseStatus: 'threshold' },
      { frequency: 1000, hearingLevel: 5, ear: 'left', testType: 'bone', responseStatus: 'threshold' },
    ];
    render(
      <Audiogram
        thresholds={sampleThresholds}
        compareThresholds={compareThresholds}
      />
    );
    // 4 threshold + 4 comparison = 8
    expect(screen.getByTestId('dataset-count')).toHaveTextContent('8');
    expect(screen.getByTestId('dataset-4')).toHaveTextContent('Right Ear Air (Expected)');
  });

  it('renders with empty thresholds', () => {
    render(<Audiogram thresholds={[]} />);
    // Should still have 4 base datasets (empty data arrays)
    expect(screen.getByTestId('dataset-count')).toHaveTextContent('4');
  });

  it('accepts custom title', () => {
    render(<Audiogram thresholds={[]} title="My Audiogram" />);
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument();
  });
});
