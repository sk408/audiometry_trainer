/**
 * Progress tracking type definitions for the Audiometry Trainer.
 *
 * These types define how student progress is stored in localStorage,
 * how per-patient statistics are aggregated, and how completion status
 * is represented in the UI.
 */

/** Completion status for a patient in the progress system. */
export type CompletionStatus = 'not_started' | 'in_progress' | 'completed';

/** Summary statistics for a single patient across all sessions. */
export interface PatientProgress {
  patientId: string;
  sessionsCompleted: number;
  bestAccuracy: number;
  averageAccuracy: number;
  totalTimeSpent: number; // seconds
  lastTestedDate: string | null; // ISO string
  completionStatus: CompletionStatus;
}

/** Overall progress statistics across all patients and sessions. */
export interface OverallProgress {
  totalSessions: number;
  totalTimeSpent: number; // seconds
  averageAccuracy: number;
  improvementTrend: number[]; // last 20 session accuracies
  patientsStarted: number;
  patientsCompleted: number;
}

/** Filter options for the patient list on PatientsPage. */
export interface PatientFilterOptions {
  difficulty: string;
  hearingLossType: string;
  completionStatus: string;
  sortBy: 'name' | 'difficulty' | 'accuracy' | 'recent';
}
