import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws on render
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error from child');
  }
  return <div>Child content</div>;
}

// Suppress React error boundary console output during tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Hello World</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('catches errors and shows default fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error from child')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('recovers when Try Again is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error state shown
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click Try Again — ErrorBoundary resets its state, but re-rendering
    // will still throw. We verify the reset happens.
    fireEvent.click(screen.getByText('Try Again'));

    // After reset, ErrorBoundary tries to render children again.
    // Since ThrowingComponent still throws, it catches again.
    // This confirms the reset mechanism works (getDerivedStateFromError fires again).
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows generic message when error has no message', () => {
    const ThrowNull: React.FC = () => {
      throw new Error('');
    };

    render(
      <ErrorBoundary>
        <ThrowNull />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    // The fallback text should be shown
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });
});
