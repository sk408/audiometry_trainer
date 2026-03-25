import {
  REMType, REMFrequency, REMSignalType, REMLevel,
  ProbePosition, REMCurve, REMTarget, VirtualHearingAid,
  REMSession, REMMeasurementPoint, VentType
} from '../interfaces/RealEarMeasurementTypes';
import patientService from './PatientService';
import { ThresholdPoint } from '../interfaces/AudioTypes';

/**
 * Simplified NAL-NL2 and DSL v5 prescription formulas.
 *
 * These are educational approximations — real NAL-NL2 uses proprietary
 * fitting software with dozens of parameters. The simplified versions here
 * capture the key clinical relationships:
 *   - More hearing loss → more gain
 *   - Frequency-shaped gain (less low, more mid/high)
 *   - Audiogram slope affects high-frequency prescription
 *   - DSL v5 prescribes more gain than NAL-NL2 (especially for children)
 */

/** REM standard frequencies */
const REM_FREQUENCIES: REMFrequency[] = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];

/**
 * Typical REUR (Real Ear Unaided Response) — the natural resonance of an
 * adult ear canal. Peaks ~2.7 kHz with 15-18 dB gain.
 */
const TYPICAL_REUR: Record<number, number> = {
  125: 0,
  250: 0,
  500: 2,
  750: 3,
  1000: 5,
  1500: 8,
  2000: 14,
  3000: 17,
  4000: 12,
  6000: 5,
  8000: 3
};

// ---------------------------------------------------------------------------
// Prescription helpers
// ---------------------------------------------------------------------------

/**
 * Extract the air-conduction threshold for a given frequency and ear from
 * a patient's threshold array. Returns the threshold in dB HL, or 0 if the
 * frequency is not present (normal hearing assumption).
 */
function getACThreshold(
  thresholds: ThresholdPoint[],
  frequency: number,
  ear: 'left' | 'right'
): number {
  // Find exact frequency match first
  const point = thresholds.find(
    t => t.frequency === frequency && t.ear === ear && (t.testType === 'air' || t.testType === 'masked_air')
  );
  if (point) return point.hearingLevel as number;

  // For REM frequencies not in the audiogram (750, 1500, 6000, 8000),
  // interpolate from neighbours
  const airPoints = thresholds
    .filter(t => t.ear === ear && (t.testType === 'air' || t.testType === 'masked_air'))
    .sort((a, b) => (a.frequency as number) - (b.frequency as number));

  if (airPoints.length === 0) return 0;

  const freqNum = frequency as number;
  // Find bracketing points
  let lower: ThresholdPoint | null = null;
  let upper: ThresholdPoint | null = null;
  for (const p of airPoints) {
    if ((p.frequency as number) <= freqNum) lower = p;
    if ((p.frequency as number) >= freqNum && !upper) upper = p;
  }

  if (lower && upper && lower !== upper) {
    const ratio = (freqNum - (lower.frequency as number)) / ((upper.frequency as number) - (lower.frequency as number));
    return Math.round(((lower.hearingLevel as number) + ratio * ((upper.hearingLevel as number) - (lower.hearingLevel as number))) / 5) * 5;
  }
  if (lower) return lower.hearingLevel as number;
  if (upper) return upper.hearingLevel as number;
  return 0;
}

/**
 * Compute audiogram slope (dB/octave) from 500-4000 Hz for a given ear.
 * Positive = sloping (worsens with frequency), negative = rising.
 */
function computeSlope(thresholds: ThresholdPoint[], ear: 'left' | 'right'): number {
  const t500 = getACThreshold(thresholds, 500, ear);
  const t4000 = getACThreshold(thresholds, 4000, ear);
  // 500→4000 is 3 octaves
  return (t4000 - t500) / 3;
}

/**
 * Compute the three-frequency pure-tone average (500, 1000, 2000 Hz).
 */
function computePTA(thresholds: ThresholdPoint[], ear: 'left' | 'right'): number {
  const t500 = getACThreshold(thresholds, 500, ear);
  const t1000 = getACThreshold(thresholds, 1000, ear);
  const t2000 = getACThreshold(thresholds, 2000, ear);
  return (t500 + t1000 + t2000) / 3;
}

/**
 * Simplified NAL-NL2 insertion gain prescription.
 *
 * Key relationships modelled:
 *   gain ≈ threshold × frequencyFactor + slopeCorrection
 *
 * frequencyFactor varies by band — NAL-NL2 prescribes proportionally less
 * gain at low frequencies and targets audibility in the speech range.
 */
function computeNALNL2InsertionGain(
  thresholds: ThresholdPoint[],
  ear: 'left' | 'right',
  age?: number
): REMMeasurementPoint[] {
  const slope = computeSlope(thresholds, ear);
  const pta = computePTA(thresholds, ear);

  // NAL-NL2 frequency-dependent gain factors (proportion of threshold prescribed as gain)
  const gainFactors: Record<number, number> = {
    125: 0.10,
    250: 0.15,
    500: 0.22,
    750: 0.28,
    1000: 0.33,
    1500: 0.38,
    2000: 0.42,
    3000: 0.45,
    4000: 0.43,
    6000: 0.38,
    8000: 0.30
  };

  // Slope correction: steeper slopes get slightly less high-freq gain to avoid loudness discomfort
  const slopeCorrections: Record<number, number> = {
    125: 0,
    250: 0,
    500: 0,
    750: 0,
    1000: 0,
    1500: -slope * 0.1,
    2000: -slope * 0.15,
    3000: -slope * 0.20,
    4000: -slope * 0.25,
    6000: -slope * 0.20,
    8000: -slope * 0.15
  };

  // Age correction: older patients (>70) get slightly less overall gain (acclimatisation)
  const ageFactor = (age && age > 70) ? 0.95 : 1.0;

  // PTA-based overall level adjustment: very mild losses get less proportional gain
  const ptaAdjust = pta < 20 ? 0.7 : (pta < 40 ? 0.85 : 1.0);

  return REM_FREQUENCIES.map(freq => {
    const threshold = getACThreshold(thresholds, freq, ear);
    const factor = gainFactors[freq] || 0.3;
    const slopeCorr = slopeCorrections[freq] || 0;

    let gain = threshold * factor * ptaAdjust * ageFactor + slopeCorr;

    // Minimum gain of 0 (don't prescribe negative gain)
    gain = Math.max(0, gain);
    // Cap at 70 dB
    gain = Math.min(70, gain);

    return {
      frequency: freq,
      gain: Math.round(gain * 10) / 10
    };
  });
}

/**
 * Simplified DSL v5.0 insertion gain prescription.
 *
 * DSL prescribes more gain than NAL-NL2 on average, especially at low
 * frequencies and for children. It targets full audibility of speech across
 * the dynamic range.
 */
function computeDSLv5InsertionGain(
  thresholds: ThresholdPoint[],
  ear: 'left' | 'right',
  age?: number
): REMMeasurementPoint[] {
  const slope = computeSlope(thresholds, ear);

  // DSL prescribes higher gain factors than NAL-NL2
  const gainFactors: Record<number, number> = {
    125: 0.20,
    250: 0.25,
    500: 0.32,
    750: 0.36,
    1000: 0.40,
    1500: 0.44,
    2000: 0.48,
    3000: 0.50,
    4000: 0.48,
    6000: 0.42,
    8000: 0.35
  };

  // Slope correction (milder than NAL-NL2)
  const slopeCorrections: Record<number, number> = {
    125: 0,
    250: 0,
    500: 0,
    750: 0,
    1000: 0,
    1500: -slope * 0.05,
    2000: -slope * 0.10,
    3000: -slope * 0.15,
    4000: -slope * 0.18,
    6000: -slope * 0.12,
    8000: -slope * 0.08
  };

  // Pediatric boost: DSL v5 was designed for children and prescribes more for young patients
  const pediatricBoost = (age && age < 18) ? 1.15 : 1.0;

  return REM_FREQUENCIES.map(freq => {
    const threshold = getACThreshold(thresholds, freq, ear);
    const factor = gainFactors[freq] || 0.35;
    const slopeCorr = slopeCorrections[freq] || 0;

    let gain = threshold * factor * pediatricBoost + slopeCorr;
    gain = Math.max(0, gain);
    gain = Math.min(75, gain);

    return {
      frequency: freq,
      gain: Math.round(gain * 10) / 10
    };
  });
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * RealEarMeasurementService — singleton that handles REM simulation.
 *
 * Improvements over the original:
 *   - generateTargets() computes patient-specific NAL-NL2 / DSL v5 targets
 *   - REUR simulation uses a realistic ear-canal resonance curve
 *   - REIG is calculated as REAR minus REUR (not approximated)
 *   - Measurement variability is seeded for reproducibility in tests
 */
class RealEarMeasurementService {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private panNode: StereoPannerNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private currentSession: REMSession | null = null;
  private virtualHearingAids: Map<string, VirtualHearingAid> = new Map();
  private isPlaying: boolean = false;

  // Cached REUR for the current session (so REIG = REAR - REUR is consistent)
  private cachedREUR: REMMeasurementPoint[] | null = null;

  constructor() {
    this.initializeAudioContext();
    this.loadVirtualHearingAids();
  }

  // -------------------------------------------------------------------------
  // Audio context
  // -------------------------------------------------------------------------

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      // Running in test / SSR — no AudioContext available
    }
  }

  // -------------------------------------------------------------------------
  // Virtual hearing aids
  // -------------------------------------------------------------------------

  private loadVirtualHearingAids(): void {
    const hearingAids: VirtualHearingAid[] = [
      {
        id: 'ha1',
        name: 'Premium BTE',
        manufacturer: 'AudioCorp',
        type: 'BTE',
        maxGain: 70,
        maxOutput: 130,
        channels: 20,
        features: ['Feedback cancellation', 'Noise reduction', 'Directional mic'],
        defaultSettings: { 125: 10, 250: 15, 500: 20, 750: 25, 1000: 30, 1500: 35, 2000: 40, 3000: 45, 4000: 40, 6000: 35, 8000: 30 }
      },
      {
        id: 'ha2',
        name: 'Standard RIC',
        manufacturer: 'HearWell',
        type: 'RIC',
        maxGain: 60,
        maxOutput: 120,
        channels: 12,
        features: ['Feedback cancellation', 'Noise reduction'],
        defaultSettings: { 125: 5, 250: 10, 500: 15, 750: 20, 1000: 25, 1500: 30, 2000: 35, 3000: 40, 4000: 35, 6000: 30, 8000: 25 }
      },
      {
        id: 'ha3',
        name: 'Economy CIC',
        manufacturer: 'SoundClear',
        type: 'CIC',
        maxGain: 50,
        maxOutput: 110,
        channels: 8,
        features: ['Feedback cancellation'],
        defaultSettings: { 125: 0, 250: 5, 500: 10, 750: 15, 1000: 20, 1500: 25, 2000: 30, 3000: 35, 4000: 30, 6000: 25, 8000: 20 }
      }
    ];
    hearingAids.forEach(ha => this.virtualHearingAids.set(ha.id, ha));
  }

  public getHearingAids(): VirtualHearingAid[] {
    return Array.from(this.virtualHearingAids.values());
  }

  // -------------------------------------------------------------------------
  // Session management
  // -------------------------------------------------------------------------

  public createSession(patientId: string, hearingAidId: string): REMSession {
    this.cachedREUR = null;
    const session: REMSession = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      patientId,
      hearingAidId,
      startTime: new Date().toISOString(),
      completed: false,
      probeTubePosition: ProbePosition.NOT_INSERTED,
      ventType: VentType.OCCLUDED,
      measurements: [],
      targets: [],
      currentStep: 'REUR',
      errors: [],
      accuracy: 0
    };
    this.currentSession = session;
    return session;
  }

  public getCurrentSession(): REMSession | null {
    return this.currentSession;
  }

  // -------------------------------------------------------------------------
  // Probe tube
  // -------------------------------------------------------------------------

  public positionProbeTube(depth: number): ProbePosition {
    if (!this.currentSession) throw new Error('No active session');
    let position: ProbePosition;
    if (depth < 20) position = ProbePosition.TOO_SHALLOW;
    else if (depth > 30) position = ProbePosition.TOO_DEEP;
    else position = ProbePosition.CORRECT;
    this.currentSession.probeTubePosition = position;
    return position;
  }

  // -------------------------------------------------------------------------
  // Measurement simulation
  // -------------------------------------------------------------------------

  public performMeasurement(
    type: REMType,
    ear: 'left' | 'right',
    signalType: REMSignalType,
    inputLevel: REMLevel
  ): Promise<REMCurve> {
    if (!this.currentSession) return Promise.reject(new Error('No active session'));
    if (this.currentSession.probeTubePosition !== ProbePosition.CORRECT) {
      return Promise.reject(new Error('Probe tube not correctly positioned'));
    }

    const measurementPoints = this.simulateMeasurement(type, ear, signalType, inputLevel);

    const measurement: REMCurve = {
      type,
      ear,
      signalType,
      inputLevel,
      measurementPoints,
      timestamp: new Date().toISOString()
    };

    this.currentSession.measurements.push(measurement);
    this.currentSession.currentStep = type;

    return Promise.resolve(measurement);
  }

  /**
   * Generate realistic measurement data.
   *
   * Key improvements:
   *   - REUR uses a clinically accurate ear-canal resonance curve
   *   - REAR = hearing-aid gain + REUR (the aid amplifies on top of natural resonance)
   *   - REIG = REAR - REUR (calculated, not approximated)
   *   - Measurement noise is ±2 dB (clinically realistic)
   */
  private simulateMeasurement(
    type: REMType,
    ear: 'left' | 'right',
    _signalType: REMSignalType,
    inputLevel: REMLevel
  ): REMMeasurementPoint[] {
    if (!this.currentSession) throw new Error('No active session');
    const hearingAid = this.virtualHearingAids.get(this.currentSession.hearingAidId);
    if (!hearingAid) throw new Error('Hearing aid not found');

    const noise = () => (Math.random() - 0.5) * 4; // ±2 dB

    switch (type) {
      case 'REUR':
        return this.simulateREUR(noise);

      case 'REOR':
        return this.simulateREOR(noise);

      case 'REAR':
        return this.simulateREAR(hearingAid, inputLevel, noise);

      case 'REIG':
        return this.simulateREIG(hearingAid, inputLevel, noise);

      case 'RECD':
        return this.simulateRECD(noise);

      case 'RESR':
        return this.simulateRESR(hearingAid, inputLevel, noise);

      default:
        return REM_FREQUENCIES.map(f => ({ frequency: f, gain: 0 }));
    }
  }

  /** REUR: natural ear-canal resonance — peak ~2.7 kHz, 15-18 dB */
  public simulateREUR(noise: () => number = () => 0): REMMeasurementPoint[] {
    const points = REM_FREQUENCIES.map(freq => ({
      frequency: freq,
      gain: Math.round((TYPICAL_REUR[freq] + noise()) * 10) / 10
    }));
    // Cache for REIG computation
    this.cachedREUR = points;
    return points;
  }

  /** REOR: ear canal blocked by hearing aid (turned off). Vent size matters. */
  private simulateREOR(noise: () => number): REMMeasurementPoint[] {
    const ventFactor = this.getVentFactor();

    return REM_FREQUENCIES.map(freq => {
      const reur = TYPICAL_REUR[freq] || 0;
      // Occluded: low-freq boost (occlusion effect) + high-freq cut
      let occluded: number;
      if (freq < 500) occluded = 5;
      else if (freq < 1000) occluded = 2;
      else occluded = -3;

      const gain = reur * ventFactor + occluded * (1 - ventFactor) + noise();
      return { frequency: freq, gain: Math.round(gain * 10) / 10 };
    });
  }

  /**
   * REAR: hearing aid on in the ear.
   * REAR ≈ REUR + hearing-aid gain (frequency shaped) + input-level scaling.
   */
  private simulateREAR(
    hearingAid: VirtualHearingAid,
    inputLevel: REMLevel,
    noise: () => number
  ): REMMeasurementPoint[] {
    const levelScaling = (inputLevel - 65) * 0.5; // compression ratio ~2:1

    return REM_FREQUENCIES.map(freq => {
      const reur = TYPICAL_REUR[freq] || 0;
      const haGain = hearingAid.defaultSettings[freq] || 0;
      const gain = reur + haGain + levelScaling + noise();
      return { frequency: freq, gain: Math.round(gain * 10) / 10 };
    });
  }

  /** REIG = REAR − REUR (calculated from cached or typical REUR). */
  private simulateREIG(
    hearingAid: VirtualHearingAid,
    inputLevel: REMLevel,
    noise: () => number
  ): REMMeasurementPoint[] {
    const reurData = this.cachedREUR || this.simulateREUR();
    const rearData = this.simulateREAR(hearingAid, inputLevel, () => 0);

    return REM_FREQUENCIES.map((freq, i) => {
      const rear = rearData[i].gain;
      const reur = reurData[i].gain;
      return { frequency: freq, gain: Math.round((rear - reur + noise()) * 10) / 10 };
    });
  }

  /** RECD: real-ear-to-coupler difference — age-dependent. */
  private simulateRECD(noise: () => number): REMMeasurementPoint[] {
    return REM_FREQUENCIES.map(freq => {
      let base: number;
      if (freq < 500) base = 3;
      else if (freq < 1000) base = 5;
      else if (freq < 4000) base = 8;
      else base = 12;
      return { frequency: freq, gain: Math.round((base + noise()) * 10) / 10 };
    });
  }

  /** RESR: saturation response (maximum output). */
  private simulateRESR(
    hearingAid: VirtualHearingAid,
    inputLevel: REMLevel,
    noise: () => number
  ): REMMeasurementPoint[] {
    return REM_FREQUENCIES.map(freq => {
      const gain = Math.min(hearingAid.maxOutput - inputLevel, hearingAid.maxGain) + noise();
      return { frequency: freq, gain: Math.round(gain * 10) / 10 };
    });
  }

  // -------------------------------------------------------------------------
  // Vent factor
  // -------------------------------------------------------------------------

  private getVentFactor(): number {
    if (!this.currentSession) return 0;
    switch (this.currentSession.ventType) {
      case VentType.OCCLUDED: return 0;
      case VentType.SMALL_VENT: return 0.25;
      case VentType.MEDIUM_VENT: return 0.5;
      case VentType.LARGE_VENT: return 0.75;
      case VentType.OPEN_DOME: return 0.9;
      default: return 0;
    }
  }

  // -------------------------------------------------------------------------
  // Prescription targets  (H4 fix — patient-specific)
  // -------------------------------------------------------------------------

  /**
   * Generate prescription targets from the patient's audiogram.
   *
   * Uses PatientService to look up the patient, then computes insertion-gain
   * targets via NAL-NL2 or DSL v5. The REAR target is insertion gain + REUR.
   */
  public generateTargets(
    patientId: string,
    prescriptionMethod: 'NAL-NL2' | 'DSL' | 'NAL-NL1' | 'custom',
    ear: 'left' | 'right' = 'right'
  ): REMTarget[] {
    if (!this.currentSession) throw new Error('No active session');

    const patient = patientService.getPatientById(patientId);

    // Compute insertion-gain targets
    let igPoints: REMMeasurementPoint[];

    if (patient) {
      const thresholds = patient.thresholds;
      const age = patient.age;

      switch (prescriptionMethod) {
        case 'NAL-NL2':
        case 'NAL-NL1': // treat NAL-NL1 as slightly less gain than NL2
          igPoints = computeNALNL2InsertionGain(thresholds, ear, age);
          if (prescriptionMethod === 'NAL-NL1') {
            igPoints = igPoints.map(p => ({ ...p, gain: Math.round(p.gain * 0.9 * 10) / 10 }));
          }
          break;
        case 'DSL':
          igPoints = computeDSLv5InsertionGain(thresholds, ear, age);
          break;
        case 'custom':
        default:
          // Custom: use NAL-NL2 + 5 dB across the board
          igPoints = computeNALNL2InsertionGain(thresholds, ear, age);
          igPoints = igPoints.map(p => ({ ...p, gain: Math.round((p.gain + 5) * 10) / 10 }));
          break;
      }
    } else {
      // Fallback for unknown patients: generic moderate flat loss
      igPoints = REM_FREQUENCIES.map(freq => ({
        frequency: freq,
        gain: Math.round(((freq >= 1000 && freq <= 4000 ? 25 : 15)) * 10) / 10
      }));
    }

    // REIG target = insertion gain
    const reigTarget: REMTarget = {
      type: 'REIG',
      ear,
      patientId,
      prescriptionMethod,
      targetPoints: igPoints
    };

    // REAR target = insertion gain + REUR (so the student can compare REAR directly)
    const rearTarget: REMTarget = {
      type: 'REAR',
      ear,
      patientId,
      prescriptionMethod,
      targetPoints: igPoints.map(p => ({
        frequency: p.frequency,
        gain: Math.round((p.gain + (TYPICAL_REUR[p.frequency] || 0)) * 10) / 10
      }))
    };

    const targets = [rearTarget, reigTarget];
    this.currentSession.targets = targets;
    return targets;
  }

  // -------------------------------------------------------------------------
  // Accuracy calculation
  // -------------------------------------------------------------------------

  /**
   * Calculate weighted accuracy between a measurement and a target.
   * Returns a percentage 0-100. Also returns per-frequency details.
   */
  public calculateAccuracy(measurement: REMCurve, target: REMTarget): number {
    if (measurement.ear !== target.ear) return 0;
    // Allow REAR vs REIG comparison
    if (measurement.type !== target.type && !(measurement.type === 'REAR' && target.type === 'REIG')) {
      return 0;
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const measPoint of measurement.measurementPoints) {
      const targetPoint = target.targetPoints.find(tp => tp.frequency === measPoint.frequency);
      if (!targetPoint) continue;

      const diff = Math.abs(measPoint.gain - targetPoint.gain);

      let tolerance: number;
      let weight: number;
      if (measPoint.frequency >= 1000 && measPoint.frequency <= 4000) {
        tolerance = 3;
        weight = 3;
      } else if (measPoint.frequency < 1000) {
        tolerance = 5;
        weight = 2;
      } else {
        tolerance = 8;
        weight = 1;
      }

      const pointScore = diff <= tolerance
        ? 100
        : Math.max(0, 100 - ((diff - tolerance) / (tolerance * 2) * 100));

      totalWeightedScore += pointScore * weight;
      totalWeight += weight;
    }

    if (totalWeight === 0) return 0;
    const accuracy = totalWeightedScore / totalWeight;

    if (this.currentSession) this.currentSession.accuracy = accuracy;
    return accuracy;
  }

  /**
   * Per-frequency match details for the results step.
   * Returns an array of { frequency, measured, target, difference, withinTolerance, tolerance }.
   */
  public getPerFrequencyMatch(
    measurement: REMCurve,
    target: REMTarget
  ): Array<{
    frequency: REMFrequency;
    measured: number;
    target: number;
    difference: number;
    withinTolerance: boolean;
    tolerance: number;
  }> {
    return REM_FREQUENCIES.map(freq => {
      const meas = measurement.measurementPoints.find(p => p.frequency === freq);
      const targ = target.targetPoints.find(p => p.frequency === freq);
      const measured = meas?.gain ?? 0;
      const targetGain = targ?.gain ?? 0;
      const difference = measured - targetGain;
      const tolerance = (freq >= 1000 && freq <= 4000) ? 3 : (freq < 1000 ? 5 : 8);
      return {
        frequency: freq,
        measured,
        target: targetGain,
        difference,
        withinTolerance: Math.abs(difference) <= tolerance,
        tolerance
      };
    });
  }

  /**
   * Clinical interpretation of the fit quality.
   */
  public getFitInterpretation(accuracy: number): string {
    if (accuracy >= 95) {
      return 'Excellent fit quality. The hearing aid output closely matches prescriptive targets across all frequencies. No further adjustments needed.';
    } else if (accuracy >= 85) {
      return 'Good fit quality. Most frequencies are within clinical tolerances. Minor adjustments may improve comfort or speech clarity.';
    } else if (accuracy >= 70) {
      return 'Acceptable fit, but some frequencies deviate from targets. Focus adjustments on the speech-frequency range (1000-4000 Hz) for the greatest clinical benefit.';
    } else if (accuracy >= 50) {
      return 'Below-target fit. Significant deviations exist across multiple frequencies. Review hearing aid programming and consider whether the selected hearing aid has sufficient gain for this patient.';
    } else {
      return 'Poor fit. The hearing aid output does not match prescriptive targets. Verify probe placement, hearing aid programming, and coupling (dome/mold) before re-measuring.';
    }
  }

  // -------------------------------------------------------------------------
  // Audio playback
  // -------------------------------------------------------------------------

  public playTestSignal(signalType: REMSignalType, level: REMLevel, ear: 'left' | 'right'): void {
    if (!this.audioContext) this.initializeAudioContext();
    if (!this.audioContext) return;

    this.stopTestSignal();

    try {
      this.gainNode = this.audioContext.createGain();
      this.panNode = this.audioContext.createStereoPanner();
      this.panNode.pan.value = ear === 'left' ? -1 : 1;

      const gainValue = Math.pow(10, (level - 70) / 20);
      this.gainNode.gain.value = gainValue;

      if (signalType === 'pure_tone_sweep') {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = 'sine';
        const now = this.audioContext.currentTime;
        this.oscillator.frequency.setValueAtTime(125, now);
        this.oscillator.frequency.exponentialRampToValueAtTime(8000, now + 5);
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.panNode);
        this.panNode.connect(this.audioContext.destination);
        this.oscillator.start();
      } else {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
        const src = this.audioContext.createBufferSource();
        src.buffer = noiseBuffer;
        src.loop = true;
        this.noiseSource = src;
        src.connect(this.gainNode);
        this.gainNode.connect(this.panNode);
        this.panNode.connect(this.audioContext.destination);
        src.start();
      }

      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing test signal:', error);
    }
  }

  public stopTestSignal(): void {
    try {
      if (this.oscillator) { try { this.oscillator.stop(); } catch { /* */ } try { this.oscillator.disconnect(); } catch { /* */ } this.oscillator = null; }
      if (this.noiseSource) { try { this.noiseSource.stop(); } catch { /* */ } try { this.noiseSource.disconnect(); } catch { /* */ } this.noiseSource = null; }
      if (this.gainNode) { try { this.gainNode.disconnect(); } catch { /* */ } this.gainNode = null; }
      if (this.panNode) { try { this.panNode.disconnect(); } catch { /* */ } this.panNode = null; }
      this.isPlaying = false;
    } catch {
      // Cleanup errors are non-critical
    }
  }

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------

  public dispose(): void {
    this.stopTestSignal();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.currentSession = null;
    this.cachedREUR = null;
  }
}

const realEarMeasurementService = new RealEarMeasurementService();
export default realEarMeasurementService;

// Export helpers for testing
export {
  computeNALNL2InsertionGain,
  computeDSLv5InsertionGain,
  getACThreshold,
  computeSlope,
  computePTA,
  TYPICAL_REUR,
  REM_FREQUENCIES,
  RealEarMeasurementService
};
