import React, { useState, useEffect } from 'react';
import {
  Volume2,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Mic,
  Award,
  Languages,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Radio,
  Sliders,
  Check,
  Headphones,
  Share2,
} from 'lucide-react';
import { AppLogo } from './AppLogo';
import { playTapChime, playTradeSelectChime, playMicTestChime } from '../services/audioChimes';
import { LanguageCode } from '../types';

interface StartingScreenProps {
  onGetStarted: () => void;
  onConnectCall: () => void;
  onPlayWelcomeAudio: () => void;
  isSpeaking: boolean;
  onOpenCodeInspector: () => void;
  onQuickSelectLanguage?: (lang: LanguageCode) => void;
}

interface LivelihoodTrade {
  id: string;
  name: string;
  icon: string;
  hindiName: string;
  kannadaName: string;
  grantAmount: string;
  toolkitAmount: string;
  training: string;
  nsqfLevel: string;
}

const SAMPLE_TRADES: LivelihoodTrade[] = [
  {
    id: 'tailoring',
    name: 'Garments & Tailoring',
    hindiName: 'दर्जी व वस्त्र निर्माण',
    kannadaName: 'ಟೈಲರಿಂಗ್ ಮತ್ತು ಹೊಲಿಗೆ',
    icon: '🧵',
    grantAmount: '₹50,000 Direct Grant',
    toolkitAmount: '₹15,000 Industrial Machine Kit',
    training: 'Free 45-day NSQF Sewing Masterclass',
    nsqfLevel: 'NSQF Level 4',
  },
  {
    id: 'electrician',
    name: 'Solar & Electrical',
    hindiName: 'सोलर व विद्युत तकनीशियन',
    kannadaName: 'ಸೌರ ಮತ್ತು ವಿದ್ಯುತ್ ತಂತ್ರಜ್ಞ',
    icon: '⚡',
    grantAmount: '₹50,000 Capital Aid',
    toolkitAmount: '₹15,000 Digital Multimeter & Tools',
    training: 'Surya Mitra Certified Installation',
    nsqfLevel: 'NSQF Level 4',
  },
  {
    id: 'farming',
    name: 'Agro & Organic Poultry',
    hindiName: 'जैविक खेती व कुक्कुट पालन',
    kannadaName: 'ಕೃಷಿ ಮತ್ತು ಸಾವಯವ ಕೋಳಿ ಸಾಕಾಣಿಕೆ',
    icon: '🌾',
    grantAmount: '₹50,000 Micro-Venture Grant',
    toolkitAmount: '₹15,000 Storage & Brooder Kit',
    training: 'ICAR Certified Sustainable Husbandry',
    nsqfLevel: 'NSQF Level 3',
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Handicrafts',
    hindiName: 'बढ़ईगीरी व हस्तशिल्प',
    kannadaName: 'ಬಡಗಿತನ ಮತ್ತು ಕರಕುಶಲ',
    icon: '🔨',
    grantAmount: '₹50,000 Enterprise Seed',
    toolkitAmount: '₹15,000 Power Saw & Chisels Kit',
    training: 'Modern Woodworking & Joinery',
    nsqfLevel: 'NSQF Level 3',
  },
];

export const StartingScreen: React.FC<StartingScreenProps> = ({
  onGetStarted,
  onConnectCall,
  onPlayWelcomeAudio,
  isSpeaking,
  onOpenCodeInspector,
  onQuickSelectLanguage,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('hi');
  const [selectedTrade, setSelectedTrade] = useState<LivelihoodTrade>(SAMPLE_TRADES[0]);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [testVolumeLevel, setTestVolumeLevel] = useState(0);

  // Quick speech announcement for selected language
  const handleLanguageTab = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    playTapChime();
    if (onQuickSelectLanguage) {
      onQuickSelectLanguage(lang);
    }

    // Speak a trilingual greeting preview
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let text = 'Welcome to PM-AJAY Voice Assistant';
      let speechLang = 'en-IN';

      if (lang === 'hi') {
        text = 'पीएम-अजय वाणी सहायक में आपका स्वागत है। बोलकर अपनी सहायता प्राप्त करें।';
        speechLang = 'hi-IN';
      } else if (lang === 'kn') {
        text = 'ಪಿಎಂ-ಅಜಯ್ ಧ್ವನಿ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ಉಚಿತ ತರಬೇತಿ ಮತ್ತು ಧನಸಹಾಯ ಪಡೆಯಿರಿ.';
        speechLang = 'kn-IN';
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTradeSelect = (trade: LivelihoodTrade) => {
    playTradeSelectChime();
    setSelectedTrade(trade);
  };

  const handleTestMic = () => {
    playMicTestChime();
    setIsMicTesting(true);

    // Simulate animated volume bouncing for 3.5 seconds
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setTestVolumeLevel(Math.floor(Math.random() * 80) + 20);
      if (count > 25) {
        clearInterval(interval);
        setIsMicTesting(false);
        setTestVolumeLevel(0);
      }
    }, 120);
  };

  const handleStart = () => {
    playTapChime();
    onGetStarted();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-b from-[#090B14] via-[#080911] to-[#05060A] text-zinc-100 px-4 sm:px-6 py-4 selection:bg-amber-500/30">
      {/* 1. National Identity Banner with High-Contrast Gold Seal */}
      <header className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-950/60 flex items-center justify-center">
            <AppLogo size="sm" animated={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">
                सत्यमेव जयते
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-[10px] text-zinc-300 font-bold">Government of India</span>
            </div>
            <p className="text-[11px] font-bold text-zinc-200 leading-tight">
              Ministry of Social Justice & Empowerment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live 2026</span>
        </div>
      </header>

      {/* 2. Primary Hero Header with Large Emblem & Unmistakable App Name */}
      <section className="my-4 rounded-3xl bg-gradient-to-br from-[#1B1D2A] via-[#141520] to-[#1F1914] border border-amber-500/30 p-5 sm:p-6 relative overflow-hidden shadow-warm-lg">
        {/* Ambient Radial Lights */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Logo & Branding Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left mb-4">
          <div className="relative shrink-0">
            <AppLogo size="lg" animated={true} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-zinc-900 flex items-center justify-center text-zinc-950 shadow-md">
              <Mic className="w-3.5 h-3.5 font-bold" />
            </div>
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-500/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Official Voice Livelihood Portal</span>
            </div>

            {/* App Name in Devanagari & English with Radiant Golden High-Contrast Typography */}
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                वाणी सहायक
              </span>{' '}
              <span className="text-white font-extrabold">• VANI SAHAYAK</span>
            </h1>

            <p className="text-xs sm:text-sm font-bold text-amber-300/90 mt-1">
              PM-AJAY AI Voice Livelihood Assistant • ಪಿಎಂ-ಅಜಯ್ ವಾಣಿ ಸಹಾಯಕ
            </p>

            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              Accessible, voice-first portal for all citizens. Speak naturally in your native language
              to receive <strong className="text-amber-300">₹50,000 Direct Financial Grants</strong>,{' '}
              <strong className="text-emerald-300">₹15,000 Free Industrial Toolkits</strong>, and{' '}
              <strong className="text-cyan-300">NSQF Skill Certifications</strong> with zero paperwork.
            </p>
          </div>
        </div>

        {/* 3. Interactive Trilingual Voice Greeting Selector */}
        <div className="pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-2">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Headphones className="w-3.5 h-3.5" />
              <span>Try Live Spoken Greeting:</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">Tap to hear voice</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Hindi Tab */}
            <button
              onClick={() => handleLanguageTab('hi')}
              className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                selectedLanguage === 'hi'
                  ? 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-neon-amber'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-amber-500/40 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white block">हिन्दी (Hindi)</span>
                {selectedLanguage === 'hi' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <span className="text-[10px] font-medium text-amber-400/90 block mt-0.5">
                नमस्ते! बोलें
              </span>
            </button>

            {/* Kannada Tab */}
            <button
              onClick={() => handleLanguageTab('kn')}
              className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                selectedLanguage === 'kn'
                  ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200 shadow-neon-emerald'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-emerald-500/40 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white block">ಕನ್ನಡ (Kannada)</span>
                {selectedLanguage === 'kn' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="text-[10px] font-medium text-emerald-400/90 block mt-0.5">
                ನಮಸ್ಕಾರ! ಮಾತನಾಡಿ
              </span>
            </button>

            {/* English Tab */}
            <button
              onClick={() => handleLanguageTab('en')}
              className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                selectedLanguage === 'en'
                  ? 'bg-blue-950/70 border-blue-400 text-blue-200 shadow-neon-blue'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-blue-500/40 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white block">English (India)</span>
                {selectedLanguage === 'en' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <span className="text-[10px] font-medium text-blue-300 block mt-0.5">
                Speak Naturally
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Trilingual Speech Playback Button */}
        <button
          onClick={onPlayWelcomeAudio}
          className={`mt-3 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all active:scale-[0.98] ${
            isSpeaking
              ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-neon-amber'
              : 'bg-zinc-900/90 hover:bg-zinc-850 border-zinc-700/80 text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Volume2 className={`w-4 h-4 text-amber-400 ${isSpeaking ? 'animate-bounce' : ''}`} />
            <span>{isSpeaking ? 'Playing Voice Overview...' : 'Play Multilingual Audio Intro'}</span>
          </div>
          <div className="flex items-center gap-1">
            {[8, 16, 22, 12, 18].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all ${
                  isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'
                }`}
                style={{
                  height: isSpeaking ? `${h}px` : '6px',
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </button>
      </section>

      {/* 4. High-Contrast Interactive Livelihood Grant Explorer */}
      <section className="mb-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Livelihood Matcher</span>
          </h2>
          <span className="text-[10px] text-zinc-400">Touch a trade to see grant</span>
        </div>

        {/* Trade Selector Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {SAMPLE_TRADES.map((trade) => {
            const isSelected = selectedTrade.id === trade.id;
            return (
              <button
                key={trade.id}
                onClick={() => handleTradeSelect(trade)}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-950/60 to-zinc-900 border-amber-400 text-white shadow-xs'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-base mb-0.5">{trade.icon}</div>
                <div className="text-xs font-bold truncate text-zinc-100">{trade.name}</div>
                <div className="text-[10px] text-amber-400/90 truncate">{trade.hindiName}</div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Matched Benefit Card with High-Contrast Badges */}
        <div className="rounded-xl bg-gradient-to-r from-[#171822] via-[#10121A] to-[#18130E] border border-amber-500/30 p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-white">{selectedTrade.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                {selectedTrade.nsqfLevel}
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-tight">
              Includes: <strong className="text-emerald-300">{selectedTrade.toolkitAmount}</strong> +{' '}
              <strong className="text-amber-300">{selectedTrade.training}</strong>
            </p>
          </div>

          <div className="bg-amber-500/15 border border-amber-500/40 px-3.5 py-1.5 rounded-xl text-center shrink-0">
            <span className="text-xs font-black text-amber-300 block">{selectedTrade.grantAmount}</span>
            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-wide">
              Direct Bank Transfer
            </span>
          </div>
        </div>
      </section>

      {/* 5. Interactive Microphone & Audio Hardware Diagnostic Tester */}
      <section className="mb-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isMicTesting
                  ? 'bg-emerald-500 text-zinc-950 shadow-neon-emerald'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              <Mic className={`w-4 h-4 ${isMicTesting ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {isMicTesting ? 'Microphone Active & Listening...' : 'Mic & Audio Diagnostic'}
              </span>
              <span className="text-[10px] text-zinc-400">
                {isMicTesting ? 'Signal verified • Ready for speech' : 'Test voice responsiveness'}
              </span>
            </div>
          </div>

          <button
            onClick={handleTestMic}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95 ${
              isMicTesting
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 hover:border-emerald-500/40'
            }`}
          >
            {isMicTesting ? 'Testing...' : 'Test My Mic'}
          </button>
        </div>

        {/* Live animated volume LED meter if testing */}
        {isMicTesting && (
          <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">LEVEL:</span>
            <div className="flex-1 flex items-center gap-1 h-3 bg-zinc-950 rounded-full px-1 border border-zinc-800 overflow-hidden">
              {Array.from({ length: 12 }).map((_, i) => {
                const active = testVolumeLevel > i * 8;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-xs transition-all duration-75 ${
                      active
                        ? i > 9
                          ? 'bg-red-400 shadow-xs'
                          : i > 6
                          ? 'bg-amber-400 shadow-xs'
                          : 'bg-emerald-400 shadow-xs'
                        : 'bg-zinc-800'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-mono text-zinc-400 font-bold">
              {testVolumeLevel}%
            </span>
          </div>
        )}
      </section>

      

      {/* 7. Primary Action CTAs */}
      <div className="mt-auto space-y-2.5 pt-2 pb-2">
        {/* Giant Shimmering Start Button */}
        <button
          id="btn-start-onboarding"
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-base flex items-center justify-center gap-3 shadow-neon-amber shimmer-btn active:scale-[0.98] transition-all cursor-pointer border border-amber-400/50"
        >
          <span>Get Started • शुरू करें • ಪ್ರಾರಂಭಿಸಿ</span>
          <ArrowRight className="w-5 h-5 animate-bounce" />
        </button>

        {/* Secondary: Instant Toll-Free Helpline Call Modal */}
        <button
          id="btn-start-call"
          onClick={() => {
            playTapChime();
            onConnectCall();
          }}
          className="w-full py-3 px-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-blue-500/40 text-zinc-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer shadow-warm-sm"
        >
          <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
          <span>Call Toll-Free Helpline (1800 111 222)</span>
        </button>

        {/* Android Architecture Link */}
        <div className="text-center pt-1">
          <button
            onClick={() => {
              playTapChime();
              onOpenCodeInspector();
            }}
            className="text-[11px] text-zinc-500 hover:text-amber-400 underline underline-offset-4 transition"
          >
            Inspect Android Kotlin Project Source & Architecture
          </button>
        </div>
      </div>
    </div>
  );
};
