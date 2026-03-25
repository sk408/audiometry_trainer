import { v4 as uuidv4 } from 'uuid';
import {
  TestSession, TestStep, HearingProfile, ThresholdPoint,
  Frequency, HearingLevel, TestResult, Ear
} from '../interfaces/AudioTypes';
import audioService from './AudioService';
import patientService from './PatientService';

/**
 * Maximum number of presentations per step before auto-completing.
 * Prevents infinite loops when threshold cannot be established.
 */
const MAX_PRESENTATIONS_PER_STEP = 30;

/**
 * Interface for test session configuration
 */
interface TestSessionConfig {
  includeAirConduction?: boolean;
  includeBoneConduction?: boolean;
}

/**
 * TestingService - Implements the Hughson-Westlake testing protocol
 * and manages test sessions
 */
class TestingService {
  private currentSession: TestSession | null = null;
  private activeSessions: TestSession[] = [];
  private completedSessions: TestSession[] = [];

  // Air conduction test frequencies in clinical order, plus 1000 Hz retest appended separately
  private testFrequencies: Frequency[] = [1000, 2000, 3000, 4000, 6000, 8000, 500, 250];

  // Bone conduction test frequencies (typically 250-4000 Hz, no retest)
  private boneTestFrequencies: Frequency[] = [1000, 2000, 3000, 4000, 500, 250];

  // Test types to include in sequence
  private testTypes: ('air' | 'bone')[] = ['air', 'bone'];

  // Default starting level in dB HL
  private defaultStartLevel: HearingLevel = 40;

  // Whether to include bone conduction tests
  private includeBoneConduction: boolean = true;

  // Whether to include air conduction tests
  private includeAirConduction: boolean = true;

  /**
   * Reset ALL session state to defaults.
   */
  public reset(): void {
    this.currentSession = null;
    this.activeSessions = [];
    this.completedSessions = [];
    this.includeBoneConduction = true;
    this.includeAirConduction = true;
  }

  /**
   * Start a new test session with a patient
   */
  public startSession(patient: HearingProfile, config?: TestSessionConfig): TestSession {
    // Reset configuration flags for the new session
    this.includeAirConduction = true;
    this.includeBoneConduction = true;

    // Apply configuration settings
    if (config) {
      if (config.includeAirConduction !== undefined) {
        this.includeAirConduction = config.includeAirConduction;
      }
      if (config.includeBoneConduction !== undefined) {
        this.includeBoneConduction = config.includeBoneConduction;
      }
    }

    // Generate test sequence based on Hughson-Westlake protocol
    const testSequence = this.generateTestSequence();

    // Create new session
    const newSession: TestSession = {
      id: uuidv4(),
      startTime: new Date().toISOString(),
      patientId: patient.id,
      completed: false,
      testSequence,
      currentStep: 0
    };

    this.currentSession = newSession;
    this.activeSessions.push(newSession);

    return newSession;
  }

  /**
   * Generate a test sequence based on the Hughson-Westlake protocol.
   * Air conduction order: 1000, 2000, 3000, 4000, 6000, 8000, 500, 250, 1000-retest
   * Bone conduction order: 1000, 2000, 3000, 4000, 500, 250
   */
  private generateTestSequence(): TestStep[] {
    const sequence: TestStep[] = [];
    let stepId = 1;

    // For each ear (right first, then left)
    (['right', 'left'] as Ear[]).forEach(ear => {
      // Air conduction
      if (this.includeAirConduction) {
        // Standard frequencies
        this.testFrequencies.forEach(freq => {
          sequence.push({
            id: stepId++,
            frequency: freq,
            ear: ear,
            testType: 'air',
            currentLevel: this.defaultStartLevel,
            completed: false,
            responses: []
          });
        });

        // 1000 Hz retest at the end of air conduction for this ear
        sequence.push({
          id: stepId++,
          frequency: 1000 as Frequency,
          ear: ear,
          testType: 'air',
          currentLevel: this.defaultStartLevel,
          completed: false,
          responses: [],
          isRetest: true
        });
      }

      // Bone conduction
      if (this.includeBoneConduction) {
        this.boneTestFrequencies.forEach(freq => {
          sequence.push({
            id: stepId++,
            frequency: freq,
            ear: ear,
            testType: 'bone',
            currentLevel: this.defaultStartLevel,
            completed: false,
            responses: []
          });
        });
      }
    });

    return sequence;
  }

  /**
   * Get the current test step
   */
  public getCurrentStep(): TestStep | null {
    if (!this.currentSession) return null;

    const { currentStep, testSequence } = this.currentSession;
    if (currentStep >= testSequence.length) return null;

    return testSequence[currentStep];
  }

  /**
   * Play the current tone based on the current step
   */
  public playCurrentTone(durationMs?: number, isPulsed: boolean = true): void {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return;

    const { frequency, ear, currentLevel, testType } = currentStep;

    audioService.playTone(
      frequency,
      currentLevel,
      ear,
      durationMs,
      testType,
      isPulsed
    );
  }

  /**
   * Record patient response to the current tone and apply Hughson-Westlake protocol
   */
  public recordResponse(didRespond: boolean): TestStep | null {
    if (!this.currentSession) return null;

    const step = this.getCurrentStep();
    if (!step) return null;

    // Record the response
    step.responses.push({
      level: step.currentLevel,
      response: didRespond
    });

    // Check max presentations escape hatch
    if (step.responses.length >= MAX_PRESENTATIONS_PER_STEP) {
      step.completed = true;
      step.responseStatus = 'no_response';
      this.moveToNextStep();
      return step;
    }

    // Apply Hughson-Westlake protocol to adjust the level
    this.adjustLevelPerProtocol(step, didRespond);

    return step;
  }

  /**
   * Record patient response without adjusting the level.
   * Use this during tone presentation to prevent automatic level changes.
   */
  public recordResponseWithoutAdjustment(didRespond: boolean): TestStep | null {
    if (!this.currentSession) return null;

    const step = this.getCurrentStep();
    if (!step) return null;

    step.responses.push({
      level: step.currentLevel,
      response: didRespond
    });

    return step;
  }

  /**
   * Manually set the current level without applying any protocol adjustments
   */
  public setCurrentLevel(level: HearingLevel): TestStep | null {
    if (!this.currentSession) return null;

    const step = this.getCurrentStep();
    if (!step) return null;

    step.currentLevel = level;

    return step;
  }

  /**
   * Adjust the hearing level according to the clinically accurate Hughson-Westlake protocol.
   *
   * Descending phase: Start at 30-40 dB HL. On response, decrease 10 dB. Continue until no response.
   * Ascending phase: On no response, increase 5 dB. During initial familiarization only
   *   (before the patient has ever responded), use 10 dB steps up.
   * Threshold: Lowest level with >= 2 out of >= 3 ascending responses at that level.
   */
  private adjustLevelPerProtocol(step: TestStep, didRespond: boolean): void {
    if (didRespond) {
      // Patient responded — always decrease by 10 dB (descending)
      step.currentLevel = Math.max(-10, step.currentLevel - 10) as HearingLevel;
    } else {
      // Patient did not respond — increase (ascending)
      // Determine if we are still in the initial familiarization phase.
      // Familiarization: the patient has never responded yet at all in this step.
      const hasEverResponded = step.responses.some(r => r.response);
      const stepSize = hasEverResponded ? 5 : 10;
      step.currentLevel = Math.min(120, step.currentLevel + stepSize) as HearingLevel;
    }

    // Check if threshold is established per Hughson-Westlake criteria
    if (this.isThresholdEstablished(step)) {
      step.completed = true;
      step.responseStatus = 'threshold';
      this.moveToNextStep();
    }
  }

  /**
   * Check if threshold is established according to Hughson-Westlake criteria.
   *
   * Only count ASCENDING responses: a response that occurred after an ascending approach
   * (i.e., the previous presentation at a lower level had no response, causing us to increase).
   * Threshold = lowest level with >= 2 ascending responses out of >= 3 ascending presentations
   * at that level.
   */
  private isThresholdEstablished(step: TestStep): boolean {
    const { responses } = step;

    // Need a minimum number of responses to establish threshold
    if (responses.length < 3) return false;

    // Identify ascending presentations.
    // An ascending presentation at level L means:
    //   - We arrived at L by increasing from a lower level where there was no response.
    //   - The first presentation is never ascending (it's the initial descending start).
    //   - A presentation is ascending if the previous presentation was at a lower level
    //     AND the previous response was false (no response), meaning we increased to this level.
    //
    // We also need to handle the case where we descended after a response, hit a no-response,
    // and then ascended back up. Each time we arrive at a level from below (after no-response),
    // that's an ascending presentation.

    // Track ascending presentations by level
    const ascendingCounts = new Map<HearingLevel, { total: number; heard: number }>();

    for (let i = 1; i < responses.length; i++) {
      const prev = responses[i - 1];
      const curr = responses[i];

      // This is an ascending presentation if:
      // - current level > previous level (we went up)
      // - previous response was false (the reason we went up)
      // OR
      // - current level == previous level and the previous was ascending and had no response
      //   (but in standard H-W, consecutive same-level presentations don't happen via protocol)
      //
      // Simpler: ascending = we arrived here from a lower level where there was no response
      const isAscending = curr.level > prev.level && !prev.response;

      if (isAscending) {
        const existing = ascendingCounts.get(curr.level) || { total: 0, heard: 0 };
        existing.total += 1;
        if (curr.response) {
          existing.heard += 1;
        }
        ascendingCounts.set(curr.level, existing);
      }
    }

    // Find the lowest level with >= 2 heard out of >= 3 ascending presentations
    let thresholdFound = false;

    ascendingCounts.forEach((counts) => {
      if (counts.total >= 3 && counts.heard >= 2) {
        thresholdFound = true;
      }
    });

    return thresholdFound;
  }

  /**
   * Move to the next test step
   */
  private moveToNextStep(): void {
    if (!this.currentSession) return;

    this.currentSession.currentStep += 1;

    // Check if the test is complete
    if (this.currentSession.currentStep >= this.currentSession.testSequence.length) {
      this.completeSession();
    }
  }

  /**
   * Skip the current test step and move to the next one
   */
  public skipCurrentStep(markCompleted: boolean = false): TestStep | null {
    if (!this.currentSession) {
      return null;
    }

    const step = this.getCurrentStep();
    if (step) {
      if (markCompleted) {
        step.completed = true;
        if (!step.responseStatus) {
          step.responseStatus = 'threshold';
        }
      }

      this.moveToNextStep();
    }

    return this.getCurrentStep();
  }

  /**
   * Complete the current test session and calculate results
   */
  public completeSession(): TestSession | null {
    if (!this.currentSession) return null;

    const session = this.currentSession;
    session.completed = true;

    // Calculate the results
    const results = this.calculateResults(session);
    session.results = results;

    // Move from active to completed sessions
    this.completedSessions.push(session);
    this.activeSessions = this.activeSessions.filter(s => s.id !== session.id);
    this.currentSession = null;

    return session;
  }

  /**
   * Calculate test results including accuracy and technical errors.
   *
   * Primary accuracy metric: percentage within +/-5 dB.
   * Also includes within +/-10 dB, per-ear breakdown, and per-type breakdown.
   */
  private calculateResults(session: TestSession): TestResult {
    const userThresholds = this.extractThresholds(session);

    // Get actual patient thresholds from PatientService
    const patient = patientService.getPatientById(session.patientId);
    const actualThresholds = patient ? patient.thresholds : [];

    // Calculate accuracy by comparing user vs actual thresholds
    let totalComparisons = 0;
    let within5dBCount = 0;
    let within10dBCount = 0;

    // Per-ear tracking
    const byEar: Record<string, { total: number; within5: number }> = {
      right: { total: 0, within5: 0 },
      left: { total: 0, within5: 0 }
    };

    // Per-type tracking
    const byType: Record<string, { total: number; within5: number }> = {
      air: { total: 0, within5: 0 },
      bone: { total: 0, within5: 0 }
    };

    userThresholds.forEach(userT => {
      if (userT.responseStatus === 'not_tested') return;

      // Retest steps are already excluded in extractThresholds, so all
      // thresholds here are from primary test steps only.

      const actual = actualThresholds.find(
        a => a.frequency === userT.frequency &&
             a.ear === userT.ear &&
             a.testType === userT.testType
      );
      if (!actual) return;

      totalComparisons++;
      const diff = Math.abs(userT.hearingLevel - actual.hearingLevel);
      if (diff <= 5) {
        within5dBCount++;
        byEar[userT.ear].within5++;
        const typeKey = (userT.testType === 'air' || userT.testType === 'masked_air') ? 'air' : 'bone';
        byType[typeKey].within5++;
      }
      if (diff <= 10) within10dBCount++;

      byEar[userT.ear].total++;
      const typeKey = (userT.testType === 'air' || userT.testType === 'masked_air') ? 'air' : 'bone';
      byType[typeKey].total++;
    });

    const accuracy = totalComparisons > 0
      ? Math.round((within5dBCount / totalComparisons) * 100)
      : 0;

    const within10dBPct = totalComparisons > 0
      ? Math.round((within10dBCount / totalComparisons) * 100)
      : 0;

    const accuracyByEar = {
      right: byEar.right.total > 0
        ? Math.round((byEar.right.within5 / byEar.right.total) * 100)
        : 0,
      left: byEar.left.total > 0
        ? Math.round((byEar.left.within5 / byEar.left.total) * 100)
        : 0
    };

    const accuracyByType = {
      air: byType.air.total > 0
        ? Math.round((byType.air.within5 / byType.air.total) * 100)
        : 0,
      bone: byType.bone.total > 0
        ? Math.round((byType.bone.within5 / byType.bone.total) * 100)
        : 0
    };

    const result: TestResult = {
      patientId: session.patientId,
      timestamp: new Date().toISOString(),
      userThresholds,
      actualThresholds,
      accuracy,
      within5dB: accuracy,
      within10dB: within10dBPct,
      accuracyByEar,
      accuracyByType,
      testDuration: this.calculateTestDuration(session),
      technicalErrors: this.identifyTechnicalErrors(session)
    };

    return result;
  }

  /**
   * Extract threshold points from a completed test session.
   * Uses ascending-only logic consistent with the Hughson-Westlake protocol.
   * For retest steps, the threshold is extracted but not included in the main
   * accuracy array (handled in calculateResults).
   */
  private extractThresholds(session: TestSession): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];

    session.testSequence.forEach(step => {
      // Skip retest steps — they are used only for technical error checking
      if (step.isRetest) return;

      if (step.completed && step.responses.length > 0) {
        // For completed steps, find the validated threshold from ascending responses
        const thresholdLevel = this.findAscendingThreshold(step);

        if (thresholdLevel !== null) {
          thresholds.push({
            frequency: step.frequency,
            hearingLevel: thresholdLevel,
            ear: step.ear,
            testType: step.testType,
            responseStatus: step.responseStatus || 'threshold'
          });
        } else {
          // Fallback: use the currentLevel if no ascending threshold found
          thresholds.push({
            frequency: step.frequency,
            hearingLevel: step.currentLevel,
            ear: step.ear,
            testType: step.testType,
            responseStatus: step.responseStatus || 'threshold'
          });
        }
      } else if (step.responses.length > 0) {
        // For incomplete steps with responses, try to find a partial threshold
        const thresholdLevel = this.findAscendingThreshold(step);

        if (thresholdLevel !== null) {
          thresholds.push({
            frequency: step.frequency,
            hearingLevel: thresholdLevel,
            ear: step.ear,
            testType: step.testType,
            responseStatus: 'threshold'
          });
        } else {
          // No threshold established, use highest level tested
          const highestLevel = Math.max(...step.responses.map(r => r.level)) as HearingLevel;
          thresholds.push({
            frequency: step.frequency,
            hearingLevel: highestLevel,
            ear: step.ear,
            testType: step.testType,
            responseStatus: 'no_response'
          });
        }
      } else {
        // Step was skipped or incomplete
        thresholds.push({
          frequency: step.frequency,
          hearingLevel: 0 as HearingLevel,
          ear: step.ear,
          testType: step.testType,
          responseStatus: 'not_tested'
        });
      }
    });

    return thresholds;
  }

  /**
   * Find the threshold level from ascending responses in a step.
   * Returns the lowest level with >= 2 ascending responses out of >= 3 ascending presentations,
   * or falls back to the lowest level with >= 2 out of any ascending presentations.
   * Returns null if no ascending threshold can be determined.
   */
  private findAscendingThreshold(step: TestStep): HearingLevel | null {
    const { responses } = step;
    if (responses.length < 2) return null;

    // Collect ascending presentations by level
    const ascendingCounts = new Map<HearingLevel, { total: number; heard: number }>();

    for (let i = 1; i < responses.length; i++) {
      const prev = responses[i - 1];
      const curr = responses[i];
      const isAscending = curr.level > prev.level && !prev.response;

      if (isAscending) {
        const existing = ascendingCounts.get(curr.level) || { total: 0, heard: 0 };
        existing.total += 1;
        if (curr.response) {
          existing.heard += 1;
        }
        ascendingCounts.set(curr.level, existing);
      }
    }

    // First try: strict criterion (>= 2 heard out of >= 3 ascending)
    let bestLevel: HearingLevel | null = null;
    let lowestLevel = Infinity;

    ascendingCounts.forEach((counts, level) => {
      if (counts.total >= 3 && counts.heard >= 2 && level < lowestLevel) {
        lowestLevel = level;
        bestLevel = level;
      }
    });

    if (bestLevel !== null) return bestLevel;

    // Fallback: find the lowest level with >= 2 ascending responses (any number of presentations)
    lowestLevel = Infinity;
    ascendingCounts.forEach((counts, level) => {
      if (counts.heard >= 2 && level < lowestLevel) {
        lowestLevel = level;
        bestLevel = level;
      }
    });

    return bestLevel;
  }

  /**
   * Calculate the total duration of a test session
   */
  private calculateTestDuration(session: TestSession): number {
    const startTime = new Date(session.startTime).getTime();
    const endTime = new Date().getTime();

    return Math.round((endTime - startTime) / 1000);
  }

  /**
   * Identify technical errors made during the test.
   * Includes 1000 Hz retest consistency check.
   */
  private identifyTechnicalErrors(session: TestSession): string[] {
    const errors: string[] = [];

    // Check if some frequencies were skipped
    const skippedSteps = session.testSequence.filter(step => !step.completed && !step.isRetest);
    if (skippedSteps.length > 0) {
      errors.push(`Skipped ${skippedSteps.length} test frequencies`);
    }

    // Check if sufficient responses were collected
    session.testSequence.forEach(step => {
      if (step.isRetest) return;
      if (step.completed && step.responses.length < 3) {
        errors.push(`Insufficient responses for ${step.frequency} Hz in ${step.ear} ear`);
      }
    });

    // Check if the starting level was appropriate
    session.testSequence.forEach(step => {
      if (step.isRetest) return;
      if (step.responses.length > 0 && step.responses[0].level > 60) {
        errors.push(`Starting level too high for ${step.frequency} Hz in ${step.ear} ear`);
      }
    });

    // 1000 Hz retest consistency check
    (['right', 'left'] as Ear[]).forEach(ear => {
      const initialStep = session.testSequence.find(
        s => s.frequency === 1000 && s.ear === ear && s.testType === 'air' && !s.isRetest
      );
      const retestStep = session.testSequence.find(
        s => s.frequency === 1000 && s.ear === ear && s.testType === 'air' && s.isRetest
      );

      if (initialStep && retestStep && initialStep.completed && retestStep.completed) {
        const initialThreshold = this.getStepThreshold(initialStep);
        const retestThreshold = this.getStepThreshold(retestStep);

        if (initialThreshold !== null && retestThreshold !== null) {
          const diff = Math.abs(initialThreshold - retestThreshold);
          if (diff > 5) {
            errors.push(
              `1000 Hz retest discrepancy in ${ear} ear: initial=${initialThreshold} dB, retest=${retestThreshold} dB (diff=${diff} dB > 5 dB)`
            );
          }
        }
      }
    });

    return errors;
  }

  /**
   * Get the threshold level for a step, using ascending logic or fallback.
   */
  private getStepThreshold(step: TestStep): HearingLevel | null {
    if (step.responses.length === 0) return null;

    const ascending = this.findAscendingThreshold(step);
    if (ascending !== null) return ascending;

    // Fallback: use the last response level
    return step.currentLevel;
  }

  /**
   * Get the current active session
   */
  public getCurrentSession(): TestSession | null {
    return this.currentSession;
  }

  /**
   * Get all active test sessions
   */
  public getActiveSessions(): TestSession[] {
    return [...this.activeSessions];
  }

  /**
   * Get all completed test sessions
   */
  public getCompletedSessions(): TestSession[] {
    return [...this.completedSessions];
  }

  /**
   * Get a session by ID
   */
  public getSessionById(id: string): TestSession | null {
    return (
      this.activeSessions.find(s => s.id === id) ||
      this.completedSessions.find(s => s.id === id) ||
      null
    );
  }

  /**
   * Clear all test sessions (for cleaning up or testing)
   */
  public clearAllSessions(): void {
    this.activeSessions = [];
    this.completedSessions = [];
    this.currentSession = null;
  }

  /**
   * Calculate progress percentage of the current test session
   */
  public calculateProgress(): number {
    if (!this.currentSession) return 0;

    const totalSteps = this.currentSession.testSequence.length;
    if (totalSteps === 0) return 0;

    const currentStepIndex = this.currentSession.currentStep;

    return Math.round((currentStepIndex / totalSteps) * 100);
  }
}

// Create a singleton instance
const testingService = new TestingService();
export default testingService;
