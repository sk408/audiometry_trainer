/**
 * Interfaces for Real Ear Measurement (REM) related types
 */

// Types of REM measurements
export type REMType = 'REUR' | 'REOR' | 'RECD' | 'REAR' | 'REIG' | 'RESR';

// Frequency range for REM
export type REMFrequency = 125 | 250 | 500 | 750 | 1000 | 1500 | 2000 | 3000 | 4000 | 6000 | 8000;

// Input signal types for REM
export type REMSignalType = 'pure_tone_sweep' | 'speech_noise' | 'pink_noise' | 'white_noise' | 'ICRA_noise';

// Signal levels for REM
export type REMLevel = 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90;

// Earmold/Dome vent types
export enum VentType {
  OCCLUDED = 'occluded',
  SMALL_VENT = 'small_vent',
  MEDIUM_VENT = 'medium_vent',
  LARGE_VENT = 'large_vent',
  OPEN_DOME = 'open_dome'
}

// Probe tube positioning status
export enum ProbePosition {
  TOO_SHALLOW = 'too_shallow',
  TOO_DEEP = 'too_deep',
  CORRECT = 'correct',
  NOT_INSERTED = 'not_inserted'
}

// REM measurement point data
export interface REMMeasurementPoint {
  frequency: REMFrequency;
  gain: number; // Gain in dB
}

// Complete REM curve
export interface REMCurve {
  type: REMType;
  ear: 'left' | 'right';
  signalType: REMSignalType;
  inputLevel: REMLevel;
  measurementPoints: REMMeasurementPoint[];
  timestamp: string;
}

// REM target curve (for comparing actual measurements)
export interface REMTarget {
  type: REMType;
  ear: 'left' | 'right';
  patientId: string;
  targetPoints: REMMeasurementPoint[];
  prescriptionMethod: 'NAL-NL2' | 'DSL' | 'NAL-NL1' | 'custom';
}

// Virtual hearing aid configuration for REM
export interface VirtualHearingAid {
  id: string;
  name: string;
  manufacturer: string;
  type: 'BTE' | 'RIC' | 'ITE' | 'ITC' | 'CIC';
  maxGain: number;
  maxOutput: number;
  channels: number;
  features: string[];
  defaultSettings: {
    [frequency: number]: number; // Frequency-specific gain settings
  };
}

// REM session tracking
export interface REMSession {
  id: string;
  patientId: string;
  startTime: string;
  completed: boolean;
  hearingAidId: string;
  probeTubePosition: ProbePosition;
  ventType: VentType;
  measurements: REMCurve[];
  targets: REMTarget[];
  currentStep: REMType;
  errors: string[];
  accuracy: number; // Percentage score based on measurement vs. target
}

// Error types specific to REM
export enum REMErrorType {
  PROBE_POSITIONING = 'probe_positioning',
  FEEDBACK = 'feedback',
  PATIENT_MOVEMENT = 'patient_movement',
  SOUND_LEAKAGE = 'sound_leakage',
  EQUIPMENT_CALIBRATION = 'equipment_calibration'
} 