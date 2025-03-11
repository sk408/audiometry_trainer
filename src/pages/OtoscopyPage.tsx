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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Hearing,
  NavigateNext,
  KeyboardArrowDown,
  VolumeUp,
  Waves,
  Check,
  Warning,
  Error,
  ArrowBack,
  ArrowForward,
  ZoomIn,
  LightMode
} from '@mui/icons-material';

// Placeholder for actual images - replace with real images when available
const otoscopeImg = "/audiometry_trainer/assets/otoscope.jpg";
const otoscopyTechniqueImg = "/audiometry_trainer/assets/otoscopy.webp";
const normalTympanicMembraneImg = "/audiometry_trainer/assets/TM.jpg";
const earCanalImg = "https://placeholder.com/ear-canal";
const otitisMediaImg = "/audiometry_trainer/assets/OM.jpg";
const cerumenImpactionImg = "/audiometry_trainer/assets/impacted.webp";
const perforatedTMImg = "/audiometry_trainer/assets/perforation.webp";

const OtoscopyPage: React.FC = () => {
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

  // Define the steps for the otoscopy procedure
  const steps = [
    {
      label: 'Introduction to Otoscopy',
      description: (
        <>
          <Typography paragraph>
            Otoscopy is a fundamental clinical procedure used to examine the external auditory canal and tympanic membrane (eardrum). 
            It provides valuable diagnostic information about the condition of the outer and middle ear.
          </Typography>
          <Typography paragraph>
            A thorough otoscopic examination is essential for diagnosing common ear conditions such as otitis media,
            cerumen impaction, foreign bodies, tympanic membrane perforations, and other abnormalities.
          </Typography>
          <Box 
            component="img" 
            src={otoscopeImg} 
            alt="Otoscope device"
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
              my: 2,
              borderRadius: 1,
              boxShadow: 2
            }}
          />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Types of Otoscopes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Conventional Otoscope</Typography>
                  <Typography paragraph>
                    Provides direct monocular view through a magnifying lens.
                    Features include a light source, pneumatic attachment capability, 
                    and interchangeable specula of various sizes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Video Otoscope</Typography>
                  <Typography paragraph>
                    Projects the image onto a screen, allowing for better visualization,
                    documentation, and patient education. Often used in educational settings
                    and for telemedicine applications.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ),
    },
    {
      label: 'Preparing for Otoscopy',
      description: (
        <>
          <Typography paragraph>
            Proper preparation is essential for a successful and comfortable otoscopy examination.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Equipment Needed:</Typography>
          <List>
            <ListItem>
              <ListItemIcon><Check /></ListItemIcon>
              <ListItemText primary="Otoscope with working light source" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Check /></ListItemIcon>
              <ListItemText primary="Appropriate size specula (typically 2.5mm for children and 4mm for adults)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Check /></ListItemIcon>
              <ListItemText primary="Cerumen management tools if needed (curette, irrigation system)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Check /></ListItemIcon>
              <ListItemText primary="Gloves (optional but recommended)" />
            </ListItem>
          </List>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Patient Positioning:</Typography>
          <Typography paragraph>
            For adults and older children: Seated position with head tilted slightly away from the examiner.
            For young children: May require assistance from a parent/guardian to hold the child.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Infection Control:</Typography>
          <Typography paragraph>
            Always ensure proper hand hygiene before and after the procedure.
            Use disposable specula or clean reusable specula according to facility protocols.
          </Typography>
        </>
      ),
    },
    {
      label: 'Otoscopy Technique',
      description: (
        <>
          <Typography variant="h6" gutterBottom>
            Performing Otoscopy: Step-by-Step Approach
          </Typography>
          
          <Box 
            component="img" 
            src={otoscopyTechniqueImg} 
            alt="Otoscopy technique"
            sx={{
              width: '100%',
              maxWidth: 400,
              height: 'auto',
              my: 2,
              borderRadius: 1,
              boxShadow: 2
            }}
          />
          
          <List>
            <ListItem>
              <ListItemIcon><ArrowForward /></ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle1">Step 1: External Examination</Typography>
                <Typography>
                  Before inserting the otoscope, examine the auricle and the area around the ear for signs of
                  trauma, infection, congenital abnormalities, or other pathologies.
                </Typography>
              </ListItemText>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><ArrowForward /></ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle1">Step 2: Correct Handling of the Otoscope</Typography>
                <Typography>
                  Hold the otoscope like a pencil, with your hand braced against the patient's head to prevent injury
                  if the patient moves suddenly. This provides stability during the examination.
                </Typography>
              </ListItemText>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><ArrowForward /></ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle1">Step 3: Proper Ear Canal Straightening</Typography>
                <Typography>
                  <strong>For adults:</strong> Gently pull the auricle upward, outward, and slightly backward to straighten the ear canal.
                  <br />
                  <strong>For children under 3 years:</strong> Pull the auricle downward and backward.
                </Typography>
              </ListItemText>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><ArrowForward /></ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle1">Step 4: Insertion of the Speculum</Typography>
                <Typography>
                  Insert the speculum slowly and gently into the ear canal.
                  The speculum should be held at a slight downward angle for optimal visualization.
                  Never force the speculum if you encounter resistance.
                </Typography>
              </ListItemText>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><ArrowForward /></ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle1">Step 5: Systematic Examination</Typography>
                <Typography>
                  Observe the ear canal first, noting any cerumen, foreign bodies, discharge, or abnormalities.
                  Then examine the tympanic membrane systematically, assessing each quadrant and the overall appearance.
                </Typography>
              </ListItemText>
            </ListItem>
            
            <ListItem>
              <ListItemIcon><ArrowForward /></ListItemIcon>
              <ListItemText>
                <Typography variant="subtitle1">Step 6: Pneumatic Otoscopy (when indicated)</Typography>
                <Typography>
                  Apply gentle positive and negative pressure to assess tympanic membrane mobility.
                  This helps in diagnosing middle ear effusion and eustachian tube dysfunction.
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
          
          <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.warning.light, 0.1), mt: 2 }}>
            <Typography variant="h6" color="warning.dark">Common Mistakes to Avoid:</Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Warning color="warning" /></ListItemIcon>
                <ListItemText primary="Inadequate visualization due to improper ear canal straightening" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Warning color="warning" /></ListItemIcon>
                <ListItemText primary="Inserting the speculum too deeply, causing discomfort" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Warning color="warning" /></ListItemIcon>
                <ListItemText primary="Using excessive force during pneumatic otoscopy" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Warning color="warning" /></ListItemIcon>
                <ListItemText primary="Inadequate lighting or speculum size" />
              </ListItem>
            </List>
          </Paper>
        </>
      ),
    },
    {
      label: 'Normal Findings',
      description: (
        <>
          <Typography variant="h6" gutterBottom>
            Normal Otoscopic Findings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box 
                component="img" 
                src={normalTympanicMembraneImg} 
                alt="Normal tympanic membrane"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  boxShadow: 2
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">External Auditory Canal</Typography>
              <Typography paragraph>
                The normal ear canal appears as a skin-lined tubular structure with minimal cerumen.
                It should be free of inflammation, discharge, lesions, or foreign bodies.
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2 }}>Tympanic Membrane (Eardrum)</Typography>
              <Typography paragraph>
                A normal tympanic membrane is pearly gray, translucent, and intact with a slight concavity.
                The light reflex is typically visible in the anterior-inferior quadrant.
              </Typography>
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 3 }}>Key Landmarks of the Tympanic Membrane:</Typography>
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Landmark</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Clinical Significance</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Pars Tensa</TableCell>
                  <TableCell>The main portion of the tympanic membrane, which is thin and taut</TableCell>
                  <TableCell>Provides sound conduction through vibration</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pars Flaccida</TableCell>
                  <TableCell>Small, superior portion of the tympanic membrane that is less tense</TableCell>
                  <TableCell>Common site for retraction pockets and cholesteatoma formation</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Malleus Handle</TableCell>
                  <TableCell>White, bony projection visible through the membrane</TableCell>
                  <TableCell>Orientation landmark; assists in identifying perforations</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Umbo</TableCell>
                  <TableCell>The central point where the malleus attaches to the tympanic membrane</TableCell>
                  <TableCell>Center point of membrane vibration</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Light Reflex</TableCell>
                  <TableCell>Cone-shaped reflection of light in the anterior-inferior quadrant</TableCell>
                  <TableCell>Altered or absent in middle ear pathology</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ),
    },
    {
      label: 'Abnormal Findings',
      description: (
        <>
          <Typography variant="h6" gutterBottom>
            Common Abnormal Otoscopic Findings
          </Typography>
          
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
              <Typography variant="subtitle1">Cerumen Impaction</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <Box 
                    component="img" 
                    src={cerumenImpactionImg} 
                    alt="Cerumen impaction"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 1,
                      boxShadow: 2
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography paragraph>
                    <strong>Appearance:</strong> Yellow to brown waxy material partially or completely occluding the ear canal
                  </Typography>
                  <Typography paragraph>
                    <strong>Clinical Significance:</strong> May cause conductive hearing loss, sensation of fullness, tinnitus, or external otitis if it traps moisture
                  </Typography>
                  <Typography paragraph>
                    <strong>Management:</strong> Cerumen removal through manual removal, irrigation, or softening agents
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
              <Typography variant="subtitle1">Acute Otitis Media</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <Box 
                    component="img" 
                    src={otitisMediaImg} 
                    alt="Acute otitis media"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 1,
                      boxShadow: 2
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography paragraph>
                    <strong>Appearance:</strong> Red, bulging tympanic membrane with loss of landmarks and light reflex. May show yellow discoloration if purulent fluid is present behind the membrane.
                  </Typography>
                  <Typography paragraph>
                    <strong>Clinical Significance:</strong> Indicates active middle ear infection, often with associated fever, ear pain, and irritability in children
                  </Typography>
                  <Typography paragraph>
                    <strong>Management:</strong> May require antibiotics, analgesics, and follow-up examination
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
              <Typography variant="subtitle1">Otitis Media with Effusion</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                <strong>Appearance:</strong> Amber or blue tympanic membrane with visible fluid level or air-fluid interface. Decreased mobility on pneumatic otoscopy.
              </Typography>
              <Typography paragraph>
                <strong>Clinical Significance:</strong> Non-infected fluid in the middle ear, often following acute otitis media or due to eustachian tube dysfunction
              </Typography>
              <Typography paragraph>
                <strong>Management:</strong> Often resolves spontaneously; may require ventilation tubes if persistent or causing significant hearing loss
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
              <Typography variant="subtitle1">Tympanic Membrane Perforation</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <Box 
                    component="img" 
                    src={perforatedTMImg} 
                    alt="Perforated tympanic membrane"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 1,
                      boxShadow: 2
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography paragraph>
                    <strong>Appearance:</strong> Visible break in the continuity of the tympanic membrane, often with irregular edges
                  </Typography>
                  <Typography paragraph>
                    <strong>Clinical Significance:</strong> May result from trauma, infection, or pressure changes. Associated with conductive hearing loss and risk of middle ear infection
                  </Typography>
                  <Typography paragraph>
                    <strong>Management:</strong> Many small perforations heal spontaneously; larger or persistent perforations may require surgical repair (tympanoplasty)
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel5'} onChange={handleAccordionChange('panel5')}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
              <Typography variant="subtitle1">External Otitis</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                <strong>Appearance:</strong> Erythematous, edematous ear canal skin, sometimes with discharge. Movement of the pinna or tragus typically causes pain.
              </Typography>
              <Typography paragraph>
                <strong>Clinical Significance:</strong> Infection or inflammation of the ear canal, often associated with water exposure or trauma
              </Typography>
              <Typography paragraph>
                <strong>Management:</strong> Topical antimicrobial drops, keeping ear dry, analgesics for pain control
              </Typography>
            </AccordionDetails>
          </Accordion>
        </>
      ),
    },
    {
      label: 'Pneumatic Otoscopy',
      description: (
        <>
          <Typography variant="h6" gutterBottom>
            Pneumatic Otoscopy Technique and Interpretation
          </Typography>
          
          <Typography paragraph>
            Pneumatic otoscopy is an essential extension of the standard otoscopic examination that assesses
            tympanic membrane mobility, providing valuable information about middle ear pressure and effusion.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Technique:</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><ArrowForward /></ListItemIcon>
                  <ListItemText primary="Attach a pneumatic bulb to the otoscope" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward /></ListItemIcon>
                  <ListItemText primary="Ensure an airtight seal with an appropriately sized speculum" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward /></ListItemIcon>
                  <ListItemText primary="Apply gentle positive and negative pressure using the bulb" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ArrowForward /></ListItemIcon>
                  <ListItemText primary="Observe the tympanic membrane movement in response to pressure changes" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Interpretation:</Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Finding</strong></TableCell>
                      <TableCell><strong>Interpretation</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Normal mobility</TableCell>
                      <TableCell>Tympanic membrane moves inward with positive pressure and outward with negative pressure</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Decreased mobility</TableCell>
                      <TableCell>Suggests middle ear effusion, adhesive otitis media, or tympanosclerosis</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Hypermobility</TableCell>
                      <TableCell>May indicate ossicular chain disruption</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>No mobility</TableCell>
                      <TableCell>Indicates severe middle ear effusion, adhesions, or technical error (poor seal)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          
          <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.light, 0.1), mt: 3 }}>
            <Typography variant="subtitle1" color="info.dark" gutterBottom>
              Clinical Pearl: Pneumatic Otoscopy in Pediatric Patients
            </Typography>
            <Typography>
              Pneumatic otoscopy is particularly valuable in diagnosing otitis media with effusion in children, 
              where subtle findings may be missed with standard otoscopy. The presence of decreased mobility has 
              high sensitivity and specificity for middle ear effusion when performed correctly.
            </Typography>
          </Paper>
        </>
      ),
    },
    {
      label: 'Documentation and Practice',
      description: (
        <>
          <Typography variant="h6" gutterBottom>
            Proper Documentation of Otoscopic Findings
          </Typography>
          
          <Typography paragraph>
            Thorough and standardized documentation of otoscopic findings is essential for medical records, 
            communication with colleagues, and monitoring changes over time.
          </Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sample Documentation Format:</Typography>
              <Typography variant="body2" component="div" sx={{ p: 1, bgcolor: alpha(theme.palette.background.default, 0.3) }}>
                <strong>Right Ear:</strong> External ear normal. Ear canal clear with minimal cerumen. Tympanic membrane intact, pearly gray, 
                with good light reflex. Landmarks visible. Good mobility on pneumatic otoscopy.
                <br /><br />
                <strong>Left Ear:</strong> External ear normal. Moderate cerumen in canal, not obstructing view. 
                Tympanic membrane appears retracted with prominent short process of malleus. Decreased mobility 
                on pneumatic otoscopy. No fluid level or perforation noted.
              </Typography>
            </CardContent>
          </Card>
          
          <Typography variant="h6" sx={{ mt: 3 }}>Tips for Developing Otoscopic Proficiency:</Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <ZoomIn sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Practice Regularly
                  </Typography>
                  <Typography>
                    Develop skills through repeated practice on various patients. Consider using simulators for initial training.
                    Review normal findings frequently to establish a strong baseline for recognizing abnormalities.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <LightMode sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Compare Images
                  </Typography>
                  <Typography>
                    Study otoscopic images in textbooks or online resources and compare them with your real-world findings.
                    Digital otoscopy with image capture capabilities can be particularly helpful for learning.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Paper sx={{ p: 2, mt: 3, bgcolor: alpha(theme.palette.success.light, 0.1) }}>
            <Typography variant="h6" gutterBottom color="success.dark">
              Case-Based Learning Exercise
            </Typography>
            <Typography paragraph>
              Review the following scenarios and consider what otoscopic findings you might expect:
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Case 1: 4-year-old child with fever, ear pain, and irritability for 2 days" 
                  secondary="Expected findings: Erythematous, bulging tympanic membrane with poor mobility - consistent with acute otitis media" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Case 2: Adult complaining of muffled hearing and sensation of ear fullness after upper respiratory infection" 
                  secondary="Expected findings: Retracted or amber-colored tympanic membrane with air-fluid level or bubbles - consistent with otitis media with effusion" 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Case 3: Swimmer with ear pain worsened by pulling on the ear" 
                  secondary="Expected findings: Erythematous, edematous ear canal with possible discharge - consistent with otitis externa (swimmer's ear)" 
                />
              </ListItem>
            </List>
          </Paper>
        </>
      ),
    },
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
          Otoscopy: Technique and Interpretation
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          A comprehensive guide to performing otoscopic examinations and interpreting findings of the outer and middle ear
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="h6">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {step.description}
                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<NavigateNext />}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      variant="outlined"
                      startIcon={<ArrowBack />}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography gutterBottom>All steps completed - you&apos;ve completed the otoscopy guide!</Typography>
            <Button onClick={handleReset} variant="outlined" sx={{ mt: 1 }}>
              Start Again
            </Button>
          </Paper>
        )}
      </Paper>
      
      {/* Additional Resources Section */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Additional Resources
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Research Articles</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Guidelines for Diagnosis and Management of Acute Otitis Media" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Pneumatic Otoscopy: Sensitivity and Specificity for Middle Ear Effusion" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Best Practices in Otoscopy Technique for Medical Students" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Video Tutorials</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Otoscopy Technique Demonstration" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Recognizing Common Ear Pathologies" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Pneumatic Otoscopy in Pediatric Patients" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Practice Tools</Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Otoscopy Simulators for Clinical Training" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Digital Atlas of Otoscopic Images" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Self-Assessment Quizzes for Otoscopic Findings" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OtoscopyPage; 