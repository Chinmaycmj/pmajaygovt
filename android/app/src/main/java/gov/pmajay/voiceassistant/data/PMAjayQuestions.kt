package gov.pmajay.voiceassistant.data

object PMAjayQuestions {

    private val questionsEn = listOf(
        "Welcome to PM-AJAY Livelihood Assistant. Let's find the best training or business grant for you. First, what is your name?",
        "Namaste {Name}. Please tell me your District or your 6-digit Pincode.",
        "Is your family's total annual income less than 2.5 Lakh rupees? Please say Yes or No.",
        "What is the highest class you have studied up to?",
        "Does your family have a traditional work, like farming, weaving, or carpentry? Tell me what it is.",
        "And what work are you doing right now to earn a living?",
        "What tools, machines, or specific skills do you already know how to use?",
        "How far can you travel every day for training? Tell me the distance in kilometers.",
        "Do you want to get a wage job at a company, or do you want to start your own business?"
    )

    private val questionsHi = listOf(
        "पीएम-अजय आजीविका सहायक में आपका स्वागत है। आइए आपके लिए सर्वोत्तम प्रशिक्षण या व्यवसाय अनुदान खोजें। सबसे पहले, आपका नाम क्या है?",
        "नमस्ते {Name}। कृपया अपना जिला या अपना 6 अंकों का पिनकोड बताएं।",
        "क्या आपके परिवार की कुल वार्षिक आय 2.5 लाख रुपये से कम है? कृपया हाँ या ना कहें।",
        "आपने अधिकतम किस कक्षा तक पढ़ाई की है?",
        "क्या आपके परिवार का कोई पारंपरिक काम है, जैसे खेती, बुनाई या बढ़ईगिरी? मुझे बताएं वह क्या है।",
        "और आजीविका कमाने के लिए आप अभी क्या काम कर रहे हैं?",
        "आपको पहले से कौन से औजार, मशीनें या विशेष कौशल चलाने आते हैं?",
        "प्रशिक्षण के लिए आप प्रतिदिन कितनी दूर तक यात्रा कर सकते हैं? मुझे किलोमीटर में दूरी बताएं।",
        "क्या आप किसी कंपनी में वेतन वाली नौकरी करना चाहते हैं, या अपना खुद का व्यवसाय शुरू करना चाहते हैं?"
    )

    private val questionsKn = listOf(
        "ಪಿಎಂ-ಅಜಯ್ ಜೀವನೋಪಾಯ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಿಮಗಾಗಿ ಉತ್ತಮ ತರಬೇತಿ ಅಥವಾ ಅನುದಾನವನ್ನು ಹುಡುಕೋಣ. ಮೊದಲನೆಯದಾಗಿ, ನಿಮ್ಮ ಹೆಸರೇನು?",
        "ನಮಸ್ಕಾರ {Name}. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಜಿಲ್ಲೆ ಅಥವಾ 6 ಅಂಕಿಯ ಪಿನ್ಕೋಡ್ ತಿಳಿಸಿ.",
        "ನಿಮ್ಮ ಕುಟುಂಬದ ಒಟ್ಟು ವಾರ್ಷಿಕ ಆದಾಯ 2.5 ಲಕ್ಷ ರೂಪಾಯಿಗಳಿಗಿಂತ ಕಡಿಮೆಯಿದೆಯೇ? ಹೌದು ಅಥವಾ ಇಲ್ಲ ಎಂದು ಹೇಳಿ.",
        "ನೀವು ಗರಿಷ್ಠ ಯಾವ ತರಗತಿಯವರೆಗೆ ಓದಿದ್ದೀರಿ?",
        "ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಕೃಷಿ, ನೇಯ್ಗೆ ಅಥವಾ ಮರಗೆಲಸದಂತಹ ಸಾಂಪ್ರದಾಯಿಕ ಕೆಲಸವಿದೆಯೇ? ಅದು ಏನು ಎಂದು ತಿಳಿಸಿ.",
        "ಜೀವನೋಪಾಯಕ್ಕಾಗಿ ನೀವು ಪ್ರಸ್ತುತ ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ?",
        "ನಿಮಗೆ ಈಗಾಗಲೇ ಯಾವ ಉಪಕರಣಗಳು ಅಥವಾ ಕೌಶಲ್ಯಗಳನ್ನು ಬಳಸಲು ತಿಳಿದಿದೆ?",
        "ತರಬೇತಿಗಾಗಿ ನೀವು ಪ್ರತಿದಿನ ಎಷ್ಟು ಕಿಲೋಮೀಟರ್ ಪ್ರಯಾಣಿಸಬಹುದು?",
        "ನೀವು ಕಂಪನಿಯಲ್ಲಿ ಉದ್ಯೋಗ ಪಡೆಯಲು ಬಯಸುತ್ತೀರಾ ಅಥವಾ ನಿಮ್ಮ ಸ್ವಂತ ವ್ಯವಹಾರವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೀರಾ?"
    )

    fun getPrompt(index: Int, lang: String): String {
        val list = when (lang) {
            "kn" -> questionsKn
            "hi" -> questionsHi
            else -> questionsEn
        }
        return list.getOrElse(index) { questionsEn[0] }
    }

    fun getSummaryAck(lang: String): String {
        return when (lang) {
            "kn" -> "ಧನ್ಯವಾದಗಳು {Name}. ಪಿಎಂ-ಅಜಯ್ ಕೌಶಲ್ಯ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ."
            "hi" -> "धन्यवाद {Name}। हमने पीएम-अजय कौशल विकास अनुशंसाओं के लिए आपकी प्रोफ़ाइल दर्ज कर ली है।"
            else -> "Thank you {Name}. We have registered your profile for PM-AJAY skilling recommendations."
        }
    }
}
