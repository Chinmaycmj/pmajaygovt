import { ConversationState, LanguageCode, SupportedLocale } from '../types';

export interface SpeechEngineCallbacks {
  onStateChange: (state: ConversationState) => void;
  onPartialText: (text: string) => void;
  onFinalText: (text: string) => void;
  onError: (error: string, isRecoverable: boolean) => void;
  onVolumeChange?: (volume: number) => void;
}

export class WebSpeechEngine {
  private state: ConversationState = 'STATE_IDLE';
  private callbacks: SpeechEngineCallbacks;
  private currentLocale: SupportedLocale = 'en-IN';
  private currentLanguage: LanguageCode = 'en';

  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private guardTimeout: any = null;
  private volumeInterval: any = null;
  private isRecognitionActive = false;

  constructor(callbacks: SpeechEngineCallbacks) {
    this.callbacks = callbacks;
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.setupRecognitionListeners();
        } catch (e) {
          console.warn('SpeechRecognition initialization warning:', e);
        }
      }
    }
  }

  public setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
    this.currentLocale = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    if (this.recognition) {
      this.recognition.lang = this.currentLocale;
    }
  }

  private setupRecognitionListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isRecognitionActive = true;
      this.updateState('STATE_LISTENING');
      this.startVolumeSimulation();
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (interim) {
        this.callbacks.onPartialText(interim);
      }
      if (final) {
        this.updateState('STATE_PROCESSING');
        this.stopVolumeSimulation();
        this.callbacks.onFinalText(final.trim());
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error event:', event.error);
      this.stopVolumeSimulation();
      this.isRecognitionActive = false;
      const isRecoverable = event.error === 'no-speech' || event.error === 'network';
      this.updateState('STATE_IDLE');
      this.callbacks.onError(`Recognition paused (${event.error})`, isRecoverable);
    };

    this.recognition.onend = () => {
      this.isRecognitionActive = false;
      this.stopVolumeSimulation();
      if (this.state === 'STATE_LISTENING') {
        this.updateState('STATE_IDLE');
      }
    };
  }

  /**
   * BUG 1 FIX: Strict Half-Duplex Speaking.
   * Cancels recognition immediately, plays TTS, and waits for 300ms acoustic guard delay.
   */
  public speak(text: string, onComplete?: () => void) {
    // 1. Cancel speech recognition immediately (MUTEX LOCK)
    this.cancelRecognition();
    if (this.guardTimeout) {
      clearTimeout(this.guardTimeout);
      this.guardTimeout = null;
    }

    if (!this.synth) {
      // Fallback if browser does not support Web Speech API
      this.updateState('STATE_AI_SPEAKING');
      setTimeout(() => {
        this.updateState('STATE_LISTENING');
        onComplete?.();
      }, 2500);
      return;
    }

    this.synth.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;
    utterance.lang = this.currentLocale;
    // Gentle, soft, and polite acoustic parameters
    utterance.rate = 0.87; // Relaxed, soft, and unrushed pace
    utterance.pitch = 1.03; // Gentle, warm tone
    utterance.volume = 0.92; // Comfortable, soft volume

    // Pick the softest and most natural sounding voice available
    const voices = this.synth.getVoices();
    const candidateVoices = voices.filter((v) => {
      return (
        v.lang === this.currentLocale ||
        v.lang.startsWith(this.currentLocale.split('-')[0]) ||
        (this.currentLanguage === 'kn' && v.name.toLowerCase().includes('kannada')) ||
        (this.currentLanguage === 'hi' && v.name.toLowerCase().includes('hindi')) ||
        (this.currentLanguage === 'en' && v.lang.startsWith('en'))
      );
    });

    if (candidateVoices.length > 0) {
      // Prioritize natural, soft, warm female or neural voices
      const softVoiceKeywords = ['natural', 'swara', 'neerja', 'female', 'google', 'soft', 'kalpana', 'lekha', 'heera', 'geeta'];
      const scoredVoices = candidateVoices.map((v) => {
        const lowerName = v.name.toLowerCase();
        let score = 0;
        if (v.lang === this.currentLocale) score += 5;
        for (const kw of softVoiceKeywords) {
          if (lowerName.includes(kw)) score += 3;
        }
        return { voice: v, score };
      });
      scoredVoices.sort((a, b) => b.score - a.score);
      utterance.voice = scoredVoices[0].voice;
    }

    utterance.onstart = () => {
      this.updateState('STATE_AI_SPEAKING');
      this.startAudioVisualizerSimulation();
    };

    utterance.onend = () => {
      this.stopVolumeSimulation();
      // 300ms ACOUSTIC GUARD DELAY: wait for loudspeaker echo/reverb to clear
      this.guardTimeout = setTimeout(() => {
        if (this.state === 'STATE_AI_SPEAKING') {
          this.playBeepSound();
          this.startListening();
          onComplete?.();
        }
      }, 300);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.stopVolumeSimulation();
      this.updateState('STATE_IDLE');
      this.callbacks.onError('Voice synthesis error. Using on-screen prompts.', true);
    };

    this.synth.speak(utterance);
  }

  public startListening() {
    // Enforce Half-Duplex: Cannot listen while AI is speaking
    if (this.state === 'STATE_AI_SPEAKING') {
      console.warn('Cannot listen while AI is speaking. Mutex enforced.');
      return;
    }

    if (!this.recognition) {
      this.updateState('STATE_LISTENING');
      this.startVolumeSimulation();
      return;
    }

    try {
      if (this.isRecognitionActive) {
        this.recognition.stop();
      }
      this.recognition.lang = this.currentLocale;
      this.recognition.start();
    } catch (e) {
      console.warn('Failed to start speech recognition:', e);
      this.updateState('STATE_LISTENING');
    }
  }

  public cancelRecognition() {
    this.isRecognitionActive = false;
    this.stopVolumeSimulation();
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // ignore
      }
    }
  }

  public stopAll() {
    if (this.guardTimeout) {
      clearTimeout(this.guardTimeout);
      this.guardTimeout = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.cancelRecognition();
    this.stopVolumeSimulation();
    this.updateState('STATE_IDLE');
  }

  private updateState(newState: ConversationState) {
    this.state = newState;
    this.callbacks.onStateChange(newState);
  }

  private startVolumeSimulation() {
    this.stopVolumeSimulation();
    this.volumeInterval = setInterval(() => {
      // Simulate realistic speech RMS level between 20% and 95%
      const simulatedVol = 0.25 + Math.random() * 0.7;
      this.callbacks.onVolumeChange?.(simulatedVol);
    }, 100);
  }

  private startAudioVisualizerSimulation() {
    this.stopVolumeSimulation();
    this.volumeInterval = setInterval(() => {
      const simulatedVol = 0.4 + Math.random() * 0.55;
      this.callbacks.onVolumeChange?.(simulatedVol);
    }, 120);
  }

  private stopVolumeSimulation() {
    if (this.volumeInterval) {
      clearInterval(this.volumeInterval);
      this.volumeInterval = null;
    }
    this.callbacks.onVolumeChange?.(0.05);
  }

  private playBeepSound() {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 pleasant chime
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      }
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }
}
