import React from 'react';
import { Volume2, Mic, Loader2, PauseCircle, ShieldAlert } from 'lucide-react';
import { ConversationState } from '../types';

interface StatusPillProps {
  state: ConversationState;
  showGuardNotice?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({ state, showGuardNotice }) => {
  const getConfig = () => {
    switch (state) {
      case 'STATE_AI_SPEAKING':
        return {
          icon: <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />,
          label: 'AI Speaking... (Mic Off)',
          colorClasses: 'bg-amber-500/10 text-amber-300 border-amber-500/30 ring-2 ring-amber-500/20 shadow-lg shadow-amber-950/40',
          dot: 'bg-amber-400 animate-ping',
        };
      case 'STATE_LISTENING':
        return {
          icon: <Mic className="w-4 h-4 text-emerald-400 animate-bounce" />,
          label: 'Listening... Speak Now',
          colorClasses: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 ring-2 ring-emerald-500/25 shadow-lg shadow-emerald-950/40',
          dot: 'bg-emerald-400 animate-pulse',
        };
      case 'STATE_PROCESSING':
        return {
          icon: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
          label: 'Processing...',
          colorClasses: 'bg-blue-500/15 text-blue-300 border-blue-500/40 ring-2 ring-blue-500/20 shadow-lg shadow-blue-950/40',
          dot: 'bg-blue-400 animate-ping',
        };
      case 'STATE_IDLE':
      default:
        return {
          icon: <PauseCircle className="w-4 h-4 text-zinc-400" />,
          label: 'Ready / Standby',
          colorClasses: 'bg-zinc-800/80 text-zinc-300 border-zinc-700 ring-1 ring-zinc-700/50',
          dot: 'bg-zinc-400',
        };
    }
  };

  const config = getConfig();

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        id="voice-status-pill"
        className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-sm font-semibold tracking-wide transition-all duration-300 ${config.colorClasses}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dot.split(' ')[0]}`} />
        </span>
        {config.icon}
        <span className="select-none font-medium">{config.label}</span>
      </div>

      {showGuardNotice && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-800/60">
          <ShieldAlert className="w-3 h-3 text-emerald-400" />
          <span>Half-Duplex Mutex Protected (300ms Echo Guard)</span>
        </div>
      )}
    </div>
  );
};
