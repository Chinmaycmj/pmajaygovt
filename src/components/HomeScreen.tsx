import React from 'react';
import {
  PhoneCall,
  Mic,
  Sparkles,
  Languages,
  Landmark,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
  Award,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { AppLogo } from './AppLogo';
import { LanguageCode } from '../types';
import { UI_STRINGS, SUPPORTED_LANGUAGES } from '../data/translations';
import { playTapChime } from '../services/audioChimes';

interface HomeScreenProps {
  currentLang: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onChangeLanguageScreen: () => void;
  onConnectCall: () => void;
  onConnectVoice: () => void;
  onConnectChat: () => void;
  onOpenCodeInspector: () => void;
  onBackToStart: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLang,
  onSelectLanguage,
  onChangeLanguageScreen,
  onConnectCall,
  onConnectVoice,
  onConnectChat,
  onOpenCodeInspector,
  onBackToStart,
}) => {
  const strings = UI_STRINGS[currentLang];
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-b from-[#0D0E15] via-[#09090D] to-[#070709] text-zinc-100 pb-8 selection:bg-amber-500/30">
      {/* Top Government App Bar (Material 3 Glass Surface with Warm Gold Accents) */}
      <header className="sticky top-0 z-20 bg-[#09090D]/95 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                playTapChime();
                onBackToStart();
              }}
              className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-amber-300 flex items-center justify-center transition active:scale-95"
              title="Return to Welcome Screen"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-0.5 flex items-center justify-center shadow-md shadow-amber-950/60 text-white shrink-0 ring-1 ring-amber-400/40">
              <AppLogo size="sm" animated={false} />
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-tight text-zinc-100 leading-tight">
                {strings.appName}
              </h1>
              <p className="text-[10px] font-medium text-amber-400/90 truncate max-w-[170px] sm:max-w-none">
                {strings.department}
              </p>
            </div>
          </div>

          {/* Language Switcher Pill */}
          <button
            onClick={() => {
              playTapChime();
              onChangeLanguageScreen();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-850 border border-amber-500/30 text-xs font-semibold text-amber-300 transition active:scale-95 shadow-xs"
            title="Change Language"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLangObj.nativeLabel}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="px-5 pt-4 pb-6 flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* Government Scheme Banner with Warm Lighting & Gold Badges */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1C1B26] via-[#14141E] to-[#201A12] border border-amber-500/25 text-zinc-100 p-5 sm:p-6 shadow-warm-lg relative overflow-hidden mb-5">
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>PM-AJAY 2026 Initiative</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Portal v2.6
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug mb-2 font-sans text-zinc-100">
            {strings.homeTitle}
          </h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {strings.homeSubtitle}
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Free Voice Access
            </span>
            <button
              onClick={() => {
                playTapChime();
                onChangeLanguageScreen();
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
            >
              Change Language
            </button>
          </div>
        </div>

        {/* PRIMARY ACTION CARDS */}
        <div className="space-y-4">
          {/* Action 1: Connect via Voice Assistant (In-App Voice Chat) with Shimmer & Warm Glow */}
          <button
            id="btn-connect-voice"
            onClick={() => {
              playTapChime();
              onConnectVoice();
            }}
            className="w-full text-left group relative bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 border border-amber-400/40 text-white rounded-3xl p-5 shadow-neon-amber shimmer-btn active:scale-[0.98] transition-all duration-200 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xs border border-white/30 shadow-inner group-hover:scale-105 transition-transform">
                <Mic className="w-7 h-7 animate-pulse text-amber-200" />
              </div>
              <div>
                <span className="inline-block text-[11px] font-black text-amber-100 uppercase tracking-wider bg-black/30 px-2.5 py-0.5 rounded-md border border-white/20 mb-1">
                  AI Smart Voice Chat
                </span>
                <h3 className="text-lg font-black text-white leading-tight">
                  {strings.connectViaVoiceTitle}
                </h3>
                <p className="text-xs text-amber-100/90 mt-0.5 font-medium">
                  {strings.connectViaVoiceDesc}
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:bg-white/30 transition shrink-0 ml-2 shadow-xs">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {/* Action 2: Connect via Call (Toll-Free IVR) */}
          <button
            id="btn-connect-call"
            onClick={() => {
              playTapChime();
              onConnectCall();
            }}
            className="w-full text-left group relative bg-gradient-to-r from-zinc-900/90 via-zinc-900/80 to-blue-950/40 hover:bg-zinc-850 border border-zinc-800 hover:border-blue-500/50 rounded-3xl p-5 shadow-warm-md hover:shadow-neon-blue transition-all duration-200 active:scale-[0.98] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-950/80 group-hover:bg-blue-600 text-blue-400 group-hover:text-white border border-blue-700/50 flex items-center justify-center transition-colors shadow-inner">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold text-blue-400 uppercase tracking-wider bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-800/50 mb-1">
                  Toll-Free IVR Helpline
                </span>
                <h3 className="text-lg font-bold text-zinc-100 leading-tight">
                  {strings.connectViaCallTitle}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Dial <span className="font-bold text-blue-300 font-mono">1800 111 222</span> (Zero Internet)
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 group-hover:text-zinc-200 flex items-center justify-center transition border border-zinc-700 shrink-0 ml-2">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>

          {/* Action 3: Connect via Smart Chat Mode */}
          <button
            id="btn-connect-chat"
            onClick={() => {
              playTapChime();
              onConnectChat();
            }}
            className="w-full text-left group relative bg-gradient-to-r from-zinc-900/90 via-zinc-900/80 to-emerald-950/30 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-5 shadow-warm-md hover:shadow-neon-emerald transition-all duration-200 active:scale-[0.98] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 group-hover:bg-emerald-600 text-emerald-400 group-hover:text-white border border-emerald-700/50 flex items-center justify-center transition-colors shadow-inner">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/50 mb-1">
                  Text & Voice-Typing
                </span>
                <h3 className="text-lg font-bold text-zinc-100 leading-tight">
                  PM-AJAY Smart Chat
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Interactive messaging with voice-typing & quick suggestions
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-400 group-hover:text-zinc-200 flex items-center justify-center transition border border-zinc-700 shrink-0 ml-2">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Informative Beneficiary Guidance with Warm Accent Border */}
        <div className="mt-6 rounded-2xl bg-[#14141C]/80 border border-amber-500/20 p-4 shadow-warm-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-950/70 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                <span>Who is eligible for PM-AJAY Livelihood Support?</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">Priority</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                Scheduled Caste (SC) individuals and rural/urban households seeking free vocational skilling, ₹15,000 toolkits, or up to ₹50,000 self-employment grants.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Technical Link */}
        <div className="mt-auto pt-6 text-center">
          <button
            onClick={() => {
              playTapChime();
              onOpenCodeInspector();
            }}
            className="text-xs font-semibold text-zinc-500 hover:text-amber-400 transition underline underline-offset-4"
          >
            Inspect Android Studio Kotlin Source (Staff Bug Fixes)
          </button>
        </div>
      </div>
    </div>
  );
};
