import { 
  REMType, REMFrequency, REMSignalType, REMLevel, 
  ProbePosition, REMCurve, REMTarget, VirtualHearingAid,
  REMSession, REMErrorType, REMMeasurementPoint 
} from '../interfaces/RealEarMeasurementTypes';

/**
 * RealEarMeasurementService - Handles generation and processing of signals for REM simulation
 * Simulates probe tube measurements and hearing aid responses
 */
class RealEarMeasurementService {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private currentSession: REMSession | null = null;
  private virtualHearingAids: Map<string, VirtualHearingAid> = new Map();
  private sampleRate: number = 44100;
  private isPlaying: boolean = false;

  constructor() {
    this.initializeAudioContext();
    this.loadVirtualHearingAids();
  }

  // Initialize Web Audio API context
  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 2048;
    } catch (error) {
      console.error('Failed to initialize audio context for REM', error);
    }
  }

  // Load predefined virtual hearing aid models
  private loadVirtualHearingAids(): void {
    // Define sample hearing aids
    const hearingAids: VirtualHearingAid[] = [
      {
        id: 'ha1',
        name: 'Premium BTE',
        manufacturer: 'AudioCorp',
        type: 'BTE',
        maxGain: 70,
        maxOutput: 130,
        channels: 20,
        features: ['Feedback cancellation', 'Noise reduction', 'Directional mic'],
        defaultSettings: {
          125: 10,
          250: 15,
          500: 20,
          750: 25,
          1000: 30,
          1500: 35,
          2000: 40,
          3000: 45,
          4000: 40,
          6000: 35,
          8000: 30
        }
      },
      {
        id: 'ha2',
        name: 'Standard RIC',
        manufacturer: 'HearWell',
        type: 'RIC',
        maxGain: 60,
        maxOutput: 120,
        channels: 12,
        features: ['Feedback cancellation', 'Noise reduction'],
        defaultSettings: {
          125: 5,
          250: 10,
          500: 15,
          750: 20,
          1000: 25,
          1500: 30,
          2000: 35,
          3000: 40,
          4000: 35,
          6000: 30,
          8000: 25
        }
      },
      {
        id: 'ha3',
        name: 'Economy CIC',
        manufacturer: 'SoundClear',
        type: 'CIC',
        maxGain: 50,
        maxOutput: 110,
        channels: 8,
        features: ['Feedback cancellation'],
        defaultSettings: {
          125: 0,
          250: 5,
          500: 10,
          750: 15,
          1000: 20,
          1500: 25,
          2000: 30,
          3000: 35,
          4000: 30,
          6000: 25,
          8000: 20
        }
      }
    ];

    // Add to map
    hearingAids.forEach(ha => {
      this.virtualHearingAids.set(ha.id, ha);
    });
  }

  // Create a new REM session
  public createSession(patientId: string, hearingAidId: string): REMSession {
    // Initialize a new session with default values
    const newSession: REMSession = {
      id: this.generateUniqueId(),
      patientId,
      hearingAidId,
      startTime: new Date().toISOString(),
      completed: false,
      probeTubePosition: ProbePosition.NOT_INSERTED,
      measurements: [],
      targets: [],
      currentStep: 'REUR',
      errors: [],
      accuracy: 0
    };

    this.currentSession = newSession;
    return newSession;
  }

  // Generate a unique ID for session
  private generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Position the probe tube in the virtual ear
  public positionProbeTube(depth: number): ProbePosition {
    // Simulate probe tube positioning with correct depth values
    if (!this.currentSession) {
      throw new Error("No active session");
    }

    let position: ProbePosition;
    if (depth < 20) {
      position = ProbePosition.TOO_SHALLOW;
    } else if (depth > 30) {
      position = ProbePosition.TOO_DEEP;
    } else {
      position = ProbePosition.CORRECT;
    }

    // Update session with the new position
    this.currentSession.probeTubePosition = position;
    return position;
  }

  // Perform a REM measurement
  public performMeasurement(
    type: REMType,
    ear: 'left' | 'right',
    signalType: REMSignalType,
    inputLevel: REMLevel
  ): Promise<REMCurve> {
    // Validate if probe is correctly positioned
    if (!this.currentSession) {
      return Promise.reject(new Error("No active session"));
    }

    if (this.currentSession.probeTubePosition !== ProbePosition.CORRECT) {
      return Promise.reject(new Error("Probe tube not correctly positioned"));
    }

    // Simulate the measurement process
    return new Promise((resolve) => {
      // Generate measurement data based on the parameters
      const measurementPoints = this.simulateMeasurement(type, ear, signalType, inputLevel);
      
      const measurement: REMCurve = {
        type,
        ear,
        signalType,
        inputLevel,
        measurementPoints,
        timestamp: new Date().toISOString()
      };

      // Add the measurement to the current session
      if (this.currentSession) {
        this.currentSession.measurements.push(measurement);
        
        // Update current step
        this.currentSession.currentStep = type;
      }

      resolve(measurement);
    });
  }

  // Simulate the measurement based on parameters
  private simulateMeasurement(
    type: REMType,
    ear: 'left' | 'right',
    signalType: REMSignalType,
    inputLevel: REMLevel
  ): REMMeasurementPoint[] {
    if (!this.currentSession) {
      throw new Error("No active session");
    }

    // Generate realistic measurement points based on the parameters
    const measurementPoints: REMMeasurementPoint[] = [];
    
    // Frequencies to measure
    const frequencies: REMFrequency[] = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    
    // Get the hearing aid model
    const hearingAid = this.virtualHearingAids.get(this.currentSession.hearingAidId);
    
    if (!hearingAid) {
      throw new Error("Hearing aid not found");
    }
    
    // Generate data for each frequency based on the test type
    frequencies.forEach(freq => {
      let gain = 0;
      
      // Add some random variation to make it realistic
      const randomFactor = Math.random() * 5 - 2.5; // -2.5 to +2.5 dB variation
      
      switch (type) {
        case 'REUR': // Real Ear Unaided Response - natural resonance of ear canal
          // Simulating ear canal resonance (typically peaks around 2.7kHz)
          if (freq < 1000) {
            gain = 0 + randomFactor;
          } else if (freq < 2000) {
            gain = 3 + randomFactor;
          } else if (freq < 3000) {
            gain = 10 + randomFactor;  // Peak around 2.7kHz
          } else {
            gain = 5 + randomFactor;
          }
          break;
        
        case 'REOR': // Real Ear Occluded Response - with hearing aid in place but turned off
          // Typically reduces high frequencies due to occlusion
          if (freq < 500) {
            gain = 5 + randomFactor; // Occlusion effect boosts low frequencies
          } else if (freq < 1000) {
            gain = 2 + randomFactor;
          } else {
            gain = -3 + randomFactor; // Reduces high frequencies
          }
          break;
        
        case 'REAR': // Real Ear Aided Response - with hearing aid on
          // Use the hearing aid settings plus some random variation
          const baseGain = hearingAid.defaultSettings[freq] || 0;
          // Scale by input level (reference is usually 65dB)
          const levelScaling = (inputLevel - 65) * 0.5; // 0.5 compression ratio
          gain = baseGain + levelScaling + randomFactor;
          break;
        
        case 'REIG': // Real Ear Insertion Gain - difference between REAR and REUR
          // This would normally be calculated as REAR - REUR
          // For simulation, we'll just use the hearing aid gain
          gain = (hearingAid.defaultSettings[freq] || 0) + randomFactor;
          break;
        
        case 'RECD': // Real Ear to Coupler Difference
          // Typical RECD values
          if (freq < 500) {
            gain = 3 + randomFactor;
          } else if (freq < 1000) {
            gain = 5 + randomFactor;
          } else if (freq < 4000) {
            gain = 8 + randomFactor;
          } else {
            gain = 12 + randomFactor;
          }
          break;
        
        case 'RESR': // Real Ear Saturation Response
          // Maximum output levels
          gain = Math.min(hearingAid.maxOutput - inputLevel, hearingAid.maxGain) + randomFactor;
          break;
      }
      
      measurementPoints.push({
        frequency: freq,
        gain: Math.round(gain * 10) / 10 // Round to 1 decimal place
      });
    });
    
    return measurementPoints;
  }

  // Generate target curves based on a patient's hearing loss
  public generateTargets(patientId: string, prescriptionMethod: 'NAL-NL2' | 'DSL' | 'NAL-NL1' | 'custom'): REMTarget[] {
    if (!this.currentSession) {
      throw new Error("No active session");
    }

    const ear = 'right'; // Default to right ear for this example
    const targets: REMTarget[] = [];
    
    // Generate a sample REAR target
    const rearTarget: REMTarget = {
      type: 'REAR',
      ear,
      patientId,
      prescriptionMethod,
      targetPoints: []
    };
    
    // Generate a sample REIG target
    const reigTarget: REMTarget = {
      type: 'REIG',
      ear,
      patientId,
      prescriptionMethod,
      targetPoints: []
    };
    
    // Frequencies to generate targets for
    const frequencies: REMFrequency[] = [125, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000, 8000];
    
    // Sample target values based on prescription method
    // These would normally be calculated based on the patient's audiogram
    const sampleTargetGains = {
      'NAL-NL2': {
        125: 5,
        250: 10,
        500: 15,
        750: 20,
        1000: 25,
        1500: 30,
        2000: 35,
        3000: 40,
        4000: 35,
        6000: 30,
        8000: 25
      },
      'DSL': {
        125: 8,
        250: 13,
        500: 18,
        750: 23,
        1000: 28,
        1500: 33,
        2000: 38,
        3000: 43,
        4000: 38,
        6000: 33,
        8000: 28
      },
      'NAL-NL1': {
        125: 3,
        250: 8,
        500: 13,
        750: 18,
        1000: 23,
        1500: 28,
        2000: 33,
        3000: 38,
        4000: 33,
        6000: 28,
        8000: 23
      },
      'custom': {
        125: 10,
        250: 15,
        500: 20,
        750: 25,
        1000: 30,
        1500: 35,
        2000: 40,
        3000: 45,
        4000: 40,
        6000: 35,
        8000: 30
      }
    };
    
    // Use the appropriate target values
    const targetValues = sampleTargetGains[prescriptionMethod];
    
    // Create target points
    frequencies.forEach(freq => {
      const gain = targetValues[freq];
      
      // Add to REAR target
      rearTarget.targetPoints.push({
        frequency: freq,
        gain
      });
      
      // Add to REIG target (typically a bit lower than REAR)
      reigTarget.targetPoints.push({
        frequency: freq,
        gain: gain - 5 // Subtract typical REUR contribution
      });
    });
    
    targets.push(rearTarget, reigTarget);
    
    // Add targets to the current session
    this.currentSession.targets = targets;
    
    return targets;
  }

  // Calculate accuracy between measurement and target
  public calculateAccuracy(measurement: REMCurve, target: REMTarget): number {
    if (measurement.type !== target.type || measurement.ear !== target.ear) {
      return 0; // Incompatible types
    }
    
    let totalDifference = 0;
    let pointCount = 0;
    
    // For each measurement point, find the corresponding target point
    measurement.measurementPoints.forEach(measPoint => {
      const targetPoint = target.targetPoints.find(tp => tp.frequency === measPoint.frequency);
      
      if (targetPoint) {
        // Calculate absolute difference
        const difference = Math.abs(measPoint.gain - targetPoint.gain);
        totalDifference += difference;
        pointCount++;
      }
    });
    
    if (pointCount === 0) return 0;
    
    // Calculate average difference
    const avgDifference = totalDifference / pointCount;
    
    // Convert to a percentage score (lower difference = higher score)
    // A difference of 0dB = 100%, a difference of 10dB or more = 0%
    const accuracy = Math.max(0, 100 - (avgDifference * 10));
    
    // Update session accuracy
    if (this.currentSession) {
      this.currentSession.accuracy = accuracy;
    }
    
    return accuracy;
  }

  // Play test signals for the REM
  public playTestSignal(signalType: REMSignalType, level: REMLevel, ear: 'left' | 'right'): void {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    
    if (!this.audioContext) {
      console.error('Audio context not available');
      return;
    }
    
    // Stop any existing signals
    this.stopTestSignal();
    
    try {
      // Create nodes
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      
      // Configure oscillator based on signal type
      switch (signalType) {
        case 'pure_tone_sweep':
          this.oscillator.type = 'sine';
          this.oscillator.frequency.value = 1000; // Start at 1kHz
          
          // Create a frequency sweep
          const now = this.audioContext.currentTime;
          this.oscillator.frequency.setValueAtTime(125, now);
          this.oscillator.frequency.exponentialRampToValueAtTime(8000, now + 5); // 5-second sweep
          break;
          
        case 'speech_noise':
        case 'pink_noise':
        case 'white_noise':
        case 'ICRA_noise':
          // For simplicity, we'll use white noise for all noise types
          // In a real implementation, these would be different noise types
          this.oscillator.disconnect();
          this.oscillator = null;
          
          // Create a noise source
          const bufferSize = 2 * this.audioContext.sampleRate;
          const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          
          const whiteNoise = this.audioContext.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;
          whiteNoise.connect(this.gainNode);
          whiteNoise.start();
          break;
      }
      
      // Set gain based on level
      // Convert dB SPL to gain value (simplified)
      const gainValue = Math.pow(10, (level - 70) / 20);
      this.gainNode.gain.value = gainValue;
      
      // Set panning based on ear
      const panNode = this.audioContext.createStereoPanner();
      panNode.pan.value = ear === 'left' ? -1 : 1;
      
      // Connect nodes
      if (this.oscillator) {
        this.oscillator.connect(this.gainNode);
      }
      this.gainNode.connect(panNode);
      panNode.connect(this.audioContext.destination);
      
      // Start oscillator if it exists
      if (this.oscillator) {
        this.oscillator.start();
      }
      
      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing test signal:', error);
    }
  }

  // Stop test signal
  public stopTestSignal(): void {
    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      
      this.isPlaying = false;
    } catch (error) {
      console.error('Error stopping test signal:', error);
    }
  }

  // Get available hearing aids
  public getHearingAids(): VirtualHearingAid[] {
    return Array.from(this.virtualHearingAids.values());
  }

  // Clean up resources
  public dispose(): void {
    this.stopTestSignal();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyzer = null;
    this.currentSession = null;
  }
}

export default RealEarMeasurementService; 