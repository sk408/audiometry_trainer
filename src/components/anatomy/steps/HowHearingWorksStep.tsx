import React from 'react';
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha
} from '@mui/material';
import { NavigateNext, Hearing } from '@mui/icons-material';

const hearingProcessImg = "";

const HowHearingWorksStep: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <Typography paragraph>
        Hearing is a complex process that involves all three parts of the ear working together, as well as the
        auditory nerve and brain.
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardMedia
          component="img"
          height="250"
          image={hearingProcessImg}
          alt="Hearing Process"
          sx={{
            objectFit: 'contain',
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#f5f5f5'
          }}
        />
        <CardContent>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            The Hearing Process Step by Step:
          </Typography>
          <List dense>
            {[
              { primary: 'Step 1: Sound Collection', secondary: 'The pinna captures sound waves and funnels them into the ear canal' },
              { primary: 'Step 2: Eardrum Vibration', secondary: 'Sound waves cause the eardrum to vibrate back and forth' },
              { primary: 'Step 3: Ossicle Movement', secondary: 'The vibrations move the three ossicles, which amplify the sound' },
              { primary: 'Step 4: Fluid Waves in Cochlea', secondary: 'The stapes pushes on the oval window, creating waves in the cochlear fluid' },
              { primary: 'Step 5: Hair Cell Stimulation', secondary: 'The fluid waves bend the hair cells in the organ of Corti' },
              { primary: 'Step 6: Electrical Signal Generation', secondary: 'Bent hair cells release chemicals that generate electrical signals' },
              { primary: 'Step 7: Signal Transmission', secondary: 'The auditory nerve carries these signals to the brain' },
              { primary: 'Step 8: Sound Interpretation', secondary: "The brain's auditory cortex interprets these signals as meaningful sounds" },
            ].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon><NavigateNext color="primary" /></ListItemIcon>
                <ListItemText primary={item.primary} secondary={item.secondary} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
        Key Facts About Hearing:
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon><Hearing color="primary" /></ListItemIcon>
          <ListItemText
            primary="Frequency Range"
            secondary="Humans typically hear frequencies between 20 Hz and 20,000 Hz, with highest sensitivity around 2,000-5,000 Hz (the range of most speech sounds)"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon><Hearing color="primary" /></ListItemIcon>
          <ListItemText
            primary="Tonotopic Organization"
            secondary="Different parts of the cochlea respond to different frequencies, with high frequencies at the base and low frequencies at the apex"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon><Hearing color="primary" /></ListItemIcon>
          <ListItemText
            primary="Amplification"
            secondary="The middle ear provides about 25-30 dB of amplification, essential for hearing quiet sounds"
          />
        </ListItem>
      </List>
    </>
  );
};

export default HowHearingWorksStep;
