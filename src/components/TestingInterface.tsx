import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  Alert,
  Fade,
  Avatar,
  Switch,
  FormControlLabel,
  Grid,
  Snackbar
} from '@mui/material';
import {
  VolumeUp,
  SkipNext,
  Check,
  Clear,
  HelpOutline,
  KeyboardTab,
  Hearing,
  School,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { TestSession, TestStep, HearingProfile, ThresholdPoint, HearingLevel, Frequency } from '../interfaces/AudioTypes';
import testingService from '../services/TestingService';
import audioService from '../services/AudioService';
import Audiogram from './Audiogram';
import PatientImage from './PatientImage';
import GuidancePanel from './GuidancePanel';

interface TestingInterfaceProps {
  patient: HearingProfile;
  onComplete: (session: TestSession) => void;
  onCancel: () => void;
}

const TestingInterface: React.FC<TestingInterfaceProps> = ({
  patient,
  onComplete,
  onCancel
}) => {
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentStep, setCurrentStep] = useState<TestStep | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [patientResponse, setPatientResponse] = useState<boolean | null>(null);
  const [showResponseIndicator, setShowResponseIndicator] = useState(false);
  const [toneActive, setToneActive] = useState(false);
  const toneIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [trainerMode, setTrainerMode] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState<string>('Start testing at a comfortable level (30-40 dB).');
  const [procedurePhase, setProcedurePhase] = useState<'initial' | 'descending' | 'ascending' | 'threshold' | 'complete'>('initial');
  const [responseCount, setResponseCount] = useState(0);
  const [lastResponseLevel, setLastResponseLevel] = useState<number | null>(null);
  const [suggestedAction, setSuggestedAction] = useState<'present' | 'increase' | 'decrease' | 'store_threshold' | 'next'>('present');
  const [patientJustResponded, setPatientJustResponded] = useState(false);
  // Track when threshold phase started to ignore previous responses
  const [thresholdPhaseStartTime, setThresholdPhaseStartTime] = useState<number | null>(null);
  // Use a ref to track the last presentation time to prevent multiple responses
  const lastPresentationTimeRef = useRef<number>(0);
  // Add a new ref to track the last PROCESSED presentation time
  const lastProcessedPresentationRef = useRef<number>(0);
  // Update response counts to be frequency and ear specific
  const [responseCounts, setResponseCounts] = useState<{
    [frequency: number]: {
      [ear: string]: {
        [level: number]: {total: number, heard: number}
      }
    }
  }>({});

  // Simulate virtual patient response based on hearing threshold
  const simulatePatientResponse = useCallback(() => {
    if (!currentStep || !patient) return false;
    
    // Find matching threshold for current frequency and ear
    const matchingThreshold = patient.thresholds.find(
      t => t.frequency === currentStep.frequency && 
           t.ear === currentStep.ear && 
           t.testType === currentStep.testType
    );
    
    if (!matchingThreshold) return false;
    
    // Patient responds if the current level is at or above their threshold
    // Add some variability (±5 dB) to make it more realistic
    const variability = Math.floor(Math.random() * 10) - 5;
    const effectiveThreshold = matchingThreshold.hearingLevel + variability;
    
    return currentStep.currentLevel >= effectiveThreshold;
  }, [currentStep, patient]);

  // Update trainer mode state based on patient response
  const updateTrainerState = useCallback((didRespond: boolean) => {
    // We'll process responses even if not in trainer mode
    // But we'll only update UI state if trainer mode is on
    if (!currentStep) {
      console.log('Cannot update trainer state: currentStep is falsy');
      return;
    }
    
    console.log('🔍 Processing response:', didRespond, 'in phase:', procedurePhase, 'trainer mode:', trainerMode);
    
    // Always record the response for guidance purposes
    if (didRespond) {
      console.log('Patient responded - updating state');
      
      // Only update UI state if trainer mode is on
      if (trainerMode) {
        if (procedurePhase === 'initial') {
          // If patient responds on first presentation, change to descending phase
          setProcedurePhase('descending');
          setSuggestedAction('decrease');
          setCurrentGuidance('The patient responded at this level. According to Hughson-Westlake, the next step would be to decrease by 10 dB and present the tone again.');
          console.log('Initial phase - patient responded, changing to descending phase');
        } else if (procedurePhase === 'descending') {
          // Continue descending
          setProcedurePhase('descending');
          setSuggestedAction('decrease');
          setCurrentGuidance('The patient can still hear at this level. In the descending phase, you should continue to decrease by 10 dB intervals.');
          console.log('Descending phase - patient responded, suggesting continue decreasing');
        } else if (procedurePhase === 'ascending') {
          // If patient responds during ascending phase, we've found a potential threshold
          // This is the beginning of the bracketing pattern
          setProcedurePhase('threshold');
          
          // Track responses at the current level
          const currentLevel = currentStep.currentLevel;
          
          // Update response counts for this level
          const levelResponseCounts = { ...responseCounts };
          const frequency = currentStep.frequency;
          const ear = currentStep.ear;
          
          // Make sure to use the proper frequency and ear for tracking responses
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
          
          // Set UI to show the current level we're tracking
          setLastResponseLevel(currentLevel);
          
          // Calculate how many responses we have at this level
          const heardCount = levelResponseCounts[frequency][ear][currentLevel].heard;
          const totalCount = levelResponseCounts[frequency][ear][currentLevel].total;
          
          // After any positive response, must immediately decrease by 10 dB
          setSuggestedAction('decrease');
          setCurrentGuidance(`You've found the potential threshold! The patient responded at ${currentLevel} dB. According to Hughson-Westlake protocol, you must immediately decrease by 10 dB and begin the bracketing pattern (10 dB down after response, 5 dB up after no response).`);
          console.log(`Ascending phase - patient responded at ${currentLevel}dB, changed to threshold phase, starting bracketing pattern`);
          
          // Important: Record the timestamp when entering threshold phase to ignore previous responses
          setThresholdPhaseStartTime(Date.now());
          console.log(`⏰ Setting threshold phase start time to ${Date.now()}`);
        } else if (procedurePhase === 'threshold') {
          // Continue tracking responses at the current level
          const currentLevel = currentStep.currentLevel;
          
          // Update response counts for this level
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

          console.log(`Threshold phase - adding response at ${currentLevel}dB for ${frequency}Hz, ${ear} ear: ${levelResponseCounts[frequency][ear][currentLevel].heard}/${levelResponseCounts[frequency][ear][currentLevel].total} responses`);
          
          setResponseCounts(levelResponseCounts);
          
          // Set UI to show the current level we're tracking
          setLastResponseLevel(currentLevel);
          
          // Calculate how many responses we have at this level
          const heardCount = levelResponseCounts[frequency][ear][currentLevel].heard;
          const totalCount = levelResponseCounts[frequency][ear][currentLevel].total;
          
          // Make sure this is a new student-initiated presentation
          if (thresholdPhaseStartTime && lastPresentationTimeRef.current > thresholdPhaseStartTime) {
            console.log(`🔢 Current responses at ${currentLevel}dB: ${heardCount}/${totalCount}`);
            console.log(`⏰ Presentation time: ${lastPresentationTimeRef.current}, Threshold phase start: ${thresholdPhaseStartTime}`);
            
            // CRITICAL FIX: Check if this is a new presentation we haven't processed yet
            if (lastPresentationTimeRef.current > lastProcessedPresentationRef.current) {
              // Update the last processed time to prevent double counting
              console.log(`✅ New presentation detected. Last processed: ${lastProcessedPresentationRef.current}, Current: ${lastPresentationTimeRef.current}`);
              lastProcessedPresentationRef.current = lastPresentationTimeRef.current;
              
              // FIXED HUGHSON-WESTLAKE PROTOCOL:
              // 1. After ANY positive response, MUST decrease by 10 dB (mandatory)
              // 2. We need to have at least 3 presentations at this level 
              // 3. Patient must respond to at least 2 of them to confirm threshold
              
              // First, ALWAYS recommend decreasing by 10 dB after a response (core Hughson-Westlake rule)
              setSuggestedAction('decrease');
              
              // Then check if we've already confirmed threshold
              if (totalCount >= 2) {
                if (heardCount >= 2) {
                  // Confirmed threshold: at least 2 out of 3 responses
                  console.log(`✅ Threshold CONFIRMED at ${currentLevel}dB with ${heardCount}/${totalCount} responses.`);
                  setProcedurePhase('complete');
                  setSuggestedAction('store_threshold');
                  setCurrentGuidance(`Excellent! You have established a threshold at ${currentLevel} dB. The patient has responded ${heardCount} times out of ${totalCount} at this level, which meets the criteria of "2 out of 3" responses needed to establish a threshold. You can now store this value and move to the next frequency.`);
                } else {
                  // Failed threshold confirmation: less than 2 out of 3 responses
                  console.log(`❌ Threshold NOT confirmed at ${currentLevel}dB with only ${heardCount}/${totalCount} responses.`);
                  setSuggestedAction('decrease');
                  setCurrentGuidance(`The patient responded, but has only ${heardCount} total responses out of ${totalCount} at ${currentLevel} dB. Following Hughson-Westlake protocol, decrease by 10 dB after ANY response, then continue testing.`);
                }
              } else if (heardCount >= 2) {
                // Already have 2 positive responses, but continue for confirmation
                console.log(`👍 Already have ${heardCount} positive responses at ${currentLevel}dB, need more presentations for confirmation.`);
                setSuggestedAction('decrease');
                setCurrentGuidance(`Good! The patient has responded ${heardCount} times at ${currentLevel} dB. Following Hughson-Westlake protocol, decrease by 10 dB after EACH response, then continue the bracketing pattern.`);
              } else if (totalCount === 2 && heardCount === 1) {
                // Have 1 out of 2 responses, need more presentations
                console.log(`⏳ Have 1 out of 2 responses at ${currentLevel}dB, continuing bracketing.`);
                setSuggestedAction('decrease');
                setCurrentGuidance(`The patient has responded once out of ${totalCount} presentations at ${currentLevel} dB. Following Hughson-Westlake protocol, decrease by 10 dB after EACH response, then continue the bracketing pattern.`);
              } else {
                // Continue testing with the bracketing pattern
                console.log(`⏳ Starting bracketing at ${currentLevel}dB (have ${heardCount}/${totalCount}, need at least 2/3)`);
                setSuggestedAction('decrease');
                setCurrentGuidance(`The patient has responded ${heardCount} time(s) out of ${totalCount} at ${currentLevel} dB. Following Hughson-Westlake protocol, decrease by 10 dB after EACH response, then continue the bracketing pattern.`);
              }
            } else {
              console.log(`⚠️ Double counting prevented! This presentation (${lastPresentationTimeRef.current}) was already processed.`);
            }
          } else {
            console.log('⚠️ Ignoring response from before threshold phase started in updateTrainerState');
            console.log(`⏰ Presentation time: ${lastPresentationTimeRef.current}, Threshold phase start: ${thresholdPhaseStartTime}`);
          }
        }
      }
    } else {
      // No response
      console.log('Patient did NOT respond - updating state');
      
      // Only update UI state if trainer mode is on
      if (trainerMode) {
        if (procedurePhase === 'initial') {
          // Initial level too low, suggest increasing
          setSuggestedAction('increase');
          setCurrentGuidance('The patient did not respond to the initial presentation. This suggests the starting level was too low. Increase the level by 10-15 dB and try again.');
          console.log('Initial phase - no response, suggest increasing');
        } else if (procedurePhase === 'descending') {
          // Move to ascending phase when patient stops responding during descending
          setProcedurePhase('ascending');
          setSuggestedAction('increase');
          setCurrentGuidance('The patient no longer responds at this level. This means we\'ve gone below their threshold. Now switch to the ascending phase: increase by 5 dB steps until the patient responds again. Note that we use smaller steps (5 dB) when ascending to more precisely determine the threshold.');
          console.log('Descending phase - no response, changing to ascending phase');
        } else if (procedurePhase === 'threshold') {
          // During threshold determination - if no response, track it and suggest increasing by 5dB
          const currentLevel = currentStep.currentLevel;
          
          // Update response counts for this level
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
          // No response, so don't increment the heard count

          setResponseCounts(levelResponseCounts);
          
          // Get the counts for this level
          const heardCount = levelResponseCounts[currentStep.frequency][currentStep.ear][currentLevel].heard;
          const totalCount = levelResponseCounts[currentStep.frequency][currentStep.ear][currentLevel].total;
          
          console.log(`🔢 Current responses at ${currentLevel}dB: ${heardCount}/${totalCount}`);
          
          // Update last processed time to prevent double counting
          if (lastPresentationTimeRef.current > lastProcessedPresentationRef.current) {
            lastProcessedPresentationRef.current = lastPresentationTimeRef.current;
          }
          
          // FIXED HUGHSON-WESTLAKE PROTOCOL FOR NO RESPONSE:
          // After no response, check if we already have a threshold (2/3 responses)
          // First check if we've already met threshold criteria despite this no-response
          if (totalCount >= 2 && heardCount >= 2) {
            // We already have a threshold! (2+ out of 3+ responses)
            console.log(`✅ Threshold CONFIRMED at ${currentLevel}dB with ${heardCount}/${totalCount} responses, despite this no-response.`);
            setProcedurePhase('complete');
            setSuggestedAction('store_threshold');
            setCurrentGuidance(`You have established a threshold at ${currentLevel} dB. The patient has responded ${heardCount} times out of ${totalCount} at this level, which meets the criteria of "2 out of 3" responses needed to establish a threshold. You can now store this value and move to the next frequency.`);
          } else if (totalCount >= 2 && heardCount < 2) {
            // Failed to confirm threshold at this level - move up 5 dB
            console.log(`❌ Level ${currentLevel}dB is below threshold with only ${heardCount}/${totalCount} positive responses.`);
            setSuggestedAction('increase');
            setCurrentGuidance(`The patient did not respond at ${currentLevel} dB (${heardCount}/${totalCount} responses). Following Hughson-Westlake protocol, increase by 5 dB and continue the bracketing pattern.`);
          } else if (totalCount - heardCount >= 2) {
            // Already have 2 negative responses, suggest increasing by 5 dB
            console.log(`👎 Already have ${totalCount - heardCount} negative responses at ${currentLevel}dB, suggesting to increase.`);
            setSuggestedAction('increase');
            setCurrentGuidance(`The patient has failed to respond ${totalCount - heardCount} times out of ${totalCount} at ${currentLevel} dB. Following Hughson-Westlake protocol, increase by 5 dB and continue the bracketing pattern.`);
          } else {
            // Continue testing with bracketing pattern
            setSuggestedAction('increase');
            setCurrentGuidance(`Patient did not respond at ${currentLevel} dB (${heardCount}/${totalCount} responses so far). Following Hughson-Westlake protocol, increase by 5 dB and continue the bracketing pattern.`);
          }
        } else if (procedurePhase === 'ascending') {
          // Continue ascending
          setProcedurePhase('ascending');
          setSuggestedAction('increase');
          setCurrentGuidance('Patient still doesn\'t respond at this level. Continue to increase by 5 dB steps until you get a response. Remember, we use smaller 5 dB steps during the ascending phase for more precise threshold determination.');
          console.log('Ascending phase - no response, continue ascending');
        }
      }
    }
  }, [trainerMode, currentStep, procedurePhase, responseCounts, thresholdPhaseStartTime, simulatePatientResponse]);

  // Process automatic patient response during tone presentation
  const processAutomaticResponse = useCallback(() => {
    // This function handles automatic responses during tone presentation for all phases
    if (!currentStep) {
      console.log('❌ Cannot process response: currentStep is null');
      return;
    }
    
    console.log('🔍 Processing automatic response with toneActive =', toneActive);
    
    // Simulate patient response
    const didRespond = simulatePatientResponse();
    console.log('👂 Patient response simulation result:', didRespond);
    
    // Update UI to show response
    setPatientResponse(didRespond);
    setShowResponseIndicator(true);
    
    // Display user-friendly notification about patient response
    if (didRespond) {
      console.log('👂 Patient is responding to the tone!');
      // Set the flag that patient just responded (for the guidance panel)
      setPatientJustResponded(true);
      
      // Reset the flag after a delay, but leave patientResponse true
      setTimeout(() => {
        setPatientJustResponded(false);
      }, 3000);
    } else {
      console.log('👂 Patient does not hear this tone.');
      setPatientJustResponded(false);
    }
    
    // Record the response time
    const responseTimestamp = Date.now();
    console.log('⏱️ Response time:', responseTimestamp);
    
    // Record the response in the testing service WITHOUT automatic level adjustment
    // during tone presentation to prevent unwanted level changes
    console.log('💾 Recording response WITHOUT level adjustment. Current phase:', procedurePhase);
    testingService.recordResponseWithoutAdjustment(didRespond);
    
    // Store the current user-set level before getting the updated step
    const currentUserLevel = currentStep.currentLevel;
    
    // Update current step after recording response
    const newStep = testingService.getCurrentStep();
    
    // IMPORTANT: Preserve the user's manually set level rather than using whatever comes back from the service
    if (newStep && currentUserLevel !== newStep.currentLevel) {
      console.log(`🔄 Preserving user-set level: ${currentUserLevel}dB instead of service level: ${newStep.currentLevel}dB`);
      newStep.currentLevel = currentUserLevel;
    }
    
    setCurrentStep(newStep);
    
    // Check if test is complete
    const updatedSession = testingService.getCurrentSession();
    if (updatedSession) {
      // Also ensure the session has the correct level
      if (updatedSession.testSequence && updatedSession.testSequence[updatedSession.currentStep]) {
        updatedSession.testSequence[updatedSession.currentStep].currentLevel = currentUserLevel;
      }
      
      setSession(updatedSession);
      
      if (updatedSession.completed) {
        onComplete(updatedSession);
      }
    }
    
    // EXTREMELY IMPORTANT: NEVER update the trainer state during tone presentation
    // The trainer state will ONLY be updated when the tone stops in the stopTone function
    console.log('⚠️ STRICTLY NOT updating trainer state during tone presentation. Phase remains:', procedurePhase);
    
  }, [currentStep, simulatePatientResponse, onComplete, procedurePhase, setPatientResponse, setShowResponseIndicator, setPatientJustResponded, setCurrentStep, setSession]);

  // Process response without changing levels - just UI indication
  const processSimpleResponse = useCallback(() => {
    if (!currentStep) {
      console.log('Cannot process response: currentStep is null');
      return;
    }
    
    // Simulate patient response
    const didRespond = simulatePatientResponse();
    console.log('Patient response simulation result (simple):', didRespond);
    
    // Update UI to show response
    setPatientResponse(didRespond);
    setShowResponseIndicator(true);
    
    // Display user-friendly notification about patient response
    if (didRespond) {
      console.log('Patient is responding to the tone!');
      // Set the flag that patient just responded (for the guidance panel)
      setPatientJustResponded(true);
      
      // Reset the flag after a delay, but leave patientResponse true
      setTimeout(() => {
        setPatientJustResponded(false);
      }, 3000);
    } else {
      console.log('Patient does not hear this tone.');
      setPatientJustResponded(false);
    }
    
    // Record the response in the testing service WITHOUT automatic level adjustment
    testingService.recordResponse(didRespond);
    
    // DON'T update steps or session here to prevent auto level changes
  }, [currentStep]);

  // Stop tone and check for patient response
  const stopTone = useCallback(() => {
    console.log('🛑 Stopping tone...');
    
    // Stop the pulsing tone
    audioService.stopTone();
    
    // Get current states BEFORE changing any state to avoid race conditions
    const currentToneActive = toneActive;
    const currentPatientResponse = patientResponse;
    const currentProcedurePhase = procedurePhase;
    
    // Log current state for debugging
    console.log('🛑 Stopping tone with current state:', {
      toneActive: currentToneActive,
      patientResponse: currentPatientResponse,
      phase: currentProcedurePhase
    });
    
    // Set tone inactive
    setToneActive(false);
    
    // Record the time of this presentation to prevent duplicate responses
    const presentationStopTime = Date.now();
    lastPresentationTimeRef.current = presentationStopTime;
    
    console.log('⏱️ Presentation stopped at:', presentationStopTime);
    
    // Simulate a patient response for internal processing if one doesn't exist yet
    let effectiveResponse = currentPatientResponse;
    if (effectiveResponse === null) {
      // If we haven't determined a response yet, do so now
      const didRespond = simulatePatientResponse();
      console.log('🔊 Simulating patient response at tone stop for internal processing only:', didRespond);
      
      // Use this response for processing but don't update UI
      effectiveResponse = didRespond;
    } else {
      console.log('🔊 Using existing patient response from during tone playback:', effectiveResponse);
    }
    
    // Always process a response after stopping the tone
    if (currentStep) {
      console.log('💻 Processing tone stop in phase:', currentProcedurePhase);
      
      // Make sure this is a fresh presentation that hasn't been processed yet
      if (presentationStopTime > lastProcessedPresentationRef.current) {
        console.log(`✅ Processing new presentation. Current: ${presentationStopTime}, Last processed: ${lastProcessedPresentationRef.current}`);
        
        // Process the response
        if (effectiveResponse !== null) {
          // Store the response in the testing service
          testingService.recordResponseWithoutAdjustment(Boolean(effectiveResponse));
          
          // Update trainer state IMMEDIATELY for all phases
          // This ensures the guidance updates immediately after tone stops
          console.log('🔄 Immediately updating trainer state with response:', effectiveResponse);
          updateTrainerState(Boolean(effectiveResponse));
          
          // Update the last processed time
          lastProcessedPresentationRef.current = presentationStopTime;
        } else {
          // FIXED: If effectiveResponse is null but we had a previous patient response during the tone
          // that wasn't yet processed by updateTrainerState, we need to process it now
          console.log('⚠️ Checking for unprocessed patient response from during tone playback');
          if (currentPatientResponse !== null) {
            console.log('✅ Found unprocessed patient response:', currentPatientResponse);
            testingService.recordResponseWithoutAdjustment(Boolean(currentPatientResponse));
            updateTrainerState(Boolean(currentPatientResponse));
            lastProcessedPresentationRef.current = presentationStopTime;
          }
        }
      } else {
        console.log(`⚠️ Presentation already processed in stopTone! Current: ${presentationStopTime}, Last processed: ${lastProcessedPresentationRef.current}`);
      }
    }

    // MOVED: Reset patient response visuals AFTER updating trainer state
    // This fixes the issue where responses weren't being counted during bracketing
    // CRITICAL FIX: Previously, patient responses during tone playback were reset BEFORE they
    // could be counted in the updateTrainerState function, leading to incorrect count during bracketing.
    // Moving this reset code AFTER the trainer state update ensures responses are counted properly.
    setPatientResponse(null);
    setShowResponseIndicator(false);
    setPatientJustResponded(false);
    console.log('🔄 Patient response visuals reset AFTER updating trainer state');
    
  }, [patientResponse, currentStep, updateTrainerState, procedurePhase]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (toneIntervalRef.current) {
        clearInterval(toneIntervalRef.current);
      }
      audioService.stopTone();
    };
  }, []);

  // Handle mouse up event outside the component
  useEffect(() => {
    const handleMouseUp = () => {
      if (toneActive) {
        stopTone();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [toneActive, stopTone]);

  // Handle level adjustment - update for trainer mode
  const handleAdjustLevel = useCallback((change: number) => {
    if (!currentStep) return;
    
    try {
      // Create a proper new object without mutating the original
      const newLevel = Math.max(-10, Math.min(120, currentStep.currentLevel + change)) as HearingLevel;
      
      // Log the current frequency and ear for debugging
      console.log(`Adjusting level for frequency ${currentStep.frequency}Hz, ${currentStep.ear} ear: ${currentStep.currentLevel}dB -> ${newLevel}dB`);
      
      // Update trainer mode state based on level change
      if (trainerMode) {
        // When manually adjusting levels, we should update the phase information to keep guidance relevant
        if (procedurePhase === 'initial' || procedurePhase === 'descending') {
          // If decreasing by 10dB, user is following descending protocol
          if (change === -10) {
            setProcedurePhase('descending');
            setSuggestedAction('present');
            setCurrentGuidance(`You've decreased by 10 dB. Now present the tone to see if the patient can still hear it at ${newLevel} dB.`);
          } else if (change === 5 || change === 10) {
            // If increasing, provide guidance but keep the phase the same
            setSuggestedAction('present');
            setCurrentGuidance(`You've increased by ${change} dB. Present the tone to check for a response at ${newLevel} dB.`);
          } else if (change === -5) {
            // Non-standard adjustment
            setSuggestedAction('present');
            setCurrentGuidance(`You've decreased by 5 dB. While Hughson-Westlake protocol uses 10 dB decrements in the descending phase, you can still present the tone at ${newLevel} dB to check for a response.`);
          }
        } else if (procedurePhase === 'ascending') {
          // If increasing by 5dB, user is following ascending protocol
          if (change === 5) {
            setSuggestedAction('present');
            setCurrentGuidance(`You've increased by 5 dB. Now present the tone to see if the patient can hear it at ${newLevel} dB.`);
          } else if (change === 10) {
            setSuggestedAction('present');
            setCurrentGuidance(`You've increased by 10 dB. While Hughson-Westlake protocol uses 5 dB increments in the ascending phase, you can still present the tone at ${newLevel} dB to check for a response.`);
          } else if (change < 0) {
            // If decreasing during ascending phase, switch to descending phase
            setProcedurePhase('descending');
            setSuggestedAction('present');
            setCurrentGuidance(`You've decreased by ${Math.abs(change)} dB, changing to the descending phase. Present the tone to check for a response at ${newLevel} dB.`);
          }
        } else if (procedurePhase === 'threshold') {
          // IMPORTANT CHANGE: During threshold determination, don't reset counts when changing levels
          // Just continue using the same pattern (10dB down, 5dB up) while tracking responses at each level
          if (change === -10) {
            // User following standard protocol - decrease after a response
            setSuggestedAction('present');
            setCurrentGuidance(`You've decreased by 10 dB to ${newLevel} dB. This follows the Hughson-Westlake protocol. Present the tone to check for a response at this new level.`);
            console.log(`Threshold phase - decreased by 10dB to ${newLevel}dB`);
          } else if (change === 5) {
            // User following standard protocol - increase after no response
            setSuggestedAction('present');
            setCurrentGuidance(`You've increased by 5 dB to ${newLevel} dB. This follows the Hughson-Westlake protocol. Present the tone to check for a response at this new level.`);
            console.log(`Threshold phase - increased by 5dB to ${newLevel}dB`);
          } else {
            // Non-standard adjustment - just provide appropriate guidance
            setSuggestedAction('present');
            setCurrentGuidance(`You've changed the level to ${newLevel} dB. Present the tone to check for a response at this level.`);
            console.log(`Threshold phase - adjusted by ${change}dB to ${newLevel}dB (non-standard adjustment)`);
          }
          
          // Update UI to reflect the current level
          setLastResponseLevel(newLevel);
        } else if (procedurePhase === 'complete') {
          // Reset to threshold phase if changing level after completion
          setProcedurePhase('threshold');
          setSuggestedAction('present');
          setCurrentGuidance(`You're adjusting the level after completing threshold determination. You're now at ${newLevel} dB. Present the tone to check for a response.`);
        }
      }
      
      // Create a new object instead of mutating the existing one
      const updatedStep = {
        ...currentStep,
        currentLevel: newLevel
      };
      
      setCurrentStep(updatedStep);
      
      // Explicitly update the testing service with the new level
      // This ensures the correct frequency+ear combination is updated
      testingService.setCurrentLevel(newLevel);
      
      // Also update the session to keep everything in sync
      if (session) {
        // Create a new session object with new references
        const updatedSession = { ...session };
        
        // Create a new test sequence array with new references
        updatedSession.testSequence = [...updatedSession.testSequence];
        
        // Update the specific step in the sequence by finding the index for the current frequency and ear
        const currentIndex = updatedSession.currentStep;
        
        // Make sure we only update the step for the current frequency and ear
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
      console.error("Error adjusting level:", error);
      setErrorMessage('Failed to adjust level. Please try again.');
    }
  }, [currentStep, session, trainerMode, procedurePhase]);

  // Handle skip step action - update for trainer mode
  const handleSkipStep = useCallback(() => {
    try {
      console.log('⏭️ handleSkipStep called - skipping to next frequency');
      
      // Reset trainer mode state for the new frequency
      if (trainerMode) {
        // We're changing the condition here to allow navigation even after storing a threshold
        // Previously this was preventing navigation after storing a threshold
        setProcedurePhase('initial');
        setLastResponseLevel(null);
        setSuggestedAction('present');
        setCurrentGuidance('Starting with a new frequency. Begin at a comfortable level.');
        console.log('Reset phase to: initial for new frequency in handleSkipStep');
      }
      
      // Use the updated skipCurrentStep method with false parameter to avoid marking as completed
      console.log('📊 Before skip - Current session:', session?.currentStep);
      const nextStep = testingService.skipCurrentStep(false);
      console.log('📊 After skip - Got next step:', nextStep?.frequency);
      
      // Force a refresh of the session directly
      const updatedSession = testingService.getCurrentSession();
      console.log('📊 After skip - Updated session:', updatedSession?.currentStep);
      
      if (nextStep && updatedSession) {
        // Update both the session and current step states with forceful refresh
        console.log('📊 Updating UI with new frequency:', nextStep.frequency);
        
        // Create fresh objects to ensure React detects the change
        // const freshSession = JSON.parse(JSON.stringify(updatedSession));
        // setSession(freshSession);
        
        const freshStep = JSON.parse(JSON.stringify(nextStep));
        setCurrentStep(freshStep);
        
        console.log('Moved to next frequency without marking complete:', nextStep.frequency);
        
        // Reset UI state for the new frequency
        if (trainerMode) {
          setProcedurePhase('initial');
          // IMPORTANT: Do NOT reset responseCounts here as it contains threshold information
          // Removed: setResponseCounts({});
        }
      } else {
        console.log('Test complete');
        const finalSession = testingService.completeSession();
        if (finalSession) {
          onComplete(finalSession);
        }
      }
    } catch (error) {
      console.error("Error skipping step:", error);
      setErrorMessage('Failed to skip to next step. Please try again.');
    }
  }, [onComplete, trainerMode, setErrorMessage, setSession, setCurrentStep, setProcedurePhase, setLastResponseLevel, setSuggestedAction, setCurrentGuidance, session]);

  // Add a new function to handle going to the previous frequency
  const handlePreviousStep = useCallback(() => {
    try {
      console.log('⏮️ handlePreviousStep called - going to previous frequency');
      
      // Reset trainer mode state for the previous frequency
      if (trainerMode) {
        setProcedurePhase('initial');
        setLastResponseLevel(null);
        setSuggestedAction('present');
        setCurrentGuidance('Returning to the previous frequency. Begin at a comfortable level.');
        console.log('Reset phase to: initial for previous frequency');
      }
      
      // We need to modify the session directly since TestingService may not have a specific 
      // method to go back to the previous step
      if (session) {
        console.log('📊 Before navigating back - Current step:', session.currentStep);
        const updatedSession = JSON.parse(JSON.stringify(session));
        
        // Only go back if we're not already at the first step
        if (updatedSession.currentStep > 0) {
          updatedSession.currentStep -= 1;
          
          // Important: Get the previous step reference
          const previousStep = updatedSession.testSequence[updatedSession.currentStep];
          console.log('📊 Going back to step:', updatedSession.currentStep, 'with frequency:', previousStep.frequency);
          
          // Update session and current step states with fresh objects
          setSession(updatedSession);
          
          const freshStep = JSON.parse(JSON.stringify(previousStep));
          setCurrentStep(freshStep);

          // CRITICAL FIX: Update the TestingService's internal state to match our navigation
          // This ensures that any audio played will use the correct frequency
          const currentSession = testingService.getCurrentSession();
          if (currentSession) {
            // Store the session in a variable first to avoid TypeScript null error
            currentSession.currentStep = updatedSession.currentStep;
            console.log(`🔄 Explicitly updated TestingService step to ${updatedSession.currentStep} with frequency ${previousStep.frequency}Hz`);
          }
          
          console.log('Moving to previous frequency:', previousStep.frequency);
        } else {
          console.log('Already at the first frequency, cannot go back further');
          setErrorMessage('Already at the first frequency.');
        }
      }
    } catch (error) {
      console.error("Error going to previous step:", error);
      setErrorMessage('Failed to go to previous step. Please try again.');
    }
  }, [session, trainerMode, setSession, setCurrentStep, setProcedurePhase, setLastResponseLevel, setSuggestedAction, setCurrentGuidance, setErrorMessage]);

  // Validate threshold according to Hughson-Westlake protocol
  const validateThreshold = useCallback((): { isValid: boolean; message: string } => {
    if (!currentStep) {
      return { isValid: false, message: 'No current test step available.' };
    }
    
    const frequency = currentStep.frequency;
    const ear = currentStep.ear;
    
    console.log(`Validating threshold for ${frequency}Hz, ${ear} ear`);
    
    // Check responseCounts for any level with at least 2/3 positive responses
    let validLevel = null;
    let minValidLevel = Infinity;
    
    // First check our tracked response counts (more accurate)
    const frequencyData = responseCounts[frequency];
    const earData = frequencyData?.[ear] || {};
    
    console.log(`Found response data:`, earData);
    
    Object.entries(earData).forEach(([levelStr, counts]) => {
      const level = parseInt(levelStr);
      // PROPER HUGHSON-WESTLAKE CRITERIA: at least 2 out of 3 responses at this level
      if (counts.total >= 3 && counts.heard >= 2 && level < minValidLevel) {
        validLevel = level;
        minValidLevel = level;
        console.log(`  Found valid level at ${level}dB: ${counts.heard}/${counts.total} responses`);
      }
    });
    
    if (validLevel !== null) {
      const counts = earData[validLevel];
      return { 
        isValid: true, 
        message: `Valid threshold at ${validLevel} dB - patient responded ${counts.heard}/${counts.total} times at this level.` 
      };
    }
    
    // If we didn't find a valid threshold in our tracked counts, check the responses array
    const { responses } = currentStep;
    
    // We need a minimum number of responses to establish a threshold
    if (responses.length < 3) {
      return { 
        isValid: false, 
        message: 'Not enough responses to determine a threshold. Hughson-Westlake requires at least 2 out of 3 responses at the same level.' 
      };
    }
    
    // Create a map of responses at each level
    const responsesAtLevels = new Map<number, { total: number, heard: number }>();
    
    responses.forEach(response => {
      const level = response.level;
      const existing = responsesAtLevels.get(level) || { total: 0, heard: 0 };
      existing.total += 1;
      if (response.response) {
        existing.heard += 1;
      }
      responsesAtLevels.set(level, existing);
    });
    
    // Check for any level with at least 2 out of 3 positive responses
    responsesAtLevels.forEach((counts, level) => {
      if (counts.total >= 3 && counts.heard >= 2 && level < minValidLevel) {
        validLevel = level;
        minValidLevel = level;
      }
    });
    
    if (validLevel !== null) {
      const counts = responsesAtLevels.get(validLevel) || { total: 0, heard: 0 };
      return { 
        isValid: true, 
        message: `Valid threshold at ${validLevel} dB - patient responded ${counts.heard}/${counts.total} times at this level.` 
      };
    } else {
      // Find the level with the most responses to give helpful feedback
      let maxResponses = 0;
      let mostTestedLevel = null;
      
      responsesAtLevels.forEach((counts, level) => {
        if (counts.total > maxResponses) {
          maxResponses = counts.total;
          mostTestedLevel = level;
        }
      });
      
      if (mostTestedLevel !== null) {
        const heardAtLevel = responsesAtLevels.get(mostTestedLevel)?.heard || 0;
        return { 
          isValid: false, 
          message: `Invalid threshold. At ${mostTestedLevel} dB, patient responded ${heardAtLevel}/${maxResponses} times, but Hughson-Westlake requires at least 2 out of 3 responses at the same level.` 
        };
      } else {
        return { 
          isValid: false, 
          message: 'Invalid threshold. Hughson-Westlake requires at least 2 out of 3 responses at the same level.' 
        };
      }
    }
  }, [currentStep, responseCounts]);
  
  // Helper function to determine if threshold can be stored
  const canStoreThreshold = useCallback(() => {
    return validateThreshold().isValid;
  }, [validateThreshold]);

  // Handle storing threshold and moving to next step
  const handleStoreThreshold = useCallback(() => {
    if (!currentStep) {
      console.error('Cannot store threshold: no current step');
      return;
    }
    
    // Validate the threshold first
    const validation = validateThreshold();
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }
    
    // Find the valid threshold level from our response counts
    let validThresholdLevel: number | null = null;
    let minValidLevel = Infinity;
    
    // Check the response counts for the current frequency and ear
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
    
    console.log(`Storing threshold at validated level: ${validThresholdLevel}dB (current level is ${currentStep.currentLevel}dB)`);
    
    // Update the TestingService with the validated threshold level
    testingService.setCurrentLevel(validThresholdLevel as HearingLevel);
    
    // Mark the current step as completed without advancing to next step
    if (session) {
      const updatedSession = { ...session };
      const updatedStep = updatedSession.testSequence[updatedSession.currentStep];
      
      // Mark the step as completed and set responseStatus to 'threshold'
      updatedStep.completed = true;
      updatedStep.responseStatus = 'threshold';
      
      // Update our session state to reflect this change
      setSession(updatedSession);
      
      // Also update the currentStep to show it's completed with proper type validation
      if (currentStep) {
        const updatedCurrentStep: TestStep = {
          ...currentStep,
          completed: true,
          responseStatus: 'threshold'
        };
        
        setCurrentStep(updatedCurrentStep);
      }
      
      console.log(`Threshold stored at ${validThresholdLevel}dB, marked as completed but staying on current frequency`);
    }
    
    // Add clearer feedback for successful threshold storage and navigation instructions
    setCurrentGuidance(`Threshold successfully stored at ${validThresholdLevel} dB! You can now use the up arrow (or press Up) to move to the next frequency, or the down arrow to go to a previous frequency.`);
    
    // Update UI to indicate threshold recorded
    setProcedurePhase('complete');
    setSuggestedAction('next');
    
    // Update the response counts map with the stored threshold
    setResponseCounts(prev => {
      const newCounts = { ...prev };
      // At this point validThresholdLevel is guaranteed to be non-null since we checked above
      // Use type assertion to ensure TypeScript understands this
      const level = validThresholdLevel as HearingLevel;
      const frequency = currentStep.frequency;
      const ear = currentStep.ear;
      
      console.log(`Updating response counts for threshold: ${frequency}Hz, ${ear} ear at ${level}dB`);
      
      if (!newCounts[frequency]) {
        newCounts[frequency] = {};
      }
      
      if (!newCounts[frequency][ear]) {
        newCounts[frequency][ear] = {};
      }
      
      newCounts[frequency][ear][level] = {
        total: 3,  // Standard Hughson-Westlake criteria
        heard: 2   // At least 2 out of 3
      };
      
      return newCounts;
    });
  }, [currentStep, session, responseCounts, setErrorMessage, setSession, setCurrentStep, setCurrentGuidance, setProcedurePhase, setSuggestedAction, setResponseCounts]);

  // Initialize the test session - reset trainer mode
  useEffect(() => {
    try {
      // Reset trainer mode state
      setProcedurePhase('initial');
      setLastResponseLevel(null);
      setSuggestedAction('present');
      setCurrentGuidance('Start testing at a comfortable level (30-40 dB).');
      
      // Resume audio context on first user interaction
      audioService.resumeAudioContext().then(() => {
        const newSession = testingService.startSession(patient);
        setSession(newSession);
        setCurrentStep(testingService.getCurrentStep());
        
        // We don't want to reset responseCounts here as it will clear any stored thresholds
        // keeping the existing responseCounts which stores thresholds per frequency/ear
      });
    } catch (error) {
      console.error("Error initializing test session:", error);
      setErrorMessage('Failed to initialize test session. Please try again.');
    }
  }, [patient, setProcedurePhase, setLastResponseLevel, setSuggestedAction, setCurrentGuidance, setSession, setCurrentStep, setErrorMessage]);

  // Format frequency for display
  const formatFrequency = (freq: number): string => {
    return freq >= 1000 ? `${freq / 1000} kHz` : `${freq} Hz`;
  };

  // Start playing tone with pulsing pattern
  const startTone = useCallback(() => {
    if (!currentStep) return;
    
    try {
      console.log('🎵 Starting tone...');
      
      // Stop any currently playing tones to ensure a clean start
      audioService.stopTone();
      
      // Make sure TestingService has the correct level before playing
      if (currentStep) {
        // Ensure the testing service knows about our current step's frequency
        const currentFrequency = currentStep.frequency;
        console.log(`🔊 Explicit frequency check: Using ${currentFrequency}Hz for tone`);
        
        // Ensure the testing service knows about our current manually set level
        testingService.setCurrentLevel(currentStep.currentLevel);
        console.log(`🔊 Starting tone at user-set level: ${currentStep.currentLevel}dB, phase: ${procedurePhase}`);
      }
      
      // Reset response states at the start of a new tone
      setPatientResponse(null);
      setPatientJustResponded(false);
      setShowResponseIndicator(false);
      console.log('🔄 Response states reset');
      
      // Set tone active state BEFORE playing tone
      setToneActive(true);
      console.log('🔊 Tone active set to true');
      
      // Play the tone with pulsing - this now happens in AudioService
      testingService.playCurrentTone();
      console.log('🎵 Pulsed tone started');
      
      // Immediate response check - show response immediately if patient can hear it
      const didRespond = simulatePatientResponse();
      console.log('👂 Immediate patient response check:', didRespond);
      
      if (didRespond) {
        setPatientResponse(didRespond);
        setShowResponseIndicator(true);
        setPatientJustResponded(true);
        console.log('👂 Patient IMMEDIATELY responded to the tone!');
        
        // Record the response in the testing service for later processing
        console.log('💾 Recording immediate response for later processing');
        testingService.recordResponseWithoutAdjustment(didRespond);
      }
      
      // Record the presentation time
      console.log('🎯 Recording tone presentation time');
      lastPresentationTimeRef.current = Date.now();
      
      // Process automatic response after a brief delay if not already responded
      console.log('⏱️ Setting up automatic response processing');
      setTimeout(() => {
        // Only process if tone is still active and no response yet
        if (toneActive && !patientResponse) {
          console.log('📲 Processing automatic response...');
          processAutomaticResponse();
        } else {
          console.log('⚠️ Tone no longer active or response already shown, skipping response processing');
        }
      }, 600);
      
    } catch (error) {
      console.error("❌ Error playing tone:", error);
      setErrorMessage('Failed to play tone. Please try again.');
      
      setToneActive(false);
      audioService.stopTone();
    }
  }, [currentStep, processAutomaticResponse, toneActive, simulatePatientResponse, patientResponse]);

  // Update keyboard shortcuts to handle space bar press/release
  useEffect(() => {
    console.log('🎮 Setting up keyboard event handlers');
    
    // Keyboard event handler for key down
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar - play tone
      if (e.code === 'Space' && !toneActive) {
        e.preventDefault();
        console.log('⌨️ Space key down - starting tone');
        startTone();
      }
      // Up arrow - increase level
      else if (e.code === 'ArrowUp' && e.shiftKey) {
        e.preventDefault();
        console.log('⌨️ Shift+Up arrow - increasing level by 5dB');
        handleAdjustLevel(5);
      }
      // Down arrow - decrease level
      else if (e.code === 'ArrowDown' && e.shiftKey) {
        e.preventDefault();
        console.log('⌨️ Shift+Down arrow - decreasing level by 5dB');
        handleAdjustLevel(-5);
      }
      // Up arrow - next frequency
      else if (e.code === 'ArrowUp' && !e.shiftKey) {
        e.preventDefault();
        console.log('⌨️ Up arrow - skipping to next frequency');
        handleSkipStep();
      }
      // Down arrow - previous frequency
      else if (e.code === 'ArrowDown' && !e.shiftKey) {
        e.preventDefault();
        console.log('⌨️ Down arrow - going to previous frequency');
        handlePreviousStep();
      }
      // S key - store threshold (when valid)
      else if (e.code === 'KeyS' && trainerMode && canStoreThreshold()) {
        e.preventDefault();
        console.log('⌨️ S key - storing threshold');
        handleStoreThreshold();
      }
    };

    // Keyboard event handler for key up
    const handleKeyUp = (e: KeyboardEvent) => {
      // Space bar release - stop tone
      if (e.code === 'Space' && toneActive) {
        e.preventDefault();
        console.log('⌨️ Space key up - stopping tone');
        stopTone();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      console.log('🧹 Removing keyboard event handlers and cleaning up audio');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // Clean up audio when component unmounts
      audioService.stopTone();
    };
  }, [handleAdjustLevel, handleSkipStep, handlePreviousStep, handleStoreThreshold, startTone, stopTone, toneActive, trainerMode, responseCount, suggestedAction, canStoreThreshold, session]);

  // Update test progress when current step changes
  useEffect(() => {
    if (session && currentStep) {
      const totalSteps = session.testSequence.length;
      const currentStepIndex = session.currentStep;
      const progress = (currentStepIndex / totalSteps) * 100;
      setTestProgress(progress);
    }
  }, [session, currentStep]);

  // Memoize the thresholds calculation to prevent infinite re-renders
  const thresholds = useMemo((): ThresholdPoint[] => {
    if (!session) return [];
    
    // Debug helper: Log all completed test steps with thresholds
    const completedSteps = session.testSequence.filter(step => step.completed && step.responseStatus === 'threshold');
    if (completedSteps.length > 0) {
      console.log('🎯 Current completed thresholds:');
      completedSteps.forEach(step => {
        console.log(`   ${step.frequency}Hz, ${step.ear} ear: ${step.currentLevel}dB`);
      });
    }
    
    return session.testSequence
      .filter(step => step.completed && step.responseStatus === 'threshold')
      .map(step => {
        // For completed steps with stored thresholds, use the validated level
        console.log(`Including validated threshold for completed step: ${step.currentLevel}dB (frequency: ${step.frequency}, ear: ${step.ear})`);
        
        return {
          frequency: step.frequency,
          hearingLevel: step.currentLevel,
          ear: step.ear,
          testType: step.testType,
          responseStatus: 'threshold'
        } as ThresholdPoint;
      });
  }, [session]);

  // Handle implementing suggested action
  const handleSuggestedAction = useCallback(() => {
    if (!currentStep) return;
    
    console.log('Implementing suggested action:', suggestedAction);
    
    switch (suggestedAction) {
      case 'increase':
        // Implement the 5 dB increase according to Hughson-Westlake
        // We always use 5 dB increments during bracketing (after no response)
        if (procedurePhase === 'initial') {
          handleAdjustLevel(10); // 10 dB for initial phase
          console.log('Remained in initial phase after increasing by 10dB');
        } else {
          // In all other phases (ascending, threshold), use 5 dB increments
          handleAdjustLevel(5); // 5 dB for ascending/threshold phase
          if (procedurePhase === 'ascending') {
            console.log('Remained in ascending phase after increasing by 5dB');
          } else if (procedurePhase === 'threshold') {
            console.log('Continued bracketing in threshold phase after increasing by 5dB');
          }
        }
        break;
      case 'decrease':
        // Always decrease by 10 dB after a response (core Hughson-Westlake principle)
        handleAdjustLevel(-10);
        
        // If we're in the initial or ascending phase, explicitly update to descending
        if (procedurePhase === 'initial' || procedurePhase === 'ascending') {
          setProcedurePhase('descending');
          console.log('Updated phase to: descending after decreasing by 10dB');
        } else if (procedurePhase === 'threshold') {
          // In threshold phase, we stay in threshold phase but continue bracketing
          console.log('Continued bracketing in threshold phase after decreasing by 10dB');
        }
        break;
      case 'store_threshold':
        // Validate threshold before storing
        const { isValid, message } = validateThreshold();
        if (isValid) {
          handleStoreThreshold();
          setProcedurePhase('complete');
          console.log('Updated phase to: complete after storing threshold');
        } else {
          // Show error for invalid threshold
          setErrorMessage(message);
          setCurrentGuidance(message + ' Continue testing to establish a valid threshold.');
        }
        break;
      case 'next':
        handleSkipStep();
        // Reset to initial phase for the next frequency - don't reset responseCounts
        setProcedurePhase('initial');
        console.log('Reset phase to: initial for next frequency');
        break;
      case 'present':
        // No level adjustment needed, just guidance to present the tone
        setCurrentGuidance(`Present the tone at ${currentStep.currentLevel} dB to check for a response.`);
        // Don't change the phase when just presenting the tone
        break;
      default:
        console.log('Unknown suggested action:', suggestedAction);
    }
  }, [suggestedAction, procedurePhase, currentStep, handleAdjustLevel, handleStoreThreshold, handleSkipStep, validateThreshold, setCurrentGuidance, setErrorMessage, setProcedurePhase]);

  if (!session || !currentStep) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Initializing test session...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {/* Header row */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: 2 
          }}>
            <Typography variant="h5" sx={{ mb: { xs: 1, sm: 0 } }}>
              Audiometry Testing - {currentStep?.ear === 'right' ? 'Right' : 'Left'} Ear
            </Typography>
            {session && session.patientId && (
              <FormControlLabel
                control={
                  <Switch
                    checked={trainerMode}
                    onChange={(e) => setTrainerMode(e.target.checked)}
                    color="primary"
                  />
                }
                label="Trainer Mode"
              />
            )}
          </Box>
          
          {/* Add testing status bar when trainer mode is active */}
          {trainerMode && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' }, 
              justifyContent: 'space-between',
              gap: 1,
              mt: 1,
              p: 1,
              borderRadius: 1,
              bgcolor: '#f5f5f5',
              border: '1px solid #e0e0e0'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ mr: 2, fontWeight: 'bold' }}>
                  Current Phase:
                </Typography>
                <Chip
                  label={(() => {
                    switch(procedurePhase) {
                      case 'initial': return 'Initial Presentation';
                      case 'descending': return 'Descending Phase (-10 dB)';
                      case 'ascending': return 'Ascending Phase (+5 dB)';
                      case 'threshold': return 'Threshold Determination';
                      case 'complete': return 'Threshold Complete';
                      default: return 'Initial Phase';
                    }
                  })()}
                  color={(() => {
                    switch(procedurePhase) {
                      case 'initial': return 'default';
                      case 'descending': return 'secondary';
                      case 'ascending': return 'primary';
                      case 'threshold': return 'warning';
                      case 'complete': return 'success';
                      default: return 'default';
                    }
                  })() as any}
                  size="small"
                />
              </Box>
              
              {responseCount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ mr: 2, fontWeight: 'bold' }}>
                    Responses at {lastResponseLevel}dB:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[...Array(3)].map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: i < responseCount ? '#4caf50' : '#e0e0e0',
                          color: i < responseCount ? 'white' : 'black',
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}
                      >
                        {i + 1}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              
              <Box>
                <Typography variant="subtitle2">
                  Test Progress: {Math.round(testProgress)}%
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>

        {/* Main content row - Moved above the guidance panel */}
        <Grid item xs={12} md={6}>
          {/* Left column - Audiogram */}
          <Box sx={{ 
            height: { xs: 300, sm: 350, md: 450 }, 
            display: 'flex', 
            flexDirection: 'column',
            mb: { xs: 2, md: 0 }
          }}>
            <Audiogram 
              thresholds={thresholds}
              currentFrequency={currentStep?.frequency}
              currentLevel={currentStep?.currentLevel}
              toneActive={Boolean(toneActive)}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Right column - Patient and controls */}
          <Box sx={{ 
            height: { xs: 'auto', md: 450 }, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            justifyContent: 'space-between'
          }}>
            {/* Patient image */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              position: 'relative',
              mb: 2,
              minHeight: { xs: 120, sm: 150 }
            }}>
              <PatientImage 
                patientId={session?.patientId} 
                responding={Boolean(patientResponse)}
                idle={!toneActive && !showResponseIndicator}
              />
              
              {/* Response notification */}
              {showResponseIndicator && (
                <Fade in={true}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      padding: { xs: 1, sm: 2 },
                      borderRadius: 2,
                      backgroundColor: patientResponse ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                      color: 'white',
                      fontWeight: 'bold',
                      zIndex: 10,
                      boxShadow: 3,
                      fontSize: { xs: '0.8rem', sm: '1rem' }
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
                    >
                      {patientResponse ? "Patient Response Detected!" : "No Response Detected"}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>

            {/* Controls section */}
            <Box sx={{ 
                p: { xs: 1, sm: 2 }, 
                borderRadius: 2, 
                border: '1px solid #e0e0e0',
                flexShrink: 0
              }}>
                {/* Frequency and level info */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: { xs: 1, sm: 3 },
                    mb: 1 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ mr: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Frequency: {formatFrequency(currentStep?.frequency || 0)}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          disabled={!currentStep || toneActive} 
                          onClick={handleSkipStep}
                          sx={{ p: 0.5 }}
                          aria-label="Next frequency"
                        >
                          <ArrowUpward />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="secondary" 
                          disabled={!currentStep || toneActive || !session || session.currentStep === 0} 
                          onClick={handlePreviousStep}
                          sx={{ p: 0.5 }}
                          aria-label="Previous frequency"
                        >
                          <ArrowDownward />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}>
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                      Level: {currentStep?.currentLevel || 0} dB HL
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: { xs: 1, sm: 2 },
                    mt: 1
                  }}>
                    <Tooltip title="Decrease by 10 dB (descending phase)">
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          disabled={!currentStep || toneActive}
                          onClick={() => handleAdjustLevel(-10)}
                          startIcon={<ArrowDownward />}
                          fullWidth={true}
                        >
                          -10 dB
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Increase by 5 dB (ascending phase)">
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          disabled={!currentStep || toneActive}
                          onClick={() => handleAdjustLevel(5)}
                          startIcon={<ArrowUpward />}
                          fullWidth={true}
                        >
                          +5 dB
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title="Increase by 10 dB (initial phase)">
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          disabled={!currentStep || toneActive}
                          onClick={() => handleAdjustLevel(10)}
                          startIcon={<ArrowUpward />}
                          fullWidth={true}
                        >
                          +10 dB
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Present tone button */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    disabled={!currentStep}
                    onMouseDown={startTone}
                    onMouseUp={stopTone}
                    onMouseLeave={() => toneActive && stopTone()}
                    onTouchStart={startTone}
                    onTouchEnd={() => toneActive && stopTone()}
                    startIcon={<VolumeUp />}
                    fullWidth
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 2,
                      backgroundColor: toneActive ? 'success.main' : 'primary.main',
                      '&:hover': {
                        backgroundColor: toneActive ? 'success.dark' : 'primary.dark',
                      }
                    }}
                  >
                    Present Tone
                  </Button>
                </Box>
                
                {/* Store threshold and skip buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    disabled={!currentStep || toneActive || !canStoreThreshold()}
                    onClick={handleStoreThreshold}
                    startIcon={<Check />}
                    fullWidth
                  >
                    Store Threshold
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>

        {/* Trainer guidance panel (when trainer mode is active) - Moved below the main content */}
        {trainerMode && (
          <Grid item xs={12}>
            <GuidancePanel
              guidance={currentGuidance}
              action={suggestedAction}
              phase={procedurePhase}
              onStoreThreshold={handleStoreThreshold}
              canStoreThreshold={canStoreThreshold()}
              patientResponded={patientJustResponded}
              onImplementSuggestion={handleSuggestedAction}
              showResponseAlert={showResponseIndicator && Boolean(patientResponse)}
            />
          </Grid>
        )}
      </Grid>

      {errorMessage && (
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
          <Alert onClose={() => setErrorMessage('')} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default TestingInterface;