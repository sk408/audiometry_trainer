import { Frequency, HearingLevel, Ear } from '../interfaces/AudioTypes';
import { EAR } from '../constants/AudioConstants';

/**
 * AudioService - Handles generation of pure tones using Web Audio API
 * Implements calibrated tone generation for audiometric testing
 */
class AudioService {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private calibrationValues: Map<Frequency, number> = new Map();
  private panNode: StereoPannerNode | null = null;
  private currentFrequency: number = 0;
  private debugMode: boolean = true; // Enable debug logs
  
  constructor() {
    this.initializeAudioContext();
    this.setupCalibration();
  }

  /**
   * Initialize the AudioContext
   */
  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Web Audio API is not supported in this browser', error);
    }
  }

  /**
   * Setup calibration values for different frequencies
   * These values would normally be determined through proper calibration
   * with an audiometer and artificial ear
   */
  private setupCalibration(): void {
    // These are placeholder values - real calibration would be done with proper equipment
    const frequencies: Frequency[] = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    
    frequencies.forEach(freq => {
      // In a real application, these would be measured values
      this.calibrationValues.set(freq, 1.0);
    });
  }

  /**
   * Convert dB HL to amplitude gain
   * @param dBHL - Hearing level in dB
   * @param frequency - Tone frequency
   * @returns Amplitude gain value
   */
  private dBToAmplitude(dBHL: HearingLevel, frequency: Frequency): number {
    // Get calibration value for this frequency (defaults to 1.0)
    const calibration = this.calibrationValues.get(frequency) || 1.0;
    
    // Convert dB HL to amplitude
    // This is a simplified conversion formula
    // In a real application, this would be based on proper calibration
    const dBSPL = dBHL + 7; // Rough conversion from dB HL to dB SPL
    const amplitude = calibration * Math.pow(10, dBSPL / 20) / 1000;
    
    return Math.min(amplitude, 1.0); // Clamp amplitude to 1.0
  }

  /**
   * Play a pure tone
   * @param frequency - Tone frequency in Hz
   * @param dBHL - Hearing level in dB HL
   * @param ear - Which ear to present the tone to
   * @param durationMs - Tone duration in milliseconds
   */
  public playTone(frequency: Frequency, dBHL: HearingLevel, ear: Ear, durationMs: number = 1000): void {
    if (!this.audioContext) {
      console.error('AudioContext not initialized');
      return;
    }

    // CRITICAL: First, completely stop and destroy any existing tone nodes
    this.destroyAllAudioNodes();
    
    if (this.debugMode) {
      console.log(`🎵 Playing tone with params:`, {
        requestedFrequency: frequency,
        previousFrequency: this.currentFrequency,
        hearingLevel: dBHL,
        ear: ear,
        change: frequency - this.currentFrequency
      });
    }
    
    // Ensure frequency is a valid number before proceeding
    if (typeof frequency !== 'number' || isNaN(frequency) || frequency <= 0) {
      console.error(`Invalid frequency value: ${frequency}. Using default 1000Hz.`);
      frequency = 1000;
    }
    
    // SANITY CHECK: Force the current frequency tracking to match the requested frequency
    this.currentFrequency = frequency;

    // Create completely fresh audio nodes every time
    try {
      // Create fresh audio context if needed
      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.initializeAudioContext();
        if (this.debugMode) {
          console.log('🔄 Recreated AudioContext');
        }
      }
      
      // Resume audio context if suspended
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
        if (this.debugMode) {
          console.log('▶️ Resumed suspended AudioContext');
        }
      }

      // Create fresh nodes
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      this.panNode = this.audioContext.createStereoPanner();

      // CRITICAL: Set exact frequency value as number, not through setValueAtTime
      this.oscillator.type = 'sine';
      this.oscillator.frequency.value = frequency;
      
      // Double-check the frequency was set correctly
      if (this.debugMode) {
        console.log(`🔊 Oscillator frequency explicitly set to: ${frequency}Hz, actual value: ${this.oscillator.frequency.value}Hz`);
        
        if (this.oscillator.frequency.value !== frequency) {
          console.warn(`⚠️ CRITICAL FREQUENCY MISMATCH! Set: ${frequency}, Actual: ${this.oscillator.frequency.value}`);
          // Force it again to be absolutely sure
          this.oscillator.frequency.value = frequency;
          console.log(`🔧 Forced frequency again to ${frequency}Hz, now: ${this.oscillator.frequency.value}Hz`);
        }
      }

      // Set gain (volume) based on dB HL
      const amplitude = this.dBToAmplitude(dBHL, frequency);
      this.gainNode.gain.value = amplitude;

      // Set stereo panning based on ear
      this.setPan(ear);

      // Connect nodes
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.panNode);
      this.panNode.connect(this.audioContext.destination);

      // Apply envelope to avoid clicks
      const currentTime = this.audioContext.currentTime;
      const attackTime = 0.02; // 20ms attack
      const releaseTime = 0.02; // 20ms release

      this.gainNode.gain.setValueAtTime(0, currentTime);
      this.gainNode.gain.linearRampToValueAtTime(amplitude, currentTime + attackTime);
      this.gainNode.gain.setValueAtTime(amplitude, currentTime + attackTime + (durationMs / 1000) - releaseTime);
      this.gainNode.gain.linearRampToValueAtTime(0, currentTime + (durationMs / 1000));

      // Start and stop the oscillator
      this.oscillator.start(currentTime);
      this.oscillator.stop(currentTime + (durationMs / 1000));

      if (this.debugMode) {
        console.log(`✅ Tone started at ${frequency}Hz with level ${dBHL}dB`);
      }

      // Clean up after the tone finishes
      this.oscillator.onended = () => {
        if (this.debugMode) {
          console.log(`🔚 Tone ended, cleaning up audio nodes for ${frequency}Hz`);
        }
        
        // Call our consolidated cleanup function
        this.destroyAllAudioNodes();
      };
    } catch (error) {
      console.error('Error creating audio nodes:', error);
      // Clean up any partial setup
      this.destroyAllAudioNodes();
    }
  }

  /**
   * Stop the currently playing tone
   */
  public stopTone(): void {
    // Save the frequency for debugging
    const freqBeforeStop = this.currentFrequency;
    
    // Use our comprehensive cleanup method
    this.destroyAllAudioNodes();
    
    if (this.debugMode) {
      console.log(`🛑 Stopped tone at ${freqBeforeStop}Hz`);
    }
  }
  
  /**
   * Helper method to completely destroy all audio nodes
   * Consolidates cleanup logic in one place
   */
  private destroyAllAudioNodes(): void {
    if (this.oscillator) {
      try {
        this.oscillator.stop(0); // Stop immediately
      } catch (e) {
        // Ignore errors if already stopped
      }
      
      try {
        this.oscillator.disconnect();
      } catch (e) {
        // Ignore errors if already disconnected
      }
      
      this.oscillator = null;
    }
    
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (e) {
        // Ignore errors
      }
      this.gainNode = null;
    }
    
    if (this.panNode) {
      try {
        this.panNode.disconnect();
      } catch (e) {
        // Ignore errors
      }
      this.panNode = null;
    }
  }

  /**
   * Resume the AudioContext if it was suspended
   * (browsers require user interaction before playing audio)
   */
  public resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      return this.audioContext.resume();
    }
    return Promise.resolve();
  }

  /**
   * Set the stereo pan based on the selected ear
   * @param ear - Which ear to present to (left, right, or both)
   */
  private setPan(ear: string): void {
    if (!this.panNode) return;
    
    switch (ear) {
      case EAR.LEFT:
        this.panNode.pan.value = -1; // Full left
        break;
      case EAR.RIGHT:
        this.panNode.pan.value = 1; // Full right
        break;
      case EAR.BOTH:
      default:
        this.panNode.pan.value = 0; // Center
        break;
    }
  }

  /**
   * Play a masking noise
   * @param intensity - Intensity in dB HL
   * @param ear - Which ear to present to
   */
  public playMaskingNoise(intensity: number, ear: string = EAR.BOTH): void {
    // Implementation for masking noise would go here
    // This would typically use filtered noise rather than a pure tone
    console.log(`Playing masking noise at ${intensity} dB HL to ${ear} ear`);
  }
  
  /**
   * Stop masking noise
   */
  public stopMaskingNoise(): void {
    // Implementation to stop masking noise would go here
    console.log('Stopping masking noise');
  }

  /**
   * Clean up resources when service is no longer needed
   */
  public dispose(): void {
    this.stopTone();
    this.stopMaskingNoise();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Create a singleton instance
const audioService = new AudioService();
export default audioService;