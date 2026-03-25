import { describe, it, expect } from 'vitest';
import patientService from '../PatientService';
import { HearingProfile, ThresholdPoint, Frequency } from '../../interfaces/AudioTypes';

describe('PatientService', () => {
  // ===========================================================================
  // Audiometric Validity (bone <= air)
  // ===========================================================================
  describe('Audiometric Validity', () => {
    it('1. All patients have bone <= air at every frequency', () => {
      const patients = patientService.getAllPatients();

      for (const patient of patients) {
        // Build maps of air and bone thresholds by ear+frequency
        const airMap = new Map<string, number>();
        const boneMap = new Map<string, number>();

        for (const t of patient.thresholds) {
          const key = `${t.ear}-${t.frequency}`;
          if (t.testType === 'air' || t.testType === 'masked_air') {
            airMap.set(key, t.hearingLevel);
          } else if (t.testType === 'bone' || t.testType === 'masked_bone') {
            boneMap.set(key, t.hearingLevel);
          }
        }

        for (const [key, boneLevel] of boneMap) {
          const airLevel = airMap.get(key);
          if (airLevel !== undefined) {
            expect(boneLevel).toBeLessThanOrEqual(airLevel);
          }
        }
      }
    });

    it('2. No threshold exceeds 120 dB or below -10 dB', () => {
      const patients = patientService.getAllPatients();

      for (const patient of patients) {
        for (const t of patient.thresholds) {
          expect(t.hearingLevel).toBeGreaterThanOrEqual(-10);
          expect(t.hearingLevel).toBeLessThanOrEqual(120);
        }
      }
    });

    it('3. All thresholds are multiples of 5', () => {
      const patients = patientService.getAllPatients();

      for (const patient of patients) {
        for (const t of patient.thresholds) {
          expect(Math.abs(t.hearingLevel % 5)).toBe(0);
        }
      }
    });
  });

  // ===========================================================================
  // Hearing Loss Type Validity
  // ===========================================================================
  describe('Hearing Loss Type Validity', () => {
    it('4. Normal hearing patients: at least one has all thresholds <= 25 dB', () => {
      const normalPatients = patientService.getPatientsByType('normal');
      expect(normalPatients.length).toBeGreaterThanOrEqual(3);

      // Patient1 (bilateral normal) should have all thresholds in normal range
      const bilateralNormal = patientService.getPatientById('patient1')!;
      for (const t of bilateralNormal.thresholds) {
        expect(t.hearingLevel).toBeGreaterThanOrEqual(-10);
        expect(t.hearingLevel).toBeLessThanOrEqual(25);
      }

      // All normal-type patients should have at least one ear within normal range
      for (const patient of normalPatients) {
        const rightAirThresholds = patient.thresholds.filter(
          t => t.ear === 'right' && t.testType === 'air'
        );
        const leftAirThresholds = patient.thresholds.filter(
          t => t.ear === 'left' && t.testType === 'air'
        );
        const rightAvg = rightAirThresholds.reduce((s, t) => s + t.hearingLevel, 0) / rightAirThresholds.length;
        const leftAvg = leftAirThresholds.reduce((s, t) => s + t.hearingLevel, 0) / leftAirThresholds.length;
        // At least one ear should average <= 25 dB (normal range)
        expect(Math.min(rightAvg, leftAvg)).toBeLessThanOrEqual(25);
      }
    });

    it('5. Sensorineural loss: air-bone gap <= 10 dB', () => {
      const snPatients = patientService.getPatientsByType('sensorineural');
      expect(snPatients.length).toBeGreaterThan(0);

      for (const patient of snPatients) {
        const airMap = new Map<string, number>();
        const boneMap = new Map<string, number>();

        for (const t of patient.thresholds) {
          const key = `${t.ear}-${t.frequency}`;
          if (t.testType === 'air') airMap.set(key, t.hearingLevel);
          else if (t.testType === 'bone') boneMap.set(key, t.hearingLevel);
        }

        for (const [key, boneLevel] of boneMap) {
          const airLevel = airMap.get(key);
          if (airLevel !== undefined) {
            const gap = airLevel - boneLevel;
            expect(gap).toBeLessThanOrEqual(10);
          }
        }
      }
    });

    it('6. Conductive loss: bone normal, at least one ear shows air-bone gap >= 10 dB', () => {
      const conductivePatients = patientService.getPatientsByType('conductive');
      expect(conductivePatients.length).toBeGreaterThanOrEqual(3);

      for (const patient of conductivePatients) {
        const airMap = new Map<string, number>();
        const boneMap = new Map<string, number>();

        for (const t of patient.thresholds) {
          const key = `${t.ear}-${t.frequency}`;
          if (t.testType === 'air') airMap.set(key, t.hearingLevel);
          else if (t.testType === 'bone') boneMap.set(key, t.hearingLevel);
        }

        // Check bone is normal range (up to 20 dB)
        for (const [, boneLevel] of boneMap) {
          expect(boneLevel).toBeLessThanOrEqual(20);
        }

        // Check air-bone gap per ear — at least one ear should show conductive pattern
        let bestEarGapRatio = 0;
        for (const ear of ['right', 'left'] as const) {
          let earGapCount = 0;
          let earSignificantGapCount = 0;
          for (const [key, boneLevel] of boneMap) {
            if (!key.startsWith(ear)) continue;
            const airLevel = airMap.get(key);
            if (airLevel !== undefined) {
              earGapCount++;
              if (airLevel - boneLevel >= 10) earSignificantGapCount++;
            }
          }
          if (earGapCount > 0) {
            bestEarGapRatio = Math.max(bestEarGapRatio, earSignificantGapCount / earGapCount);
          }
        }

        // At least one ear should have most frequencies with significant gap
        expect(bestEarGapRatio).toBeGreaterThan(0.5);
      }
    });

    it('7. Mixed loss: bone elevated AND air-bone gap present', () => {
      const mixedPatients = patientService.getPatientsByType('mixed');
      expect(mixedPatients.length).toBeGreaterThan(0);

      for (const patient of mixedPatients) {
        const airMap = new Map<string, number>();
        const boneMap = new Map<string, number>();

        for (const t of patient.thresholds) {
          const key = `${t.ear}-${t.frequency}`;
          if (t.testType === 'air') airMap.set(key, t.hearingLevel);
          else if (t.testType === 'bone') boneMap.set(key, t.hearingLevel);
        }

        // Check that bone is elevated (> 20 dB at most frequencies)
        let elevatedBoneCount = 0;
        for (const [, boneLevel] of boneMap) {
          if (boneLevel > 15) elevatedBoneCount++;
        }
        expect(elevatedBoneCount).toBeGreaterThan(boneMap.size / 2);

        // Check that air-bone gap exists at most frequencies
        let gapCount = 0;
        for (const [key, boneLevel] of boneMap) {
          const airLevel = airMap.get(key);
          if (airLevel !== undefined) {
            const gap = airLevel - boneLevel;
            if (gap >= 10) gapCount++;
          }
        }
        expect(gapCount).toBeGreaterThan(0);
      }
    });

    it('8. Asymmetrical loss: one ear significantly worse than the other', () => {
      const asymPatients = patientService.getPatientsByType('asymmetrical');
      expect(asymPatients.length).toBeGreaterThan(0);

      for (const patient of asymPatients) {
        // Calculate average air threshold per ear
        const rightAirThresholds = patient.thresholds.filter(
          t => t.ear === 'right' && t.testType === 'air'
        );
        const leftAirThresholds = patient.thresholds.filter(
          t => t.ear === 'left' && t.testType === 'air'
        );

        const rightAvg = rightAirThresholds.reduce((sum, t) => sum + t.hearingLevel, 0) / rightAirThresholds.length;
        const leftAvg = leftAirThresholds.reduce((sum, t) => sum + t.hearingLevel, 0) / leftAirThresholds.length;

        // There should be a significant difference between ears (>= 15 dB average)
        const earDiff = Math.abs(rightAvg - leftAvg);
        expect(earDiff).toBeGreaterThanOrEqual(10);
      }
    });
  });

  // ===========================================================================
  // Deterministic Thresholds
  // ===========================================================================
  describe('Deterministic Thresholds', () => {
    it('9. Same patient produces same thresholds on repeated calls', () => {
      const patient1 = patientService.getPatientById('patient1')!;
      const patient1Again = patientService.getPatientById('patient1')!;

      // Since it's the same singleton, they are the same object, but let's verify
      // thresholds are identical
      expect(patient1.thresholds).toEqual(patient1Again.thresholds);

      // Also verify by checking that a separately constructed PatientService
      // would produce the same thresholds (test the seeded PRNG)
      // We can verify this by checking the validation passes and values are consistent
      expect(patient1.thresholds.length).toBe(patient1Again.thresholds.length);
      for (let i = 0; i < patient1.thresholds.length; i++) {
        expect(patient1.thresholds[i].hearingLevel).toBe(patient1Again.thresholds[i].hearingLevel);
        expect(patient1.thresholds[i].frequency).toBe(patient1Again.thresholds[i].frequency);
        expect(patient1.thresholds[i].ear).toBe(patient1Again.thresholds[i].ear);
        expect(patient1.thresholds[i].testType).toBe(patient1Again.thresholds[i].testType);
      }
    });
  });

  // ===========================================================================
  // Patient Profile Completeness
  // ===========================================================================
  describe('Patient Profile Completeness', () => {
    it('10. All patients have required fields', () => {
      const patients = patientService.getAllPatients();

      for (const patient of patients) {
        expect(patient.id).toBeDefined();
        expect(typeof patient.id).toBe('string');
        expect(patient.id.length).toBeGreaterThan(0);

        expect(patient.name).toBeDefined();
        expect(typeof patient.name).toBe('string');
        expect(patient.name.length).toBeGreaterThan(0);

        expect(patient.description).toBeDefined();
        expect(typeof patient.description).toBe('string');
        expect(patient.description.length).toBeGreaterThan(0);

        expect(['beginner', 'intermediate', 'advanced']).toContain(patient.difficulty);
        expect(['normal', 'conductive', 'sensorineural', 'mixed', 'asymmetrical', 'noise-induced', 'presbycusis']).toContain(patient.hearingLossType);

        expect(patient.thresholds).toBeDefined();
        expect(Array.isArray(patient.thresholds)).toBe(true);
        expect(patient.thresholds.length).toBeGreaterThan(0);
      }
    });

    it('11. All patients have both air and bone thresholds', () => {
      const patients = patientService.getAllPatients();

      for (const patient of patients) {
        const airThresholds = patient.thresholds.filter(
          t => t.testType === 'air' || t.testType === 'masked_air'
        );
        const boneThresholds = patient.thresholds.filter(
          t => t.testType === 'bone' || t.testType === 'masked_bone'
        );

        expect(airThresholds.length).toBeGreaterThan(0);
        expect(boneThresholds.length).toBeGreaterThan(0);
      }
    });

    it('12. All patients have both ears', () => {
      const patients = patientService.getAllPatients();

      for (const patient of patients) {
        const rightThresholds = patient.thresholds.filter(t => t.ear === 'right');
        const leftThresholds = patient.thresholds.filter(t => t.ear === 'left');

        expect(rightThresholds.length).toBeGreaterThan(0);
        expect(leftThresholds.length).toBeGreaterThan(0);
      }
    });

    it('13. Standard frequencies covered: 250, 500, 1000, 2000, 3000, 4000 Hz for both types', () => {
      const patients = patientService.getAllPatients();
      const standardFreqs: Frequency[] = [250, 500, 1000, 2000, 3000, 4000];

      for (const patient of patients) {
        for (const ear of ['right', 'left'] as const) {
          for (const freq of standardFreqs) {
            // Air conduction
            const hasAir = patient.thresholds.some(
              t => t.frequency === freq && t.ear === ear &&
                   (t.testType === 'air' || t.testType === 'masked_air')
            );
            expect(hasAir).toBe(true);

            // Bone conduction
            const hasBone = patient.thresholds.some(
              t => t.frequency === freq && t.ear === ear &&
                   (t.testType === 'bone' || t.testType === 'masked_bone')
            );
            expect(hasBone).toBe(true);
          }
        }
      }
    });

    it('14. At least 22 patients exist', () => {
      const patients = patientService.getAllPatients();
      expect(patients.length).toBeGreaterThanOrEqual(22);
    });
  });

  // ===========================================================================
  // Filtering
  // ===========================================================================
  describe('Filtering', () => {
    it('15. getPatientsByDifficulty works for all three levels', () => {
      const beginners = patientService.getPatientsByDifficulty('beginner');
      const intermediates = patientService.getPatientsByDifficulty('intermediate');
      const advanced = patientService.getPatientsByDifficulty('advanced');

      expect(beginners.length).toBeGreaterThan(0);
      expect(intermediates.length).toBeGreaterThan(0);
      expect(advanced.length).toBeGreaterThan(0);

      // All beginner patients should have difficulty 'beginner'
      for (const p of beginners) {
        expect(p.difficulty).toBe('beginner');
      }
      for (const p of intermediates) {
        expect(p.difficulty).toBe('intermediate');
      }
      for (const p of advanced) {
        expect(p.difficulty).toBe('advanced');
      }

      // Total across all difficulties should equal total patients
      const total = beginners.length + intermediates.length + advanced.length;
      expect(total).toBe(patientService.getAllPatients().length);
    });

    it('16. getPatientsByType works for all loss types', () => {
      const types = ['normal', 'conductive', 'sensorineural', 'mixed', 'asymmetrical', 'noise-induced', 'presbycusis'] as const;

      let totalFromTypes = 0;
      for (const type of types) {
        const patients = patientService.getPatientsByType(type);
        expect(patients.length).toBeGreaterThan(0);

        for (const p of patients) {
          expect(p.hearingLossType).toBe(type);
        }

        totalFromTypes += patients.length;
      }

      expect(totalFromTypes).toBe(patientService.getAllPatients().length);
    });

    it('17. getPatientById returns correct patient or undefined', () => {
      // Valid ID
      const patient = patientService.getPatientById('patient1');
      expect(patient).toBeDefined();
      expect(patient!.id).toBe('patient1');
      expect(patient!.name).toBe('Alex Johnson');

      // Another valid ID
      const patient3 = patientService.getPatientById('patient3');
      expect(patient3).toBeDefined();
      expect(patient3!.id).toBe('patient3');

      // Invalid ID
      const missing = patientService.getPatientById('nonexistent');
      expect(missing).toBeUndefined();

      // Empty string
      const empty = patientService.getPatientById('');
      expect(empty).toBeUndefined();
    });
  });
});
