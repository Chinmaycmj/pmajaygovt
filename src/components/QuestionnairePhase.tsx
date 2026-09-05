import React, { useState } from 'react';
import {
  RotateCcw,
  Keyboard,
  Send,
  Volume2,
  Mic,
  CheckCircle,
  HelpCircle,
  SkipForward,
  Sparkles,
} from 'lucide-react';
import { ConversationState, LanguageCode, UserProfileData } from '../types';
import { QUESTIONS_CONFIG, UI_STRINGS } from '../data/translations';
import { StatusPill } from './StatusPill';
import { VisualizerWave } from './VisualizerWave';
import { playTapChime } from '../services/audioChimes';

interface QuestionnairePhaseProps {
  currentQuestionIndex: number;
  currentPrompt: string;
  recognizedText: string;
  conversationState: ConversationState;
  currentLang: LanguageCode;
  volume: number;
  userProfile: UserProfileData;
  onRepeat: () => void;
  onSubmitAnswer: (answer: string) => void;
  onSkip: () => void;
}

export const QuestionnairePhase: React.FC<QuestionnairePhaseProps> = ({
  currentQuestionIndex,
  currentPrompt,
  recognizedText,
  conversationState,
  currentLang,
  volume,
  userProfile,
  onRepeat,
  onSubmitAnswer,
  onSkip,
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualText, setManualText] = useState('');
  const strings = UI_STRINGS[currentLang];
  const questionDef = QUESTIONS_CONFIG[currentQuestionIndex];
  const suggestions = questionDef?.quickSuggestions?.[currentLang] || [];

  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (manualText.trim()) {
      playTapChime();
      onSubmitAnswer(manualText.trim());
      setManualText('');
      setShowManualInput(false);
    }
  };

  const handleChipClick = (val: string) => {
    playTapChime();
    onSubmitAnswer(val);
  };

  const isSpeaking = conversationState === 'STATE_AI_SPEAKING';
  const isListening = conversationState === 'STATE_LISTENING';

  return (
    <div className="flex-1 flex flex-col px-5 sm:px-7 py-4 max-w-lg mx-auto w-full overflow-y-auto selection:bg-amber-500/30">
      {/* Turn & Progress Bar with Warm Gold Gradient */}
      <div className="w-full mb-3">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Question {currentQuestionIndex + 1} of 9</span>
          </span>
          <span className="text-amber-400 font-extrabold">
            {Math.round(((currentQuestionIndex + 1) / 9) * 100)}% Profile Built
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-zinc-800/90 overflow-hidden p-0.5 border border-zinc-700/60 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 transition-all duration-500 ease-out shadow-xs shadow-amber-500/50"
            style={{ width: `${((currentQuestionIndex + 1) / 9) * 100}%` }}
          />
        </div>
      </div>

      {/* Real-Time Half-Duplex Mutex Status Pill */}
      <div className="my-1.5 flex justify-center">
        <StatusPill state={conversationState} showGuardNotice={true} />
      </div>

      {/* Visualizer & Pulsing Multi-Ring Concentric Voice Sphere */}
      <div className="my-3 flex flex-col items-center justify-center relative">
        <div className="relative flex items-center justify-center">
          {/* Outer Ambient Glow Aura */}
          <div
            className={`absolute rounded-full blur-xl transition-all duration-700 ${
              isListening
                ? 'w-36 h-36 bg-emerald-500/25 animate-pulse'
                : isSpeaking
                ? 'w-36 h-36 bg-amber-500/30 animate-pulse'
                : 'w-24 h-24 bg-blue-600/10'
            }`}
          />

          {/* Animated Concentric Halo Rings */}
          <div
            className={`absolute rounded-full transition-all duration-700 ease-out ${
              isListening
                ? 'w-32 h-32 border-2 border-emerald-500/40 animate-ping'
                : isSpeaking
                ? 'w-30 h-30 border-2 border-amber-500/40 animate-pulse'
                : 'w-24 h-24 border border-zinc-700/40'
            }`}
          />

          <div
            className={`absolute rounded-full transition-all duration-500 ${
              isListening
                ? 'w-26 h-26 bg-emerald-500/15'
                : isSpeaking
                ? 'w-26 h-26 bg-amber-500/20'
                : 'w-22 h-22 bg-zinc-800/20'
            }`}
          />

          {/* Core Interactive Sphere with Multi-Layered Drop Shadows */}
          <div
            className={`relative w-22 h-22 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-neon-emerald scale-110'
                : isSpeaking
                ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-neon-amber scale-105'
                : 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-300 border border-zinc-700 shadow-warm-md'
            }`}
            style={{
              transform: isListening && volume > 10 ? `scale(${1 + Math.min(volume, 40) / 100})` : undefined,
            }}
          >
            {isSpeaking ? (
              <Volume2 className="w-10 h-10 animate-pulse drop-shadow-md text-amber-100" />
            ) : (
              <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce drop-shadow-md text-emerald-100' : ''}`} />
            )}
          </div>
        </div>

        {/* Real-Time Audio Frequency Bars */}
        <div className="w-full max-w-[240px] mt-3">
          <VisualizerWave state={conversationState} volume={volume} />
        </div>
      </div>

      {/* Large Readable Question Card (Warm Glassmorphic Surface) */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1B1B26] via-[#14141E] to-[#1E1914] p-5 sm:p-6 shadow-warm-lg relative mb-3 border border-amber-500/25 text-zinc-100">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <span className="text-[11px] font-black text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40 uppercase tracking-wide shadow-xs">
            PM-AJAY Query #{currentQuestionIndex + 1}
          </span>
          <button
            onClick={() => {
              playTapChime();
              onRepeat();
            }}
            className="text-xs font-bold text-zinc-200 hover:text-amber-300 flex items-center gap-1.5 bg-zinc-800/90 hover:bg-zinc-750 px-2.5 py-1 rounded-lg border border-zinc-700 transition active:scale-95 shadow-xs"
            title="Re-speak question"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Repeat</span>
          </button>
        </div>

        <p className="text-lg sm:text-xl font-bold text-white leading-snug font-sans">
          {currentPrompt}
        </p>

        {/* Dynamic Name Pill if entity injected in Q2 */}
        {currentQuestionIndex === 1 && userProfile.name && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/40 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Verified Beneficiary: <strong className="text-white font-bold">{userProfile.name}</strong></span>
          </div>
        )}
      </div>

      {/* Spoken Live Transcript Card */}
      <div className="rounded-2xl bg-[#111116] text-zinc-100 p-4 border border-zinc-800 shadow-inner mb-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            Live Spoken Transcript
          </span>
          {isListening && (
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full animate-pulse font-bold">
              ● Listening Now
            </span>
          )}
        </div>

        <p className="text-sm font-medium leading-relaxed min-h-[42px] flex items-center">
          {recognizedText ? (
            <span className="text-white font-semibold">{recognizedText}</span>
          ) : isListening ? (
            <span className="text-zinc-400 italic">Listening to your voice... Speak clearly into mic.</span>
          ) : isSpeaking ? (
            <span className="text-zinc-500 italic">Microphone muted while assistant asks question.</span>
          ) : (
            <span className="text-zinc-500 italic">Tap repeat or answer below.</span>
          )}
        </p>
      </div>

      {/* Quick Suggestions / Touch Chips for Ambient Noise Resilience */}
      {suggestions.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Quick Options (Tap or Say):</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(option)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-zinc-850 hover:bg-amber-950/70 text-zinc-200 hover:text-amber-300 border border-zinc-700/80 hover:border-amber-500/50 transition active:scale-95 shadow-warm-sm"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual Input Drawer / Noise Fallback Toggle */}
      {showManualInput && (
        <form onSubmit={handleManualSubmit} className="mb-4 bg-zinc-900/95 p-3 rounded-2xl border border-amber-500/50 shadow-neon-amber animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Type answer manually (if noisy)..."
              className="flex-1 text-sm bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={!manualText.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-md shadow-amber-900/40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Next</span>
            </button>
          </div>
        </form>
      )}

      {/* Action Buttons (Repeat / Type / Skip) */}
      <div className="grid grid-cols-3 gap-2 mt-auto pt-2">
        <button
          id="btn-repeat-question"
          onClick={() => {
            playTapChime();
            onRepeat();
          }}
          className="py-2.5 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-700/80 transition active:scale-95 shadow-warm-sm"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Repeat</span>
        </button>

        <button
          id="btn-manual-type"
          onClick={() => {
            playTapChime();
            setShowManualInput(!showManualInput);
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition active:scale-95 shadow-warm-sm ${
            showManualInput
              ? 'bg-amber-600 text-white border-amber-500 shadow-neon-amber'
              : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80'
          }`}
        >
          <Keyboard className="w-4 h-4 text-amber-400" />
          <span>Type / Edit</span>
        </button>

        <button
          id="btn-skip-question"
          onClick={() => {
            playTapChime();
            onSkip();
          }}
          className="py-2.5 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-700/80 transition active:scale-95 shadow-warm-sm"
        >
          <SkipForward className="w-4 h-4 text-zinc-400" />
          <span>Skip</span>
        </button>
      </div>
    </div>
  );
};
