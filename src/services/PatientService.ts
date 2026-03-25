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

  private readonly AIR_FREQUENCIES: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
  private readonly BONE_FREQUENCIES: Frequency[] = [250, 500, 1000, 2000, 3000, 4000];

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

  /**
   * Check whether a frequency is a bone-conduction frequency.
   */
  private hasBone(freq: Frequency): boolean {
    return (this.BONE_FREQUENCIES as number[]).includes(freq);
  }

  /**
   * Generic bilateral threshold builder.
   *
   * For each frequency the caller supplies a function that returns
   * { boneLevel, airLevel } for one ear. The builder takes care of
   * iterating over frequencies, ears, and pushing ThresholdPoints.
   */
  private buildBilateralThresholds(
    earFn: (freq: Frequency, ear: 'right' | 'left', random: () => number) => { boneLevel: HearingLevel | null; airLevel: HearingLevel },
    random: () => number
  ): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];

    for (const freq of this.AIR_FREQUENCIES) {
      for (const ear of ['right', 'left'] as const) {
        const { boneLevel, airLevel } = earFn(freq, ear, random);

        thresholds.push({
          frequency: freq,
          hearingLevel: airLevel,
          ear,
          testType: 'air',
          responseStatus: 'threshold'
        });

        if (boneLevel !== null) {
          thresholds.push({
            frequency: freq,
            hearingLevel: boneLevel,
            ear,
            testType: 'bone',
            responseStatus: 'threshold'
          });
        }
      }
    }

    return thresholds;
  }

  /**
   * Build SNHL thresholds where bone = air (no air-bone gap) for both ears.
   * The caller provides a function that gives the base hearing level per frequency.
   */
  private buildSnhlThresholds(
    baseLevelFn: (freq: Frequency, random: () => number) => { min: number; max: number },
    random: () => number
  ): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, _ear, rng) => {
      const { min, max } = baseLevelFn(freq, rng);
      const bone = this.hasBone(freq) ? this.getRandomLevel(min, max, rng) : null;
      const air = bone !== null
        ? this.getRandomLevel(bone, bone + 5, rng)
        : this.getRandomLevel(min, max + 5, rng);
      return { boneLevel: bone, airLevel: air };
    }, random);
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
      // =====================================================================
      // ORIGINAL 6 PATIENTS (IDs preserved)
      // =====================================================================

      // Normal hearing
      {
        id: 'patient1',
        name: 'Alex Johnson',
        description: 'Young adult with normal hearing',
        difficulty: 'beginner',
        hearingLossType: 'normal',
        age: 22,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Baseline hearing evaluation for new job requirement',
          medicalHistory: ['No significant medical history'],
          noiseExposure: 'Minimal — occasional concert attendance with ear protection',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Normal hearing bilaterally',
        thresholds: this.generateNormalHearingThresholds(this.seededRandom('patient1'))
      },

      // Mild high-frequency sensorineural hearing loss
      {
        id: 'patient2',
        name: 'Sarah Miller',
        description: 'Middle-aged with mild high-frequency sensorineural hearing loss',
        difficulty: 'beginner',
        hearingLossType: 'sensorineural',
        age: 48,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Difficulty understanding speech in noisy restaurants',
          medicalHistory: ['Hypertension, controlled with medication'],
          noiseExposure: 'Office environment, no significant occupational noise',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Mild high-frequency sensorineural hearing loss, bilateral',
        thresholds: this.generateMildHighFrequencyLoss(this.seededRandom('patient2'))
      },

      // Moderate flat conductive hearing loss
      {
        id: 'patient3',
        name: 'Robert Chen',
        description: 'Adult with moderate flat conductive hearing loss',
        difficulty: 'intermediate',
        hearingLossType: 'conductive',
        age: 35,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Muffled hearing in both ears, worsening over 6 months',
          medicalHistory: ['Chronic otitis media as a child', 'Tympanoplasty right ear age 12'],
          noiseExposure: 'None significant',
          otoscopicFindings: { rightEar: 'Scarred TM, retracted', leftEar: 'Dull TM with effusion visible' }
        },
        expectedDiagnosis: 'Moderate bilateral conductive hearing loss',
        thresholds: this.generateConductiveLoss(this.seededRandom('patient3'))
      },

      // Asymmetrical sensorineural hearing loss
      {
        id: 'patient4',
        name: 'Maria Garcia',
        description: 'Elderly with asymmetrical sensorineural hearing loss',
        difficulty: 'intermediate',
        hearingLossType: 'asymmetrical',
        age: 72,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Much worse hearing in the left ear; tinnitus left side',
          medicalHistory: ['Type 2 diabetes', 'Osteoarthritis'],
          noiseExposure: 'Textile factory worker for 20 years',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Asymmetrical sensorineural hearing loss — mild-moderate right, moderately severe-severe left',
        thresholds: this.generateAsymmetricalLoss(this.seededRandom('patient4'))
      },

      // Mixed hearing loss
      {
        id: 'patient5',
        name: 'James Wilson',
        description: 'Adult with mixed hearing loss',
        difficulty: 'advanced',
        hearingLossType: 'mixed',
        age: 55,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Progressive hearing loss over several years, both ears',
          medicalHistory: ['Otosclerosis diagnosed at age 40', 'Family history of hearing loss'],
          noiseExposure: 'Recreational hunting without ear protection',
          otoscopicFindings: { rightEar: 'Clear canal, Schwartz sign visible', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Mixed hearing loss bilateral — conductive and sensorineural components',
        thresholds: this.generateMixedLoss(this.seededRandom('patient5'))
      },

      // Severe-profound hearing loss
      {
        id: 'patient6',
        name: 'Eliza Thompson',
        description: 'Child with severe-profound sensorineural hearing loss',
        difficulty: 'advanced',
        hearingLossType: 'sensorineural',
        age: 8,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Failed newborn hearing screen; parents report no response to loud sounds',
          medicalHistory: ['Premature birth at 28 weeks', 'NICU stay — ototoxic antibiotics administered'],
          noiseExposure: 'None',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Severe-to-profound bilateral sensorineural hearing loss',
        thresholds: this.generateSevereProfoundLoss(this.seededRandom('patient6'))
      },

      // =====================================================================
      // NORMAL (2 more — total 3)
      // =====================================================================

      // Normal: unilateral normal with mild loss in other ear
      {
        id: 'patient7',
        name: 'Kevin Park',
        description: 'Unilateral normal hearing (right), mild loss (left)',
        difficulty: 'beginner',
        hearingLossType: 'normal',
        age: 30,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Difficulty hearing phone conversations on left side',
          medicalHistory: ['Single episode of sudden sensorineural hearing loss, left ear, age 28'],
          noiseExposure: 'None significant',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Normal hearing right ear; mild sensorineural hearing loss left ear',
        thresholds: this.generateNormalWithUnilateralMildLoss(this.seededRandom('patient7'))
      },

      // Normal: slight high-frequency rolloff
      {
        id: 'patient8',
        name: 'Priya Sharma',
        description: 'Normal hearing with slight high-frequency rolloff',
        difficulty: 'beginner',
        hearingLossType: 'normal',
        age: 28,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Routine hearing check — no complaints',
          medicalHistory: ['No significant medical history'],
          noiseExposure: 'Regular use of personal headphones at moderate volume',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Hearing within normal limits bilaterally with slight high-frequency rolloff at 8 kHz',
        thresholds: this.generateNormalWithHighFreqRolloff(this.seededRandom('patient8'))
      },

      // =====================================================================
      // CONDUCTIVE (2 more — total 3)
      // =====================================================================

      // Unilateral conductive loss
      {
        id: 'patient9',
        name: 'Daniel Okafor',
        description: 'Unilateral conductive hearing loss (right ear only)',
        difficulty: 'intermediate',
        hearingLossType: 'conductive',
        age: 19,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Right ear feels plugged after swimming; reduced hearing',
          medicalHistory: ['Recurrent otitis externa'],
          noiseExposure: 'None significant',
          otoscopicFindings: { rightEar: 'Impacted cerumen, TM not visualized', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Unilateral mild-moderate conductive hearing loss, right ear',
        thresholds: this.generateUnilateralConductiveLoss(this.seededRandom('patient9'))
      },

      // Mild CHL with small ABG
      {
        id: 'patient10',
        name: 'Angela Russo',
        description: 'Mild conductive hearing loss with small air-bone gap',
        difficulty: 'intermediate',
        hearingLossType: 'conductive',
        age: 42,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Slight hearing difficulty bilaterally; fullness in ears',
          medicalHistory: ['Eustachian tube dysfunction', 'Allergic rhinitis'],
          noiseExposure: 'None significant',
          otoscopicFindings: { rightEar: 'Slightly retracted TM', leftEar: 'Slightly retracted TM' }
        },
        expectedDiagnosis: 'Mild bilateral conductive hearing loss with 10-20 dB air-bone gap',
        thresholds: this.generateMildConductiveLoss(this.seededRandom('patient10'))
      },

      // =====================================================================
      // SENSORINEURAL (2 more — total 4 incl. patient2 and patient6)
      // =====================================================================

      // Moderate flat SNHL
      {
        id: 'patient11',
        name: 'Thomas Bergstrom',
        description: 'Moderate flat sensorineural hearing loss',
        difficulty: 'intermediate',
        hearingLossType: 'sensorineural',
        age: 60,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Gradually worsening hearing both ears; difficulty in group conversations',
          medicalHistory: ['Meniere disease diagnosed 5 years ago, stable', 'Vertigo episodes resolved'],
          noiseExposure: 'Office worker; no significant exposure',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Moderate flat bilateral sensorineural hearing loss',
        thresholds: this.generateModerateFlatSnhl(this.seededRandom('patient11'))
      },

      // Cookie-bite (mid-frequency) SNHL
      {
        id: 'patient12',
        name: 'Lauren Choi',
        description: 'Cookie-bite (mid-frequency) sensorineural hearing loss',
        difficulty: 'advanced',
        hearingLossType: 'sensorineural',
        age: 34,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Difficulty understanding speech even in quiet; family history of hearing loss',
          medicalHistory: ['Genetic hearing loss — autosomal dominant pattern in family'],
          noiseExposure: 'None significant',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Bilateral mid-frequency (cookie-bite) sensorineural hearing loss',
        thresholds: this.generateCookieBiteLoss(this.seededRandom('patient12'))
      },

      // =====================================================================
      // MIXED (2 more — total 3)
      // =====================================================================

      // Mild mixed
      {
        id: 'patient13',
        name: 'Frank Moretti',
        description: 'Mild mixed hearing loss with small conductive and sensorineural components',
        difficulty: 'intermediate',
        hearingLossType: 'mixed',
        age: 50,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Hearing has been declining; noticed after ear infection last year',
          medicalHistory: ['Chronic sinusitis', 'Previous tympanostomy tubes bilaterally as child'],
          noiseExposure: 'Moderate — construction site supervisor (wears protection intermittently)',
          otoscopicFindings: { rightEar: 'Slightly retracted TM, healed perforation', leftEar: 'Retracted TM, myringosclerosis' }
        },
        expectedDiagnosis: 'Mild bilateral mixed hearing loss',
        thresholds: this.generateMildMixedLoss(this.seededRandom('patient13'))
      },

      // Mixed with different components per ear
      {
        id: 'patient14',
        name: 'Yuki Tanaka',
        description: 'Mixed hearing loss with different conductive/sensorineural components per ear',
        difficulty: 'advanced',
        hearingLossType: 'mixed',
        age: 45,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Right ear much worse than left; drainage from right ear periodically',
          medicalHistory: ['Cholesteatoma right ear — surgery planned', 'Mild presbycusis noted previously'],
          noiseExposure: 'Teacher — moderate classroom noise',
          otoscopicFindings: { rightEar: 'Retracted TM with whitish mass behind; possible cholesteatoma', leftEar: 'Clear canal, slightly opaque TM' }
        },
        expectedDiagnosis: 'Mixed hearing loss bilaterally; larger conductive component right ear, larger sensorineural component left ear',
        thresholds: this.generateAsymmetricMixedLoss(this.seededRandom('patient14'))
      },

      // =====================================================================
      // NOISE-INDUCED (3 new)
      // =====================================================================

      // Classic 4kHz notch
      {
        id: 'patient15',
        name: 'Derek Hansen',
        description: 'Classic noise-induced hearing loss with 4 kHz notch',
        difficulty: 'intermediate',
        hearingLossType: 'noise-induced',
        age: 38,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Tinnitus and difficulty hearing in noisy environments',
          medicalHistory: ['No significant medical history'],
          noiseExposure: 'Military veteran — 8 years infantry; inconsistent hearing protection use',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Bilateral noise-induced sensorineural hearing loss with classic 4 kHz notch',
        thresholds: this.generateNoiseInducedClassicNotch(this.seededRandom('patient15'))
      },

      // Broadened notch (3-6 kHz)
      {
        id: 'patient16',
        name: 'Carlos Mendez',
        description: 'Noise-induced hearing loss with broadened 3-6 kHz notch',
        difficulty: 'intermediate',
        hearingLossType: 'noise-induced',
        age: 52,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Progressive hearing difficulty; cannot understand speech in noise',
          medicalHistory: ['Tinnitus bilateral, constant'],
          noiseExposure: '25 years in manufacturing — metal stamping plant; hearing protection worn last 10 years only',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Bilateral noise-induced sensorineural hearing loss with broadened notch at 3-6 kHz',
        thresholds: this.generateNoiseInducedBroadNotch(this.seededRandom('patient16'))
      },

      // Asymmetric noise notch
      {
        id: 'patient17',
        name: 'Billy Crawford',
        description: 'Asymmetric noise-induced hearing loss (left worse)',
        difficulty: 'advanced',
        hearingLossType: 'noise-induced',
        age: 44,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Left ear hearing worse than right; ringing in left ear',
          medicalHistory: ['No significant medical history'],
          noiseExposure: 'Professional drummer for 20 years; left ear closer to hi-hat cymbal',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Asymmetric noise-induced sensorineural hearing loss — mild notch right, moderate-severe notch left',
        thresholds: this.generateNoiseInducedAsymmetric(this.seededRandom('patient17'))
      },

      // =====================================================================
      // PRESBYCUSIS (3 new)
      // =====================================================================

      // Mild sloping presbycusis
      {
        id: 'patient18',
        name: 'Dorothy Mitchell',
        description: 'Mild sloping age-related hearing loss (presbycusis)',
        difficulty: 'beginner',
        hearingLossType: 'presbycusis',
        age: 68,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Trouble hearing grandchildren; needs TV volume louder than spouse prefers',
          medicalHistory: ['Hypertension', 'Hypothyroidism'],
          noiseExposure: 'Librarian — minimal occupational noise',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Mild bilateral sloping high-frequency sensorineural hearing loss consistent with presbycusis',
        thresholds: this.generateMildPresbyThresholds(this.seededRandom('patient18'))
      },

      // Moderate presbycusis
      {
        id: 'patient19',
        name: 'Harold Franklin',
        description: 'Moderate age-related hearing loss (presbycusis)',
        difficulty: 'intermediate',
        hearingLossType: 'presbycusis',
        age: 76,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Significant difficulty understanding speech; considering hearing aids',
          medicalHistory: ['Type 2 diabetes', 'Cardiovascular disease', 'Bilateral cataracts (treated)'],
          noiseExposure: 'Former postal worker — moderate vehicle and sorting machine noise for 30 years',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Mild cerumen, intact TM' }
        },
        expectedDiagnosis: 'Moderate bilateral sloping sensorineural hearing loss consistent with presbycusis',
        thresholds: this.generateModeratePresbyThresholds(this.seededRandom('patient19'))
      },

      // Steeply sloping presbycusis
      {
        id: 'patient20',
        name: 'Margaret Olsen',
        description: 'Steeply sloping severe high-frequency presbycusis',
        difficulty: 'advanced',
        hearingLossType: 'presbycusis',
        age: 84,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Cannot follow conversation without lip reading; current hearing aids insufficient',
          medicalHistory: ['Osteoporosis', 'History of ototoxic medication (aminoglycosides) during hospitalization 10 years ago'],
          noiseExposure: 'None significant',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM, slightly atrophic', leftEar: 'Clear canal, intact TM, slightly atrophic' }
        },
        expectedDiagnosis: 'Steeply sloping severe-to-profound bilateral sensorineural hearing loss consistent with advanced presbycusis',
        thresholds: this.generateSteepPresbyThresholds(this.seededRandom('patient20'))
      },

      // =====================================================================
      // ASYMMETRICAL (2 more — total 3 incl. patient4)
      // =====================================================================

      // Unilateral severe loss (one ear normal)
      {
        id: 'patient21',
        name: 'Ryan O\'Brien',
        description: 'Unilateral severe sensorineural hearing loss (left ear), normal right',
        difficulty: 'advanced',
        hearingLossType: 'asymmetrical',
        age: 29,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Sudden hearing loss in left ear 3 months ago; persistent tinnitus left',
          medicalHistory: ['Sudden idiopathic sensorineural hearing loss — steroid treatment partially effective'],
          noiseExposure: 'Software engineer — no significant exposure',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Normal hearing right ear; severe sensorineural hearing loss left ear (unilateral)',
        thresholds: this.generateUnilateralSevereLoss(this.seededRandom('patient21'))
      },

      // Mild vs moderate asymmetry
      {
        id: 'patient22',
        name: 'Patricia Nguyen',
        description: 'Asymmetrical hearing loss — mild right, moderate left',
        difficulty: 'intermediate',
        hearingLossType: 'asymmetrical',
        age: 58,
        gender: 'female',
        caseHistory: {
          chiefComplaint: 'Gradual hearing decline, worse on the left side',
          medicalHistory: ['Vestibular schwannoma (left) — monitoring with MRI', 'Anxiety disorder'],
          noiseExposure: 'None significant',
          otoscopicFindings: { rightEar: 'Clear canal, intact TM', leftEar: 'Clear canal, intact TM' }
        },
        expectedDiagnosis: 'Asymmetrical sensorineural hearing loss — mild right, moderate left; recommend retrocochlear workup',
        thresholds: this.generateMildVsModerateAsymmetry(this.seededRandom('patient22'))
      },

      // =====================================================================
      // MODERATE MIXED (bonus patient 23 — gives mixed total of 4)
      // =====================================================================
      {
        id: 'patient23',
        name: 'Samuel Abebe',
        description: 'Moderate mixed hearing loss with prominent conductive component',
        difficulty: 'advanced',
        hearingLossType: 'mixed',
        age: 62,
        gender: 'male',
        caseHistory: {
          chiefComplaint: 'Long-standing hearing difficulty both ears, worse recently after ear infection',
          medicalHistory: ['Bilateral otosclerosis', 'Stapedectomy right ear 15 years ago', 'Chronic suppurative otitis media left ear'],
          noiseExposure: 'Moderate — taxi driver in urban area for 30 years',
          otoscopicFindings: { rightEar: 'Clear canal, well-healed surgical site', leftEar: 'Perforated TM, mucoid discharge' }
        },
        expectedDiagnosis: 'Moderate mixed hearing loss bilaterally with larger conductive component',
        thresholds: this.generateModerateMixedLoss(this.seededRandom('patient23'))
      }
    ];
  }

  // ---------------------------------------------------------------------------
  // Threshold generators — ORIGINAL (kept intact for patient1-6 determinism)
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
  // Threshold generators — NEW (patient7+)
  // ---------------------------------------------------------------------------

  /**
   * Normal right ear, mild SNHL left ear.
   * Right: bone -10..15, air = bone + 0..5
   * Left: bone 20..35, air = bone + 0..5
   */
  private generateNormalWithUnilateralMildLoss(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, ear, rng) => {
      if (ear === 'right') {
        // Normal hearing
        const bone = this.hasBone(freq) ? this.getRandomLevel(-10, 15, rng) : null;
        const air = bone !== null
          ? this.getRandomLevel(bone, bone + 5, rng)
          : this.getRandomLevel(-10, 15, rng);
        return { boneLevel: bone, airLevel: air };
      } else {
        // Mild SNHL — flat 20-35 dB
        const bone = this.hasBone(freq) ? this.getRandomLevel(20, 35, rng) : null;
        const air = bone !== null
          ? this.getRandomLevel(bone, bone + 5, rng)
          : this.getRandomLevel(20, 35, rng);
        return { boneLevel: bone, airLevel: air };
      }
    }, random);
  }

  /**
   * Normal hearing with slight high-frequency rolloff at 6000-8000 Hz.
   * 250-4000 Hz: bone -10..10, air = bone + 0..5
   * 6000-8000 Hz: 15..25 dB
   */
  private generateNormalWithHighFreqRolloff(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, _ear, rng) => {
      let bMin: number, bMax: number;
      if (freq <= 4000) {
        bMin = -10; bMax = 10;
      } else if (freq === 6000) {
        bMin = 10; bMax = 20;
      } else {
        // 8000 Hz
        bMin = 15; bMax = 25;
      }
      const bone = this.hasBone(freq) ? this.getRandomLevel(bMin, bMax, rng) : null;
      const air = bone !== null
        ? this.getRandomLevel(bone, bone + 5, rng)
        : this.getRandomLevel(bMin, bMax + 5, rng);
      return { boneLevel: bone, airLevel: air };
    }, random);
  }

  /**
   * Unilateral conductive hearing loss — right ear only.
   * Right: bone normal (-10..15), air = bone + gap (15..35)
   * Left: normal hearing
   */
  private generateUnilateralConductiveLoss(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, ear, rng) => {
      if (ear === 'right') {
        const bone = this.hasBone(freq) ? this.getRandomLevel(-10, 15, rng) : null;
        const gap = this.getRandomLevel(15, 35, rng) as number;
        const air = bone !== null
          ? this.getRandomLevel(bone + gap, bone + gap, rng)
          : this.getRandomLevel(25, 50, rng);
        return { boneLevel: bone, airLevel: air };
      } else {
        // Normal left ear
        const bone = this.hasBone(freq) ? this.getRandomLevel(-10, 15, rng) : null;
        const air = bone !== null
          ? this.getRandomLevel(bone, bone + 5, rng)
          : this.getRandomLevel(-10, 15, rng);
        return { boneLevel: bone, airLevel: air };
      }
    }, random);
  }

  /**
   * Mild conductive hearing loss with small air-bone gap (10-20 dB).
   * Bone: normal (-10..15), air = bone + 10..20
   */
  private generateMildConductiveLoss(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, _ear, rng) => {
      const bone = this.hasBone(freq) ? this.getRandomLevel(-10, 15, rng) : null;
      const gap = this.getRandomLevel(10, 20, rng) as number;
      const air = bone !== null
        ? this.getRandomLevel(bone + gap, bone + gap, rng)
        : this.getRandomLevel(15, 35, rng);
      return { boneLevel: bone, airLevel: air };
    }, random);
  }

  /**
   * Moderate flat SNHL: bone 40..55 dB across frequencies, air = bone + 0..5
   */
  private generateModerateFlatSnhl(random: () => number): ThresholdPoint[] {
    return this.buildSnhlThresholds((_freq, _rng) => ({ min: 40, max: 55 }), random);
  }

  /**
   * Cookie-bite (mid-frequency) SNHL:
   *   250-500 Hz: normal (5..15 dB)
   *   750-2000 Hz: dip (30..50 dB)
   *   3000-8000 Hz: recovery (10..20 dB)
   * Bone = air (SNHL pattern)
   */
  private generateCookieBiteLoss(random: () => number): ThresholdPoint[] {
    return this.buildSnhlThresholds((freq, _rng) => {
      if (freq <= 500) {
        return { min: 5, max: 15 };
      } else if (freq >= 750 && freq <= 2000) {
        return { min: 30, max: 50 };
      } else {
        // 3000-8000: recovery
        return { min: 10, max: 20 };
      }
    }, random);
  }

  /**
   * Mild mixed hearing loss:
   *   Bone: mildly elevated (15..25 dB) — sensorineural component
   *   Air-bone gap: 10..15 dB — conductive component
   */
  private generateMildMixedLoss(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, _ear, rng) => {
      const bone = this.hasBone(freq) ? this.getRandomLevel(15, 25, rng) : null;
      const gap = this.getRandomLevel(10, 15, rng) as number;
      const air = bone !== null
        ? this.getRandomLevel(bone + gap, bone + gap, rng)
        : this.getRandomLevel(25, 40, rng);
      return { boneLevel: bone, airLevel: air };
    }, random);
  }

  /**
   * Asymmetric mixed hearing loss:
   *   Right ear: larger conductive component (bone 15..25, gap 20..30)
   *   Left ear: larger sensorineural component (bone 30..45, gap 10..15)
   */
  private generateAsymmetricMixedLoss(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, ear, rng) => {
      if (ear === 'right') {
        // Larger conductive component
        const bone = this.hasBone(freq) ? this.getRandomLevel(15, 25, rng) : null;
        const gap = this.getRandomLevel(20, 30, rng) as number;
        const air = bone !== null
          ? this.getRandomLevel(bone + gap, bone + gap, rng)
          : this.getRandomLevel(35, 55, rng);
        return { boneLevel: bone, airLevel: air };
      } else {
        // Larger sensorineural component
        const bone = this.hasBone(freq) ? this.getRandomLevel(30, 45, rng) : null;
        const gap = this.getRandomLevel(10, 15, rng) as number;
        const air = bone !== null
          ? this.getRandomLevel(bone + gap, bone + gap, rng)
          : this.getRandomLevel(40, 60, rng);
        return { boneLevel: bone, airLevel: air };
      }
    }, random);
  }

  /**
   * Moderate mixed loss with prominent conductive component:
   *   Bone: 20..35 (sensorineural floor)
   *   Gap: 20..35 (conductive component)
   */
  private generateModerateMixedLoss(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, _ear, rng) => {
      const bone = this.hasBone(freq) ? this.getRandomLevel(20, 35, rng) : null;
      const gap = this.getRandomLevel(20, 35, rng) as number;
      const air = bone !== null
        ? this.getRandomLevel(bone + gap, bone + gap, rng)
        : this.getRandomLevel(40, 70, rng);
      return { boneLevel: bone, airLevel: air };
    }, random);
  }

  /**
   * Classic noise-induced hearing loss with 4 kHz notch.
   * 250-2000 Hz: normal (0..15 dB)
   * 3000 Hz: mild dip (20..30 dB)
   * 4000 Hz: notch (40..65 dB)
   * 6000 Hz: partial recovery (25..40 dB)
   * 8000 Hz: recovery (15..25 dB)
   * Bone = air (SNHL pattern)
   */
  private generateNoiseInducedClassicNotch(random: () => number): ThresholdPoint[] {
    return this.buildSnhlThresholds((freq, _rng) => {
      if (freq <= 2000) return { min: 0, max: 15 };
      if (freq === 3000) return { min: 20, max: 30 };
      if (freq === 4000) return { min: 40, max: 65 };
      if (freq === 6000) return { min: 25, max: 40 };
      // 8000
      return { min: 15, max: 25 };
    }, random);
  }

  /**
   * Noise-induced hearing loss with broadened notch at 3000-6000 Hz.
   * 250-1500 Hz: normal (0..15 dB)
   * 2000 Hz: mild (15..25 dB)
   * 3000 Hz: moderate (35..50 dB)
   * 4000 Hz: moderate-severe (45..65 dB)
   * 6000 Hz: moderate (35..50 dB)
   * 8000 Hz: partial recovery (20..35 dB)
   * Bone = air
   */
  private generateNoiseInducedBroadNotch(random: () => number): ThresholdPoint[] {
    return this.buildSnhlThresholds((freq, _rng) => {
      if (freq <= 1500) return { min: 0, max: 15 };
      if (freq === 2000) return { min: 15, max: 25 };
      if (freq === 3000) return { min: 35, max: 50 };
      if (freq === 4000) return { min: 45, max: 65 };
      if (freq === 6000) return { min: 35, max: 50 };
      // 8000
      return { min: 20, max: 35 };
    }, random);
  }

  /**
   * Asymmetric noise-induced hearing loss.
   * Right ear: mild notch at 4 kHz (25..40 dB)
   * Left ear: moderate-severe notch at 4 kHz (50..65 dB)
   * Bone = air for both ears
   */
  private generateNoiseInducedAsymmetric(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, ear, rng) => {
      // Determine base level by frequency and ear
      let min: number, max: number;
      if (ear === 'right') {
        // Milder notch
        if (freq <= 2000) { min = 0; max = 15; }
        else if (freq === 3000) { min = 15; max = 25; }
        else if (freq === 4000) { min = 25; max = 40; }
        else if (freq === 6000) { min = 15; max = 25; }
        else { min = 10; max = 20; } // 8000
      } else {
        // Deeper notch
        if (freq <= 2000) { min = 5; max = 15; }
        else if (freq === 3000) { min = 30; max = 40; }
        else if (freq === 4000) { min = 50; max = 65; }
        else if (freq === 6000) { min = 30; max = 45; }
        else { min = 15; max = 30; } // 8000
      }

      const bone = this.hasBone(freq) ? this.getRandomLevel(min, max, rng) : null;
      const air = bone !== null
        ? this.getRandomLevel(bone, bone + 5, rng)
        : this.getRandomLevel(min, max + 5, rng);
      return { boneLevel: bone, airLevel: air };
    }, random);
  }

  /**
   * Mild sloping presbycusis:
   * 250 Hz: normal (5..15), gradually worsening to 8000 Hz: mild-moderate (30..45)
   * Bone = air
   */
  private generateMildPresbyThresholds(random: () => number): ThresholdPoint[] {
    return this.buildSnhlThresholds((freq, _rng) => {
      // Linear slope from ~10 dB at 250 Hz to ~35 dB at 8000 Hz
      const freqIndex = this.AIR_FREQUENCIES.indexOf(freq);
      const totalSteps = this.AIR_FREQUENCIES.length - 1;
      const baseCenter = 10 + (freqIndex / totalSteps) * 25;
      return { min: Math.max(0, baseCenter - 5), max: baseCenter + 5 };
    }, random);
  }

  /**
   * Moderate presbycusis:
   * 250 Hz: mild (15..25), gradually worsening to 8000 Hz: moderate-severe (55..70)
   * Bone = air
   */
  private generateModeratePresbyThresholds(random: () => number): ThresholdPoint[] {
    return this.buildSnhlThresholds((freq, _rng) => {
      const freqIndex = this.AIR_FREQUENCIES.indexOf(freq);
      const totalSteps = this.AIR_FREQUENCIES.length - 1;
      const baseCenter = 20 + (freqIndex / totalSteps) * 40;
      return { min: Math.max(0, baseCenter - 5), max: baseCenter + 5 };
    }, random);
  }

  /**
   * Steeply sloping presbycusis:
   * 250 Hz: near-normal (10..20), steep drop to 8000 Hz: severe-profound (75..95)
   * Bone = air
   */
  private generateSteepPresbyThresholds(random: () => number): ThresholdPoint[] {
    return this.buildSnhlThresholds((freq, _rng) => {
      const freqIndex = this.AIR_FREQUENCIES.indexOf(freq);
      const totalSteps = this.AIR_FREQUENCIES.length - 1;
      const baseCenter = 15 + (freqIndex / totalSteps) * 70;
      return { min: Math.max(0, baseCenter - 5), max: baseCenter + 5 };
    }, random);
  }

  /**
   * Unilateral severe SNHL:
   * Right ear: normal (-10..15)
   * Left ear: severe (65..85) across all frequencies
   * Bone = air for both ears
   */
  private generateUnilateralSevereLoss(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, ear, rng) => {
      if (ear === 'right') {
        const bone = this.hasBone(freq) ? this.getRandomLevel(-10, 15, rng) : null;
        const air = bone !== null
          ? this.getRandomLevel(bone, bone + 5, rng)
          : this.getRandomLevel(-10, 15, rng);
        return { boneLevel: bone, airLevel: air };
      } else {
        const bone = this.hasBone(freq) ? this.getRandomLevel(65, 85, rng) : null;
        const air = bone !== null
          ? this.getRandomLevel(bone, bone + 5, rng)
          : this.getRandomLevel(65, 90, rng);
        return { boneLevel: bone, airLevel: air };
      }
    }, random);
  }

  /**
   * Mild vs moderate asymmetry:
   * Right ear: mild SNHL (20..30 dB flat)
   * Left ear: moderate SNHL (40..55 dB, slight slope)
   * Bone = air
   */
  private generateMildVsModerateAsymmetry(random: () => number): ThresholdPoint[] {
    return this.buildBilateralThresholds((freq, ear, rng) => {
      if (ear === 'right') {
        // Mild flat
        const bone = this.hasBone(freq) ? this.getRandomLevel(20, 30, rng) : null;
        const air = bone !== null
          ? this.getRandomLevel(bone, bone + 5, rng)
          : this.getRandomLevel(20, 30, rng);
        return { boneLevel: bone, airLevel: air };
      } else {
        // Moderate with slight slope
        const freqIndex = this.AIR_FREQUENCIES.indexOf(freq);
        const slope = Math.round(freqIndex * 1.5);
        const bone = this.hasBone(freq) ? this.getRandomLevel(40 + slope, 50 + slope, rng) : null;
        const air = bone !== null
          ? this.getRandomLevel(bone, bone + 5, rng)
          : this.getRandomLevel(40 + slope, 55 + slope, rng);
        return { boneLevel: bone, airLevel: air };
      }
    }, random);
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
  public getPatientsByType(type: HearingProfile['hearingLossType']): HearingProfile[] {
    return this.patients.filter(patient => patient.hearingLossType === type);
  }
}

// Create a singleton instance
const patientService = new PatientService();
export default patientService;
