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
            for both hearing (cochlea) and balance (vestibular system).
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
              </List>
            </CardContent>
          </Card>
          <Typography paragraph>
            The cochlea contains a basilar membrane that vibrates in response to sound. Different frequencies cause 
            different parts of the membrane to vibrate more intensely, allowing us to distinguish between pitches.
          </Typography>
          <Typography paragraph>
            The hair cells in the organ of Corti are incredibly sensitive and can be damaged by loud noises, leading to 
            noise-induced hearing loss. Unlike many other cells in the body, these hair cells do not regenerate once damaged.
          </Typography>
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