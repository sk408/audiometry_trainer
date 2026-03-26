import React, { useState, useCallback } from 'react';
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
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
import AnatomyQuiz from '../AnatomyQuiz';

const middleEarImg = "";

const MiddleEarStep: React.FC = () => {
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
          loading="lazy"
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

          {/* Tympanic Membrane */}
          <Accordion expanded={expanded === 'tympanic-membrane'} onChange={handleAccordionChange('tympanic-membrane')} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="tympanic-membrane-content" id="tympanic-membrane-header">
              <Typography fontWeight="bold">Tympanic Membrane (Eardrum)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>In Simple Terms:</Typography>
                  <Typography>The eardrum is like the head of a drum - a thin membrane that vibrates when sound hits it. It's the boundary between your outer and middle ear.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Function:</Typography>
                  <Typography>Converts sound waves (air pressure variations) into mechanical vibrations. It's approximately 17-20 times larger than the oval window, which helps amplify the force of vibrations as they travel to the inner ear.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Energy Transformation:</Typography>
                  <Typography><strong>Input:</strong> Acoustic energy (sound waves in air)<br /><strong>Output:</strong> Mechanical energy (vibrations of solid structures)</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Ossicular Chain */}
          <Accordion expanded={expanded === 'ossicles'} onChange={handleAccordionChange('ossicles')} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="ossicles-content" id="ossicles-header">
              <Typography fontWeight="bold">Ossicular Chain (Malleus, Incus, Stapes)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>In Simple Terms:</Typography>
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
                  <Typography variant="subtitle2" color="primary" gutterBottom>Function:</Typography>
                  <Typography paragraph>
                    Acts as a lever system that amplifies force. Key points:
                    <ul>
                      <li>Creates a mechanical advantage of about 1.3x</li>
                      <li>When combined with the area difference between eardrum and oval window, produces approximately 22x pressure gain (27 dB)</li>
                      <li>Essential for "impedance matching" between air and fluid environments</li>
                    </ul>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Energy Transformation:</Typography>
                  <Typography><strong>Input:</strong> Mechanical energy from eardrum<br /><strong>Output:</strong> Amplified mechanical energy to oval window</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Tympanic Cavity */}
          <Accordion expanded={expanded === 'tympanic-cavity'} onChange={handleAccordionChange('tympanic-cavity')} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="tympanic-cavity-content" id="tympanic-cavity-header">
              <Typography fontWeight="bold">Tympanic Cavity (Middle Ear Cavity)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>In Simple Terms:</Typography>
                  <Typography>An air-filled space like a small room that houses the ossicles. It's separated from the outer ear by the eardrum and from the inner ear by the oval and round windows.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Function:</Typography>
                  <Typography>
                    Maintains an air-filled environment for proper ossicle movement. Three critical aspects:
                    <ul>
                      <li>Must stay at atmospheric pressure for optimal hearing</li>
                      <li>Requires regular pressure equalization</li>
                      <li>Provides low-resistance environment for ossicle vibration</li>
                    </ul>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Energy Relevance:</Typography>
                  <Typography>The air in this cavity provides low resistance to ossicle movement, allowing efficient energy transfer from the eardrum to the inner ear.</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Eustachian Tube */}
          <Accordion expanded={expanded === 'eustachian-tube'} onChange={handleAccordionChange('eustachian-tube')} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="eustachian-tube-content" id="eustachian-tube-header">
              <Typography fontWeight="bold">Eustachian Tube</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>In Simple Terms:</Typography>
                  <Typography>A narrow channel that connects the middle ear to the back of the throat (nasopharynx). It's like a pressure-release valve that opens when you yawn, swallow, or chew.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Function:</Typography>
                  <Typography>
                    Connects the middle ear to the back of the throat (nasopharynx). Three main functions:
                    <ul>
                      <li>Equalizes air pressure when you yawn, swallow, or chew</li>
                      <li>Drains fluid from the middle ear</li>
                      <li>Protects middle ear from throat secretions and extreme sound pressure</li>
                    </ul>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Energy Relevance:</Typography>
                  <Typography>When middle ear pressure differs from atmospheric pressure, the resulting eardrum tension reduces its ability to vibrate, causing temporary hearing loss (like during airplane ascent or descent).</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Oval Window */}
          <Accordion expanded={expanded === 'oval-window'} onChange={handleAccordionChange('oval-window')} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="oval-window-content" id="oval-window-header">
              <Typography fontWeight="bold">Oval Window</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>In Simple Terms:</Typography>
                  <Typography>A small, membrane-covered opening between the middle and inner ear where the stapes (the final ossicle) attaches. Like a doorway from the middle ear to the inner ear.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Function:</Typography>
                  <Typography>Transmits vibrations from the stapes to the fluid (perilymph) in the cochlea. Its smaller surface area compared to the eardrum concentrates force, which is necessary to overcome the higher resistance of fluid compared to air.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Energy Transformation:</Typography>
                  <Typography><strong>Input:</strong> Mechanical energy from stapes movement<br /><strong>Output:</strong> Fluid pressure waves in the inner ear</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Round Window */}
          <Accordion expanded={expanded === 'round-window'} onChange={handleAccordionChange('round-window')} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="round-window-content" id="round-window-header">
              <Typography fontWeight="bold">Round Window</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>In Simple Terms:</Typography>
                  <Typography>A second, flexible membrane-covered opening between the middle and inner ear. Works like a pressure-release valve for the inner ear.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Function:</Typography>
                  <Typography>Bulges outward into the middle ear when the stapes pushes in at the oval window, allowing fluid movement within the cochlea. Without this "release valve," the incompressible fluid in the inner ear couldn't move, and no sound would be perceived.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Energy Relevance:</Typography>
                  <Typography>Allows the release of pressure energy in the inner ear system, completing the circuit of energy flow through the cochlea.</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Middle Ear Muscles */}
          <Accordion expanded={expanded === 'middle-ear-muscles'} onChange={handleAccordionChange('middle-ear-muscles')} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="middle-ear-muscles-content" id="middle-ear-muscles-header">
              <Typography fontWeight="bold">Middle Ear Muscles (Stapedius & Tensor Tympani)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>In Simple Terms:</Typography>
                  <Typography>Two tiny muscles in the middle ear that act like shock absorbers for loud sounds. The stapedius attaches to the stapes, while the tensor tympani attaches to the malleus.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Function:</Typography>
                  <Typography>Contract reflexively in response to loud sounds (85+ dB), reducing the transmission of vibrations to the inner ear. This acoustic reflex provides some protection against sudden loud noises and reduces the masking effect of low-frequency background noise.</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>Energy Relevance:</Typography>
                  <Typography>Attenuate (reduce) energy transmission by stiffening the ossicular chain, primarily affecting lower frequencies below 1000 Hz. This attenuation is typically 10-15 dB but can reach up to 30 dB in some individuals.</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Energy Transmission Section */}
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
                <Typography variant="body2">The eardrum's surface area is about 17-20 times larger than the oval window. This concentrates the force from sound waves onto the smaller window, increasing pressure by the same factor.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                <Typography fontWeight="bold" gutterBottom>Lever Action</Typography>
                <Typography variant="body2">The ossicles form a lever system that multiplies force by approximately 1.3 times. The malleus arm is longer than the incus arm, creating this mechanical advantage.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
                <Typography fontWeight="bold" gutterBottom>Combined Effect</Typography>
                <Typography variant="body2">Together, these mechanisms provide about 22x amplification (approximately 27 dB gain), enough to overcome most of the impedance mismatch between air and fluid.</Typography>
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

        <Typography variant="h6" gutterBottom fontWeight="bold" color="warning.main" sx={{ mt: 3 }}>
          Key Takeaways:
        </Typography>
        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.light, 0.1), borderRadius: 1 }}>
          <ul>
            <li><strong>Size Matters:</strong> The ear uses size differences (eardrum vs. oval window) to concentrate force</li>
            <li><strong>Leverage Works:</strong> The ossicles form a lever system that multiplies force</li>
            <li><strong>Energy Must Flow:</strong> Sound energy travels from air → bone → fluid in a continuous path</li>
            <li><strong>Efficient Design:</strong> Without the middle ear's amplification, we'd lose 99.9% of sound energy at the air-fluid boundary</li>
          </ul>
        </Box>

        <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="warning.main" sx={{ mt: 3 }}>
          Clinical Significance:
        </Typography>
        <Typography paragraph>
          Disruptions to this energy transmission pathway result in conductive hearing loss. The better you understand
          this energy transfer system, the better you'll be able to interpret audiometric findings and understand
          treatment options for middle ear disorders.
        </Typography>
      </Paper>

      {/* Middle Ear Pathologies */}
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 4, mb: 2 }}>
        Middle Ear Pathologies and Their Audiometric Presentations
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: 'Otitis Media',
            description: 'Inflammation of the middle ear, often with fluid accumulation. Can be acute (short duration) or chronic (persistent). Common in children due to their shorter, more horizontal Eustachian tubes.',
            effect: 'Fluid in the middle ear dampens ossicle movement and increases mass, reducing vibration efficiency. The result is reduced energy transfer to the inner ear, particularly at higher frequencies.',
            audiometric: [
              'Mild to moderate conductive hearing loss (20-40 dB)',
              'Air-bone gap across frequencies (bone conduction normal, air conduction reduced)',
              'Type B tympanogram (flat, with reduced compliance)',
              'Absent acoustic reflexes'
            ]
          },
          {
            title: 'Otosclerosis',
            description: 'Abnormal bone growth in the middle ear, typically around the stapes footplate, causing it to become fixed or "frozen" in the oval window. Hereditary condition most common in Caucasian women.',
            effect: 'The fixed stapes cannot efficiently transmit vibrations to the inner ear. As the condition progresses, it may also affect inner ear function (cochlear otosclerosis).',
            audiometric: [
              'Progressive conductive hearing loss, often bilateral but asymmetric',
              'Characteristic "Carhart\'s notch" - bone conduction dip around 2000 Hz',
              'Type A tympanogram (normal middle ear pressure and compliance)',
              'Absent acoustic reflexes',
              'Better hearing in noisy environments (paracusis willisii)'
            ]
          },
          {
            title: 'Tympanic Membrane Perforation',
            description: 'A hole or rupture in the eardrum, caused by infections, trauma, or sudden pressure changes (barotrauma). Size and location of the perforation affect hearing impact.',
            effect: 'Reduces the effective surface area of the eardrum, diminishing its ability to capture sound energy. Also allows sound to bypass the ossicular chain, reducing the middle ear\'s amplification effect.',
            audiometric: [
              'Mild to moderate conductive hearing loss (usually 20-30 dB)',
              'Greater hearing loss at lower frequencies if perforation is large',
              'Type B tympanogram with high physical volume measurement',
              'Acoustic reflex absent on affected side'
            ]
          },
          {
            title: 'Ossicular Discontinuity',
            description: 'Disruption of the ossicular chain, most commonly separation of the incus from the stapes. Usually caused by trauma, chronic infection, or cholesteatoma.',
            effect: 'Breaks the mechanical link between the tympanic membrane and the oval window, preventing efficient transfer of energy to the inner ear.',
            audiometric: [
              'Moderate to severe conductive hearing loss (40-60 dB)',
              'Large air-bone gap across all frequencies',
              'Type A tympanogram (sometimes with increased compliance)',
              'Acoustic reflex absent'
            ]
          }
        ].map(pathology => (
          <Grid item xs={12} md={6} key={pathology.title}>
            <Paper elevation={3} sx={{ p: 0, height: '100%', overflow: 'hidden' }}>
              <Box sx={{ bgcolor: theme.palette.error.main, p: 2 }}>
                <Typography variant="h6" color="white">{pathology.title}</Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Description:</Typography>
                <Typography paragraph variant="body2">{pathology.description}</Typography>
                <Typography variant="subtitle2" gutterBottom>Effect on Hearing:</Typography>
                <Typography paragraph variant="body2">{pathology.effect}</Typography>
                <Typography variant="subtitle2" gutterBottom>Audiometric Presentation:</Typography>
                <Typography variant="body2">
                  <ul>
                    {pathology.audiometric.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Visual Comparison of Hearing Loss Types */}
      <Box sx={{ mb: 4, p: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" align="center" sx={{ mb: 2 }}>
          Comparing Types of Hearing Loss
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.light, 0.05), height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" align="center">
                Conductive Hearing Loss
              </Typography>
              <List dense>
                {[
                  'Location: Outer or middle ear',
                  'Causes: Earwax, fluid, otosclerosis, perforations',
                  'Audiogram: Air-bone gap present',
                  'Pattern: Often flat across frequencies',
                  'Treatment: Often medical/surgical options',
                  'Amplification: Excellent results with hearing aids'
                ].map((text, i) => (
                  <ListItem key={i}>
                    <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.light, 0.05), height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="secondary" align="center">
                Sensorineural Hearing Loss
              </Typography>
              <List dense>
                {[
                  'Location: Inner ear or nerve',
                  'Causes: Noise exposure, aging, ototoxicity',
                  'Audiogram: No air-bone gap',
                  'Pattern: Often worse in high frequencies',
                  'Treatment: Usually permanent (irreversible)',
                  'Amplification: Variable success with hearing aids'
                ].map((text, i) => (
                  <ListItem key={i}>
                    <ListItemIcon><NavigateNext color="secondary" fontSize="small" /></ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.warning.light, 0.1), borderRadius: 1, border: `1px dashed ${theme.palette.warning.main}` }}>
          <Typography variant="subtitle2" fontWeight="bold">Mixed Hearing Loss</Typography>
          <Typography variant="body2">
            A combination of both conductive and sensorineural components. Shows both an air-bone gap AND
            bone conduction thresholds worse than 20 dB HL on audiograms.
          </Typography>
        </Box>
      </Box>

      {/* Audiometric Tests */}
      <Box sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), p: 3, borderRadius: 1, border: `1px solid ${theme.palette.warning.main}`, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Audiometric Tests for Middle Ear Function:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Pure Tone Audiometry</Typography>
            <Typography variant="body2">
              Measures both air conduction (AC) and bone conduction (BC) thresholds. Middle ear disorders
              typically show an air-bone gap where AC thresholds are elevated but BC remains normal. This gap
              represents the magnitude of conductive hearing loss.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Tympanometry</Typography>
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
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">Acoustic Reflex Testing</Typography>
            <Typography variant="body2">
              Measures the contraction of middle ear muscles in response to loud sounds. Middle ear pathologies often
              show absent reflexes or abnormal decay patterns. Helps distinguish between conductive, sensorineural,
              and retrocochlear disorders.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Knowledge Check */}
      <AnatomyQuiz />

      <Typography paragraph sx={{ fontStyle: 'italic' }}>
        Pro Tip: Remember that middle ear disorders typically affect lower frequencies as much as or more than
        higher frequencies, creating a relatively flat hearing loss pattern. This contrasts with most sensorineural
        hearing losses, which tend to affect high frequencies more severely.
      </Typography>
    </>
  );
};

export default MiddleEarStep;
