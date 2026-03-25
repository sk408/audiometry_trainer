import { useState, useCallback, useMemo } from 'react';
import progressService, { ProgressRecord } from '../services/ProgressService';
import { PatientProgress, OverallProgress, CompletionStatus } from '../types/ProgressTypes';

/** Accuracy threshold (within ±5 dB) to consider a patient "completed". */
const COMPLETION_ACCURACY_THRESHOLD = 60;

/**
 * React hook wrapping ProgressService for use in components.
 *
 * Provides per-patient progress summaries, overall statistics,
 * and methods to save new sessions and refresh data.
 */
export function useProgress() {
  const [records, setRecords] = useState<ProgressRecord[]>(() => progressService.getHistory());

  /** Reload records from localStorage. */
  const refresh = useCallback(() => {
    setRecords(progressService.getHistory());
  }, []);

  /** Save a session and refresh local state. */
  const saveSession = useCallback((record: ProgressRecord) => {
    progressService.saveSession(record);
    refresh();
  }, [refresh]);

  /** Per-patient progress map. */
  const patientProgressMap = useMemo((): Map<string, PatientProgress> => {
    const map = new Map<string, PatientProgress>();

    for (const record of records) {
      const existing = map.get(record.patientId);
      if (existing) {
        existing.sessionsCompleted += 1;
        existing.bestAccuracy = Math.max(existing.bestAccuracy, record.accuracy);
        existing.totalTimeSpent += record.timeSpent;
        // Keep most recent date
        if (!existing.lastTestedDate || record.date > existing.lastTestedDate) {
          existing.lastTestedDate = record.date;
        }
        // Recompute average
        const totalAccuracy = records
          .filter(r => r.patientId === record.patientId)
          .reduce((sum, r) => sum + r.accuracy, 0);
        existing.averageAccuracy = Math.round(totalAccuracy / existing.sessionsCompleted);
      } else {
        map.set(record.patientId, {
          patientId: record.patientId,
          sessionsCompleted: 1,
          bestAccuracy: record.accuracy,
          averageAccuracy: record.accuracy,
          totalTimeSpent: record.timeSpent,
          lastTestedDate: record.date,
          completionStatus: 'in_progress',
        });
      }
    }

    // Determine completion status
    for (const progress of map.values()) {
      progress.completionStatus = getCompletionStatus(progress);
    }

    return map;
  }, [records]);

  /** Get progress for a single patient. Returns undefined if not started. */
  const getPatientProgress = useCallback(
    (patientId: string): PatientProgress | undefined => {
      return patientProgressMap.get(patientId);
    },
    [patientProgressMap]
  );

  /** Get completion status for a patient. */
  const getCompletionStatusForPatient = useCallback(
    (patientId: string): CompletionStatus => {
      const progress = patientProgressMap.get(patientId);
      if (!progress) return 'not_started';
      return progress.completionStatus;
    },
    [patientProgressMap]
  );

  /** Overall progress summary. */
  const overallProgress = useMemo((): OverallProgress => {
    const totalSessions = records.length;
    const totalTimeSpent = records.reduce((sum, r) => sum + r.timeSpent, 0);
    const averageAccuracy = totalSessions > 0
      ? Math.round(records.reduce((sum, r) => sum + r.accuracy, 0) / totalSessions)
      : 0;

    let patientsCompleted = 0;
    for (const progress of patientProgressMap.values()) {
      if (progress.completionStatus === 'completed') patientsCompleted++;
    }

    return {
      totalSessions,
      totalTimeSpent,
      averageAccuracy,
      improvementTrend: progressService.getImprovementTrend(),
      patientsStarted: patientProgressMap.size,
      patientsCompleted,
    };
  }, [records, patientProgressMap]);

  return {
    records,
    patientProgressMap,
    overallProgress,
    getPatientProgress,
    getCompletionStatusForPatient,
    saveSession,
    refresh,
    clearHistory: useCallback(() => {
      progressService.clearHistory();
      refresh();
    }, [refresh]),
  };
}

function getCompletionStatus(progress: PatientProgress): CompletionStatus {
  if (progress.bestAccuracy >= COMPLETION_ACCURACY_THRESHOLD) return 'completed';
  return 'in_progress';
}
