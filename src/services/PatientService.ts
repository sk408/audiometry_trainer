import { HearingProfile, ThresholdPoint, Frequency, HearingLevel } from '../interfaces/AudioTypes';

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
   * Generate normal hearing thresholds
   * @returns Array of threshold points for normal hearing
   */
  private generateNormalHearingThresholds(): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];
    const frequencies: number[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    
    // Air conduction thresholds
    frequencies.forEach(freq => {
      // Right ear thresholds (normal = between -10 and 15 dB HL)
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: this.getRandomLevel(-10, 15) as HearingLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });
      
      // Left ear thresholds
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: this.getRandomLevel(-10, 15) as HearingLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });
    });
    
    // Bone conduction thresholds (typically for frequencies 250-4000 Hz)
    const boneFrequencies: number[] = [250, 500, 1000, 2000, 3000, 4000];
    
    boneFrequencies.forEach(freq => {
      // For normal hearing, bone conduction thresholds should be similar to air conduction
      // Right ear bone conduction
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: this.getRandomLevel(-10, 15) as HearingLevel,
        ear: 'right',
        testType: 'bone',
        responseStatus: 'threshold'
      });
      
      // Left ear bone conduction
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: this.getRandomLevel(-10, 15) as HearingLevel,
        ear: 'left',
        testType: 'bone',
        responseStatus: 'threshold'
      });
    });
    
    return thresholds;
  }

  /**
   * Generate mild high-frequency sensorineural hearing loss
   * @returns Array of threshold points
   */
  private generateMildHighFrequencyLoss(): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];
    const frequencies: number[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    
    // Air conduction thresholds
    frequencies.forEach(freq => {
      // Hearing level based on frequency - higher frequencies have higher thresholds
      let rightLevel: HearingLevel = 10 as HearingLevel;
      let leftLevel: HearingLevel = 10 as HearingLevel;
      
      // Progressive loss in high frequencies
      if (freq >= 2000) {
        rightLevel = Math.min(85, 10 + Math.round((freq - 1500) / 100)) as HearingLevel;
        leftLevel = Math.min(85, 10 + Math.round((freq - 1500) / 100)) as HearingLevel;
      }
      
      // Add some randomness
      rightLevel = (rightLevel + this.getRandomLevel(-5, 5)) as HearingLevel;
      leftLevel = (leftLevel + this.getRandomLevel(-5, 5)) as HearingLevel;
      
      // Right ear
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: rightLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });
      
      // Left ear
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: leftLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });
    });
    
    // Bone conduction thresholds (typically for frequencies 250-4000 Hz)
    const boneFrequencies: number[] = [250, 500, 1000, 2000, 3000, 4000];
    
    boneFrequencies.forEach(freq => {
      // For sensorineural hearing loss, bone conduction thresholds should be similar to air conduction
      let rightLevel: HearingLevel = 10 as HearingLevel;
      let leftLevel: HearingLevel = 10 as HearingLevel;
      
      // Progressive loss in high frequencies
      if (freq >= 2000) {
        rightLevel = Math.min(85, 10 + Math.round((freq - 1500) / 100)) as HearingLevel;
        leftLevel = Math.min(85, 10 + Math.round((freq - 1500) / 100)) as HearingLevel;
      }
      
      // Add some randomness
      rightLevel = (rightLevel + this.getRandomLevel(-5, 5)) as HearingLevel;
      leftLevel = (leftLevel + this.getRandomLevel(-5, 5)) as HearingLevel;
      
      // Right ear bone conduction
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: rightLevel,
        ear: 'right',
        testType: 'bone',
        responseStatus: 'threshold'
      });
      
      // Left ear bone conduction
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: leftLevel,
        ear: 'left',
        testType: 'bone',
        responseStatus: 'threshold'
      });
    });
    
    return thresholds;
  }

  /**
   * Generate moderate flat conductive hearing loss
   * @returns Array of threshold points
   */
  private generateConductiveLoss(): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];
    const frequencies: number[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    
    // Air conduction thresholds - conductive loss is typically flat across frequencies
    frequencies.forEach(freq => {
      // Moderate conductive loss (40-55 dB HL)
      const rightLevel = (40 + this.getRandomLevel(0, 15)) as HearingLevel;
      const leftLevel = (40 + this.getRandomLevel(0, 15)) as HearingLevel;
      
      // Right ear
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: rightLevel,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });
      
      // Left ear
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: leftLevel,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });
    });
    
    // Bone conduction thresholds (typically for frequencies 250-4000 Hz)
    const boneFrequencies: number[] = [250, 500, 1000, 2000, 3000, 4000];
    
    boneFrequencies.forEach(freq => {
      // For conductive hearing loss, bone conduction thresholds should be normal
      // despite elevated air conduction thresholds
      const rightLevel = (this.getRandomLevel(-10, 15)) as HearingLevel;
      const leftLevel = (this.getRandomLevel(-10, 15)) as HearingLevel;
      
      // Right ear bone conduction
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: rightLevel,
        ear: 'right',
        testType: 'bone',
        responseStatus: 'threshold'
      });
      
      // Left ear bone conduction
      thresholds.push({
        frequency: freq as Frequency,
        hearingLevel: leftLevel,
        ear: 'left',
        testType: 'bone',
        responseStatus: 'threshold'
      });
    });
    
    return thresholds;
  }

  /**
   * Generate thresholds for asymmetrical sensorineural hearing loss
   */
  private generateAsymmetricalLoss(): ThresholdPoint[] {
    // UPDATED: Added 1500Hz to ensure all UI frequencies are covered
    const frequencies = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000] as const;
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
    // UPDATED: Added 1500Hz to ensure all UI frequencies are covered
    const frequencies = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000] as const;
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
    // UPDATED: Added 1500Hz to ensure all UI frequencies are covered
    const frequencies = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000] as const;
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