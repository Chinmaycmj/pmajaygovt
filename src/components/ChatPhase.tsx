import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Bot,
  User,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  RotateCcw,
} from 'lucide-react';
import { LanguageCode, UserProfileData } from '../types';
import { QUESTIONS_CONFIG, UI_STRINGS } from '../data/translations';
import { generateNaturalAcknowledgement } from '../services/acknowledgementGenerator';
import { playTapChime, playMicListeningChime, playSuccessChime } from '../services/audioChimes';
import { AppLogo } from './AppLogo';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  questionIndex?: number;
}

interface ChatPhaseProps {
  currentLang: LanguageCode;
  userProfile: UserProfileData;
  onUpdateProfile: (updater: (prev: UserProfileData) => UserProfileData) => void;
  onCompleteChat: () => void;
  onBackToHome: () => void;
  onSwitchToVoiceCall: () => void;
  currentQuestionIndex: number;
  onSyncQuestionIndex: (idx: number) => void;
}

export const ChatPhase: React.FC<ChatPhaseProps> = ({
  currentLang,
  userProfile,
  onUpdateProfile,
  onCompleteChat,
  onBackToHome,
  onSwitchToVoiceCall,
  currentQuestionIndex,
  onSyncQuestionIndex,
}) => {
  const [inputText, setInputText] = useState('');
  const [isVoiceTyping, setIsVoiceTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const strings = UI_STRINGS[currentLang];
  const qIndex = currentQuestionIndex;
  const currentQ = QUESTIONS_CONFIG[qIndex];
  const suggestions = currentQ?.quickSuggestions?.[currentLang] || [];

  // Setup SpeechRecognition for voice typing in chat
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          const locale = currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
          rec.lang = locale;

          rec.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (transcript) {
              setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
            }
            setIsVoiceTyping(false);
          };

          rec.onerror = () => {
            setIsVoiceTyping(false);
          };

          rec.onend = () => {
            setIsVoiceTyping(false);
          };

          recognitionRef.current = rec;
        } catch (e) {
          console.warn('SpeechRecognition init error in chat:', e);
        }
      }
    }
  }, [currentLang]);

  // Initialize messages on mount or if empty
  useEffect(() => {
    if (messages.length === 0) {
      const qDef = QUESTIONS_CONFIG[qIndex];
      let initialPrompt = qDef?.prompts[currentLang] || qDef?.prompts.en || '';
      if (qIndex === 1) {
        initialPrompt = initialPrompt.replace('{Name}', userProfile.name || 'Beneficiary');
      }

      setMessages([
        {
          id: 'msg-init',
          sender: 'ai',
          text: initialPrompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          questionIndex: qIndex,
        },
      ]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    playTapChime();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: timeStr,
    };

    // 2. Generate natural acknowledgement and save profile
    const currentQDef = QUESTIONS_CONFIG[qIndex];
    const slotKey = currentQDef?.slotKey;
    if (slotKey) {
      onUpdateProfile((prev) => ({
        ...prev,
        [slotKey]: trimmed,
        name: slotKey === 'name' ? trimmed : prev.name,
      }));
    }

    const naturalAck = generateNaturalAcknowledgement(qIndex, trimmed, currentLang, userProfile);

    // 3. Move to next question or complete
    if (qIndex < QUESTIONS_CONFIG.length - 1) {
      const nextIndex = qIndex + 1;
      onSyncQuestionIndex(nextIndex);

      const nextQDef = QUESTIONS_CONFIG[nextIndex];
      let nextPrompt = nextQDef?.prompts[currentLang] || nextQDef?.prompts.en || '';
      if (nextIndex === 1) {
        nextPrompt = nextPrompt.replace('{Name}', trimmed || 'Beneficiary');
      }

      const aiResponseText = `${naturalAck} ${nextPrompt}`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: timeStr,
        questionIndex: nextIndex,
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
    } else {
      // Completed all 9 questions
      playSuccessChime();
      const finalAckText =
        currentLang === 'hi'
          ? `${naturalAck} आपकी सभी जानकारी पीएम-अजय पोर्टल पर आदरपूर्वक दर्ज कर ली गई है। आइए आपकी विशेष योजना अनुशंसाएं देखें।`
          : currentLang === 'kn'
          ? `${naturalAck} ತಮ್ಮ ವಿವರಗಳನ್ನು ಪಿಎಂ-ಅಜಯ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಗೌರವಯುತವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ. ತಮಗಾಗಿ ಸಿದ್ಧಪಡಿಸಿದ ಶಿಫಾರಸುಗಳನ್ನು ನೋಡೋಣ.`
          : `${naturalAck} All your details have been safely and respectfully registered under PM-AJAY. Let's view your tailored recommendations.`;

      const finalMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: finalAckText,
        timestamp: timeStr,
      };

      setMessages((prev) => [...prev, userMsg, finalMsg]);
      setTimeout(() => {
        onCompleteChat();
      }, 1200);
    }

    setInputText('');
  };

  const handleVoiceTypingToggle = () => {
    if (!recognitionRef.current) return;
    playTapChime();

    if (isVoiceTyping) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsVoiceTyping(false);
    } else {
      try {
        playMicListeningChime();
        recognitionRef.current.start();
        setIsVoiceTyping(true);
      } catch (e) {
        setIsVoiceTyping(false);
      }
    }
  };

  const handlePlaySpeech = (text: string) => {
    playTapChime();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const locale = currentLang === 'kn' ? 'kn-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.lang = locale;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090D] text-zinc-100 selection:bg-amber-500/30 overflow-hidden">
      {/* Top Header with App Identity & Navigation */}
      <header className="px-4 py-3 bg-[#0D0E17]/95 border-b border-zinc-800/80 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              playTapChime();
              onBackToHome();
            }}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 flex items-center justify-center text-white shadow-md">
            <AppLogo size="sm" animated={false} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white leading-tight">PM-AJAY Smart Chat</h2>
            <p className="text-[10px] text-amber-400 font-medium">Text & Voice-Typing Mode</p>
          </div>
        </div>

        {/* Switch to Voice Call Button */}
        <button
          onClick={() => {
            playTapChime();
            onSwitchToVoiceCall();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-600/50 text-blue-300 font-bold text-[11px] transition shadow-xs"
          title="Switch to Voice Call"
        >
          <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
          <span>Toll-Free Call</span>
        </button>
      </header>

      {/* Progress Bar (Question X of 9) */}
      <div className="px-4 py-1.5 bg-[#0C0D15] border-b border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
        <span>Question {Math.min(qIndex + 1, 9)} of 9</span>
        <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
            style={{ width: `${((qIndex + 1) / 9) * 100}%` }}
          />
        </div>
        <span className="text-amber-400 font-bold">{Math.round(((qIndex + 1) / 9) * 100)}%</span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Sender Avatar */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs ${
                msg.sender === 'ai'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
              }`}
            >
              {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Bubble Container */}
            <div
              className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-xs'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-xs'
              }`}
            >
              <p className="font-sans font-medium">{msg.text}</p>

              <div
                className={`mt-1.5 flex items-center justify-between text-[10px] ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-zinc-500'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handlePlaySpeech(msg.text)}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition cursor-pointer"
                    title="Listen to this message"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Chips Bar */}
      {suggestions.length > 0 && qIndex < 9 && (
        <div className="px-4 py-2 bg-[#0C0D15]/80 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[10px] text-zinc-500 font-bold uppercase shrink-0">Suggestions:</span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 shrink-0 transition active:scale-95 cursor-pointer shadow-xs"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Message Input Bar with Voice-Typing Support */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 bg-[#0D0E17] border-t border-zinc-800 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={handleVoiceTypingToggle}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition active:scale-95 cursor-pointer ${
            isVoiceTyping
              ? 'bg-emerald-500 text-white animate-pulse shadow-md shadow-emerald-950/60'
              : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-750'
          }`}
          title={isVoiceTyping ? 'Voice typing active (speak now)' : 'Tap to voice-type with microphone'}
        >
          {isVoiceTyping ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isVoiceTyping ? 'Listening... speak your answer' : 'Type your answer or select suggestion...'
          }
          className="flex-1 bg-zinc-900/90 border border-zinc-750 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-zinc-950 flex items-center justify-center font-bold transition active:scale-95 cursor-pointer shadow-md shadow-amber-950/50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
