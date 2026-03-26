import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Divider,
  LinearProgress,
  useMediaQuery,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  School,
  Person,
  HearingOutlined,
  ArrowForward,
  HearingDisabled,
  ViewInAr,
  CheckCircle,
  PlayArrow,
  MenuBook,
  Assessment,
  MedicalServices,
  Build,
} from '@mui/icons-material';

interface PathwayModule {
  label: string;
  path: string;
}

interface Pathway {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'warning' | 'success';
  modules: PathwayModule[];
  startPath: string;
}

const PATHWAYS: Pathway[] = [
  {
    title: 'Foundations',
    description: 'Ear anatomy, otoscopy, and how hearing works',
    icon: <ViewInAr />,
    color: 'secondary',
    modules: [
      { label: 'Ear Anatomy', path: '/reference/anatomy' },
      { label: 'Otoscopy', path: '/assessment/otoscopy' },
    ],
    startPath: '/reference/anatomy',
  },
  {
    title: 'Assessment',
    description: 'Pure tone testing, masking, speech audiometry, and referrals',
    icon: <HearingOutlined />,
    color: 'primary',
    modules: [
      { label: 'Pure Tone Audiometry', path: '/assessment/pure-tone' },
      { label: 'Masking Practice', path: '/assessment/masking' },
      { label: 'Speech Audiometry', path: '/assessment/speech' },
      { label: 'Referrals', path: '/assessment/referrals' },
      { label: 'Special Tests', path: '/assessment/special-tests' },
    ],
    startPath: '/assessment/pure-tone',
  },
  {
    title: 'Hearing Aids',
    description: 'Follow-up, adjustments, troubleshooting, REM, and earmolds',
    icon: <HearingDisabled />,
    color: 'warning',
    modules: [
      { label: 'Follow-Up', path: '/hearing-aids/follow-up' },
      { label: 'Adjustments', path: '/hearing-aids/adjustments' },
      { label: 'Troubleshooting', path: '/hearing-aids/troubleshooting' },
      { label: 'Real Ear Measurement', path: '/hearing-aids/rem' },
      { label: 'Earmolds', path: '/hearing-aids/earmolds' },
    ],
    startPath: '/hearing-aids/follow-up',
  },
  {
    title: 'Clinical Practice',
    description: 'Virtual patients, masking scenarios, and clinical decision quizzes',
    icon: <School />,
    color: 'success',
    modules: [
      { label: 'Virtual Patients', path: '/practice/patients' },
      { label: 'Quizzes & Scenarios', path: '/practice/quizzes' },
    ],
    startPath: '/practice/patients',
  },
];

const LAST_VISITED_KEY = 'audiometryTrainer_lastVisited';

function getLastVisited(): { path: string; label: string } | null {
  try {
    const data = localStorage.getItem(LAST_VISITED_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [lastVisited, setLastVisited] = useState<{ path: string; label: string } | null>(null);

  useEffect(() => {
    setLastVisited(getLastVisited());
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 5, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <HearingOutlined sx={{ fontSize: { xs: 40, md: 60 }, mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } }}
          >
            Audiology Training Suite
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
            Your clinical skills companion for audiometric assessment and hearing aid management.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/assessment/pure-tone"
            sx={{ mt: 4, px: 4, py: 1.5 }}
          >
            Start the Learning Path
          </Button>
        </Container>
      </Box>

      {/* Pick Up Where You Left Off */}
      {lastVisited && (
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Pick up where you left off
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {lastVisited.label}
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to={lastVisited.path}
              variant="outlined"
              endIcon={<PlayArrow />}
            >
              Resume
            </Button>
          </Paper>
        </Container>
      )}

      {/* Learning Pathway Cards */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 1 }}>
          Learning Pathways
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Follow a structured learning path from foundations to advanced clinical practice
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {PATHWAYS.map((pathway) => (
            <Card
              key={pathway.title}
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderTop: 4,
                borderColor: `${pathway.color}.main`,
              }}
            >
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Box
                    sx={{
                      bgcolor: `${pathway.color}.main`,
                      color: `${pathway.color}.contrastText`,
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5,
                    }}
                  >
                    {pathway.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {pathway.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {pathway.description}
                </Typography>
                <Chip
                  label={`${pathway.modules.length} modules`}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1.5 }}
                />
                <List dense disablePadding>
                  {pathway.modules.map((mod) => (
                    <ListItem key={mod.path} disablePadding sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircle sx={{ fontSize: 16 }} color="disabled" />
                      </ListItemIcon>
                      <ListItemText
                        primary={mod.label}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={RouterLink}
                  to={pathway.startPath}
                  variant="contained"
                  color={pathway.color}
                  fullWidth
                  endIcon={<ArrowForward />}
                >
                  Start
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Clinical Reference Hub */}
      <Box sx={{ bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.04), py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 1 }}>
            Clinical Reference
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Core clinical guides for audiometric interpretation and hearing aid management
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            {[
              { title: 'Audiogram Patterns', description: '12 audiogram configurations with clinical characteristics, masking needs, and management strategies', path: '/reference/audiogram-patterns', icon: <Assessment />, color: 'primary' as const },
              { title: 'Clinical Decisions', description: 'Adjust, counsel, or refer framework with real-world scenarios and communication scripts', path: '/reference/clinical-decisions', icon: <MedicalServices />, color: 'secondary' as const },
              { title: 'Earmolds Guide', description: 'Types, materials, acoustic modifications, venting tradeoffs, and impression procedures', path: '/hearing-aids/earmolds', icon: <Build />, color: 'warning' as const },
              { title: 'Medical Referrals', description: 'Red flags, referral criteria, acoustic neuroma education, and patient communication', path: '/assessment/referrals', icon: <MenuBook />, color: 'error' as const },
            ].map((ref) => (
              <Card key={ref.title} elevation={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderTop: 4, borderColor: `${ref.color}.main` }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ bgcolor: `${ref.color}.main`, color: `${ref.color}.contrastText`, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5 }}>
                      {ref.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">{ref.title}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{ref.description}</Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button component={RouterLink} to={ref.path} variant="outlined" color={ref.color} fullWidth endIcon={<ArrowForward />}>
                    Open Guide
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* What's New */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.6)
            : '#f5f5f5',
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h5" gutterBottom align="center">
            What&apos;s New
          </Typography>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <List dense>
              <ListItem>
                <ListItemIcon><Chip label="NEW" color="error" size="small" /></ListItemIcon>
                <ListItemText
                  primary="Audiogram Patterns Guide"
                  secondary="12 audiogram configurations with clinical characteristics, masking needs, and management strategies"
                />
                <Button component={RouterLink} to="/reference/audiogram-patterns" size="small">View</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><Chip label="NEW" color="error" size="small" /></ListItemIcon>
                <ListItemText
                  primary="Clinical Decision-Making"
                  secondary="Adjust, counsel, or refer framework with 6 real-world scenarios and communication scripts"
                />
                <Button component={RouterLink} to="/reference/clinical-decisions" size="small">View</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><Chip label="NEW" color="error" size="small" /></ListItemIcon>
                <ListItemText
                  primary="Medical Referral Guide"
                  secondary="Learn when to refer patients for medical evaluation — including acoustic neuroma red flags"
                />
                <Button component={RouterLink} to="/assessment/referrals" size="small">View</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><Chip label="NEW" color="error" size="small" /></ListItemIcon>
                <ListItemText
                  primary="Earmolds & Amplification"
                  secondary="Comprehensive guide to earmold types, materials, acoustic modifications, and impressions"
                />
                <Button component={RouterLink} to="/hearing-aids/earmolds" size="small">View</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><Chip label="NEW" color="error" size="small" /></ListItemIcon>
                <ListItemText
                  primary="Complaint-Based Adjustments Guide"
                  secondary="20+ patient complaints mapped to specific frequency and gain adjustments"
                />
                <Button component={RouterLink} to="/hearing-aids/adjustments" size="small">View</Button>
              </ListItem>
              <Divider component="li" />
              <ListItem>
                <ListItemIcon><Chip label="UPD" color="primary" size="small" /></ListItemIcon>
                <ListItemText
                  primary="WRS Method Updated"
                  secondary="Presentation level now based on 2 kHz threshold + 30 dB for better ear separation"
                />
                <Button component={RouterLink} to="/assessment/speech" size="small">View</Button>
              </ListItem>
            </List>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
