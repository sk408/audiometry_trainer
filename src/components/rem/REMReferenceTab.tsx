/**
 * REMReferenceTab — Reference content for the REM page.
 *
 * Contains detailed information about prescription methods, probe placement,
 * NAL-NL2 deep-dive, manufacturer formula comparison, and troubleshooting.
 */

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';

import { REFERENCE_TROUBLESHOOTING } from '../../data/remData';

const REMReferenceTab: React.FC = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h5" gutterBottom>
      Reference Materials
    </Typography>

    {/* ---- Prescription methods overview ---- */}
    <Typography variant="h6" sx={{ mt: 3 }}>
      Prescription Methods
    </Typography>
    <Typography paragraph>
      <strong>NAL-NL2:</strong> The National Acoustic Laboratories' nonlinear
      prescription, version 2. This formula aims to maximize speech
      intelligibility while maintaining comfortable loudness. It's widely used
      for adults with acquired hearing loss.
    </Typography>
    <Typography paragraph>
      <strong>DSL v5.0:</strong> Desired Sensation Level, version 5.0. This
      method focuses on audibility across a wide range of input levels and is
      commonly used for pediatric fittings.
    </Typography>

    {/* ---- NAL-NL2 deep-dive ---- */}
    <Card sx={{ mb: 4, mt: 2 }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          NAL-NL2 In-Depth
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Calculation Methodology
        </Typography>
        <Typography variant="body2" paragraph>
          NAL-NL2 uses a complex calculation process that considers multiple
          variables to generate prescriptive targets:
        </Typography>
        <ol>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Loudness Normalization:</strong> The fundamental principle
              is to make all frequency bands contribute equally to loudness
              perception. This differs from previous methods that focused on
              equalizing specific sensation levels.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Input Level Compensation:</strong> NAL-NL2 applies
              different gain prescriptions based on input level (typically 50,
              65, and 80 dB SPL). This creates a compression response that
              mimics normal loudness growth.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Individual Factors Adjustment:</strong> The formula
              includes corrections for:
              <ul>
                <li>Gender (typically less gain for males)</li>
                <li>Age (reduced high-frequency gain for older adults)</li>
                <li>
                  Experience level (gradual increase in gain for new users)
                </li>
                <li>Language background (tonal vs. non-tonal languages)</li>
              </ul>
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Binaural Summation:</strong> When fitting binaurally,
              NAL-NL2 reduces gain by approximately 2-3 dB compared to monaural
              fittings, accounting for binaural loudness summation.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Severe-to-Profound Adaptation:</strong> For severe and
              profound hearing losses, NAL-NL2 provides proportionally more gain
              in low and mid frequencies and less in high frequencies compared to
              moderate losses.
            </Typography>
          </li>
        </ol>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          The NAL-NL2 Formula Components
        </Typography>
        <Typography variant="body2" paragraph>
          While the exact mathematical formula is complex, NAL-NL2 essentially
          calculates Real Ear Insertion Gain (REIG) using this conceptual
          framework:
        </Typography>
        <Typography
          variant="body2"
          component="div"
          sx={{
            pl: 2,
            borderLeft: '3px solid',
            borderColor: 'primary.light',
            mb: 2,
          }}
        >
          <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
            REIG = Base gain × Level adjustment × Individual factors
          </pre>
          <p>Where:</p>
          <ul>
            <li>Base gain is determined from the audiogram and frequency</li>
            <li>Level adjustment creates the compression characteristics</li>
            <li>
              Individual factors include age, gender, experience, and hearing
              loss configuration
            </li>
          </ul>
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 3 }}>
          Rationale Behind NAL-NL2
        </Typography>
        <Typography variant="body2" paragraph>
          NAL-NL2 was developed based on research with over 200 hearing aid
          users and was designed to address limitations in NAL-NL1:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Preferred Gain:</strong> NAL-NL2 provides approximately
              2-3 dB less gain than NAL-NL1, based on studies of user preference.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Speech Intelligibility Models:</strong> It incorporates
              updated speech intelligibility models that account for hearing aid
              processing effects.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Loudness Restoration:</strong> NAL-NL2 aims to restore
              loudness perception to normal levels without overamplifying, which
              can cause discomfort.
            </Typography>
          </li>
        </ul>
      </CardContent>
    </Card>

    {/* ---- Manufacturer formula comparison ---- */}
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Comparison: NAL-NL2 vs. Manufacturer Formulas
        </Typography>

        <Typography variant="body2" paragraph>
          Manufacturer-specific fitting formulas often differ from NAL-NL2 in
          significant ways. Understanding these differences is crucial for
          clinical decision-making.
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Key Differences
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary">
                  Gain Differences
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>NAL-NL2:</strong> Typically prescribes less gain,
                  especially in low frequencies. Targets highest gain in
                  mid-frequencies where speech information is most important.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Manufacturer Formulas:</strong> Often prescribe 3-8 dB
                  more overall gain than NAL-NL2, particularly in low
                  frequencies. This can make hearing aids sound "fuller"
                  initially but may lead to issues with occlusion and user
                  comfort.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary">
                  Compression Characteristics
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>NAL-NL2:</strong> Uses moderate compression ratios
                  tailored to hearing loss severity. Focuses on maintaining
                  speech intelligibility.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Manufacturer Formulas:</strong> May implement more
                  aggressive compression, especially in proprietary "comfort"
                  programs. Some formulas use frequency-specific compression
                  ratios that differ substantially from research-based
                  approaches.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary">
                  First-Fit Accuracy
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>NAL-NL2:</strong> Research shows when properly
                  implemented, NAL-NL2 can achieve close matches to targets.
                  However, this requires accurate audiometric data and real-ear
                  verification.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Manufacturer Formulas:</strong> Studies show first-fits
                  from manufacturers often deviate from NAL-NL2 targets by 7-10
                  dB at certain frequencies, even when the software claims to
                  implement NAL-NL2.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary">
                  Adaptation Management
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>NAL-NL2:</strong> Includes a one-time adaptation
                  adjustment based on hearing aid experience, reducing gain by
                  approximately 2-6 dB for new users.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Manufacturer Formulas:</strong> Often implement
                  progressive adaptation with multiple stages, automatically
                  increasing gain over weeks or months. Some manufacturers may
                  reduce gain by 10-15 dB initially, which can compromise early
                  benefit.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 3 }}>
          Common Proprietary Formula Characteristics
        </Typography>
        <Typography variant="body2" paragraph>
          While each manufacturer uses different approaches, some patterns
          emerge in proprietary formulas:
        </Typography>
        <ul>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Phonak (APD/Adaptive Phonak Digital):</strong> Tends to
              prescribe more low and high-frequency gain than NAL-NL2. Uses
              speech-based processing that can result in different real-world
              gains than static measurements.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Oticon (VAC+/Voice Aligned Compression):</strong>{' '}
              Generally prescribes more low-frequency gain and may use less
              compression at certain input levels compared to NAL-NL2.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Widex (DREAM/COMPASS):</strong> Typically applies more
              low-frequency gain and may use different compression time constants
              than assumed in NAL-NL2 development.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>Signia/Sivantos (Nx-Fit):</strong> Often provides less
              gain in mid frequencies and more in low frequencies than NAL-NL2
              prescribes.
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <strong>ReSound (Audiogram+):</strong> Generally closer to NAL-NL2
              in mid-frequencies but may apply different gain for soft and loud
              inputs.
            </Typography>
          </li>
        </ul>

        <Typography variant="subtitle1" sx={{ mt: 3 }}>
          Clinical Implications
        </Typography>
        <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
          <Typography variant="body2">
            <strong>Always verify:</strong> Due to significant variations between
            prescribed and delivered gain, real ear measurement verification is
            essential regardless of which formula is selected.
          </Typography>
        </Alert>
        <Typography variant="body2" paragraph>
          When REM verification shows substantial deviations from NAL-NL2
          targets, clinicians must decide whether to:
        </Typography>
        <ol>
          <li>
            <Typography variant="body2" paragraph>
              Adjust the hearing aid to match NAL-NL2 targets (evidence-based
              approach)
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              Trust the manufacturer's proprietary approach (may reflect unique
              signal processing benefits)
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              Find a middle ground based on patient feedback and clinical
              judgment
            </Typography>
          </li>
        </ol>
        <Typography variant="body2" paragraph>
          This decision should consider patient preferences, previous hearing
          aid experience, and the specific features of the hearing aid being
          fitted.
        </Typography>
      </CardContent>
    </Card>

    {/* ---- Probe tube placement ---- */}
    <Typography variant="h6" sx={{ mt: 3 }}>
      Proper Probe Tube Placement
    </Typography>
    <Typography paragraph>
      For accurate measurements, the probe tube should be placed within 5-6mm of
      the tympanic membrane. For average adults, this is approximately 25-28mm
      from the tragus. Placement that is too shallow will result in inaccurate
      high-frequency measurements.
    </Typography>

    {/* ---- Troubleshooting ---- */}
    <Typography variant="h6" sx={{ mt: 3 }}>
      Common Issues and Troubleshooting
    </Typography>
    <Box sx={{ mt: 1 }}>
      {REFERENCE_TROUBLESHOOTING.map((item, i) => (
        <Alert severity="warning" sx={{ mb: 2 }} key={i}>
          <Typography variant="subtitle2">{item.title}</Typography>
          <Typography variant="body2">{item.text}</Typography>
        </Alert>
      ))}
    </Box>
  </Box>
);

export default REMReferenceTab;
