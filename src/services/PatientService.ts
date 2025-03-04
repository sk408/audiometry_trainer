import { HearingProfile, ThresholdPoint } from '../interfaces/AudioTypes';

/**
 * PatientService - Manages virtual patients with different hearing profiles
 */
class PatientService {
  private patients: HearingProfile[] = [];

  constructor() {
    this.initializePatients();
  }

  /**
   * Initialize the predefined virtual patients
   */
  private initializePatients(): void {
    this.patients = [
      // Normal hearing
      {
        id: 'patient1',
        name: 'Alex Johnson',
        description: 'Young adult with normal hearing',
        difficulty: 'beginner',
        hearingLossType: 'normal',
        thresholds: this.generateNormalHearingThresholds()
      },
      
      // Mild high-frequency sensorineural hearing loss
      {
        id: 'patient2',
        name: 'Sarah Miller',
        description: 'Middle-aged with mild high-frequency sensorineural hearing loss',
        difficulty: 'beginner',
        hearingLossType: 'sensorineural',
        thresholds: this.generateMildHighFrequencyLoss()
      },
      
      // Moderate flat conductive hearing loss
      {
        id: 'patient3',
        name: 'Robert Chen',
        description: 'Adult with moderate flat conductive hearing loss',
        difficulty: 'intermediate',
        hearingLossType: 'conductive',
        thresholds: this.generateConductiveLoss()
      },
      
      // Asymmetrical sensorineural hearing loss
      {
        id: 'patient4',
        name: 'Maria Garcia',
        description: 'Elderly with asymmetrical sensorineural hearing loss',
        difficulty: 'intermediate',
        hearingLossType: 'asymmetrical',
        thresholds: this.generateAsymmetricalLoss()
      },
      
      // Mixed hearing loss
      {
        id: 'patient5',
        name: 'James Wilson',
        description: 'Adult with mixed hearing loss',
        difficulty: 'advanced',
        hearingLossType: 'mixed',
        thresholds: this.generateMixedLoss()
      },
      
      // Severe-profound hearing loss
      {
        id: 'patient6',
        name: 'Eliza Thompson',
        description: 'Child with severe-profound sensorineural hearing loss',
        difficulty: 'advanced',
        hearingLossType: 'sensorineural',
        thresholds: this.generateSevereProfoundLoss()
      }
    ];
  }

  /**
   * Generate thresholds for normal hearing
   */
  private generateNormalHearingThresholds(): ThresholdPoint[] {
    const frequencies = [250, 500, 1000, 2000, 3000, 4000, 8000] as const;
    const thresholds: ThresholdPoint[] = [];

    // Generate air conduction thresholds
    frequencies.forEach(freq => {
      // Normal hearing (0-15 dB HL)
      const rightLevel = this.getRandomLevel(0, 15) as any;
      const leftLevel = this.getRandomLevel(0, 15) as any;

      // Right ear air conduction
      thresholds.push({
        frequency: freq,
        hearingLevel: rightLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      // Left ear air conduction
      thresholds.push({
        frequency: freq,
        hearingLevel: leftLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      // Bone conduction (similar to air for normal hearing)
      if (freq <= 4000) { // Bone conduction testing typically only up to 4000 Hz
        thresholds.push({
          frequency: freq,
          hearingLevel: rightLevel,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });

        thresholds.push({
          frequency: freq,
          hearingLevel: leftLevel,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    });

    return thresholds;
  }

  /**
   * Generate thresholds for mild high-frequency sensorineural hearing loss
   */
  private generateMildHighFrequencyLoss(): ThresholdPoint[] {
    const frequencies = [250, 500, 1000, 2000, 3000, 4000, 8000] as const;
    const thresholds: ThresholdPoint[] = [];

    frequencies.forEach(freq => {
      // Determine hearing level based on frequency
      let rightLevel, leftLevel;
      
      if (freq <= 1000) {
        // Normal hearing at low frequencies
        rightLevel = this.getRandomLevel(5, 15) as any;
        leftLevel = this.getRandomLevel(5, 15) as any;
      } else if (freq <= 2000) {
        // Mild loss at mid frequencies
        rightLevel = this.getRandomLevel(20, 30) as any;
        leftLevel = this.getRandomLevel(20, 30) as any;
      } else {
        // Moderate loss at high frequencies
        rightLevel = this.getRandomLevel(35, 50) as any;
        leftLevel = this.getRandomLevel(35, 50) as any;
      }

      // Air conduction
      thresholds.push({
        frequency: freq,
        hearingLevel: rightLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      thresholds.push({
        frequency: freq,
        hearingLevel: leftLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      // Bone conduction (similar to air for sensorineural loss)
      if (freq <= 4000) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightLevel,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });

        thresholds.push({
          frequency: freq,
          hearingLevel: leftLevel,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    });

    return thresholds;
  }

  /**
   * Generate thresholds for conductive hearing loss
   */
  private generateConductiveLoss(): ThresholdPoint[] {
    const frequencies = [250, 500, 1000, 2000, 3000, 4000, 8000] as const;
    const thresholds: ThresholdPoint[] = [];
    
    // Air-bone gap of approximately 30-40 dB
    const airBoneGap = 35;

    frequencies.forEach(freq => {
      // Normal bone conduction
      const rightBoneLevel = this.getRandomLevel(0, 15) as any;
      const leftBoneLevel = this.getRandomLevel(0, 15) as any;
      
      // Elevated air conduction due to conductive component
      const rightAirLevel = (rightBoneLevel + airBoneGap) as any;
      const leftAirLevel = (leftBoneLevel + airBoneGap) as any;

      // Air conduction
      thresholds.push({
        frequency: freq,
        hearingLevel: rightAirLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      thresholds.push({
        frequency: freq,
        hearingLevel: leftAirLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      // Bone conduction (normal for conductive loss)
      if (freq <= 4000) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightBoneLevel,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });

        thresholds.push({
          frequency: freq,
          hearingLevel: leftBoneLevel,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    });

    return thresholds;
  }

  /**
   * Generate thresholds for asymmetrical sensorineural hearing loss
   */
  private generateAsymmetricalLoss(): ThresholdPoint[] {
    const frequencies = [250, 500, 1000, 2000, 3000, 4000, 8000] as const;
    const thresholds: ThresholdPoint[] = [];

    frequencies.forEach(freq => {
      // Right ear: Mild to moderate loss
      let rightLevel;
      if (freq <= 1000) {
        rightLevel = this.getRandomLevel(15, 25) as any;
      } else {
        rightLevel = this.getRandomLevel(30, 45) as any;
      }

      // Left ear: Moderately severe to severe loss
      let leftLevel;
      if (freq <= 1000) {
        leftLevel = this.getRandomLevel(40, 55) as any;
      } else {
        leftLevel = this.getRandomLevel(60, 75) as any;
      }

      // Air conduction
      thresholds.push({
        frequency: freq,
        hearingLevel: rightLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      thresholds.push({
        frequency: freq,
        hearingLevel: leftLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      // Bone conduction (similar to air for sensorineural loss)
      if (freq <= 4000) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightLevel,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });

        thresholds.push({
          frequency: freq,
          hearingLevel: leftLevel,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    });

    return thresholds;
  }

  /**
   * Generate thresholds for mixed hearing loss
   */
  private generateMixedLoss(): ThresholdPoint[] {
    const frequencies = [250, 500, 1000, 2000, 3000, 4000, 8000] as const;
    const thresholds: ThresholdPoint[] = [];
    
    // Air-bone gap of approximately 20-30 dB
    const airBoneGap = 25;

    frequencies.forEach(freq => {
      // Sensorineural component
      let rightBoneLevel, leftBoneLevel;
      
      if (freq <= 1000) {
        rightBoneLevel = this.getRandomLevel(20, 30) as any;
        leftBoneLevel = this.getRandomLevel(20, 30) as any;
      } else {
        rightBoneLevel = this.getRandomLevel(40, 55) as any;
        leftBoneLevel = this.getRandomLevel(40, 55) as any;
      }
      
      // Air conduction with additional conductive component
      const rightAirLevel = (rightBoneLevel + airBoneGap) as any;
      const leftAirLevel = (leftBoneLevel + airBoneGap) as any;

      // Air conduction
      thresholds.push({
        frequency: freq,
        hearingLevel: rightAirLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      thresholds.push({
        frequency: freq,
        hearingLevel: leftAirLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      // Bone conduction
      if (freq <= 4000) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightBoneLevel,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });

        thresholds.push({
          frequency: freq,
          hearingLevel: leftBoneLevel,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    });

    return thresholds;
  }

  /**
   * Generate thresholds for severe-profound sensorineural hearing loss
   */
  private generateSevereProfoundLoss(): ThresholdPoint[] {
    const frequencies = [250, 500, 1000, 2000, 3000, 4000, 8000] as const;
    const thresholds: ThresholdPoint[] = [];

    frequencies.forEach(freq => {
      // Severe to profound hearing loss
      const rightLevel = this.getRandomLevel(80, 110) as any;
      const leftLevel = this.getRandomLevel(80, 110) as any;

      // Air conduction
      thresholds.push({
        frequency: freq,
        hearingLevel: rightLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      thresholds.push({
        frequency: freq,
        hearingLevel: leftLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      // Bone conduction (similar to air for sensorineural loss)
      if (freq <= 4000) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightLevel,
          ear: 'right',
          testType: 'bone',
          responseStatus: freq <= 1000 ? 'threshold' : 'no_response' // May not get bone response at higher frequencies
        });

        thresholds.push({
          frequency: freq,
          hearingLevel: leftLevel,
          ear: 'left',
          testType: 'bone',
          responseStatus: freq <= 1000 ? 'threshold' : 'no_response'
        });
      }
    });

    return thresholds;
  }

  /**
   * Get a random hearing level within a specified range
   * @param min - Minimum hearing level
   * @param max - Maximum hearing level
   * @returns Random hearing level
   */
  private getRandomLevel(min: number, max: number): number {
    // Round to nearest 5
    const value = Math.round((Math.random() * (max - min) + min) / 5) * 5;
    return Math.min(120, Math.max(-10, value));
  }

  /**
   * Get all patients
   * @returns Array of all patient profiles
   */
  public getAllPatients(): HearingProfile[] {
    return [...this.patients];
  }

  /**
   * Get a patient by ID
   * @param id - Patient ID
   * @returns Patient profile or undefined if not found
   */
  public getPatientById(id: string): HearingProfile | undefined {
    return this.patients.find(patient => patient.id === id);
  }

  /**
   * Get patients by difficulty level
   * @param difficulty - Difficulty level
   * @returns Array of patient profiles matching the difficulty
   */
  public getPatientsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): HearingProfile[] {
    return this.patients.filter(patient => patient.difficulty === difficulty);
  }

  /**
   * Get patients by hearing loss type
   * @param type - Type of hearing loss
   * @returns Array of patient profiles matching the hearing loss type
   */
  public getPatientsByType(type: 'normal' | 'conductive' | 'sensorineural' | 'mixed' | 'asymmetrical'): HearingProfile[] {
    return this.patients.filter(patient => patient.hearingLossType === type);
  }
}

// Create a singleton instance
const patientService = new PatientService();
export default patientService; 