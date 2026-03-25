import { HearingProfile, ThresholdPoint, Frequency, HearingLevel } from '../interfaces/AudioTypes';

/**
 * PatientService - Manages virtual patients with different hearing profiles
 *
 * Audiometric invariants enforced:
 *   - Bone conduction <= Air conduction at every shared frequency
 *   - All hearing levels are multiples of 5 in the range [-10, 120]
 *   - Thresholds are deterministic per patient (seeded PRNG from patient ID)
 */
class PatientService {
  private patients: HearingProfile[] = [];

  constructor() {
    this.initializePatients();

    // Validate every patient after generation
    for (const patient of this.patients) {
      if (!this.validatePatientThresholds(patient.thresholds)) {
        throw new Error(
          `Patient "${patient.name}" (${patient.id}) has invalid thresholds: ` +
          'bone > air, out-of-range value, or non-multiple-of-5 detected.'
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Seeded PRNG
  // ---------------------------------------------------------------------------

  /**
   * Create a deterministic pseudo-random number generator seeded by a string.
   * Returns a function that yields values in [0, 1) on each call.
   */
  private seededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return () => {
      hash = (hash * 1664525 + 1013904223) & 0x7fffffff;
      return hash / 0x7fffffff;
    };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Get a random hearing level within a specified range, rounded to the
   * nearest 5 dB and clamped to [-10, 120].
   */
  private getRandomLevel(min: number, max: number, random: () => number): HearingLevel {
    const value = Math.round((random() * (max - min) + min) / 5) * 5;
    return Math.min(120, Math.max(-10, value)) as HearingLevel;
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Validate an array of threshold points for audiometric correctness.
   *  - bone <= air at every frequency/ear combination
   *  - all hearing levels in [-10, 120]
   *  - all hearing levels are multiples of 5
   */
  public validatePatientThresholds(thresholds: ThresholdPoint[]): boolean {
    // Build lookup maps for air and bone by ear+frequency
    const airMap = new Map<string, number>();
    const boneMap = new Map<string, number>();

    for (const t of thresholds) {
      const level = t.hearingLevel as number;

      // Range check
      if (level < -10 || level > 120) return false;

      // Multiple-of-5 check
      if (level % 5 !== 0) return false;

      const key = `${t.ear}-${t.frequency}`;
      if (t.testType === 'air' || t.testType === 'masked_air') {
        airMap.set(key, level);
      } else if (t.testType === 'bone' || t.testType === 'masked_bone') {
        boneMap.set(key, level);
      }
    }

    // For every frequency where both bone and air exist, bone <= air
    for (const [key, boneLevel] of boneMap) {
      const airLevel = airMap.get(key);
      if (airLevel !== undefined && boneLevel > airLevel) {
        return false;
      }
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // Patient initialisation
  // ---------------------------------------------------------------------------

  private initializePatients(): void {
    this.patients = [
      // Normal hearing
      {
        id: 'patient1',
        name: 'Alex Johnson',
        description: 'Young adult with normal hearing',
        difficulty: 'beginner',
        hearingLossType: 'normal',
        thresholds: this.generateNormalHearingThresholds(this.seededRandom('patient1'))
      },

      // Mild high-frequency sensorineural hearing loss
      {
        id: 'patient2',
        name: 'Sarah Miller',
        description: 'Middle-aged with mild high-frequency sensorineural hearing loss',
        difficulty: 'beginner',
        hearingLossType: 'sensorineural',
        thresholds: this.generateMildHighFrequencyLoss(this.seededRandom('patient2'))
      },

      // Moderate flat conductive hearing loss
      {
        id: 'patient3',
        name: 'Robert Chen',
        description: 'Adult with moderate flat conductive hearing loss',
        difficulty: 'intermediate',
        hearingLossType: 'conductive',
        thresholds: this.generateConductiveLoss(this.seededRandom('patient3'))
      },

      // Asymmetrical sensorineural hearing loss
      {
        id: 'patient4',
        name: 'Maria Garcia',
        description: 'Elderly with asymmetrical sensorineural hearing loss',
        difficulty: 'intermediate',
        hearingLossType: 'asymmetrical',
        thresholds: this.generateAsymmetricalLoss(this.seededRandom('patient4'))
      },

      // Mixed hearing loss
      {
        id: 'patient5',
        name: 'James Wilson',
        description: 'Adult with mixed hearing loss',
        difficulty: 'advanced',
        hearingLossType: 'mixed',
        thresholds: this.generateMixedLoss(this.seededRandom('patient5'))
      },

      // Severe-profound hearing loss
      {
        id: 'patient6',
        name: 'Eliza Thompson',
        description: 'Child with severe-profound sensorineural hearing loss',
        difficulty: 'advanced',
        hearingLossType: 'sensorineural',
        thresholds: this.generateSevereProfoundLoss(this.seededRandom('patient6'))
      }
    ];
  }

  // ---------------------------------------------------------------------------
  // Threshold generators
  // ---------------------------------------------------------------------------

  /**
   * Normal hearing: bone -10..15, air = bone + 0..5
   */
  private generateNormalHearingThresholds(random: () => number): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];
    const frequencies: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const boneFrequencies: Frequency[] = [250, 500, 1000, 2000, 3000, 4000];

    // Generate bone first, then air = bone + small gap
    for (const freq of frequencies) {
      const hasBone = (boneFrequencies as number[]).includes(freq);

      // --- Right ear ---
      const rightBone = hasBone ? this.getRandomLevel(-10, 15, random) : null;
      const rightAir = rightBone !== null
        ? this.getRandomLevel(rightBone, rightBone + 5, random)
        : this.getRandomLevel(-10, 15, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: rightAir,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (rightBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightBone,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }

      // --- Left ear ---
      const leftBone = hasBone ? this.getRandomLevel(-10, 15, random) : null;
      const leftAir = leftBone !== null
        ? this.getRandomLevel(leftBone, leftBone + 5, random)
        : this.getRandomLevel(-10, 15, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: leftAir,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (leftBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: leftBone,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    }

    return thresholds;
  }

  /**
   * Mild high-frequency sensorineural loss: bone first (elevated at high freq),
   * air = bone + 0..5
   */
  private generateMildHighFrequencyLoss(random: () => number): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];
    const frequencies: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const boneFrequencies: Frequency[] = [250, 500, 1000, 2000, 3000, 4000];

    for (const freq of frequencies) {
      const hasBone = (boneFrequencies as number[]).includes(freq);

      // Base level depends on frequency — progressive high-frequency loss
      let baseMin: number;
      let baseMax: number;
      if (freq < 2000) {
        baseMin = 5;
        baseMax = 15;
      } else {
        // Increases with frequency
        const offset = Math.round((freq - 1500) / 100);
        baseMin = 10 + offset - 5;
        baseMax = Math.min(85, 10 + offset + 5);
      }

      // --- Right ear ---
      const rightBone = hasBone ? this.getRandomLevel(baseMin, baseMax, random) : null;
      const rightAir = rightBone !== null
        ? this.getRandomLevel(rightBone, rightBone + 5, random)
        : this.getRandomLevel(baseMin, baseMax + 5, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: rightAir,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (rightBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightBone,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }

      // --- Left ear ---
      const leftBone = hasBone ? this.getRandomLevel(baseMin, baseMax, random) : null;
      const leftAir = leftBone !== null
        ? this.getRandomLevel(leftBone, leftBone + 5, random)
        : this.getRandomLevel(baseMin, baseMax + 5, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: leftAir,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (leftBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: leftBone,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    }

    return thresholds;
  }

  /**
   * Conductive loss: bone is normal (-10..15), air = bone + air-bone gap (20..40)
   */
  private generateConductiveLoss(random: () => number): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];
    const frequencies: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const boneFrequencies: Frequency[] = [250, 500, 1000, 2000, 3000, 4000];

    for (const freq of frequencies) {
      const hasBone = (boneFrequencies as number[]).includes(freq);

      // --- Right ear ---
      const rightBone = hasBone ? this.getRandomLevel(-10, 15, random) : null;
      const rightGap = this.getRandomLevel(20, 40, random) as number;
      const rightAir = rightBone !== null
        ? this.getRandomLevel(rightBone + rightGap, rightBone + rightGap, random)
        : this.getRandomLevel(30, 55, random); // For freqs without bone, approximate

      thresholds.push({
        frequency: freq,
        hearingLevel: rightAir,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (rightBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightBone,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }

      // --- Left ear ---
      const leftBone = hasBone ? this.getRandomLevel(-10, 15, random) : null;
      const leftGap = this.getRandomLevel(20, 40, random) as number;
      const leftAir = leftBone !== null
        ? this.getRandomLevel(leftBone + leftGap, leftBone + leftGap, random)
        : this.getRandomLevel(30, 55, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: leftAir,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (leftBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: leftBone,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    }

    return thresholds;
  }

  /**
   * Asymmetrical sensorineural loss:
   *   Right ear: mild-moderate SNHL (bone ~ air, both elevated)
   *   Left ear: moderately severe-severe SNHL (bone ~ air, both more elevated)
   */
  private generateAsymmetricalLoss(random: () => number): ThresholdPoint[] {
    const frequencies: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const thresholds: ThresholdPoint[] = [];

    for (const freq of frequencies) {
      const hasBone = freq <= 4000;

      // --- Right ear: mild to moderate ---
      let rightBoneMin: number;
      let rightBoneMax: number;
      if (freq <= 1000) {
        rightBoneMin = 15;
        rightBoneMax = 25;
      } else {
        rightBoneMin = 30;
        rightBoneMax = 45;
      }

      const rightBone = hasBone ? this.getRandomLevel(rightBoneMin, rightBoneMax, random) : null;
      const rightAir = rightBone !== null
        ? this.getRandomLevel(rightBone, rightBone + 5, random)
        : this.getRandomLevel(rightBoneMin, rightBoneMax + 5, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: rightAir,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (rightBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightBone,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }

      // --- Left ear: moderately severe to severe ---
      let leftBoneMin: number;
      let leftBoneMax: number;
      if (freq <= 1000) {
        leftBoneMin = 40;
        leftBoneMax = 55;
      } else {
        leftBoneMin = 60;
        leftBoneMax = 75;
      }

      const leftBone = hasBone ? this.getRandomLevel(leftBoneMin, leftBoneMax, random) : null;
      const leftAir = leftBone !== null
        ? this.getRandomLevel(leftBone, leftBone + 5, random)
        : this.getRandomLevel(leftBoneMin, leftBoneMax + 5, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: leftAir,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (leftBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: leftBone,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    }

    return thresholds;
  }

  /**
   * Mixed loss: bone elevated (sensorineural component), air = bone + gap (15..30)
   */
  private generateMixedLoss(random: () => number): ThresholdPoint[] {
    const frequencies: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const thresholds: ThresholdPoint[] = [];

    for (const freq of frequencies) {
      const hasBone = freq <= 4000;

      // Sensorineural component ranges
      let boneMin: number;
      let boneMax: number;
      if (freq <= 1000) {
        boneMin = 20;
        boneMax = 30;
      } else {
        boneMin = 40;
        boneMax = 55;
      }

      // --- Right ear ---
      const rightBone = hasBone ? this.getRandomLevel(boneMin, boneMax, random) : null;
      const rightGap = this.getRandomLevel(15, 30, random) as number;
      const rightAir = rightBone !== null
        ? this.getRandomLevel(rightBone + rightGap, rightBone + rightGap, random)
        : this.getRandomLevel(boneMin + 15, boneMax + 30, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: rightAir,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (rightBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightBone,
          ear: 'right',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }

      // --- Left ear ---
      const leftBone = hasBone ? this.getRandomLevel(boneMin, boneMax, random) : null;
      const leftGap = this.getRandomLevel(15, 30, random) as number;
      const leftAir = leftBone !== null
        ? this.getRandomLevel(leftBone + leftGap, leftBone + leftGap, random)
        : this.getRandomLevel(boneMin + 15, boneMax + 30, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: leftAir,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (leftBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: leftBone,
          ear: 'left',
          testType: 'bone',
          responseStatus: 'threshold'
        });
      }
    }

    return thresholds;
  }

  /**
   * Severe-profound sensorineural loss: bone first (80..110), air = bone + 0..5
   */
  private generateSevereProfoundLoss(random: () => number): ThresholdPoint[] {
    const frequencies: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const thresholds: ThresholdPoint[] = [];

    for (const freq of frequencies) {
      const hasBone = freq <= 4000;

      // --- Right ear ---
      const rightBone = hasBone ? this.getRandomLevel(80, 110, random) : null;
      const rightAir = rightBone !== null
        ? this.getRandomLevel(rightBone, rightBone + 5, random)
        : this.getRandomLevel(80, 115, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: rightAir,
        ear: 'right',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (rightBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: rightBone,
          ear: 'right',
          testType: 'bone',
          responseStatus: freq <= 1000 ? 'threshold' : 'no_response'
        });
      }

      // --- Left ear ---
      const leftBone = hasBone ? this.getRandomLevel(80, 110, random) : null;
      const leftAir = leftBone !== null
        ? this.getRandomLevel(leftBone, leftBone + 5, random)
        : this.getRandomLevel(80, 115, random);

      thresholds.push({
        frequency: freq,
        hearingLevel: leftAir,
        ear: 'left',
        testType: 'air',
        responseStatus: 'threshold'
      });

      if (leftBone !== null) {
        thresholds.push({
          frequency: freq,
          hearingLevel: leftBone,
          ear: 'left',
          testType: 'bone',
          responseStatus: freq <= 1000 ? 'threshold' : 'no_response'
        });
      }
    }

    return thresholds;
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Get all patients
   */
  public getAllPatients(): HearingProfile[] {
    return [...this.patients];
  }

  /**
   * Get a patient by ID
   */
  public getPatientById(id: string): HearingProfile | undefined {
    return this.patients.find(patient => patient.id === id);
  }

  /**
   * Get patients by difficulty level
   */
  public getPatientsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): HearingProfile[] {
    return this.patients.filter(patient => patient.difficulty === difficulty);
  }

  /**
   * Get patients by hearing loss type
   */
  public getPatientsByType(type: 'normal' | 'conductive' | 'sensorineural' | 'mixed' | 'asymmetrical'): HearingProfile[] {
    return this.patients.filter(patient => patient.hearingLossType === type);
  }
}

// Create a singleton instance
const patientService = new PatientService();
export default patientService;
