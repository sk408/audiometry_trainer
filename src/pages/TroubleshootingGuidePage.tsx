import React, { useState, ReactNode } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent
} from '@mui/material';
import {
  HearingOutlined,
  Build,
  BluetoothConnected,
  BatteryAlert,
  VolumeOff,
  Settings,
  Help,
  ExpandMore,
  Print,
  SaveAlt,
  QrCode2,
  ArrowForward,
  ArrowBack,
  Assignment
} from '@mui/icons-material';
import QRCode from 'qrcode.react'; // QR code generation for videos and instructions

// Define type for hearing aid brand
interface HearingAidBrand {
  id: string;
  name: string;
  logo: string;
  manualUrl: string;
  pairingVideoUrl: string;
  cleaningVideoUrl: string;
  batteryUrl: string;
  troubleshootingUrl: string;
}

// Define type for platform-specific instructions
interface PlatformSpecificInstructions {
  title: string;
  steps: string[];
  url: string;
}

// Define type for troubleshooting category
interface TroubleshootingCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  steps: string[];
  platformSpecific?: {
    ios: PlatformSpecificInstructions;
    android: PlatformSpecificInstructions;
  };
}

// Define our hearing aid brands
const HEARING_AID_BRANDS: HearingAidBrand[] = [
  {
    id: 'jabra',
    name: 'Jabra Enhance Pro 20',
    logo: '/apprentice/assets/images/jabra-logo.png',
    manualUrl: 'https://www.jabra.com/supportpages/jabra-enhance-plus/hsb001/documentation',
    pairingVideoUrl: 'https://www.youtube.com/watch?v=8rQWLSfpIw4',
    cleaningVideoUrl: 'https://www.youtube.com/watch?v=_KhxAOxoRkU',
    batteryUrl: 'https://www.jabra.com/supportpages/jabra-enhance-plus/hsb001/faq/Battery',
    troubleshootingUrl: 'https://www.jabra.com/supportpages/jabra-enhance-plus/hsb001/troubleshooting',
  },
  {
    id: 'rexton',
    name: 'Rexton Reach',
    logo: '/apprentice/assets/images/rexton-logo.png',
    manualUrl: 'https://www.rexton.com/en-us/help/user-guides',
    pairingVideoUrl: 'https://www.youtube.com/watch?v=8KU-g_xCY3I',
    cleaningVideoUrl: 'https://www.youtube.com/watch?v=f0KlA_HWz6M',
    batteryUrl: 'https://www.rexton.com/en-us/help/how-to-videos/battery-change',
    troubleshootingUrl: 'https://www.rexton.com/en-us/help/troubleshooting',
  },
  {
    id: 'philips',
    name: 'Philips 9050',
    logo: '/apprentice/assets/images/philips-logo.png',
    manualUrl: 'https://www.hearingsolutions.philips.com/en-us/support-for-professionals/user-guides',
    pairingVideoUrl: 'https://www.youtube.com/watch?v=pxfJWR8EcTQ',
    cleaningVideoUrl: 'https://www.youtube.com/watch?v=zTH5PoneoIU',
    batteryUrl: 'https://www.hearingsolutions.philips.com/en-us/support-for-professionals/how-to-videos/changing-hearing-aid-battery',
    troubleshootingUrl: 'https://www.hearingsolutions.philips.com/en-us/support-for-professionals/troubleshooting-guide',
  }
];

// Define common troubleshooting categories
const TROUBLESHOOTING_CATEGORIES: TroubleshootingCategory[] = [
  {
    id: 'not-working',
    title: 'Hearing Aid Not Working',
    icon: <VolumeOff />,
    steps: [
      "Check if the hearing aid is turned on (open and close the battery door or check power button)",
      "Replace the battery/ensure rechargeable aid is charged",
      "Clean the hearing aid and check for wax blockage",
      "Replace wax guards if necessary",
      "If still not working, contact your hearing care provider"
    ]
  },
  {
    id: 'bluetooth',
    title: 'Bluetooth Not Connecting',
    icon: <BluetoothConnected />,
    steps: [
      "Make sure Bluetooth is enabled on your device",
      "Ensure hearing aids are powered on and in pairing mode",
      "Try restarting your phone/device",
      "Try restarting your hearing aids (open/close battery door or place in charger)",
      "Forget the device in Bluetooth settings and re-pair"
    ],
    platformSpecific: {
      ios: {
        title: "iOS Pairing Instructions",
        steps: [
          "Go to Settings > Accessibility > Hearing Devices",
          "Make sure Bluetooth is turned on",
          "Put hearing aids in pairing mode (open/close battery door or press pairing button)",
          "Select your hearing aids when they appear",
          "Tap 'Pair' when prompted"
        ],
        url: "https://support.apple.com/en-us/HT201466"
      },
      android: {
        title: "Android Pairing Instructions",
        steps: [
          "Go to Settings > Connected devices > Pair new device",
          "Make sure Bluetooth is turned on",
          "Put hearing aids in pairing mode (open/close battery door or press pairing button)",
          "Select your hearing aids when they appear",
          "Tap 'Pair' when prompted"
        ],
        url: "https://support.google.com/android/answer/9075925?hl=en"
      }
    }
  },
  {
    id: 'battery',
    title: 'Battery Issues',
    icon: <BatteryAlert />,
    steps: [
      "Make sure you're using the correct battery size",
      "Check for corrosion on battery contacts",
      "For rechargeable aids, ensure the charging contacts are clean",
      "Try a fresh pack of batteries",
      "If battery drains quickly, reduce streaming time or consult provider"
    ]
  },
  {
    id: 'feedback',
    title: 'Feedback/Whistling',
    icon: <VolumeOff />,
    steps: [
      "Ensure the hearing aid is inserted properly",
      "Check for ear wax buildup in your ear",
      "Check for cracks in tubing (if applicable)",
      "Lower the volume slightly",
      "Contact your provider for possible adjustment"
    ]
  },
  {
    id: 'physical',
    title: 'Physical Comfort Issues',
    icon: <Build />,
    steps: [
      "Make sure you're inserting the hearing aid correctly",
      "Check if the dome/earmold size is appropriate",
      "For irritation, clean the hearing aid and your ear",
      "Allow your ear time to adjust (usually 1-2 weeks)",
      "If discomfort persists, contact your provider"
    ]
  }
];

const generateGuideHTML = (brand: string, selectedCategory: string | undefined = undefined): string => {
  const brandInfo = HEARING_AID_BRANDS.find(b => b.id === brand);
  if (!brandInfo) return '';

  const categories = selectedCategory 
    ? TROUBLESHOOTING_CATEGORIES.filter(c => c.id === selectedCategory)
    : TROUBLESHOOTING_CATEGORIES;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hearing Aid Troubleshooting Guide - ${brandInfo.name}</title>
  <style>
    @media print {
      @page {
        size: letter;
        margin: 0.5in;
      }
      body {
        font-size: 12pt;
      }
      .no-print {
        display: none;
      }
      .page-break {
        page-break-after: always;
      }
      .qr-code {
        width: 100px;
        height: 100px;
      }
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    
    h2 {
      color: #2980b9;
      margin-top: 30px;
    }
    
    h3 {
      color: #34495e;
    }
    
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .logo {
      max-width: 150px;
      margin-right: 20px;
    }
    
    .troubleshooting-section {
      margin-bottom: 30px;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
    }
    
    ol, ul {
      margin-left: 20px;
      margin-bottom: 20px;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    .resources {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-top: 30px;
    }
    
    .qr-section {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 20px;
    }
    
    .qr-item {
      text-align: center;
      width: 150px;
    }
    
    .qr-code {
      display: block;
      margin: 0 auto 10px;
    }
    
    .button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 20px;
    }
    
    .button:hover {
      background-color: #2980b9;
    }
    
    .no-print {
      margin-top: 30px;
      text-align: center;
    }
    
    .footer {
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 15px;
      font-size: 0.9em;
      color: #7f8c8d;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Hearing Aid Troubleshooting Guide</h1>
  </div>
  
  <h2>${brandInfo.name}</h2>
  
  <div class="resources">
    <h3>Quick Resources</h3>
    <ul>
      <li><strong>User Manual:</strong> <a href="${brandInfo.manualUrl}" target="_blank">View Online Manual</a></li>
      <li><strong>Support Website:</strong> <a href="${brandInfo.troubleshootingUrl}" target="_blank">Visit Support Website</a></li>
    </ul>
  </div>

  ${categories.map(category => `
  <div class="troubleshooting-section">
    <h3>${category.title}</h3>
    <ol>
      ${category.steps.map(step => `<li>${step}</li>`).join('')}
    </ol>
    
    ${category.id === 'bluetooth' && category.platformSpecific ? `
    <div class="platform-specific">
      <h4>Device-Specific Instructions</h4>
      
      <h5>iPhone/iPad</h5>
      <ol>
        ${category.platformSpecific.ios.steps.map(step => `<li>${step}</li>`).join('')}
      </ol>
      <p>For detailed instructions: <a href="${category.platformSpecific.ios.url}" target="_blank">Apple Support</a></p>
      
      <h5>Android Devices</h5>
      <ol>
        ${category.platformSpecific.android.steps.map(step => `<li>${step}</li>`).join('')}
      </ol>
      <p>For detailed instructions: <a href="${category.platformSpecific.android.url}" target="_blank">Android Support</a></p>
    </div>
    ` : ''}
  </div>
  `).join('')}
  
  <div class="qr-section">
    <div class="qr-item">
      <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(brandInfo.pairingVideoUrl)}" alt="QR Code for Pairing Video">
      <p>Bluetooth Pairing Video</p>
    </div>
    
    <div class="qr-item">
      <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(brandInfo.cleaningVideoUrl)}" alt="QR Code for Cleaning Video">
      <p>Cleaning Instructions Video</p>
    </div>
    
    <div class="qr-item">
      <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(brandInfo.manualUrl)}" alt="QR Code for User Manual">
      <p>User Manual</p>
    </div>
  </div>
  
  <div class="footer">
    <p>This guide is provided as a resource for basic troubleshooting. For persistent issues, please contact your hearing healthcare provider.</p>
    <p>© ${new Date().getFullYear()} Audiometry Trainer. All rights reserved.</p>
  </div>
  
  <div class="no-print">
    <button class="button" onclick="window.print()">Print This Guide</button>
  </div>
</body>
</html>
  `;
};

const TroubleshootingGuidePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleBrandChange = (event: SelectChangeEvent<string>) => {
    setSelectedBrand(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const handleGenerateGuide = () => {
    if (selectedBrand) {
      // Generate and save the guide HTML
      const html = generateGuideHTML(selectedBrand, selectedCategory || undefined);
      const brand = HEARING_AID_BRANDS.find(b => b.id === selectedBrand);
      const filename = `${brand?.name.replace(/\s+/g, '_')}_troubleshooting_guide.html`;
      
      // Create a Blob with the HTML content
      const blob = new Blob([html], { type: 'text/html' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Save a copy to the public directory for access via URL
      // This is typically handled server-side, but we'll assume it's saved to the right location
      const publicPath = `/apprentice/assets/guides/${filename}`;
      
      // Open the preview dialog
      setPreviewDialogOpen(true);
    }
  };

  const handleNext = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleFinish = () => {
    setCurrentStep(0);
    setSelectedBrand('');
    setSelectedCategory('');
  };

  const findBrandById = (id: string) => HEARING_AID_BRANDS.find(brand => brand.id === id);
  const findCategoryById = (id: string) => TROUBLESHOOTING_CATEGORIES.find(cat => cat.id === id);

  return (
    <Container maxWidth="lg" sx={{ mb: 8, mt: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <HearingOutlined fontSize="large" color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Hearing Aid Troubleshooting Guide Generator
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Create personalized troubleshooting guides for your patients based on their hearing aid model. These 
          guides include step-by-step instructions, QR codes to instructional videos, and can be printed for 
          easy reference.
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        <Stepper activeStep={currentStep} orientation={isMobile ? "vertical" : "horizontal"} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Select Hearing Aid</StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Choose the specific hearing aid model your patient is using.
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="brand-select-label">Hearing Aid Brand/Model</InputLabel>
                <Select
                  labelId="brand-select-label"
                  id="brand-select"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  label="Hearing Aid Brand/Model"
                >
                  <MenuItem value="" disabled>Select a brand</MenuItem>
                  {HEARING_AID_BRANDS.map(brand => (
                    <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedBrand}
                endIcon={<ArrowForward />}
              >
                Next
              </Button>
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Choose Issue (Optional)</StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Select a specific issue to focus on, or leave blank to include all troubleshooting topics.
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="category-select-label">Troubleshooting Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Troubleshooting Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {TROUBLESHOOTING_CATEGORIES.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                >
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Generate Guide</StepLabel>
            <StepContent>
              <Typography variant="body2" paragraph>
                Review your selections and generate a printable troubleshooting guide:
              </Typography>
              
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1">Selected Hearing Aid:</Typography>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {findBrandById(selectedBrand)?.name || 'None selected'}
                </Typography>
                
                <Typography variant="subtitle1">Selected Category:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {selectedCategory 
                    ? findCategoryById(selectedCategory)?.title 
                    : 'All Categories'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleGenerateGuide}
                  startIcon={<QrCode2 />}
                >
                  Generate Guide
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
        
        {currentStep === 3 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Guide Generated Successfully!
            </Typography>
            <Typography variant="body2" paragraph>
              Your guide has been created and downloaded. You can also open it in a new tab to print.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleFinish}
              >
                Create Another Guide
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Print />}
                onClick={() => {
                  const brand = findBrandById(selectedBrand);
                  if (brand) {
                    const filename = `${brand.name.replace(/\s+/g, '_')}_troubleshooting_guide.html`;
                    window.open(`/apprentice/assets/guides/${filename}`, '_blank');
                  }
                }}
              >
                Open Guide for Printing
              </Button>
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h5" gutterBottom>
          Common Troubleshooting Categories
        </Typography>
        
        {TROUBLESHOOTING_CATEGORIES.map((category) => (
          <Accordion key={category.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {category.icon}
                </ListItemIcon>
                <Typography variant="subtitle1">{category.title}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                Common steps to troubleshoot this issue:
              </Typography>
              <List>
                {category.steps.map((step, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{index + 1}.</Typography>
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
              
              {category.id === 'bluetooth' && category.platformSpecific && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Platform-Specific Instructions:
                  </Typography>
                  
                  <Accordion sx={{ mt: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>iPhone/iPad Instructions</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {category.platformSpecific.ios.steps.map((step, index) => (
                          <ListItem key={index}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Typography variant="body2">{index + 1}.</Typography>
                            </ListItemIcon>
                            <ListItemText primary={step} />
                          </ListItem>
                        ))}
                      </List>
                      <Button 
                        size="small" 
                        href={category.platformSpecific.ios.url} 
                        target="_blank"
                        sx={{ mt: 1 }}
                      >
                        Apple Support Article
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Accordion sx={{ mt: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Android Instructions</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {category.platformSpecific.android.steps.map((step, index) => (
                          <ListItem key={index}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Typography variant="body2">{index + 1}.</Typography>
                            </ListItemIcon>
                            <ListItemText primary={step} />
                          </ListItem>
                        ))}
                      </List>
                      <Button 
                        size="small" 
                        href={category.platformSpecific.android.url} 
                        target="_blank"
                        sx={{ mt: 1 }}
                      >
                        Android Support Article
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        
        <Dialog
          open={previewDialogOpen}
          onClose={() => setPreviewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Guide Preview</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" paragraph>
                Your troubleshooting guide has been generated. You can:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Print /></ListItemIcon>
                  <ListItemText primary="Print the guide directly from the new tab" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><SaveAlt /></ListItemIcon>
                  <ListItemText primary="Save the HTML file to your computer" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><QrCode2 /></ListItemIcon>
                  <ListItemText primary="QR codes in the guide link to instructional videos" />
                </ListItem>
              </List>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
            <Button 
              variant="contained"
              onClick={() => {
                setPreviewDialogOpen(false);
                setCurrentStep(3);
              }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default TroubleshootingGuidePage; 