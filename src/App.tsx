import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppScreen,
  ConversationState,
  LanguageCode,
  UserProfileData,
  VoiceAssistantPhase,
} from './types';
import { QUESTIONS_CONFIG, SUMMARY_ACK_PROMPTS, UI_STRINGS } from './data/translations';
import { WebSpeechEngine } from './services/speechEngine';
import { playMicListeningChime, playSuccessChime, playTapChime } from './services/audioChimes';
import { generateNaturalAcknowledgement } from './services/acknowledgementGenerator';
import { SplashScreen } from './components/SplashScreen';
import { StartingScreen } from './components/StartingScreen';
import { HomeScreen } from './components/HomeScreen';
import { LanguageSelectionPhase } from './components/LanguageSelectionPhase';
import { QuestionnairePhase } from './components/QuestionnairePhase';
import { SummaryPhase } from './components/SummaryPhase';
import { ChatPhase } from './components/ChatPhase';
import { CallSimulatorModal } from './components/CallSimulatorModal';
import { CodeInspectorModal } from './components/CodeInspectorModal';
import { DeviceFrame } from './components/DeviceFrame';
import { ArrowLeft, Phone } from 'lucide-react';

const INITIAL_PROFILE: UserProfileData = {
  name: '',
  location: '',
  incomeLessThan2Point5Lakh: '',
  education: '',
  traditionalSkill: '',
  currentLivelihood: '',
  toolsSkills: '',
  mobilityRadiusKm: '',
  careerPreference: '',
};

export default function App() {
  // Navigation: Starts with brief professional splash screen, then 'START' -> 'LANGUAGE' -> 'HOME' / 'VOICE_ASSISTANT' / 'CHAT'
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<AppScreen>('START');
  const [phase, setPhase] = useState<VoiceAssistantPhase>('PHASE_LANGUAGE_SELECT');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [conversationState, setConversationState] = useState<ConversationState>('STATE_IDLE');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [volume, setVolume] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfileData>(INITIAL_PROFILE);

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const speechEngineRef = useRef<WebSpeechEngine | null>(null);

  // Initialize Speech Engine with strict half-duplex callbacks
  useEffect(() => {
    speechEngineRef.current = new WebSpeechEngine({
      onStateChange: (state) => {
        setConversationState(state);
        if (state === 'STATE_LISTENING') {
          playMicListeningChime();
        }
      },
      onPartialText: (text) => {
        setRecognizedText(text);
      },
      onFinalText: (text) => {
        setRecognizedText(text);
        handleAnswerSubmission(text);
      },
      onError: (err, isRecoverable) => {
        console.warn('Speech engine callback message:', err);
      },
      onVolumeChange: (vol) => {
        setVolume(vol);
      },
    });

    return () => {
      speechEngineRef.current?.stopAll();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync language with speech engine
  useEffect(() => {
    speechEngineRef.current?.setLanguage(currentLang);
  }, [currentLang]);

  // Dynamic Prompt Generator with entity injection (Name in Q2)
  const getCalculatedPrompt = useCallback(
    (index: number, lang: LanguageCode, profile: UserProfileData) => {
      const qDef = QUESTIONS_CONFIG[index];
      if (!qDef) return '';
      let text = qDef.prompts[lang] || qDef.prompts.en;
      if (index === 1) {
        const injectedName = profile.name.trim() || 'Beneficiary';
        text = text.replace('{Name}', injectedName);
      }
      return text;
    },
    []
  );

  // Speak Current Question Turn (with optional natural acknowledgement prefix)
  const speakQuestionTurn = useCallback(
    (
      index: number,
      lang: LanguageCode,
      profile: UserProfileData,
      acknowledgementPrefix = ''
    ) => {
      const basePrompt = getCalculatedPrompt(index, lang, profile);
      const fullPrompt = acknowledgementPrefix
        ? `${acknowledgementPrefix} ${basePrompt}`
        : basePrompt;

      setCurrentPrompt(fullPrompt);
      setRecognizedText('');
      speechEngineRef.current?.speak(fullPrompt);
    },
    [getCalculatedPrompt]
  );

  // Spoken sample phrases for language selection preview
  const handlePlaySamplePrompt = (lang: LanguageCode) => {
    speechEngineRef.current?.setLanguage(lang);
    if (lang === 'en') {
      speechEngineRef.current?.speak('Warm welcome to PM-AJAY Livelihood Assistant. We are honored to assist you.');
    } else if (lang === 'hi') {
      speechEngineRef.current?.speak('नमस्ते। प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना में आपका हार्दिक और विनम्र स्वागत है।');
    } else if (lang === 'kn') {
      speechEngineRef.current?.speak('ನಮಸ್ಕಾರ. ಪಿಎಂ-ಅಜಯ್ ಜೀವನೋಪಾಯ ಸಹಾಯಕ ಯೋಜನೆಗೆ ತಮಗೆ ಆತ್ಮೀಯ ಹಾಗೂ ಪ್ರೀತಿಯ ಸುಸ್ವಾಗತ.');
    }
  };

  // Welcome Audio for Starting Screen
  const handlePlayWelcomeAudio = () => {
    speechEngineRef.current?.speak(
      'Namaste and warm welcome to PM-AJAY Livelihood Assistant. प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना में आपका स्वागत है। ಪಿಎಂ-ಅಜಯ್ ಯೋಜನೆಗೆ ತಮಗೆ ಆತ್ಮೀಯ ಸುಸ್ವಾಗತ.'
    );
  };

  // Intro prompt for Language Selection
  const handlePlayLanguageIntroPrompt = () => {
    const prompt =
      'Welcome to PM-AJAY. Please kindly select your language. कृपया अपनी भाषा चुनें. ದಯವಿಟ್ಟು ತಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.';
    speechEngineRef.current?.speak(prompt);
  };

  // Onboarding: Flow from START -> LANGUAGE
  const handleGetStarted = () => {
    setScreen('LANGUAGE');
    handlePlayLanguageIntroPrompt();
  };

  // Language Selected from Dedicated Screen
  const handleSelectLanguageFromSetup = (lang: LanguageCode) => {
    setCurrentLang(lang);
    speechEngineRef.current?.setLanguage(lang);
    setScreen('HOME');
  };

  // Start Voice Assistant questionnaire from Home
  const handleConnectVoice = () => {
    setScreen('VOICE_ASSISTANT');
    setPhase('PHASE_QUESTIONNAIRE');
    speakQuestionTurn(currentQuestionIndex, currentLang, userProfile);
  };

  // Start Smart Chat Mode from Home
  const handleConnectChat = () => {
    speechEngineRef.current?.stopAll();
    setScreen('CHAT');
  };

  // Submit Spoken or Manual Answer (Generates Natural Gratitude Acknowledgement)
  const handleAnswerSubmission = (answerText: string) => {
    const trimmed = answerText.trim();
    if (!trimmed) return;

    setUserProfile((prev) => {
      const currentQ = QUESTIONS_CONFIG[currentQuestionIndex];
      const slotKey = currentQ?.slotKey;
      const updatedProfile = {
        ...prev,
        [slotKey]: trimmed,
        name: slotKey === 'name' ? trimmed : prev.name,
      };

      // Generate context-aware natural acknowledgement with varied gratitude
      const naturalAck = generateNaturalAcknowledgement(
        currentQuestionIndex,
        trimmed,
        currentLang,
        updatedProfile
      );

      // Check if more questions remain
      if (currentQuestionIndex < QUESTIONS_CONFIG.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          speakQuestionTurn(nextIndex, currentLang, updatedProfile, naturalAck);
        }, 150);
      } else {
        // Complete! Transition to Summary Phase
        playSuccessChime();
        setPhase('PHASE_SUMMARY');
        const ackTemplate = SUMMARY_ACK_PROMPTS[currentLang];
        const finalAck = `${naturalAck} ${ackTemplate.replace(
          '{Name}',
          updatedProfile.name || 'Beneficiary'
        )}`;
        speechEngineRef.current?.speak(finalAck);
      }

      return updatedProfile;
    });
  };

  const handleRepeatQuestion = () => {
    speakQuestionTurn(currentQuestionIndex, currentLang, userProfile);
  };

  const handleSkipQuestion = () => {
    handleAnswerSubmission('Skipped / Unknown');
  };

  const handleReturnHome = () => {
    speechEngineRef.current?.stopAll();
    setScreen('HOME');
    setRecognizedText('');
  };

  const handleResetToStart = () => {
    speechEngineRef.current?.stopAll();
    setScreen('START');
    setPhase('PHASE_LANGUAGE_SELECT');
    setCurrentQuestionIndex(0);
    setRecognizedText('');
    setUserProfile(INITIAL_PROFILE);
  };

  const handleConnectCall = () => {
    speechEngineRef.current?.stopAll();
    setIsCallModalOpen(true);
  };

  return (
    <>
      {/* 1. Professional Splash Screen on App Launch */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <DeviceFrame
        conversationState={conversationState}
        currentLang={currentLang}
        onOpenCodeInspector={() => setIsCodeModalOpen(true)}
      >
        {/* SCREEN 1: Starting Page (Welcome & Onboarding) */}
        {screen === 'START' && (
          <StartingScreen
            onGetStarted={handleGetStarted}
            onConnectCall={handleConnectCall}
            onPlayWelcomeAudio={handlePlayWelcomeAudio}
            isSpeaking={conversationState === 'STATE_AI_SPEAKING'}
            onOpenCodeInspector={() => setIsCodeModalOpen(true)}
            onQuickSelectLanguage={(lang) => {
              setCurrentLang(lang);
              speechEngineRef.current?.setLanguage(lang);
            }}
          />
        )}

        {/* SCREEN 2: Language Selection Page */}
        {screen === 'LANGUAGE' && (
          <div className="flex flex-col h-full bg-[#09090B] text-zinc-100 overflow-hidden">
            <LanguageSelectionPhase
              onSelectLanguage={handleSelectLanguageFromSetup}
              onPlayIntroPrompt={handlePlayLanguageIntroPrompt}
              onPlaySamplePrompt={handlePlaySamplePrompt}
              isSpeaking={conversationState === 'STATE_AI_SPEAKING'}
              onBack={() => setScreen('START')}
              title="Step 1: Choose Your Language"
            />
          </div>
        )}

        {/* SCREEN 3: Home Dashboard (in chosen language) */}
        {screen === 'HOME' && (
          <HomeScreen
            currentLang={currentLang}
            onSelectLanguage={(lang) => {
              setCurrentLang(lang);
              speechEngineRef.current?.setLanguage(lang);
            }}
            onChangeLanguageScreen={() => {
              setScreen('LANGUAGE');
              handlePlayLanguageIntroPrompt();
            }}
            onConnectCall={handleConnectCall}
            onConnectVoice={handleConnectVoice}
            onConnectChat={handleConnectChat}
            onOpenCodeInspector={() => setIsCodeModalOpen(true)}
            onBackToStart={handleResetToStart}
          />
        )}

        {/* SCREEN 4: Voice Assistant Screen (9-Question Questionnaire & Summary) */}
        {screen === 'VOICE_ASSISTANT' && (
          <div className="flex flex-col h-full bg-[#09090B] text-zinc-100 overflow-hidden">
            {/* Top Bar for Voice Assistant Screen */}
            <header className="sticky top-0 z-20 bg-[#09090B]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5 shadow-xs flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  id="btn-back-to-home"
                  onClick={handleReturnHome}
                  className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition border border-zinc-700/60 cursor-pointer"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-xs font-bold text-zinc-100 tracking-tight leading-tight">
                    {UI_STRINGS[currentLang].appName}
                  </h1>
                  <p className="text-[10px] text-zinc-400 font-medium">
                    {phase === 'PHASE_QUESTIONNAIRE'
                      ? `Voice Assessment (${currentQuestionIndex + 1}/9)`
                      : 'Scheme Recommendations'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleConnectCall}
                  className="p-1.5 rounded-full bg-blue-950/60 text-blue-300 hover:bg-blue-900/80 border border-blue-700/60 transition cursor-pointer"
                  title="Call Helpline 1800 111 222"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            </header>

            {/* Questionnaire or Summary Phase */}
            {phase === 'PHASE_QUESTIONNAIRE' && (
              <QuestionnairePhase
                currentQuestionIndex={currentQuestionIndex}
                currentPrompt={currentPrompt}
                recognizedText={recognizedText}
                conversationState={conversationState}
                currentLang={currentLang}
                volume={volume}
                userProfile={userProfile}
                onRepeat={handleRepeatQuestion}
                onSubmitAnswer={handleAnswerSubmission}
                onSkip={handleSkipQuestion}
              />
            )}

            {phase === 'PHASE_SUMMARY' && (
              <SummaryPhase
                userProfile={userProfile}
                currentLang={currentLang}
                onReturnHome={handleReturnHome}
                onConnectCall={handleConnectCall}
              />
            )}
          </div>
        )}

        {/* SCREEN 5: Smart Chat Mode (Shared Conversation Profile & Questions) */}
        {screen === 'CHAT' && (
          <ChatPhase
            currentLang={currentLang}
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            onCompleteChat={() => {
              setScreen('VOICE_ASSISTANT');
              setPhase('PHASE_SUMMARY');
            }}
            onBackToHome={handleReturnHome}
            onSwitchToVoiceCall={handleConnectCall}
            currentQuestionIndex={currentQuestionIndex}
            onSyncQuestionIndex={setCurrentQuestionIndex}
          />
        )}

        {/* Two-Way Real Voice Call Pipeline (Audio Output, STT, Gratitude Ack, Call Controls) */}
        <CallSimulatorModal
          isOpen={isCallModalOpen}
          onClose={() => setIsCallModalOpen(false)}
          currentLang={currentLang}
          userProfile={userProfile}
          onUpdateProfile={setUserProfile}
          initialQuestionIndex={currentQuestionIndex}
          onSyncQuestionIndex={setCurrentQuestionIndex}
          onCompleteCall={() => {
            setIsCallModalOpen(false);
            setScreen('VOICE_ASSISTANT');
            setPhase('PHASE_SUMMARY');
          }}
        />

        {/* Staff Android Engineer Source Code & Bug Fix Inspector */}
        <CodeInspectorModal
          isOpen={isCodeModalOpen}
          onClose={() => setIsCodeModalOpen(false)}
        />
      </DeviceFrame>
    </>
  );
}
