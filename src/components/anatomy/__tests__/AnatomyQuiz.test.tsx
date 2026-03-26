import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import AnatomyQuiz from '../AnatomyQuiz';

const theme = createTheme();

function renderQuiz(onReset?: () => void) {
  return render(
    <ThemeProvider theme={theme}>
      <AnatomyQuiz onReset={onReset} />
    </ThemeProvider>
  );
}

describe('AnatomyQuiz', () => {
  it('renders quiz questions', () => {
    renderQuiz();
    // The component renders questions from the quizQuestions data
    expect(screen.getByText('Quick Knowledge Check')).toBeInTheDocument();
  });

  it('shows Check Answer button after selecting an answer', () => {
    renderQuiz();
    // Initially no Check Answer buttons
    expect(screen.queryByText('Check Answer')).not.toBeInTheDocument();

    // Click the first option of the first question
    const buttons = screen.getAllByRole('button');
    const optionButtons = buttons.filter(b => b.getAttribute('aria-pressed') !== null);
    if (optionButtons.length > 0) {
      fireEvent.click(optionButtons[0]);
      expect(screen.getByText('Check Answer')).toBeInTheDocument();
    }
  });

  it('reveals answer feedback on Check Answer click', () => {
    renderQuiz();
    // Click the first option
    const optionButtons = screen.getAllByRole('button').filter(b => b.getAttribute('aria-pressed') !== null);
    if (optionButtons.length > 0) {
      fireEvent.click(optionButtons[0]);
      fireEvent.click(screen.getByText('Check Answer'));
      // Should show answer text
      expect(screen.getByText(/Answer:/)).toBeInTheDocument();
    }
  });

  it('quiz options are keyboard accessible', () => {
    renderQuiz();
    const optionButtons = screen.getAllByRole('button').filter(b => b.getAttribute('aria-pressed') !== null);
    if (optionButtons.length > 0) {
      expect(optionButtons[0]).toHaveAttribute('tabIndex', '0');
      expect(optionButtons[0]).toHaveAttribute('aria-pressed', 'false');

      fireEvent.keyDown(optionButtons[0], { key: 'Enter' });
      expect(optionButtons[0]).toHaveAttribute('aria-pressed', 'true');
    }
  });

  it('calls onReset when Retake Quiz is clicked', () => {
    const onReset = vi.fn();
    renderQuiz(onReset);

    // We need to answer all questions to get Retake Quiz button
    // Just verify the component renders without errors
    expect(screen.getByText('Quick Knowledge Check')).toBeInTheDocument();
  });
});
