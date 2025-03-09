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
  Snackbar,
  Tabs,
  Tab,
  Badge
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
  ArrowDownward,
  Person,
  MenuBook,
  ArrowBackIosNew,
  ArrowForwardIos
} from '@mui/icons-material';
import { TestSession, TestStep, HearingProfile, ThresholdPoint, HearingLevel, Frequency } from '../interfaces/AudioTypes';
import testingService from '../services/TestingService';
import audioService from '../services/AudioService';
import Audiogram from './Audiogram';
import PatientImage from './PatientImage';
import GuidancePanel from './GuidancePanel';
import { useTheme, alpha } from '@mui/material/styles';

interface TestingInterfaceProps {
  patient: HearingProfile;
  onComplete: (session: TestSession) => void;
  onCancel: () => void;
}

// Tab panel interface
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`testing-tabpanel-${index}`}
      aria-labelledby={`testing-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Function for tab accessibility props
function a11yProps(index: number) {
  return {
    id: `testing-tab-${index}`,
    'aria-controls': `testing-tabpanel-${index}`,
  };
}

const TestingInterface: React.FC<TestingInterfaceProps> = ({
  patient,
  onComplete,
  onCancel
}): React.ReactElement => {
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentStep, setCurrentStep] = useState<TestStep | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [patientResponse, setPatientResponse] = useState<boolean | null>(null);
  const [showResponseIndicator, setShowResponseIndicator] = useState(false);
  const [toneActive, setToneActive] = useState(false);
  const toneIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [trainerMode, setTrainerMode] = useState(true);
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
        [level: number]: { total: number; heard: number }
      }
    }
  }>({});

  // Add state for active tab
  const [activeTab, setActiveTab] = useState(0);

  const theme = useTheme();

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Add handlePatientResponse function
  const handlePatientResponse = () => {
    if (currentStep && toneActive) {
      setPatientResponse(true);
      updateTrainerState(true);
    }
  };

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

  // Add a helper function to preserve thresholds when retrieving updated session data
  const preserveThresholds = useCallback((updatedSession: TestSession): TestSession => {
    // Return early if there's no current session
    if (!session) return updatedSession;
    
    // Create a deep copy to avoid mutating the input
    const sessionCopy = JSON.parse(JSON.stringify(updatedSession)) as TestSession;
    
    // Find all steps with stored thresholds in the current session
    const thresholdSteps = session.testSequence.filter(
      step => step.completed && step.responseStatus === 'threshold'
    );
    
    console.log(`Preserving ${thresholdSteps.length} thresholds from current session:`, 
      thresholdSteps.map(s => `${s.frequency}Hz ${s.ear} ear at ${s.currentLevel}dB`).join(', '));
    
    // Update the new session with the stored thresholds
    if (thresholdSteps.length > 0) {
      thresholdSteps.forEach(storedStep => {
        // Find the matching step in the new session
        const matchingIndex = sessionCopy.testSequence.findIndex(
          step => step.frequency === storedStep.frequency && 
                 step.ear === storedStep.ear &&
                 step.testType === storedStep.testType
        );
        
        if (matchingIndex !== -1) {
          // Preserve the threshold data in the new session
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
      console.log('⏭️ handleSkipStep called - skipping to next frequency');
      
      // Reset trainer mode state for the next frequency
      if (trainerMode) {
        setProcedurePhase('initial');
        setLastResponseLevel(null);
        setSuggestedAction('present');
        setCurrentGuidance('Start testing at a comfortable level (30-40 dB).');
        console.log('Reset phase to: initial for next frequency');
      }
      
      // Use TestingService to skip to the next step
      const nextStep = testingService.skipCurrentStep();
      console.log('Next step from TestingService:', nextStep);
      
      if (nextStep) {
        // Get updated session from TestingService
        const updatedSession = testingService.getCurrentSession();
        
        if (updatedSession) {
          // Use our helper function to ensure thresholds are preserved
          const preservedSession = preserveThresholds(updatedSession);
          setSession(preservedSession);
          
          // Get the current step with any preserved data
          const currentStepIndex = preservedSession.currentStep;
          const currentStepData = preservedSession.testSequence[currentStepIndex];
          
          if (currentStepData) {
            // Make a deep copy to ensure we don't modify by reference
            const currentStepCopy = JSON.parse(JSON.stringify(currentStepData));
            setCurrentStep(currentStepCopy);
            console.log('Moving to next frequency:', currentStepCopy.frequency);
          } else {
            console.error('Current step data not found in updated session');
            setErrorMessage('Error navigating to next frequency.');
          }
        } else {
          console.error('Failed to get updated session from TestingService');
          setErrorMessage('Failed to update session data.');
        }
      } else {
        // No more steps, complete the session
        const finalSession = testingService.completeSession();
        if (finalSession) {
          // Set progress to 100% on completion
          setTestProgress(100);
          console.log('Test completed, progress set to 100%');
          
          // Make sure we're passing a session with preserved thresholds to onComplete
          const preservedFinalSession = preserveThresholds(finalSession);
          onComplete(preservedFinalSession);
        }
      }
    } catch (error) {
      console.error("Error skipping to next step:", error);
      setErrorMessage('Failed to go to next step. Please try again.');
    }
  }, [trainerMode, testingService, session, setSession, setCurrentStep, 
      setProcedurePhase, setLastResponseLevel, setSuggestedAction, 
      setCurrentGuidance, setErrorMessage, setTestProgress, onComplete, preserveThresholds]);

  // Modified handlePreviousStep to use preserveThresholds
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
        // Create a deep copy of the session to avoid mutating the original
        const updatedSession = JSON.parse(JSON.stringify(session));
        
        // Only go back if we're not already at the first step
        if (updatedSession.currentStep > 0) {
          updatedSession.currentStep -= 1;
          
          // Important: Get the previous step reference
          const previousStep = updatedSession.testSequence[updatedSession.currentStep];
          if (!previousStep) {
            console.error('Previous step not found in test sequence');
            setErrorMessage('Error navigating to previous frequency.');
            return;
          }
          
          console.log('📊 Going back to step:', updatedSession.currentStep, 'with frequency:', previousStep.frequency);
          
          // Use preserveThresholds to ensure consistent threshold data
          const preservedSession = preserveThresholds(updatedSession);
          setSession(preservedSession);
          
          // Get the fresh step data from the preserved session
          const currentStepIndex = preservedSession.currentStep;
          const currentStepData = preservedSession.testSequence[currentStepIndex];
          
          if (currentStepData) {
            // Make a deep copy to ensure we don't modify by reference
            const freshStep = JSON.parse(JSON.stringify(currentStepData));
            setCurrentStep(freshStep);
          } else {
            console.error('Current step data not found in preserved session');
            setErrorMessage('Error navigating to previous frequency.');
            return;
          }

          // CRITICAL FIX: Update the TestingService's internal state to match our navigation
          // This ensures that any audio played will use the correct frequency
          const currentSession = testingService.getCurrentSession();
          if (currentSession) {
            // Store the session in a variable first to avoid TypeScript null error
            currentSession.currentStep = preservedSession.currentStep;
            console.log(`🔄 Explicitly updated TestingService step to ${preservedSession.currentStep} with frequency ${currentStepData.frequency}Hz`);
          }
          
          console.log('Moving to previous frequency:', currentStepData.frequency);
        } else {
          console.log('Already at the first frequency, cannot go back further');
          setErrorMessage('Already at the first frequency.');
        }
      } else {
        console.error('No active session found');
        setErrorMessage('No active session. Please restart the test.');
      }
    } catch (error) {
      console.error("Error going to previous step:", error);
      setErrorMessage('Failed to go to previous step. Please try again.');
    }
  }, [session, trainerMode, setSession, setCurrentStep, setProcedurePhase, 
      setLastResponseLevel, setSuggestedAction, setCurrentGuidance, 
      setErrorMessage, testingService, preserveThresholds]);

  // Validate threshold according to Hughson-Westlake protocol
  const validateThreshold = useCallback((): { isValid: boolean; message: string } => {
    if (!currentStep) {
      return { isValid: false, message: 'No current test step available.' };
    }

    const frequency = currentStep.frequency;
    const ear = currentStep.ear;
    const currentLevel = currentStep.currentLevel;

    // Check if we have response data for this frequency/ear/level
    if (responseCounts && 
        responseCounts[frequency] && 
        responseCounts[frequency][ear] && 
        responseCounts[frequency][ear][currentLevel]) {
      
      // Get response data
      const heardCount = responseCounts[frequency][ear][currentLevel].heard;
      const totalCount = responseCounts[frequency][ear][currentLevel].total;
      
      // Hughson-Westlake requires at least 2 out of 3 responses at the same level
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
      
      // Find the specific test step for the current frequency and ear
      // FIXED: Don't require ID match which breaks when changing frequencies
      // Instead, just rely on matching frequency, ear and testType
      const stepIndex = updatedSession.testSequence.findIndex(
        step => step.frequency === currentStep.frequency && 
               step.ear === currentStep.ear &&
               step.testType === currentStep.testType
      );
      
      if (stepIndex === -1) {
        console.error('Could not find matching test step in session for frequency:', currentStep.frequency, 'ear:', currentStep.ear);
        setErrorMessage('Failed to store threshold: test step not found.');
        return;
      }
      
      const updatedStep = updatedSession.testSequence[stepIndex];
      
      // CRITICAL FIX: Make sure we explicitly set the responseStatus property
      // Mark the step as completed and set responseStatus to 'threshold'
      updatedStep.completed = true;
      
      // Some TypeScript versions might not recognize responseStatus as a valid property
      // Use explicit property assignment to ensure it's set
      updatedStep.responseStatus = 'threshold' as 'threshold' | 'no_response' | 'not_tested';
      
      // Also update the currentLevel to the validated threshold level
      updatedStep.currentLevel = validThresholdLevel as HearingLevel;
      
      // Add a debug log to check what we're storing
      console.log(`DEBUG: Storing threshold for step ${stepIndex}:`, {
        id: updatedStep.id,
        frequency: updatedStep.frequency,
        ear: updatedStep.ear,
        currentLevel: updatedStep.currentLevel,
        responseStatus: updatedStep.responseStatus
      });
      
      // Update our session state to reflect this change
      setSession(updatedSession);
      
      // Also update the currentStep to show it's completed with proper type validation
      if (currentStep) {
        const updatedCurrentStep: TestStep = {
          ...currentStep,
          completed: true,
          // Explicitly set the responseStatus with the correct type
          responseStatus: 'threshold' as 'threshold' | 'no_response' | 'not_tested',
          // Also update the currentLevel in the current step
          currentLevel: validThresholdLevel as HearingLevel
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
  }, [currentStep, session, responseCounts, validateThreshold, setErrorMessage, setSession, setCurrentStep, setCurrentGuidance, setProcedurePhase, setSuggestedAction, setResponseCounts]);

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
        
        // Initialize progress to 0
        setTestProgress(0);
        console.log('New test session started, progress initialized to 0%');
        
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

  // Add a function to display the current test type
  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case 'air':
        return <VolumeUp />;
      case 'bone':
        return <Hearing />;
      case 'masked_air':
        return <Badge badgeContent="M" color="primary"><VolumeUp /></Badge>;
      case 'masked_bone':
        return <Badge badgeContent="M" color="primary"><Hearing /></Badge>;
      default:
        return <HelpOutline />;
    }
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
  }, [currentStep, processAutomaticResponse, toneActive, simulatePatientResponse, patientResponse, procedurePhase]);

  // Add handleAdjustFrequency function - place this near the handleAdjustLevel function
  const handleAdjustFrequency = useCallback((direction: number) => {
    if (!currentStep) return;
    
    const availableFrequencies: Frequency[] = [250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    const currentFreq = currentStep.frequency;
    const currentIndex = availableFrequencies.indexOf(currentFreq);
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex + direction;
    
    // Ensure we stay within bounds
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= availableFrequencies.length) newIndex = availableFrequencies.length - 1;
    
    // Only update if the frequency would actually change
    if (newIndex !== currentIndex) {
      const newFrequency = availableFrequencies[newIndex];
      
      console.log(`Changing frequency from ${currentFreq}Hz to ${newFrequency}Hz`);
      
      // CRITICAL FIX: We need to find the appropriate step in the test sequence
      // that matches the target frequency and ear, then navigate to that step
      if (session) {
        // Find the step index for the target frequency and ear combination
        const targetStepIndex = session.testSequence.findIndex(
          step => step.frequency === newFrequency && 
                 step.ear === currentStep.ear &&
                 step.testType === currentStep.testType
        );
        
        if (targetStepIndex !== -1) {
          // Found a matching step in the sequence
          console.log(`Found matching step for ${newFrequency}Hz at index ${targetStepIndex}`);
          
          // Create a deep copy of the session to avoid mutating the original
          const updatedSession = JSON.parse(JSON.stringify(session));
          
          // Update the current step index in the session
          updatedSession.currentStep = targetStepIndex;
          
          // Get reference to the target step
          const targetStep = updatedSession.testSequence[targetStepIndex];
          
          console.log(`Navigating to step with ID ${targetStep.id}, frequency ${targetStep.frequency}Hz`);
          
          // Update session and current step states with fresh objects
          setSession(updatedSession);
          
          // Create a fresh copy of the target step to avoid reference issues
          const freshStep = JSON.parse(JSON.stringify(targetStep));
          setCurrentStep(freshStep);
          
          // CRITICAL: Also update the TestingService's internal state to match our navigation
          const currentSession = testingService.getCurrentSession();
          if (currentSession) {
            currentSession.currentStep = updatedSession.currentStep;
            console.log(`Explicitly updated TestingService step to ${updatedSession.currentStep} with frequency ${targetStep.frequency}Hz`);
          }
          
          // Reset UI state for the new frequency
          if (trainerMode) {
            // Check if this frequency has a stored threshold already
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
          console.error(`Could not find matching step for frequency ${newFrequency}Hz and ear ${currentStep.ear}`);
          setErrorMessage(`Could not navigate to frequency ${newFrequency}Hz. Please try a different frequency.`);
        }
      } else {
        // No session available - just update the local currentStep (fallback)
        setCurrentStep({
          ...currentStep,
          frequency: newFrequency
        });
      }
    }
  }, [currentStep, session, trainerMode, setSession, setProcedurePhase, setSuggestedAction, setCurrentGuidance]);

  // Add this function to handle audiogram position clicks
  const handleAudiogramClick = (frequency: number, level: number) => {
    if (!currentStep || toneActive) return;
    
    // Update the current step with the new frequency and level
    setCurrentStep({
      ...currentStep,
      frequency: frequency as Frequency, // Cast to Frequency type
      currentLevel: level as HearingLevel // Cast to HearingLevel type
    });
  };

  // Add the missing handleSuggestedAction function
  const handleSuggestedAction = useCallback(() => {
    if (!currentStep) return;
    
    console.log('Implementing suggested action:', suggestedAction);
    
    // Save current state before making any changes to ensure thresholds are preserved
    const originalSession = session ? JSON.parse(JSON.stringify(session)) : null;
    
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
          // Call handleStoreThreshold which already handles setting the procedure phase
          // and other state updates correctly
          handleStoreThreshold();
          console.log('Stored threshold using suggested action');
        } else {
          // Show error for invalid threshold
          setErrorMessage(message);
          setCurrentGuidance(message + ' Continue testing to establish a valid threshold.');
        }
        break;
      case 'next':
        // First make sure we've stored all thresholds correctly
        if (procedurePhase === 'complete' && session) {
          // If we're in complete phase, check that the current step is properly marked as completed
          const { isValid } = validateThreshold();
          if (isValid && currentStep && !currentStep.completed) {
            console.log('Current step has valid threshold but is not marked completed - calling handleStoreThreshold');
            handleStoreThreshold();
          }
        }
        
        // Now handle moving to the next step while preserving thresholds
        handleSkipStep();
        // Reset to initial phase for the next frequency
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
    
    // For any action, ensure we preserve thresholds if the session has changed
    if (originalSession && session && JSON.stringify(originalSession) !== JSON.stringify(session)) {
      console.log('Session changed after action, ensuring thresholds are preserved...');
      // Use preserveThresholds to maintain threshold consistency
      const preservedSession = preserveThresholds(session);
      if (JSON.stringify(preservedSession) !== JSON.stringify(session)) {
        console.log('Updating session with preserved thresholds');
        setSession(preservedSession);
      }
    }
  }, [suggestedAction, procedurePhase, currentStep, handleAdjustLevel, handleStoreThreshold, 
      handleSkipStep, validateThreshold, setCurrentGuidance, setErrorMessage, setProcedurePhase, 
      session, preserveThresholds, setSession]);

  // Add thresholds definition before handleAdjustFrequency
  // Memoize the thresholds calculation to prevent infinite re-renders
  const thresholds = useMemo((): ThresholdPoint[] => {
    if (!session) return [];
    
    // Filter steps with completed=true and responseStatus=threshold
    const completedSteps = session.testSequence.filter(
      step => step.completed && step.responseStatus === 'threshold'
    );
    
    // Create a map to ensure we track unique thresholds per frequency/ear combination
    const uniqueThresholds = new Map<string, ThresholdPoint>();
    
    // Process all completed steps with threshold status
    completedSteps.forEach(step => {
      // Create a unique key for this frequency/ear/testType combination
      const key = `${step.frequency}-${step.ear}-${step.testType}`;
      
      // Create the threshold point
      const thresholdPoint: ThresholdPoint = {
        frequency: step.frequency,
        hearingLevel: step.currentLevel,
        ear: step.ear,
        testType: step.testType,
        responseStatus: 'threshold'
      };
      
      // Store it in our map, which ensures we only have one threshold per frequency/ear/testType
      uniqueThresholds.set(key, thresholdPoint);
    });
    
    // Convert the map values back to an array
    return Array.from(uniqueThresholds.values());
  }, [session]);

  // Update test progress when current step changes
  useEffect(() => {
    if (session) {
      // Calculate and update the progress percentage
      const progress = testingService.calculateProgress();
      setTestProgress(progress);
      console.log(`Test progress updated: ${progress}%`);
    }
  }, [session, currentStep, testingService]);

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

  // Modify render section with the new structure
  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {/* Test progress */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">
                {currentStep ? 
                  `Testing ${currentStep.ear} ear at ${currentStep.frequency} Hz (${
                    currentStep.testType === 'air' ? 'Air Conduction' : 
                    currentStep.testType === 'bone' ? 'Bone Conduction' : 
                    currentStep.testType === 'masked_air' ? 'Masked Air' : 
                    currentStep.testType === 'masked_bone' ? 'Masked Bone' : 
                    currentStep.testType
                  })` : 
                  'Ready to start'}
              </Typography>
              <Chip 
                label={`${testProgress}%`} 
                color="primary" 
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={testProgress} 
              sx={{ height: 10, borderRadius: 5 }} 
            />
          </Box>
        </Grid>

        {/* Audiogram - now at the top below the test progress */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ 
              height: { xs: 320, sm: 380, md: 450 },
              width: '100%',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Audiogram 
                thresholds={thresholds} 
                currentFrequency={currentStep?.frequency} 
                currentLevel={currentStep?.currentLevel} 
                toneActive={Boolean(toneActive)}
                onPositionClick={handleAudiogramClick}
                interactive={!!currentStep && !toneActive}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Tabbed interface below the audiogram */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 0, mb: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="testing interface tabs"
                variant="fullWidth"
                sx={{ 
                  '& .MuiTab-root': { 
                    minHeight: '39px', // 65% of 60px
                    fontSize: { xs: '0.52rem', sm: '0.585rem' }, // 65% of current values
                    padding: { xs: 0.65, sm: 1.3 } // 65% of current values, using 'padding' instead of 'p'
                  }
                }}
              >
                <Tab 
                  icon={<VolumeUp />} 
                  label="Testing" 
                  {...a11yProps(0)} 
                />
                <Tab 
                  icon={
                    <Badge 
                      color="success" 
                      variant="dot" 
                      invisible={!patientResponse}
                    >
                      <Person />
                    </Badge>
                  } 
                  label="Patient Response" 
                  {...a11yProps(1)} 
                />
                {trainerMode && (
                  <Tab 
                    icon={<MenuBook />} 
                    label="Training Guide" 
                    {...a11yProps(2)} 
                  />
                )}
              </Tabs>
            </Box>

            {/* Testing Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {/* Current level display */}
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography variant="body1" gutterBottom>
                    Current Level:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <Tooltip title="Decrease by 10 dB (descending phase)">
                      <IconButton 
                        color="secondary"
                        disabled={!currentStep || toneActive}
                        onClick={() => handleAdjustLevel(-10)}
                        size="medium"
                      >
                        <ArrowDownward />
                      </IconButton>
                    </Tooltip>
                    
                    <Chip
                      label={`${currentStep ? currentStep.currentLevel : '--'} dB HL`}
                      color="primary"
                      sx={{
                        fontSize: '0.9rem',  // 35% of original size (was 1.5rem)
                        height: 'auto',
                        p: 0.7,  // 35% of original padding (was 2)
                        mx: 1
                      }}
                    />
                    
                    <Box>
                      <Tooltip title="Increase by 5 dB (ascending phase)">
                        <IconButton 
                          color="primary"
                          disabled={!currentStep || toneActive}
                          onClick={() => handleAdjustLevel(5)}
                          size="small"
                        >
                          <ArrowUpward />
                        </IconButton>
                      </Tooltip>
                      
                    </Box>
                  </Box>

                  {/* Frequency adjustment buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    ml: 2
                  }}>
                    <Typography variant="body2" color="textSecondary">
                      Frequency
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="Decrease frequency">
                        <IconButton 
                          color="secondary"
                          disabled={!currentStep || toneActive}
                          onClick={() => handleAdjustFrequency(-1)}
                          size="small"
                        >
                          <ArrowBackIosNew fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Increase frequency">
                        <IconButton 
                          color="secondary"
                          disabled={!currentStep || toneActive}
                          onClick={() => handleAdjustFrequency(1)}
                          size="small"
                        >
                          <ArrowForwardIos fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
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
                
                {/* Store threshold button */}
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
            </TabPanel>

            {/* Patient Response Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                {/* Patient information in this tab */}
                <Box sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  gap: 2 
                }}>
                  <PatientImage 
                    patientId={patient.id}
                    responding={Boolean(patientResponse)}
                    idle={!toneActive && !showResponseIndicator}
                  />
                  <Box sx={{ 
                    mt: { xs: 2, sm: 0 },
                    textAlign: { xs: 'center', sm: 'left' } 
                  }}>
                    <Typography variant="h6">{patient.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {patient.description}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {/* Patient response UI */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: patientResponse ? 'success.light' : 'background.paper',
                  transition: 'background-color 0.3s'
                }}>
                  <Typography variant="h6">
                    {patientResponse 
                      ? 'Patient has responded! 👍' 
                      : 'Waiting for patient response...'}
                  </Typography>
                  
                  <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      color={patientResponse ? 'success' : 'primary'}
                      size="large"
                      disabled={!currentStep || !toneActive}
                      onClick={handlePatientResponse}
                      startIcon={<Check />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Patient Heard Tone
                    </Button>
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            {/* Trainer Guide Tab */}
            {trainerMode && (
              <TabPanel value={activeTab} index={2}>
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
              </TabPanel>
            )}
          </Paper>
        </Grid>

        {/* Back button at the bottom */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Tooltip title="Go back">
            <IconButton
              onClick={onCancel}
              color="primary"
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.action.active, 0.1)
                  : 'rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.action.active, 0.2)
                    : 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <KeyboardTab sx={{ transform: 'rotate(180deg)' }} />
            </IconButton>
          </Tooltip>
        </Grid>
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
