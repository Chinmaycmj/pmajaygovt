import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  Radio,
  Sparkles,
  CheckCircle2,
  User,
  Bot,
  Keyboard,
  Send,
  HelpCircle,
} from 'lucide-react';
import { ConversationState, LanguageCode, UserProfileData } from '../types';
import { QUESTIONS_CONFIG, UI_STRINGS } from '../data/translations';
import { generateNaturalAcknowledgement } from '../services/acknowledgementGenerator';
import { playMicListeningChime, playSuccessChime, playTapChime } from '../services/audioChimes';

interface CallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  userProfile: UserProfileData;
  onUpdateProfile: (updater: (prev: UserProfileData) => UserProfileData) => void;
  onCompleteCall?: () => void;
  initialQuestionIndex?: number;
  onSyncQuestionIndex?: (idx: number) => void;
}

type CallConnectionState =
  | 'CONNECTING'
  | 'CONNECTED'
  | 'AI_SPEAKING'
  | 'LISTENING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'DISCONNECTED';

export const CallSimulatorModal: React.FC<CallSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  userProfile,
  onUpdateProfile,
  onCompleteCall,
  initialQuestionIndex = 0,
  onSyncQuestionIndex,
}) => {
  const [callState, setCallState] = useState<CallConnectionState>('CONNECTING');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [qIndex, setQIndex] = useState(initialQuestionIndex);
  const [spokenPrompt, setSpokenPrompt] = useState('');
  const [callerTranscript, setCallerTranscript] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [lastAcknowledgement, setLastAcknowledgement] = useState('');

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<any>(null);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;

  // Sync initial question index if provided
  useEffect(() => {
    if (isOpen) {
      setQIndex(initialQuestionIndex);
    }
  }, [isOpen, initialQuestionIndex]);

  // Setup Web Speech Synthesis & Recognition for two-way phone call
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = true;
          recognitionRef.current = rec;
        } catch (e) {
          console.warn('Call speech recognition init error:', e);
        }
      }
    }
  }, []);

  // Cleanup helper
  const haltAllAudio = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore inactive stop
      }
    }
  }, []);

  // Start speech recognition for caller
  const startListeningToCaller = useCallback(() => {
    if (isMutedRef.current) {
      console.log('Microphone is muted, skipping recognition start');
      return;
    }

    if (!recognitionRef.current) {
      // Fallback if browser lacks recognition
      setCallState('LISTENING');
      return;
    }

    const locale = currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    recognitionRef.current.lang = locale;

    recognitionRef.current.onstart = () => {
      setCallState('LISTENING');
      playMicListeningChime();
    };

    recognitionRef.current.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text;
        } else {
          interim += text;
        }
      }

      if (interim) {
        setCallerTranscript(interim);
      }
      if (final) {
        setCallerTranscript(final.trim());
        processCallerAnswer(final.trim());
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.warn('Call recognition error:', event.error);
      if (event.error === 'no-speech' || event.error === 'network') {
        // Soft fallback to listening
        setCallState('LISTENING');
      }
    };

    recognitionRef.current.onend = () => {
      // If ended without final, keep UI ready
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already running or permission issue
      setCallState('LISTENING');
    }
  }, [currentLang]);

  // AI speaks through the telephone call audio stream
  const speakAiResponse = useCallback(
    (textToSpeak: string, onSpeechFinished: () => void) => {
      haltAllAudio();
      setCallState('AI_SPEAKING');
      setSpokenPrompt(textToSpeak);

      if (!synthRef.current) {
        // Fallback for environments without speech synthesis
        setTimeout(() => {
          onSpeechFinished();
        }, 3000);
        return;
      }

      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      activeUtteranceRef.current = utterance;

      const locale = currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.lang = locale;
      // Gentle, soft, and polite acoustic parameters
      utterance.rate = 0.87; // Soft, calm, unrushed pace
      utterance.pitch = 1.03; // Gentle, warm tone
      utterance.volume = isSpeaker ? 0.92 : 0.65; // Soft, comfortable volume

      // Select softest, most natural regional voice
      const voices = synthRef.current.getVoices();
      const candidateVoices = voices.filter(
        (v) =>
          v.lang === locale ||
          v.lang.startsWith(locale.split('-')[0]) ||
          (currentLang === 'hi' && v.name.toLowerCase().includes('hindi')) ||
          (currentLang === 'kn' && v.name.toLowerCase().includes('kannada')) ||
          (currentLang === 'en' && v.lang.startsWith('en'))
      );

      if (candidateVoices.length > 0) {
        const softKeywords = ['natural', 'swara', 'neerja', 'female', 'google', 'soft', 'kalpana', 'lekha', 'heera', 'geeta'];
        const scored = candidateVoices.map((v) => {
          const lower = v.name.toLowerCase();
          let score = 0;
          if (v.lang === locale) score += 5;
          for (const kw of softKeywords) {
            if (lower.includes(kw)) score += 3;
          }
          return { voice: v, score };
        });
        scored.sort((a, b) => b.score - a.score);
        utterance.voice = scored[0].voice;
      }

      utterance.onend = () => {
        // Acoustic guard delay (300ms) before opening microphone to prevent self-echo
        setTimeout(() => {
          onSpeechFinished();
        }, 350);
      };

      utterance.onerror = (e) => {
        console.warn('TTS utterance error during call:', e);
        setTimeout(() => {
          onSpeechFinished();
        }, 800);
      };

      synthRef.current.speak(utterance);
    },
    [currentLang, isSpeaker, haltAllAudio]
  );

  // Deliver a Question Turn
  const deliverQuestionTurn = useCallback(
    (index: number, acknowledgementPrefix = '') => {
      const qDef = QUESTIONS_CONFIG[index];
      if (!qDef) return;

      let qText = qDef.prompts[currentLang] || qDef.prompts.en;
      if (index === 1) {
        const nameToInject = userProfile.name.trim() || 'Beneficiary';
        qText = qText.replace('{Name}', nameToInject);
      }

      // Combine natural gratitude acknowledgement with question
      const fullSpeech = acknowledgementPrefix ? `${acknowledgementPrefix} ${qText}` : qText;

      speakAiResponse(fullSpeech, () => {
        startListeningToCaller();
      });
    },
    [currentLang, userProfile, speakAiResponse, startListeningToCaller]
  );

  // Process Caller Answer
  const processCallerAnswer = useCallback(
    (rawAnswer: string) => {
      const answer = rawAnswer.trim();
      if (!answer) return;

      setCallState('PROCESSING');
      haltAllAudio();

      const currentQ = QUESTIONS_CONFIG[qIndex];
      const slotKey = currentQ?.slotKey;

      // Generate natural, varied context-aware acknowledgement with gratitude
      const naturalAck = generateNaturalAcknowledgement(qIndex, answer, currentLang, userProfile);
      setLastAcknowledgement(naturalAck);

      // Save to user profile
      if (slotKey) {
        onUpdateProfile((prev) => ({
          ...prev,
          [slotKey]: answer,
          name: slotKey === 'name' ? answer : prev.name,
        }));
      }

      // Move to next question or complete call
      if (qIndex < QUESTIONS_CONFIG.length - 1) {
        const nextIndex = qIndex + 1;
        setQIndex(nextIndex);
        onSyncQuestionIndex?.(nextIndex);
        setCallerTranscript('');

        // Deliver next turn with the natural acknowledgement prefix
        setTimeout(() => {
          deliverQuestionTurn(nextIndex, naturalAck);
        }, 200);
      } else {
        // Complete the 9 questions
        playSuccessChime();
        setCallState('COMPLETED');
        const finalSummaryText =
          currentLang === 'hi'
            ? `${naturalAck} आपकी सभी जानकारी पीएम-अजय पोर्टल पर आदरपूर्वक दर्ज कर ली गई है। आप ₹50,000 व्यवसाय अनुदान, ₹15,000 टूलकिट और निःशुल्क कौशल प्रशिक्षण के पात्र हैं। राष्ट्रीय हेल्पलाइन पर संपर्क करने के लिए आपका हृदय से आभार।`
            : currentLang === 'kn'
            ? `${naturalAck} ತಮ್ಮ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಪಿಎಂ-ಅಜಯ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಗೌರವಯುತವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ. ತಾವು ₹50,000 ಉದ್ಯಮ ಅನುದಾನ ಮತ್ತು ₹15,000 ಉಚಿತ ಟೂಲ್‌ಕಿಟ್ ಪಡೆಯಲು ಅರ್ಹರಾಗಿದ್ದೀರಿ. ಸಹಾಯವಾಣಿಗೆ ಕರೆ ಮಾಡಿದ್ದಕ್ಕಾಗಿ ತುಂಬು ಹೃದಯದ ಧನ್ಯವಾದಗಳು.`
            : `${naturalAck} Your details have been safely and respectfully registered on the PM-AJAY portal. You qualify for ₹50,000 Enterprise Grants, ₹15,000 Industrial Toolkits, and free skilling courses. Thank you so kindly for calling our national helpline.`;

        speakAiResponse(finalSummaryText, () => {
          // Call finished speaking final summary
          onCompleteCall?.();
        });
      }
    },
    [
      qIndex,
      currentLang,
      userProfile,
      onUpdateProfile,
      onSyncQuestionIndex,
      deliverQuestionTurn,
      speakAiResponse,
      onCompleteCall,
      haltAllAudio,
    ]
  );

  // Initialize Call when Modal opens
  useEffect(() => {
    if (isOpen) {
      setCallState('CONNECTING');
      setCallDuration(0);
      setCallerTranscript('');
      setIsMuted(false);

      // 1. Simulate fast carrier dial & connect (700ms)
      const connectTimeout = setTimeout(() => {
        setCallState('CONNECTED');

        // 2. AI Speaks Opening Turn
        setTimeout(() => {
          deliverQuestionTurn(qIndex);
        }, 400);
      }, 700);

      // Start Call Timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(connectTimeout);
        if (timerRef.current) clearInterval(timerRef.current);
        haltAllAudio();
      };
    } else {
      haltAllAudio();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    playTapChime();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (nextMuted) {
      // Actually mute: stop recognition immediately
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    } else {
      // Unmute: restart listening if call is in listening state
      if (callState === 'LISTENING') {
        startListeningToCaller();
      }
    }
  };

  const handleToggleSpeaker = () => {
    playTapChime();
    setIsSpeaker((prev) => !prev);
  };

  const handleEndCall = () => {
    playTapChime();
    haltAllAudio();
    setCallState('DISCONNECTED');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleManualAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      playTapChime();
      processCallerAnswer(manualInput.trim());
      setManualInput('');
      setShowManualInput(false);
    }
  };

  const handleChipClick = (suggestion: string) => {
    playTapChime();
    processCallerAnswer(suggestion);
  };

  const currentQ = QUESTIONS_CONFIG[qIndex];
  const suggestions = currentQ?.quickSuggestions?.[currentLang] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 selection:bg-blue-600/30 animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-[#0F111E] via-[#090A12] to-[#06070B] rounded-[36px] border border-blue-500/30 p-6 text-zinc-100 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Ambient Radial Lighting */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Government Scheme Authority Header */}
        <div className="w-full flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-600/40 text-blue-300 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>National Livelihood Voice Exchange</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>2-Way Voice</span>
          </div>
        </div>

        {/* Central Telephone Identification & State Avatar */}
        <div className="relative my-2">
          {/* Animated Acoustic Waves Halo */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
              callState === 'AI_SPEAKING'
                ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.4)] scale-105'
                : callState === 'LISTENING'
                ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.4)] scale-105'
                : callState === 'PROCESSING'
                ? 'bg-blue-500/20 border-2 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse'
                : 'bg-zinc-850 border-2 border-zinc-700 text-zinc-400'
            }`}
          >
            {callState === 'AI_SPEAKING' ? (
              <Bot className="w-12 h-12 text-amber-300 animate-pulse" />
            ) : callState === 'LISTENING' ? (
              <Mic className="w-12 h-12 text-emerald-300 animate-bounce" />
            ) : (
              <Phone className="w-12 h-12 text-blue-400" />
            )}
          </div>

          {/* Indicator Dot */}
          <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                callState === 'AI_SPEAKING'
                  ? 'bg-amber-400 animate-ping'
                  : callState === 'LISTENING'
                  ? 'bg-emerald-400 animate-ping'
                  : callState === 'PROCESSING'
                  ? 'bg-blue-400 animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
          </div>
        </div>

        {/* Call Headline & Details */}
        <h3 className="text-lg sm:text-xl font-black tracking-tight text-white mt-2">
          PM-AJAY Livelihood Assistant
        </h3>
        <p className="text-xs sm:text-sm font-mono text-blue-400 font-bold tracking-widest mt-0.5">
          1800 111 222 • Toll-Free
        </p>

        {/* Dynamic Status & Call Duration Timer */}
        <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
          <span
            className={`px-3 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${
              callState === 'AI_SPEAKING'
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                : callState === 'LISTENING'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : callState === 'PROCESSING'
                ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                : 'bg-zinc-850 text-zinc-300 border-zinc-700'
            }`}
          >
            {callState === 'CONNECTING' && <span>Connecting...</span>}
            {callState === 'CONNECTED' && <span>Connected</span>}
            {callState === 'AI_SPEAKING' && (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>Assistant is speaking...</span>
              </>
            )}
            {callState === 'LISTENING' && (
              <>
                <Mic className="w-3.5 h-3.5 animate-bounce text-emerald-400" />
                <span>Listening... Speak now</span>
              </>
            )}
            {callState === 'PROCESSING' && <span>Understanding your response...</span>}
            {callState === 'COMPLETED' && <span>Profile Completed!</span>}
            {callState === 'DISCONNECTED' && <span>Call ended</span>}
          </span>

          <span className="font-mono text-zinc-400 text-xs font-bold">
            {formatTimer(callDuration)}
          </span>
        </div>

        {/* Real-time Dynamic Waveform Display */}
        <div className="w-full flex items-center justify-center gap-1 h-8 my-3 px-4">
          {[40, 65, 85, 55, 95, 70, 45, 80, 60, 90, 50, 75, 40].map((height, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                callState === 'AI_SPEAKING'
                  ? 'bg-gradient-to-t from-amber-500 to-orange-400'
                  : callState === 'LISTENING'
                  ? 'bg-gradient-to-t from-emerald-500 to-cyan-400'
                  : 'bg-zinc-700/50'
              }`}
              style={{
                height:
                  callState === 'AI_SPEAKING'
                    ? `${Math.max(12, height * (0.4 + (i % 3) * 0.25))}%`
                    : callState === 'LISTENING'
                    ? `${Math.max(12, height * 0.7)}%`
                    : '16%',
              }}
            />
          ))}
        </div>

        {/* Live Conversation Transcript Box */}
        <div className="w-full bg-[#121422]/90 rounded-2xl p-4 border border-zinc-800 text-left space-y-3 mb-3 shadow-inner max-h-48 overflow-y-auto">
          {/* Question Counter Pill */}
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="text-amber-300">Question {qIndex + 1} of 9</span>
            <span>Profile Progress: {Math.round(((qIndex + 1) / 9) * 100)}%</span>
          </div>

          {/* AI Spoken Line */}
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/40">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                AI Voice Response:
              </span>
              <p className="text-xs font-semibold text-zinc-100 leading-relaxed">
                {spokenPrompt || 'Connecting to voice service...'}
              </p>
            </div>
          </div>

          {/* Caller's Spoken Input (Live STT) */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-zinc-800/60">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/40">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                Caller Speech (STT):
              </span>
              <p className="text-xs font-medium text-zinc-200 italic leading-relaxed break-words">
                {callerTranscript || (
                  <span className="text-zinc-500 not-italic">
                    {callState === 'LISTENING'
                      ? 'Listening to caller speech through microphone...'
                      : 'Waiting for caller...'}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips for Fast Phone Responses */}
        {suggestions.length > 0 && callState !== 'COMPLETED' && (
          <div className="w-full mb-4">
            <span className="text-[10px] text-zinc-400 font-bold block mb-1.5 text-center">
              Quick Spoken Answer Shortcuts:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(s)}
                  className="px-2.5 py-1 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-medium border border-zinc-700 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Optional Manual Keyboard Fallback Input */}
        {showManualInput && (
          <form onSubmit={handleManualAnswerSubmit} className="w-full mb-4 flex gap-1.5">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Type caller response manually..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs disabled:opacity-40 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Call Utility Action Bar (Mute, Keyboard, Speaker) */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6 max-w-xs">
          {/* MUTE BUTTON - Actually mutes microphone */}
          <button
            onClick={handleToggleMute}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 cursor-pointer ${
              isMuted
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 ring-1 ring-rose-500/50 shadow-md'
                : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border-zinc-750'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
            <span className="text-[10px] font-bold mt-1">{isMuted ? 'Muted' : 'Mute'}</span>
          </button>

          {/* KEYBOARD INPUT TOGGLE */}
          <button
            onClick={() => {
              playTapChime();
              setShowManualInput(!showManualInput);
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 cursor-pointer ${
              showManualInput
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border-zinc-750'
            }`}
            title="Type response"
          >
            <Keyboard className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Keypad</span>
          </button>

          {/* SPEAKER TOGGLE */}
          <button
            onClick={handleToggleSpeaker}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition active:scale-95 cursor-pointer ${
              isSpeaker
                ? 'bg-blue-950/80 text-blue-300 border-blue-500/60'
                : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-400 border-zinc-750'
            }`}
            title="Toggle Speakerphone"
          >
            {isSpeaker ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-[10px] font-bold mt-1">Speaker</span>
          </button>
        </div>

        {/* PRIMARY END CALL ACTION BUTTON */}
        <button
          onClick={handleEndCall}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 hover:from-rose-600 hover:to-red-800 text-white flex items-center justify-center shadow-xl shadow-rose-950/80 transition-all active:scale-90 cursor-pointer border-2 border-rose-400/40 group"
          title="End Call"
        >
          <PhoneOff className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        </button>
        <span className="text-[11px] font-bold text-zinc-400 mt-2">End Call</span>
      </div>
    </div>
  );
};
