import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Divider,
  Link,
  useMediaQuery,
  Chip
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  School,
  Person,
  Assessment,
  HearingOutlined,
  ArrowForward,
  Help,
  Info,
  HearingDisabled,
  ZoomIn,
  Biotech,
  ViewInAr
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 5, md: 8 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <HearingOutlined sx={{ fontSize: { xs: 40, md: 60 }, mb: 2 }} />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' } }}
          >
            Audiology Training Suite
          </Typography>
          <Typography 
            variant="h5" 
            paragraph
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}
          >
            A comprehensive training platform for audiology students covering pure tone audiometry, 
            otoscopy, ear anatomy, real ear measurements, and more
          </Typography>
          <Box sx={{ 
            mt: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center', 
            gap: 2, 
            flexWrap: 'wrap' 
          }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<School />}
              component={RouterLink}
              to="/tutorial"
              sx={{ px: 3, py: 1.5, width: { xs: '100%', sm: 'auto' } }}
            >
              Start Learning
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<Person />}
              component={RouterLink}
              to="/patients"
              sx={{ px: 3, py: 1.5, width: { xs: '100%', sm: 'auto' } }}
            >
              Practice with Patients
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Topic Exploration Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Explore Audiology Topics
        </Typography>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'primary.main' }} />
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HearingOutlined color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Pure Tone Audiometry
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Learn the Hughson-Westlake procedure with our step-by-step tutorial. 
                  Understand proper technique, masking procedures, and audiogram interpretation.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/tutorial"
                  color="primary"
                  endIcon={<ArrowForward />}
                >
                  Start Tutorial
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'secondary.main' }} />
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ViewInAr color="secondary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Ear Anatomy
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Explore detailed 3D models of the ear's anatomy. Study the outer, middle, and inner ear 
                  structures and understand their roles in the hearing process.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/ear-anatomy"
                  color="secondary"
                  endIcon={<ArrowForward />}
                >
                  Explore Anatomy
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'info.main' }} />
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ZoomIn color="info" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Otoscopy
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Practice otoscopic examination techniques and learn to identify common ear conditions 
                  and pathologies through high-quality reference images.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/otoscopy"
                  color="info"
                  endIcon={<ArrowForward />}
                >
                  View Otoscopy Guide
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'success.main' }} />
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Biotech color="success" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Real Ear Measurement
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Learn how to perform real ear measurements for hearing aid verification and 
                  understand proper probe placement, calibration, and target matching.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/real-ear-measurement"
                  color="success"
                  endIcon={<ArrowForward />}
                >
                  Learn REM Techniques
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'warning.main' }} />
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HearingDisabled color="warning" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Hearing Aid Follow-Up
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Learn step-by-step procedures for effective hearing aid follow-up appointments, 
                  including validation, fine-tuning, and patient counseling.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/followup"
                  color="warning"
                  endIcon={<ArrowForward />}
                >
                  View Follow-Up Guide
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'error.main' }} />
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Help color="error" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Troubleshooting
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Reference guide for identifying and resolving common hearing aid issues, 
                  including feedback, sound quality problems, and physical fit concerns.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/troubleshooting"
                  color="error"
                  endIcon={<ArrowForward />}
                >
                  View Troubleshooting Guide
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Practice Section */}
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.6) 
          : '#f5f5f5', 
        py: { xs: 4, md: 6 } 
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Clinical Training
          </Typography>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
            <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Apply Your Knowledge with Virtual Patients
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Develop your clinical skills by working with our diverse set of virtual patients. Practice audiometry,
                    hearing aid fittings, and follow-up procedures in a realistic clinical environment.
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Available practice modules:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label="Pure Tone Audiometry" color="primary" size="small" />
                    <Chip label="Speech Audiometry" color="secondary" size="small" />
                    <Chip label="Hearing Aid Fitting" color="success" size="small" />
                    <Chip label="Real Ear Measurement" color="info" size="small" />
                    <Chip label="Otoscopic Examination" color="warning" size="small" />
                  </Box>
                  <Button
                    component={RouterLink}
                    to="/patients"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Practice with Virtual Patients
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step 1
                      </Typography>
                      <School color="primary" sx={{ fontSize: { xs: 30, md: 40 }, my: { xs: 1, md: 2 } }} />
                      <Typography variant="body2">
                        Learn the theory and procedures through our comprehensive guides
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step 2
                      </Typography>
                      <Person color="secondary" sx={{ fontSize: { xs: 30, md: 40 }, my: { xs: 1, md: 2 } }} />
                      <Typography variant="body2">
                        Select a virtual patient with specific hearing characteristics
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step 3
                      </Typography>
                      <HearingOutlined color="success" sx={{ fontSize: { xs: 30, md: 40 }, my: { xs: 1, md: 2 } }} />
                      <Typography variant="body2">
                        Conduct the clinical procedures following proper protocols
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step 4
                      </Typography>
                      <Assessment color="info" sx={{ fontSize: { xs: 30, md: 40 }, my: { xs: 1, md: 2 } }} />
                      <Typography variant="body2">
                        Receive detailed feedback on your performance and clinical decisions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Quick Access Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Quick Access to Learning Resources
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <School color="primary" sx={{ fontSize: { xs: 30, md: 40 }, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Core Theory
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Master the fundamental audiological concepts with our detailed tutorials 
                  covering pure tone audiometry, hearing assessment, and interpretation.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: { xs: 1.5, md: 2 } }}>
                <Button
                  component={RouterLink}
                  to="/tutorial"
                  color="primary"
                  fullWidth
                >
                  Audiometry Tutorial
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <ViewInAr color="secondary" sx={{ fontSize: { xs: 30, md: 40 }, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Visual Learning
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Explore interactive 3D models of ear anatomy and view high-quality
                  otoscopy images to develop your visual diagnostic skills.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: { xs: 1.5, md: 2 } }}>
                <Button
                  component={RouterLink}
                  to="/ear-anatomy"
                  color="secondary"
                  fullWidth
                >
                  Explore Ear Anatomy
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Biotech color="success" sx={{ fontSize: { xs: 30, md: 40 }, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Advanced Techniques
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Learn specialized procedures such as real ear measurements and hearing aid
                  verification to ensure optimal outcomes for your patients.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: { xs: 1.5, md: 2 } }}>
                <Button
                  component={RouterLink}
                  to="/real-ear-measurement"
                  color="success"
                  fullWidth
                >
                  Real Ear Measurement Guide
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', py: { xs: 3, md: 4 }, mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Audiology Training Suite
              </Typography>
              <Typography variant="body2" color="inherit">
                A comprehensive educational platform for audiology students and professionals.
                Practice and master a wide range of clinical skills essential for patient care.
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Learning Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
                <Link component={RouterLink} to="/tutorial" color="inherit" underline="hover">
                  Pure Tone Audiometry
                </Link>
                <Link component={RouterLink} to="/ear-anatomy" color="inherit" underline="hover">
                  Ear Anatomy
                </Link>
                <Link component={RouterLink} to="/otoscopy" color="inherit" underline="hover">
                  Otoscopy
                </Link>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h6" gutterBottom>
                Practice & Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link component={RouterLink} to="/patients" color="inherit" underline="hover">
                  Virtual Patients
                </Link>
                <Link component={RouterLink} to="/real-ear-measurement" color="inherit" underline="hover">
                  Real Ear Measurement
                </Link>
                <Link component={RouterLink} to="/followup" color="inherit" underline="hover">
                  Hearing Aid Follow-Up
                </Link>
                <Link component={RouterLink} to="/troubleshooting" color="inherit" underline="hover">
                  Troubleshooting Guide
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" align="center">
            © 2025 Stephen Kanney. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;