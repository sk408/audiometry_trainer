/**
 * useREMSession — Custom hook encapsulating all REM session state and business logic.
 *
 * The orchestrator page uses this hook to own all state, then passes slices
 * of that state to child components via props.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { SelectChangeEvent } from '@mui/material';

import remService from '../../services/RealEarMeasurementService';
import patientService from '../../services/PatientService';
import progressService from '../../services/ProgressService';
import {
  REMType,
  REMFrequency,
  REMSignalType,
  REMLevel,
  ProbePosition,
  REMCurve,
  REMTarget,
  VirtualHearingAid,
  REMSession,
  VentType,
} from '../../interfaces/RealEarMeasurementTypes';

export function useREMSession() {
  // Session state
  const [session, setSession] = useState<REMSession | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Measurement parameters
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedHearingAid, setSelectedHearingAid] = useState('');
  const [hearingAids, setHearingAids] = useState<VirtualHearingAid[]>([]);
  const [selectedEar, setSelectedEar] = useState<'left' | 'right'>('right');
  const [probeTubeDepth, setProbeTubeDepth] = useState(15);
  const [probePosition, setProbePosition] = useState<ProbePosition>(ProbePosition.NOT_INSERTED);
  const [signalType, setSignalType] = useState<REMSignalType>('pure_tone_sweep');
  const [inputLevel, setInputLevel] = useState<REMLevel>(65);
  const [currentMeasurement, setCurrentMeasurement] = useState<REMCurve | null>(null);
  const [allMeasurements, setAllMeasurements] = useState<REMCurve[]>([]);
  const [currentTarget, setCurrentTarget] = useState<REMTarget | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [measurementType, setMeasurementType] = useState<REMType>('REUR');
  const [prescriptionMethod, setPrescriptionMethod] = useState<'NAL-NL2' | 'DSL' | 'NAL-NL1' | 'custom'>('NAL-NL2');
  const [selectedVentType, setSelectedVentType] = useState<VentType>(VentType.OCCLUDED);

  // Patients
  const [patients, setPatients] = useState<Array<{ id: string; name: string; age: number; hearingLoss: string }>>([]);

  // Session timing
  const sessionStartTimeRef = useRef<number>(Date.now());

  // Adjustable REAR
  const [adjustedREAR, setAdjustedREAR] = useState<REMCurve | null>(null);
  const [matchAccuracy, setMatchAccuracy] = useState<number | null>(null);
  const [adjustmentFeedback, setAdjustmentFeedback] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setHearingAids(remService.getHearingAids());
    const all = patientService.getAllPatients();
    setPatients(all.map(p => ({ id: p.id, name: p.name, age: p.age || 0, hearingLoss: p.hearingLossType })));
  }, []);

  useEffect(() => {
    if (activeStep === 2) setMeasurementType('REUR');
    else if (activeStep === 3) setMeasurementType('REOR');
    else if (activeStep === 4) setMeasurementType('REAR');
    else if (activeStep === 5) setMeasurementType('REIG');
    else if (activeStep === 7) {
      setMatchAccuracy(null);
      setAdjustmentFeedback(null);
      const rear = allMeasurements.find(m => m.type === 'REAR');
      if (rear) {
        setAdjustedREAR({
          ...rear, type: 'REAR', timestamp: new Date().toISOString(),
          measurementPoints: rear.measurementPoints.map(p => ({ ...p })),
        });
      }
    }
  }, [activeStep, allMeasurements]);

  useEffect(() => {
    if (measurementType === 'REOR') {
      setSession(prev => {
        if (!prev || prev.ventType === selectedVentType) return prev;
        return { ...prev, ventType: selectedVentType };
      });
    }
  }, [selectedVentType, measurementType]);

  // ---------------------------------------------------------------------------
  // Callbacks
  // ---------------------------------------------------------------------------

  const startNewSession = useCallback(() => {
    if (selectedPatient && selectedHearingAid) {
      const newSession = remService.createSession(selectedPatient, selectedHearingAid);
      setSession(newSession);
      setActiveStep(0);
      setError(null); setSuccess(null);
      setProbePosition(ProbePosition.NOT_INSERTED);
      setCurrentMeasurement(null); setCurrentTarget(null);
      setAllMeasurements([]); setAdjustedREAR(null);
      setMatchAccuracy(null); setAdjustmentFeedback(null);
      sessionStartTimeRef.current = Date.now();
      setSuccess('Session initialized. Proceed to position the probe tube.');
    } else {
      setError('Please select a patient and hearing aid to continue');
    }
  }, [selectedPatient, selectedHearingAid]);

  const handlePositionProbeTube = useCallback(() => {
    try {
      const position = remService.positionProbeTube(probeTubeDepth);
      setProbePosition(position);
      if (position === ProbePosition.CORRECT) { setSuccess('Probe tube correctly positioned'); setError(null); }
      else if (position === ProbePosition.TOO_SHALLOW) { setError('Probe tube is too shallow - adjust depth'); setSuccess(null); }
      else if (position === ProbePosition.TOO_DEEP) { setError('Probe tube is too deep - adjust depth'); setSuccess(null); }
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred'); setSuccess(null); }
  }, [probeTubeDepth]);

  const performMeasurement = useCallback(async () => {
    if (!session) return;
    setIsLoading(true); setError(null);
    try {
      if (measurementType === 'REOR') setSession(prev => prev ? { ...prev, ventType: selectedVentType } : prev);
      const measurement = await remService.performMeasurement(measurementType, selectedEar, signalType, inputLevel);
      setSession(prev => {
        if (!prev) return prev;
        const updated = [...prev.measurements.filter(m => m.type !== measurementType), measurement];
        setAllMeasurements(updated); setCurrentMeasurement(measurement);
        return { ...prev, measurements: updated, currentStep: measurementType };
      });
      setSuccess(`${measurementType} measurement completed successfully`);
      if (activeStep >= 2 && activeStep <= 4) {
        setActiveStep(activeStep + 1);
        if (activeStep === 2) setMeasurementType('REOR');
        else if (activeStep === 3) setMeasurementType('REAR');
        else if (activeStep === 4) setMeasurementType('REIG');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during measurement');
    } finally { setIsLoading(false); }
  }, [session, measurementType, selectedEar, signalType, inputLevel, activeStep, selectedVentType]);

  const generateTargets = useCallback(() => {
    if (!selectedPatient) return;
    try {
      const targets = remService.generateTargets(selectedPatient, prescriptionMethod, selectedEar);
      if (targets.length > 0) {
        const match = targets.find(t => t.type === measurementType);
        setCurrentTarget(match || targets[0]);
        setSuccess(`Generated ${prescriptionMethod} targets${match ? ` for ${measurementType}` : ''}`);
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'An unknown error occurred'); }
  }, [selectedPatient, prescriptionMethod, selectedEar, measurementType]);

  const playTestSignal = useCallback(() => { remService.playTestSignal(signalType, inputLevel, selectedEar); setIsPlaying(true); }, [signalType, inputLevel, selectedEar]);
  const stopTestSignal = useCallback(() => { remService.stopTestSignal(); setIsPlaying(false); }, []);

  const initializeAdjustableREAR = useCallback(() => {
    const rear = allMeasurements.find(m => m.type === 'REAR');
    if (rear) {
      const adj: REMCurve = { ...rear, type: 'REAR', timestamp: new Date().toISOString(), measurementPoints: rear.measurementPoints.map(p => ({ ...p })) };
      setAdjustedREAR(adj);
      return adj;
    }
    return null;
  }, [allMeasurements]);

  const adjustGainAtFrequency = useCallback((frequency: REMFrequency, adjustment: number) => {
    setAdjustedREAR(prev => {
      if (!prev) return prev;
      return {
        ...prev, timestamp: new Date().toISOString(),
        measurementPoints: prev.measurementPoints.map(pt =>
          pt.frequency === frequency ? { ...pt, gain: Math.max(0, Math.min(80, pt.gain + adjustment)) } : pt
        ),
      };
    });
  }, []);

  const checkTargetMatch = useCallback(() => {
    if (!adjustedREAR || !session) return;
    const reigTarget = session.targets.find(t => t.type === 'REIG');
    const targetToCompare = reigTarget || currentTarget;
    if (!targetToCompare) return;
    const accuracy = remService.calculateAccuracy(adjustedREAR, targetToCompare);
    setMatchAccuracy(accuracy);
    if (accuracy >= 90) { setAdjustmentFeedback('Excellent match! The adjustments are within clinical standards.'); setSuccess('Target match successful!'); }
    else if (accuracy >= 80) setAdjustmentFeedback('Good match, but some frequencies could be adjusted further for optimal results.');
    else if (accuracy >= 70) setAdjustmentFeedback('Acceptable match, but consider further adjustments, especially in the speech frequencies (1000-4000 Hz).');
    else setAdjustmentFeedback('Poor match to target. Significant adjustments are needed across multiple frequencies.');
  }, [adjustedREAR, session, currentTarget]);

  const resetAdjustments = useCallback(() => { initializeAdjustableREAR(); setMatchAccuracy(null); setAdjustmentFeedback(null); }, [initializeAdjustableREAR]);

  const completeSession = useCallback(() => {
    setSuccess('REM procedure completed successfully!');
    const capturedREAR = adjustedREAR;
    const capturedAccuracy = matchAccuracy;
    setSession(prev => {
      if (!prev) return prev;
      const updated = [...prev.measurements.filter(m => m.type !== 'REAR')];
      if (capturedREAR) { updated.push(capturedREAR); setAllMeasurements(updated); }
      const patient = patientService.getPatientById(prev.patientId);
      const timeSpent = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
      progressService.saveREMSession({
        sessionId: prev.id, patientId: prev.patientId,
        patientName: patient?.name || 'Unknown', prescriptionMethod,
        fitQuality: capturedAccuracy || 0, date: new Date().toISOString(), timeSpent,
      });
      return { ...prev, completed: true, measurements: updated, accuracy: capturedAccuracy || 0 };
    });
  }, [adjustedREAR, matchAccuracy, prescriptionMethod]);

  // Simple change handlers
  const handlePatientChange = (e: SelectChangeEvent) => setSelectedPatient(e.target.value);
  const handleHearingAidChange = (e: SelectChangeEvent) => setSelectedHearingAid(e.target.value);
  const handleEarChange = (e: SelectChangeEvent) => setSelectedEar(e.target.value as 'left' | 'right');
  const handleSignalTypeChange = (e: SelectChangeEvent) => setSignalType(e.target.value as REMSignalType);
  const handleMeasurementTypeChange = (e: SelectChangeEvent) => setMeasurementType(e.target.value as REMType);
  const handleInputLevelChange = (_event: Event, newValue: number | number[]) => setInputLevel(newValue as REMLevel);
  const handlePrescriptionMethodChange = (e: SelectChangeEvent) => setPrescriptionMethod(e.target.value as 'NAL-NL2' | 'DSL' | 'NAL-NL1' | 'custom');
  const handleVentTypeChange = (e: SelectChangeEvent) => setSelectedVentType(e.target.value as VentType);

  return {
    // State
    session, activeStep, setActiveStep, isLoading, error, success,
    selectedPatient, selectedHearingAid, hearingAids,
    selectedEar, probeTubeDepth, setProbeTubeDepth, probePosition,
    signalType, inputLevel, allMeasurements, currentTarget,
    isPlaying, measurementType, prescriptionMethod, selectedVentType,
    patients, adjustedREAR, matchAccuracy, adjustmentFeedback,
    isSmallScreen: false, // placeholder — caller should provide
    // Callbacks
    startNewSession, handlePositionProbeTube, performMeasurement,
    generateTargets, playTestSignal, stopTestSignal,
    adjustGainAtFrequency, checkTargetMatch, resetAdjustments, completeSession,
    // Change handlers
    handlePatientChange, handleHearingAidChange, handleEarChange,
    handleSignalTypeChange, handleMeasurementTypeChange,
    handleInputLevelChange, handlePrescriptionMethodChange, handleVentTypeChange,
  };
}
