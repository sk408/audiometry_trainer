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
  Link
} from '@mui/material';
import {
  School,
  Person,
  Assessment,
  HearingOutlined,
  ArrowForward,
  Help,
  Info
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <HearingOutlined sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Pure Tone Audiometry Trainer
          </Typography>
          <Typography variant="h5" paragraph>
            A comprehensive training tool for audiology students to practice conducting hearing tests
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<School />}
              component={RouterLink}
              to="/tutorial"
              sx={{ px: 3, py: 1.5 }}
            >
              Start Tutorial
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<Person />}
              component={RouterLink}
              to="/patients"
              sx={{ px: 3, py: 1.5 }}
            >
              Practice with Patients
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'primary.main' }} />
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <School color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Educational Training
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
                  Start Learning
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'secondary.main' }} />
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HearingOutlined color="secondary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Virtual Patients
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Practice with a variety of virtual patients exhibiting different hearing loss patterns.
                  From normal hearing to complex mixed hearing loss profiles.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/patients"
                  color="secondary"
                  endIcon={<ArrowForward />}
                >
                  View Patients
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ height: 8, bgcolor: 'info.main' }} />
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment color="info" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3">
                    Performance Tracking
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Review your test results, compare your thresholds to actual patient values, 
                  and receive feedback on your technique to improve your clinical skills.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/results"
                  color="info"
                  endIcon={<ArrowForward />}
                >
                  View Results
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            How It Works
          </Typography>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Learn & Practice Pure Tone Audiometry
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Our application simulates a real audiometer, allowing you to present pure tones at various frequencies and intensities.
                    Follow the standardized Hughson-Westlake procedure to determine hearing thresholds.
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Features include:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li>
                      <Typography variant="body1" paragraph>
                        Web Audio API for precise tone generation (250-8000 Hz)
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" paragraph>
                        Interactive audiogram with standard symbols
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" paragraph>
                        Keyboard shortcuts for efficient testing
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        Detailed feedback and performance analytics
                      </Typography>
                    </li>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step 1
                      </Typography>
                      <School color="primary" sx={{ fontSize: 40, my: 2 }} />
                      <Typography variant="body2">
                        Complete the interactive tutorial to learn the procedure
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step 2
                      </Typography>
                      <Person color="secondary" sx={{ fontSize: 40, my: 2 }} />
                      <Typography variant="body2">
                        Select a virtual patient with a specific hearing profile
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step 3
                      </Typography>
                      <HearingOutlined color="success" sx={{ fontSize: 40, my: 2 }} />
                      <Typography variant="body2">
                        Conduct the audiometry test following proper protocol
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Step 4
                      </Typography>
                      <Assessment color="info" sx={{ fontSize: 40, my: 2 }} />
                      <Typography variant="body2">
                        Review results and get feedback on your performance
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Quick Start Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Ready to Get Started?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Help color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  New to Audiometry?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  If you're new to audiometric testing or need a refresher, our comprehensive tutorial
                  will guide you through the entire process, from basic concepts to advanced techniques.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to="/tutorial"
                  color="primary"
                  fullWidth
                >
                  Start Tutorial
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Info color="secondary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Ready to Practice?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  If you're already familiar with audiometric testing and want to practice your skills,
                  jump right into testing with our diverse set of virtual patients.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to="/patients"
                  color="secondary"
                  fullWidth
                >
                  Select a Patient
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'primary.contrastText', py: 4, mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Pure Tone Audiometry Trainer
              </Typography>
              <Typography variant="body2" color="inherit">
                A comprehensive educational tool for audiology students and professionals.
                Practice conducting hearing tests following the Hughson-Westlake procedure.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
                <Link component={RouterLink} to="/tutorial" color="inherit" underline="hover">
                  Tutorial
                </Link>
                <Link component={RouterLink} to="/patients" color="inherit" underline="hover">
                  Patients
                </Link>
                <Link component={RouterLink} to="/results" color="inherit" underline="hover">
                  Results
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="https://www.asha.org" target="_blank" color="inherit" underline="hover">
                  American Speech-Language-Hearing Association
                </Link>
                <Link href="https://www.audiology.org" target="_blank" color="inherit" underline="hover">
                  American Academy of Audiology
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Pure Tone Audiometry Trainer. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 