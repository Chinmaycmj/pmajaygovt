import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  FileCode,
  ShieldCheck,
  Cpu,
  Layers,
  FileText,
  Terminal,
} from 'lucide-react';
import { KOTLIN_SOURCE_FILES } from '../data/kotlinSources';

interface CodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeInspectorModal: React.FC<CodeInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showArchDoc, setShowArchDoc] = useState(false);

  if (!isOpen) return null;

  const currentFile = KOTLIN_SOURCE_FILES[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200 selection:bg-blue-600/30">
      <div className="w-full max-w-5xl h-[92vh] bg-[#09090B] border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Android Studio Kotlin Project</h2>
                <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Staff Android Bug Fixes
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Jetpack Compose Material 3 • Half-Duplex Speech FSM • Google TTS kn-IN targeting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowArchDoc(!showArchDoc)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                showArchDoc
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{showArchDoc ? 'View Code' : 'Bug Fix Architecture'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition border border-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {showArchDoc ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed text-zinc-300 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>BUG 1: Acoustic Echo & Background Interruption</span>
              </h3>
              <div className="space-y-3 text-xs text-zinc-300">
                <p>
                  <strong>Root Cause:</strong> In simultaneous full-duplex attempts, Android’s
                  microphone opens while device speakers are still rendering TTS audio. Speaker
                  feedback trips the VAD (Voice Activity Detection), cutting off the assistant’s question
                  or filling the recognized buffer with synthesized audio fragments.
                </p>
                <div className="p-3 rounded-xl bg-zinc-950 font-mono text-[11px] text-emerald-300 border border-zinc-800">
                  <p>1. onStart(utteranceId) → SpeechRecognizer.cancel() (Mute Mic immediately)</p>
                  <p>2. onDone(utteranceId) → Dispatchers.Main coroutine</p>
                  <p>3. delay(300L) → 300ms Acoustic Guard Window (dissipates speaker reverb)</p>
                  <p>4. startListening(intent) → SpeechRecognizer activates ONLY when room is quiet</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <span>BUG 2: Kannada (kn-IN) Speech Synthesis Failure</span>
              </h3>
              <div className="space-y-3 text-xs text-zinc-300">
                <p>
                  <strong>Root Cause:</strong> Default OEM TTS engines (e.g. on various vendor
                  devices) lack verified Indic voice models for Kannada (`kn-IN`). Calling `TextToSpeech(context, listener)` without targeting an engine package causes silent failure or robotic gibberish.
                </p>
                <div className="p-3 rounded-xl bg-zinc-950 font-mono text-[11px] text-amber-300 border border-zinc-800">
                  <p>// Explicitly target Google's high-fidelity Indic TTS engine</p>
                  <p>TextToSpeech(context, listener, "com.google.android.tts")</p>
                  <p>// Validate availability before speaking</p>
                  <p>val status = tts.isLanguageAvailable(Locale.forLanguageTag("kn-IN"))</p>
                  <p>// Set speech rate 0.9f for natural, clear Indic vowel cadence</p>
                  <p>tts.setSpeechRate(0.9f)</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar File Tree */}
            <div className="w-full md:w-64 bg-zinc-950/70 border-r border-zinc-800 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-3 py-1.5 hidden md:block">
                Project Files
              </p>
              {KOTLIN_SOURCE_FILES.map((file, idx) => (
                <button
                  key={file.filename}
                  onClick={() => setActiveTab(idx)}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2.5 transition whitespace-nowrap ${
                    activeTab === idx
                      ? 'bg-blue-950 text-blue-300 border border-blue-700/60 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <FileCode className="w-4 h-4 shrink-0 text-zinc-400" />
                  <span className="truncate">{file.filename}</span>
                </button>
              ))}
            </div>

            {/* Code Editor Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
              {/* File Meta Header */}
              <div className="px-5 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <div className="overflow-hidden">
                  <span className="font-mono text-xs font-semibold text-blue-400">
                    {currentFile.path}
                  </span>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {currentFile.description}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 flex items-center gap-1.5 transition active:scale-95 shrink-0 ml-3"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Code Pre Block */}
              <div className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed text-zinc-200 bg-zinc-950 selection:bg-blue-900">
                <pre>
                  <code>{currentFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
