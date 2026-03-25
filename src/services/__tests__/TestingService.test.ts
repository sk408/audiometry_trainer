import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HearingProfile, HearingLevel, TestStep } from '../../interfaces/AudioTypes';

// Mock AudioService before importing TestingService
vi.mock('../AudioService', () => ({
  default: {
    playTone: vi.fn(),
    stopTone: vi.fn(),
    resumeAudioContext: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock PatientService
vi.mock('../PatientService', () => ({
  default: {
    getPatientById: vi.fn().mockReturnValue({
      id: 'test-patient',
      name: 'Test Patient',
      description: 'Test patient for unit tests',
      difficulty: 'beginner',
      hearingLossType: 'normal',
      thresholds: [
        { frequency: 1000, hearingLevel: 30, ear: 'right', testType: 'air', responseStatus: 'threshold' },
        { frequency: 2000, hearingLevel: 35, ear: 'right', testType: 'air', responseStatus: 'threshold' },
        { frequency: 3000, hearingLevel: 40, ear: 'right', testType: 'air', responseStatus: 'threshold' },
        { frequency: 4000, hearingLevel: 45, ear: 'right', testType: 'air', responseStatus: 'threshold' },
        { frequency: 6000, hearingLevel: 50, ear: 'right', testType: 'air', responseStatus: 'threshold' },
        { frequency: 8000, hearingLevel: 55, ear: 'right', testType: 'air', responseStatus: 'threshold' },
        { frequency: 500, hearingLevel: 25, ear: 'right', testType: 'air', responseStatus: 'threshold' },
        { frequency: 250, hearingLevel: 20, ear: 'right', testType: 'air', responseStatus: 'threshold' },
        { frequency: 1000, hearingLevel: 25, ear: 'right', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 2000, hearingLevel: 30, ear: 'right', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 3000, hearingLevel: 35, ear: 'right', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 4000, hearingLevel: 40, ear: 'right', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 500, hearingLevel: 20, ear: 'right', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 250, hearingLevel: 15, ear: 'right', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 1000, hearingLevel: 30, ear: 'left', testType: 'air', responseStatus: 'threshold' },
        { frequency: 2000, hearingLevel: 35, ear: 'left', testType: 'air', responseStatus: 'threshold' },
        { frequency: 3000, hearingLevel: 40, ear: 'left', testType: 'air', responseStatus: 'threshold' },
        { frequency: 4000, hearingLevel: 45, ear: 'left', testType: 'air', responseStatus: 'threshold' },
        { frequency: 6000, hearingLevel: 50, ear: 'left', testType: 'air', responseStatus: 'threshold' },
        { frequency: 8000, hearingLevel: 55, ear: 'left', testType: 'air', responseStatus: 'threshold' },
        { frequency: 500, hearingLevel: 25, ear: 'left', testType: 'air', responseStatus: 'threshold' },
        { frequency: 250, hearingLevel: 20, ear: 'left', testType: 'air', responseStatus: 'threshold' },
        { frequency: 1000, hearingLevel: 25, ear: 'left', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 2000, hearingLevel: 30, ear: 'left', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 3000, hearingLevel: 35, ear: 'left', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 4000, hearingLevel: 40, ear: 'left', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 500, hearingLevel: 20, ear: 'left', testType: 'bone', responseStatus: 'threshold' },
        { frequency: 250, hearingLevel: 15, ear: 'left', testType: 'bone', responseStatus: 'threshold' },
      ],
    }),
  },
}));

import testingService from '../TestingService';

const mockPatient: HearingProfile = {
  id: 'test-patient',
  name: 'Test Patient',
  description: 'Test patient for unit tests',
  difficulty: 'beginner',
  hearingLossType: 'normal',
  thresholds: [],
};

describe('TestingService', () => {
  beforeEach(() => {
    testingService.reset();
  });

  // ===========================================================================
  // Hughson-Westlake Stepping Logic
  // ===========================================================================
  describe('Hughson-Westlake Stepping Logic', () => {
    it('1. Response always decreases level by 10 dB', () => {
      testingService.startSession(mockPatient);
      const stepBefore = testingService.getCurrentStep()!;
      const levelBefore = stepBefore.currentLevel;

      testingService.recordResponse(true);

      const stepAfter = testingService.getCurrentStep()!;
      expect(stepAfter.currentLevel).toBe(levelBefore - 10);
    });

    it('2. No response increases by 5 dB after initial phase', () => {
      testingService.startSession(mockPatient);
      const step = testingService.getCurrentStep()!;

      // First, record a response so we exit the initial familiarization phase
      testingService.recordResponse(true); // level goes 40 -> 30
      // Now the patient has responded at least once, so subsequent no-response = 5 dB increase
      const levelAfterResponse = testingService.getCurrentStep()!.currentLevel;
      testingService.recordResponse(false); // should go +5
      expect(testingService.getCurrentStep()!.currentLevel).toBe(levelAfterResponse + 5);
    });

    it('3. Initial phase uses 10 dB increase for no response', () => {
      testingService.startSession(mockPatient);
      const step = testingService.getCurrentStep()!;
      const startLevel = step.currentLevel; // 40

      // No response when patient has never responded = initial familiarization = 10 dB step
      testingService.recordResponse(false);
      expect(testingService.getCurrentStep()!.currentLevel).toBe(startLevel + 10);

      // Still no response, still initial phase (never responded)
      const level2 = testingService.getCurrentStep()!.currentLevel;
      testingService.recordResponse(false);
      expect(testingService.getCurrentStep()!.currentLevel).toBe(level2 + 10);
    });

    it('4. Level clamped to [-10, 120] range', () => {
      testingService.startSession(mockPatient);

      // Drive the level down to near minimum
      // Start at 40, respond 6 times: 40 -> 30 -> 20 -> 10 -> 0 -> -10 -> should clamp at -10
      for (let i = 0; i < 5; i++) {
        testingService.recordResponse(true);
      }
      // Level should now be -10
      expect(testingService.getCurrentStep()!.currentLevel).toBe(-10);

      // One more response — should stay at -10 (clamped)
      testingService.recordResponse(true);
      expect(testingService.getCurrentStep()!.currentLevel).toBe(-10);

      // Test upper clamp: reset and drive level up
      testingService.reset();
      testingService.startSession(mockPatient);

      // Drive level up by repeatedly not responding (initial phase = 10 dB steps)
      // Start at 40, no response: 50, 60, 70, 80, 90, 100, 110, 120
      for (let i = 0; i < 8; i++) {
        testingService.recordResponse(false);
      }
      expect(testingService.getCurrentStep()!.currentLevel).toBe(120);

      // One more no response — should stay at 120 (clamped)
      testingService.recordResponse(false);
      expect(testingService.getCurrentStep()!.currentLevel).toBe(120);
    });
  });

  // ===========================================================================
  // Threshold Establishment
  // ===========================================================================
  describe('Threshold Establishment', () => {
    /**
     * Helper: simulate an ascending approach cycle at the current step.
     * After a response, the protocol descends 10 dB. Then on no response, it ascends 5 dB.
     * This creates an ascending presentation at targetLevel.
     *
     * Sequence: response at targetLevel -> level drops 10 -> no response -> level rises 5 -> ...
     * We need the step to already be in the ascending phase (patient has responded before).
     */

    it('5. Threshold established with 2/3 ascending responses at same level', () => {
      testingService.startSession(mockPatient);
      // Start at 40. First, get the patient to respond to enter ascending phase.
      // Then cycle: respond at target -> descend 10 -> no response -> ascend 5 -> no response -> ascend 5 -> respond (ascending)
      // We need >= 3 ascending presentations at the same level with >= 2 responses.

      // Record initial response at 40 to exit familiarization
      testingService.recordResponse(true); // 40 -> 30

      // Now at 30. Record response to descend further.
      testingService.recordResponse(true); // 30 -> 20

      // Now at 20. No response -> ascend 5 to 25
      testingService.recordResponse(false); // 20 -> 25

      // At 25 (ascending). Respond -> descend to 15
      testingService.recordResponse(true); // 25 -> 15

      // At 15. No response -> ascend 5 to 20
      testingService.recordResponse(false); // 15 -> 20

      // At 20. No response -> ascend 5 to 25
      testingService.recordResponse(false); // 20 -> 25

      // At 25 (ascending). Respond -> descend to 15
      testingService.recordResponse(true); // 25 -> 15

      // At 15. No response -> ascend 5 to 20
      testingService.recordResponse(false); // 15 -> 20

      // At 20. No response -> ascend 5 to 25
      testingService.recordResponse(false); // 20 -> 25

      // At 25 (ascending, 3rd time). Respond -> this should establish threshold
      // 3 ascending presentations at 25, all 3 had responses -> 3/3 >= 2/3
      testingService.recordResponse(true);

      // After threshold established, the step should be completed and we move to next step
      const session = testingService.getCurrentSession()!;
      const firstStep = session.testSequence[0];
      expect(firstStep.completed).toBe(true);
      expect(firstStep.responseStatus).toBe('threshold');
      // We should now be on step index 1
      expect(session.currentStep).toBe(1);
    });

    it('6. Threshold NOT established with only 1 ascending response', () => {
      testingService.startSession(mockPatient);

      // Respond at 40 to exit familiarization, then cycle
      testingService.recordResponse(true); // 40 -> 30
      testingService.recordResponse(true); // 30 -> 20
      testingService.recordResponse(false); // 20 -> 25 (ascending)
      // Respond at 25 (1 ascending response at 25)
      testingService.recordResponse(true); // 25 -> 15

      // Only 1 ascending response at 25, step should NOT be complete
      const session = testingService.getCurrentSession()!;
      expect(session.testSequence[0].completed).toBe(false);
      expect(session.currentStep).toBe(0);
    });

    it('7. extractThresholds returns correct levels after known pattern', () => {
      const session = testingService.startSession(mockPatient);

      // Complete the first step by establishing a threshold at 25 dB
      // (same pattern as test 5)
      testingService.recordResponse(true);  // 40 -> 30
      testingService.recordResponse(true);  // 30 -> 20
      testingService.recordResponse(false); // 20 -> 25
      testingService.recordResponse(true);  // 25 -> 15
      testingService.recordResponse(false); // 15 -> 20
      testingService.recordResponse(false); // 20 -> 25
      testingService.recordResponse(true);  // 25 -> 15
      testingService.recordResponse(false); // 15 -> 20
      testingService.recordResponse(false); // 20 -> 25
      testingService.recordResponse(true);  // Threshold at 25 established

      // Now complete the session
      const completedSession = testingService.completeSession()!;

      // Check the first threshold in the results
      const firstThreshold = completedSession.results!.userThresholds[0];
      expect(firstThreshold.frequency).toBe(1000);
      expect(firstThreshold.ear).toBe('right');
      expect(firstThreshold.hearingLevel).toBe(25);
      expect(firstThreshold.responseStatus).toBe('threshold');
    });
  });

  // ===========================================================================
  // Max Presentations Escape Hatch
  // ===========================================================================
  describe('Max Presentations Escape Hatch', () => {
    it('8. Step auto-completes after MAX (30) presentations', () => {
      testingService.startSession(mockPatient);

      // Record 30 no-responses (initial familiarization phase, 10 dB steps up)
      for (let i = 0; i < 30; i++) {
        testingService.recordResponse(false);
      }

      // The step should have been auto-completed
      const session = testingService.getCurrentSession()!;
      const firstStep = session.testSequence[0];
      expect(firstStep.completed).toBe(true);
      expect(firstStep.responseStatus).toBe('no_response');
    });

    it('9. Auto-advance to next step after escape', () => {
      testingService.startSession(mockPatient);

      // Fill 30 responses to trigger escape
      for (let i = 0; i < 30; i++) {
        testingService.recordResponse(false);
      }

      // Should have advanced to step index 1
      const session = testingService.getCurrentSession()!;
      expect(session.currentStep).toBe(1);

      // The new current step should be the 2nd step in the sequence
      const currentStep = testingService.getCurrentStep()!;
      expect(currentStep.id).toBe(session.testSequence[1].id);
    });
  });

  // ===========================================================================
  // Frequency Sequence Generation
  // ===========================================================================
  describe('Frequency Sequence Generation', () => {
    it('10. Air conduction sequence is [1000, 2000, 3000, 4000, 6000, 8000, 500, 250, 1000-retest] per ear', () => {
      const session = testingService.startSession(mockPatient);
      const expectedAirFreqs = [1000, 2000, 3000, 4000, 6000, 8000, 500, 250, 1000];

      // Right ear air conduction steps (first 9 steps)
      const rightAirSteps = session.testSequence.filter(
        s => s.ear === 'right' && s.testType === 'air'
      );
      expect(rightAirSteps.map(s => s.frequency)).toEqual(expectedAirFreqs);

      // Left ear air conduction steps
      const leftAirSteps = session.testSequence.filter(
        s => s.ear === 'left' && s.testType === 'air'
      );
      expect(leftAirSteps.map(s => s.frequency)).toEqual(expectedAirFreqs);
    });

    it('11. 1000 Hz retest step exists with isRetest: true', () => {
      const session = testingService.startSession(mockPatient);

      const rightRetestSteps = session.testSequence.filter(
        s => s.ear === 'right' && s.testType === 'air' && s.isRetest === true
      );
      expect(rightRetestSteps).toHaveLength(1);
      expect(rightRetestSteps[0].frequency).toBe(1000);

      const leftRetestSteps = session.testSequence.filter(
        s => s.ear === 'left' && s.testType === 'air' && s.isRetest === true
      );
      expect(leftRetestSteps).toHaveLength(1);
      expect(leftRetestSteps[0].frequency).toBe(1000);
    });

    it('12. Bone conduction sequence is [1000, 2000, 3000, 4000, 500, 250] per ear', () => {
      const session = testingService.startSession(mockPatient);
      const expectedBoneFreqs = [1000, 2000, 3000, 4000, 500, 250];

      const rightBoneSteps = session.testSequence.filter(
        s => s.ear === 'right' && s.testType === 'bone'
      );
      expect(rightBoneSteps.map(s => s.frequency)).toEqual(expectedBoneFreqs);

      const leftBoneSteps = session.testSequence.filter(
        s => s.ear === 'left' && s.testType === 'bone'
      );
      expect(leftBoneSteps.map(s => s.frequency)).toEqual(expectedBoneFreqs);
    });

    it('13. Both ears tested: right ear steps come before left ear steps', () => {
      const session = testingService.startSession(mockPatient);

      const lastRightIndex = session.testSequence.reduce(
        (maxIdx, step, idx) => (step.ear === 'right' ? idx : maxIdx),
        -1
      );
      const firstLeftIndex = session.testSequence.findIndex(s => s.ear === 'left');

      expect(firstLeftIndex).toBeGreaterThan(lastRightIndex);
    });

    it('14. Config respects excludes: includeBoneConduction=false removes bone steps', () => {
      const session = testingService.startSession(mockPatient, { includeBoneConduction: false });

      const boneSteps = session.testSequence.filter(s => s.testType === 'bone');
      expect(boneSteps).toHaveLength(0);

      // Air steps should still exist
      const airSteps = session.testSequence.filter(s => s.testType === 'air');
      expect(airSteps.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Session Lifecycle
  // ===========================================================================
  describe('Session Lifecycle', () => {
    it('15. startSession creates valid session', () => {
      const session = testingService.startSession(mockPatient);

      expect(session.id).toBeDefined();
      expect(typeof session.id).toBe('string');
      expect(session.id.length).toBeGreaterThan(0);
      expect(session.patientId).toBe('test-patient');
      expect(session.testSequence.length).toBeGreaterThan(0);
      expect(session.currentStep).toBe(0);
      expect(session.completed).toBe(false);
      expect(session.startTime).toBeDefined();
    });

    it('16. completeSession calculates results', () => {
      testingService.startSession(mockPatient);

      const completed = testingService.completeSession()!;

      expect(completed).not.toBeNull();
      expect(completed.completed).toBe(true);
      expect(completed.results).toBeDefined();
      expect(typeof completed.results!.accuracy).toBe('number');
      expect(completed.results!.userThresholds).toBeDefined();
      expect(completed.results!.actualThresholds).toBeDefined();
      expect(completed.results!.technicalErrors).toBeDefined();
      expect(Array.isArray(completed.results!.technicalErrors)).toBe(true);
      expect(typeof completed.results!.testDuration).toBe('number');
    });

    it('17. reset() clears all state', () => {
      testingService.startSession(mockPatient);
      expect(testingService.getCurrentSession()).not.toBeNull();

      testingService.reset();

      expect(testingService.getCurrentSession()).toBeNull();
      expect(testingService.getActiveSessions()).toHaveLength(0);
      expect(testingService.getCompletedSessions()).toHaveLength(0);
    });

    it('18. State does not bleed between sessions', () => {
      // Session 1
      const session1 = testingService.startSession(mockPatient);
      testingService.recordResponse(true); // 40 -> 30 in session 1
      testingService.completeSession();

      // Session 2
      const patient2: HearingProfile = { ...mockPatient, id: 'test-patient-2' };
      const session2 = testingService.startSession(patient2);

      expect(session2.id).not.toBe(session1.id);
      expect(session2.patientId).toBe('test-patient-2');
      expect(session2.currentStep).toBe(0);
      // First step should be at default start level (40), not modified
      const step = testingService.getCurrentStep()!;
      expect(step.currentLevel).toBe(40);
      expect(step.responses).toHaveLength(0);
    });
  });

  // ===========================================================================
  // 1000 Hz Retest Error Detection
  // ===========================================================================
  describe('1000 Hz Retest Error Detection', () => {
    it('19. 1000 Hz retest discrepancy flagged when diff > 5 dB', () => {
      const session = testingService.startSession(mockPatient);

      // We need to manually set up the initial 1000 Hz step and the retest step
      // to have different thresholds, then call completeSession to trigger error detection.

      // Find the initial 1000 Hz right ear air step and the retest step
      const initialStep = session.testSequence.find(
        s => s.frequency === 1000 && s.ear === 'right' && s.testType === 'air' && !s.isRetest
      )!;
      const retestStep = session.testSequence.find(
        s => s.frequency === 1000 && s.ear === 'right' && s.testType === 'air' && s.isRetest
      )!;

      // Simulate initial threshold at 30 dB
      initialStep.completed = true;
      initialStep.responseStatus = 'threshold';
      initialStep.currentLevel = 30 as HearingLevel;
      initialStep.responses = [
        { level: 40 as HearingLevel, response: true },
        { level: 30 as HearingLevel, response: false },
        { level: 35 as HearingLevel, response: true },
        { level: 25 as HearingLevel, response: false },
        { level: 30 as HearingLevel, response: true },
      ];

      // Simulate retest threshold at 40 dB (diff = 10 dB > 5 dB)
      retestStep.completed = true;
      retestStep.responseStatus = 'threshold';
      retestStep.currentLevel = 40 as HearingLevel;
      retestStep.responses = [
        { level: 50 as HearingLevel, response: true },
        { level: 40 as HearingLevel, response: false },
        { level: 45 as HearingLevel, response: true },
        { level: 35 as HearingLevel, response: false },
        { level: 40 as HearingLevel, response: true },
      ];

      const completed = testingService.completeSession()!;
      const errors = completed.results!.technicalErrors;

      const retestError = errors.find(e => e.includes('1000 Hz retest discrepancy') && e.includes('right'));
      expect(retestError).toBeDefined();
      expect(retestError).toContain('right ear');
    });
  });

  // ===========================================================================
  // Other
  // ===========================================================================
  describe('Other', () => {
    it('20. skipCurrentStep advances to next step', () => {
      testingService.startSession(mockPatient);
      const session = testingService.getCurrentSession()!;
      expect(session.currentStep).toBe(0);

      testingService.skipCurrentStep();
      expect(session.currentStep).toBe(1);
    });

    it('21. calculateProgress returns percentage', () => {
      testingService.startSession(mockPatient);

      // At start, progress should be 0%
      expect(testingService.calculateProgress()).toBe(0);

      // Skip some steps
      testingService.skipCurrentStep();
      testingService.skipCurrentStep();

      const session = testingService.getCurrentSession()!;
      const totalSteps = session.testSequence.length;
      const expectedProgress = Math.round((2 / totalSteps) * 100);
      expect(testingService.calculateProgress()).toBe(expectedProgress);
    });

    it('22. setCurrentLevel updates step level', () => {
      testingService.startSession(mockPatient);
      const step = testingService.getCurrentStep()!;
      expect(step.currentLevel).toBe(40);

      testingService.setCurrentLevel(60 as HearingLevel);
      expect(testingService.getCurrentStep()!.currentLevel).toBe(60);
    });
  });
});
