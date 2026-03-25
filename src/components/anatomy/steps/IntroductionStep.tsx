import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Hearing, VolumeUp, Waves } from '@mui/icons-material';

const IntroductionStep: React.FC = () => (
  <>
    <Typography paragraph>
      The human ear is a remarkable organ that allows us to perceive sound from our environment.
      It is divided into three main sections: the outer ear, the middle ear, and the inner ear.
    </Typography>
    <Typography paragraph>
      In this tutorial, you'll learn about each part of the ear and how they work together
      to capture sound waves and convert them into electrical signals that our brain can interpret.
    </Typography>
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Key Functions of the Ear:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Hearing color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Sound Detection"
              secondary="Capturing sound waves from the environment"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <VolumeUp color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Sound Amplification"
              secondary="Increasing the energy of sound vibrations"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Waves color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Sound Transduction"
              secondary="Converting sound vibrations to electrical signals"
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  </>
);

export default IntroductionStep;
