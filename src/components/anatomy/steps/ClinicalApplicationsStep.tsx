import React, { useState, useCallback } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha
} from '@mui/material';
import { NavigateNext, KeyboardArrowDown } from '@mui/icons-material';

const ClinicalApplicationsStep: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = useCallback(
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  return (
    <>
      <Typography paragraph>
        Understanding ear anatomy helps in comprehending various hearing disorders and how they affect
        the hearing process.
      </Typography>

      {/* Comparison Table for Types of Hearing Loss */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" align="center">
          Types of Hearing Loss: A Comparison
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Scroll horizontally if needed to view the complete table
          </Typography>
        </Box>

        <Box sx={{ minWidth: 650, overflowX: 'auto' }}>
          <Grid container>
            {/* Header Row */}
            <Grid item xs={3} sx={{ p: 1, borderBottom: 1, borderRight: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <Typography variant="subtitle2" fontWeight="bold">Characteristic</Typography>
            </Grid>
            <Grid item xs={3} sx={{ p: 1, borderBottom: 1, borderRight: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.info.light, 0.1) }}>
              <Typography variant="subtitle2" fontWeight="bold" color="info.dark">Conductive Hearing Loss</Typography>
            </Grid>
            <Grid item xs={3} sx={{ p: 1, borderBottom: 1, borderRight: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.warning.light, 0.1) }}>
              <Typography variant="subtitle2" fontWeight="bold" color="warning.dark">Sensorineural Hearing Loss</Typography>
            </Grid>
            <Grid item xs={3} sx={{ p: 1, borderBottom: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.error.light, 0.1) }}>
              <Typography variant="subtitle2" fontWeight="bold" color="error.dark">Mixed Hearing Loss</Typography>
            </Grid>

            {/* Data rows */}
            {[
              {
                label: 'Affected Areas',
                cols: ['Outer ear and/or middle ear', 'Inner ear (cochlea) or auditory nerve', 'Combination of outer/middle ear AND inner ear/nerve problems']
              },
              {
                label: 'Audiometric Pattern',
                cols: ['Air-bone gap present (normal bone conduction with reduced air conduction)', 'No air-bone gap (both air and bone conduction equally reduced)', 'Air-bone gap present, but bone conduction is also reduced']
              },
              {
                label: 'Typical Frequency Pattern',
                cols: ['Often flat or affects low frequencies more; similar loss across frequencies', 'Often worse in high frequencies (sloping configuration)', 'Variable pattern depending on underlying causes']
              },
              {
                label: 'Speech Understanding',
                cols: ['Generally good if made loud enough; speech clarity maintained', 'Often poor even when loud enough; "I can hear but can\'t understand"', 'Poor, with elements of both types of problems']
              },
              {
                label: 'Common Treatments',
                cols: [
                  '\u2022 Medical/surgical intervention\n\u2022 Hearing aids if non-treatable',
                  '\u2022 Hearing aids\n\u2022 Cochlear implants (for severe loss)\n\u2022 Assistive listening devices',
                  '\u2022 Medical/surgical treatment of conductive component\n\u2022 Hearing aids for remaining loss'
                ]
              },
              {
                label: 'Related Ear Structures',
                cols: [
                  '\u2022 Tympanic membrane\n\u2022 Ossicular chain\n\u2022 Ear canal\n\u2022 Middle ear space',
                  '\u2022 Hair cells\n\u2022 Organ of Corti\n\u2022 Auditory nerve\n\u2022 Cochlear fluids',
                  'Any combination of structures from both conductive and sensorineural pathways'
                ]
              }
            ].map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                <Grid item xs={3} sx={{ p: 1, borderBottom: rowIdx < 5 ? 1 : 0, borderRight: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="body2" fontWeight="bold">{row.label}</Typography>
                </Grid>
                {row.cols.map((col, colIdx) => (
                  <Grid
                    item
                    xs={3}
                    key={colIdx}
                    sx={{
                      p: 1,
                      borderBottom: rowIdx < 5 ? 1 : 0,
                      borderRight: colIdx < 2 ? 1 : 0,
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{col}</Typography>
                  </Grid>
                ))}
              </React.Fragment>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ maxWidth: '80%', textAlign: 'center', fontStyle: 'italic' }}>
            Understanding the type of hearing loss is critical for appropriate treatment. Note that pure conductive
            hearing loss often has a better prognosis as the inner ear remains intact, while sensorineural hearing
            loss typically involves permanent damage to delicate sensory cells.
          </Typography>
        </Box>
      </Paper>

      {/* Accordions */}
      <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography fontWeight="bold">Conductive Hearing Loss</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Occurs when sound cannot efficiently travel through the outer and middle ear to the inner ear.
          </Typography>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">Common Causes:</Typography>
          <List dense>
            {['Earwax blockage', 'Ear infections (otitis media)', 'Fluid in the middle ear', 'Perforated eardrum', 'Otosclerosis (fixation of the stapes)'].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography fontWeight="bold">Sensorineural Hearing Loss</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            Results from damage to the inner ear (cochlea) or to the nerve pathways from the inner ear to the brain.
          </Typography>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">Common Causes:</Typography>
          <List dense>
            {['Age-related hearing loss (presbycusis)', 'Noise exposure', 'Ototoxic medications', 'Genetic factors', 'Illnesses like meningitis or measles'].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')} sx={{ mb: 1 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel3a-content" id="panel3a-header">
          <Typography fontWeight="bold">Mixed Hearing Loss</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            A combination of both conductive and sensorineural hearing loss, affecting both the outer/middle and inner ear.
          </Typography>
          <Typography paragraph>
            This can occur when a person has damage to the inner ear as well as an issue with the outer or middle ear.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ClinicalApplicationsStep;
