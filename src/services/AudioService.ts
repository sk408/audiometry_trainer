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
  private boneCalibrationValues: Map<Frequency, number> = new Map();
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
      
      // Bone conduction calibration values - typically different from air conduction
      // Bone conduction testing typically covers 250-4000 Hz
      if (freq >= 250 && freq <= 4000) {
        this.boneCalibrationValues.set(freq, 0.8); // Lower amplitude to simulate bone conduction
      }
    });
  }

  /**
   * Convert dB HL to amplitude gain, with option for bone conduction
   * @param dBHL - Hearing level in dB
   * @param frequency - Frequency in Hz
   * @param isBone - Whether this is for bone conduction
   * @returns Amplitude value
   */
  private dBToAmplitude(dBHL: HearingLevel, frequency: Frequency, isBone: boolean = false): number {
    // In a real audiometer, this would be based on calibration data
    // Here we're making a simplified conversion
    
    // For values lower than 0 dB HL
    if (dBHL < 0) {
      return 0.0001 * Math.pow(10, (dBHL) / 20);
    }
    
    // Base calculation
    let amplitude = 0.0001 * Math.pow(10, dBHL / 20);
    
    // Apply calibration adjustment
    if (isBone) {
      const calibration = this.boneCalibrationValues.get(frequency) || 0.8;
      amplitude *= calibration;
    } else {
      const calibration = this.calibrationValues.get(frequency) || 1.0;
      amplitude *= calibration;
    }
    
    return amplitude;
  }

  /**
   * Play a pure tone
   * @param frequency - Frequency in Hz
   * @param dBHL - Hearing level in dB
   * @param ear - Ear to present to
   * @param durationMs - Duration in milliseconds
   * @param testType - Type of test (air or bone conduction)
   */
  public playTone(
    frequency: Frequency, 
    dBHL: HearingLevel, 
    ear: Ear, 
    durationMs: number = 1000,
    testType: 'air' | 'bone' | 'masked_air' | 'masked_bone' = 'air'
  ): void {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (!this.audioContext) {
      console.error('Could not initialize AudioContext');
      return;
    }

    // Ensure the audio context is running
    this.resumeAudioContext();

    // Destroy any existing audio nodes
    this.destroyAllAudioNodes();

    // Store current frequency
    this.currentFrequency = frequency;

    // Calculate appropriate amplitude
    let amplitude: number;
    if (testType === 'bone' || testType === 'masked_bone') {
      amplitude = this.dBToAmplitude(dBHL, frequency, true);
    } else {
      amplitude = this.dBToAmplitude(dBHL, frequency);
    }

    // Create audio nodes
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
    this.panNode = this.audioContext.createStereoPanner();

    // Set oscillator type and frequency
    this.oscillator.type = this.getBoneOscillatorType(testType);
    this.oscillator.frequency.value = frequency;

    // Set pan based on ear selection
    this.setPan(ear);

    // Apply sound enveloping for bone conduction if needed
    if (testType === 'bone' || testType === 'masked_bone') {
      this.applyBoneConductionEffect();
    }

    // Set initial gain to 0 to avoid clicks
    this.gainNode.gain.value = 0;

    // Connect nodes
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.panNode);
    this.panNode.connect(this.audioContext.destination);

    // Start the oscillator
    this.oscillator.start();

    // Apply envelope (attack, sustain, release)
    const now = this.audioContext.currentTime;
    const attackTime = 0.02; // 20ms attack
    const releaseTime = 0.02; // 20ms release
    
    // Ramp up (attack)
    this.gainNode.gain.linearRampToValueAtTime(amplitude, now + attackTime);
    
    // Sustain
    this.gainNode.gain.setValueAtTime(amplitude, now + attackTime + (durationMs / 1000) - releaseTime);
    
    // Ramp down (release)
    this.gainNode.gain.linearRampToValueAtTime(0, now + attackTime + (durationMs / 1000));
    
    // Stop oscillator after duration
    this.oscillator.stop(now + attackTime + (durationMs / 1000) + 0.1); // Add small buffer

    if (this.debugMode) {
      console.log(`Playing ${testType} tone: ${frequency}Hz at ${dBHL}dB HL to ${ear} ear for ${durationMs}ms`);
    }
  }

  /**
   * Get the appropriate oscillator type based on test type
   * @param testType - Type of test
   * @returns Oscillator type
   */
  private getBoneOscillatorType(testType: 'air' | 'bone' | 'masked_air' | 'masked_bone'): OscillatorType {
    // For bone conduction, we use a different waveform to simulate
    // the different perception of bone-conducted sound
    if (testType === 'bone' || testType === 'masked_bone') {
      return 'triangle'; // Triangle wave has fewer higher harmonics, better simulating bone conduction
    }
    
    // Default to sine wave for air conduction
    return 'sine';
  }

  /**
   * Apply effects to simulate bone conduction sound quality
   */
  private applyBoneConductionEffect(): void {
    if (!this.audioContext || !this.gainNode) return;
    
    // Create a simple low-pass filter to simulate bone conduction
    const boneFilter = this.audioContext.createBiquadFilter();
    boneFilter.type = 'lowpass';
    boneFilter.frequency.value = 2000; // Bone conduction has limited high-frequency response
    boneFilter.Q.value = 0.5;
    
    // Insert filter into the audio chain
    if (this.oscillator && this.gainNode) {
      this.oscillator.disconnect();
      this.oscillator.connect(boneFilter);
      boneFilter.connect(this.gainNode);
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