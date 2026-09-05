import React, { useEffect, useState } from 'react';
import { ConversationState } from '../types';

interface VisualizerWaveProps {
  state: ConversationState;
  volume: number;
}

export const VisualizerWave: React.FC<VisualizerWaveProps> = ({ state, volume }) => {
  const [sinePhase, setSinePhase] = useState(0);

  // Smooth periodic animation when AI speaks
  useEffect(() => {
    if (state !== 'STATE_AI_SPEAKING') return;
    const interval = setInterval(() => {
      setSinePhase((prev) => (prev + 0.2) % (Math.PI * 2));
    }, 60);
    return () => clearInterval(interval);
  }, [state]);

  const barWeights = [0.25, 0.45, 0.7, 0.9, 1.0, 0.85, 0.95, 0.75, 0.6, 0.4, 0.3, 0.2];

  const getColor = () => {
    switch (state) {
      case 'STATE_AI_SPEAKING':
        return 'from-amber-400 via-orange-400 to-amber-500 shadow-neon-amber';
      case 'STATE_LISTENING':
        return 'from-emerald-400 via-teal-400 to-emerald-500 shadow-neon-emerald';
      case 'STATE_PROCESSING':
        return 'from-blue-400 to-indigo-500 shadow-neon-blue';
      default:
        return 'from-zinc-700 to-zinc-800';
    }
  };

  const isAnimated =
    state === 'STATE_AI_SPEAKING' || state === 'STATE_LISTENING' || state === 'STATE_PROCESSING';

  return (
    <div className="flex items-center justify-center gap-1.5 h-14 px-3 py-1">
      {barWeights.map((weight, i) => {
        let heightPercent = 15;

        if (state === 'STATE_AI_SPEAKING') {
          // Dynamic organic wave moving across bars
          const wave = Math.sin(sinePhase + i * 0.45);
          heightPercent = Math.max(20, Math.min(95, (wave * 0.4 + 0.6) * weight * 100));
        } else if (state === 'STATE_LISTENING') {
          // Microphone volume responsive bounce
          const volFactor = Math.min(1, Math.max(0.15, volume / 25));
          heightPercent = Math.max(18, Math.min(100, volFactor * weight * 110));
        } else if (state === 'STATE_PROCESSING') {
          heightPercent = 30 + Math.sin(i * 0.8) * 15;
        }

        return (
          <div
            key={i}
            className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t ${getColor()} transition-all duration-75 ease-out shadow-xs`}
            style={{
              height: `${heightPercent}%`,
              opacity: isAnimated ? 0.95 : 0.25,
            }}
          />
        );
      })}
    </div>
  );
};
