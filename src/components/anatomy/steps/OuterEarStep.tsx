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
  Box,
  useTheme,
  alpha
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

const outerEarImg = "";

const OuterEarStep: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <Typography paragraph>
        The outer ear is the part we can see, also known as the auricle or pinna. It includes the visible cartilage and skin,
        as well as the ear canal (external auditory canal) that leads to the eardrum.
      </Typography>
      <Card sx={{ mb: 2 }}>
        <CardMedia
          component="img"
          height="250"
          image={outerEarImg}
          alt="Outer Ear Anatomy"
          loading="lazy"
          sx={{
            objectFit: 'contain',
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#f5f5f5'
          }}
        />
        <CardContent>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Components of the Outer Ear:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <NavigateNext color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Pinna (Auricle)"
                secondary="The visible part that collects sound waves and directs them into the ear canal"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NavigateNext color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="External Auditory Canal"
                secondary="A tube about 2.5 cm long that directs sound to the eardrum"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NavigateNext color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Cerumen (Earwax)"
                secondary="Protects the ear canal by trapping dust and repelling water"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <NavigateNext color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Tympanic Membrane (Eardrum)"
                secondary="The boundary between outer and middle ear; vibrates in response to sound waves"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <Typography paragraph>
        The outer ear plays a crucial role in localizing sound and collecting sound waves. The shape of the pinna helps determine
        the direction of sounds, particularly those coming from in front or behind.
      </Typography>

      {/* Pro Tip Box */}
      <Box sx={{
        p: 2,
        mb: 3,
        bgcolor: alpha(theme.palette.success.light, 0.1),
        border: `1px dashed ${theme.palette.success.main}`,
        borderRadius: 2
      }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="success.dark">
          Pro Tip: Pinna's Role in Sound Localization
        </Typography>
        <Typography variant="body2" paragraph>
          The unique shape of each person's pinna creates distinctive sound filtering patterns called "head-related transfer functions" (HRTFs).
          These patterns help your brain determine if a sound is coming from above, below, front, or back—directions that can't be
          distinguished by time or level differences between the ears alone.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Clinical Application:</strong> When fitting behind-the-ear hearing aids, preserving the natural acoustics of the
          pinna is important for maintaining directional hearing. This is why many hearing aid fittings now use "open" fittings
          or place the receiver directly in the ear canal to maintain the natural resonance characteristics of the outer ear.
        </Typography>
      </Box>
    </>
  );
};

export default OuterEarStep;
