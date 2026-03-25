import React from 'react';
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

const innerEarImg = "";

const InnerEarStep: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <Typography paragraph>
        The inner ear is a complex system of fluid-filled chambers and tubes. It contains the sensory organs
        for both hearing (cochlea) and balance (vestibular system). This sophisticated structure is responsible
        for transducing mechanical energy into electrical signals that can be interpreted by the brain.
      </Typography>

      {/* Analogy Box */}
      <Box sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.info.light, 0.1), borderRadius: 2, border: `1px dashed ${theme.palette.info.main}` }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Inner Ear Analogy: A Biological Microphone and Motion Sensor
        </Typography>
        <Typography paragraph>
          Think of the inner ear as two amazing devices in one:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%', bgcolor: alpha(theme.palette.primary.light, 0.05) }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                The Cochlea: Nature's Microphone
              </Typography>
              <Typography variant="body2">
                Like a high-tech microphone that converts sound vibrations into electrical signals, the cochlea
                transforms mechanical energy from the middle ear into precise neural signals that your brain
                interprets as sound. Just as a microphone has different components for different frequencies,
                the cochlea has different regions that respond to different pitches.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, height: '100%', bgcolor: alpha(theme.palette.primary.light, 0.05) }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                The Vestibular System: Your Built-in Motion Sensor
              </Typography>
              <Typography variant="body2">
                Like the motion sensor in your smartphone that detects orientation and movement, your vestibular
                system constantly monitors your head position and movement in space. This biological gyroscope
                and accelerometer helps you maintain balance, stabilize your vision, and know which way is up.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Components Card */}
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
            {[
              { primary: 'Cochlea', secondary: 'Snail-shaped organ responsible for converting sound vibrations into electrical signals' },
              { primary: 'Organ of Corti', secondary: 'Contains hair cells that detect movement in the cochlear fluid' },
              { primary: 'Hair Cells', secondary: 'Specialized cells with stereocilia that convert mechanical motion to neural signals' },
              { primary: 'Vestibular Labyrinth', secondary: 'System responsible for balance and spatial orientation' },
              { primary: 'Semicircular Canals', secondary: 'Three loop-shaped tubes that detect rotational movements of the head' },
              { primary: 'Vestibule', secondary: 'Contains the utricle and saccule, which detect linear acceleration and head position' },
              { primary: 'Auditory Nerve', secondary: 'Cranial nerve VIII (vestibulocochlear nerve) that transmits signals to the brain' },
            ].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon><NavigateNext color="primary" /></ListItemIcon>
                <ListItemText primary={item.primary} secondary={item.secondary} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Cochlea Accordion */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-cochlea-content" id="panel-cochlea-header">
          <Typography fontWeight="bold">The Cochlea: Detailed Structure and Function</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            The cochlea is the primary auditory portion of the inner ear. This spiral-shaped structure contains
            three fluid-filled compartments (scalae):
          </Typography>

          {/* Piano Analogy */}
          <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.success.light, 0.1), borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="primary" fontWeight="bold">
              In Simple Terms: The Cochlea is Like a Tiny Piano
            </Typography>
            <Typography variant="body2" paragraph>
              Think of the cochlea as a rolled-up piano keyboard inside your head, about the size of a pea.
              Different notes (sound frequencies) activate different keys (regions) of this piano:
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: 'High Notes (High Frequency)', desc: 'Like the right side of a piano keyboard', loc: 'Near the entrance of the cochlea', color: 'error.main' },
                { label: 'Middle Notes (Mid Frequency)', desc: 'Like the middle of a piano keyboard', loc: 'In the middle of the cochlear spiral', color: 'warning.main' },
                { label: 'Low Notes (Low Frequency)', desc: 'Like the left side of a piano keyboard', loc: 'Deep inside the cochlear spiral', color: 'success.main' },
              ].map((item, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.4) : '#f9f9f9', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" color={item.color}>{item.label}</Typography>
                    <Typography variant="body2">{item.desc}</Typography>
                    <Typography variant="body2" fontStyle="italic" fontSize="small">{item.loc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography variant="body2" sx={{ mt: 2 }}>
              The cochlea's remarkable ability to separate sounds by frequency is what allows you to pick out a friend's voice
              in a noisy room or hear the different instruments in a song. When specific regions are damaged (like piano keys
              that don't work), you lose hearing at those specific frequencies.
            </Typography>
          </Paper>

          <List dense>
            {[
              { primary: 'Scala Vestibuli', secondary: 'Upper chamber filled with perilymph fluid; connected to the oval window' },
              { primary: 'Scala Media (Cochlear Duct)', secondary: 'Middle chamber filled with endolymph fluid; contains the organ of Corti' },
              { primary: 'Scala Tympani', secondary: 'Lower chamber filled with perilymph fluid; connected to the round window' },
            ].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
                <ListItemText primary={item.primary} secondary={item.secondary} />
              </ListItem>
            ))}
          </List>

          {/* Simple Fluid Chambers Explanation */}
          <Box sx={{
            p: 2, mb: 2,
            bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#f5f5f5',
            borderRadius: 1,
            border: `1px dashed ${theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : '#ccc'}`
          }}>
            <Typography variant="body2">
              <strong>Think of it like a tiny water slide:</strong> The cochlea has three parallel water channels that
              spiral together like a three-lane water slide. Sound waves create ripples that move through these fluid-filled
              channels, with the middle channel (scala media) containing the special sensors (organ of Corti) that detect
              the motion.
            </Typography>
          </Box>

          <Typography paragraph>
            <strong>Energy Transmission:</strong> The cochlea converts mechanical energy (fluid waves) into
            electrical energy (neural impulses).
          </Typography>
          <List dense>
            {[
              { primary: 'Input', secondary: 'Vibrations from the stapes at the oval window create pressure waves in the fluid' },
              { primary: 'Processing', secondary: 'These waves cause the basilar membrane to vibrate at specific locations based on frequency' },
              { primary: 'Output', secondary: 'Hair cells in the organ of Corti convert these vibrations into neural impulses' },
              { primary: 'Release', secondary: 'The round window bulges outward to release pressure, completing the mechanical wave cycle' },
            ].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
                <ListItemText primary={item.primary} secondary={item.secondary} />
              </ListItem>
            ))}
          </List>

          {/* Key Takeaways Box */}
          <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.success.light, 0.1), borderRadius: 2, border: `1px solid ${alpha(theme.palette.success.main, 0.3)}` }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="success.dark">
              Key Takeaways: The Cochlea
            </Typography>
            <ul>
              <li><strong>Structure:</strong> Three fluid-filled chambers (scalae) arranged in a spiral</li>
              <li><strong>Tonotopic Organization:</strong> Different frequencies are processed at different locations</li>
              <li><strong>Transduction:</strong> Hair cells convert mechanical energy to electrical signals</li>
              <li><strong>Amplification:</strong> Outer hair cells enhance sensitivity and frequency selectivity</li>
              <li><strong>Protection:</strong> Damage to hair cells is permanent and leads to hearing loss</li>
            </ul>
            <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
              Remember: The cochlea's organization (base to apex) explains why high-frequency hearing loss
              typically occurs first in noise exposure and aging.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Organ of Corti */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-organ-of-corti-content" id="panel-organ-of-corti-header">
          <Typography fontWeight="bold">The Organ of Corti: The Sensory Transducer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            The organ of Corti rests on the basilar membrane within the scala media and contains the
            essential auditory sensory cells.
          </Typography>
          <Typography paragraph><strong>Hair Cell Types and Functions:</strong></Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Inner Hair Cells (IHCs)" secondary="About 3,500 cells arranged in a single row; primary sensory receptors that transmit ~95% of auditory information to the brain" />
            </ListItem>
            <ListItem>
              <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Outer Hair Cells (OHCs)" secondary="About 12,000 cells arranged in three rows; function as mechanical amplifiers that enhance frequency selectivity and sensitivity" />
            </ListItem>
          </List>
          <Typography paragraph><strong>Stereocilia Mechanics:</strong> Each hair cell has stereocilia (hair-like projections) arranged in rows of increasing height.</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Tip Links" secondary="Protein filaments connecting adjacent stereocilia" />
            </ListItem>
            <ListItem>
              <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Mechanotransduction Channels" secondary="Ion channels that open when stereocilia bend in the direction of the tallest row" />
            </ListItem>
            <ListItem>
              <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
              <ListItemText primary="Endolymph Composition" secondary="High potassium, low sodium concentration; creates a +80mV potential (the endocochlear potential)" />
            </ListItem>
          </List>
          <Typography paragraph>
            <strong>Cochlear Amplifier:</strong> Outer hair cells can contract and expand in response to electrical stimulation
            (electromotility), actively amplifying basilar membrane motion by up to 40-60 dB.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Vestibular System */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-vestibular-content" id="panel-vestibular-header">
          <Typography fontWeight="bold">The Vestibular System: Balance and Spatial Orientation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            The vestibular system works alongside the cochlea within the inner ear and is responsible for
            our sense of balance and spatial orientation.
          </Typography>
          <Typography paragraph><strong>Key Components:</strong></Typography>
          <List dense>
            {[
              { primary: 'Semicircular Canals', secondary: 'Three orthogonal tubes that detect rotational acceleration (angular movement)' },
              { primary: 'Ampullae', secondary: 'Bulbous enlargements at the base of each semicircular canal containing the crista ampullaris' },
              { primary: 'Utricle and Saccule', secondary: 'Otolithic organs that detect linear acceleration and head position relative to gravity' },
              { primary: 'Macula', secondary: 'Sensory epithelium in the utricle and saccule containing hair cells' },
              { primary: 'Otoliths', secondary: 'Calcium carbonate crystals embedded in a gelatinous matrix atop the macula' },
            ].map((item, i) => (
              <ListItem key={i}>
                <ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon>
                <ListItemText primary={item.primary} secondary={item.secondary} />
              </ListItem>
            ))}
          </List>
          <Typography paragraph>
            <strong>Energy Transformation:</strong> Similar to the cochlea, the vestibular system converts
            mechanical energy (fluid movement) into electrical signals (neural impulses).
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Auditory Neural Pathway */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-auditory-pathway-content" id="panel-auditory-pathway-header">
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

          {/* Signal Initiation */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Signal Initiation: From Mechanical to Neural
          </Typography>
          <Typography paragraph>The auditory neural pathway begins with the transduction of mechanical energy into electrochemical signals:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Hair Cell Synapses" secondary="When stereocilia bend, mechanically-gated ion channels open, allowing potassium (K+) to flow into the cell. This depolarizes the hair cell, causing calcium (Ca2+) channels to open at the base of the cell." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Neurotransmitter Release" secondary="Calcium influx triggers the release of glutamate neurotransmitter from the base of inner hair cells onto the dendrites of auditory nerve fibers." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Afferent Signaling" secondary="Inner hair cells form synapses with Type I spiral ganglion neurons (95% of auditory nerve fibers). Outer hair cells mainly connect with Type II spiral ganglion neurons (5% of fibers)." /></ListItem>
          </List>

          {/* First-Order Neurons */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            First-Order Neurons: Spiral Ganglion to Cochlear Nucleus
          </Typography>
          <Typography paragraph>The cell bodies of the first-order neurons are located in the spiral ganglion within the modiolus of the cochlea:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Spiral Ganglion" secondary="Contains approximately 30,000-35,000 bipolar neurons with peripheral processes extending to hair cells and central processes forming the cochlear nerve." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Tonotopic Organization" secondary="Maintains a precise frequency organization; neurons from the cochlear base (high frequencies) are positioned on the periphery of the nerve, while those from the apex (low frequencies) are centrally located." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Signal Characteristics" secondary="Each fiber has a characteristic frequency (CF) to which it is most sensitive, preserving frequency information. Fibers also encode intensity through firing rate and timing information through phase-locking to sound waves (up to ~4000 Hz)." /></ListItem>
          </List>

          {/* Brainstem Processing */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Brainstem Processing: Cochlear Nucleus
          </Typography>
          <Typography paragraph>The cochlear nucleus is the first processing center in the central auditory system where significant signal analysis begins:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Subdivisions" secondary="Divided into dorsal cochlear nucleus (DCN), anteroventral cochlear nucleus (AVCN), and posteroventral cochlear nucleus (PVCN), each with specialized functions." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Cell Types and Processing" secondary="Contains diverse cell types that extract different features of sound:" /></ListItem>
          </List>
          <List dense sx={{ pl: 4 }}>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Bushy Cells (AVCN)" secondary="Preserve timing information critical for sound localization; form 'endbulb of Held' synapses with auditory nerve fibers." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Stellate/Multipolar Cells" secondary="Encode the temporal envelope of sounds, important for speech perception." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Octopus Cells (PVCN)" secondary="Detect coincident activity across multiple auditory nerve fibers, specialized for precise timing." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Fusiform Cells (DCN)" secondary="Integrate auditory and somatosensory information; may be involved in filtering out self-generated sounds." /></ListItem>
          </List>

          {/* Superior Olivary Complex */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Binaural Processing: Superior Olivary Complex
          </Typography>
          <Typography paragraph>The superior olivary complex (SOC) is the first site where inputs from both ears converge, enabling sound localization:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Medial Superior Olive (MSO)" secondary="Specialized for detecting interaural time differences (ITDs) - the tiny time difference between when a sound reaches each ear. Primarily processes low-frequency sounds (<1500 Hz) and is crucial for localizing sounds on the horizontal plane." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Lateral Superior Olive (LSO)" secondary="Specialized for detecting interaural level differences (ILDs) - the difference in sound intensity between ears. Primarily processes high-frequency sounds (>1500 Hz) and works with the MSO for horizontal sound localization." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Medial Nucleus of the Trapezoid Body (MNTB)" secondary="Provides precisely timed inhibitory input to the LSO, creating the excitatory-inhibitory interaction necessary for ILD processing." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Efferent System" secondary="The superior olivary complex also contains the cell bodies of the olivocochlear bundle, which provides feedback to the cochlea, modulating outer hair cell function and protecting the ear from acoustic trauma." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Olivocochlear Bundle" secondary="Projections from superior olivary complex to the cochlea. The medial component regulates outer hair cell activity, while the lateral component modulates inner hair cell output." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Protective Mechanisms" secondary="These efferent pathways are essential for protecting the auditory system from damage. Dysfunction in these protective systems may contribute to increased susceptibility to noise-induced hearing loss and could be a target for therapeutic interventions." /></ListItem>
          </List>

          {/* Efferent Protection */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Protective Role of the Efferent System Against Acoustic Trauma
          </Typography>
          <Typography paragraph>The efferent auditory system plays a crucial protective role against damaging sounds:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Olivocochlear Reflex" secondary="When exposed to loud sounds, the medial olivocochlear (MOC) neurons are activated and release acetylcholine onto outer hair cells. This hyperpolarizes the cells and reduces their motility, decreasing the amplification of loud sounds and preventing damage." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Middle Ear Muscle Reflex" secondary="The efferent system coordinates with the acoustic reflex, which contracts the stapedius muscle to stiffen the ossicular chain and reduce sound transmission to the inner ear during exposure to loud sounds." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Anti-Excitotoxic Effects" secondary="By reducing glutamate release at inner hair cell synapses during intense stimulation, the lateral olivocochlear system helps prevent excitotoxic damage to auditory nerve fibers." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Noise Conditioning" secondary="Prior activation of the efferent system through moderate sound exposure can enhance its protective capability against subsequent intense noise exposure, potentially explaining why some individuals are more resistant to noise-induced hearing loss." /></ListItem>
          </List>

          {/* Integration and Relay */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Integration and Relay: Nuclei of the Lateral Lemniscus and Inferior Colliculus
          </Typography>
          <Typography paragraph>As auditory information ascends, it undergoes further processing and integration:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Nuclei of the Lateral Lemniscus (NLL)" secondary="Process temporal patterns and may contribute to echo suppression and sound source segregation. The dorsal nucleus (DNLL) provides inhibitory projections that enhance sensitivity to moving sound sources." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Inferior Colliculus (IC)" secondary="A major integration center where nearly all ascending auditory pathways converge. Organized into functional zones:" /></ListItem>
          </List>
          <List dense sx={{ pl: 4 }}>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Central Nucleus" secondary="Maintains tonotopic organization and processes basic acoustic features." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="External Cortex" secondary="Integrates auditory information with other sensory modalities." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Dorsal Cortex" secondary="Receives descending inputs from auditory cortex, forming part of a feedback loop." /></ListItem>
          </List>
          <Typography paragraph>
            The inferior colliculus extracts complex features of sounds, such as frequency modulations,
            amplitude modulations, and duration - all critical for speech perception. It also plays a role in
            reflexive responses to sound, such as the acoustic startle reflex.
          </Typography>

          {/* Thalamic Processing */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Thalamic Processing: Medial Geniculate Body
          </Typography>
          <Typography paragraph>The medial geniculate body (MGB) in the thalamus serves as the final subcortical relay station:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Subdivisions" secondary="Contains ventral, dorsal, and medial divisions, each with distinct connections and functions:" /></ListItem>
          </List>
          <List dense sx={{ pl: 4 }}>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Ventral Division" secondary="Primary auditory relay that maintains tonotopic organization and projects to primary auditory cortex." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Dorsal Division" secondary="Processes complex sounds and connects with secondary auditory areas." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Medial Division" secondary="Multisensory integration area receiving somatosensory, visual, and auditory inputs." /></ListItem>
          </List>
          <Typography paragraph>The MGB is not simply a relay but actively shapes auditory information through:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Filtering" secondary="Can enhance or suppress specific features of the auditory signal based on attentional state." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Gating" secondary="Controls the flow of information to the cortex, influenced by arousal and attention." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Plasticity" secondary="Shows experience-dependent changes, contributing to auditory learning." /></ListItem>
          </List>

          {/* Cortical Processing */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Cortical Processing: Auditory Cortex
          </Typography>
          <Typography paragraph>The auditory cortex is the final destination for conscious sound perception and interpretation:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Primary Auditory Cortex (A1)" secondary="Located in the superior temporal gyrus within the temporal lobe. Maintains tonotopic organization with neurons arranged by characteristic frequency. Processes basic sound properties like pitch, loudness, and timing." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Belt Areas" secondary="Surround A1 and process more complex sound features. Include anterior, lateral, and posterior belt regions." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Parabelt Regions" secondary="Higher-order processing areas that integrate auditory information with other sensory modalities and cognitive functions." /></ListItem>
          </List>

          <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Functional Specialization in Auditory Cortex
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">Left Hemisphere</Typography>
                  <List dense>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Temporal resolution" secondary="Better at processing rapid temporal changes in sound." /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Speech and language" secondary="Specialized for processing linguistic aspects of speech (phonemes, syntax, semantics)." /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Wernicke's area" secondary="Critical for speech comprehension and language processing." /></ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">Right Hemisphere</Typography>
                  <List dense>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Spectral resolution" secondary="Better at processing tonal qualities and pitch contours." /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Music processing" secondary="More involved in processing melody, harmony, and timbre." /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Prosody" secondary="Processes emotional and intonational aspects of speech." /></ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Beyond Auditory Cortex */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Beyond Auditory Cortex: Higher Cognitive Processing
          </Typography>
          <Typography paragraph>Auditory information is integrated with other brain regions for higher-level processing:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Prefrontal Cortex" secondary="Involved in auditory attention, working memory, and decision-making based on auditory information." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Limbic System" secondary="Processes emotional content of sounds; the amygdala responds to threatening sounds and the hippocampus is involved in auditory memory formation." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Parietal Cortex" secondary="Integrates auditory information with spatial awareness and attention." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Motor Cortex" secondary="Links auditory input to motor responses, crucial for speech production and musical performance." /></ListItem>
          </List>

          {/* Descending Pathways */}
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            Descending Auditory Pathways
          </Typography>
          <Typography paragraph>The auditory system includes extensive descending (efferent) connections that modify processing at lower levels:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Corticofugal System" secondary="Projections from auditory cortex to thalamus, inferior colliculus, and brainstem. Enhances processing of relevant sounds and suppresses irrelevant background noise." /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Olivocochlear Bundle" secondary="Projections from superior olivary complex to the cochlea. The medial component regulates outer hair cell activity, while the lateral component modulates inner hair cell output." /></ListItem>
          </List>
          <Typography paragraph>
            These descending pathways allow for dynamic, experience-dependent modulation of auditory processing,
            enabling selective attention, noise suppression, and protection from acoustic trauma.
          </Typography>

          {/* Clinical Relevance */}
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.success.light, 0.15), borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="success.dark" gutterBottom>
              Clinical Relevance: Efferent Protection Against Noise-Induced Hearing Loss
            </Typography>
            <Typography paragraph>The efferent system's protective role has significant clinical implications:</Typography>
            <List dense>
              <ListItem><ListItemIcon><NavigateNext color="success" fontSize="small" /></ListItemIcon><ListItemText primary="Time-Limited Protection" secondary="The olivocochlear reflex can only provide protection for limited durations. Prolonged noise exposure eventually overwhelms this mechanism, leading to permanent damage." /></ListItem>
              <ListItem><ListItemIcon><NavigateNext color="success" fontSize="small" /></ListItemIcon><ListItemText primary="Individual Variation" secondary="Strength of efferent protection varies between individuals, potentially explaining different susceptibilities to noise-induced hearing loss despite similar exposures." /></ListItem>
              <ListItem><ListItemIcon><NavigateNext color="success" fontSize="small" /></ListItemIcon><ListItemText primary="Therapeutic Potential" secondary="Research is exploring ways to enhance efferent system function as a preventative measure against hearing loss in high-risk populations." /></ListItem>
              <ListItem><ListItemIcon><NavigateNext color="success" fontSize="small" /></ListItemIcon><ListItemText primary="Relevance to Hearing Aids" secondary="Hearing aid fittings should consider preserving the user's remaining efferent function by avoiding over-amplification that could overwhelm these protective mechanisms." /></ListItem>
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

      {/* Inner Ear Disorders */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
        Inner Ear Disorders and Corresponding Audiometric Patterns
      </Typography>

      {/* Presbycusis */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-presbycusis-content" id="panel-presbycusis-header">
          <Typography fontWeight="bold">Age-Related Hearing Loss (Presbycusis)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>A progressive sensorineural hearing loss associated with aging, typically affecting both ears equally.</Typography>
          <Typography paragraph><strong>Pathophysiology:</strong> Gradual degeneration of sensory hair cells, particularly in the basal turn of the cochlea (high-frequency region), and atrophy of the stria vascularis.</Typography>
          <Typography paragraph><strong>Audiometric Pattern:</strong> Bilateral, symmetrical, high-frequency hearing loss with a characteristic downward sloping pattern on the audiogram.</Typography>
          <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Distinctive Features on Hearing Tests:</Typography>
              <List dense>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Pure Tone Audiometry" secondary="High-frequency hearing loss (sloping configuration), typically beginning at 4000 Hz and progressing to lower frequencies over time" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Speech Audiometry" secondary="Poor speech discrimination scores, disproportionate to the pure-tone average (PTA)" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Tympanometry" secondary="Normal Type A tympanogram (indicating normal middle ear function)" /></ListItem>
              </List>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* NIHL */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-nihl-content" id="panel-nihl-header">
          <Typography fontWeight="bold">Noise-Induced Hearing Loss (NIHL)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>Hearing loss resulting from exposure to excessive sound levels that damage the hair cells in the cochlea.</Typography>
          <Typography paragraph><strong>Pathophysiology:</strong> Mechanical trauma to the organ of Corti, with outer hair cells being more vulnerable than inner hair cells. Initial damage occurs to hair cells that respond to 3000-6000 Hz.</Typography>
          <Typography paragraph><strong>Audiometric Pattern:</strong> Classic "notch" at 4000 Hz in the audiogram, which may broaden with continued exposure.</Typography>
          <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Distinctive Features on Hearing Tests:</Typography>
              <List dense>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Pure Tone Audiometry" secondary="4000 Hz 'notch' with better hearing at 8000 Hz; with continued exposure, the notch broadens to affect adjacent frequencies" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Otoacoustic Emissions (OAEs)" secondary="Reduced or absent, indicating outer hair cell damage even before changes appear on the audiogram" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Speech Audiometry" secondary="Variable speech discrimination depending on the extent of damage" /></ListItem>
              </List>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* Meniere's */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-meniere-content" id="panel-meniere-header">
          <Typography fontWeight="bold">Meniere's Disease</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>A disorder of the inner ear characterized by episodic vertigo, fluctuating hearing loss, tinnitus, and aural fullness.</Typography>
          <Typography paragraph><strong>Pathophysiology:</strong> Endolymphatic hydrops (excess fluid in the endolymphatic space of the cochlear duct), leading to distortion of the basilar membrane and sensory structures.</Typography>
          <Typography paragraph><strong>Audiometric Pattern:</strong> Fluctuating low-frequency sensorineural hearing loss in early stages, progressing to flat or all-frequency loss in later stages.</Typography>
          <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Distinctive Features on Hearing Tests:</Typography>
              <List dense>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Pure Tone Audiometry" secondary="Rising configuration (low-frequency hearing loss) that fluctuates between tests; later evolves to flat or sloping loss" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Speech Discrimination" secondary="Disproportionately poor word recognition compared to pure-tone thresholds" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Electrocochleography (ECochG)" secondary="Elevated summating potential/action potential (SP/AP) ratio, indicating endolymphatic hydrops" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Vestibular Testing" secondary="Abnormal vestibular function tests (caloric testing, VEMP, vHIT) on affected side" /></ListItem>
              </List>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* Ototoxicity */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-ototoxicity-content" id="panel-ototoxicity-header">
          <Typography fontWeight="bold">Ototoxicity</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>Hearing or balance dysfunction resulting from exposure to medications or chemicals that damage the inner ear structures.</Typography>
          <Typography paragraph><strong>Common Ototoxic Agents:</strong></Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Aminoglycoside antibiotics" secondary="Gentamicin, tobramycin, amikacin, streptomycin" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Platinum-based chemotherapy drugs" secondary="Cisplatin, carboplatin" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Loop diuretics" secondary="Furosemide, ethacrynic acid" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Salicylates" secondary="High doses of aspirin" /></ListItem>
          </List>
          <Typography paragraph><strong>Pathophysiology:</strong> Direct damage to outer hair cells, typically beginning at the basal turn of the cochlea (high-frequency region), followed by damage to inner hair cells with continued exposure.</Typography>
          <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Distinctive Features on Hearing Tests:</Typography>
              <List dense>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Pure Tone Audiometry" secondary="Bilateral high-frequency hearing loss initially, progressing to involve mid and low frequencies with continued exposure" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="High-Frequency Audiometry" secondary="Early detection of hearing loss at extended high frequencies (>8000 Hz) before conventional frequencies are affected" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Otoacoustic Emissions" secondary="Reduced or absent, often before changes are detected on audiogram, making OAEs valuable for early monitoring" /></ListItem>
              </List>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>

      {/* SSNHL */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-ssnhl-content" id="panel-ssnhl-header">
          <Typography fontWeight="bold">Sudden Sensorineural Hearing Loss (SSNHL)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>Rapid onset of hearing loss, typically occurring within 72 hours, that affects the inner ear or auditory nerve.</Typography>
          <Typography paragraph><strong>Potential Causes:</strong></Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Viral infections" secondary="Herpes simplex, varicella zoster, cytomegalovirus" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Vascular events" secondary="Microcirculation disturbances in the cochlea" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Immune-mediated disorders" secondary="Autoimmune inner ear disease" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Perilymph fistula" secondary="Abnormal connection between middle and inner ear" /></ListItem>
          </List>
          <Card sx={{ mb: 2, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>Distinctive Features on Hearing Tests:</Typography>
              <List dense>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Pure Tone Audiometry" secondary="Various patterns possible: flat, ascending, descending, or U-shaped configuration; defined as ≥30 dB loss in 3 consecutive frequencies" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Speech Audiometry" secondary="Speech discrimination scores often markedly reduced compared to pure-tone thresholds" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Acoustic Reflexes" secondary="Often absent on affected side" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="ABR (Auditory Brainstem Response)" secondary="Normal waveform morphology with delay in absolute latencies corresponding to hearing loss" /></ListItem>
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

      {/* Recruitment */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-recruitment-content" id="panel-recruitment-header">
          <Typography fontWeight="bold">Cochlear Characteristic Response and Recruitment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            An important concept for understanding hearing loss is the "characteristic response" of the cochlea and how it relates to a phenomenon called "recruitment."
          </Typography>

          <Card sx={{ mb: 3, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">What is a Characteristic Response?</Typography>
              <Typography paragraph>In simple terms, a characteristic response is how a specific part of the cochlea responds to sound at different frequencies and intensities:</Typography>
              <List dense>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Location Specificity" secondary="Each area along the basilar membrane responds best (is 'tuned') to a specific frequency - this is its 'characteristic frequency'." /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Response Curve" secondary="For each location, there's a relationship between sound intensity (how loud it is) and the response magnitude (how strongly the hair cells respond). This relationship forms a curve." /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Amplification" secondary="In a healthy ear, outer hair cells provide amplification for soft sounds, making the response curve non-linear - small increases in soft sounds produce large increases in response." /></ListItem>
              </List>
            </CardContent>
          </Card>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">The Healthy Cochlea</Typography>
                  <Typography paragraph>In a healthy ear, the response curve has these key properties:</Typography>
                  <List dense>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Wide Dynamic Range" secondary="Can process sounds from very quiet to very loud (about 120 dB range)" /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Sensitivity to Soft Sounds" secondary="Can detect very faint sounds thanks to outer hair cell amplification" /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Compression at High Intensities" secondary="Reduces sensitivity as sounds get louder to protect from damage and prevent overloading" /></ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">The Damaged Cochlea</Typography>
                  <Typography paragraph>With cochlear damage (especially to outer hair cells), the response curve changes:</Typography>
                  <List dense>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Reduced Sensitivity" secondary="Soft sounds are no longer amplified, raising the threshold of hearing" /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Narrowed Dynamic Range" secondary="The range between barely audible and uncomfortably loud becomes smaller" /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="More Linear Response" secondary="The special amplification for soft sounds is lost, making the response more straightforward (linear)" /></ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">Understanding Recruitment</Typography>
          <Typography paragraph>Recruitment is a phenomenon where sounds grow in perceived loudness abnormally quickly once they exceed the hearing threshold.</Typography>
          <Typography paragraph><strong>In everyday terms:</strong> Imagine turning up the volume on a TV. For someone with recruitment:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="At low volumes" secondary="They hear nothing or very little (due to hearing loss)" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="As volume increases past their threshold" secondary="Suddenly, sounds become audible" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="With a small additional increase" secondary="Sound quickly becomes uncomfortably loud or even painful" /></ListItem>
          </List>

          <Box sx={{
            bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : '#f5f5f5',
            p: 2, borderRadius: 1, mt: 2, mb: 2,
            border: `1px dashed ${theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : '#e0e0e0'}`
          }}>
            <Typography variant="subtitle1" gutterBottom><strong>Why This Happens:</strong> The Relationship to Characteristic Response</Typography>
            <Typography paragraph>Recruitment occurs because of how cochlear damage changes the characteristic response:</Typography>
            <List dense>
              <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Outer Hair Cell Damage" secondary="When outer hair cells are damaged, they no longer provide the special amplification for soft sounds" /></ListItem>
              <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Inner Hair Cells Often Intact" secondary="Inner hair cells (which send signals to the brain) may still function normally once stimulated enough" /></ListItem>
              <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Threshold Shift + Normal Loudness" secondary="This creates a situation where soft sounds aren't heard, but once a sound is loud enough to be heard, its loudness grows at a normal or even accelerated rate" /></ListItem>
            </List>
            <Typography paragraph sx={{ fontStyle: 'italic', mt: 1 }}>
              Think of it like a car with a sticky gas pedal: nothing happens at first as you push down,
              then suddenly the car accelerates rapidly with just a small additional push.
            </Typography>
          </Box>

          <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">Clinical Implications</Typography>
          <Typography paragraph>Understanding recruitment is crucial for hearing aid fitting and counseling:</Typography>
          <List dense>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Hearing Aid Compression" secondary="Hearing aids must be programmed with appropriate compression to compensate for the narrowed dynamic range" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Output Limiting" secondary="Maximum output must be carefully set to avoid discomfort from loud sounds" /></ListItem>
            <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Patient Education" secondary="Patients need to understand why some sounds are suddenly too loud, while others remain inaudible" /></ListItem>
          </List>

          <Typography paragraph sx={{ fontStyle: 'italic', mt: 2 }}>
            Pro Tip: When testing for recruitment, audiologists use loudness growth tests like the Alternate Binaural Loudness Balance (ABLB) test
            or Contour Test. These compare how loudness grows in the impaired ear versus a normal ear, helping to quantify the recruitment effect
            and inform appropriate hearing aid settings.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary" sx={{ mt: 3 }}>
            Clinical Procedures: Testing for Recruitment
          </Typography>

          {/* ABLB Nested Accordion */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-ablb-content" id="panel-ablb-header">
              <Typography fontWeight="bold">Alternate Binaural Loudness Balance (ABLB) Test</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                The ABLB test is used to determine if recruitment is present in a patient with unilateral hearing loss
                (or asymmetrical loss) by comparing loudness perception between the better and poorer ear.
              </Typography>
              <Card sx={{ mb: 3, p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">Prerequisites and Setup</Typography>
                  <List>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Equipment Required" secondary="Clinical audiometer with capability for separate channel control and presentation to individual ears" /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Patient Selection" secondary="Most effective when the difference in thresholds between ears is at least 20 dB, and no greater than 60-65 dB" /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Test Frequency" secondary="Select a frequency where there is significant threshold difference between ears (typically 500, 1000, 2000, or 4000 Hz)" /></ListItem>
                  </List>
                </CardContent>
              </Card>

              <Typography variant="subtitle1" gutterBottom fontWeight="bold">Step-by-Step Procedure</Typography>
              <List>
                {[
                  { step: '1', primary: 'Establish Pure-Tone Thresholds', secondary: 'Determine the threshold at the test frequency for both the better ear and the poorer ear' },
                  { step: '2', primary: 'Start with Reference Tone', secondary: 'Present a tone to the better ear at 20 dB SL (20 dB above threshold). This is your reference tone.' },
                  { step: '3', primary: 'Alternate Presentation', secondary: 'Switch to the poorer ear and adjust the intensity until the patient reports that the loudness matches the reference tone in the better ear' },
                  { step: '4', primary: 'Repeat with Increasing Intensity', secondary: 'Return to the better ear and increase the reference tone by 10 or 20 dB (e.g., to 40 dB SL), then find the matching loudness in the poorer ear' },
                  { step: '5', primary: 'Continue the Process', secondary: 'Repeat steps 3-4 at increasing intensity levels (e.g., 60 dB SL, 80 dB SL) in the better ear until reaching the limits of comfortable loudness' },
                  { step: '6', primary: 'Record Results', secondary: 'Plot a graph with the intensity level of the better ear on the x-axis and the matching intensity level of the poorer ear on the y-axis' },
                ].map(item => (
                  <ListItem key={item.step}>
                    <ListItemIcon><Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>{item.step}</Typography></ListItemIcon>
                    <ListItemText primary={item.primary} secondary={item.secondary} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>Interpretation of Results</Typography>
              <Grid container spacing={3} sx={{ mb: 2 }}>
                {[
                  { title: 'No Recruitment', desc: "The difference in intensity between ears remains constant at all levels.", example: "If the poorer ear needs 30 dB more than the better ear at threshold, it will still need approximately 30 dB more at higher intensities." },
                  { title: 'Complete Recruitment', desc: "The ears reach equal loudness perception at high intensities.", example: "The poorer ear may need 40 dB more at threshold, but at high intensities, both ears perceive the same loudness at the same intensity level." },
                  { title: 'Partial Recruitment', desc: "The difference between ears decreases at higher intensities but doesn't completely disappear.", example: "The poorer ear may need 40 dB more at threshold, but only 10-15 dB more at high intensities." },
                ].map(item => (
                  <Grid item xs={12} md={4} key={item.title}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">{item.title}</Typography>
                        <Typography paragraph>{item.desc}</Typography>
                        <Typography variant="body2">Example: {item.example}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Typography paragraph sx={{ fontStyle: 'italic', mt: 1 }}>
                Note: Recruitment is typically associated with cochlear (sensory) hearing loss. The presence of recruitment
                can help differentiate between cochlear and retrocochlear pathologies.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Contour Test Nested Accordion */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<KeyboardArrowDown />} aria-controls="panel-contour-content" id="panel-contour-header">
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
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">Prerequisites and Setup</Typography>
                  <List>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Equipment Required" secondary="Clinical audiometer capable of presenting narrowband signals at specific frequencies and intensities" /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Test Signals" secondary="Typically 1/2 octave or 1/3 octave narrowband noise centered at important frequencies (e.g., 500, 1000, 2000, 4000 Hz)" /></ListItem>
                    <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Response Categories" secondary="Prepare a 7-point loudness scale: 1=Very Soft, 2=Soft, 3=Comfortable but Slightly Soft, 4=Comfortable, 5=Comfortable but Slightly Loud, 6=Loud but OK, 7=Uncomfortably Loud" /></ListItem>
                  </List>
                </CardContent>
              </Card>

              <Typography variant="subtitle1" gutterBottom fontWeight="bold">Step-by-Step Procedure</Typography>
              <List>
                {[
                  { step: '1', primary: 'Patient Instruction', secondary: 'Explain the 7-point loudness scale to the patient. Provide a visual chart showing the scale and descriptions for reference during testing.' },
                  { step: '2', primary: 'Select Test Frequency', secondary: 'Begin with a mid-frequency (e.g., 1000 Hz) and present the narrowband noise at a level just above threshold' },
                  { step: '3', primary: 'Start Rating Process', secondary: 'Ask the patient to rate the loudness of the sound using the 7-point scale' },
                  { step: '4', primary: 'Increase Intensity', secondary: 'Increase the intensity by 5 dB and repeat the rating process' },
                  { step: '5', primary: 'Continue in Ascending Order', secondary: 'Continue increasing the intensity in 5 dB steps, obtaining loudness ratings at each level until reaching level 6 or 7 on the scale' },
                  { step: '6', primary: 'Repeat for Additional Frequencies', secondary: 'Repeat the procedure for other test frequencies (e.g., 500, 2000, 4000 Hz)' },
                  { step: '7', primary: 'Test Both Ears', secondary: 'Perform the test for each ear separately if testing binaural recruitment' },
                  { step: '8', primary: 'Record Results', secondary: 'Create a graph plotting intensity levels (x-axis) against loudness ratings (y-axis) for each frequency and ear' },
                ].map(item => (
                  <ListItem key={item.step}>
                    <ListItemIcon><Typography variant="body1" fontWeight="bold" sx={{ color: 'primary.main' }}>{item.step}</Typography></ListItemIcon>
                    <ListItemText primary={item.primary} secondary={item.secondary} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>Interpretation of Results</Typography>
              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">Normal Loudness Growth</Typography>
                      <Typography paragraph>A gradual, relatively linear increase in loudness perception with increasing intensity.</Typography>
                      <List dense>
                        <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Wide Dynamic Range" secondary="Approximately 100 dB between 'very soft' and 'uncomfortably loud'" /></ListItem>
                        <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Comfortable Level" secondary="Usually around 40-50 dB above threshold" /></ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">Recruitment Pattern</Typography>
                      <Typography paragraph>A steeper loudness growth function, particularly at higher intensities.</Typography>
                      <List dense>
                        <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Compressed Dynamic Range" secondary="May be only 30-50 dB from threshold to uncomfortable loudness" /></ListItem>
                        <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Rapid Growth" secondary="Quick progression from 'soft' to 'uncomfortable' with small intensity increases" /></ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>Clinical Applications</Typography>
              <Typography paragraph>The Contour Test has practical applications for hearing aid fitting:</Typography>
              <List dense>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Compression Settings" secondary="Results help determine appropriate compression ratios and kneepoints for each frequency band" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Maximum Output" secondary="Level 6 ('Loud but OK') often used to set the maximum power output (MPO) of the hearing aid" /></ListItem>
                <ListItem><ListItemIcon><NavigateNext color="primary" fontSize="small" /></ListItemIcon><ListItemText primary="Target Gain" secondary="Level 4 ('Comfortable') can guide the target gain for average speech inputs" /></ListItem>
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
  );
};

export default InnerEarStep;
