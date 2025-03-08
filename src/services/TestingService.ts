import { v4 as uuidv4 } from 'uuid';
import { 
  TestSession, TestStep, HearingProfile, ThresholdPoint, 
  Frequency, HearingLevel, TestResult, Ear 
} from '../interfaces/AudioTypes';
import audioService from './AudioService';

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

  // Standard test frequencies in Hz (from low to high)
  private testFrequencies: Frequency[] = [1000, 2000, 4000, 8000, 1000, 500, 250];
  
  // Bone conduction test frequencies (typically 250-4000 Hz)
  private boneTestFrequencies: Frequency[] = [1000, 2000, 4000, 1000, 500, 250];
  
  // Test types to include in sequence
  private testTypes: ('air' | 'bone')[] = ['air', 'bone'];
  
  // Default starting level in dB HL
  private defaultStartLevel: HearingLevel = 40;
  
  // Step sizes for the Hughson-Westlake procedure
  private initialStepSize: number = 10;
  private finalStepSize: number = 5;

  // Whether to include bone conduction tests
  private includeBoneConduction: boolean = true;

  // Whether to include air conduction tests
  private includeAirConduction: boolean = true;

  /**
   * Start a new test session with a patient
   * @param patient - Patient profile
   * @param config - Test configuration options
   * @returns New test session
   */
  public startSession(patient: HearingProfile, config?: TestSessionConfig): TestSession {
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
   * Generate a test sequence based on the Hughson-Westlake protocol
   * @returns Array of test steps
   */
  private generateTestSequence(): TestStep[] {
    const sequence: TestStep[] = [];
    let stepId = 1;
    
    // For each ear (right first, then left)
    ['right', 'left'].forEach(ear => {
      // For each test type (air conduction, then bone conduction)
      this.testTypes.forEach(testType => {
        // Skip bone conduction for some difficulties or based on settings
        if (testType === 'bone' && !this.includeBoneConduction) {
          return;
        }
        
        // Select appropriate frequencies for this test type
        const frequencies = testType === 'bone' ? this.boneTestFrequencies : this.testFrequencies;
        
        // For each frequency in the sequence
        frequencies.forEach(freq => {
          // Add test step
          sequence.push({
            id: stepId++,
            frequency: freq,
            ear: ear as Ear,
            testType: testType,
            currentLevel: this.defaultStartLevel,
            completed: false,
            responses: []
          });
        });
      });
    });
    
    return sequence;
  }

  /**
   * Get the current test step
   * @returns Current test step or null if no active session
   */
  public getCurrentStep(): TestStep | null {
    if (!this.currentSession) return null;
    
    const { currentStep, testSequence } = this.currentSession;
    if (currentStep >= testSequence.length) return null;
    
    return testSequence[currentStep];
  }

  /**
   * Play the current tone based on the current step
   * @param durationMs - Optional duration in milliseconds
   */
  public playCurrentTone(durationMs?: number): void {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return;
    
    const { frequency, ear, currentLevel, testType } = currentStep;
    
    // Play the tone with the appropriate parameters
    audioService.playTone(
      frequency,
      currentLevel,
      ear,
      durationMs,
      testType // Pass the test type to the playTone method
    );
  }

  /**
   * Record patient response to the current tone
   * @param didRespond - Whether the patient responded to the tone
   * @returns Updated test step
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
    
    // Apply Hughson-Westlake protocol to adjust the level
    this.adjustLevelPerProtocol(step, didRespond);
    
    return step;
  }

  /**
   * Record patient response without adjusting the level
   * Use this during tone presentation to prevent automatic level changes
   * @param didRespond - Whether the patient responded to the tone
   * @returns Updated test step without level adjustment
   */
  public recordResponseWithoutAdjustment(didRespond: boolean): TestStep | null {
    if (!this.currentSession) return null;
    
    const step = this.getCurrentStep();
    if (!step) return null;
    
    // Record the response without adjusting the level
    step.responses.push({
      level: step.currentLevel,
      response: didRespond
    });
    
    // Do NOT apply Hughson-Westlake protocol to adjust the level
    // This allows manual control of level adjustments
    
    return step;
  }

  /**
   * Manually set the current level without applying any protocol adjustments
   * @param level - The hearing level in dB to set
   * @returns Updated test step or null if no active session
   */
  public setCurrentLevel(level: HearingLevel): TestStep | null {
    if (!this.currentSession) return null;
    
    const step = this.getCurrentStep();
    if (!step) return null;
    
    // Set the level directly without any protocol-based adjustments
    // Store the current frequency and ear to ensure we're only updating the correct step
    const currentFrequency = step.frequency;
    const currentEar = step.ear;
    
    console.log(`TestingService: Setting level for frequency ${currentFrequency}Hz, ${currentEar} ear to ${level}dB`);
    
    // Only update the current step to prevent affecting other frequencies
    step.currentLevel = level;
    
    return step;
  }

  /**
   * Adjust the hearing level according to Hughson-Westlake protocol
   * @param step - Current test step
   * @param didRespond - Whether the patient responded
   */
  private adjustLevelPerProtocol(step: TestStep, didRespond: boolean): void {
    const { responses } = step;
    
    if (didRespond) {
      // Patient responded - ALWAYS decrease level by 10dB (make it softer)
      // This is a core principle of Hughson-Westlake: any response triggers 10 dB descent
      step.currentLevel = Math.max(-10, step.currentLevel - 10) as HearingLevel;
      console.log(`Patient responded: Decreasing by 10 dB to ${step.currentLevel} dB (Hughson-Westlake protocol)`);
    } else {
      // Patient did not respond - increase by 5 dB
      // In Hughson-Westlake, after no response during bracketing, always use 5 dB ascent
      // The only exception is during the initial phase with very large step sizes
      const isInitialPhase = responses.length < 2; 
      const stepSize = isInitialPhase ? this.initialStepSize : this.finalStepSize;
      step.currentLevel = Math.min(120, step.currentLevel + stepSize) as HearingLevel;
      console.log(`No response: Increasing by ${stepSize} dB to ${step.currentLevel} dB (${isInitialPhase ? 'Initial phase' : 'Bracketing phase'})`);
    }
    
    // Check if threshold is established per Hughson-Westlake criteria
    if (this.isThresholdEstablished(step)) {
      step.completed = true;
      this.moveToNextStep();
    }
  }

  /**
   * Determine step size based on the stage of testing
   * @param step - Current test step
   * @returns Step size in dB
   */
  private determineStepSize(step: TestStep): number {
    const { responses } = step;
    
    // In Hughson-Westlake protocol:
    // - Initial phase with no responses or very few: use 10 dB steps
    // - After first response: Always 10 dB DOWN after response, 5 dB UP after no response
    
    // Initial phase: use 10dB steps
    if (responses.length < 2) {
      return this.initialStepSize; // 10dB
    }
    
    // Once we have responses, use 5dB steps for more precision
    return this.finalStepSize; // 5dB
  }

  /**
   * Check if threshold is established according to Hughson-Westlake criteria
   * @param step - Current test step
   * @returns Whether threshold is established
   */
  private isThresholdEstablished(step: TestStep): boolean {
    const { responses } = step;
    
    // Need a minimum number of responses before we can establish a threshold
    if (responses.length < 3) return false;
    
    // Get responses at each level
    const responseCounts = new Map<HearingLevel, { total: number, heard: number }>();
    
    responses.forEach(response => {
      const level = response.level;
      const existing = responseCounts.get(level) || { total: 0, heard: 0 };
      existing.total += 1;
      if (response.response) {
        existing.heard += 1;
      }
      responseCounts.set(level, existing);
    });
    
    // Check for any level with at least 2/3 positive responses
    // Hughson-Westlake defines threshold as the lowest level with ≥50% response rate
    let isThresholdFound = false;
    let lowestThresholdLevel: HearingLevel | null = null;
    
    responseCounts.forEach((counts, level) => {
      // Check if we have at least 3 presentations and 2+ responses at this level
      if (counts.total >= 3 && counts.heard >= 2) {
        // If we haven't found a threshold yet, or this is a lower level than previously found
        if (!isThresholdFound || (lowestThresholdLevel !== null && level < lowestThresholdLevel)) {
          isThresholdFound = true;
          lowestThresholdLevel = level;
          console.log(`Threshold identified at ${level} dB with ${counts.heard}/${counts.total} responses`);
        }
      }
    });
    
    if (isThresholdFound) {
      console.log(`Final threshold established at ${lowestThresholdLevel} dB`);
    }
    
    return isThresholdFound;
  }

  /**
   * Move to the next test step
   */
  private moveToNextStep(): void {
    if (!this.currentSession) return;
    
    // Log the current step's level and status before moving
    const currentStep = this.getCurrentStep();
    if (currentStep) {
      console.log(`Completing step at level: ${currentStep.currentLevel}dB before moving to next step`);
      console.log(`Step completed status: ${currentStep.completed}, responseStatus: ${currentStep.responseStatus || 'not set'}`);
    }
    
    // Simply change the currentStep index without modifying the step itself
    // This preserves any completed/threshold status that was set
    this.currentSession.currentStep += 1;
    
    // Check if the test is complete
    if (this.currentSession.currentStep >= this.currentSession.testSequence.length) {
      this.completeSession();
    }
  }

  /**
   * Skip the current test step and move to the next one
   * @param markCompleted - Whether to mark the current step as completed (default: false)
   * @returns The next test step or null if test is complete
   */
  public skipCurrentStep(markCompleted: boolean = false): TestStep | null {
    console.log("=== Debug: skipCurrentStep called with markCompleted =", markCompleted);
    
    if (!this.currentSession) {
      console.log("=== Debug: skipCurrentStep - no current session");
      return null;
    }
    
    const step = this.getCurrentStep();
    if (step) {
      // IMPORTANT: We need to preserve the completed status and responseStatus
      // when navigating between frequencies
      if (markCompleted) {
        // Only mark as completed if explicitly requested
        console.log(`Marking step as completed with threshold at: ${step.currentLevel}dB`);
        step.completed = true;
        
        // If we're marking as completed, also set responseStatus if not already set
        if (!step.responseStatus) {
          step.responseStatus = 'threshold';
        }
      } else {
        console.log(`Skipping to next step without marking current step as completed`);
        // FIXED: Do not modify the completed or responseStatus properties if they're already set
        // This preserves thresholds when navigating between frequencies
      }
      
      const beforeStep = this.currentSession.currentStep;
      this.moveToNextStep();
      const afterStep = this.currentSession.currentStep;
      console.log(`=== Debug: skipCurrentStep - moved from step ${beforeStep} to ${afterStep}`);
      
      // Debug - check if the session sequence length matches
      console.log(`=== Debug: session has ${this.currentSession.testSequence.length} total steps`);
      console.log(`=== Debug: returning new step with frequency ${this.getCurrentStep()?.frequency || 'null'}`);
    } else {
      console.log("=== Debug: skipCurrentStep - no current step found");
    }
    
    return this.getCurrentStep();
  }

  /**
   * Complete the current test session and calculate results
   * @returns The completed test session with results
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
   * Calculate test results including accuracy and technical errors
   * @param session - Completed test session
   * @returns Test results
   */
  private calculateResults(session: TestSession): TestResult {
    // This would normally require accessing the actual patient thresholds
    // and comparing with the user's measurements
    
    // For now, generate a placeholder result
    const result: TestResult = {
      patientId: session.patientId,
      timestamp: new Date().toISOString(),
      userThresholds: this.extractThresholds(session),
      actualThresholds: [], // Would need to get these from the patient profile
      accuracy: 0, // To be calculated
      testDuration: this.calculateTestDuration(session),
      technicalErrors: this.identifyTechnicalErrors(session)
    };
    
    return result;
  }

  /**
   * Extract threshold points from a completed test session
   * @param session - Completed test session
   * @returns Array of threshold points
   */
  private extractThresholds(session: TestSession): ThresholdPoint[] {
    const thresholds: ThresholdPoint[] = [];
    
    session.testSequence.forEach(step => {
      if (step.completed && step.responses.length > 0) {
        // For completed steps, find the validated threshold level from the responses
        // This is the lowest level with at least 2/3 positive responses
        const levelCounts = new Map<HearingLevel, { total: number, heard: number }>();
        
        step.responses.forEach(response => {
          const level = response.level;
          const existing = levelCounts.get(level) || { total: 0, heard: 0 };
          existing.total += 1;
          if (response.response) {
            existing.heard += 1;
          }
          levelCounts.set(level, existing);
        });
        
        // Find the lowest valid threshold level
        let validatedThreshold: HearingLevel | null = null;
        let lowestValidLevel = Infinity;
        
        levelCounts.forEach((counts, level) => {
          if (counts.total >= 3 && counts.heard >= 2 && level < lowestValidLevel) {
            lowestValidLevel = level;
            validatedThreshold = level;
          }
        });
        
        // If we found a validated threshold, use it; otherwise fall back to currentLevel
        const thresholdLevel = validatedThreshold !== null ? validatedThreshold : step.currentLevel;
        console.log(`Extracting threshold for completed step: ${thresholdLevel}dB (was ${step.currentLevel}dB)`);
        
        thresholds.push({
          frequency: step.frequency,
          hearingLevel: thresholdLevel,
          ear: step.ear,
          testType: step.testType,
          responseStatus: 'threshold'
        });
      } else if (step.responses.length > 0) {
        // For incomplete steps with responses, find the lowest level with at least 2 responses
        console.log(`Extracting threshold data for incomplete step with ${step.responses.length} responses`);
        
        const levelCounts = new Map<HearingLevel, number>();
        
        step.responses.forEach(response => {
          if (response.response) {
            const count = levelCounts.get(response.level) || 0;
            levelCounts.set(response.level, count + 1);
          }
        });
        
        // Find the lowest level with at least 2 responses
        let thresholdLevel: HearingLevel | null = null;
        let lowestLevel = Infinity;
        
        levelCounts.forEach((count, level) => {
          if (count >= 2 && level < lowestLevel) {
            lowestLevel = level;
            thresholdLevel = level;
          }
        });
        
        if (thresholdLevel !== null) {
          console.log(`Found valid threshold in incomplete step at: ${thresholdLevel}dB`);
          
          thresholds.push({
            frequency: step.frequency,
            hearingLevel: thresholdLevel,
            ear: step.ear,
            testType: step.testType,
            responseStatus: 'threshold'
          });
        } else if (step.responses.length > 0) {
          // No threshold established, use highest level tested
          const highestLevel = Math.max(...step.responses.map(r => r.level)) as HearingLevel;
          console.log(`No valid threshold found, using highest level: ${highestLevel}dB`);
          
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
   * Calculate the total duration of a test session
   * @param session - Test session
   * @returns Duration in seconds
   */
  private calculateTestDuration(session: TestSession): number {
    const startTime = new Date(session.startTime).getTime();
    const endTime = new Date().getTime();
    
    return Math.round((endTime - startTime) / 1000);
  }

  /**
   * Identify technical errors made during the test
   * @param session - Test session
   * @returns Array of error descriptions
   */
  private identifyTechnicalErrors(session: TestSession): string[] {
    const errors: string[] = [];
    
    // Check if some frequencies were skipped
    const skippedSteps = session.testSequence.filter(step => !step.completed);
    if (skippedSteps.length > 0) {
      errors.push(`Skipped ${skippedSteps.length} test frequencies`);
    }
    
    // Check if sufficient responses were collected
    session.testSequence.forEach(step => {
      if (step.completed && step.responses.length < 3) {
        errors.push(`Insufficient responses for ${step.frequency} Hz in ${step.ear} ear`);
      }
    });
    
    // Check if the starting level was appropriate
    session.testSequence.forEach(step => {
      if (step.responses.length > 0 && step.responses[0].level > 60) {
        errors.push(`Starting level too high for ${step.frequency} Hz in ${step.ear} ear`);
      }
    });
    
    return errors;
  }

  /**
   * Get the current active session
   * @returns Current test session or null if none active
   */
  public getCurrentSession(): TestSession | null {
    return this.currentSession;
  }

  /**
   * Get all active test sessions
   * @returns Array of active test sessions
   */
  public getActiveSessions(): TestSession[] {
    return [...this.activeSessions];
  }

  /**
   * Get all completed test sessions
   * @returns Array of completed test sessions
   */
  public getCompletedSessions(): TestSession[] {
    return [...this.completedSessions];
  }

  /**
   * Get a session by ID
   * @param id - Session ID
   * @returns Test session or null if not found
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
}

// Create a singleton instance
const testingService = new TestingService();
export default testingService; 