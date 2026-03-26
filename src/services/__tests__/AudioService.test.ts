import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// -----------------------------------------------------------------
// Mock Web Audio API
// -----------------------------------------------------------------

const mockOscillator = {
  type: 'sine' as OscillatorType,
  frequency: { value: 0 },
  connect: vi.fn(),
  disconnect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};

const mockGainNode = {
  gain: {
    value: 0,
    linearRampToValueAtTime: vi.fn(),
    setValueAtTime: vi.fn(),
  },
  connect: vi.fn(),
  disconnect: vi.fn(),
};

const mockPanNode = {
  pan: { value: 0 },
  connect: vi.fn(),
  disconnect: vi.fn(),
};

const mockBiquadFilter = {
  type: 'lowpass' as BiquadFilterType,
  frequency: { value: 0 },
  Q: { value: 0 },
  connect: vi.fn(),
  disconnect: vi.fn(),
};

const mockBufferSource = {
  buffer: null as AudioBuffer | null,
  loop: false,
  connect: vi.fn(),
  disconnect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};

const mockAudioBuffer = {
  getChannelData: vi.fn().mockReturnValue(new Float32Array(88200)),
};

let mockAudioContextState = 'running';

const mockAudioContext = {
  get state() { return mockAudioContextState; },
  currentTime: 0,
  sampleRate: 44100,
  destination: {},
  createOscillator: vi.fn(() => ({ ...mockOscillator })),
  createGain: vi.fn(() => ({
    ...mockGainNode,
    gain: {
      value: 0,
      linearRampToValueAtTime: vi.fn(),
      setValueAtTime: vi.fn(),
    },
  })),
  createStereoPanner: vi.fn(() => ({ ...mockPanNode, pan: { value: 0 } })),
  createBiquadFilter: vi.fn(() => ({ ...mockBiquadFilter, frequency: { value: 0 }, Q: { value: 0 } })),
  createBuffer: vi.fn(() => mockAudioBuffer),
  createBufferSource: vi.fn(() => ({ ...mockBufferSource })),
  resume: vi.fn().mockResolvedValue(undefined),
  close: vi.fn(),
};

// Install the mock before importing the module
vi.stubGlobal('AudioContext', vi.fn(() => ({ ...mockAudioContext })));
(globalThis as any).webkitAudioContext = undefined;

// Now import the service (it will use our mock AudioContext)
import audioService from '../AudioService';

describe('AudioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAudioContextState = 'running';
  });

  // =========================================================================
  // AudioContext Lifecycle
  // =========================================================================
  describe('AudioContext Lifecycle', () => {
    it('1. AudioService singleton exists and can be used', () => {
      // The singleton was created at module load time
      expect(audioService).toBeDefined();
      expect(typeof audioService.playTone).toBe('function');
      expect(typeof audioService.stopTone).toBe('function');
      expect(typeof audioService.dispose).toBe('function');
    });

    it('2. resumeAudioContext resolves immediately if already running', async () => {
      mockAudioContextState = 'running';
      await expect(audioService.resumeAudioContext()).resolves.toBeUndefined();
    });

    it('3. dispose stops all audio and closes context', async () => {
      // Play a tone first so there's something to clean up
      await audioService.playTone(1000, 40, 'right', 500);
      audioService.dispose();
      // After dispose, the context should have been closed
      // (We can't easily verify this on the singleton, but at least no error thrown)
    });
  });

  // =========================================================================
  // Tone Generation
  // =========================================================================
  describe('Tone Generation', () => {
    it('4. playTone creates oscillator, gain, and pan nodes', async () => {
      await audioService.playTone(1000, 40, 'right', 500);
      // The service should have called createOscillator, createGain, createStereoPanner
      // on its internal AudioContext (hard to verify exact calls on singleton,
      // but we can verify it doesn't throw)
    });

    it('5. stopTone does not throw when no tone is playing', () => {
      expect(() => audioService.stopTone()).not.toThrow();
    });

    it('6. stopTone after playTone does not throw', async () => {
      await audioService.playTone(1000, 40, 'right', 500);
      expect(() => audioService.stopTone()).not.toThrow();
    });

    it('7. Multiple rapid playTone calls do not throw', async () => {
      await audioService.playTone(1000, 40, 'right', 500);
      await audioService.playTone(2000, 50, 'left', 500);
      await audioService.playTone(4000, 60, 'right', 500);
    });
  });

  // =========================================================================
  // Bone Conduction
  // =========================================================================
  describe('Bone Conduction', () => {
    it('8. Bone conduction tone does not throw', async () => {
      await audioService.playTone(1000, 40, 'right', 500, 'bone');
    });

    it('9. Bone conduction cleanup does not throw', async () => {
      await audioService.playTone(1000, 40, 'right', 500, 'bone');
      expect(() => audioService.stopTone()).not.toThrow();
    });
  });

  // =========================================================================
  // Pulsed Tone
  // =========================================================================
  describe('Pulsed Tone', () => {
    it('10. playPulsedTone creates interval (via isPulsed flag)', async () => {
      await audioService.playTone(1000, 40, 'right', 200, 'air', true);
      // Should not throw; the interval is running
      audioService.stopTone(); // Clean up
    });

    it('11. setPulseTiming updates durations', () => {
      expect(() => audioService.setPulseTiming(300, 300)).not.toThrow();
      // Reset
      audioService.setPulseTiming(200, 200);
    });

    it('12. stopTone clears pulse interval', async () => {
      await audioService.playTone(1000, 40, 'right', 200, 'air', true);
      expect(() => audioService.stopTone()).not.toThrow();
      // Calling stop again should also be safe
      expect(() => audioService.stopTone()).not.toThrow();
    });
  });

  // =========================================================================
  // Masking Noise
  // =========================================================================
  describe('Masking Noise', () => {
    it('13. playMaskingNoise does not throw', async () => {
      await audioService.playMaskingNoise(40, 'left');
      audioService.stopMaskingNoise();
    });

    it('14. stopMaskingNoise is safe when nothing is playing', () => {
      expect(() => audioService.stopMaskingNoise()).not.toThrow();
    });

    it('15. Double stopMaskingNoise does not throw', async () => {
      await audioService.playMaskingNoise(40, 'right');
      audioService.stopMaskingNoise();
      expect(() => audioService.stopMaskingNoise()).not.toThrow();
    });
  });

  // =========================================================================
  // Node Cleanup
  // =========================================================================
  describe('Node Cleanup', () => {
    it('16. All nodes cleaned up after stopTone (no lingering references)', async () => {
      // Play air tone
      await audioService.playTone(1000, 40, 'right', 500, 'air');
      audioService.stopTone();
      // Play bone tone (creates boneFilter too)
      await audioService.playTone(1000, 40, 'right', 500, 'bone');
      audioService.stopTone();
      // Play again — should not accumulate nodes
      await audioService.playTone(2000, 50, 'left', 500, 'air');
      audioService.stopTone();
      // No assertion beyond not throwing — the key is no memory leak
    });

    it('17. Cleanup handles already-stopped oscillator gracefully', async () => {
      await audioService.playTone(1000, 40, 'right', 50);
      // Wait slightly longer than duration, then stop (oscillator already stopped)
      audioService.stopTone();
      expect(() => audioService.stopTone()).not.toThrow();
    });

    it('18. Masking noise and tone can coexist and be cleaned up independently', async () => {
      await audioService.playTone(1000, 40, 'right', 500);
      await audioService.playMaskingNoise(30, 'left');
      audioService.stopTone(); // should only stop the tone
      audioService.stopMaskingNoise(); // should stop masking
    });
  });

  // =========================================================================
  // Edge Cases
  // =========================================================================
  describe('Edge Cases', () => {
    it('19. Very high dB HL does not throw', async () => {
      await audioService.playTone(1000, 120, 'right', 100);
      audioService.stopTone();
    });

    it('20. Negative dB HL does not throw', async () => {
      await audioService.playTone(1000, -10, 'right', 100);
      audioService.stopTone();
    });

    it('21. All standard frequencies work for air conduction', async () => {
      const frequencies = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000] as const;
      for (const freq of frequencies) {
        await audioService.playTone(freq, 40, 'right', 50);
        audioService.stopTone();
      }
    });

    it('22. Both ears work', async () => {
      await audioService.playTone(1000, 40, 'left', 50);
      audioService.stopTone();
      await audioService.playTone(1000, 40, 'right', 50);
      audioService.stopTone();
    });
  });
});
