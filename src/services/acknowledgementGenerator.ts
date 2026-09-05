import { LanguageCode, UserProfileData } from '../types';

/**
 * Generates polite, soft, warm, and context-aware acknowledgements.
 * Focuses on courteous honorifics, gentle gratitude, and conversational warmth.
 */
export function generateNaturalAcknowledgement(
  questionIndex: number,
  answerText: string,
  lang: LanguageCode,
  profile: UserProfileData
): string {
  const cleanAnswer = answerText.trim();
  const userName = profile.name.trim() || 'Beneficiary';

  // Seed variation to maintain conversational freshness
  const variant = (cleanAnswer.length + questionIndex) % 3;

  if (lang === 'hi') {
    switch (questionIndex) {
      case 0: // Name answered
        return variant === 0
          ? `बहुत-बहुत धन्यवाद, ${cleanAnswer} जी। आपसे बात करके अत्यंत प्रसन्नता हुई।`
          : variant === 1
          ? `नमस्ते ${cleanAnswer} जी, आपका स्वागत है। आपसे परिचय पाकर बहुत अच्छा लगा।`
          : `जी बहुत धन्यवाद, ${cleanAnswer} जी। मैंने आपका शुभ नाम आदरपूर्वक दर्ज कर लिया है।`;
      case 1: // Location
        return variant === 0
          ? `स्थान बताने के लिए आपका बहुत-बहुत धन्यवाद। हम आपके नजदीकी केंद्र खोज रहे हैं।`
          : variant === 1
          ? `जी धन्यवाद। आपके जिले की जानकारी से हमें नजदीकी सहायता केंद्र चुनने में आसानी होगी।`
          : `बहुत अच्छा, सादर धन्यवाद। आपकी सुविधा अनुसार नजदीकी स्थान देखा जाएगा।`;
      case 2: // Income eligibility
        return variant === 0
          ? `जानकारी साझा करने के लिए विनम्रतापूर्वक धन्यवाद। इससे आपकी योजना पात्रता सुनिश्चित होती है।`
          : variant === 1
          ? `जी धन्यवाद, इस विवरण से आपको प्राथमिकता सहायता दिलाने में मदद मिलेगी।`
          : `सहयोग के लिए धन्यवाद। हमने आपकी आय संबंधी पात्रता दर्ज कर ली है।`;
      case 3: // Education
        return variant === 0
          ? `शिक्षा का विवरण साझा करने के लिए धन्यवाद। हम आपकी पढ़ाई के अनुकूल प्रशिक्षण जोड़ेंगे।`
          : variant === 1
          ? `जी बहुत धन्यवाद। हम आपकी योग्यता के अनुसार ही सबसे सरल और उपयोगी कोर्स सुझाएंगे।`
          : `जानकारी देने के लिए सादर धन्यवाद।`;
      case 4: // Traditional skill
        return variant === 0
          ? `हृदय से धन्यवाद। आपका यह पारंपरिक हुनर सरकारी व्यवसाय अनुदान में बहुत मूल्यवान रहेगा।`
          : variant === 1
          ? `जी धन्यवाद, आपके इस पारिवारिक हुनर का पूरा सम्मान करते हुए हम योजनाएं जोड़ेंगे।`
          : `इस सुंदर कौशल को साझा करने के लिए बहुत-बहुत धन्यवाद।`;
      case 5: // Current work
        return variant === 0
          ? `वर्तमान कार्य की जानकारी देने के लिए धन्यवाद। इससे बेहतर आजीविका का मार्ग बनेगा।`
          : variant === 1
          ? `जी धन्यवाद, आपके इस अनुभव को ध्यान में रखकर ही हम आगे का मार्गदर्शन करेंगे।`
          : `सादर धन्यवाद, हमने आपका वर्तमान कार्य विवरण नोट कर लिया है।`;
      case 6: // Tools/Skills
        return variant === 0
          ? `बहुत-बहुत धन्यवाद। यह अनुभव आपको ₹15,000 के निःशुल्क टूलकिट अनुदान से जोड़ने में बहुत सहायक होगा।`
          : variant === 1
          ? `जी धन्यवाद, आपकी तकनीकी कुशलता जानकर बहुत प्रसन्नता हुई।`
          : `उपकरणों की जानकारी साझा करने के लिए आभार।`;
      case 7: // Mobility radius
        return variant === 0
          ? `जी बहुत धन्यवाद। हम आपकी सुविधानुसार इसी यात्रा दूरी के भीतर ही केंद्र का चयन करेंगे।`
          : variant === 1
          ? `यात्रा दायरा बताने के लिए धन्यवाद। आपको अधिक दूर न जाना पड़े, इसका पूरा ध्यान रखेंगे।`
          : `सादर धन्यवाद।`;
      case 8: // Career preference
        return `अपनी आकांक्षा और प्राथमिकता साझा करने के लिए आपका कोटि-कोटि धन्यवाद।`;
      default:
        return 'जी, बहुत-बहुत धन्यवाद।';
    }
  }

  if (lang === 'kn') {
    switch (questionIndex) {
      case 0: // Name answered
        return variant === 0
          ? `ತುಂಬಾ ಧನ್ಯವಾದಗಳು, ${cleanAnswer} ಅವರೇ. ತಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಲು ಅತ್ಯಂತ ಸಂತೋಷವಾಗುತ್ತಿದೆ.`
          : variant === 1
          ? `ನಮಸ್ಕಾರ ${cleanAnswer} ಅವರೇ, ತಮ್ಮ ಪರಿಚಯ ಮಾಡಿಕೊಟ್ಟಿದ್ದಕ್ಕಾಗಿ ತುಂಬು ಹೃದಯದ ಧನ್ಯವಾದಗಳು.`
          : `ಧನ್ಯವಾದಗಳು ${cleanAnswer} ಅವರೇ, ತಮ್ಮ ಹೆಸರನ್ನು ಗೌರವಯುತವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.`;
      case 1: // Location
        return variant === 0
          ? `ಸ್ಥಳದ ವಿವರಗಳನ್ನು ಪ್ರೀತಿಯಿಂದ ತಿಳಿಸಿದ್ದಕ್ಕಾಗಿ ತುಂಬಾ ಧನ್ಯವಾದಗಳು. ತಮ್ಮ ಹತ್ತಿರದ ಕೇಂದ್ರವನ್ನು ನಾವು ಹುಡುಕುತ್ತಿದ್ದೇವೆ.`
          : variant === 1
          ? `ತಿಳಿದುಕೊಂಡೆವು, ಧನ್ಯವಾದಗಳು. ಇದು ತಮಗೆ ಹತ್ತಿರದ ತರಬೇತಿ ಸ್ಥಳವನ್ನು ಕಂಡುಕೊಳ್ಳಲು ನೆರವಾಗುತ್ತದೆ.`
          : `ತುಂಬಾ ಧನ್ಯವಾದಗಳು.`;
      case 2: // Income eligibility
        return variant === 0
          ? `ಮಾಹಿತಿಯನ್ನು ದೃಢಪಡಿಸಿದ್ದಕ್ಕಾಗಿ ತುಂಬು ಹೃದಯದ ಧನ್ಯವಾದಗಳು. ಇದು ಯೋಜನೆ ಸೌಲಭ್ಯವನ್ನು ಸುಲಭಗೊಳಿಸುತ್ತದೆ.`
          : variant === 1
          ? `ಧನ್ಯವಾದಗಳು, ಈ ಮಾಹಿತಿಯು ಸರ್ಕಾರದ ಆದ್ಯತೆಯ ಅನುದಾನ ಪಡೆಯಲು ಸಹಕಾರಿಯಾಗಿದೆ.`
          : `ಸಹಕಾರಕ್ಕೆ ಧನ್ಯವಾದಗಳು.`;
      case 3: // Education
        return variant === 0
          ? `ವಿದ್ಯಾಭ್ಯಾಸದ ವಿವರ ತಿಳಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ತಮ್ಮ ಅರ್ಹತೆಗೆ ತಕ್ಕಂತೆ ಉತ್ತಮ ತರಬೇತಿ ನೀಡುತ್ತೇವೆ.`
          : variant === 1
          ? `ತುಂಬಾ ಧನ್ಯವಾದಗಳು. ತಾವು ಸುಲಭವಾಗಿ ಕಲಿಯಬಹುದಾದ ಕೋರ್ಸ್‌ಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ.`
          : `ಧನ್ಯವಾದಗಳು.`;
      case 4: // Traditional skill
        return variant === 0
          ? `ತುಂಬಾ ಧನ್ಯವಾದಗಳು. ತಮ್ಮ ಈ ಸಾಂಪ್ರದಾಯಿಕ ಕಲೆಯು ಸರ್ಕಾರದ ಉದ್ಯಮ ಬೆಂಬಲಕ್ಕೆ ಬಹಳ ಮುಖ್ಯವಾಗಿದೆ.`
          : variant === 1
          ? `ತಮ್ಮ ಕುಟುಂಬದ ಈ ಕೌಶಲ್ಯವನ್ನು ಗೌರವಿಸುತ್ತೇವೆ, ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು.`
          : `ಉತ್ತಮ, ಧನ್ಯವಾದಗಳು.`;
      case 5: // Current work
        return variant === 0
          ? `ತಾಳ್ಮೆಯಿಂದ ತಿಳಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಇದು ನಿಮ್ಮ ಭವಿಷ್ಯದ ಜೀವನೋಪಾಯವನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಸಹಾಯಕ.`
          : variant === 1
          ? `ಧನ್ಯವಾದಗಳು, ತಮ್ಮ ಈ ಕೆಲಸದ ಅನುಭವವನ್ನು ಗಮನದಲ್ಲಿಟ್ಟುಕೊಂಡು ಯೋಜನೆ ರೂಪಿಸುತ್ತೇವೆ.`
          : `ಧನ್ಯವಾದಗಳು.`;
      case 6: // Tools/Skills
        return variant === 0
          ? `ತುಂಬಾ ಧನ್ಯವಾದಗಳು. ಇದು ₹15,000 ಉಚಿತ ಆಧುನಿಕ ಟೂಲ್‌ಕಿಟ್ ಪಡೆಯಲು ತಮಗೆ ಬಹಳ ನೆರವಾಗುತ್ತದೆ.`
          : variant === 1
          ? `ತಮ್ಮ ಕೈಚಳಕದ ಬಗ್ಗೆ ತಿಳಿದು ಸಂತೋಷವಾಯಿತು, ಧನ್ಯವಾದಗಳು.`
          : `ಧನ್ಯವಾದಗಳು.`;
      case 7: // Mobility radius
        return variant === 0
          ? `ಪ್ರಯಾಣದ ಮಿತಿ ತಿಳಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ತಮಗೆ ತೊಂದರೆಯಾಗದಂತೆ ಹತ್ತಿರದಲ್ಲೇ ಕೇಂದ್ರ ವ್ಯವಸ್ಥೆ ಮಾಡುತ್ತೇವೆ.`
          : variant === 1
          ? `ಧನ್ಯವಾದಗಳು. ತಮ್ಮ ಅನುಕೂಲದ ವ್ಯಾಪ್ತಿಯೊಳಗೆ ತರಬೇತಿ ಒದಗಿಸಲು ಶ್ರಮಿಸುತ್ತೇವೆ.`
          : `ಧನ್ಯವಾದಗಳು.`;
      case 8: // Career preference
        return `ತಮ್ಮ ಕನಸು ಹಾಗೂ ಆದ್ಯತೆಯನ್ನು ನಮ್ಮೊಂದಿಗೆ ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ತುಂಬು ಹೃದಯದ ಧನ್ಯವಾದಗಳು.`;
      default:
        return 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು.';
    }
  }

  // English Default - Courteous, gentle, respectful
  switch (questionIndex) {
    case 0: // Name answered
      return variant === 0
        ? `Thank you so kindly, ${cleanAnswer}. It is truly a pleasure to assist you today.`
        : variant === 1
        ? `Warm welcome, ${cleanAnswer}. Thank you for introducing yourself so politely.`
        : `Thank you, ${cleanAnswer}. I have gently noted your name in our records.`;

    case 1: // Location
      return variant === 0
        ? `Thank you so much for sharing your location. That helps us find training centers nearest to you.`
        : variant === 1
        ? `Got it, thank you kindly. We will locate the most convenient regional facilities for you.`
        : `Thank you so much. That is very helpful to know.`;

    case 2: // Income eligibility
      return variant === 0
        ? `Thank you kindly for confirming this detail. It ensures you receive priority scheme benefits.`
        : variant === 1
        ? `Thank you very much. That qualifies your application for direct PM-AJAY welfare assistance.`
        : `I appreciate your confirmation, thank you.`;

    case 3: // Education
      return variant === 0
        ? `Thank you very much for sharing that. We will align our courses comfortably with your background.`
        : variant === 1
        ? `Thank you kindly. We will ensure the learning curriculum is comfortable and supportive.`
        : `Thank you so much for letting me know.`;

    case 4: // Traditional skill
      return variant === 0
        ? `Thank you so kindly for sharing this. Your traditional craft and heritage skills are deeply valued.`
        : variant === 1
        ? `I truly appreciate you telling me that. We will connect your craft to specialized seed grants.`
        : `Thank you very much. That is wonderful to hear.`;

    case 5: // Current work
      return variant === 0
        ? `Thank you kindly for sharing your work details. That helps us plan your livelihood upgrade smoothly.`
        : variant === 1
        ? `Thank you very much. Understanding your daily routine helps us suggest flexible training hours.`
        : `Thank you so much for sharing.`;

    case 6: // Tools/Skills
      return variant === 0
        ? `Thank you so kindly. Your hands-on experience will help fast-track your ₹15,000 toolkit grant.`
        : variant === 1
        ? `I appreciate that very much. It gives us a wonderful picture of your practical abilities.`
        : `Thank you, that is wonderfully helpful to know.`;

    case 7: // Mobility radius
      return variant === 0
        ? `Thank you kindly. We will make sure your recommended centers fall comfortably within that travel distance.`
        : variant === 1
        ? `Thank you so much. We want to ensure your daily journey is completely peaceful and manageable.`
        : `Understood, thank you kindly.`;

    case 8: // Career preference
      return variant === 0
        ? `Thank you so kindly for sharing your dream and goals with us. We will prepare your grant package with care.`
        : `Thank you very much. It has been an absolute pleasure assisting you with your livelihood plan.`;

    default:
      return variant === 0 ? 'Thank you so kindly.' : variant === 1 ? 'Thank you very much.' : 'I appreciate that, thank you.';
  }
}
