/**
 * REMTutorialTab — Tutorial content for the REM page.
 *
 * Renders the "Tutorial" tab using data from remData.ts.
 */

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';

import {
  TUTORIAL_MEASUREMENT_CARDS,
  TUTORIAL_PROCEDURE_STEPS,
  PATIENT_INSTRUCTIONS,
  CHALLENGE_CARDS,
  PRO_TIPS,
  THINGS_TO_AVOID,
} from '../../data/remData';

const REMTutorialTab: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h5" gutterBottom>
      Real Ear Measurement Tutorial
    </Typography>

    {/* ---- What is REM ---- */}
    <Typography variant="h6" sx={{ mt: 3 }}>
      What is Real Ear Measurement?
    </Typography>
    <Typography paragraph>
      Real Ear Measurement (REM) is a verification procedure used to measure the
      performance of hearing aids in an individual's ear. It helps ensure that
      the hearing aid is providing the appropriate amount of amplification across
      frequencies based on the patient's hearing loss.
    </Typography>

    {/* ---- Types of REM ---- */}
    <Typography variant="h6" sx={{ mt: 3 }}>
      Types of REM Measurements
    </Typography>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {TUTORIAL_MEASUREMENT_CARDS.map((card) => (
        <Grid item xs={12} md={6} key={card.type}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" color="primary">
                {card.type}
              </Typography>
              <Typography variant="body2">{card.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* ---- Procedure steps ---- */}
    <Typography variant="h6" sx={{ mt: 3 }}>
      REM Procedure Steps
    </Typography>
    <ol>
      {TUTORIAL_PROCEDURE_STEPS.map((step, i) => (
        <li key={i}>
          <Typography paragraph>
            <strong>{step.bold}</strong> {step.text}
          </Typography>
        </li>
      ))}
    </ol>

    <Divider sx={{ my: 4 }} />

    {/* ---- Patient instructions ---- */}
    <Typography variant="h6" sx={{ mt: 3 }}>
      How to Instruct Patients
    </Typography>
    {PATIENT_INSTRUCTIONS.map((section) => (
      <Card sx={{ mb: 3 }} key={section.title}>
        <CardContent>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {section.title}
          </Typography>
          <ul>
            {section.items.map((item, i) => (
              <li key={i}>
                <Typography paragraph>
                  <strong>{item.bold}</strong> {item.text}
                </Typography>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    ))}

    {/* ---- Common challenges ---- */}
    <Typography variant="h6" sx={{ mt: 4 }}>
      Common Challenges and How to Overcome Them
    </Typography>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {CHALLENGE_CARDS.map((challenge) => (
        <Grid item xs={12} md={6} key={challenge.title}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">
                Challenge: {challenge.title}
              </Typography>
              <Typography variant="body2" paragraph>
                {challenge.description}
              </Typography>
              <Typography variant="subtitle2">Solutions:</Typography>
              <ul>
                {challenge.solutions.map((sol, i) => (
                  <li key={i}>
                    <Typography variant="body2">{sol}</Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    {/* ---- Things to avoid ---- */}
    <Typography variant="h6" sx={{ mt: 4 }}>
      Things to Avoid
    </Typography>
    {THINGS_TO_AVOID.map((warning, i) => (
      <Alert
        severity="warning"
        sx={{ mb: 2 }}
        key={i}
      >
        <Typography variant="subtitle1">{warning.title}</Typography>
        <Typography variant="body2">{warning.text}</Typography>
      </Alert>
    ))}

    {/* ---- Pro tips ---- */}
    <Typography variant="h6" sx={{ mt: 4 }}>
      Pro Tips for New Clinicians
    </Typography>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {PRO_TIPS.map((tip) => (
        <Grid item xs={12} md={4} key={tip.title}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" color="primary">
                {tip.title}
              </Typography>
              <Typography variant="body2">{tip.text}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default REMTutorialTab;
