import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Maximize2,
  Code2,
  Volume2,
  Mic,
  Smartphone,
  Sparkles,
  Layers,
  Landmark,
  ShieldCheck,
  Zap,
  PhoneCall,
  Activity,
  Radio,
  Sliders,
  CheckCircle2,
  PanelRightClose,
  PanelRightOpen,
  Share2,
} from 'lucide-react';
import { ConversationState, LanguageCode } from '../types';
import { AppLogo } from './AppLogo';
import { playTapChime, playMicTestChime, playTradeSelectChime } from '../services/audioChimes';

interface DeviceFrameProps {
  children: React.ReactNode;
  conversationState: ConversationState;
  currentLang: LanguageCode;
  onOpenCodeInspector: () => void;
}

type ViewMode = 'FLAGSHIP_PHONE' | 'FULL_SCREEN' | 'IPHONE_MOCKUP';

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  conversationState,
  currentLang,
  onOpenCodeInspector,
}) => {
  // Default to large, wide Flagship Phone (Pro Max size: 760px wide, 100% tall)
  const [viewMode, setViewMode] = useState<ViewMode>('FLAGSHIP_PHONE');
  const [currentTime, setCurrentTime] = useState('09:41');
  const [showSidebars, setShowSidebars] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const isSpeaking = conversationState === 'STATE_AI_SPEAKING';
  const isListening = conversationState === 'STATE_LISTENING';
  const isProcessing = conversationState === 'STATE_PROCESSING';

  const handleTestGroundSound = () => {
    playMicTestChime();
  };

  const handleTradeGroundPing = () => {
    playTradeSelectChime();
  };

  return (
    <div className="w-full h-screen bg-[#05060D] ground-matrix text-zinc-100 font-sans flex flex-col items-center justify-start overflow-hidden selection:bg-amber-500/30 relative">
      {/* Dynamic Ambient Radiant Light Orbs in Background */}
      <div className="absolute top-0 left-10 w-[600px] h-[600px] bg-gradient-to-br from-amber-600/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-gradient-to-tl from-cyan-600/15 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-900/10 via-amber-900/5 to-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Control Bar - Authoritative Government of India feel */}
      <header className="w-full z-50 bg-[#090A12]/95 backdrop-blur-xl border-b border-zinc-800/80 px-3 sm:px-6 py-2 flex items-center justify-between text-xs shrink-0 shadow-lg gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-0.5 flex items-center justify-center text-white shadow-md shadow-amber-950/60 ring-1 ring-amber-400/40 shrink-0">
            <AppLogo size="sm" animated={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-amber-300 tracking-tight text-xs truncate">
                वाणी सहायक • VANI SAHAYAK
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 hidden xs:inline">
                GOVT OF INDIA
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium hidden md:block truncate">
              PM-AJAY Livelihood Voice Assistant • Ministry of Social Justice & Empowerment
            </p>
          </div>
        </div>

        {/* Action Buttons & Size Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Display Size Mode Switcher */}
          <div className="flex items-center bg-zinc-900/90 p-0.5 rounded-xl border border-zinc-800 text-[11px] font-semibold shadow-inner">
            <button
              onClick={() => {
                playTapChime();
                setViewMode('FLAGSHIP_PHONE');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'FLAGSHIP_PHONE'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Large Smartphone Display (Big 6.7-inch Flagship format)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Big Phone (6.7")</span>
              <span className="sm:hidden">Big Phone</span>
            </button>

            <button
              onClick={() => {
                playTapChime();
                setViewMode('FULL_SCREEN');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'FULL_SCREEN'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Expanded Full Screen Canvas (Max width & height)"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Full Screen</span>
            </button>

            <button
              onClick={() => {
                playTapChime();
                setViewMode('IPHONE_MOCKUP');
              }}
              className={`px-2 py-1 rounded-lg transition-all hidden lg:flex items-center gap-1 cursor-pointer ${
                viewMode === 'IPHONE_MOCKUP'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Compact iPhone Bezel"
            >
              <Layers className="w-3 h-3" />
              <span>Compact</span>
            </button>
          </div>

          {/* Toggle Sidebars (Telemetry & Scheme Data) */}
          <button
            onClick={() => {
              playTapChime();
              setShowSidebars((prev) => !prev);
            }}
            className={`hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition active:scale-95 cursor-pointer ${
              showSidebars
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-750'
            }`}
            title="Toggle Side Telemetry & Info Panels"
          >
            {showSidebars ? (
              <PanelRightClose className="w-3.5 h-3.5" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5" />
            )}
            <span>{showSidebars ? 'Hide Panels' : 'Show Panels'}</span>
          </button>

          {/* Android Kotlin Source Code Inspector */}
          <button
            onClick={() => {
              playTapChime();
              onOpenCodeInspector();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 font-medium transition text-[11px] shadow-sm active:scale-95 cursor-pointer"
            title="Inspect Android Kotlin implementation"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Kotlin</span>
          </button>
        </div>
      </header>

      {/* Main Container - Features the Smartphone Centered with Maximum Room */}
      <main className="flex-1 w-full h-[calc(100vh-48px)] flex items-center justify-center overflow-hidden p-0 sm:p-2 relative z-10 gap-4">
        
        {/* LEFT FLANKING GROUND DECK (Collapsible to keep smartphone huge) */}
        {showSidebars && (
          <aside className="hidden xl:flex flex-col gap-3 w-64 2xl:w-72 h-[96%] overflow-y-auto shrink-0 select-none animate-fade-in">
            {/* Government of India Authority Card */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-4 shadow-warm-md backdrop-blur-md">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase block">
                    सत्यमेव जयते
                  </span>
                  <span className="text-xs font-bold text-white">Govt. of India Seal</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Authorized prototype under the <strong>PM-AJAY</strong> framework. Connecting artisans,
                farmers, and rural youth to guaranteed welfare.
              </p>
              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>REF: GOI/2026/VOC</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Voice DSP Live Engine Telemetry */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-4 shadow-warm-md backdrop-blur-md">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Audio DSP Engine</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  ONLINE
                </span>
              </div>

              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Architecture:</span>
                  <span className="text-zinc-200 font-sans font-semibold">Half-Duplex Loop</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Speech Latency:</span>
                  <span className="text-emerald-400 font-bold">&lt; 14 ms</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Supported Locales:</span>
                  <span className="text-amber-400 font-bold">kn-IN • hi-IN • en-IN</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Acoustic Buffers:</span>
                  <span className="text-cyan-400 font-bold">48kHz PCM Float</span>
                </div>
              </div>

              {/* Interactive Sound Chime Probe */}
              <button
                onClick={handleTestGroundSound}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-750 text-xs font-bold text-amber-300 hover:text-amber-200 border border-amber-500/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Audio Chimes</span>
              </button>
            </div>
          </aside>
        )}

        {/* CENTER: MASSIVE, TALL & WIDE SMARTPHONE SHELL */}
        <div
          className={`flex flex-col h-full bg-[#09090D] text-zinc-100 relative overflow-hidden transition-all duration-300 ease-out z-20 ${
            viewMode === 'FLAGSHIP_PHONE'
              ? 'w-full max-w-2xl lg:max-w-3xl xl:max-w-[780px] h-full sm:h-[98%] sm:rounded-[36px] border border-zinc-800/90 shadow-2xl'
              : viewMode === 'FULL_SCREEN'
              ? 'w-full max-w-5xl h-full sm:h-[99%] sm:rounded-2xl border border-zinc-800 shadow-2xl'
              : 'w-full max-w-[440px] h-[96%] max-h-[860px] rounded-[48px] border-[10px] border-zinc-850 ring-1 ring-zinc-700/50 my-auto shadow-2xl'
          } ${
            isSpeaking
              ? 'shadow-[0_0_60px_rgba(245,158,11,0.25),0_25px_60px_-15px_rgba(0,0,0,0.95)] ring-2 ring-amber-500/60'
              : isListening
              ? 'shadow-[0_0_60px_rgba(16,185,129,0.25),0_25px_60px_-15px_rgba(0,0,0,0.95)] ring-2 ring-emerald-500/60'
              : isProcessing
              ? 'shadow-[0_0_60px_rgba(59,130,246,0.25),0_25px_60px_-15px_rgba(0,0,0,0.95)] ring-2 ring-blue-500/60'
              : 'shadow-[0_0_40px_rgba(245,158,11,0.1),0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-zinc-700/60'
          }`}
        >
          {/* iOS Dynamic Island Status Bar */}
          <div className="h-12 px-6 bg-[#09090D]/95 backdrop-blur-md text-zinc-300 flex items-center justify-between text-xs font-semibold z-40 select-none shrink-0 border-b border-zinc-800/80 relative">
            {/* Left Clock */}
            <span className="font-bold tracking-tight text-[13px] text-zinc-200 font-mono">
              {currentTime}
            </span>

            {/* Centered Dynamic Island Pill with Reactive Glow */}
            <div
              className={`h-7 rounded-full bg-black border border-zinc-800/90 flex items-center justify-between px-3 transition-all duration-300 shadow-md ${
                isSpeaking
                  ? 'w-52 ring-2 ring-amber-500/40 shadow-amber-950/50'
                  : isListening
                  ? 'w-52 ring-2 ring-emerald-500/40 shadow-emerald-950/50'
                  : isProcessing
                  ? 'w-40 ring-1 ring-blue-500/30'
                  : 'w-32'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700/70 shadow-inner flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900" />
                </div>
                {isSpeaking && (
                  <span className="text-[10px] text-amber-400 font-semibold animate-pulse flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-amber-300" />
                    <span>AI Speaking</span>
                  </span>
                )}
                {isListening && (
                  <span className="text-[10px] text-emerald-400 font-semibold animate-pulse flex items-center gap-1">
                    <Mic className="w-3 h-3 text-emerald-300 animate-bounce" />
                    <span>Listening...</span>
                  </span>
                )}
                {isProcessing && (
                  <span className="text-[10px] text-blue-400 font-semibold">Processing</span>
                )}
                {!isSpeaking && !isListening && !isProcessing && (
                  <span className="text-[10px] text-zinc-400 font-medium">Vani Sahayak</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {isListening && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
                {isSpeaking && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
                <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
              </div>
            </div>

            {/* Right Status Icons */}
            <div className="flex items-center gap-2.5 text-[11px]">
              <span className="text-[10px] font-extrabold text-amber-400/90 tracking-wider">5G</span>
              <Wifi className="w-3.5 h-3.5 text-zinc-300" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* App Body Content - Spacious, Tall & Smooth Scrolling */}
          <div className="flex-1 overflow-hidden relative flex flex-col bg-[#09090D] text-zinc-100">
            {children}
          </div>

          {/* Bottom Gesture Pill Bar */}
          <div className="h-6 bg-[#09090D] flex items-center justify-center shrink-0 z-30 border-t border-zinc-900/80">
            <div className="w-40 h-1 rounded-full bg-zinc-600/80 hover:bg-zinc-400 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* RIGHT FLANKING GROUND DECK (Collapsible) */}
        {showSidebars && (
          <aside className="hidden xl:flex flex-col gap-3 w-64 2xl:w-72 h-[96%] overflow-y-auto shrink-0 select-none animate-fade-in">
            {/* Direct Beneficiary Grants Matrix */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-4 shadow-warm-md backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scheme Benefits</span>
                </span>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                  100% Free
                </span>
              </div>

              <div className="space-y-2.5">
                <div
                  onClick={handleTradeGroundPing}
                  className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 cursor-pointer hover:border-amber-400 transition"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-amber-300">Direct Capital Grant</span>
                    <span className="text-xs font-black text-white">₹50,000</span>
                  </div>
                  <p className="text-[10px] text-zinc-300">
                    Transferred directly via DBT into beneficiary Jan-Dhan Bank Account.
                  </p>
                </div>

                <div
                  onClick={handleTradeGroundPing}
                  className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 cursor-pointer hover:border-emerald-400 transition"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-emerald-300">Industrial Toolkits</span>
                    <span className="text-xs font-black text-white">₹15,000</span>
                  </div>
                  <p className="text-[10px] text-zinc-300">
                    Modern trade equipment delivered to artisan address.
                  </p>
                </div>

                <div
                  onClick={handleTradeGroundPing}
                  className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40 cursor-pointer hover:border-blue-400 transition"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-blue-300">NSQF Certification</span>
                    <span className="text-xs font-black text-white">Level 3-4</span>
                  </div>
                  <p className="text-[10px] text-zinc-300">
                    National Skill Qualification Framework certification by NSDC.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Toll-Free Helpline Badge */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-4 shadow-warm-md backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-300 uppercase block">
                    National Helpline
                  </span>
                  <span className="text-sm font-black text-white font-mono">1800 111 222</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-300 leading-tight">
                Toll-free 24x7 voice support available across all states in native regional languages.
              </p>
            </div>
          </aside>
        )}

      </main>
    </div>
  );
};
