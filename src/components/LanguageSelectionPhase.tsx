import React from 'react';
import { Volume2, Mic, ArrowRight, Check, Sparkles, ArrowLeft, Languages } from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { playTapChime } from '../services/audioChimes';

interface LanguageSelectionPhaseProps {
  onSelectLanguage: (lang: LanguageCode) => void;
  onPlayIntroPrompt: () => void;
  onPlaySamplePrompt?: (lang: LanguageCode) => void;
  isSpeaking: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const LanguageSelectionPhase: React.FC<LanguageSelectionPhaseProps> = ({
  onSelectLanguage,
  onPlayIntroPrompt,
  onPlaySamplePrompt,
  isSpeaking,
  onBack,
  title = 'Step 1: Choose Your Language',
}) => {
  const handleCardClick = (code: LanguageCode) => {
    playTapChime();
    onSelectLanguage(code);
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-5 sm:px-7 py-6 max-w-lg mx-auto w-full selection:bg-amber-500/30 overflow-y-auto">
      {/* Back button if available */}
      {onBack && (
        <button
          onClick={() => {
            playTapChime();
            onBack();
          }}
          className="self-start mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-amber-300 transition px-2.5 py-1 rounded-xl hover:bg-zinc-850/80 border border-transparent hover:border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Welcome</span>
        </button>
      )}

      {/* Banner with Warm Ambient Lighting */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1B1B26] via-[#14141E] to-[#1F1914] border border-amber-500/20 text-zinc-100 p-6 shadow-warm-lg text-center mb-6 relative overflow-hidden">
        {/* Ambient Warm Orb */}
        <div className="absolute top-0 right-1/4 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/40 shadow-xs">
          <Languages className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Multilingual Voice AI</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black leading-tight mb-1 text-white">
          {title}
        </h2>
        <div className="flex items-center justify-center gap-2 text-xs font-bold mb-3">
          <span className="text-amber-300">अपनी भाषा चुनें</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="text-emerald-400">ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto">
          Select your mother tongue. The assistant will converse with you naturally using high-quality native speech synthesis.
        </p>

        <button
          onClick={() => {
            playTapChime();
            onPlayIntroPrompt();
          }}
          className={`mt-4 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95 shadow-md ${
            isSpeaking
              ? 'bg-amber-500 text-black shadow-neon-amber animate-pulse'
              : 'text-amber-300 bg-amber-950/70 border border-amber-600/50 hover:bg-amber-900/80'
          }`}
        >
          <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
          <span>{isSpeaking ? 'Playing Voice Prompt...' : 'Listen to Audio Guide'}</span>
        </button>
      </div>

      {/* 3 Rich, Tactile Language Cards with Jewel-Tone Glows */}
      <div className="space-y-3.5 mb-6">
        {/* English Card */}
        <div
          id="lang-select-en"
          onClick={() => handleCardClick('en')}
          className="w-full text-left group bg-gradient-to-r from-zinc-900/90 via-zinc-900/80 to-blue-950/40 hover:to-blue-900/50 border border-zinc-800 hover:border-blue-500/60 rounded-3xl p-4 sm:p-5 shadow-warm-md hover:shadow-neon-blue transition-all duration-200 active:scale-[0.98] flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-blue-950/80 group-hover:bg-blue-600 text-blue-300 group-hover:text-white border border-blue-700/50 flex items-center justify-center font-black text-base transition-all shadow-inner">
              EN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-tight">
                  English
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  India
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Indian English • Universal Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onPlaySamplePrompt && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playTapChime();
                  onPlaySamplePrompt('en');
                }}
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-blue-600 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-700/80 transition"
                title="Preview English voice"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-blue-950/70 group-hover:bg-blue-600 group-hover:text-white text-blue-400 border border-blue-700/50 flex items-center justify-center transition">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Hindi (हिन्दी) Card - Warm Saffron & Gold Theme */}
        <div
          id="lang-select-hi"
          onClick={() => handleCardClick('hi')}
          className="w-full text-left group bg-gradient-to-r from-zinc-900/90 via-zinc-900/80 to-amber-950/40 hover:to-amber-900/50 border border-zinc-800 hover:border-amber-500/60 rounded-3xl p-4 sm:p-5 shadow-warm-md hover:shadow-neon-amber transition-all duration-200 active:scale-[0.98] flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-amber-950/80 group-hover:bg-amber-500 text-amber-300 group-hover:text-black border border-amber-700/50 flex items-center justify-center font-black text-lg transition-all shadow-inner">
              हि
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-tight">
                  हिन्दी (Hindi)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  राजभाषा
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                देवनागरी लिपि • सम्पूर्ण भारत
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onPlaySamplePrompt && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playTapChime();
                  onPlaySamplePrompt('hi');
                }}
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 flex items-center justify-center border border-zinc-700/80 transition"
                title="Preview Hindi voice"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-amber-950/70 group-hover:bg-amber-500 group-hover:text-black text-amber-400 border border-amber-700/50 flex items-center justify-center transition">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Kannada (ಕನ್ನಡ) Card - Emerald & Teal Theme */}
        <div
          id="lang-select-kn"
          onClick={() => handleCardClick('kn')}
          className="w-full text-left group bg-gradient-to-r from-zinc-900/90 via-zinc-900/80 to-emerald-950/40 hover:to-emerald-900/50 border border-zinc-800 hover:border-emerald-500/60 rounded-3xl p-4 sm:p-5 shadow-warm-md hover:shadow-neon-emerald transition-all duration-200 active:scale-[0.98] flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-emerald-950/80 group-hover:bg-emerald-500 text-emerald-300 group-hover:text-black border border-emerald-700/50 flex items-center justify-center font-black text-lg transition-all shadow-inner">
              ಕ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white leading-tight">
                  ಕನ್ನಡ (Kannada)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  ಕರ್ನಾಟಕ
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                ಕನ್ನಡ ಲಿಪಿ • Karnataka
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onPlaySamplePrompt && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playTapChime();
                  onPlaySamplePrompt('kn');
                }}
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-black text-zinc-300 flex items-center justify-center border border-zinc-700/80 transition"
                title="Preview Kannada voice"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-emerald-950/70 group-hover:bg-emerald-500 group-hover:text-black text-emerald-400 border border-emerald-700/50 flex items-center justify-center transition">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Voice Recognition Prompt Bar */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center flex items-center justify-center gap-2 text-xs text-zinc-300 shadow-xs">
        <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>You can also say <strong className="text-white">&quot;English&quot;</strong>, <strong className="text-amber-300">&quot;Hindi&quot;</strong>, or <strong className="text-emerald-400">&quot;Kannada&quot;</strong></span>
      </div>
    </div>
  );
};
