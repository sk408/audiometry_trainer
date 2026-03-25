import React, { useState, useCallback } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { PinnaLandmark } from '../../data/anatomyData';

interface AnatomyAccordionProps {
  landmarks: PinnaLandmark[];
}

const AnatomyAccordion: React.FC<AnatomyAccordionProps> = ({ landmarks }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = useCallback(
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  return (
    <>
      {landmarks.map(lm => (
        <Accordion
          key={lm.id}
          expanded={expanded === lm.id}
          onChange={handleChange(lm.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<KeyboardArrowDown />}
            aria-controls={`${lm.id}-content`}
            id={`${lm.id}-header`}
          >
            <Typography fontWeight="bold">{lm.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  In Simple Terms:
                </Typography>
                <Typography paragraph>
                  {lm.simpleTerms}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Clinical Description:
                </Typography>
                <Typography paragraph>
                  {lm.clinicalDescription}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default AnatomyAccordion;
