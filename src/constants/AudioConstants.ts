// Standard audiometric frequencies in Hz
export const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];

// Standard intensity levels in dB HL
export const INTENSITY_LEVELS = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];

// Ear selection options
export enum EAR {
  LEFT = 'left',
  RIGHT = 'right',
  BOTH = 'both'
}

// Hearing loss classification thresholds in dB HL
export const HEARING_LOSS_CLASSIFICATION = {
  NORMAL: { min: -10, max: 20 },
  MILD: { min: 21, max: 40 },
  MODERATE: { min: 41, max: 55 },
  MODERATELY_SEVERE: { min: 56, max: 70 },
  SEVERE: { min: 71, max: 90 },
  PROFOUND: { min: 91, max: 120 }
};

// Hearing loss types
export enum HEARING_LOSS_TYPE {
  NORMAL = 'normal',
  CONDUCTIVE = 'conductive',
  SENSORINEURAL = 'sensorineural',
  MIXED = 'mixed',
  ASYMMETRICAL = 'asymmetrical'
}

// Audiogram symbols
export const AUDIOGRAM_SYMBOLS = {
  RIGHT_AIR: 'O',
  LEFT_AIR: 'X',
  RIGHT_BONE: '<',
  LEFT_BONE: '>',
  RIGHT_BONE_MASKED: '[<]',
  LEFT_BONE_MASKED: '[>]',
  RIGHT_AIR_MASKED: '[O]',
  LEFT_AIR_MASKED: '[X]',
  NO_RESPONSE_RIGHT: '↓',
  NO_RESPONSE_LEFT: '↓'
};

// Default tone duration in seconds
export const DEFAULT_TONE_DURATION = 1.0;

// Default rise/fall time for tones in seconds
export const DEFAULT_RAMP_DURATION = 0.02; // 20ms

// Default testing protocol
export const DEFAULT_PROTOCOL = 'hughson-westlake';

// Default starting level for testing in dB HL
export const DEFAULT_STARTING_LEVEL = 40; 