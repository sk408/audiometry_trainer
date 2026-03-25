import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ProgressRecord } from '../ProgressService';

// ---------------------------------------------------------------------------
// In-memory localStorage mock
// ---------------------------------------------------------------------------
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    _getStore: () => store,
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Import after mock is installed
import progressService from '../ProgressService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRecord(overrides: Partial<ProgressRecord> = {}): ProgressRecord {
  return {
    sessionId: overrides.sessionId ?? `session-${Math.random().toString(36).slice(2, 8)}`,
    patientId: overrides.patientId ?? 'patient1',
    patientName: overrides.patientName ?? 'Alex Johnson',
    hearingLossType: overrides.hearingLossType ?? 'normal',
    difficulty: overrides.difficulty ?? 'beginner',
    date: overrides.date ?? new Date().toISOString(),
    accuracy: overrides.accuracy ?? 75,
    within5dB: overrides.within5dB ?? 75,
    within10dB: overrides.within10dB ?? 90,
    accuracyByEar: overrides.accuracyByEar ?? { right: 80, left: 70 },
    accuracyByType: overrides.accuracyByType ?? { air: 78, bone: 72 },
    timeSpent: overrides.timeSpent ?? 300,
    totalFrequenciesTested: overrides.totalFrequenciesTested ?? 16,
    technicalErrors: overrides.technicalErrors ?? [],
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProgressService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  // =========================================================================
  // saveSession + retrieval
  // =========================================================================
  describe('saveSession', () => {
    it('stores a record that can be retrieved via getHistory', () => {
      const record = makeRecord({ sessionId: 'sess-1', accuracy: 82 });
      progressService.saveSession(record);

      const history = progressService.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].sessionId).toBe('sess-1');
      expect(history[0].accuracy).toBe(82);
    });

    it('appends multiple records without overwriting', () => {
      progressService.saveSession(makeRecord({ sessionId: 'a' }));
      progressService.saveSession(makeRecord({ sessionId: 'b' }));
      progressService.saveSession(makeRecord({ sessionId: 'c' }));

      expect(progressService.getTotalSessions()).toBe(3);
      const ids = progressService.getHistory().map((r) => r.sessionId);
      expect(ids).toContain('a');
      expect(ids).toContain('b');
      expect(ids).toContain('c');
    });
  });

  // =========================================================================
  // getHistory sorting
  // =========================================================================
  describe('getHistory', () => {
    it('returns records sorted by date descending (most recent first)', () => {
      progressService.saveSession(makeRecord({ sessionId: 'old', date: '2025-01-01T00:00:00Z' }));
      progressService.saveSession(makeRecord({ sessionId: 'mid', date: '2025-06-15T00:00:00Z' }));
      progressService.saveSession(makeRecord({ sessionId: 'new', date: '2026-01-01T00:00:00Z' }));

      const history = progressService.getHistory();
      expect(history[0].sessionId).toBe('new');
      expect(history[1].sessionId).toBe('mid');
      expect(history[2].sessionId).toBe('old');
    });

    it('returns empty array when no sessions exist', () => {
      expect(progressService.getHistory()).toEqual([]);
    });
  });

  // =========================================================================
  // getAverageAccuracy
  // =========================================================================
  describe('getAverageAccuracy', () => {
    it('computes the correct average across sessions', () => {
      progressService.saveSession(makeRecord({ accuracy: 60 }));
      progressService.saveSession(makeRecord({ accuracy: 80 }));
      progressService.saveSession(makeRecord({ accuracy: 100 }));

      expect(progressService.getAverageAccuracy()).toBe(80);
    });

    it('returns 0 when there are no sessions', () => {
      expect(progressService.getAverageAccuracy()).toBe(0);
    });

    it('handles a single session', () => {
      progressService.saveSession(makeRecord({ accuracy: 42 }));
      expect(progressService.getAverageAccuracy()).toBe(42);
    });
  });

  // =========================================================================
  // getAccuracyByHearingLossType
  // =========================================================================
  describe('getAccuracyByHearingLossType', () => {
    it('groups correctly by hearing loss type', () => {
      progressService.saveSession(makeRecord({ hearingLossType: 'normal', accuracy: 90 }));
      progressService.saveSession(makeRecord({ hearingLossType: 'normal', accuracy: 80 }));
      progressService.saveSession(makeRecord({ hearingLossType: 'conductive', accuracy: 70 }));
      progressService.saveSession(makeRecord({ hearingLossType: 'sensorineural', accuracy: 60 }));
      progressService.saveSession(makeRecord({ hearingLossType: 'sensorineural', accuracy: 50 }));
      progressService.saveSession(makeRecord({ hearingLossType: 'sensorineural', accuracy: 40 }));

      const byType = progressService.getAccuracyByHearingLossType();

      expect(byType['normal'].count).toBe(2);
      expect(byType['normal'].avgAccuracy).toBe(85);

      expect(byType['conductive'].count).toBe(1);
      expect(byType['conductive'].avgAccuracy).toBe(70);

      expect(byType['sensorineural'].count).toBe(3);
      expect(byType['sensorineural'].avgAccuracy).toBe(50);
    });

    it('returns empty object when there are no sessions', () => {
      expect(progressService.getAccuracyByHearingLossType()).toEqual({});
    });
  });

  // =========================================================================
  // getTotalSessions
  // =========================================================================
  describe('getTotalSessions', () => {
    it('returns correct count', () => {
      expect(progressService.getTotalSessions()).toBe(0);

      progressService.saveSession(makeRecord());
      expect(progressService.getTotalSessions()).toBe(1);

      progressService.saveSession(makeRecord());
      progressService.saveSession(makeRecord());
      expect(progressService.getTotalSessions()).toBe(3);
    });
  });

  // =========================================================================
  // getTotalTimeSpent
  // =========================================================================
  describe('getTotalTimeSpent', () => {
    it('sums timeSpent across all sessions', () => {
      progressService.saveSession(makeRecord({ timeSpent: 120 }));
      progressService.saveSession(makeRecord({ timeSpent: 180 }));
      progressService.saveSession(makeRecord({ timeSpent: 300 }));

      expect(progressService.getTotalTimeSpent()).toBe(600);
    });

    it('returns 0 when there are no sessions', () => {
      expect(progressService.getTotalTimeSpent()).toBe(0);
    });
  });

  // =========================================================================
  // getImprovementTrend
  // =========================================================================
  describe('getImprovementTrend', () => {
    it('returns last 20 session accuracies in chronological order', () => {
      // Insert 25 sessions with dates and distinct accuracies
      for (let i = 0; i < 25; i++) {
        const date = new Date(2025, 0, i + 1).toISOString();
        progressService.saveSession(makeRecord({ accuracy: i * 4, date }));
      }

      const trend = progressService.getImprovementTrend();
      expect(trend).toHaveLength(20);

      // Should be sessions 5..24 (the last 20), in chronological order
      for (let i = 0; i < 20; i++) {
        expect(trend[i]).toBe((i + 5) * 4);
      }
    });

    it('returns all sessions if fewer than 20 exist', () => {
      progressService.saveSession(makeRecord({ accuracy: 50, date: '2025-01-01T00:00:00Z' }));
      progressService.saveSession(makeRecord({ accuracy: 60, date: '2025-02-01T00:00:00Z' }));
      progressService.saveSession(makeRecord({ accuracy: 70, date: '2025-03-01T00:00:00Z' }));

      const trend = progressService.getImprovementTrend();
      expect(trend).toEqual([50, 60, 70]);
    });

    it('returns empty array when no sessions exist', () => {
      expect(progressService.getImprovementTrend()).toEqual([]);
    });
  });

  // =========================================================================
  // getRecentSessions
  // =========================================================================
  describe('getRecentSessions', () => {
    it('returns the N most recent sessions', () => {
      progressService.saveSession(makeRecord({ sessionId: 'oldest', date: '2025-01-01T00:00:00Z' }));
      progressService.saveSession(makeRecord({ sessionId: 'middle', date: '2025-06-01T00:00:00Z' }));
      progressService.saveSession(makeRecord({ sessionId: 'newest', date: '2026-01-01T00:00:00Z' }));

      const recent = progressService.getRecentSessions(2);
      expect(recent).toHaveLength(2);
      expect(recent[0].sessionId).toBe('newest');
      expect(recent[1].sessionId).toBe('middle');
    });

    it('returns all sessions when count exceeds total', () => {
      progressService.saveSession(makeRecord());
      progressService.saveSession(makeRecord());

      const recent = progressService.getRecentSessions(10);
      expect(recent).toHaveLength(2);
    });
  });

  // =========================================================================
  // clearHistory
  // =========================================================================
  describe('clearHistory', () => {
    it('removes all progress data', () => {
      progressService.saveSession(makeRecord());
      progressService.saveSession(makeRecord());
      expect(progressService.getTotalSessions()).toBe(2);

      progressService.clearHistory();

      expect(progressService.getTotalSessions()).toBe(0);
      expect(progressService.getHistory()).toEqual([]);
    });

    it('is safe to call when already empty', () => {
      progressService.clearHistory();
      expect(progressService.getTotalSessions()).toBe(0);
    });
  });

  // =========================================================================
  // Corrupted localStorage handling
  // =========================================================================
  describe('corrupted localStorage', () => {
    it('handles invalid JSON gracefully', () => {
      localStorage.setItem('audiometry_progress_data', 'not valid json {{{');

      expect(progressService.getHistory()).toEqual([]);
      expect(progressService.getTotalSessions()).toBe(0);
      expect(progressService.getAverageAccuracy()).toBe(0);
    });

    it('handles missing version field gracefully', () => {
      localStorage.setItem('audiometry_progress_data', JSON.stringify({ records: [] }));

      expect(progressService.getHistory()).toEqual([]);
    });

    it('handles wrong version gracefully', () => {
      localStorage.setItem(
        'audiometry_progress_data',
        JSON.stringify({ version: 999, records: [makeRecord()] })
      );

      expect(progressService.getHistory()).toEqual([]);
    });

    it('handles missing records array gracefully', () => {
      localStorage.setItem(
        'audiometry_progress_data',
        JSON.stringify({ version: 1, records: 'not an array' })
      );

      expect(progressService.getHistory()).toEqual([]);
    });

    it('handles null stored value gracefully', () => {
      // getItem returns null for missing keys — this is the default state
      expect(progressService.getHistory()).toEqual([]);
      expect(progressService.getTotalSessions()).toBe(0);
    });
  });

  // =========================================================================
  // Empty localStorage
  // =========================================================================
  describe('empty localStorage', () => {
    it('all getters return safe defaults with no data', () => {
      expect(progressService.getHistory()).toEqual([]);
      expect(progressService.getAverageAccuracy()).toBe(0);
      expect(progressService.getAccuracyByHearingLossType()).toEqual({});
      expect(progressService.getTotalSessions()).toBe(0);
      expect(progressService.getTotalTimeSpent()).toBe(0);
      expect(progressService.getImprovementTrend()).toEqual([]);
      expect(progressService.getRecentSessions(5)).toEqual([]);
    });
  });

  // =========================================================================
  // exportData
  // =========================================================================
  describe('exportData', () => {
    it('returns valid JSON with version and records', () => {
      progressService.saveSession(makeRecord({ sessionId: 'export-1', accuracy: 77 }));
      progressService.saveSession(makeRecord({ sessionId: 'export-2', accuracy: 88 }));

      const exported = progressService.exportData();
      const parsed = JSON.parse(exported);

      expect(parsed.version).toBe(1);
      expect(parsed.records).toHaveLength(2);
      expect(parsed.records[0].sessionId).toBe('export-1');
      expect(parsed.records[1].sessionId).toBe('export-2');
    });

    it('returns valid JSON with empty records when no data', () => {
      const exported = progressService.exportData();
      const parsed = JSON.parse(exported);

      expect(parsed.version).toBe(1);
      expect(parsed.records).toEqual([]);
    });
  });

  // =========================================================================
  // Data integrity across operations
  // =========================================================================
  describe('data integrity', () => {
    it('preserves all fields of a ProgressRecord through save/load cycle', () => {
      const record = makeRecord({
        sessionId: 'integrity-check',
        patientId: 'patient3',
        patientName: 'Robert Chen',
        hearingLossType: 'conductive',
        difficulty: 'intermediate',
        date: '2025-09-15T14:30:00.000Z',
        accuracy: 67.5,
        within5dB: 67.5,
        within10dB: 85.3,
        accuracyByEar: { right: 70, left: 65 },
        accuracyByType: { air: 72, bone: 63 },
        timeSpent: 452,
        totalFrequenciesTested: 24,
        technicalErrors: ['Incorrect masking level', 'Skipped retest'],
      });

      progressService.saveSession(record);
      const loaded = progressService.getHistory()[0];

      expect(loaded.sessionId).toBe('integrity-check');
      expect(loaded.patientId).toBe('patient3');
      expect(loaded.patientName).toBe('Robert Chen');
      expect(loaded.hearingLossType).toBe('conductive');
      expect(loaded.difficulty).toBe('intermediate');
      expect(loaded.date).toBe('2025-09-15T14:30:00.000Z');
      expect(loaded.accuracy).toBe(67.5);
      expect(loaded.within5dB).toBe(67.5);
      expect(loaded.within10dB).toBe(85.3);
      expect(loaded.accuracyByEar).toEqual({ right: 70, left: 65 });
      expect(loaded.accuracyByType).toEqual({ air: 72, bone: 63 });
      expect(loaded.timeSpent).toBe(452);
      expect(loaded.totalFrequenciesTested).toBe(24);
      expect(loaded.technicalErrors).toEqual(['Incorrect masking level', 'Skipped retest']);
    });

    it('saveSession after corrupted data starts fresh', () => {
      localStorage.setItem('audiometry_progress_data', '<<<corrupted>>>');

      // Saving should work — loadRecords returns [] on corruption, then we append
      progressService.saveSession(makeRecord({ sessionId: 'recovery' }));

      expect(progressService.getTotalSessions()).toBe(1);
      expect(progressService.getHistory()[0].sessionId).toBe('recovery');
    });
  });
});
