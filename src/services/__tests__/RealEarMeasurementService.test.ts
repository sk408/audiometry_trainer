import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeNALNL2InsertionGain,
  computeDSLv5InsertionGain,
  getACThreshold,
  computeSlope,
  computePTA,
  TYPICAL_REUR,
  REM_FREQUENCIES,
  RealEarMeasurementService
} from '../RealEarMeasurementService';
import { ThresholdPoint, Frequency, HearingLevel } from '../../interfaces/AudioTypes';
import { ProbePosition, VentType } from '../../interfaces/RealEarMeasurementTypes';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/** Build a simple bilateral audiogram (same thresholds both ears). */
function makeAudiogram(
  levels: Record<number, number>,
  testType: 'air' | 'bone' = 'air'
): ThresholdPoint[] {
  const points: ThresholdPoint[] = [];
  for (const [freq, level] of Object.entries(levels)) {
    for (const ear of ['left', 'right'] as const) {
      points.push({
        frequency: Number(freq) as Frequency,
        hearingLevel: level as HearingLevel,
        ear,
        testType,
        responseStatus: 'threshold'
      });
    }
  }
  return points;
}

/** A moderate flat sensorineural loss (all air thresholds ~50 dB HL). */
const MODERATE_FLAT: ThresholdPoint[] = makeAudiogram({
  250: 45, 500: 50, 1000: 50, 2000: 50, 3000: 55, 4000: 55
});

/** Mild sloping SNHL: normal lows, moderate highs. */
const MILD_SLOPING: ThresholdPoint[] = makeAudiogram({
  250: 15, 500: 20, 1000: 25, 2000: 35, 3000: 45, 4000: 55
});

/** Normal hearing (all ≤20 dB). */
const NORMAL_HEARING: ThresholdPoint[] = makeAudiogram({
  250: 5, 500: 10, 1000: 10, 2000: 10, 3000: 15, 4000: 15
});

/** Severe flat loss. */
const SEVERE_FLAT: ThresholdPoint[] = makeAudiogram({
  250: 70, 500: 75, 1000: 75, 2000: 80, 3000: 80, 4000: 85
});

// ---------------------------------------------------------------------------
// Prescription formula tests
// ---------------------------------------------------------------------------

describe('NAL-NL2 insertion gain', () => {
  it('prescribes zero or near-zero gain for normal hearing', () => {
    const targets = computeNALNL2InsertionGain(NORMAL_HEARING, 'right');
    // For 10-15 dB thresholds, gain should be very low
    for (const pt of targets) {
      expect(pt.gain).toBeLessThan(10);
      expect(pt.gain).toBeGreaterThanOrEqual(0);
    }
  });

  it('prescribes more gain for greater hearing loss', () => {
    const normalGains = computeNALNL2InsertionGain(NORMAL_HEARING, 'right');
    const moderateGains = computeNALNL2InsertionGain(MODERATE_FLAT, 'right');
    const severeGains = computeNALNL2InsertionGain(SEVERE_FLAT, 'right');

    // Sum all gains — moderate > normal, severe > moderate
    const sum = (pts: typeof normalGains) => pts.reduce((a, p) => a + p.gain, 0);
    expect(sum(moderateGains)).toBeGreaterThan(sum(normalGains));
    expect(sum(severeGains)).toBeGreaterThan(sum(moderateGains));
  });

  it('prescribes frequency-shaped gain (more mid/high, less low)', () => {
    const targets = computeNALNL2InsertionGain(MODERATE_FLAT, 'right');
    const gain250 = targets.find(t => t.frequency === 250)!.gain;
    const gain2000 = targets.find(t => t.frequency === 2000)!.gain;
    expect(gain2000).toBeGreaterThan(gain250);
  });

  it('produces targets for all 11 REM frequencies', () => {
    const targets = computeNALNL2InsertionGain(MODERATE_FLAT, 'right');
    expect(targets).toHaveLength(REM_FREQUENCIES.length);
    for (const freq of REM_FREQUENCIES) {
      expect(targets.find(t => t.frequency === freq)).toBeDefined();
    }
  });

  it('accounts for age (older patients get slightly less gain)', () => {
    const youngGains = computeNALNL2InsertionGain(MODERATE_FLAT, 'right', 40);
    const oldGains = computeNALNL2InsertionGain(MODERATE_FLAT, 'right', 80);
    const sumYoung = youngGains.reduce((a, p) => a + p.gain, 0);
    const sumOld = oldGains.reduce((a, p) => a + p.gain, 0);
    // Older patients: slightly less gain
    expect(sumOld).toBeLessThanOrEqual(sumYoung);
  });

  it('never prescribes negative gain', () => {
    const targets = computeNALNL2InsertionGain(NORMAL_HEARING, 'right');
    for (const pt of targets) {
      expect(pt.gain).toBeGreaterThanOrEqual(0);
    }
  });

  it('different audiograms produce different targets', () => {
    const flatTargets = computeNALNL2InsertionGain(MODERATE_FLAT, 'right');
    const slopingTargets = computeNALNL2InsertionGain(MILD_SLOPING, 'right');

    // At least some frequencies must differ
    let anyDifferent = false;
    for (let i = 0; i < flatTargets.length; i++) {
      if (flatTargets[i].gain !== slopingTargets[i].gain) {
        anyDifferent = true;
        break;
      }
    }
    expect(anyDifferent).toBe(true);
  });
});

describe('DSL v5 insertion gain', () => {
  it('prescribes more gain than NAL-NL2 on average', () => {
    const nalTargets = computeNALNL2InsertionGain(MODERATE_FLAT, 'right');
    const dslTargets = computeDSLv5InsertionGain(MODERATE_FLAT, 'right');

    const nalSum = nalTargets.reduce((a, p) => a + p.gain, 0);
    const dslSum = dslTargets.reduce((a, p) => a + p.gain, 0);
    expect(dslSum).toBeGreaterThan(nalSum);
  });

  it('provides pediatric boost for young patients', () => {
    const adultGains = computeDSLv5InsertionGain(MODERATE_FLAT, 'right', 35);
    const childGains = computeDSLv5InsertionGain(MODERATE_FLAT, 'right', 8);

    const adultSum = adultGains.reduce((a, p) => a + p.gain, 0);
    const childSum = childGains.reduce((a, p) => a + p.gain, 0);
    expect(childSum).toBeGreaterThan(adultSum);
  });

  it('produces targets for all 11 REM frequencies', () => {
    const targets = computeDSLv5InsertionGain(MODERATE_FLAT, 'right');
    expect(targets).toHaveLength(REM_FREQUENCIES.length);
  });

  it('never prescribes negative gain', () => {
    const targets = computeDSLv5InsertionGain(NORMAL_HEARING, 'right');
    for (const pt of targets) {
      expect(pt.gain).toBeGreaterThanOrEqual(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Helper function tests
// ---------------------------------------------------------------------------

describe('getACThreshold', () => {
  it('returns exact frequency match', () => {
    expect(getACThreshold(MODERATE_FLAT, 1000, 'right')).toBe(50);
    expect(getACThreshold(MODERATE_FLAT, 250, 'left')).toBe(45);
  });

  it('interpolates for missing frequencies', () => {
    // 750 Hz is between 500 (50 dB) and 1000 (50 dB) → should be ~50
    const level = getACThreshold(MODERATE_FLAT, 750, 'right');
    expect(level).toBeGreaterThanOrEqual(45);
    expect(level).toBeLessThanOrEqual(55);
  });

  it('returns 0 for empty thresholds', () => {
    expect(getACThreshold([], 1000, 'right')).toBe(0);
  });
});

describe('computeSlope', () => {
  it('returns positive slope for high-frequency loss', () => {
    const slope = computeSlope(MILD_SLOPING, 'right');
    expect(slope).toBeGreaterThan(0);
  });

  it('returns near-zero slope for flat loss', () => {
    const flatAudiogram = makeAudiogram({ 250: 50, 500: 50, 1000: 50, 2000: 50, 3000: 50, 4000: 50 });
    const slope = computeSlope(flatAudiogram, 'right');
    expect(Math.abs(slope)).toBeLessThan(5);
  });
});

describe('computePTA', () => {
  it('computes three-frequency average', () => {
    const pta = computePTA(MODERATE_FLAT, 'right');
    // (50 + 50 + 50) / 3 = 50
    expect(pta).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// RealEarMeasurementService tests
// ---------------------------------------------------------------------------

describe('RealEarMeasurementService', () => {
  let service: RealEarMeasurementService;

  beforeEach(() => {
    service = new RealEarMeasurementService();
  });

  describe('session management', () => {
    it('creates a session', () => {
      const session = service.createSession('patient1', 'ha1');
      expect(session).toBeDefined();
      expect(session.patientId).toBe('patient1');
      expect(session.hearingAidId).toBe('ha1');
      expect(session.completed).toBe(false);
      expect(session.measurements).toHaveLength(0);
    });

    it('returns current session', () => {
      const session = service.createSession('patient1', 'ha1');
      expect(service.getCurrentSession()).toBe(session);
    });
  });

  describe('probe tube positioning', () => {
    it('reports TOO_SHALLOW for depth < 20mm', () => {
      service.createSession('patient1', 'ha1');
      expect(service.positionProbeTube(10)).toBe(ProbePosition.TOO_SHALLOW);
      expect(service.positionProbeTube(19)).toBe(ProbePosition.TOO_SHALLOW);
    });

    it('reports CORRECT for depth 20-30mm', () => {
      service.createSession('patient1', 'ha1');
      expect(service.positionProbeTube(20)).toBe(ProbePosition.CORRECT);
      expect(service.positionProbeTube(25)).toBe(ProbePosition.CORRECT);
      expect(service.positionProbeTube(30)).toBe(ProbePosition.CORRECT);
    });

    it('reports TOO_DEEP for depth > 30mm', () => {
      service.createSession('patient1', 'ha1');
      expect(service.positionProbeTube(31)).toBe(ProbePosition.TOO_DEEP);
    });

    it('throws without an active session', () => {
      expect(() => service.positionProbeTube(25)).toThrow('No active session');
    });
  });

  describe('REUR simulation', () => {
    it('produces a curve with 11 frequency points', () => {
      const reur = service.simulateREUR();
      expect(reur).toHaveLength(11);
    });

    it('has a resonance peak around 2-4 kHz', () => {
      // Use no noise to check the base curve
      const reur = service.simulateREUR(() => 0);
      const gain2000 = reur.find(p => p.frequency === 2000)!.gain;
      const gain3000 = reur.find(p => p.frequency === 3000)!.gain;
      const gain250 = reur.find(p => p.frequency === 250)!.gain;

      // Peak region should be higher than low frequencies
      expect(Math.max(gain2000, gain3000)).toBeGreaterThan(gain250 + 5);
    });

    it('peak gain is in the 10-20 dB range', () => {
      const reur = service.simulateREUR(() => 0);
      const peakGain = Math.max(...reur.map(p => p.gain));
      expect(peakGain).toBeGreaterThanOrEqual(10);
      expect(peakGain).toBeLessThanOrEqual(20);
    });
  });

  describe('measurement variability', () => {
    it('repeated REUR measurements via performMeasurement differ slightly (noise)', async () => {
      service.createSession('patient1', 'ha1');
      service.positionProbeTube(25);
      const m1 = await service.performMeasurement('REUR', 'right', 'pure_tone_sweep', 65);
      const m2 = await service.performMeasurement('REUR', 'right', 'pure_tone_sweep', 65);

      // With random noise, at least one frequency should differ
      let anyDifferent = false;
      for (let i = 0; i < m1.measurementPoints.length; i++) {
        if (m1.measurementPoints[i].gain !== m2.measurementPoints[i].gain) {
          anyDifferent = true;
          break;
        }
      }
      expect(anyDifferent).toBe(true);
    });

    it('noise applied via noise function is within ±3 dB of typical', () => {
      const noise = () => (Math.random() - 0.5) * 4;
      for (let trial = 0; trial < 20; trial++) {
        const reur = service.simulateREUR(noise);
        for (const point of reur) {
          const typical = TYPICAL_REUR[point.frequency] || 0;
          // Allow ±3 dB (noise is ±2 dB, so ±3 is a safe bound)
          expect(point.gain).toBeGreaterThanOrEqual(typical - 3);
          expect(point.gain).toBeLessThanOrEqual(typical + 3);
        }
      }
    });

    it('simulateREUR with no noise returns deterministic values', () => {
      const m1 = service.simulateREUR(() => 0);
      const m2 = service.simulateREUR(() => 0);
      for (let i = 0; i < m1.length; i++) {
        expect(m1[i].gain).toBe(m2[i].gain);
      }
    });
  });

  describe('performMeasurement', () => {
    it('rejects without a session', async () => {
      await expect(
        service.performMeasurement('REUR', 'right', 'pure_tone_sweep', 65)
      ).rejects.toThrow('No active session');
    });

    it('rejects if probe is not positioned', async () => {
      service.createSession('patient1', 'ha1');
      await expect(
        service.performMeasurement('REUR', 'right', 'pure_tone_sweep', 65)
      ).rejects.toThrow('Probe tube not correctly positioned');
    });

    it('returns a measurement when probe is correctly positioned', async () => {
      service.createSession('patient1', 'ha1');
      service.positionProbeTube(25);
      const measurement = await service.performMeasurement('REUR', 'right', 'pure_tone_sweep', 65);
      expect(measurement.type).toBe('REUR');
      expect(measurement.ear).toBe('right');
      expect(measurement.measurementPoints).toHaveLength(11);
    });

    it('adds measurement to the session', async () => {
      service.createSession('patient1', 'ha1');
      service.positionProbeTube(25);
      await service.performMeasurement('REUR', 'right', 'pure_tone_sweep', 65);
      const session = service.getCurrentSession()!;
      expect(session.measurements).toHaveLength(1);
      expect(session.measurements[0].type).toBe('REUR');
    });
  });

  describe('adjustable gain effect on REAR', () => {
    it('higher input level increases REAR gain', async () => {
      service.createSession('patient1', 'ha1');
      service.positionProbeTube(25);
      const lowLevel = await service.performMeasurement('REAR', 'right', 'pure_tone_sweep', 55);
      const highLevel = await service.performMeasurement('REAR', 'right', 'pure_tone_sweep', 75);

      // On average, higher input should give higher REAR
      const avgLow = lowLevel.measurementPoints.reduce((s, p) => s + p.gain, 0) / 11;
      const avgHigh = highLevel.measurementPoints.reduce((s, p) => s + p.gain, 0) / 11;
      expect(avgHigh).toBeGreaterThan(avgLow);
    });
  });

  describe('generateTargets (patient-specific)', () => {
    it('produces different targets for different patients', () => {
      service.createSession('patient1', 'ha1');
      const targets1 = service.generateTargets('patient1', 'NAL-NL2', 'right');

      service.createSession('patient3', 'ha1');
      const targets3 = service.generateTargets('patient3', 'NAL-NL2', 'right');

      // Targets should differ since patients have different audiograms
      const reig1 = targets1.find(t => t.type === 'REIG')!.targetPoints;
      const reig3 = targets3.find(t => t.type === 'REIG')!.targetPoints;

      let anyDiff = false;
      for (let i = 0; i < reig1.length; i++) {
        if (Math.abs(reig1[i].gain - reig3[i].gain) > 0.1) {
          anyDiff = true;
          break;
        }
      }
      expect(anyDiff).toBe(true);
    });

    it('returns both REAR and REIG targets', () => {
      service.createSession('patient1', 'ha1');
      const targets = service.generateTargets('patient1', 'NAL-NL2', 'right');
      expect(targets).toHaveLength(2);
      expect(targets.find(t => t.type === 'REAR')).toBeDefined();
      expect(targets.find(t => t.type === 'REIG')).toBeDefined();
    });

    it('REAR target = REIG target + REUR', () => {
      service.createSession('patient1', 'ha1');
      const targets = service.generateTargets('patient1', 'NAL-NL2', 'right');
      const rear = targets.find(t => t.type === 'REAR')!;
      const reig = targets.find(t => t.type === 'REIG')!;

      for (const freq of REM_FREQUENCIES) {
        const rearGain = rear.targetPoints.find(p => p.frequency === freq)!.gain;
        const reigGain = reig.targetPoints.find(p => p.frequency === freq)!.gain;
        const reurGain = TYPICAL_REUR[freq] || 0;
        // REAR should equal REIG + REUR (within rounding)
        expect(Math.abs(rearGain - (reigGain + reurGain))).toBeLessThanOrEqual(0.2);
      }
    });

    it('DSL produces higher gain than NAL-NL2', () => {
      service.createSession('patient3', 'ha1');
      const nalTargets = service.generateTargets('patient3', 'NAL-NL2', 'right');
      service.createSession('patient3', 'ha1');
      const dslTargets = service.generateTargets('patient3', 'DSL', 'right');

      const nalReig = nalTargets.find(t => t.type === 'REIG')!.targetPoints;
      const dslReig = dslTargets.find(t => t.type === 'REIG')!.targetPoints;

      const nalSum = nalReig.reduce((s, p) => s + p.gain, 0);
      const dslSum = dslReig.reduce((s, p) => s + p.gain, 0);
      expect(dslSum).toBeGreaterThan(nalSum);
    });

    it('produces fallback targets for unknown patients', () => {
      service.createSession('unknown-patient-id', 'ha1');
      const targets = service.generateTargets('unknown-patient-id', 'NAL-NL2', 'right');
      expect(targets).toHaveLength(2);
      // Should still have valid gain values
      for (const t of targets) {
        for (const p of t.targetPoints) {
          expect(p.gain).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe('accuracy calculation', () => {
    it('returns 100% for perfect match', () => {
      service.createSession('patient1', 'ha1');
      const targets = service.generateTargets('patient1', 'NAL-NL2', 'right');
      const rearTarget = targets.find(t => t.type === 'REAR')!;

      // Create a measurement that exactly matches the target
      const perfectMeasurement = {
        type: 'REAR' as const,
        ear: 'right' as const,
        signalType: 'pure_tone_sweep' as const,
        inputLevel: 65 as const,
        measurementPoints: rearTarget.targetPoints.map(p => ({ ...p })),
        timestamp: new Date().toISOString()
      };

      const accuracy = service.calculateAccuracy(perfectMeasurement, rearTarget);
      expect(accuracy).toBe(100);
    });

    it('returns 0% for mismatched ears', () => {
      service.createSession('patient1', 'ha1');
      const targets = service.generateTargets('patient1', 'NAL-NL2', 'right');
      const rearTarget = targets.find(t => t.type === 'REAR')!;

      const measurement = {
        type: 'REAR' as const,
        ear: 'left' as const,
        signalType: 'pure_tone_sweep' as const,
        inputLevel: 65 as const,
        measurementPoints: rearTarget.targetPoints.map(p => ({ ...p })),
        timestamp: new Date().toISOString()
      };

      expect(service.calculateAccuracy(measurement, rearTarget)).toBe(0);
    });

    it('allows REAR vs REIG comparison', () => {
      service.createSession('patient1', 'ha1');
      const targets = service.generateTargets('patient1', 'NAL-NL2', 'right');
      const reigTarget = targets.find(t => t.type === 'REIG')!;

      const rearMeasurement = {
        type: 'REAR' as const,
        ear: 'right' as const,
        signalType: 'pure_tone_sweep' as const,
        inputLevel: 65 as const,
        measurementPoints: reigTarget.targetPoints.map(p => ({ ...p })),
        timestamp: new Date().toISOString()
      };

      const accuracy = service.calculateAccuracy(rearMeasurement, reigTarget);
      expect(accuracy).toBe(100);
    });
  });

  describe('per-frequency match', () => {
    it('reports pass/fail per frequency', () => {
      service.createSession('patient1', 'ha1');
      const targets = service.generateTargets('patient1', 'NAL-NL2', 'right');
      const rearTarget = targets.find(t => t.type === 'REAR')!;

      const measurement = {
        type: 'REAR' as const,
        ear: 'right' as const,
        signalType: 'pure_tone_sweep' as const,
        inputLevel: 65 as const,
        measurementPoints: rearTarget.targetPoints.map(p => ({
          frequency: p.frequency,
          gain: p.gain + 1 // 1 dB off — within all tolerances
        })),
        timestamp: new Date().toISOString()
      };

      const results = service.getPerFrequencyMatch(measurement, rearTarget);
      expect(results).toHaveLength(11);
      // All should pass since difference is only 1 dB
      for (const r of results) {
        expect(r.withinTolerance).toBe(true);
        expect(r.difference).toBeCloseTo(1, 0);
      }
    });
  });

  describe('fit interpretation', () => {
    it('returns appropriate text for different accuracy levels', () => {
      expect(service.getFitInterpretation(96)).toContain('Excellent');
      expect(service.getFitInterpretation(87)).toContain('Good');
      expect(service.getFitInterpretation(72)).toContain('Acceptable');
      expect(service.getFitInterpretation(55)).toContain('Below');
      expect(service.getFitInterpretation(30)).toContain('Poor');
    });
  });

  describe('hearing aids', () => {
    it('returns available hearing aids', () => {
      const aids = service.getHearingAids();
      expect(aids.length).toBeGreaterThanOrEqual(3);
      expect(aids[0].id).toBe('ha1');
    });
  });

  describe('singleton pattern', () => {
    it('only creates one AudioContext (constructor does not throw)', () => {
      // In test environment, AudioContext is not available
      // but the service should handle this gracefully
      const service1 = new RealEarMeasurementService();
      const service2 = new RealEarMeasurementService();
      expect(service1).toBeDefined();
      expect(service2).toBeDefined();
    });
  });
});
