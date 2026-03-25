/**
 * Integration tests for ProgressService + TestingService interaction
 *
 * Tests the workflow of completing a test session via TestingService
 * and recording the results in ProgressService.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProgressRecord } from '../ProgressService';

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
  length: 0,
  key: vi.fn(() => null),
};

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

// Mock AudioService to avoid Web Audio API in tests
vi.mock('../AudioService', () => ({
  default: {
    playTone: vi.fn(),
    stopTone: vi.fn(),
    playMaskingNoise: vi.fn(),
    stopMaskingNoise: vi.fn(),
    dispose: vi.fn(),
  },
}));

// Now import services after mocks are set up
import ProgressService from '../ProgressService';
import PatientService from '../PatientService';
import TestingService from '../TestingService';

describe('ProgressService + TestingService Integration', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should save a test session result as a progress record', () => {
    const patient = PatientService.getAllPatients()[0];
    expect(patient).toBeDefined();

    // Create a progress record as it would be created after completing a test
    const record: ProgressRecord = {
      sessionId: 'test-session-1',
      patientId: patient.id,
      patientName: patient.name,
      hearingLossType: patient.hearingLossType,
      difficulty: patient.difficulty,
      date: new Date().toISOString(),
      accuracy: 85,
      within5dB: 85,
      within10dB: 92,
      accuracyByEar: { right: 88, left: 82 },
      accuracyByType: { air: 86, bone: 84 },
      timeSpent: 300,
      totalFrequenciesTested: 16,
      technicalErrors: [],
    };

    ProgressService.saveSession(record);

    const history = ProgressService.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].patientId).toBe(patient.id);
    expect(history[0].accuracy).toBe(85);
  });

  it('should track progress across multiple patients of different types', () => {
    const patients = PatientService.getAllPatients();

    // Simulate sessions with different patient types
    const types = new Set<string>();
    const records: ProgressRecord[] = [];

    for (let i = 0; i < Math.min(5, patients.length); i++) {
      const patient = patients[i];
      types.add(patient.hearingLossType);

      const record: ProgressRecord = {
        sessionId: `session-${i}`,
        patientId: patient.id,
        patientName: patient.name,
        hearingLossType: patient.hearingLossType,
        difficulty: patient.difficulty,
        date: new Date(Date.now() - (4 - i) * 86400000).toISOString(),
        accuracy: 70 + i * 5,
        within5dB: 70 + i * 5,
        within10dB: 80 + i * 3,
        timeSpent: 200 + i * 30,
        totalFrequenciesTested: 16,
        technicalErrors: i === 0 ? ['Starting level too high'] : [],
      };
      records.push(record);
      ProgressService.saveSession(record);
    }

    // Verify aggregate stats
    expect(ProgressService.getTotalSessions()).toBe(records.length);
    expect(ProgressService.getAverageAccuracy()).toBeGreaterThan(0);

    // Verify breakdown by hearing loss type
    const byType = ProgressService.getAccuracyByHearingLossType();
    for (const type of types) {
      expect(byType[type]).toBeDefined();
      expect(byType[type].count).toBeGreaterThan(0);
      expect(byType[type].avgAccuracy).toBeGreaterThan(0);
    }
  });

  it('should show improvement trend in chronological order', () => {
    const patient = PatientService.getAllPatients()[0];

    // Save sessions with improving accuracy
    const accuracies = [60, 65, 70, 75, 80, 85];
    for (let i = 0; i < accuracies.length; i++) {
      ProgressService.saveSession({
        sessionId: `trend-${i}`,
        patientId: patient.id,
        patientName: patient.name,
        hearingLossType: patient.hearingLossType,
        difficulty: patient.difficulty,
        date: new Date(Date.now() - (accuracies.length - 1 - i) * 86400000).toISOString(),
        accuracy: accuracies[i],
        within5dB: accuracies[i],
        within10dB: accuracies[i] + 10,
        timeSpent: 300,
        totalFrequenciesTested: 16,
        technicalErrors: [],
      });
    }

    const trend = ProgressService.getImprovementTrend();
    expect(trend).toHaveLength(accuracies.length);
    // Should be in chronological order (oldest first)
    for (let i = 1; i < trend.length; i++) {
      expect(trend[i]).toBeGreaterThanOrEqual(trend[i - 1]);
    }
  });

  it('should correctly calculate total time spent across sessions', () => {
    const patients = PatientService.getAllPatients();

    const times = [120, 240, 360];
    for (let i = 0; i < times.length; i++) {
      ProgressService.saveSession({
        sessionId: `time-${i}`,
        patientId: patients[i % patients.length].id,
        patientName: patients[i % patients.length].name,
        hearingLossType: patients[i % patients.length].hearingLossType,
        difficulty: patients[i % patients.length].difficulty,
        date: new Date().toISOString(),
        accuracy: 80,
        within5dB: 80,
        within10dB: 90,
        timeSpent: times[i],
        totalFrequenciesTested: 16,
        technicalErrors: [],
      });
    }

    expect(ProgressService.getTotalTimeSpent()).toBe(720);
  });

  it('should verify all patients from PatientService have valid hearing loss types', () => {
    const patients = PatientService.getAllPatients();
    const validTypes = ['normal', 'conductive', 'sensorineural', 'mixed', 'asymmetrical', 'noise-induced', 'presbycusis'];

    for (const patient of patients) {
      expect(validTypes).toContain(patient.hearingLossType);
    }
  });

  it('should handle recording results from TestingService session structure', () => {
    const patient = PatientService.getAllPatients()[0];

    // Start a test session via TestingService
    TestingService.startSession(patient, {
      includeAirConduction: true,
      includeBoneConduction: true,
    });

    const session = TestingService.getCurrentSession();
    expect(session).toBeDefined();

    // Simulate creating a progress record from a completed session
    if (session) {
      const record: ProgressRecord = {
        sessionId: session.id,
        patientId: session.patientId,
        patientName: patient.name,
        hearingLossType: patient.hearingLossType,
        difficulty: patient.difficulty,
        date: new Date().toISOString(),
        accuracy: 78,
        within5dB: 78,
        within10dB: 88,
        timeSpent: 250,
        totalFrequenciesTested: session.testSequence.filter(s => !s.isRetest).length,
        technicalErrors: [],
      };

      ProgressService.saveSession(record);
      expect(ProgressService.getTotalSessions()).toBe(1);
      expect(ProgressService.getHistory()[0].patientId).toBe(patient.id);
    }
  });

  it('should persist data across service re-reads', () => {
    const patient = PatientService.getAllPatients()[0];

    ProgressService.saveSession({
      sessionId: 'persist-test',
      patientId: patient.id,
      patientName: patient.name,
      hearingLossType: patient.hearingLossType,
      difficulty: patient.difficulty,
      date: new Date().toISOString(),
      accuracy: 90,
      within5dB: 90,
      within10dB: 95,
      timeSpent: 180,
      totalFrequenciesTested: 16,
      technicalErrors: [],
    });

    // Data should still be accessible (localStorage is shared)
    expect(ProgressService.getTotalSessions()).toBe(1);
    expect(ProgressService.getAverageAccuracy()).toBe(90);
  });

  it('should handle clearHistory and then new sessions correctly', () => {
    const patient = PatientService.getAllPatients()[0];

    // Add some sessions
    ProgressService.saveSession({
      sessionId: 'clear-1',
      patientId: patient.id,
      patientName: patient.name,
      hearingLossType: patient.hearingLossType,
      difficulty: patient.difficulty,
      date: new Date().toISOString(),
      accuracy: 75,
      within5dB: 75,
      within10dB: 85,
      timeSpent: 200,
      totalFrequenciesTested: 16,
      technicalErrors: [],
    });

    expect(ProgressService.getTotalSessions()).toBe(1);

    ProgressService.clearHistory();
    expect(ProgressService.getTotalSessions()).toBe(0);

    // Can add new sessions after clearing
    ProgressService.saveSession({
      sessionId: 'clear-2',
      patientId: patient.id,
      patientName: patient.name,
      hearingLossType: patient.hearingLossType,
      difficulty: patient.difficulty,
      date: new Date().toISOString(),
      accuracy: 95,
      within5dB: 95,
      within10dB: 100,
      timeSpent: 150,
      totalFrequenciesTested: 16,
      technicalErrors: [],
    });

    expect(ProgressService.getTotalSessions()).toBe(1);
    expect(ProgressService.getAverageAccuracy()).toBe(95);
  });
});
