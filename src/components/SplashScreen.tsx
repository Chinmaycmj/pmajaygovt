import React, { useEffect, useState } from 'react';
import { Landmark, Sparkles, ShieldCheck } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onFinish, 200);
          return 100;
        }
        return prev + 18;
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#0B0C15] via-[#07080E] to-[#040407] text-white p-6 cursor-pointer select-none animate-fade-in"
    >
      {/* Ambient Radial Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Govt Seal Header */}
      <div className="pt-6 flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
          <Landmark className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase">
          सत्यमेव जयते
        </span>
        <span className="text-[10px] text-zinc-400 font-medium mt-0.5">
          Government of India • सामाजिक न्याय एवं अधिकारिता मंत्रालय
        </span>
      </div>

      {/* Center Emblem & App Branding */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-1 flex items-center justify-center shadow-2xl shadow-amber-950/80 ring-2 ring-amber-400/40">
            <AppLogo size="lg" animated={true} />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-black border-2 border-zinc-900 shadow-md">
            2026
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            वाणी सहायक
          </span>{' '}
          • VANI SAHAYAK
        </h1>
        <p className="text-xs font-bold text-amber-300 mt-1">
          PM-AJAY AI Voice Livelihood Assistant
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          ಪಿಎಂ-ಅಜಯ್ ಜೀವನೋಪಾಯ ಸಹಾಯಕ ಯೋಜನೆ
        </p>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="w-full max-w-xs pb-6 flex flex-col items-center">
        <div className="w-full h-1.5 bg-zinc-850 rounded-full overflow-hidden mb-2 border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[10px] text-zinc-500 font-mono">
          <span>Initializing Voice DSP Engine...</span>
          <span className="text-amber-400 font-bold">{progress}%</span>
        </div>
        <span className="text-[9px] text-zinc-600 mt-3 hover:text-zinc-400 transition">
          Tap anywhere to skip
        </span>
      </div>
    </div>
  );
};
