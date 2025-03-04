/**
 * Interfaces for audio-related types in the Pure Tone Audiometry Trainer
 */

// Standard audiometric frequencies in Hz
export type Frequency = 125 | 250 | 500 | 750 | 1000 | 1500 | 2000 | 3000 | 4000 | 6000 | 8000;

// Hearing levels in dB HL
export type HearingLevel = -10 | -5 | 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 
                           55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 100 | 105 | 110 | 115 | 120;

// Type of audiometric testing
export type TestType = 'air' | 'bone' | 'masked_air' | 'masked_bone';

// Ear being tested
export type Ear = 'left' | 'right';

// Symbol specification for audiogram plotting
export interface AudiogramSymbol {
  ear: Ear;
  testType: TestType;
  response: boolean; // true = response, false = no response
  symbol: string; // The actual symbol to display (e.g., 'O', 'X', etc.)
  color: string; // Color for the symbol
  fillColor?: string; // Optional fill color
}

// Threshold point on the audiogram
export interface ThresholdPoint {
  frequency: Frequency;
  hearingLevel: HearingLevel;
  ear: Ear;
  testType: TestType;
  responseStatus: 'threshold' | 'no_response' | 'not_tested';
}

// Patient hearing profile
export interface HearingProfile {
  id: string;
  name: string;
  description: string;
  thresholds: ThresholdPoint[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hearingLossType: 'normal' | 'conductive' | 'sensorineural' | 'mixed' | 'asymmetrical';
}

// Test result
export interface TestResult {
  patientId: string;
  timestamp: string;
  userThresholds: ThresholdPoint[];
  actualThresholds: ThresholdPoint[];
  accuracy: number; // Percentage of accuracy
  testDuration: number; // In seconds
  technicalErrors: string[]; // Description of errors in technique
}

// Test session for tracking progress
export interface TestSession {
  id: string;
  startTime: string;
  patientId: string;
  completed: boolean;
  results?: TestResult;
  testSequence: TestStep[];
  currentStep: number;
}

// Step in the Hughson-Westlake procedure
export interface TestStep {
  id: number;
  frequency: Frequency;
  ear: Ear;
  testType: TestType;
  currentLevel: HearingLevel;
  completed: boolean;
  responses: { level: HearingLevel, response: boolean }[];
  responseStatus?: 'threshold' | 'no_response' | 'not_tested';
} 