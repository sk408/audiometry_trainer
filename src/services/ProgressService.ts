/**
 * ProgressService - Tracks student performance over time and persists to localStorage
 *
 * Singleton service that stores session results with schema versioning.
 * All data is persisted to localStorage under the key 'audiometry_progress_data'.
 */

const STORAGE_KEY = 'audiometry_progress_data';
const REM_STORAGE_KEY = 'audiometry_rem_progress_data';
const SCHEMA_VERSION = 1;

export interface ProgressRecord {
  sessionId: string;
  patientId: string;
  patientName: string;
  hearingLossType: string;
  difficulty: string;
  date: string; // ISO string
  accuracy: number; // within +/-5 dB percentage
  within5dB: number;
  within10dB: number;
  accuracyByEar?: { right: number; left: number };
  accuracyByType?: { air: number; bone: number };
  timeSpent: number; // seconds
  totalFrequenciesTested: number;
  technicalErrors: string[];
}

export interface REMProgressRecord {
  sessionId: string;
  patientId: string;
  patientName: string;
  prescriptionMethod: string;
  fitQuality: number; // 0-100
  date: string; // ISO string
  timeSpent: number; // seconds
}

interface StorageSchema {
  version: number;
  records: ProgressRecord[];
}

interface REMStorageSchema {
  version: number;
  records: REMProgressRecord[];
}

class ProgressService {
  /**
   * Load records from localStorage, returning an empty array on parse failure
   * or missing data.
   */
  private loadRecords(): ProgressRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed: StorageSchema = JSON.parse(raw);
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        parsed.version !== SCHEMA_VERSION ||
        !Array.isArray(parsed.records)
      ) {
        return [];
      }
      return parsed.records;
    } catch {
      // JSON parse errors or any other issue — return empty
      return [];
    }
  }

  /**
   * Persist records to localStorage with schema versioning.
   */
  private saveRecords(records: ProgressRecord[]): void {
    const data: StorageSchema = {
      version: SCHEMA_VERSION,
      records,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Save a session result to localStorage.
   */
  saveSession(record: ProgressRecord): void {
    const records = this.loadRecords();
    records.push(record);
    this.saveRecords(records);
  }

  /**
   * Get all session records, sorted by date descending (most recent first).
   */
  getHistory(): ProgressRecord[] {
    const records = this.loadRecords();
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Average accuracy (within +/-5 dB) across all sessions.
   * Returns 0 if there are no sessions.
   */
  getAverageAccuracy(): number {
    const records = this.loadRecords();
    if (records.length === 0) {
      return 0;
    }
    const sum = records.reduce((acc, r) => acc + r.accuracy, 0);
    return sum / records.length;
  }

  /**
   * Group sessions by hearing loss type and compute average accuracy and count for each.
   */
  getAccuracyByHearingLossType(): Record<string, { avgAccuracy: number; count: number }> {
    const records = this.loadRecords();
    const groups: Record<string, { totalAccuracy: number; count: number }> = {};

    for (const record of records) {
      const type = record.hearingLossType;
      if (!groups[type]) {
        groups[type] = { totalAccuracy: 0, count: 0 };
      }
      groups[type].totalAccuracy += record.accuracy;
      groups[type].count += 1;
    }

    const result: Record<string, { avgAccuracy: number; count: number }> = {};
    for (const [type, data] of Object.entries(groups)) {
      result[type] = {
        avgAccuracy: data.totalAccuracy / data.count,
        count: data.count,
      };
    }

    return result;
  }

  /**
   * Total number of saved sessions.
   */
  getTotalSessions(): number {
    return this.loadRecords().length;
  }

  /**
   * Total time spent across all sessions, in seconds.
   */
  getTotalTimeSpent(): number {
    const records = this.loadRecords();
    return records.reduce((acc, r) => acc + r.timeSpent, 0);
  }

  /**
   * Returns the last 20 session accuracies in chronological order (oldest first).
   * Useful for rendering an improvement trend line.
   */
  getImprovementTrend(): number[] {
    const records = this.loadRecords();
    // Sort chronologically (oldest first)
    const sorted = records.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    // Take the last 20
    const recent = sorted.slice(-20);
    return recent.map((r) => r.accuracy);
  }

  /**
   * Get the most recent N sessions, sorted by date descending (most recent first).
   */
  getRecentSessions(count: number): ProgressRecord[] {
    const history = this.getHistory();
    return history.slice(0, count);
  }

  /**
   * Clear all progress data from localStorage.
   */
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Export all progress data as a JSON string.
   */
  exportData(): string {
    const records = this.loadRecords();
    const data: StorageSchema = {
      version: SCHEMA_VERSION,
      records,
    };
    return JSON.stringify(data, null, 2);
  }

  // -------------------------------------------------------------------------
  // REM session tracking
  // -------------------------------------------------------------------------

  private loadREMRecords(): REMProgressRecord[] {
    try {
      const raw = localStorage.getItem(REM_STORAGE_KEY);
      if (!raw) return [];
      const parsed: REMStorageSchema = JSON.parse(raw);
      if (!parsed || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.records)) return [];
      return parsed.records;
    } catch {
      return [];
    }
  }

  private saveREMRecords(records: REMProgressRecord[]): void {
    const data: REMStorageSchema = { version: SCHEMA_VERSION, records };
    localStorage.setItem(REM_STORAGE_KEY, JSON.stringify(data));
  }

  saveREMSession(record: REMProgressRecord): void {
    const records = this.loadREMRecords();
    records.push(record);
    this.saveREMRecords(records);
  }

  getREMHistory(): REMProgressRecord[] {
    const records = this.loadREMRecords();
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getREMSessionCount(): number {
    return this.loadREMRecords().length;
  }

  getAverageREMFitQuality(): number {
    const records = this.loadREMRecords();
    if (records.length === 0) return 0;
    return records.reduce((acc, r) => acc + r.fitQuality, 0) / records.length;
  }
}

const progressService = new ProgressService();
export default progressService;
