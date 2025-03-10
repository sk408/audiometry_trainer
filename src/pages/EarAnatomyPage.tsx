import React, { useState } from 'react';
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
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import {
  Hearing,
  NavigateNext,
  KeyboardArrowDown,
  VolumeUp,
  Waves,
  BrokenImage
} from '@mui/icons-material';

// Placeholder for actual images
const outerEarImg = "https://placeholder.com/ear-outer";
const middleEarImg = "https://placeholder.com/ear-middle";
const innerEarImg = "https://placeholder.com/ear-inner";
const soundWavesImg = "https://placeholder.com/sound-waves";
const hearingProcessImg = "https://placeholder.com/hearing-process";

const EarAnatomyPage: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Tutorial steps content for ear anatomy
  const steps = [
    {
      label: 'Introduction to Ear Anatomy',
      description: (
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
      ),
    },
    {
      label: 'The Outer Ear',
      description: (
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
        </>
      ),
    },
    {
      label: 'Landmarks of the Pinna for Hearing Aid Fitting',
      description: (
        <>
          <Typography paragraph>
            Understanding the specific landmarks of the pinna (auricle) is essential for professionals 
            who fit hearing aids. These anatomical features serve as reference points for proper hearing aid 
            placement, ensuring comfort and optimal sound delivery.
          </Typography>
          
          <Typography paragraph>
            Below, we'll describe each landmark in simple everyday terms, followed by the clinical description 
            that you'll need to know professionally.
          </Typography>
          
          <Card sx={{ mb: 2 }}>
            <CardMedia
              component="img"
              height="300"
              image={outerEarImg}
              alt="Pinna Landmarks"
              sx={{ 
                objectFit: 'contain', 
                p: 2, 
                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#f5f5f5' 
              }}
            />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Key Landmarks of the Pinna:
              </Typography>
              
              <Accordion 
                expanded={expanded === 'helix'} 
                onChange={handleAccordionChange('helix')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="helix-content"
                  id="helix-header"
                >
                  <Typography fontWeight="bold">Helix ("The Outer Rim")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The helix is the curved outer edge of your ear - like the rim of a cup. If you run your 
                        finger around the top and outer edge of your ear, you're tracing the helix.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        The outermost curved margin of the auricle, extending from the superior attachment 
                        of the ear to the termination of the cartilage at the lobule.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'antihelix'} 
                onChange={handleAccordionChange('antihelix')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="antihelix-content"
                  id="antihelix-header"
                >
                  <Typography fontWeight="bold">Antihelix ("The Inner Ridge")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The antihelix is the curved ridge that runs parallel to the outer rim, like a second 
                        smaller rim inside the first one. It forms a Y-shaped ridge in the middle of your ear.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        A Y-shaped cartilaginous ridge anterior and roughly parallel to the helix, 
                        separating the concha from the scapha and triangular fossa.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'tragus'} 
                onChange={handleAccordionChange('tragus')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="tragus-content"
                  id="tragus-header"
                >
                  <Typography fontWeight="bold">Tragus ("The Door Flap")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The tragus is the small flap-like projection just in front of your ear canal opening. 
                        It's the part that you push to close your ear when you don't want to hear something. 
                        Think of it as a partial "door" to your ear canal.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        A small, rounded cartilaginous projection anterior to the external auditory meatus, 
                        partially covering the entrance to the ear canal. Critical for behind-the-ear hearing 
                        aid placement and acoustic coupling.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'antitragus'} 
                onChange={handleAccordionChange('antitragus')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="antitragus-content"
                  id="antitragus-header"
                >
                  <Typography fontWeight="bold">Antitragus ("The Opposite Bump")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The antitragus is a small bump on the lower part of your ear, opposite to the tragus.
                        If the tragus is the "door" to your ear canal, the antitragus is like a doorstop on the 
                        other side.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        A small tubercle of cartilage opposite to the tragus, separated from it by the 
                        intertragic notch, marking the inferior boundary of the concha.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'concha'} 
                onChange={handleAccordionChange('concha')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="concha-content"
                  id="concha-header"
                >
                  <Typography fontWeight="bold">Concha ("The Bowl")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The concha is the deep bowl-shaped cavity in the center of your ear - like a seashell 
                        or soup bowl. It's the largest and deepest depression in your outer ear, funneling sound 
                        into your ear canal.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        A deep cavity of the external ear that leads to the external auditory meatus, 
                        bounded anteriorly by the tragus, posteriorly by the antihelix, and inferiorly 
                        by the antitragus. Key for in-the-ear hearing aid shell design.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'lobule'} 
                onChange={handleAccordionChange('lobule')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="lobule-content"
                  id="lobule-header"
                >
                  <Typography fontWeight="bold">Lobule ("The Earlobe")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The lobule is simply what most people call the "earlobe" - the soft, fleshy 
                        bottom part of your ear where earrings are typically worn. Unlike the rest of the 
                        external ear, it contains no cartilage.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        The soft, pendulous, non-cartilaginous portion at the inferior extremity of the 
                        auricle, composed of fatty tissue and skin. May serve as an anchor point for some 
                        hearing aid styles.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'crusofhelix'} 
                onChange={handleAccordionChange('crusofhelix')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="crusofhelix-content"
                  id="crusofhelix-header"
                >
                  <Typography fontWeight="bold">Crus of Helix ("The Diving Ridge")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The crus of helix is the point where the outer rim of your ear (helix) turns inward 
                        and dives into the middle of your ear, creating a horizontal ridge that divides the 
                        upper and lower parts of the bowl area.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        The anterior continuation of the helix that crosses the concha horizontally, 
                        dividing it into the cymba conchae superiorly and the cavum conchae inferiorly.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'cymbaconchae'} 
                onChange={handleAccordionChange('cymbaconchae')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="cymbaconchae-content"
                  id="cymbaconchae-header"
                >
                  <Typography fontWeight="bold">Cymba Conchae ("The Upper Bowl")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The cymba conchae is the smaller, upper portion of the bowl-like depression in your ear. 
                        It's the upper "pool" of the ear's bowl, located above the horizontal ridge (crus of helix).
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        The superior portion of the concha, above the crus of the helix, bounded by the 
                        antihelix posteriorly and the helix anteriorly. Important for receiver-in-canal 
                        hearing aid models.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'cavumconchae'} 
                onChange={handleAccordionChange('cavumconchae')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="cavumconchae-content"
                  id="cavumconchae-header"
                >
                  <Typography fontWeight="bold">Cavum Conchae ("The Lower Bowl")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The cavum conchae is the larger, lower portion of the bowl-like depression that leads 
                        directly to your ear canal. It's the main "funnel" part of your ear that captures 
                        sound and directs it inward.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        The lower and larger portion of the concha, below the crus of the helix, that 
                        directly leads to the external auditory meatus. Critical for in-the-ear hearing 
                        aid fitting and acoustic performance.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'meatus'} 
                onChange={handleAccordionChange('meatus')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="meatus-content"
                  id="meatus-header"
                >
                  <Typography fontWeight="bold">External Auditory Meatus ("The Ear Canal Opening")</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        The external auditory meatus is simply the opening of your ear canal - the entrance 
                        where sound travels into the canal toward your eardrum. It's like the doorway that 
                        connects the outer ear to the ear canal.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Clinical Description:
                      </Typography>
                      <Typography paragraph>
                        The aperture or opening of the external auditory canal, located at the depth of 
                        the concha. It forms the boundary between the external ear and the ear canal, and 
                        serves as a reference point for many hearing aid measurements.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 4, mb: 2 }}>
            How Pinna Anatomy Affects Hearing Aid Selection and Fitting
          </Typography>
          
          <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.light, 0.1) }}>
            <Typography paragraph>
              The unique anatomy of each person's pinna significantly impacts hearing aid selection, fitting, and performance.
              Understanding these relationships is crucial for successful hearing aid fitting.
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Concha Size and Depth
                  </Typography>
                  <Typography paragraph variant="body2">
                    <strong>Clinical Impact:</strong> The dimensions of the concha (both cymba and cavum) directly determine which 
                    hearing aid styles will fit comfortably.
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fitting Considerations:</strong>
                    <ul>
                      <li>A small, shallow concha may not accommodate larger in-the-ear (ITE) devices</li>
                      <li>A very deep concha may require a longer canal portion for custom hearing aids</li>
                      <li>Concha depth affects the placement of directional microphones in custom devices</li>
                      <li>For receiver-in-canal (RIC) hearing aids, concha size determines dome or mold selection</li>
                    </ul>
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Helix and Antihelix Prominence
                  </Typography>
                  <Typography paragraph variant="body2">
                    <strong>Clinical Impact:</strong> The prominence and shape of these cartilaginous ridges affect behind-the-ear (BTE) 
                    hearing aid stability and comfort.
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fitting Considerations:</strong>
                    <ul>
                      <li>A flat or minimally defined antihelix may provide less retention for BTE devices</li>
                      <li>A prominent helix creates a deeper pocket behind the ear for BTE placement</li>
                      <li>The angle between the helix and skull impacts tubing/wire routing comfort</li>
                      <li>For open-fit devices, a tight helix-to-head spacing may cause irritation from sound tubing</li>
                    </ul>
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Tragus Size and Position
                  </Typography>
                  <Typography paragraph variant="body2">
                    <strong>Clinical Impact:</strong> The tragus configuration affects retention of custom devices and insertion/removal ease.
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fitting Considerations:</strong>
                    <ul>
                      <li>A large, protruding tragus may interfere with insertion of larger custom devices</li>
                      <li>A small or flat tragus provides less retention for in-the-canal (ITC) devices</li>
                      <li>Tragus position relative to the ear canal opening impacts acoustic seal</li>
                      <li>For BTE aids, tragus shape impacts earmold/dome insertion angle</li>
                    </ul>
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    External Auditory Meatus Orientation
                  </Typography>
                  <Typography paragraph variant="body2">
                    <strong>Clinical Impact:</strong> The angle, size, and shape of the ear canal opening dictates custom shell design and acoustic performance.
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fitting Considerations:</strong>
                    <ul>
                      <li>A narrow meatus may limit the size of components in custom devices</li>
                      <li>The angle of the canal entrance affects directional microphone placement</li>
                      <li>For CIC devices, meatus orientation determines insertion/removal direction</li>
                      <li>The first bend of the canal (just past the meatus) impacts shell comfort</li>
                    </ul>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Special Anatomical Considerations:
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="error">
                    Exostoses and Osteomas
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    Bony growths in the ear canal that can narrow the pathway. These require special shell modifications 
                    or may contraindicate deeper-fitting devices. Often seen in people with frequent cold water exposure.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="error">
                    Collapsing Canals
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    Some ear canals collapse when the jaw opens or when pressure is applied. This requires modified 
                    impression techniques (open-mouth impressions) and may necessitate a canal lock feature in the shell design.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="error">
                    Stenotic Ear Canals
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    Abnormally narrow ear canals (congenital or acquired) may preclude the use of standard hearing aid designs 
                    and require specially-engineered ultra-slim devices or bone conduction alternatives.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), p: 2, borderRadius: 1, border: `1px solid ${theme.palette.warning.main}` }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Clinical Decision-Making Process:
              </Typography>
              <Typography variant="body2">
                <ol>
                  <li><strong>Evaluate Pinna Anatomy:</strong> Carefully examine and document all relevant anatomical features</li>
                  <li><strong>Consider Patient Factors:</strong> Manual dexterity, vision, lifestyle needs, and cosmetic preferences</li>
                  <li><strong>Match to Technology:</strong> Select appropriate hearing aid style based on anatomical compatibility and audiological needs</li>
                  <li><strong>Impression Technique:</strong> Modify impression method based on anatomical variations (open jaw, tragus pressure, etc.)</li>
                  <li><strong>Shell Modifications:</strong> Request specific modification to shells based on anatomical findings (e.g., pressure relief, canal locks)</li>
                  <li><strong>Verification:</strong> Confirm physical fit and acoustic performance before finalizing</li>
                </ol>
              </Typography>
            </Box>
          </Paper>

          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Importance for Hearing Aid Fitting:
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
                  Custom Hearing Aid Impressions
                </Typography>
                <Typography variant="body2">
                  When taking ear impressions for custom hearing aids, audiologists use these landmarks as reference points. 
                  The impression material should capture the concha, tragus, and antitragus accurately to ensure proper fit.
                  For deep canal fittings, the second bend of the ear canal must be captured, which is located beyond the aperture
                  of the external auditory meatus.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
                  Behind-the-Ear (BTE) Hearing Aids
                </Typography>
                <Typography variant="body2">
                  For BTE models, the hearing aid sits behind the auricle with the sound tube running over the top of the ear
                  between the helix and the head, down to the concha, and into the ear canal via an earmold or dome.
                  The tragus and crus of helix serve as key landmarks for proper tubing placement.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
                  In-the-Ear (ITE) Hearing Aids
                </Typography>
                <Typography variant="body2">
                  ITE hearing aids fill the concha and outer portion of the ear canal. Their shell is custom-made
                  based on an ear impression that uses the concha, antihelix, and tragus as boundaries. The precise
                  modeling of these landmarks ensures a secure fit without pressure points.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary">
                  Completely-in-Canal (CIC) Hearing Aids
                </Typography>
                <Typography variant="body2">
                  CIC devices sit deep in the ear canal, with only a small extraction handle visible in the concha.
                  The external auditory meatus and cavum conchae dimensions determine how deep the aid can be placed,
                  while the second bend of the canal limits insertion depth. Accurate mapping of these structures
                  is essential for comfortable all-day wear.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Typography paragraph>
            When fitting hearing aids, professionals must evaluate the shape, size, and unique characteristics of these landmarks
            for each patient. Anatomical variations can significantly impact which hearing aid style will provide the best 
            fit, comfort, and acoustic performance for an individual.
          </Typography>
          
          <Typography paragraph sx={{ fontStyle: 'italic' }}>
            Pro Tip: A helpful way to remember these landmarks is to think of the ear as a landscape: the helix is the 
            outer mountain range, the antihelix is the inner mountain range, the concha is the valley between them, 
            the tragus and antitragus are the gatekeepers to the tunnel (ear canal), and the lobule is the soft 
            plains below.
          </Typography>
        </>
      ),
    },
    {
      label: 'The Middle Ear',
      description: (
        <>
          <Typography paragraph>
            The middle ear is an air-filled cavity that houses three tiny bones called ossicles. These bones form a chain 
            that transmits sound vibrations from the eardrum to the inner ear, converting acoustic energy in air to 
            mechanical energy and then to fluid-based energy.
          </Typography>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2, mb: 2 }}>
            Middle Ear Components and Their Functions
          </Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="250"
              image={middleEarImg}
              alt="Middle Ear Anatomy"
              sx={{ 
                objectFit: 'contain', 
                p: 2, 
                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#f5f5f5' 
              }}
            />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Key Structures of the Middle Ear:
              </Typography>
              
              <Accordion 
                expanded={expanded === 'tympanic-membrane'} 
                onChange={handleAccordionChange('tympanic-membrane')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="tympanic-membrane-content"
                  id="tympanic-membrane-header"
                >
                  <Typography fontWeight="bold">Tympanic Membrane (Eardrum)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography>
                        The eardrum is like the head of a drum - a thin membrane that vibrates when sound hits it. 
                        It's the boundary between your outer and middle ear.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Function:
                      </Typography>
                      <Typography>
                        Converts sound waves (air pressure variations) into mechanical vibrations. 
                        It's approximately 17-20 times larger than the oval window, which helps amplify the force 
                        of vibrations as they travel to the inner ear.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Energy Transformation:
                      </Typography>
                      <Typography>
                        <strong>Input:</strong> Acoustic energy (sound waves in air)<br />
                        <strong>Output:</strong> Mechanical energy (vibrations of solid structures)
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'ossicles'} 
                onChange={handleAccordionChange('ossicles')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="ossicles-content"
                  id="ossicles-header"
                >
                  <Typography fontWeight="bold">Ossicular Chain (Malleus, Incus, Stapes)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography paragraph>
                        Three tiny connected bones that form a bridge across the middle ear. Their names describe their shapes:
                        <ul>
                          <li><strong>Malleus (hammer)</strong> - attached to the eardrum</li>
                          <li><strong>Incus (anvil)</strong> - the middle bone</li>
                          <li><strong>Stapes (stirrup)</strong> - connects to the inner ear</li>
                        </ul>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Function:
                      </Typography>
                      <Typography>
                        Acts as a lever system that amplifies the force of eardrum vibrations by about 1.3 times. 
                        Combined with the area difference between the eardrum and oval window, this creates a 
                        pressure gain of approximately 22 times (about 27 dB), essential for matching impedance between 
                        air and fluid media.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Energy Transformation:
                      </Typography>
                      <Typography>
                        <strong>Input:</strong> Mechanical energy from eardrum<br />
                        <strong>Output:</strong> Amplified mechanical energy to oval window
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'tympanic-cavity'} 
                onChange={handleAccordionChange('tympanic-cavity')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="tympanic-cavity-content"
                  id="tympanic-cavity-header"
                >
                  <Typography fontWeight="bold">Tympanic Cavity (Middle Ear Cavity)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography>
                        An air-filled space like a small room that houses the ossicles. It's separated from the 
                        outer ear by the eardrum and from the inner ear by the oval and round windows.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Function:
                      </Typography>
                      <Typography>
                        Maintains an air-filled environment necessary for proper ossicle movement. 
                        It must be at atmospheric pressure for optimal sound transmission, which is why pressure 
                        equalization through the Eustachian tube is essential.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Energy Relevance:
                      </Typography>
                      <Typography>
                        The air in this cavity provides low resistance to ossicle movement, allowing efficient 
                        energy transfer from the eardrum to the inner ear.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'eustachian-tube'} 
                onChange={handleAccordionChange('eustachian-tube')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="eustachian-tube-content"
                  id="eustachian-tube-header"
                >
                  <Typography fontWeight="bold">Eustachian Tube</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography>
                        A narrow channel that connects the middle ear to the back of the throat (nasopharynx). 
                        It's like a pressure-release valve that opens when you yawn, swallow, or chew.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Function:
                      </Typography>
                      <Typography>
                        Equalizes air pressure between the middle ear and the atmosphere. Also drains 
                        fluid from the middle ear into the throat and protects the middle ear from 
                        nasopharyngeal secretions and sound pressure.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Energy Relevance:
                      </Typography>
                      <Typography>
                        When middle ear pressure differs from atmospheric pressure, the resulting eardrum tension 
                        reduces its ability to vibrate, causing temporary hearing loss (like during airplane ascent 
                        or descent).
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'oval-window'} 
                onChange={handleAccordionChange('oval-window')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="oval-window-content"
                  id="oval-window-header"
                >
                  <Typography fontWeight="bold">Oval Window</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography>
                        A small, membrane-covered opening between the middle and inner ear where the stapes 
                        (the final ossicle) attaches. Like a doorway from the middle ear to the inner ear.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Function:
                      </Typography>
                      <Typography>
                        Transmits vibrations from the stapes to the fluid (perilymph) in the cochlea. 
                        Its smaller surface area compared to the eardrum concentrates force, which 
                        is necessary to overcome the higher resistance of fluid compared to air.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Energy Transformation:
                      </Typography>
                      <Typography>
                        <strong>Input:</strong> Mechanical energy from stapes movement<br />
                        <strong>Output:</strong> Fluid pressure waves in the inner ear
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'round-window'} 
                onChange={handleAccordionChange('round-window')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="round-window-content"
                  id="round-window-header"
                >
                  <Typography fontWeight="bold">Round Window</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography>
                        A second, flexible membrane-covered opening between the middle and inner ear. 
                        Works like a pressure-release valve for the inner ear.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Function:
                      </Typography>
                      <Typography>
                        Bulges outward into the middle ear when the stapes pushes in at the oval window, 
                        allowing fluid movement within the cochlea. Without this "release valve," the 
                        incompressible fluid in the inner ear couldn't move, and no sound would be perceived.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Energy Relevance:
                      </Typography>
                      <Typography>
                        Allows the release of pressure energy in the inner ear system, completing the 
                        circuit of energy flow through the cochlea.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion 
                expanded={expanded === 'middle-ear-muscles'} 
                onChange={handleAccordionChange('middle-ear-muscles')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="middle-ear-muscles-content"
                  id="middle-ear-muscles-header"
                >
                  <Typography fontWeight="bold">Middle Ear Muscles (Stapedius & Tensor Tympani)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        In Simple Terms:
                      </Typography>
                      <Typography>
                        Two tiny muscles in the middle ear that act like shock absorbers for loud sounds.
                        The stapedius attaches to the stapes, while the tensor tympani attaches to the malleus.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Function:
                      </Typography>
                      <Typography>
                        Contract reflexively in response to loud sounds (85+ dB), reducing the transmission of 
                        vibrations to the inner ear. This acoustic reflex provides some protection against 
                        sudden loud noises and reduces the masking effect of low-frequency background noise.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Energy Relevance:
                      </Typography>
                      <Typography>
                        Attenuate (reduce) energy transmission by stiffening the ossicular chain, 
                        primarily affecting lower frequencies below 1000 Hz. This attenuation is typically 
                        10-15 dB but can reach up to 30 dB in some individuals.
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 4, mb: 2 }}>
            Energy Transmission in the Middle Ear
          </Typography>
          
          <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Impedance Matching: The Critical Function of the Middle Ear
            </Typography>
            
            <Typography paragraph>
              The primary role of the middle ear is to solve a critical physics problem: 
              sound waves travel easily in air but are mostly reflected when they hit fluid (like in the cochlea).
              This is called an <strong>impedance mismatch</strong>.
            </Typography>
            
            <Box sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                The Middle Ear Solves This Problem Through:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                    <Typography fontWeight="bold" gutterBottom>Area Ratio</Typography>
                    <Typography variant="body2">
                      The eardrum's surface area is about 17-20 times larger than the oval window. 
                      This concentrates the force from sound waves onto the smaller window, 
                      increasing pressure by the same factor.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                    <Typography fontWeight="bold" gutterBottom>Lever Action</Typography>
                    <Typography variant="body2">
                      The ossicles form a lever system that multiplies force by approximately 1.3 times. 
                      The malleus arm is longer than the incus arm, creating this mechanical advantage.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                    <Typography fontWeight="bold" gutterBottom>Combined Effect</Typography>
                    <Typography variant="body2">
                      Together, these mechanisms provide about 22x amplification (approximately 27 dB gain), 
                      enough to overcome most of the impedance mismatch between air and fluid.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Energy Flow Sequence:
            </Typography>
            
            <Box sx={{ p: 2, mb: 2 }}>
              <ol>
                <li><strong>Acoustic Energy</strong> (air pressure waves) strikes the tympanic membrane</li>
                <li><strong>Mechanical Energy</strong> (solid vibrations) travels through the ossicular chain</li>
                <li><strong>Hydraulic Energy</strong> (fluid waves) is created in the cochlear fluids</li>
                <li>The round window bulges outward, allowing the energy to complete its path</li>
              </ol>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="warning.main">
              Clinical Significance:
            </Typography>
            <Typography paragraph>
              Disruptions to this energy transmission pathway result in conductive hearing loss. The better you understand 
              this energy transfer system, the better you'll be able to interpret audiometric findings and understand 
              treatment options for middle ear disorders.
            </Typography>
          </Paper>
          
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 4, mb: 2 }}>
            Middle Ear Pathologies and Their Audiometric Presentations
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: theme.palette.error.main, p: 2 }}>
                  <Typography variant="h6" color="white">Otitis Media</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description:
                  </Typography>
                  <Typography paragraph variant="body2">
                    Inflammation of the middle ear, often with fluid accumulation. Can be acute (short duration) or
                    chronic (persistent). Common in children due to their shorter, more horizontal Eustachian tubes.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Effect on Hearing:
                  </Typography>
                  <Typography paragraph variant="body2">
                    Fluid in the middle ear dampens ossicle movement and increases mass, reducing vibration efficiency.
                    The result is reduced energy transfer to the inner ear, particularly at higher frequencies.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Audiometric Presentation:
                  </Typography>
                  <Typography variant="body2">
                    <ul>
                      <li>Mild to moderate conductive hearing loss (20-40 dB)</li>
                      <li>Air-bone gap across frequencies (bone conduction normal, air conduction reduced)</li>
                      <li>Type B tympanogram (flat, with reduced compliance)</li>
                      <li>Absent acoustic reflexes</li>
                    </ul>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: theme.palette.error.main, p: 2 }}>
                  <Typography variant="h6" color="white">Otosclerosis</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description:
                  </Typography>
                  <Typography paragraph variant="body2">
                    Abnormal bone growth in the middle ear, typically around the stapes footplate, causing it to become 
                    fixed or "frozen" in the oval window. Hereditary condition most common in Caucasian women.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Effect on Hearing:
                  </Typography>
                  <Typography paragraph variant="body2">
                    The fixed stapes cannot efficiently transmit vibrations to the inner ear. As the condition progresses,
                    it may also affect inner ear function (cochlear otosclerosis).
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Audiometric Presentation:
                  </Typography>
                  <Typography variant="body2">
                    <ul>
                      <li>Progressive conductive hearing loss, often bilateral but asymmetric</li>
                      <li>Characteristic "Carhart's notch" - bone conduction dip around 2000 Hz</li>
                      <li>Type A tympanogram (normal middle ear pressure and compliance)</li>
                      <li>Absent acoustic reflexes</li>
                      <li>Better hearing in noisy environments (paracusis willisii)</li>
                    </ul>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: theme.palette.error.main, p: 2 }}>
                  <Typography variant="h6" color="white">Tympanic Membrane Perforation</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description:
                  </Typography>
                  <Typography paragraph variant="body2">
                    A hole or rupture in the eardrum, caused by infections, trauma, or sudden pressure changes 
                    (barotrauma). Size and location of the perforation affect hearing impact.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Effect on Hearing:
                  </Typography>
                  <Typography paragraph variant="body2">
                    Reduces the effective surface area of the eardrum, diminishing its ability to capture sound energy.
                    Also allows sound to bypass the ossicular chain, reducing the middle ear's amplification effect.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Audiometric Presentation:
                  </Typography>
                  <Typography variant="body2">
                    <ul>
                      <li>Mild to moderate conductive hearing loss (usually 20-30 dB)</li>
                      <li>Greater hearing loss at lower frequencies if perforation is large</li>
                      <li>Type B tympanogram with high physical volume measurement</li>
                      <li>Acoustic reflex absent on affected side</li>
                    </ul>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: theme.palette.error.main, p: 2 }}>
                  <Typography variant="h6" color="white">Ossicular Discontinuity</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description:
                  </Typography>
                  <Typography paragraph variant="body2">
                    Disruption of the ossicular chain, most commonly separation of the incus from the stapes.
                    Usually caused by trauma, chronic infection, or cholesteatoma.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Effect on Hearing:
                  </Typography>
                  <Typography paragraph variant="body2">
                    Breaks the mechanical link between the tympanic membrane and the oval window, 
                    preventing efficient transfer of energy to the inner ear.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Audiometric Presentation:
                  </Typography>
                  <Typography variant="body2">
                    <ul>
                      <li>Moderate to severe conductive hearing loss (40-60 dB)</li>
                      <li>Large air-bone gap across all frequencies</li>
                      <li>Type A tympanogram (sometimes with increased compliance)</li>
                      <li>Acoustic reflex absent</li>
                    </ul>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), p: 3, borderRadius: 1, border: `1px solid ${theme.palette.warning.main}`, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Audiometric Tests for Middle Ear Function:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Pure Tone Audiometry
                </Typography>
                <Typography variant="body2">
                  Measures both air conduction (AC) and bone conduction (BC) thresholds. Middle ear disorders 
                  typically show an air-bone gap where AC thresholds are elevated but BC remains normal. This gap 
                  represents the magnitude of conductive hearing loss.
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Tympanometry
                </Typography>
                <Typography variant="body2">
                  Measures eardrum mobility and middle ear pressure. Different pathologies create characteristic 
                  tympanogram patterns:
                  <ul>
                    <li>Type A: Normal</li>
                    <li>Type B: Flat (fluid, perforation)</li>
                    <li>Type C: Negative pressure (Eustachian tube dysfunction)</li>
                    <li>Type Ad: Hypermobile (ossicular discontinuity)</li>
                    <li>Type As: Stiff (otosclerosis, adhesions)</li>
                  </ul>
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Acoustic Reflex Testing
                </Typography>
                <Typography variant="body2">
                  Measures the contraction of middle ear muscles in response to loud sounds. Middle ear pathologies often 
                  show absent reflexes or abnormal decay patterns. Helps distinguish between conductive, sensorineural, 
                  and retrocochlear disorders.
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Typography paragraph sx={{ fontStyle: 'italic' }}>
            Pro Tip: Remember that middle ear disorders typically affect lower frequencies as much as or more than 
            higher frequencies, creating a relatively flat hearing loss pattern. This contrasts with most sensorineural
            hearing losses, which tend to affect high frequencies more severely.
          </Typography>
        </>
      ),
    },
    {
      label: 'The Inner Ear',
      description: (
        <>
          <Typography paragraph>
            The inner ear is a complex system of fluid-filled chambers and tubes. It contains the sensory organs 
            for both hearing (cochlea) and balance (vestibular system). This sophisticated structure is responsible 
            for transducing mechanical energy into electrical signals that can be interpreted by the brain.
          </Typography>
          <Card sx={{ mb: 2 }}>
            <CardMedia
              component="img"
              height="250"
              image={innerEarImg}
              alt="Inner Ear Anatomy"
              sx={{ 
                objectFit: 'contain', 
                p: 2, 
                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#f5f5f5' 
              }}
            />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Components of the Inner Ear:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cochlea" 
                    secondary="Snail-shaped organ responsible for converting sound vibrations into electrical signals" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Organ of Corti" 
                    secondary="Contains hair cells that detect movement in the cochlear fluid" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hair Cells" 
                    secondary="Specialized cells with stereocilia that convert mechanical motion to neural signals" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Vestibular Labyrinth" 
                    secondary="System responsible for balance and spatial orientation" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Semicircular Canals" 
                    secondary="Three loop-shaped tubes that detect rotational movements of the head" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Vestibule" 
                    secondary="Contains the utricle and saccule, which detect linear acceleration and head position" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Auditory Nerve" 
                    secondary="Cranial nerve VIII (vestibulocochlear nerve) that transmits signals to the brain" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-cochlea-content"
              id="panel-cochlea-header"
            >
              <Typography fontWeight="bold">The Cochlea: Detailed Structure and Function</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                The cochlea is the primary auditory portion of the inner ear. This spiral-shaped structure contains 
                three fluid-filled compartments (scalae):
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Scala Vestibuli" 
                    secondary="Upper chamber filled with perilymph fluid; connected to the oval window" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Scala Media (Cochlear Duct)" 
                    secondary="Middle chamber filled with endolymph fluid; contains the organ of Corti" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Scala Tympani" 
                    secondary="Lower chamber filled with perilymph fluid; connected to the round window" 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                <strong>Energy Transmission:</strong> The cochlea converts mechanical energy (fluid waves) into 
                electrical energy (neural impulses).
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Input Energy" 
                    secondary="Mechanical vibrations from the stapes at the oval window" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Transmission Medium" 
                    secondary="Fluid waves in perilymph and endolymph" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Processing Structure" 
                    secondary="Basilar membrane and hair cells in the organ of Corti" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Output Energy" 
                    secondary="Electrochemical signals in the auditory nerve" 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                <strong>Tonotopic Organization:</strong> The basilar membrane varies in width and stiffness along 
                its length, creating a frequency-specific response pattern:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Base of Cochlea (near oval window)" 
                    secondary="Narrow and stiff; responds best to high-frequency sounds (20,000 Hz)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Middle of Cochlea" 
                    secondary="Responds best to mid-frequency sounds (1,000-3,000 Hz)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Apex of Cochlea" 
                    secondary="Wide and flexible; responds best to low-frequency sounds (20 Hz)" 
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-organ-of-corti-content"
              id="panel-organ-of-corti-header"
            >
              <Typography fontWeight="bold">The Organ of Corti: The Sensory Transducer</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                The organ of Corti rests on the basilar membrane within the scala media and contains the 
                essential auditory sensory cells.
              </Typography>
              <Typography paragraph>
                <strong>Hair Cell Types and Functions:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Inner Hair Cells (IHCs)" 
                    secondary="About 3,500 cells arranged in a single row; primary sensory receptors that transmit ~95% of auditory information to the brain" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Outer Hair Cells (OHCs)" 
                    secondary="About 12,000 cells arranged in three rows; function as mechanical amplifiers that enhance frequency selectivity and sensitivity" 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                <strong>Stereocilia Mechanics:</strong> Each hair cell has stereocilia (hair-like projections) arranged in rows of increasing height.
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Tip Links" 
                    secondary="Protein filaments connecting adjacent stereocilia" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mechanotransduction Channels" 
                    secondary="Ion channels that open when stereocilia bend in the direction of the tallest row" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Endolymph Composition" 
                    secondary="High potassium, low sodium concentration; creates a +80mV potential (the endocochlear potential)" 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                <strong>Cochlear Amplifier:</strong> Outer hair cells can contract and expand in response to electrical stimulation 
                (electromotility), actively amplifying basilar membrane motion by up to 40-60 dB.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-vestibular-content"
              id="panel-vestibular-header"
            >
              <Typography fontWeight="bold">The Vestibular System: Balance and Spatial Orientation</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                The vestibular system works alongside the cochlea within the inner ear and is responsible for 
                our sense of balance and spatial orientation.
              </Typography>
              <Typography paragraph>
                <strong>Key Components:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Semicircular Canals" 
                    secondary="Three orthogonal tubes that detect rotational acceleration (angular movement)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Ampullae" 
                    secondary="Bulbous enlargements at the base of each semicircular canal containing the crista ampullaris" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Utricle and Saccule" 
                    secondary="Otolithic organs that detect linear acceleration and head position relative to gravity" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Macula" 
                    secondary="Sensory epithelium in the utricle and saccule containing hair cells" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Otoliths" 
                    secondary="Calcium carbonate crystals embedded in a gelatinous matrix atop the macula" 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                <strong>Energy Transformation:</strong> Similar to the cochlea, the vestibular system converts 
                mechanical energy (fluid movement) into electrical signals (neural impulses).
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-auditory-pathway-content"
              id="panel-auditory-pathway-header"
            >
              <Typography fontWeight="bold">Auditory Neural Pathway</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.info.light, 0.15), borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="info.dark">
                  Advanced Content - Outside the Scope of Basic Hearing Aid Fittings
                </Typography>
                <Typography variant="body2">
                  This section covers advanced neuroanatomy of the auditory system. While fascinating, this level of detail is not required for performing standard hearing aid fittings. It is provided for those interested in a deeper understanding of auditory processing.
                </Typography>
              </Paper>
              
              <Typography paragraph>
                The neural pathway for hearing transmits signals from the cochlea to the auditory cortex in the brain.
                This complex pathway involves multiple processing stations that progressively extract and analyze different 
                aspects of sound information.
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Signal Initiation: From Mechanical to Neural
              </Typography>
              <Typography paragraph>
                The auditory neural pathway begins with the transduction of mechanical energy into electrochemical signals:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hair Cell Synapses" 
                    secondary="When stereocilia bend, mechanically-gated ion channels open, allowing potassium (K+) to flow into the cell. This depolarizes the hair cell, causing calcium (Ca2+) channels to open at the base of the cell." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Neurotransmitter Release" 
                    secondary="Calcium influx triggers the release of glutamate neurotransmitter from the base of inner hair cells onto the dendrites of auditory nerve fibers." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Afferent Signaling" 
                    secondary="Inner hair cells form synapses with Type I spiral ganglion neurons (95% of auditory nerve fibers). Outer hair cells mainly connect with Type II spiral ganglion neurons (5% of fibers)." 
                  />
                </ListItem>
              </List>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                First-Order Neurons: Spiral Ganglion to Cochlear Nucleus
              </Typography>
              <Typography paragraph>
                The cell bodies of the first-order neurons are located in the spiral ganglion within the modiolus of the cochlea:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Spiral Ganglion" 
                    secondary="Contains approximately 30,000-35,000 bipolar neurons with peripheral processes extending to hair cells and central processes forming the cochlear nerve." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Tonotopic Organization" 
                    secondary="Maintains a precise frequency organization; neurons from the cochlear base (high frequencies) are positioned on the periphery of the nerve, while those from the apex (low frequencies) are centrally located." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Signal Characteristics" 
                    secondary="Each fiber has a characteristic frequency (CF) to which it is most sensitive, preserving frequency information. Fibers also encode intensity through firing rate and timing information through phase-locking to sound waves (up to ~4000 Hz)." 
                  />
                </ListItem>
              </List>

              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Brainstem Processing: Cochlear Nucleus
              </Typography>
              <Typography paragraph>
                The cochlear nucleus is the first processing center in the central auditory system where significant signal analysis begins:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Subdivisions" 
                    secondary="Divided into dorsal cochlear nucleus (DCN), anteroventral cochlear nucleus (AVCN), and posteroventral cochlear nucleus (PVCN), each with specialized functions." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cell Types and Processing" 
                    secondary="Contains diverse cell types that extract different features of sound:" 
                  />
                </ListItem>
              </List>
              <List dense sx={{ pl: 4 }}>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Bushy Cells (AVCN)" 
                    secondary="Preserve timing information critical for sound localization; form 'endbulb of Held' synapses with auditory nerve fibers." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Stellate/Multipolar Cells" 
                    secondary="Encode the temporal envelope of sounds, important for speech perception." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Octopus Cells (PVCN)" 
                    secondary="Detect coincident activity across multiple auditory nerve fibers, specialized for precise timing." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fusiform Cells (DCN)" 
                    secondary="Integrate auditory and somatosensory information; may be involved in filtering out self-generated sounds." 
                  />
                </ListItem>
              </List>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Binaural Processing: Superior Olivary Complex
              </Typography>
              <Typography paragraph>
                The superior olivary complex (SOC) is the first site where inputs from both ears converge, 
                enabling sound localization:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Medial Superior Olive (MSO)" 
                    secondary="Specialized for detecting interaural time differences (ITDs) - the tiny time difference between when a sound reaches each ear. Primarily processes low-frequency sounds (<1500 Hz) and is crucial for localizing sounds on the horizontal plane." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Lateral Superior Olive (LSO)" 
                    secondary="Specialized for detecting interaural level differences (ILDs) - the difference in sound intensity between ears. Primarily processes high-frequency sounds (>1500 Hz) and works with the MSO for horizontal sound localization." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Medial Nucleus of the Trapezoid Body (MNTB)" 
                    secondary="Provides precisely timed inhibitory input to the LSO, creating the excitatory-inhibitory interaction necessary for ILD processing." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Efferent System" 
                    secondary="The superior olivary complex also contains the cell bodies of the olivocochlear bundle, which provides feedback to the cochlea, modulating outer hair cell function and protecting the ear from acoustic trauma." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Olivocochlear Bundle" 
                    secondary="Projections from superior olivary complex to the cochlea. The medial component regulates outer hair cell activity, while the lateral component modulates inner hair cell output." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Protective Mechanisms" 
                    secondary="These efferent pathways are essential for protecting the auditory system from damage. Dysfunction in these protective systems may contribute to increased susceptibility to noise-induced hearing loss and could be a target for therapeutic interventions." 
                  />
                </ListItem>
              </List>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Protective Role of the Efferent System Against Acoustic Trauma
              </Typography>
              <Typography paragraph>
                The efferent auditory system plays a crucial protective role against damaging sounds:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Olivocochlear Reflex" 
                    secondary="When exposed to loud sounds, the medial olivocochlear (MOC) neurons are activated and release acetylcholine onto outer hair cells. This hyperpolarizes the cells and reduces their motility, decreasing the amplification of loud sounds and preventing damage." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Middle Ear Muscle Reflex" 
                    secondary="The efferent system coordinates with the acoustic reflex, which contracts the stapedius muscle to stiffen the ossicular chain and reduce sound transmission to the inner ear during exposure to loud sounds." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Anti-Excitotoxic Effects" 
                    secondary="By reducing glutamate release at inner hair cell synapses during intense stimulation, the lateral olivocochlear system helps prevent excitotoxic damage to auditory nerve fibers." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Noise Conditioning" 
                    secondary="Prior activation of the efferent system through moderate sound exposure can enhance its protective capability against subsequent intense noise exposure, potentially explaining why some individuals are more resistant to noise-induced hearing loss." 
                  />
                </ListItem>
              </List>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Integration and Relay: Nuclei of the Lateral Lemniscus and Inferior Colliculus
              </Typography>
              <Typography paragraph>
                As auditory information ascends, it undergoes further processing and integration:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Nuclei of the Lateral Lemniscus (NLL)" 
                    secondary="Process temporal patterns and may contribute to echo suppression and sound source segregation. The dorsal nucleus (DNLL) provides inhibitory projections that enhance sensitivity to moving sound sources." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Inferior Colliculus (IC)" 
                    secondary="A major integration center where nearly all ascending auditory pathways converge. Organized into functional zones:" 
                  />
                </ListItem>
              </List>
              <List dense sx={{ pl: 4 }}>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Central Nucleus" 
                    secondary="Maintains tonotopic organization and processes basic acoustic features." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="External Cortex" 
                    secondary="Integrates auditory information with other sensory modalities." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dorsal Cortex" 
                    secondary="Receives descending inputs from auditory cortex, forming part of a feedback loop." 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                The inferior colliculus extracts complex features of sounds, such as frequency modulations, 
                amplitude modulations, and duration - all critical for speech perception. It also plays a role in 
                reflexive responses to sound, such as the acoustic startle reflex.
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Thalamic Processing: Medial Geniculate Body
              </Typography>
              <Typography paragraph>
                The medial geniculate body (MGB) in the thalamus serves as the final subcortical relay station:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Subdivisions" 
                    secondary="Contains ventral, dorsal, and medial divisions, each with distinct connections and functions:" 
                  />
                </ListItem>
              </List>
              <List dense sx={{ pl: 4 }}>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Ventral Division" 
                    secondary="Primary auditory relay that maintains tonotopic organization and projects to primary auditory cortex." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dorsal Division" 
                    secondary="Processes complex sounds and connects with secondary auditory areas." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Medial Division" 
                    secondary="Multisensory integration area receiving somatosensory, visual, and auditory inputs." 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                The MGB is not simply a relay but actively shapes auditory information through:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Filtering" 
                    secondary="Can enhance or suppress specific features of the auditory signal based on attentional state." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Gating" 
                    secondary="Controls the flow of information to the cortex, influenced by arousal and attention." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Plasticity" 
                    secondary="Shows experience-dependent changes, contributing to auditory learning." 
                  />
                </ListItem>
              </List>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Cortical Processing: Auditory Cortex
              </Typography>
              <Typography paragraph>
                The auditory cortex is the final destination for conscious sound perception and interpretation:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Primary Auditory Cortex (A1)" 
                    secondary="Located in the superior temporal gyrus within the temporal lobe. Maintains tonotopic organization with neurons arranged by characteristic frequency. Processes basic sound properties like pitch, loudness, and timing." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Belt Areas" 
                    secondary="Surround A1 and process more complex sound features. Include anterior, lateral, and posterior belt regions." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Parabelt Regions" 
                    secondary="Higher-order processing areas that integrate auditory information with other sensory modalities and cognitive functions." 
                  />
                </ListItem>
              </List>
              
              <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Functional Specialization in Auditory Cortex
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Left Hemisphere
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Temporal resolution" 
                            secondary="Better at processing rapid temporal changes in sound." 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Speech and language" 
                            secondary="Specialized for processing linguistic aspects of speech (phonemes, syntax, semantics)." 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Wernicke's area" 
                            secondary="Critical for speech comprehension and language processing." 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Right Hemisphere
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Spectral resolution" 
                            secondary="Better at processing tonal qualities and pitch contours." 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Music processing" 
                            secondary="More involved in processing melody, harmony, and timbre." 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Prosody" 
                            secondary="Processes emotional and intonational aspects of speech." 
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Beyond Auditory Cortex: Higher Cognitive Processing
              </Typography>
              <Typography paragraph>
                Auditory information is integrated with other brain regions for higher-level processing:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Prefrontal Cortex" 
                    secondary="Involved in auditory attention, working memory, and decision-making based on auditory information." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Limbic System" 
                    secondary="Processes emotional content of sounds; the amygdala responds to threatening sounds and the hippocampus is involved in auditory memory formation." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Parietal Cortex" 
                    secondary="Integrates auditory information with spatial awareness and attention." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Motor Cortex" 
                    secondary="Links auditory input to motor responses, crucial for speech production and musical performance." 
                  />
                </ListItem>
              </List>
              
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
                Descending Auditory Pathways
              </Typography>
              <Typography paragraph>
                The auditory system includes extensive descending (efferent) connections that modify processing at lower levels:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Corticofugal System" 
                    secondary="Projections from auditory cortex to thalamus, inferior colliculus, and brainstem. Enhances processing of relevant sounds and suppresses irrelevant background noise." 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Olivocochlear Bundle" 
                    secondary="Projections from superior olivary complex to the cochlea. The medial component regulates outer hair cell activity, while the lateral component modulates inner hair cell output." 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                These descending pathways allow for dynamic, experience-dependent modulation of auditory processing, 
                enabling selective attention, noise suppression, and protection from acoustic trauma.
              </Typography>
              
              <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.success.light, 0.15), borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="success.dark" gutterBottom>
                  Clinical Relevance: Efferent Protection Against Noise-Induced Hearing Loss
                </Typography>
                <Typography paragraph>
                  The efferent system's protective role has significant clinical implications:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <NavigateNext color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Time-Limited Protection" 
                      secondary="The olivocochlear reflex can only provide protection for limited durations. Prolonged noise exposure eventually overwhelms this mechanism, leading to permanent damage." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <NavigateNext color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Individual Variation" 
                      secondary="Strength of efferent protection varies between individuals, potentially explaining different susceptibilities to noise-induced hearing loss despite similar exposures." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <NavigateNext color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Therapeutic Potential" 
                      secondary="Research is exploring ways to enhance efferent system function as a preventative measure against hearing loss in high-risk populations." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <NavigateNext color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Relevance to Hearing Aids" 
                      secondary="Hearing aid fittings should consider preserving the user's remaining efferent function by avoiding over-amplification that could overwhelm these protective mechanisms." 
                    />
                  </ListItem>
                </List>
              </Paper>
              
              <Typography paragraph sx={{ fontStyle: 'italic', mt: 2 }}>
                Pro Tip: Understanding the hierarchical organization of the auditory pathway helps explain why different 
                types of hearing disorders affect different aspects of hearing. For example, damage to the cochlea affects 
                basic sound detection, while damage to auditory cortex may preserve basic hearing but impair speech comprehension 
                or sound localization.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
            Inner Ear Disorders and Corresponding Audiometric Patterns
          </Typography>
          
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-presbycusis-content"
              id="panel-presbycusis-header"
            >
              <Typography fontWeight="bold">Age-Related Hearing Loss (Presbycusis)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                A progressive sensorineural hearing loss associated with aging, typically affecting both ears equally.
              </Typography>
              <Typography paragraph>
                <strong>Pathophysiology:</strong> Gradual degeneration of sensory hair cells, particularly in the basal turn 
                of the cochlea (high-frequency region), and atrophy of the stria vascularis.
              </Typography>
              <Typography paragraph>
                <strong>Audiometric Pattern:</strong> Bilateral, symmetrical, high-frequency hearing loss with a characteristic 
                downward sloping pattern on the audiogram.
              </Typography>
              <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Distinctive Features on Hearing Tests:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pure Tone Audiometry" 
                        secondary="High-frequency hearing loss (sloping configuration), typically beginning at 4000 Hz and progressing to lower frequencies over time" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Speech Audiometry" 
                        secondary="Poor speech discrimination scores, disproportionate to the pure-tone average (PTA)" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tympanometry" 
                        secondary="Normal Type A tympanogram (indicating normal middle ear function)" 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-nihl-content"
              id="panel-nihl-header"
            >
              <Typography fontWeight="bold">Noise-Induced Hearing Loss (NIHL)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Hearing loss resulting from exposure to excessive sound levels that damage the hair cells in the cochlea.
              </Typography>
              <Typography paragraph>
                <strong>Pathophysiology:</strong> Mechanical trauma to the organ of Corti, with outer hair cells being more 
                vulnerable than inner hair cells. Initial damage occurs to hair cells that respond to 3000-6000 Hz.
              </Typography>
              <Typography paragraph>
                <strong>Audiometric Pattern:</strong> Classic "notch" at 4000 Hz in the audiogram, which may broaden with 
                continued exposure.
              </Typography>
              <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Distinctive Features on Hearing Tests:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pure Tone Audiometry" 
                        secondary="4000 Hz 'notch' with better hearing at 8000 Hz; with continued exposure, the notch broadens to affect adjacent frequencies" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Otoacoustic Emissions (OAEs)" 
                        secondary="Reduced or absent, indicating outer hair cell damage even before changes appear on the audiogram" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Speech Audiometry" 
                        secondary="Variable speech discrimination depending on the extent of damage" 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-meniere-content"
              id="panel-meniere-header"
            >
              <Typography fontWeight="bold">Ménière's Disease</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                A disorder of the inner ear characterized by episodic vertigo, fluctuating hearing loss, tinnitus, and aural fullness.
              </Typography>
              <Typography paragraph>
                <strong>Pathophysiology:</strong> Endolymphatic hydrops (excess fluid in the endolymphatic space of the cochlear duct), 
                leading to distortion of the basilar membrane and sensory structures.
              </Typography>
              <Typography paragraph>
                <strong>Audiometric Pattern:</strong> Fluctuating low-frequency sensorineural hearing loss in early stages, 
                progressing to flat or all-frequency loss in later stages.
              </Typography>
              <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Distinctive Features on Hearing Tests:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pure Tone Audiometry" 
                        secondary="Rising configuration (low-frequency hearing loss) that fluctuates between tests; later evolves to flat or sloping loss" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Speech Discrimination" 
                        secondary="Disproportionately poor word recognition compared to pure-tone thresholds" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Electrocochleography (ECochG)" 
                        secondary="Elevated summating potential/action potential (SP/AP) ratio, indicating endolymphatic hydrops" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Vestibular Testing" 
                        secondary="Abnormal vestibular function tests (caloric testing, VEMP, vHIT) on affected side" 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-ototoxicity-content"
              id="panel-ototoxicity-header"
            >
              <Typography fontWeight="bold">Ototoxicity</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Hearing or balance dysfunction resulting from exposure to medications or chemicals that damage the inner ear structures.
              </Typography>
              <Typography paragraph>
                <strong>Common Ototoxic Agents:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Aminoglycoside antibiotics" 
                    secondary="Gentamicin, tobramycin, amikacin, streptomycin" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Platinum-based chemotherapy drugs" 
                    secondary="Cisplatin, carboplatin" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Loop diuretics" 
                    secondary="Furosemide, ethacrynic acid" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Salicylates" 
                    secondary="High doses of aspirin" 
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                <strong>Pathophysiology:</strong> Direct damage to outer hair cells, typically beginning at the basal turn 
                of the cochlea (high-frequency region), followed by damage to inner hair cells with continued exposure.
              </Typography>
              <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Distinctive Features on Hearing Tests:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pure Tone Audiometry" 
                        secondary="Bilateral high-frequency hearing loss initially, progressing to involve mid and low frequencies with continued exposure" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="High-Frequency Audiometry" 
                        secondary="Early detection of hearing loss at extended high frequencies (>8000 Hz) before conventional frequencies are affected" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Otoacoustic Emissions" 
                        secondary="Reduced or absent, often before changes are detected on audiogram, making OAEs valuable for early monitoring" 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-ssnhl-content"
              id="panel-ssnhl-header"
            >
              <Typography fontWeight="bold">Sudden Sensorineural Hearing Loss (SSNHL)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Rapid onset of hearing loss, typically occurring within 72 hours, that affects the inner ear or auditory nerve.
              </Typography>
              <Typography paragraph>
                <strong>Potential Causes:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Viral infections" 
                    secondary="Herpes simplex, varicella zoster, cytomegalovirus" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Vascular events" 
                    secondary="Microcirculation disturbances in the cochlea" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Immune-mediated disorders" 
                    secondary="Autoimmune inner ear disease" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Perilymph fistula" 
                    secondary="Abnormal connection between middle and inner ear" 
                  />
                </ListItem>
              </List>
              <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Distinctive Features on Hearing Tests:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Pure Tone Audiometry" 
                        secondary="Various patterns possible: flat, ascending, descending, or U-shaped configuration; defined as ≥30 dB loss in 3 consecutive frequencies" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Speech Audiometry" 
                        secondary="Speech discrimination scores often markedly reduced compared to pure-tone thresholds" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Acoustic Reflexes" 
                        secondary="Often absent on affected side" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="ABR (Auditory Brainstem Response)" 
                        secondary="Normal waveform morphology with delay in absolute latencies corresponding to hearing loss" 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Typography paragraph>
                <strong>Clinical Significance:</strong> Considered a medical emergency. Early intervention with corticosteroids 
                within the first 1-2 weeks significantly improves recovery outcomes.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Typography paragraph>
            The cochlea contains a basilar membrane that vibrates in response to sound. Different frequencies cause 
            different parts of the membrane to vibrate more intensely, allowing us to distinguish between pitches.
            This is known as the tonotopic organization of the cochlea - a remarkable frequency analyzer built into our inner ear.
          </Typography>
          <Typography paragraph>
            The hair cells in the organ of Corti are incredibly sensitive and can be damaged by loud noises, leading to 
            noise-induced hearing loss. Unlike many other cells in the body, these hair cells do not regenerate once damaged,
            making hearing loss caused by cochlear damage permanent with current medical technology.
          </Typography>
          <Typography paragraph sx={{ fontStyle: 'italic', mt: 2 }}>
            Pro Tip: Inner ear disorders typically result in sensorineural hearing loss with poorer speech discrimination scores 
            than would be expected from the pure-tone thresholds alone. This disproportionate difficulty understanding speech, 
            especially in background noise, is a hallmark of cochlear pathology.
          </Typography>
          
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel-recruitment-content"
              id="panel-recruitment-header"
            >
              <Typography fontWeight="bold">Cochlear Characteristic Response and Recruitment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                An important concept for understanding hearing loss is the "characteristic response" of the cochlea and how it relates to a phenomenon called "recruitment."
              </Typography>
              
              <Card sx={{ mb: 3, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    What is a Characteristic Response?
                  </Typography>
                  <Typography paragraph>
                    In simple terms, a characteristic response is how a specific part of the cochlea responds to sound at different frequencies and intensities:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Location Specificity" 
                        secondary="Each area along the basilar membrane responds best (is 'tuned') to a specific frequency - this is its 'characteristic frequency'." 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Response Curve" 
                        secondary="For each location, there's a relationship between sound intensity (how loud it is) and the response magnitude (how strongly the hair cells respond). This relationship forms a curve." 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Amplification" 
                        secondary="In a healthy ear, outer hair cells provide amplification for soft sounds, making the response curve non-linear - small increases in soft sounds produce large increases in response." 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        The Healthy Cochlea
                      </Typography>
                      <Typography paragraph>
                        In a healthy ear, the response curve has these key properties:
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Wide Dynamic Range" 
                            secondary="Can process sounds from very quiet to very loud (about 120 dB range)" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Sensitivity to Soft Sounds" 
                            secondary="Can detect very faint sounds thanks to outer hair cell amplification" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Compression at High Intensities" 
                            secondary="Reduces sensitivity as sounds get louder to protect from damage and prevent overloading" 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        The Damaged Cochlea
                      </Typography>
                      <Typography paragraph>
                        With cochlear damage (especially to outer hair cells), the response curve changes:
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Reduced Sensitivity" 
                            secondary="Soft sounds are no longer amplified, raising the threshold of hearing" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Narrowed Dynamic Range" 
                            secondary="The range between barely audible and uncomfortably loud becomes smaller" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="More Linear Response" 
                            secondary="The special amplification for soft sounds is lost, making the response more straightforward (linear)" 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                Understanding Recruitment
              </Typography>
              <Typography paragraph>
                Recruitment is a phenomenon where sounds grow in perceived loudness abnormally quickly once they exceed the hearing threshold.
              </Typography>
              <Typography paragraph>
                <strong>In everyday terms:</strong> Imagine turning up the volume on a TV. For someone with recruitment:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="At low volumes" 
                    secondary="They hear nothing or very little (due to hearing loss)" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="As volume increases past their threshold" 
                    secondary="Suddenly, sounds become audible" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="With a small additional increase" 
                    secondary="Sound quickly becomes uncomfortably loud or even painful" 
                  />
                </ListItem>
              </List>
              
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Why This Happens:</strong> The Relationship to Characteristic Response
                </Typography>
                <Typography paragraph>
                  Recruitment occurs because of how cochlear damage changes the characteristic response:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <NavigateNext color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Outer Hair Cell Damage" 
                      secondary="When outer hair cells are damaged, they no longer provide the special amplification for soft sounds" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <NavigateNext color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Inner Hair Cells Often Intact" 
                      secondary="Inner hair cells (which send signals to the brain) may still function normally once stimulated enough" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <NavigateNext color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Threshold Shift + Normal Loudness" 
                      secondary="This creates a situation where soft sounds aren't heard, but once a sound is loud enough to be heard, its loudness grows at a normal or even accelerated rate" 
                    />
                  </ListItem>
                </List>
                <Typography paragraph sx={{ fontStyle: 'italic', mt: 1 }}>
                  Think of it like a car with a sticky gas pedal: nothing happens at first as you push down, 
                  then suddenly the car accelerates rapidly with just a small additional push.
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
                Clinical Implications
              </Typography>
              <Typography paragraph>
                Understanding recruitment is crucial for hearing aid fitting and counseling:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hearing Aid Compression" 
                    secondary="Hearing aids must be programmed with appropriate compression to compensate for the narrowed dynamic range" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Output Limiting" 
                    secondary="Maximum output must be carefully set to avoid discomfort from loud sounds" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Patient Education" 
                    secondary="Patients need to understand why some sounds are suddenly too loud, while others remain inaudible" 
                  />
                </ListItem>
              </List>
              
              <Typography paragraph sx={{ fontStyle: 'italic', mt: 2 }}>
                Pro Tip: When testing for recruitment, audiologists use loudness growth tests like the Alternate Binaural Loudness Balance (ABLB) test 
                or Contour Test. These compare how loudness grows in the impaired ear versus a normal ear, helping to quantify the recruitment effect 
                and inform appropriate hearing aid settings.
              </Typography>
              
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 3 }}>
                Clinical Procedures: Testing for Recruitment
              </Typography>
              
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="panel-ablb-content"
                  id="panel-ablb-header"
                >
                  <Typography fontWeight="bold">Alternate Binaural Loudness Balance (ABLB) Test</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography paragraph>
                    The ABLB test is used to determine if recruitment is present in a patient with unilateral hearing loss 
                    (or asymmetrical loss) by comparing loudness perception between the better and poorer ear.
                  </Typography>
                  
                  <Card sx={{ mb: 3, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        Prerequisites and Setup
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Equipment Required" 
                            secondary="Clinical audiometer with capability for separate channel control and presentation to individual ears" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Patient Selection" 
                            secondary="Most effective when the difference in thresholds between ears is at least 20 dB, and no greater than 60-65 dB" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Test Frequency" 
                            secondary="Select a frequency where there is significant threshold difference between ears (typically 500, 1000, 2000, or 4000 Hz)" 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Step-by-Step Procedure
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>1</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Establish Pure-Tone Thresholds" 
                        secondary="Determine the threshold at the test frequency for both the better ear and the poorer ear" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>2</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Start with Reference Tone" 
                        secondary="Present a tone to the better ear at 20 dB SL (20 dB above threshold). This is your reference tone." 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>3</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Alternate Presentation" 
                        secondary="Switch to the poorer ear and adjust the intensity until the patient reports that the loudness matches the reference tone in the better ear" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>4</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Repeat with Increasing Intensity" 
                        secondary="Return to the better ear and increase the reference tone by 10 or 20 dB (e.g., to 40 dB SL), then find the matching loudness in the poorer ear" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>5</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Continue the Process" 
                        secondary="Repeat steps 3-4 at increasing intensity levels (e.g., 60 dB SL, 80 dB SL) in the better ear until reaching the limits of comfortable loudness" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>6</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Record Results" 
                        secondary="Plot a graph with the intensity level of the better ear on the x-axis and the matching intensity level of the poorer ear on the y-axis" 
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                    Interpretation of Results
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            No Recruitment
                          </Typography>
                          <Typography paragraph>
                            The difference in intensity between ears remains constant at all levels.
                          </Typography>
                          <Typography variant="body2">
                            Example: If the poorer ear needs 30 dB more than the better ear at threshold, 
                            it will still need approximately 30 dB more at higher intensities.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            Complete Recruitment
                          </Typography>
                          <Typography paragraph>
                            The ears reach equal loudness perception at high intensities.
                          </Typography>
                          <Typography variant="body2">
                            Example: The poorer ear may need 40 dB more at threshold, but at high intensities, 
                            both ears perceive the same loudness at the same intensity level.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            Partial Recruitment
                          </Typography>
                          <Typography paragraph>
                            The difference between ears decreases at higher intensities but doesn't completely disappear.
                          </Typography>
                          <Typography variant="body2">
                            Example: The poorer ear may need 40 dB more at threshold, but only 10-15 dB more 
                            at high intensities.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Typography paragraph sx={{ fontStyle: 'italic', mt: 1 }}>
                    Note: Recruitment is typically associated with cochlear (sensory) hearing loss. The presence of recruitment 
                    can help differentiate between cochlear and retrocochlear pathologies.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<KeyboardArrowDown />}
                  aria-controls="panel-contour-content"
                  id="panel-contour-header"
                >
                  <Typography fontWeight="bold">Contour Test (Loudness Growth in 1/2 Octave Bands)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography paragraph>
                    The Contour Test (often referred to as Loudness Growth in 1/2 Octave Bands or LGOB) measures how a patient's 
                    perception of loudness grows with increasing intensity. Unlike the ABLB test, it can be used for bilateral 
                    hearing loss and doesn't require a normal ear for comparison.
                  </Typography>
                  
                  <Card sx={{ mb: 3, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        Prerequisites and Setup
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Equipment Required" 
                            secondary="Clinical audiometer capable of presenting narrowband signals at specific frequencies and intensities" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Test Signals" 
                            secondary="Typically 1/2 octave or 1/3 octave narrowband noise centered at important frequencies (e.g., 500, 1000, 2000, 4000 Hz)" 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <NavigateNext color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Response Categories" 
                            secondary="Prepare a 7-point loudness scale: 1=Very Soft, 2=Soft, 3=Comfortable but Slightly Soft, 4=Comfortable, 5=Comfortable but Slightly Loud, 6=Loud but OK, 7=Uncomfortably Loud" 
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Step-by-Step Procedure
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>1</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Patient Instruction" 
                        secondary="Explain the 7-point loudness scale to the patient. Provide a visual chart showing the scale and descriptions for reference during testing." 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>2</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Select Test Frequency" 
                        secondary="Begin with a mid-frequency (e.g., 1000 Hz) and present the narrowband noise at a level just above threshold" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>3</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Start Rating Process" 
                        secondary="Ask the patient to rate the loudness of the sound using the 7-point scale" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>4</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Increase Intensity" 
                        secondary="Increase the intensity by 5 dB and repeat the rating process" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>5</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Continue in Ascending Order" 
                        secondary="Continue increasing the intensity in 5 dB steps, obtaining loudness ratings at each level until reaching level 6 or 7 on the scale" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>6</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Repeat for Additional Frequencies" 
                        secondary="Repeat the procedure for other test frequencies (e.g., 500, 2000, 4000 Hz)" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>7</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Test Both Ears" 
                        secondary="Perform the test for each ear separately if testing binaural recruitment" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>8</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Record Results" 
                        secondary="Create a graph plotting intensity levels (x-axis) against loudness ratings (y-axis) for each frequency and ear" 
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                    Interpretation of Results
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            Normal Loudness Growth
                          </Typography>
                          <Typography paragraph>
                            A gradual, relatively linear increase in loudness perception with increasing intensity.
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <NavigateNext color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Wide Dynamic Range" 
                                secondary="Approximately 100 dB between 'very soft' and 'uncomfortably loud'" 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <NavigateNext color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Comfortable Level" 
                                secondary="Usually around 40-50 dB above threshold" 
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            Recruitment Pattern
                          </Typography>
                          <Typography paragraph>
                            A steeper loudness growth function, particularly at higher intensities.
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <NavigateNext color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Compressed Dynamic Range" 
                                secondary="May be only 30-50 dB from threshold to uncomfortable loudness" 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <NavigateNext color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Rapid Growth" 
                                secondary="Quick progression from 'soft' to 'uncomfortable' with small intensity increases" 
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                    Clinical Applications
                  </Typography>
                  <Typography paragraph>
                    The Contour Test has practical applications for hearing aid fitting:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Compression Settings" 
                        secondary="Results help determine appropriate compression ratios and kneepoints for each frequency band" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Maximum Output" 
                        secondary="Level 6 ('Loud but OK') often used to set the maximum power output (MPO) of the hearing aid" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <NavigateNext color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Target Gain" 
                        secondary="Level 4 ('Comfortable') can guide the target gain for average speech inputs" 
                      />
                    </ListItem>
                  </List>
                  
                  <Typography paragraph sx={{ fontStyle: 'italic', mt: 2 }}>
                    Pro Tip: The Contour Test is particularly valuable for patients with bilateral hearing loss where the ABLB test 
                    cannot be performed. It also provides frequency-specific information that can be directly applied to multi-channel 
                    hearing aid programming.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </AccordionDetails>
          </Accordion>
        </>
      ),
    },
    {
      label: 'How We Hear: The Process of Sound Perception',
      description: (
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
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 1: Sound Collection" 
                    secondary="The pinna captures sound waves and funnels them into the ear canal" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 2: Eardrum Vibration" 
                    secondary="Sound waves cause the eardrum to vibrate back and forth" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 3: Ossicle Movement" 
                    secondary="The vibrations move the three ossicles, which amplify the sound" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 4: Fluid Waves in Cochlea" 
                    secondary="The stapes pushes on the oval window, creating waves in the cochlear fluid" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 5: Hair Cell Stimulation" 
                    secondary="The fluid waves bend the hair cells in the organ of Corti" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 6: Electrical Signal Generation" 
                    secondary="Bent hair cells release chemicals that generate electrical signals" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 7: Signal Transmission" 
                    secondary="The auditory nerve carries these signals to the brain" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Step 8: Sound Interpretation" 
                    secondary="The brain's auditory cortex interprets these signals as meaningful sounds" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Key Facts About Hearing:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Hearing color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Frequency Range" 
                secondary="Humans typically hear frequencies between 20 Hz and 20,000 Hz, with highest sensitivity around 2,000-5,000 Hz (the range of most speech sounds)" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Hearing color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Tonotopic Organization" 
                secondary="Different parts of the cochlea respond to different frequencies, with high frequencies at the base and low frequencies at the apex" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Hearing color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Amplification" 
                secondary="The middle ear provides about 25-30 dB of amplification, essential for hearing quiet sounds" 
              />
            </ListItem>
          </List>
        </>
      ),
    },
    {
      label: 'Common Hearing Disorders',
      description: (
        <>
          <Typography paragraph>
            Understanding ear anatomy helps in comprehending various hearing disorders and how they affect 
            the hearing process.
          </Typography>
          
          <Accordion 
            expanded={expanded === 'panel1'} 
            onChange={handleAccordionChange('panel1')}
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography fontWeight="bold">Conductive Hearing Loss</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Occurs when sound cannot efficiently travel through the outer and middle ear to the inner ear.
              </Typography>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Common Causes:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Earwax blockage" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Ear infections (otitis media)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Fluid in the middle ear" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Perforated eardrum" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Otosclerosis (fixation of the stapes)" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
          
          <Accordion 
            expanded={expanded === 'panel2'} 
            onChange={handleAccordionChange('panel2')}
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography fontWeight="bold">Sensorineural Hearing Loss</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Results from damage to the inner ear (cochlea) or to the nerve pathways from the inner ear to the brain.
              </Typography>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Common Causes:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Age-related hearing loss (presbycusis)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Noise exposure" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Ototoxic medications" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Genetic factors" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NavigateNext color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Illnesses like meningitis or measles" />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
          
          <Accordion 
            expanded={expanded === 'panel3'} 
            onChange={handleAccordionChange('panel3')}
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDown />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
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
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Ear Anatomy Training Guide
        </Typography>
        <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
          Understanding the Structure and Function of the Human Ear
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="subtitle1" fontWeight="bold">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {step.description}
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleReset : handleNext}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, mt: 3, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <Typography paragraph>Congratulations! You've completed the ear anatomy tutorial.</Typography>
            <Button onClick={handleReset} variant="outlined">
              Start Again
            </Button>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default EarAnatomyPage; 