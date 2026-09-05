export type SupportedLocale = 'en-IN' | 'hi-IN' | 'kn-IN';

export type LanguageCode = 'en' | 'hi' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  locale: SupportedLocale;
  label: string;
  nativeLabel: string;
  scriptLabel: string;
}

export type ConversationState =
  | 'STATE_IDLE'
  | 'STATE_AI_SPEAKING'
  | 'STATE_LISTENING'
  | 'STATE_PROCESSING';

export interface QuestionnaireSlot {
  key:
    | 'name'
    | 'location'
    | 'income'
    | 'education'
    | 'traditionalSkill'
    | 'currentLivelihood'
    | 'toolsSkills'
    | 'mobility'
    | 'preference';
  label: string;
  questionIndex: number;
}

export interface UserProfileData {
  name: string;
  location: string;
  incomeLessThan2Point5Lakh: string;
  education: string;
  traditionalSkill: string;
  currentLivelihood: string;
  toolsSkills: string;
  mobilityRadiusKm: string;
  careerPreference: string;
}

export interface QuestionDefinition {
  id: number;
  slotKey: keyof UserProfileData;
  prompts: Record<LanguageCode, string>;
  quickSuggestions?: Record<LanguageCode, string[]>;
}

export type AppScreen = 'START' | 'LANGUAGE' | 'HOME' | 'VOICE_ASSISTANT' | 'CHAT';

export type VoiceAssistantPhase = 'PHASE_LANGUAGE_SELECT' | 'PHASE_QUESTIONNAIRE' | 'PHASE_SUMMARY';
