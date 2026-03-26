import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import { quizQuestions } from '../../data/anatomyData';

interface AnatomyQuizProps {
  onReset?: () => void;
}

const AnatomyQuiz: React.FC<AnatomyQuizProps> = ({ onReset }) => {
  const questions = quizQuestions;
  const theme = useTheme();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | null>>(() => {
    const init: Record<string, string | null> = {};
    questions.forEach(q => { init[q.id] = null; });
    return init;
  });

  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    questions.forEach(q => { init[q.id] = false; });
    return init;
  });

  const handleAnswerSelect = useCallback((questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleRevealAnswer = useCallback((questionId: string) => {
    setShowAnswers(prev => ({ ...prev, [questionId]: true }));
  }, []);

  const handleRetake = useCallback(() => {
    const emptyAnswers: Record<string, string | null> = {};
    const emptyShown: Record<string, boolean> = {};
    questions.forEach(q => {
      emptyAnswers[q.id] = null;
      emptyShown[q.id] = false;
    });
    setSelectedAnswers(emptyAnswers);
    setShowAnswers(emptyShown);
    onReset?.();
  }, [questions, onReset]);

  const allRevealed = questions.every(q => showAnswers[q.id]);
  const score = questions.filter(q => selectedAnswers[q.id] === q.correctKey).length;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        bgcolor: alpha(theme.palette.primary.light, 0.05),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" align="center">
        Quick Knowledge Check
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {questions.map(q => (
          <Grid item xs={12} key={q.id}>
            <Box sx={{ p: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {q.question}
              </Typography>
              <Box sx={{ pl: 2 }}>
                {q.options.map(opt => (
                  <Box
                    key={`${q.id}-option-${opt.key}`}
                    onClick={() => handleAnswerSelect(q.id, opt.key)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAnswerSelect(q.id, opt.key);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedAnswers[q.id] === opt.key}
                    sx={{
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: selectedAnswers[q.id] === opt.key
                        ? alpha(theme.palette.primary.light, 0.3)
                        : 'transparent',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.light, 0.1)
                      }
                    }}
                  >
                    <Typography variant="body2">
                      {opt.key}) {opt.text}
                    </Typography>
                  </Box>
                ))}

                {selectedAnswers[q.id] !== null && !showAnswers[q.id] && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleRevealAnswer(q.id)}
                    sx={{ mt: 1 }}
                  >
                    Check Answer
                  </Button>
                )}

                {showAnswers[q.id] && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        bgcolor: selectedAnswers[q.id] === q.correctKey
                          ? alpha(theme.palette.success.light, 0.2)
                          : alpha(theme.palette.error.light, 0.2),
                        p: 1,
                        borderRadius: 1
                      }}
                    >
                      <strong>Answer:</strong> {q.explanation}
                      {selectedAnswers[q.id] !== q.correctKey && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          You selected {selectedAnswers[q.id]}, which is incorrect. Try to remember this for future reference.
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Quiz score and retake button */}
      {allRevealed && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Score: {score} / {questions.length}
          </Typography>
          <Button variant="outlined" size="small" onClick={handleRetake}>
            Retake Quiz
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic', maxWidth: '80%', textAlign: 'center' }}>
          These quick checks help reinforce your understanding of key concepts about the middle ear.
          Remember these fundamental points as we move on to explore the inner ear.
        </Typography>
      </Box>
    </Paper>
  );
};

export default AnatomyQuiz;
