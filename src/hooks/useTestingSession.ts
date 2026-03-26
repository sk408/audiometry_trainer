import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TestSession, TestStep, HearingProfile, ThresholdPoint, HearingLevel, Frequency } from '../interfaces/AudioTypes';
import testingService from '../services/TestingService';
import audioService from '../services/AudioService';
import React from 'react';
import { Badge } from '@mui/material';
import { VolumeUp, Hearing, HelpOutline } from '@mui/icons-material';

export interface UseTestingSessionProps {
  patient: HearingProfile;
  onComplete: (session: TestSession) => void;
  onCancel: () => void;
}

export function useTestingSession({ patient, onComplete, onCancel }: UseTestingSessionProps) {
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentStep, setCurrentStep] = useState<TestStep | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [patientResponse, setPatientResponse] = useState<boolean | null>(null);
  const [showResponseIndicator, setShowResponseIndicator] = useState(false);
  const [toneActive, setToneActive] = useState(false);
  const toneActiveRef = useRef(false);
  const patientResponseRef = useRef<boolean | null>(null);
  const startToneRef = useRef<(() => void) | null>(null);
  const toneIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [trainerMode, setTrainerMode] = useState(true);
  const [currentGuidance, setCurrentGuidance] = useState<string>('Start testing at a comfortable level (30-40 dB).');
  const [procedurePhase, setProcedurePhase] = useState<'initial' | 'descending' | 'ascending' | 'threshold' | 'complete'>('initial');
  const [responseCount, setResponseCount] = useState(0);
  const [lastResponseLevel, setLastResponseLevel] = useState<number | null>(null);
  const [suggestedAction, setSuggestedAction] = useState<'present' | 'increase' | 'decrease' | 'store_threshold' | 'next'>('present');
  const [patientJustResponded, setPatientJustResponded] = useState(false);
  const [thresholdPhaseStartTime, setThresholdPhaseStartTime] = useState<number | null>(null);
  const lastPresentationTimeRef = useRef<number>(0);
  const lastProcessedPresentationRef = useRef<number>(0);
  const [responseCounts, setResponseCounts] = useState<{
    [frequency: number]: {
      [ear: string]: {
        [level: number]: { total: number; heard: number }
      }
    }
  }>({});

  const [activeTab, setActiveTab] = useState(0);
  const [showMainGuidance, setShowMainGuidance] = useState(true);

  // Define action map for suggested actions
  const actionMap: Record<string, { label: string }> = {
    present: { label: 'Present Tone' },
    increase: { label: 'Increase Level (+5 dB)' },
    decrease: { label: 'Decrease Level (-10 dB)' },
    store_threshold: { label: 'Store Threshold' },
    next: { label: 'Next Frequency' }
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Add handlePatientResponse function
  const handlePatientResponse = () => {
    if (currentStep && toneActive) {
      setPatientResponse(true);
      patientResponseRef.current = true;
      updateTrainerState(true);
    }
  };

  // Simulate virtual patient response based on hearing threshold
  const simulatePatientResponse = useCallback(() => {
    if (!currentStep || !patient) return false;

    const matchingThreshold = patient.thresholds.find(
      t => t.frequency === currentStep.frequency &&
           t.ear === currentStep.ear &&
           t.testType === currentStep.testType
    );

    if (!matchingThreshold) return false;

    const variability = Math.floor(Math.random() * 10) - 5;
    const effectiveThreshold = matchingThreshold.hearingLevel + variability;

    return currentStep.currentLevel >= effectiveThreshold;
  }, [currentStep, patient]);

  // Update trainer mode state based on patient response
  const updateTrainerState = useCallback((didRespond: boolean) => {
    if (!currentStep) {
      return;
    }
    if (didRespond) {
      if (trainerMode) {
        if (procedurePhase === 'initial') {
          setProcedurePhase('descending');
          setSuggestedAction('decrease');
          setCurrentGuidance('The patient responded at this level. According to Hughson-Westlake, the next step would be to decrease by 10 dB and present the tone again.');
        } else if (procedurePhase === 'descending') {
          setProcedurePhase('descending');
          setSuggestedAction('decrease');
          setCurrentGuidance('The patient can still hear at this level. In the descending phase, you should continue to decrease by 10 dB intervals.');
        } else if (procedurePhase === 'ascending') {
          setProcedurePhase('threshold');

          const currentLevel = currentStep.currentLevel;

          const levelResponseCounts = { ...responseCounts };
          const frequency = currentStep.frequency;
          const ear = currentStep.ear;

          if (!levelResponseCounts[frequency]) {
            levelResponseCounts[frequency] = {};
          }
          if (!levelResponseCounts[frequency][ear]) {
            levelResponseCounts[frequency][ear] = {};
          }
          if (!levelResponseCounts[frequency][ear][currentLevel]) {
            levelResponseCounts[frequency][ear][currentLevel] = { total: 0, heard: 0 };
          }

          setResponseCounts(levelResponseCounts);

          setLastResponseLevel(currentLevel);

          const heardCount = levelResponseCounts[frequency][ear][currentLevel].heard;
          const totalCount = levelResponseCounts[frequency][ear][currentLevel].total;

          setSuggestedAction('decrease');
          setCurrentGuidance(`You've found the potential threshold! The patient responded at ${currentLevel} dB. According to Hughson-Westlake protocol, you must immediately decrease by 10 dB and begin the bracketing pattern (10 dB down after response, 5 dB up after no response).`);
          setThresholdPhaseStartTime(Date.now());
        } else if (procedurePhase === 'threshold') {
          const currentLevel = currentStep.currentLevel;

          const levelResponseCounts = { ...responseCounts };
          const frequency = currentStep.frequency;
          const ear = currentStep.ear;

          if (!levelResponseCounts[frequency]) {
            levelResponseCounts[frequency] = {};
          }
          if (!levelResponseCounts[frequency][ear]) {
            levelResponseCounts[frequency][ear] = {};
          }
          if (!levelResponseCounts[frequency][ear][currentLevel]) {
            levelResponseCounts[frequency][ear][currentLevel] = { total: 0, heard: 0 };
          }
          levelResponseCounts[frequency][ear][currentLevel].total += 1;
          levelResponseCounts[frequency][ear][currentLevel].heard += 1;
          setResponseCounts(levelResponseCounts);

          setLastResponseLevel(currentLevel);

          const heardCount = levelResponseCounts[frequency][ear][currentLevel].heard;
          const totalCount = levelResponseCounts[frequency][ear][currentLevel].total;

          if (thresholdPhaseStartTime && lastPresentationTimeRef.current > thresholdPhaseStartTime) {
            if (lastPresentationTimeRef.current > lastProcessedPresentationRef.current) {
              lastProcessedPresentationRef.current = lastPresentationTimeRef.current;

              setSuggestedAction('decrease');

              if (totalCount >= 2) {
                if (heardCount >= 2) {
                  setProcedurePhase('complete');
                  setSuggestedAction('store_threshold');
                  setCurrentGuidance(`Excellent! You have established a threshold at ${currentLevel} dB. The patient has responded ${heardCount} times out of ${totalCount} at this level, which meets the criteria of "2 out of 3" responses needed to establish a threshold. You can now store this value and move to the next frequency.`);
                } else {
                  setSuggestedAction('decrease');
                  setCurrentGuidance(`The patient responded, but has only ${heardCount} total responses out of ${totalCount} at ${currentLevel} dB. Following Hughson-Westlake protocol, decrease by 10 dB after ANY response, then continue testing.`);
                }
              } else if (heardCount >= 2) {
                setSuggestedAction('decrease');
                setCurrentGuidance(`Good! The patient has responded ${heardCount} times at ${currentLevel} dB. Following Hughson-Westlake protocol, decrease by 10 dB after EACH response, then continue the bracketing pattern.`);
              } else if (totalCount === 2 && heardCount === 1) {
                setSuggestedAction('decrease');
                setCurrentGuidance(`The patient has responded once out of ${totalCount} presentations at ${currentLevel} dB. Following Hughson-Westlake protocol, decrease by 10 dB after EACH response, then continue the bracketing pattern.`);
              } else {
                setSuggestedAction('decrease');
                setCurrentGuidance(`The patient has responded ${heardCount} time(s) out of ${totalCount} at ${currentLevel} dB. Following Hughson-Westlake protocol, decrease by 10 dB after EACH response, then continue the bracketing pattern.`);
              }
            }
          }
        }
      }
    } else {
      if (trainerMode) {
        if (procedurePhase === 'initial') {
          setSuggestedAction('increase');
          setCurrentGuidance('The patient did not respond to the initial presentation. This suggests the starting level was too low. Increase the level by 10-15 dB and try again.');
        } else if (procedurePhase === 'descending') {
          setProcedurePhase('ascending');
          setSuggestedAction('increase');
          setCurrentGuidance('The patient no longer responds at this level. This means we\'ve gone below their threshold. Now switch to the ascending phase: increase by 5 dB steps until the patient responds again. Note that we use smaller steps (5 dB) when ascending to more precisely determine the threshold.');
        } else if (procedurePhase === 'threshold') {
          const currentLevel = currentStep.currentLevel;

          const levelResponseCounts = { ...responseCounts };
          const frequency = currentStep.frequency;
          const ear = currentStep.ear;

          if (!levelResponseCounts[frequency]) {
            levelResponseCounts[frequency] = {};
          }
          if (!levelResponseCounts[frequency][ear]) {
            levelResponseCounts[frequency][ear] = {};
          }
          if (!levelResponseCounts[frequency][ear][currentLevel]) {
            levelResponseCounts[frequency][ear][currentLevel] = { total: 0, heard: 0 };
          }
          levelResponseCounts[frequency][ear][currentLevel].total += 1;

          setResponseCounts(levelResponseCounts);

          const heardCount = levelResponseCounts[currentStep.frequency][currentStep.ear][currentLevel].heard;
          const totalCount = levelResponseCounts[currentStep.frequency][currentStep.ear][currentLevel].total;
          if (lastPresentationTimeRef.current > lastProcessedPresentationRef.current) {
            lastProcessedPresentationRef.current = lastPresentationTimeRef.current;
          }

          if (totalCount >= 2 && heardCount >= 2) {
            setProcedurePhase('complete');
            setSuggestedAction('store_threshold');
            setCurrentGuidance(`You have established a threshold at ${currentLevel} dB. The patient has responded ${heardCount} times out of ${totalCount} at this level, which meets the criteria of "2 out of 3" responses needed to establish a threshold. You can now store this value and move to the next frequency.`);
          } else if (totalCount >= 2 && heardCount < 2) {
            setSuggestedAction('increase');
            setCurrentGuidance(`The patient did not respond at ${currentLevel} dB (${heardCount}/${totalCount} responses). Following Hughson-Westlake protocol, increase by 5 dB and continue the bracketing pattern.`);
          } else if (totalCount - heardCount >= 2) {
            setSuggestedAction('increase');
            setCurrentGuidance(`The patient has failed to respond ${totalCount - heardCount} times out of ${totalCount} at ${currentLevel} dB. Following Hughson-Westlake protocol, increase by 5 dB and continue the bracketing pattern.`);
          } else {
            setSuggestedAction('increase');
            setCurrentGuidance(`Patient did not respond at ${currentLevel} dB (${heardCount}/${totalCount} responses so far). Following Hughson-Westlake protocol, increase by 5 dB and continue the bracketing pattern.`);
          }
        } else if (procedurePhase === 'ascending') {
          setProcedurePhase('ascending');
          setSuggestedAction('increase');
          setCurrentGuidance('Patient still doesn\'t respond at this level. Continue to increase by 5 dB steps until you get a response. Remember, we use smaller 5 dB steps during the ascending phase for more precise threshold determination.');
        }
      }
    }
  }, [trainerMode, currentStep, procedurePhase, responseCounts, thresholdPhaseStartTime, simulatePatientResponse]);

  // Process automatic patient response during tone presentation
  const processAutomaticResponse = useCallback(() => {
    if (!currentStep) {
      return;
    }
    const didRespond = simulatePatientResponse();
    setPatientResponse(didRespond);
    patientResponseRef.current = didRespond;
    setShowResponseIndicator(true);

    if (didRespond) {
      setPatientJustResponded(true);

      setTimeout(() => {
        setPatientJustResponded(false);
      }, 3000);
    } else {
      setPatientJustResponded(false);
    }

    const responseTimestamp = Date.now();
    testingService.recordResponseWithoutAdjustment(didRespond);

    const currentUserLevel = currentStep.currentLevel;

    const newStep = testingService.getCurrentStep();

    if (newStep && currentUserLevel !== newStep.currentLevel) {
      newStep.currentLevel = currentUserLevel;
    }

    setCurrentStep(newStep);

    const updatedSession = testingService.getCurrentSession();
    if (updatedSession) {
      if (updatedSession.testSequence && updatedSession.testSequence[updatedSession.currentStep]) {
        updatedSession.testSequence[updatedSession.currentStep].currentLevel = currentUserLevel;
      }

      setSession(updatedSession);

      if (updatedSession.completed) {
        onComplete(updatedSession);
      }
    }
  }, [currentStep, simulatePatientResponse, onComplete]);

  // Process response without changing levels - just UI indication
  const processSimpleResponse = useCallback(() => {
    if (!currentStep) {
      return;
    }

    const didRespond = simulatePatientResponse();
    setPatientResponse(didRespond);
    patientResponseRef.current = didRespond;
    setShowResponseIndicator(true);

    if (didRespond) {
      setPatientJustResponded(true);

      setTimeout(() => {
        setPatientJustResponded(false);
      }, 3000);
    } else {
      setPatientJustResponded(false);
    }

    testingService.recordResponse(didRespond);
  }, [currentStep]);

  // Stop tone and check for patient response
  const stopTone = useCallback(() => {
    audioService.stopTone();

    // C2 fix: read from refs instead of stale closure variables
    const currentToneActive = toneActiveRef.current;
    const currentPatientResponse = patientResponseRef.current;
    const currentProcedurePhase = procedurePhase;

    setToneActive(false);
    toneActiveRef.current = false;

    const presentationStopTime = Date.now();
    lastPresentationTimeRef.current = presentationStopTime;
    let effectiveResponse = currentPatientResponse;
    if (effectiveResponse === null) {
      const didRespond = simulatePatientResponse();
      effectiveResponse = didRespond;
    }

    if (currentStep) {
      if (presentationStopTime > lastProcessedPresentationRef.current) {
        if (effectiveResponse !== null) {
          testingService.recordResponseWithoutAdjustment(Boolean(effectiveResponse));
          updateTrainerState(Boolean(effectiveResponse));
          lastProcessedPresentationRef.current = presentationStopTime;
        } else {
          if (currentPatientResponse !== null) {
            testingService.recordResponseWithoutAdjustment(Boolean(currentPatientResponse));
            updateTrainerState(Boolean(currentPatientResponse));
            lastProcessedPresentationRef.current = presentationStopTime;
          }
        }
      }
    }

    setPatientResponse(null);
    patientResponseRef.current = null;
    setShowResponseIndicator(false);
    setPatientJustResponded(false);
  }, [currentStep, updateTrainerState, procedurePhase, simulatePatientResponse]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (toneIntervalRef.current) {
        clearInterval(toneIntervalRef.current);
      }
      audioService.stopTone();
    };
  }, []);

  // Handle mouse up event outside the component — C2 fix: use ref instead of state
  useEffect(() => {
    const handleMouseUp = () => {
      if (toneActiveRef.current) {
        stopTone();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [stopTone]);

  // Handle level adjustment
  const handleAdjustLevel = useCallback((change: number) => {
    if (!currentStep) return;

    try {
      const newLevel = Math.max(-10, Math.min(120, currentStep.currentLevel + change)) as HearingLevel;

      if (trainerMode) {
        if (procedurePhase === 'initial' || procedurePhase === 'descending') {
          if (change === -10) {
            setProcedurePhase('descending');
            setSuggestedAction('present');
            setCurrentGuidance(`You've decreased by 10 dB. Now present the tone to see if the patient can still hear it at ${newLevel} dB.`);
          } else if (change === 5 || change === 10) {
            setSuggestedAction('present');
            setCurrentGuidance(`You've increased by ${change} dB. Present the tone to check for a response at ${newLevel} dB.`);
          } else if (change === -5) {
            setSuggestedAction('present');
            setCurrentGuidance(`You've decreased by 5 dB. While Hughson-Westlake protocol uses 10 dB decrements in the descending phase, you can still present the tone at ${newLevel} dB to check for a response.`);
          }
        } else if (procedurePhase === 'ascending') {
          if (change === 5) {
            setSuggestedAction('present');
            setCurrentGuidance(`You've increased by 5 dB. Now present the tone to see if the patient can hear it at ${newLevel} dB.`);
          } else if (change === 10) {
            setSuggestedAction('present');
            setCurrentGuidance(`You've increased by 10 dB. While Hughson-Westlake protocol uses 5 dB increments in the ascending phase, you can still present the tone at ${newLevel} dB to check for a response.`);
          } else if (change < 0) {
            setProcedurePhase('descending');
            setSuggestedAction('present');
            setCurrentGuidance(`You've decreased by ${Math.abs(change)} dB, changing to the descending phase. Present the tone to check for a response at ${newLevel} dB.`);
          }
        } else if (procedurePhase === 'threshold') {
          if (change === -10) {
            setSuggestedAction('present');
            setCurrentGuidance(`You've decreased by 10 dB to ${newLevel} dB. This follows the Hughson-Westlake protocol. Present the tone to check for a response at this new level.`);
          } else if (change === 5) {
            setSuggestedAction('present');
            setCurrentGuidance(`You've increased by 5 dB to ${newLevel} dB. This follows the Hughson-Westlake protocol. Present the tone to check for a response at this new level.`);
          } else {
            setSuggestedAction('present');
            setCurrentGuidance(`You've changed the level to ${newLevel} dB. Present the tone to check for a response at this level.`);
          }

          setLastResponseLevel(newLevel);
        } else if (procedurePhase === 'complete') {
          setProcedurePhase('threshold');
          setSuggestedAction('present');
          setCurrentGuidance(`You're adjusting the level after completing threshold determination. You're now at ${newLevel} dB. Present the tone to check for a response.`);
        }
      }

      const updatedStep = {
        ...currentStep,
        currentLevel: newLevel
      };

      setCurrentStep(updatedStep);

      testingService.setCurrentLevel(newLevel);

      if (session) {
        const updatedSession = { ...session };
        updatedSession.testSequence = [...updatedSession.testSequence];

        const currentIndex = updatedSession.currentStep;

        if (updatedSession.testSequence[currentIndex] &&
            updatedSession.testSequence[currentIndex].frequency === currentStep.frequency &&
            updatedSession.testSequence[currentIndex].ear === currentStep.ear) {

          updatedSession.testSequence[currentIndex] = {
            ...updatedSession.testSequence[currentIndex],
            currentLevel: newLevel
          };

          setSession(updatedSession);
        }
      }
    } catch (error) {
      setErrorMessage('Failed to adjust level. Please try again.');
    }
  }, [currentStep, session, trainerMode, procedurePhase]);

  // Helper function to preserve thresholds when retrieving updated session data
  const preserveThresholds = useCallback((updatedSession: TestSession): TestSession => {
    if (!session) return updatedSession;

    const sessionCopy = JSON.parse(JSON.stringify(updatedSession)) as TestSession;

    const thresholdSteps = session.testSequence.filter(
      step => step.completed && step.responseStatus === 'threshold'
    );
    if (thresholdSteps.length > 0) {
      thresholdSteps.forEach(storedStep => {
        const matchingIndex = sessionCopy.testSequence.findIndex(
          step => step.frequency === storedStep.frequency &&
                 step.ear === storedStep.ear &&
                 step.testType === storedStep.testType
        );

        if (matchingIndex !== -1) {
          sessionCopy.testSequence[matchingIndex] = {
            ...sessionCopy.testSequence[matchingIndex],
            completed: true,
            responseStatus: 'threshold',
            currentLevel: storedStep.currentLevel
          };
        }
      });
    }

    return sessionCopy;
  }, [session]);

  // Modified handleSkipStep to use preserveThresholds
  const handleSkipStep = useCallback(() => {
    try {
      if (trainerMode) {
        setProcedurePhase('initial');
        setLastResponseLevel(null);
        setSuggestedAction('present');
        setCurrentGuidance('Start testing at a comfortable level (30-40 dB).');
      }

      const nextStep = testingService.skipCurrentStep();
      if (nextStep) {
        const updatedSession = testingService.getCurrentSession();

        if (updatedSession) {
          const preservedSession = preserveThresholds(updatedSession);
          setSession(preservedSession);

          const currentStepIndex = preservedSession.currentStep;
          const currentStepData = preservedSession.testSequence[currentStepIndex];

          if (currentStepData) {
            const currentStepCopy = JSON.parse(JSON.stringify(currentStepData));
            setCurrentStep(currentStepCopy);
          } else {
            setErrorMessage('Error navigating to next frequency.');
          }
        } else {
          setErrorMessage('Failed to update session data.');
        }
      } else {
        const finalSession = testingService.completeSession();
        if (finalSession) {
          setTestProgress(100);
          const preservedFinalSession = preserveThresholds(finalSession);
          onComplete(preservedFinalSession);
        }
      }
    } catch (error) {
      setErrorMessage('Failed to go to next step. Please try again.');
    }
  }, [trainerMode, session, onComplete, preserveThresholds]);

  // Modified handlePreviousStep to use preserveThresholds
  const handlePreviousStep = useCallback(() => {
    try {
      if (trainerMode) {
        setProcedurePhase('initial');
        setLastResponseLevel(null);
        setSuggestedAction('present');
        setCurrentGuidance('Returning to the previous frequency. Begin at a comfortable level.');
      }

      if (session) {
        const updatedSession = JSON.parse(JSON.stringify(session));

        if (updatedSession.currentStep > 0) {
          updatedSession.currentStep -= 1;

          const previousStep = updatedSession.testSequence[updatedSession.currentStep];
          if (!previousStep) {
            setErrorMessage('Error navigating to previous frequency.');
            return;
          }
          const preservedSession = preserveThresholds(updatedSession);
          setSession(preservedSession);

          const currentStepIndex = preservedSession.currentStep;
          const currentStepData = preservedSession.testSequence[currentStepIndex];

          if (currentStepData) {
            const freshStep = JSON.parse(JSON.stringify(currentStepData));
            setCurrentStep(freshStep);
          } else {
            setErrorMessage('Error navigating to previous frequency.');
            return;
          }

          const currentSession = testingService.getCurrentSession();
          if (currentSession) {
            currentSession.currentStep = preservedSession.currentStep;
          }
        } else {
          setErrorMessage('Already at the first frequency.');
        }
      } else {
        setErrorMessage('No active session. Please restart the test.');
      }
    } catch (error) {
      setErrorMessage('Failed to go to previous step. Please try again.');
    }
  }, [session, trainerMode, preserveThresholds]);

  // Validate threshold according to Hughson-Westlake protocol
  const validateThreshold = useCallback((): { isValid: boolean; message: string } => {
    if (!currentStep) {
      return { isValid: false, message: 'No current test step available.' };
    }

    const frequency = currentStep.frequency;
    const ear = currentStep.ear;
    const currentLevel = currentStep.currentLevel;

    if (responseCounts &&
        responseCounts[frequency] &&
        responseCounts[frequency][ear] &&
        responseCounts[frequency][ear][currentLevel]) {

      const heardCount = responseCounts[frequency][ear][currentLevel].heard;
      const totalCount = responseCounts[frequency][ear][currentLevel].total;

      if (totalCount >= 2 && heardCount >= 2) {
        return { isValid: true, message: 'Valid threshold established.' };
      } else if (totalCount < 2) {
        return {
          isValid: false,
          message: `Need more responses at this level (${heardCount}/${totalCount} so far).`
        };
      } else {
        return {
          isValid: false,
          message: 'Invalid threshold. Hughson-Westlake requires at least 2 out of 3 responses at the same level.'
        };
      }
    } else {
      return {
        isValid: false,
        message: 'No response data available for this level.'
      };
    }
  }, [currentStep, responseCounts]);

  // Helper function to determine if threshold can be stored
  const canStoreThreshold = useCallback(() => {
    return validateThreshold().isValid;
  }, [validateThreshold]);

  // Handle storing threshold and moving to next step
  const handleStoreThreshold = useCallback(() => {
    if (!currentStep) {
      return;
    }

    const validation = validateThreshold();
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }

    let validThresholdLevel: number | null = null;
    let minValidLevel = Infinity;

    const frequencyData = responseCounts[currentStep.frequency];
    const earData = frequencyData?.[currentStep.ear] || {};

    Object.entries(earData).forEach(([levelStr, counts]) => {
      const level = parseInt(levelStr);
      if (counts.total >= 2 && counts.heard >= 2 && level < minValidLevel) {
        validThresholdLevel = level;
        minValidLevel = level;
      }
    });

    if (validThresholdLevel === null) {
      setErrorMessage('Could not determine a valid threshold level.');
      return;
    }
    testingService.setCurrentLevel(validThresholdLevel as HearingLevel);

    if (session) {
      const updatedSession = { ...session };

      const stepIndex = updatedSession.testSequence.findIndex(
        step => step.frequency === currentStep.frequency &&
               step.ear === currentStep.ear &&
               step.testType === currentStep.testType
      );

      if (stepIndex === -1) {
        setErrorMessage('Failed to store threshold: test step not found.');
        return;
      }

      const updatedStep = { ...updatedSession.testSequence[stepIndex] };
      updatedSession.testSequence = [...updatedSession.testSequence];
      updatedSession.testSequence[stepIndex] = updatedStep;

      updatedStep.completed = true;
      updatedStep.responseStatus = 'threshold' as 'threshold' | 'no_response' | 'not_tested';
      updatedStep.currentLevel = validThresholdLevel as HearingLevel;

      setSession(updatedSession);

      if (currentStep) {
        const updatedCurrentStep: TestStep = {
          ...currentStep,
          completed: true,
          responseStatus: 'threshold' as 'threshold' | 'no_response' | 'not_tested',
          currentLevel: validThresholdLevel as HearingLevel
        };

        setCurrentStep(updatedCurrentStep);
      }
    }

    setCurrentGuidance(`Threshold successfully stored at ${validThresholdLevel} dB! You can now use the up arrow (or press Up) to move to the next frequency, or the down arrow to go to a previous frequency.`);

    setProcedurePhase('complete');
    setSuggestedAction('next');

    setResponseCounts(prev => {
      const newCounts = { ...prev };
      const level = validThresholdLevel as HearingLevel;
      const frequency = currentStep.frequency;
      const ear = currentStep.ear;
      if (!newCounts[frequency]) {
        newCounts[frequency] = {};
      }

      if (!newCounts[frequency][ear]) {
        newCounts[frequency][ear] = {};
      }

      newCounts[frequency][ear][level] = {
        total: 3,
        heard: 2
      };

      return newCounts;
    });
  }, [currentStep, session, responseCounts, validateThreshold]);

  // Handle frequency adjustment
  const handleAdjustFrequency = useCallback((direction: number) => {
    if (!currentStep) return;

    const availableFrequencies: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const currentFreq = currentStep.frequency;
    const currentIndex = availableFrequencies.indexOf(currentFreq);

    if (currentIndex === -1) return;

    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = 0;
    if (newIndex >= availableFrequencies.length) newIndex = availableFrequencies.length - 1;

    if (newIndex !== currentIndex) {
      const newFrequency = availableFrequencies[newIndex];
      if (session) {
        const targetStepIndex = session.testSequence.findIndex(
          step => step.frequency === newFrequency &&
                 step.ear === currentStep.ear &&
                 step.testType === currentStep.testType
        );

        if (targetStepIndex !== -1) {
          const updatedSession = JSON.parse(JSON.stringify(session));

          updatedSession.currentStep = targetStepIndex;

          const targetStep = updatedSession.testSequence[targetStepIndex];
          setSession(updatedSession);

          const freshStep = JSON.parse(JSON.stringify(targetStep));
          setCurrentStep(freshStep);

          const currentSession = testingService.getCurrentSession();
          if (currentSession) {
            currentSession.currentStep = updatedSession.currentStep;
          }

          if (trainerMode) {
            if (targetStep.completed && targetStep.responseStatus === 'threshold') {
              setProcedurePhase('complete');
              setSuggestedAction('next');
              setCurrentGuidance(`This frequency already has a threshold stored at ${targetStep.currentLevel} dB. You can proceed to the next frequency or adjust the level to retest.`);
            } else {
              setProcedurePhase('initial');
              setSuggestedAction('present');
              setCurrentGuidance(`Now testing at ${newFrequency} Hz. Begin at a comfortable level (30-40 dB).`);
            }
          }
        } else {
          setErrorMessage(`Could not navigate to frequency ${newFrequency}Hz. Please try a different frequency.`);
        }
      } else {
        setCurrentStep({
          ...currentStep,
          frequency: newFrequency
        });
      }
    }
  }, [currentStep, session, trainerMode]);

  // H16 fix: Handle audiogram click — navigate to the correct step
  const handleAudiogramClick = useCallback((frequency: number, level: number) => {
    if (!currentStep || toneActiveRef.current) return;

    if (session) {
      // Find the matching step in the test sequence for the clicked frequency
      const targetStepIndex = session.testSequence.findIndex(
        step => step.frequency === frequency &&
               step.ear === currentStep.ear &&
               step.testType === currentStep.testType
      );

      if (targetStepIndex !== -1) {
        // Navigate to that step (update session.currentStep)
        const updatedSession = JSON.parse(JSON.stringify(session));
        updatedSession.currentStep = targetStepIndex;

        const targetStep = updatedSession.testSequence[targetStepIndex];
        // Set the level on the target step
        targetStep.currentLevel = level as HearingLevel;

        setSession(updatedSession);

        const freshStep = JSON.parse(JSON.stringify(targetStep));
        setCurrentStep(freshStep);

        // Update the TestingService's internal state
        const currentSession = testingService.getCurrentSession();
        if (currentSession) {
          currentSession.currentStep = updatedSession.currentStep;
        }

        // Set the level on the service
        testingService.setCurrentLevel(level as HearingLevel);

        // Update guidance if in trainer mode
        if (trainerMode) {
          if (targetStep.completed && targetStep.responseStatus === 'threshold') {
            setProcedurePhase('complete');
            setSuggestedAction('next');
            setCurrentGuidance(`This frequency already has a threshold stored at ${targetStep.currentLevel} dB. You can proceed to the next frequency or adjust the level to retest.`);
          } else {
            setProcedurePhase('initial');
            setSuggestedAction('present');
            setCurrentGuidance(`Now testing at ${frequency} Hz at ${level} dB. Present the tone to check for a response.`);
          }
        }
      } else {
        // Fallback: just update frequency and level locally
        setCurrentStep({
          ...currentStep,
          frequency: frequency as Frequency,
          currentLevel: level as HearingLevel
        });

        testingService.setCurrentLevel(level as HearingLevel);
      }
    } else {
      setCurrentStep({
        ...currentStep,
        frequency: frequency as Frequency,
        currentLevel: level as HearingLevel
      });

      testingService.setCurrentLevel(level as HearingLevel);
    }
  }, [currentStep, session, trainerMode]);

  // Handle suggested action
  const handleSuggestedAction = useCallback(() => {
    if (!currentStep) return;
    const originalSession = session ? JSON.parse(JSON.stringify(session)) : null;

    switch (suggestedAction) {
      case 'increase':
        if (procedurePhase === 'initial') {
          handleAdjustLevel(10);
        } else {
          handleAdjustLevel(5);
        }
        break;
      case 'decrease':
        handleAdjustLevel(-10);

        if (procedurePhase === 'initial' || procedurePhase === 'ascending') {
          setProcedurePhase('descending');
        }
        break;
      case 'store_threshold':
        {
          const { isValid, message } = validateThreshold();
          if (isValid) {
            handleStoreThreshold();
          } else {
            setErrorMessage(message);
            setCurrentGuidance(message + ' Continue testing to establish a valid threshold.');
          }
        }
        break;
      case 'next':
        if (procedurePhase === 'complete' && session) {
          const { isValid } = validateThreshold();
          if (isValid && currentStep && !currentStep.completed) {
            handleStoreThreshold();
          }
        }

        handleSkipStep();
        setProcedurePhase('initial');
        break;
      case 'present':
        if (startToneRef.current) startToneRef.current();
        break;
      default:
    }

    if (originalSession && session && JSON.stringify(originalSession) !== JSON.stringify(session)) {
      const preservedSession = preserveThresholds(session);
      if (JSON.stringify(preservedSession) !== JSON.stringify(session)) {
        setSession(preservedSession);
      }
    }
  }, [suggestedAction, procedurePhase, currentStep, handleAdjustLevel, handleStoreThreshold,
      handleSkipStep, validateThreshold, session, preserveThresholds]);

  // Start playing tone with pulsing pattern
  const startTone = useCallback(async () => {
    if (!currentStep) return;

    try {
      audioService.stopTone();

      if (currentStep) {
        testingService.setCurrentLevel(currentStep.currentLevel);
      }

      setPatientResponse(null);
      patientResponseRef.current = null;
      setPatientJustResponded(false);
      setShowResponseIndicator(false);
      setToneActive(true);
      toneActiveRef.current = true;
      await audioService.resumeAudioContext();
      await testingService.playCurrentTone();
      const didRespond = simulatePatientResponse();
      if (didRespond) {
        setPatientResponse(didRespond);
        patientResponseRef.current = didRespond;
        setShowResponseIndicator(true);
        setPatientJustResponded(true);
        testingService.recordResponseWithoutAdjustment(didRespond);
      }

      lastPresentationTimeRef.current = Date.now();

      // C2 fix: setTimeout reads from refs, not stale closure state
      setTimeout(() => {
        if (toneActiveRef.current && !patientResponseRef.current) {
          processAutomaticResponse();
        }
      }, 600);

    } catch (error) {
      setErrorMessage('Failed to play tone. Please try again.');

      setToneActive(false);
      toneActiveRef.current = false;
      audioService.stopTone();
    }
  }, [currentStep, processAutomaticResponse, simulatePatientResponse]);

  // Keep startToneRef in sync so handleSuggestedAction can call it without circular dep
  useEffect(() => {
    startToneRef.current = startTone;
  }, [startTone]);

  // Memoize the thresholds calculation
  const thresholds = useMemo((): ThresholdPoint[] => {
    if (!session) return [];

    const completedSteps = session.testSequence.filter(
      step => step.completed && step.responseStatus === 'threshold'
    );

    const uniqueThresholds = new Map<string, ThresholdPoint>();

    completedSteps.forEach(step => {
      const key = `${step.frequency}-${step.ear}-${step.testType}`;

      const thresholdPoint: ThresholdPoint = {
        frequency: step.frequency,
        hearingLevel: step.currentLevel,
        ear: step.ear,
        testType: step.testType,
        responseStatus: 'threshold'
      };

      uniqueThresholds.set(key, thresholdPoint);
    });

    return Array.from(uniqueThresholds.values());
  }, [session]);

  // Initialize the test session
  useEffect(() => {
    try {
      setProcedurePhase('initial');
      setLastResponseLevel(null);
      setSuggestedAction('present');
      setCurrentGuidance('Start testing at a comfortable level (30-40 dB).');

      audioService.resumeAudioContext().then(() => {
        const newSession = testingService.startSession(patient);
        setSession(newSession);
        setCurrentStep(testingService.getCurrentStep());

        setTestProgress(0);
      });
    } catch (error) {
      setErrorMessage('Failed to initialize test session. Please try again.');
    }
  }, [patient]);

  // Update test progress when current step changes
  useEffect(() => {
    if (session) {
      const progress = testingService.calculateProgress();
      setTestProgress(progress);
    }
  }, [session, currentStep]);

  // Format frequency for display
  const formatFrequency = (freq: number): string => {
    if (freq >= 1000) {
      return `${freq / 1000}k`;
    }
    return freq.toString();
  };

  // Helper function to get a readable label for the test type
  const getTestTypeLabel = (testType: string): string => {
    switch (testType) {
      case 'air':
        return 'Air Conduction';
      case 'bone':
        return 'Bone Conduction';
      case 'masked_air':
        return 'Masked Air Conduction';
      case 'masked_bone':
        return 'Masked Bone Conduction';
      default:
        return 'Unknown Test Type';
    }
  };

  // Helper function to display the current test type icon
  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'air':
        return React.createElement(VolumeUp);
      case 'bone':
        return React.createElement(Hearing);
      case 'masked_air':
        return React.createElement(Badge, { badgeContent: 'M', color: 'primary' }, React.createElement(VolumeUp));
      case 'masked_bone':
        return React.createElement(Badge, { badgeContent: 'M', color: 'primary' }, React.createElement(Hearing));
      default:
        return React.createElement(HelpOutline);
    }
  };

  return {
    // State
    session,
    currentStep,
    testProgress,
    errorMessage,
    patientResponse,
    showResponseIndicator,
    toneActive,
    trainerMode,
    currentGuidance,
    procedurePhase,
    responseCount,
    lastResponseLevel,
    suggestedAction,
    patientJustResponded,
    thresholdPhaseStartTime,
    responseCounts,
    activeTab,
    showMainGuidance,
    thresholds,
    actionMap,

    // State setters needed by orchestrator
    setShowMainGuidance,
    setErrorMessage,

    // Handlers
    handleTabChange,
    handlePatientResponse,
    handleAdjustLevel,
    handleSkipStep,
    handlePreviousStep,
    handleStoreThreshold,
    handleAdjustFrequency,
    handleAudiogramClick,
    handleSuggestedAction,
    startTone,
    stopTone,
    canStoreThreshold,
    formatFrequency,
    getTestTypeLabel,
    getTestTypeIcon,

    // Props pass-through
    patient,
    onComplete,
    onCancel,
  };
}

export type UseTestingSessionReturn = ReturnType<typeof useTestingSession>;
