import { LanguageCode, LanguageOption, QuestionDefinition } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    locale: 'en-IN',
    label: 'English',
    nativeLabel: 'English (India)',
    scriptLabel: 'English',
  },
  {
    code: 'hi',
    locale: 'hi-IN',
    label: 'Hindi',
    nativeLabel: 'हिंदी',
    scriptLabel: 'हिन्दी',
  },
  {
    code: 'kn',
    locale: 'kn-IN',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    scriptLabel: 'ಕನ್ನಡ',
  },
];

export const UI_STRINGS: Record<LanguageCode, {
  appName: string;
  schemeTitle: string;
  department: string;
  homeTitle: string;
  homeSubtitle: string;
  connectViaCallTitle: string;
  connectViaCallDesc: string;
  tollFreeNumber: string;
  connectViaVoiceTitle: string;
  connectViaVoiceDesc: string;
  langSelectBanner: string;
  langSelectSpokenPrompt: string;
  stateIdle: string;
  stateSpeaking: string;
  stateListening: string;
  stateProcessing: string;
  repeatQuestion: string;
  typeOrSkip: string;
  submitAnswer: string;
  placeholderAnswer: string;
  listeningTip: string;
  summaryTitle: string;
  summarySubtitle: string;
  returnHome: string;
  exportJson: string;
  callHelpdesk: string;
  verifiedBadge: string;
  recommendedTrack: string;
  profileSnapshot: string;
}> = {
  en: {
    appName: 'PM-AJAY Livelihood Assistant',
    schemeTitle: 'Pradhan Mantri Anusuchit Jaati Abhyuday Yojana',
    department: 'Ministry of Social Justice and Empowerment • Govt. of India',
    homeTitle: 'Find Skills & Business Grants Through Voice',
    homeSubtitle: 'An accessible, voice-first portal designed for beneficiaries. Simply speak or connect via call.',
    connectViaCallTitle: 'Connect via Call',
    connectViaCallDesc: 'Instant toll-free interactive voice response (IVR)',
    tollFreeNumber: '1800 111 222',
    connectViaVoiceTitle: 'Connect via Voice Assistant',
    connectViaVoiceDesc: 'Interactive smart questionnaire in your mother tongue',
    langSelectBanner: 'Select your language / अपनी भाषा चुनें / ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    langSelectSpokenPrompt: 'Please choose your language. Press English, Hindi, or Kannada.',
    stateIdle: 'Tap Speak to Begin',
    stateSpeaking: 'AI Speaking... (Mic Off)',
    stateListening: 'Listening... Speak Now',
    stateProcessing: 'Processing Voice...',
    repeatQuestion: 'Repeat Question',
    typeOrSkip: 'Type / Skip',
    submitAnswer: 'Confirm & Next',
    placeholderAnswer: 'Your spoken words will appear here or type manually...',
    listeningTip: 'Speak clearly into your phone. The microphone automatically pauses while the assistant speaks.',
    summaryTitle: 'Application Registered Successfully!',
    summarySubtitle: 'Your profile has been saved for PM-AJAY skilling & grant matching.',
    returnHome: 'Back to Home',
    exportJson: 'Export Beneficiary JSON',
    callHelpdesk: 'Call Scheme Officer',
    verifiedBadge: 'Verified PM-AJAY Profile',
    recommendedTrack: 'Matched PM-AJAY Recommendations',
    profileSnapshot: 'Beneficiary Profile Summary',
  },
  hi: {
    appName: 'पीएम-अजय आजीविका सहायक',
    schemeTitle: 'प्रधानमंत्री अनुसूचित जाति अभ्युदय योजना',
    department: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय • भारत सरकार',
    homeTitle: 'आवाज से कौशल प्रशिक्षण और व्यवसाय अनुदान पाएं',
    homeSubtitle: 'सभी लाभार्थियों के लिए सुलभ, सरल वॉइस पोर्टल। बस बोलें या निःशुल्क कॉल करें।',
    connectViaCallTitle: 'कॉल के माध्यम से जुड़ें',
    connectViaCallDesc: 'तुरंत टोल-फ्री आईवीआर हेल्पलाइन पर बात करें',
    tollFreeNumber: '1800 111 222',
    connectViaVoiceTitle: 'वॉइस असिस्टेंट से जुड़ें',
    connectViaVoiceDesc: 'अपनी मातृभाषा में संवादात्मक वॉइस प्रश्नावली शुरू करें',
    langSelectBanner: 'अपनी भाषा चुनें / Select your language / ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    langSelectSpokenPrompt: 'कृपया अपनी भाषा चुनें। अंग्रेजी, हिंदी या कन्नड़ दबाएं या बोलें।',
    stateIdle: 'शुरू करने के लिए टैप करें',
    stateSpeaking: 'सहायक बोल रहा है... (माइक बंद)',
    stateListening: 'सुन रहा है... अब बोलें',
    stateProcessing: 'आवाज प्रोसेस हो रही है...',
    repeatQuestion: 'प्रश्न दोहराएं',
    typeOrSkip: 'लिखें / छोड़ें',
    submitAnswer: 'पुष्टि करें और आगे बढ़ें',
    placeholderAnswer: 'आपके बोले गए शब्द यहाँ दिखाई देंगे या टाइप करें...',
    listeningTip: 'कृपया स्पष्ट बोलें। जब सहायक बोलता है, तो माइक स्वचालित रूप से बंद रहता है।',
    summaryTitle: 'प्रोफ़ाइल सफलतापूर्वक पंजीकृत!',
    summarySubtitle: 'पीएम-अजय योजना के तहत आपका विवरण दर्ज कर लिया गया है।',
    returnHome: 'मुख्य पृष्ठ',
    exportJson: 'डेटा JSON डाउनलोड करें',
    callHelpdesk: 'अधिकारी से बात करें',
    verifiedBadge: 'प्रमाणित पीएम-अजय प्रोफ़ाइल',
    recommendedTrack: 'आपके लिए अनुशंसित योजनाएं',
    profileSnapshot: 'लाभार्थी प्रोफ़ाइल सारांश',
  },
  kn: {
    appName: 'ಪಿಎಂ-ಅಜಯ್ ಜೀವನೋಪಾಯ ಸಹಾಯಕ',
    schemeTitle: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಅನುಸೂಚಿತ ಜಾತಿ ಅಭ್ಯುದಯ ಯೋಜನೆ',
    department: 'ಸಾಮಾಜಿಕ ನ್ಯಾಯ ಮತ್ತು ಸಬಲೀಕರಣ ಸಚಿವಾಲಯ • ಭಾರತ ಸರ್ಕಾರ',
    homeTitle: 'ಧ್ವನಿಯ ಮೂಲಕ ತರಬೇತಿ ಮತ್ತು ವ್ಯಾಪಾರ ಅನುದಾನ ಪಡೆಯಿರಿ',
    homeSubtitle: 'ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತೆ ಕಡಿಮೆ ಇರುವ ಫಲಾನುಭವಿಗಳಿಗಾಗಿ ಧ್ವನಿ-ಮೊದಲ ಪೋರ್ಟಲ್.',
    connectViaCallTitle: 'ಕರೆ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ',
    connectViaCallDesc: 'ಉಚಿತ ಟೋಲ್-ಫ್ರೀ ಐವಿಆರ್ ಸಹಾಯವಾಣಿ ಸಂಪರ್ಕಿಸಿ',
    tollFreeNumber: '1800 111 222',
    connectViaVoiceTitle: 'ಧ್ವನಿ ಸಹಾಯಕರ ಮೂಲಕ ಮಾತನಾಡಿ',
    connectViaVoiceDesc: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲೇ ಸಂವಾದಾತ್ಮಕ ಪ್ರಶ್ನೋತ್ತರ ನಡೆಸಿ',
    langSelectBanner: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select your language / अपनी भाषा चुनें',
    langSelectSpokenPrompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಅಥವಾ ಕನ್ನಡವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    stateIdle: 'ಪ್ರಾರಂಭಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    stateSpeaking: 'ಸಹಾಯಕ ಮಾತನಾಡುತ್ತಿದ್ದಾನೆ... (ಮೈಕ್ ಆಫ್)',
    stateListening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ',
    stateProcessing: 'ಧ್ವನಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    repeatQuestion: 'ಪ್ರಶ್ನೆಯನ್ನು ಪುನರಾವರ್ತಿಸಿ',
    typeOrSkip: 'ಟೈಪ್ ಮಾಡಿ / ಸ್ಕಿಪ್',
    submitAnswer: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಮುಂದೆ ಹೋಗಿ',
    placeholderAnswer: 'ನೀವು ಮಾತನಾಡುವ ಮಾತುಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ...',
    listeningTip: 'ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ. ಸಹಾಯಕ ಮಾತನಾಡುವಾಗ ಮೈಕ್ರೊಫೋನ್ ತಾನಾಗಿಯೇ ಸ್ಥಗಿತಗೊಳ್ಳುತ್ತದೆ.',
    summaryTitle: 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ!',
    summarySubtitle: 'ಪಿಎಂ-ಅಜಯ್ ಕೌಶಲ್ಯ ಮತ್ತು ಅನುದಾನಕ್ಕಾಗಿ ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.',
    returnHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    exportJson: 'ವಿವರಗಳನ್ನು JSON ನಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    callHelpdesk: 'ಯೋಜನಾ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ',
    verifiedBadge: 'ದೃಢೀಕರಿಸಿದ ಪಿಎಂ-ಅಜಯ್ ಪ್ರೊಫೈಲ್',
    recommendedTrack: 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾದ ಯೋಜನೆಗಳು',
    profileSnapshot: 'ಫಲಾನುಭವಿ ಪ್ರೊಫೈಲ್ ಸಾರಾಂಶ',
  },
};

export const QUESTIONS_CONFIG: QuestionDefinition[] = [
  {
    id: 1,
    slotKey: 'name',
    prompts: {
      en: "Warm welcome to PM-AJAY Livelihood Assistant. We are honored to assist you with free skills and business grants. May I please know your name?",
      hi: "पीएम-अजय आजीविका सहायक में आपका हार्दिक और विनम्र स्वागत है। हम आपके लिए सर्वोत्तम कौशल और व्यवसाय अनुदान खोजने में आपकी सहायता करेंगे। क्या आप कृपया अपना शुभ नाम बताएंगे?",
      kn: "ಪಿಎಂ-ಅಜಯ್ ಜೀವನೋಪಾಯ ಸಹಾಯಕಕ್ಕೆ ತಮಗೆ ಆತ್ಮೀಯ ಸ್ವಾಗತ. ತಮಗೆ ಸೂಕ್ತವಾದ ಕೌಶಲ್ಯ ಮತ್ತು ವ್ಯಾಪಾರ ಅನುದಾನವನ್ನು ಕಂಡುಕೊಳ್ಳಲು ನಾವು ಇಲ್ಲಿದ್ದೇವೆ. ದಯವಿಟ್ಟು ತಮ್ಮ ಶುಭ ಹೆಸರನ್ನು ತಿಳಿಸುವಿರಾ?",
    },
    quickSuggestions: {
      en: ['Ramesh Kumar', 'Sunita Devi', 'Anand Rao'],
      hi: ['रमेश कुमार', 'सुनीता देवी', 'आनंद राव'],
      kn: ['ರಮೇಶ್ ಕುಮಾರ್', 'ಸುನೀತಾ ದೇವಿ', 'ಆನಂದ್ ರಾವ್'],
    },
  },
  {
    id: 2,
    slotKey: 'location',
    prompts: {
      en: "Namaste {Name}. Could you kindly share your district or your 6-digit pincode?",
      hi: "सादर नमस्ते {Name} जी। क्या आप कृपया अपना जिला या अपना 6 अंकों का पिनकोड बताने की कृपा करेंगे?",
      kn: "ಆತ್ಮೀಯ ನಮಸ್ಕಾರ {Name} ಅವರೇ. ದಯಮಾಡಿ ತಮ್ಮ ಜಿಲ್ಲೆ ಅಥವಾ 6 ಅಂಕಿಯ ಪಿನ್‌ಕೋಡ್ ತಿಳಿಸುವಿರಾ?",
    },
    quickSuggestions: {
      en: ['Bengaluru 560001', 'Belagavi 590001', 'Kalaburagi 585101'],
      hi: ['लखनऊ 226001', 'वाराणसी 221001', 'पटना 800001'],
      kn: ['ಬೆಂಗಳೂರು 560001', 'ಬೆಳಗಾವಿ 590001', 'ಕಲಬುರಗಿ 585101'],
    },
  },
  {
    id: 3,
    slotKey: 'incomeLessThan2Point5Lakh',
    prompts: {
      en: "Thank you kindly. Could you please let us know if your family's total annual income is less than 2.5 Lakh rupees? Please feel free to say Yes or No.",
      hi: "जी धन्यवाद। क्या आपके परिवार की कुल वार्षिक आय 2.5 लाख रुपये से कम है? कृपया 'हाँ' या 'ना' में बताने की कृपा करें।",
      kn: "ಧನ್ಯವಾದಗಳು. ತಮ್ಮ ಕುಟುಂಬದ ಒಟ್ಟು ವಾರ್ಷಿಕ ಆದಾಯ 2.5 ಲಕ್ಷ ರೂಪಾಯಿಗಳಿಗಿಂತ ಕಡಿಮೆಯಿದೆಯೇ? ದಯವಿಟ್ಟು 'ಹೌದು' ಅಥವಾ 'ಇಲ್ಲ' ಎಂದು ತಿಳಿಸಿ.",
    },
    quickSuggestions: {
      en: ['Yes, less than 2.5 Lakh', 'No, more than 2.5 Lakh'],
      hi: ['हाँ, 2.5 लाख से कम', 'नहीं, 2.5 लाख से ज्यादा'],
      kn: ['ಹೌದು, 2.5 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', 'ಇಲ್ಲ, 2.5 ಲಕ್ಷಕ್ಕಿಂತ ಹೆಚ್ಚು'],
    },
  },
  {
    id: 4,
    slotKey: 'education',
    prompts: {
      en: "Thank you very much. May I politely know what is the highest class you have studied up to?",
      hi: "जी बहुत धन्यवाद। क्या आप कृपया बताएंगे कि आपने किस कक्षा तक पढ़ाई की है?",
      kn: "ಧನ್ಯವಾದಗಳು. ತಾವು ಗರಿಷ್ಠ ಯಾವ ತರಗತಿಯವರೆಗೆ ವಿದ್ಯಾಭ್ಯಾಸ ಮಾಡಿದ್ದೀರಿ ಎಂದು ದಯವಿಟ್ಟು ತಿಳಿಸಿ.",
    },
    quickSuggestions: {
      en: ['10th Pass (SSLC)', '12th Pass (PUC)', '8th Standard', 'Graduate'],
      hi: ['10वीं पास', '12वीं पास', '8वीं कक्षा', 'स्नातक'],
      kn: ['10ನೇ ತರಗತಿ (SSLC)', '12ನೇ ತರಗತಿ (PUC)', '8ನೇ ತರಗತಿ', 'ಪದವಿ'],
    },
  },
  {
    id: 5,
    slotKey: 'traditionalSkill',
    prompts: {
      en: "Thank you so much. Does your family practice any traditional craft or heritage work, like farming, weaving, or carpentry? Please share with us.",
      hi: "हृदय से धन्यवाद। क्या आपके परिवार में कोई पारंपरिक हुनर या कार्य है, जैसे खेती, बुनाई या बढ़ईगिरी? कृपया हमें बताएं।",
      kn: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು. ತಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಕೃಷಿ, ನೇಯ್ಗೆ ಅಥವಾ ಮರಗೆಲಸದಂತಹ ಯಾವುದೇ ಸಾಂಪ್ರದಾಯಿಕ ಕಲೆಯ ಹಿನ್ನೆಲೆ ಇದೆಯೇ? ದಯವಿಟ್ಟು ಹಂಚಿಕೊಳ್ಳಿ.",
    },
    quickSuggestions: {
      en: ['Weaving & Handloom', 'Carpentry', 'Farming & Dairy', 'None / Other'],
      hi: ['बुनाई व हथकरघा', 'बढ़ईगीरी', 'खेती व पशुपालन', 'कोई नहीं / अन्य'],
      kn: ['ನೇಯ್ಗೆ ಮತ್ತು ಕೈಮಗ್ಗ', 'ಮರಗೆಲಸ (ಬಡಗಿ)', 'ಕೃಷಿ ಮತ್ತು ಹೈನುಗಾರಿಕೆ', 'ಯಾವುದೂ ಇಲ್ಲ / ಇತರೆ'],
    },
  },
  {
    id: 6,
    slotKey: 'currentLivelihood',
    prompts: {
      en: "Thank you kindly. And could you please tell me what work you are currently doing to earn a living?",
      hi: "जी धन्यवाद। और इस समय आजीविका कमाने के लिए आप क्या कार्य कर रहे हैं, कृपया साझा करें?",
      kn: "ಧನ್ಯವಾದಗಳು. ಜೀವನೋಪಾಯಕ್ಕಾಗಿ ತಾವು ಪ್ರಸ್ತುತ ಯಾವ ಕೆಲಸವನ್ನು ಮಾಡುತ್ತಿದ್ದೀರಿ ಎಂದು ದಯಮಾಡಿ ತಿಳಿಸುವಿರಾ?",
    },
    quickSuggestions: {
      en: ['Daily Wage Worker', 'Tailoring & Stitching', 'Agricultural Labor', 'Currently Unemployed'],
      hi: ['दिहाड़ी मजदूर', 'सिलाई का काम', 'खेतिहर मजदूर', 'वर्तमान में बेरोजगार'],
      kn: ['ದೈನಂದಿನ ಕೂಲಿ ಕಾರ್ಮಿಕ', 'ದರ್ಜಿ / ಹೊಲಿಗೆ ಕೆಲಸ', 'ಕೃಷಿ ಕೂಲಿ', 'ಪ್ರಸ್ತುತ ನಿರುದ್ಯೋಗಿ'],
    },
  },
  {
    id: 7,
    slotKey: 'toolsSkills',
    prompts: {
      en: "That is wonderful to know. Could you kindly share what tools, machines, or skills you already feel comfortable using?",
      hi: "बहुत अच्छा। आपको पहले से कौन से औजार, मशीनें या कार्य करने में सहजता है, कृपया बताएं?",
      kn: "ತುಂಬಾ ಸಂತೋಷ. ತಮಗೆ ಈಗಾಗಲೇ ಯಾವ ಉಪಕರಣಗಳು ಅಥವಾ ಯಂತ್ರಗಳನ್ನು ಬಳಸಲು ತಿಳಿದಿದೆ ಎಂದು ದಯವಿಟ್ಟು ತಿಳಿಸಿ.",
    },
    quickSuggestions: {
      en: ['Sewing Machine & Cutting', 'Smartphone & Basic Computer', 'Two Wheeler Repair', 'Electrical Wiring'],
      hi: ['सिलाई मशीन व कटिंग', 'स्मार्टफोन व कंप्यूटर', 'दुपहिया मरम्मत', 'इलेक्ट्रिकल वायरिंग'],
      kn: ['ಹೊಲಿಗೆ ಯಂತ್ರ ಮತ್ತು ಕಟಿಂಗ್', 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಮತ್ತು ಕಂಪ್ಯೂಟರ್', 'ದ್ವಿಚಕ್ರ ವಾಹನ ರಿಪೇರಿ', 'ವಿದ್ಯುತ್ ವೈರಿಂಗ್'],
    },
  },
  {
    id: 8,
    slotKey: 'mobilityRadiusKm',
    prompts: {
      en: "Thank you kindly. For your daily training, how many kilometers would you feel comfortable traveling?",
      hi: "जी बहुत धन्यवाद। प्रशिक्षण के लिए आप प्रतिदिन कितनी दूर तक आराम से यात्रा कर सकते हैं? कृपया किलोमीटर में बताएं।",
      kn: "ಧನ್ಯವಾದಗಳು. ತರಬೇತಿಗಾಗಿ ಪ್ರತಿದಿನ ತಾವು ಎಷ್ಟು ಕಿಲೋಮೀಟರ್ ದೂರದವರೆಗೆ ಆರಾಮವಾಗಿ ಪ್ರಯಾಣಿಸಬಹುದು ಎಂದು ತಿಳಿಸಿ.",
    },
    quickSuggestions: {
      en: ['Within 5 km', '10 to 15 km', 'Up to 25 km', 'Only in my village'],
      hi: ['5 किमी के अंदर', '10 से 15 किमी', '25 किमी तक', 'केवल अपने गांव में'],
      kn: ['5 ಕಿಮೀ ಒಳಗೆ', '10 ರಿಂದ 15 ಕಿಮೀ', '25 ಕಿಮೀ ವರೆಗೆ', 'ನನ್ನ ಗ್ರಾಮದಲ್ಲಿ ಮಾತ್ರ'],
    },
  },
  {
    id: 9,
    slotKey: 'careerPreference',
    prompts: {
      en: "Thank you so much. Would you prefer a stable wage job with a company, or would you like to start your own business with our government grant support?",
      hi: "सादर धन्यवाद। क्या आप किसी कंपनी में नियमित नौकरी करना पसंद करेंगे, या सरकारी अनुदान के साथ अपना खुद का व्यवसाय शुरू करना चाहेंगे?",
      kn: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು. ತಾವು ಯಾವುದಾದರೂ ಕಂಪನಿಯಲ್ಲಿ ಉದ್ಯೋಗ ಮಾಡಲು ಇಷ್ಟಪಡುತ್ತೀರಾ ಅಥವಾ ಸರ್ಕಾರದ ಅನುದಾನದೊಂದಿಗೆ ಸ್ವಂತ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೀರಾ?",
    },
    quickSuggestions: {
      en: ['Start My Own Business (Grant/Subsidy)', 'Wage Job at a Company'],
      hi: ['खुद का व्यवसाय शुरू करना (अनुदान/सब्सिडी)', 'कंपनी में नौकरी'],
      kn: ['ಸ್ವಂತ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಲು (ಅನುದಾನ/ಸಹಾಯಧನ)', 'ಕಂಪನಿಯಲ್ಲಿ ಉದ್ಯೋಗ'],
    },
  },
];

export const SUMMARY_ACK_PROMPTS: Record<LanguageCode, string> = {
  en: "Thank you so kindly, {Name}. We have safely and respectfully registered your profile for PM-AJAY skilling and welfare grants.",
  hi: "बहुत-बहुत धन्यवाद {Name} जी। हमने पीएम-अजय कौशल विकास और अनुदान सहायता के लिए आपकी प्रोफ़ाइल को आदरपूर्वक दर्ज कर लिया है।",
  kn: "ತುಂಬು ಹೃದಯದ ಧನ್ಯವಾದಗಳು {Name} ಅವರೇ. ಪಿಎಂ-ಅಜಯ್ ಕೌಶಲ್ಯ ಮತ್ತು ಅನುದಾನ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ತಮ್ಮ ವಿವರಗಳನ್ನು ಗೌರವಯುತವಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ.",
};

export const SLOT_DISPLAY_LABELS: Record<string, Record<LanguageCode, string>> = {
  name: { en: 'Full Name', hi: 'पूरा नाम', kn: 'ಪೂರ್ಣ ಹೆಸರು' },
  location: { en: 'District / Pincode', hi: 'जिला / पिनकोड', kn: 'ಜಿಲ್ಲೆ / ಪಿನ್‌ಕೋಡ್' },
  incomeLessThan2Point5Lakh: { en: 'Income < 2.5L', hi: 'वार्षिक आय < 2.5 लाख', kn: 'ಆದಾಯ < 2.5 ಲಕ್ಷ' },
  education: { en: 'Education', hi: 'शिक्षा स्तर', kn: 'ಶಿಕ್ಷಣ ಮಟ್ಟ' },
  traditionalSkill: { en: 'Traditional Skill', hi: 'पारंपरिक हुनर', kn: 'ಸಾಂಪ್ರದಾಯಿಕ ಕೌಶಲ್ಯ' },
  currentLivelihood: { en: 'Current Work', hi: 'वर्तमान कार्य', kn: 'ಪ್ರಸ್ತುತ ಕೆಲಸ' },
  toolsSkills: { en: 'Tools Known', hi: 'उपकरण / कौशल', kn: 'ತಿಳಿದಿರುವ ಉಪಕರಣಗಳು' },
  mobilityRadiusKm: { en: 'Mobility Radius', hi: 'दैनिक यात्रा दायरा', kn: 'ಪ್ರಯಾಣದ ಮಿತಿ' },
  careerPreference: { en: 'Career Goal', hi: 'करियर लक्ष्य', kn: 'ಆದ್ಯತೆಯ ಗುರಿ' },
};
