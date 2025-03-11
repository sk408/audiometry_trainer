export interface ContourTestLoudnessRating {
  intensity: number; // dB HL
  rating: number;    // 0-7 loudness rating
}

export interface ContourTestResults {
  patientId?: string;
  testDate: Date;
  frequency: number; // Test frequency in Hz (typically 500, 1000, 2000, or 4000 Hz)
  ratings: ContourTestLoudnessRating[];
  mcl?: number; // Most Comfortable Level (dB HL)
  ucl?: number; // Uncomfortable Level (dB HL)
  ldt?: number; // Loudness Discomfort Threshold (dB HL)
  notes?: string;
}

export interface ContourTestAnalysis {
  isNormal: boolean;
  normalGrowth: boolean; // Whether loudness growth is normal
  hyperacusis: boolean;  // Potential hyperacusis indicator
  recruitment: boolean;  // Potential recruitment indicator
  abnormalitiesDescription?: string;
  recommendations?: string[];
} 