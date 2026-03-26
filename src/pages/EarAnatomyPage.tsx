import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Fab,
  Tooltip,
  useTheme
} from '@mui/material';
import { MenuBook } from '@mui/icons-material';
import { AnatomyGlossary, AnatomyViewer } from '../components/anatomy';
import {
  IntroductionStep,
  OuterEarStep,
  PinnaLandmarksStep,
  MiddleEarStep,
  InnerEarStep,
  HowHearingWorksStep,
  ClinicalApplicationsStep
} from '../components/anatomy/steps';
import { stepLabels } from '../data/anatomyData';

const EarAnatomyPage: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const handleNext = useCallback(() => {
    setActiveStep(prev => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, []);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, []);

  const toggleGlossary = useCallback(() => {
    setGlossaryOpen(prev => !prev);
  }, []);

  const steps = useMemo(() => [
    { label: stepLabels[0], content: <IntroductionStep /> },
    { label: stepLabels[1], content: <OuterEarStep /> },
    { label: stepLabels[2], content: <PinnaLandmarksStep /> },
    { label: stepLabels[3], content: <MiddleEarStep /> },
    { label: stepLabels[4], content: <InnerEarStep /> },
    { label: stepLabels[5], content: <HowHearingWorksStep /> },
    { label: stepLabels[6], content: <ClinicalApplicationsStep /> },
  ], []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: theme.shadows[3]
        }}
      >
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Ear Anatomy Interactive Guide
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
            Explore the structure and function of the human ear
          </Typography>
        </Box>

        {/* 3D Ear Model Section */}
        <AnatomyViewer height={450} />

        {/* Main stepper content */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Box>
                  {step.content}
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography paragraph>All steps completed - you&apos;ve successfully learned about the ear!</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Start Over
            </Button>
          </Paper>
        )}

        {/* Floating Glossary Button */}
        <Tooltip title="Ear Anatomy Glossary" arrow placement="left">
          <Fab
            color="primary"
            aria-label="glossary"
            onClick={toggleGlossary}
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000
            }}
          >
            <MenuBook />
          </Fab>
        </Tooltip>

        {/* Glossary Drawer */}
        <AnatomyGlossary open={glossaryOpen} onClose={toggleGlossary} />
      </Paper>
    </Container>
  );
};

export default EarAnatomyPage;
