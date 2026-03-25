import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import AnatomyQuiz from '../AnatomyQuiz';
import { QuizQuestion } from '../../../data/anatomyData';

const theme = createTheme();

const sampleQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the cochlea?',
    options: [
      { key: 'a', text: 'A bone in the middle ear' },
      { key: 'b', text: 'A snail-shaped structure in the inner ear' },
      { key: 'c', text: 'The eardrum' },
    ],
    correctKey: 'b',
    explanation: 'b) The cochlea is a snail-shaped structure in the inner ear.'
  },
  {
    id: 'q2',
    question: 'What does the stapes connect to?',
    options: [
      { key: 'a', text: 'The oval window' },
      { key: 'b', text: 'The round window' },
    ],
    correctKey: 'a',
    explanation: 'a) The stapes footplate connects to the oval window.'
  }
];

function renderQuiz(questions = sampleQuestions) {
  return render(
    <ThemeProvider theme={theme}>
      <AnatomyQuiz questions={questions} />
    </ThemeProvider>
  );
}

describe('AnatomyQuiz', () => {
  it('renders all questions', () => {
    renderQuiz();
    expect(screen.getByText('What is the cochlea?')).toBeInTheDocument();
    expect(screen.getByText('What does the stapes connect to?')).toBeInTheDocument();
  });

  it('renders all options for each question', () => {
    renderQuiz();
    expect(screen.getByText(/A bone in the middle ear/)).toBeInTheDocument();
    expect(screen.getByText(/A snail-shaped structure/)).toBeInTheDocument();
    expect(screen.getByText(/The eardrum/)).toBeInTheDocument();
    expect(screen.getByText(/The oval window/)).toBeInTheDocument();
    expect(screen.getByText(/The round window/)).toBeInTheDocument();
  });

  it('shows Check Answer button after selecting an answer', () => {
    renderQuiz();
    // Initially no Check Answer buttons
    expect(screen.queryByText('Check Answer')).not.toBeInTheDocument();

    // Select an answer for q1
    fireEvent.click(screen.getByText(/A snail-shaped structure/));

    // Check Answer button should appear
    expect(screen.getByText('Check Answer')).toBeInTheDocument();
  });

  it('reveals correct answer feedback on Check Answer click', () => {
    renderQuiz();
    // Select correct answer
    fireEvent.click(screen.getByText(/A snail-shaped structure/));
    fireEvent.click(screen.getByText('Check Answer'));

    // Explanation should be shown
    expect(screen.getByText(/The cochlea is a snail-shaped structure/)).toBeInTheDocument();
  });

  it('shows incorrect feedback when wrong answer selected', () => {
    renderQuiz();
    // Select wrong answer
    fireEvent.click(screen.getByText(/A bone in the middle ear/));
    fireEvent.click(screen.getByText('Check Answer'));

    // Should show incorrect text
    expect(screen.getByText(/which is incorrect/)).toBeInTheDocument();
  });

  it('shows score when all answers are revealed', () => {
    renderQuiz();

    // Answer q1 correctly
    fireEvent.click(screen.getByText(/A snail-shaped structure/));
    fireEvent.click(screen.getByText('Check Answer'));

    // Answer q2 correctly
    fireEvent.click(screen.getByText(/The oval window/));
    fireEvent.click(screen.getByText('Check Answer'));

    // Score should be shown
    expect(screen.getByText('Score: 2 / 2')).toBeInTheDocument();
  });

  it('shows Retake Quiz button after all answers revealed', () => {
    renderQuiz();

    fireEvent.click(screen.getByText(/A snail-shaped structure/));
    fireEvent.click(screen.getByText('Check Answer'));
    fireEvent.click(screen.getByText(/The oval window/));
    fireEvent.click(screen.getByText('Check Answer'));

    expect(screen.getByText('Retake Quiz')).toBeInTheDocument();
  });

  it('resets quiz state on Retake Quiz click', () => {
    renderQuiz();

    // Complete quiz
    fireEvent.click(screen.getByText(/A snail-shaped structure/));
    fireEvent.click(screen.getByText('Check Answer'));
    fireEvent.click(screen.getByText(/The oval window/));
    fireEvent.click(screen.getByText('Check Answer'));

    // Click retake
    fireEvent.click(screen.getByText('Retake Quiz'));

    // Score and retake should be gone
    expect(screen.queryByText(/Score:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Retake Quiz')).not.toBeInTheDocument();
    // No Check Answer buttons should be visible (no answers selected)
    expect(screen.queryByText('Check Answer')).not.toBeInTheDocument();
  });

  it('renders footer text when provided', () => {
    render(
      <ThemeProvider theme={theme}>
        <AnatomyQuiz questions={sampleQuestions} footerText="Test your knowledge!" />
      </ThemeProvider>
    );
    expect(screen.getByText('Test your knowledge!')).toBeInTheDocument();
  });

  it('quiz options are keyboard accessible', () => {
    renderQuiz();
    const option = screen.getByText(/A snail-shaped structure/).closest('[role="button"]');
    expect(option).toHaveAttribute('tabIndex', '0');
    expect(option).toHaveAttribute('aria-pressed', 'false');

    // Select via keyboard
    fireEvent.keyDown(option!, { key: 'Enter' });
    expect(option).toHaveAttribute('aria-pressed', 'true');
  });
});
