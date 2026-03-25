/**
 * Static data, labels, and content for the Real Ear Measurement (REM) page.
 *
 * Extracted from RealEarMeasurementPage to keep the page component lean.
 */

import { REMFrequency } from '../interfaces/RealEarMeasurementTypes';

// ---------------------------------------------------------------------------
// Step labels for the 8-step stepper
// ---------------------------------------------------------------------------

export const REM_STEP_LABELS: readonly string[] = [
  'Setup Equipment',
  'Position Probe Tube',
  'REUR Measurement',
  'REOR Measurement',
  'REAR Measurement',
  'REIG Calculation',
  'Compare to Target',
  'Adjust Frequency Response',
] as const;

// ---------------------------------------------------------------------------
// All REM frequencies used in adjustment controls
// ---------------------------------------------------------------------------

export const REM_FREQUENCIES_UI: readonly REMFrequency[] = [
  125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000,
] as const;

// ---------------------------------------------------------------------------
// Measurement colour map (matches REMChart.tsx)
// ---------------------------------------------------------------------------

export const MEASUREMENT_COLORS: Record<string, string> = {
  REUR: '#2196F3',
  REOR: '#FF9800',
  REAR: '#4CAF50',
  REIG: '#9C27B0',
  RECD: '#F44336',
  RESR: '#795548',
};

// ---------------------------------------------------------------------------
// Probe tube slider marks
// ---------------------------------------------------------------------------

export const PROBE_DEPTH_MARKS = [
  { value: 0, label: '0mm' },
  { value: 10, label: '10mm' },
  { value: 20, label: '20mm (min)' },
  { value: 30, label: '30mm (max)' },
  { value: 40, label: '40mm' },
] as const;

// ---------------------------------------------------------------------------
// Measurement type descriptors
// ---------------------------------------------------------------------------

export interface MeasurementTypeInfo {
  value: string;
  label: string;
}

export const MEASUREMENT_TYPE_OPTIONS: MeasurementTypeInfo[] = [
  { value: 'REUR', label: 'REUR - Real Ear Unaided Response' },
  { value: 'REOR', label: 'REOR - Real Ear Occluded Response' },
  { value: 'REAR', label: 'REAR - Real Ear Aided Response' },
  { value: 'REIG', label: 'REIG - Real Ear Insertion Gain' },
  { value: 'RECD', label: 'RECD - Real Ear to Coupler Difference' },
  { value: 'RESR', label: 'RESR - Real Ear Saturation Response' },
];

export const SIGNAL_TYPE_OPTIONS = [
  { value: 'pure_tone_sweep', label: 'Pure Tone Sweep' },
  { value: 'speech_noise', label: 'Speech Noise' },
  { value: 'pink_noise', label: 'Pink Noise' },
  { value: 'white_noise', label: 'White Noise' },
  { value: 'ISTS_noise', label: 'ISTS Noise' },
] as const;

export const PRESCRIPTION_METHOD_OPTIONS = [
  { value: 'NAL-NL2', label: 'NAL-NL2' },
  { value: 'DSL', label: 'DSL v5.0' },
  { value: 'NAL-NL1', label: 'NAL-NL1' },
  { value: 'custom', label: 'Custom' },
] as const;

// ---------------------------------------------------------------------------
// Prescription method descriptions
// ---------------------------------------------------------------------------

export const PRESCRIPTION_DESCRIPTIONS: Record<string, string> = {
  'NAL-NL2':
    'NAL-NL2 is the second-generation nonlinear prescription procedure from NAL. It aims to maximize speech intelligibility while maintaining comfortable loudness.',
  DSL:
    'DSL v5.0 is designed to provide audibility of speech across a wide range of inputs, with special considerations for pediatric fittings.',
  'NAL-NL1':
    'NAL-NL1 is the original nonlinear prescription from NAL. It uses a similar approach to NAL-NL2 but with slightly more prescribed gain.',
  custom:
    'Custom prescription allows manual target specification for special cases or research purposes.',
};

// ---------------------------------------------------------------------------
// Measurement info text per type (used in the procedure step info panel)
// ---------------------------------------------------------------------------

export const MEASUREMENT_INFO: Record<string, { description: string; tips?: string[] }> = {
  REUR: {
    description:
      'Real Ear Unaided Response measures the natural resonance of the ear canal without a hearing aid. This is an important baseline measurement.',
    tips: [
      'The resonance peak should be around 2.7kHz-3kHz',
      'The 6kHz response should not drop below 0 dB',
      'Typical gain at peak should be around 10-15 dB',
      'The response should be smooth without sharp peaks or valleys',
    ],
  },
  REOR: {
    description:
      'Real Ear Occluded Response measures the response with the hearing aid in place but turned off. This shows the impact of blocking the ear canal.',
  },
  REAR: {
    description:
      'Real Ear Aided Response measures the response with the hearing aid in place and turned on. This is compared with targets to verify the fitting.',
  },
};

// ---------------------------------------------------------------------------
// Tutorial content data structures
// ---------------------------------------------------------------------------

export interface TutorialMeasurementCard {
  type: string;
  description: string;
}

export const TUTORIAL_MEASUREMENT_CARDS: TutorialMeasurementCard[] = [
  {
    type: 'REUR',
    description:
      'Real Ear Unaided Response - Measures the natural acoustic response of the ear canal without a hearing aid. This shows the natural resonance of the ear canal.',
  },
  {
    type: 'REOR',
    description:
      'Real Ear Occluded Response - Measures the response with the hearing aid in place but turned off. Shows the impact of blocking the ear canal.',
  },
  {
    type: 'REAR',
    description:
      'Real Ear Aided Response - Measures the response with the hearing aid in place and turned on. This is the actual output of the hearing aid in the ear.',
  },
  {
    type: 'REIG',
    description:
      'Real Ear Insertion Gain - The difference between REAR and REUR, showing the actual gain provided by the hearing aid in the patient\'s ear.',
  },
];

export const TUTORIAL_PROCEDURE_STEPS: { bold: string; text: string }[] = [
  { bold: 'Setup the equipment:', text: 'Select the appropriate patient, hearing aid, and ear.' },
  {
    bold: 'Position the probe tube:',
    text: 'Insert the probe tube to the correct depth in the ear canal, typically 25-28mm from the tragus for an adult.',
  },
  { bold: 'Measure REUR:', text: 'Record the unaided response of the ear canal.' },
  { bold: 'Insert hearing aid and measure REOR:', text: 'With the hearing aid in place but turned off.' },
  {
    bold: 'Turn on hearing aid and measure REAR:',
    text: 'With the hearing aid providing amplification.',
  },
  { bold: 'Calculate REIG:', text: 'Compare REAR to REUR to determine insertion gain.' },
  {
    bold: 'Compare to targets:',
    text: 'Compare the measurements to prescriptive targets (NAL-NL2, DSL v5.0, etc.).',
  },
  {
    bold: 'Make adjustments:',
    text: 'Adjust the hearing aid settings to better match the targets if needed.',
  },
];

export interface PatientInstruction {
  title: string;
  items: { bold: string; text: string }[];
}

export const PATIENT_INSTRUCTIONS: PatientInstruction[] = [
  {
    title: 'Before the Procedure',
    items: [
      {
        bold: 'Explain the purpose:',
        text: '"This test helps us make sure your hearing aids are providing the right amount of sound specifically for your ears. It\'s a quick, painless procedure that will help us get the best results from your hearing aids."',
      },
      {
        bold: 'Set expectations:',
        text: '"You\'ll feel me placing a thin, soft tube in your ear canal, followed by your hearing aid. You\'ll hear different sounds during the test. You don\'t need to respond to these sounds - just sit still and remain quiet."',
      },
      {
        bold: 'Position instructions:',
        text: '"Please sit facing forward and try not to move your head during the measurements. This helps us get accurate readings."',
      },
    ],
  },
  {
    title: 'During the Procedure',
    items: [
      {
        bold: 'Provide ongoing guidance:',
        text: '"I\'m going to place the tube in your ear now. You may feel a slight tickle, but it shouldn\'t be uncomfortable."',
      },
      {
        bold: 'Reassurance:',
        text: '"You\'re doing great. The test will take just a few more minutes."',
      },
      {
        bold: 'Movement reminders:',
        text: '"Please try to stay as still as possible while the measurement is running."',
      },
      {
        bold: 'Silence during measurements:',
        text: '"I\'ll need you to remain quiet during the actual measurements. I\'ll let you know when each one starts and ends."',
      },
    ],
  },
  {
    title: 'After the Procedure',
    items: [
      {
        bold: 'Explain the results:',
        text: '"These graphs show how your hearing aids are performing in your ears. The dotted line shows our target, and the solid line shows what your hearing aids are actually doing."',
      },
      {
        bold: 'Address adjustments:',
        text: '"Based on these measurements, I\'m going to make some fine-tuning adjustments to your hearing aids to better match your specific needs."',
      },
      {
        bold: 'Encourage feedback:',
        text: '"After we make these adjustments, please let me know how things sound to you. Your subjective experience is also important."',
      },
    ],
  },
];

export interface ChallengeCard {
  title: string;
  description: string;
  solutions: string[];
}

export const CHALLENGE_CARDS: ChallengeCard[] = [
  {
    title: 'Probe Tube Placement',
    description: 'Incorrect probe tube placement is one of the most common sources of error.',
    solutions: [
      'Mark the probe tube at appropriate depths (25-28mm adults, 20-22mm children).',
      'Use otoscopy before placement to understand individual ear canal anatomy.',
      'Check placement with otoscopy after insertion when possible.',
    ],
  },
  {
    title: 'Feedback',
    description: 'Acoustic feedback during REAR measurements can disrupt results.',
    solutions: [
      'Ensure proper hearing aid fit and seal before measurements.',
      'Temporarily reduce gain in regions causing feedback, then estimate target match.',
      'Consider using a larger dome or custom earmold if feedback persists.',
      "Position the probe tube so it's not touching the hearing aid receiver.",
    ],
  },
  {
    title: 'Small or Curved Ear Canals',
    description: 'Anatomical variations can make probe placement difficult.',
    solutions: [
      'For very small canals, adjust depth expectations (but ensure minimum 15mm past canal entrance).',
      'Apply slight pressure to the pinna to straighten the canal during insertion.',
      'Move very slowly and gently with nervous patients or difficult anatomies.',
    ],
  },
  {
    title: 'Cerumen (Earwax)',
    description: 'Excessive cerumen can block the probe tube or affect measurements.',
    solutions: [
      'Always perform otoscopy before beginning REM procedures.',
      'Refer for cerumen management if the canal is significantly occluded.',
      'Check probe tube openings for cerumen after each use and clean as needed.',
    ],
  },
  {
    title: 'Ambient Noise',
    description: 'Background noise can interfere with accurate measurements.',
    solutions: [
      'Conduct REM in the quietest available environment.',
      'Use equipment features designed to reduce ambient noise effects.',
      'Consider using higher intensity test signals (65-70 dB SPL instead of 50-55 dB SPL).',
      'Take a baseline measurement of room noise before beginning.',
    ],
  },
];

export interface ProTip {
  title: string;
  text: string;
}

export const PRO_TIPS: ProTip[] = [
  {
    title: 'Practice on Colleagues',
    text: 'Before working with patients, practice probe tube placement on willing colleagues or classmates to build confidence and skill.',
  },
  {
    title: 'Double-Check Equipment',
    text: 'Perform regular calibration checks and ensure your equipment is functioning properly before each session.',
  },
  {
    title: 'Document Everything',
    text: 'Keep detailed records of all measurements, including probe depth, test signals used, and any challenges encountered.',
  },
  {
    title: 'Use Visual Aids',
    text: 'Have diagrams or models to show patients what you\'re doing, especially for their first REM experience.',
  },
  {
    title: 'Standardize Your Process',
    text: 'Develop a consistent routine for REM to ensure you don\'t miss any steps, regardless of patient variables.',
  },
  {
    title: 'Explain as You Go',
    text: 'Narrate your actions to the patient, which both reassures them and helps you maintain your procedural flow.',
  },
];

// ---------------------------------------------------------------------------
// "Things to Avoid" warnings (tutorial tab)
// ---------------------------------------------------------------------------

export interface WarningItem {
  title: string;
  text: string;
}

export const THINGS_TO_AVOID: WarningItem[] = [
  {
    title: 'Never Force the Probe Tube',
    text: 'If you encounter resistance, pull back slightly and try a different angle. Forcing can cause discomfort.',
  },
  {
    title: "Don't Skip Otoscopy",
    text: 'Always examine the ear canal before insertion to check for obstructions, irritation, or unusual anatomy.',
  },
  {
    title: 'Avoid Comparing Incompatible Measurements',
    text: "Make sure you're comparing the correct measurement types (e.g., REAR with REAR targets, not REIG targets).",
  },
  {
    title: "Don't Rush Through Measurements",
    text: 'Take time to ensure proper probe placement and patient positioning. Rushing leads to inaccurate results.',
  },
  {
    title: 'Avoid Making Programming Changes Between REAR and REUG',
    text: 'When calculating REIG, ensure no hearing aid setting changes were made between these measurements.',
  },
  {
    title: "Don't Rely Solely on REM",
    text: 'While REM is crucial for verification, also consider patient subjective feedback to ensure comfort and satisfaction.',
  },
];

// ---------------------------------------------------------------------------
// Reference tab: troubleshooting warnings
// ---------------------------------------------------------------------------

export const REFERENCE_TROUBLESHOOTING: WarningItem[] = [
  {
    title: 'Feedback during measurement',
    text: "If feedback occurs, check that the hearing aid is properly sealed in the ear canal and that gain settings are appropriate for the patient's hearing loss.",
  },
  {
    title: 'Probe tube movement',
    text: 'If the probe tube moves during measurements, results will be inconsistent. Ensure the tube is securely placed and minimize patient movement.',
  },
  {
    title: 'Poor match to targets',
    text: "If measurements don't match targets despite adjustments, consider: Different hearing aid style or model; Acoustic modifications (vent size, dome type); Different prescription method.",
  },
];
