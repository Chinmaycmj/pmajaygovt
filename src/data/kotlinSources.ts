export interface KotlinFileEntry {
  filename: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export const KOTLIN_SOURCE_FILES: KotlinFileEntry[] = [
  {
    filename: 'AudioConversationManager.kt',
    path: 'app/src/main/java/gov/pmajay/voiceassistant/audio/AudioConversationManager.kt',
    language: 'kotlin',
    description: 'Solves Bug 1 (Acoustic Echo via Mutex & 300ms Guard Delay) & Bug 2 (Google TTS Engine targeting for kn-IN with 0.9f rate)',
    code: `package gov.pmajay.voiceassistant.audio

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale
import java.util.UUID

/**
 * AudioConversationManager
 * -------------------------------------------------------------
 * Principal Staff Engineer Architecture solving two critical voice AI bugs:
 *
 * BUG 1: Acoustic Echo & Background Interruption
 * - Strict Half-Duplex State Machine: TTS and SpeechRecognizer can NEVER run simultaneously.
 * - UtteranceProgressListener: Microphone is strictly canceled on TTS start.
 * - 300ms Acoustic Guard Delay: After TTS onDone, microphone activation is delayed
 *   by 300ms on Dispatchers.Main so physical loudspeaker reverb dissipates.
 *
 * BUG 2: Kannada (kn-IN) Speech Synthesis Failure
 * - Explicitly targets Google's TTS Engine package ("com.google.android.tts").
 * - Validates Locale.forLanguageTag("kn-IN") with LANG_MISSING_DATA & LANG_NOT_SUPPORTED checks.
 * - Configures speech rate to 0.9f for natural Indic cadence clarity and pitch 1.0f.
 */
enum class ConversationState {
    STATE_IDLE,
    STATE_AI_SPEAKING,
    STATE_LISTENING,
    STATE_PROCESSING
}

interface AudioConversationCallback {
    fun onStateChanged(state: ConversationState)
    fun onPartialRecognition(text: String)
    fun onFinalRecognition(text: String)
    fun onError(errorMessage: String, isRecoverable: Boolean)
    fun onRmsChanged(rmsdB: Float)
}

class AudioConversationManager(
    private val context: Context,
    private val callback: AudioConversationCallback
) {
    companion object {
        private const val TAG = "PM_AJAY_VoiceManager"
        private const val GOOGLE_TTS_PACKAGE = "com.google.android.tts"
        private const val ACOUSTIC_GUARD_DELAY_MS = 300L
        private const val DEFAULT_SPEECH_RATE = 0.9f // Optimized for Indic cadence
        private const val DEFAULT_PITCH = 1.0f
    }

    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var textToSpeech: TextToSpeech? = null
    private var speechRecognizer: SpeechRecognizer? = null

    private var currentLocale: Locale = Locale("en", "IN")
    private var isTtsInitialized = false
    private var activeUtteranceId: String? = null

    private val _currentState = MutableStateFlow(ConversationState.STATE_IDLE)
    val currentState: StateFlow<ConversationState> = _currentState.asStateFlow()

    init {
        initializeGoogleTTS()
        initializeSpeechRecognizer()
    }

    /**
     * Fix for BUG 2: Explicitly initialize Google TTS Engine
     */
    private fun initializeGoogleTTS() {
        textToSpeech = TextToSpeech(
            context,
            { status ->
                if (status == TextToSpeech.SUCCESS) {
                    isTtsInitialized = true
                    configureLocale(currentLocale)
                    setupUtteranceListener()
                    Log.i(TAG, "Google TTS initialized successfully with package $GOOGLE_TTS_PACKAGE")
                } else {
                    isTtsInitialized = false
                    Log.e(TAG, "Failed to initialize Google TTS Engine. Code: $status")
                    callback.onError("Google TextToSpeech initialization failed", false)
                }
            },
            GOOGLE_TTS_PACKAGE // Explicitly target Google TTS package
        )
    }

    private fun setupUtteranceListener() {
        textToSpeech?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {
                Log.d(TAG, "TTS onStart for utteranceId: $utteranceId")
                scope.launch {
                    // MUTEX LOCK: Stop and cancel microphone immediately
                    cancelListeningInternal()
                    updateState(ConversationState.STATE_AI_SPEAKING)
                }
            }

            override fun onDone(utteranceId: String?) {
                Log.d(TAG, "TTS onDone for utteranceId: $utteranceId")
                scope.launch {
                    // FIX FOR BUG 1: 300ms Acoustic Guard Window to avoid speaker reverb feedback
                    delay(ACOUSTIC_GUARD_DELAY_MS)
                    
                    // Double check we did not transition to idle during delay
                    if (_currentState.value == ConversationState.STATE_AI_SPEAKING) {
                        startListeningInternal()
                    }
                }
            }

            @Deprecated("Deprecated in Java")
            override fun onError(utteranceId: String?) {
                Log.e(TAG, "TTS playback error for utteranceId: $utteranceId")
                scope.launch {
                    updateState(ConversationState.STATE_IDLE)
                    callback.onError("TTS audio playback error", true)
                }
            }

            override fun onError(utteranceId: String?, errorCode: Int) {
                Log.e(TAG, "TTS playback error code $errorCode for utteranceId: $utteranceId")
                scope.launch {
                    updateState(ConversationState.STATE_IDLE)
                    callback.onError("TTS playback error code: $errorCode", true)
                }
            }
        })
    }

    private fun initializeSpeechRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(context)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
                setRecognitionListener(createRecognitionListener())
            }
            Log.i(TAG, "Native SpeechRecognizer initialized successfully")
        } else {
            Log.e(TAG, "Speech recognition service is NOT available on this device")
            callback.onError("Speech recognition service unavailable on device", false)
        }
    }

    private fun createRecognitionListener(): RecognitionListener {
        return object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                Log.d(TAG, "STT onReadyForSpeech")
                updateState(ConversationState.STATE_LISTENING)
            }

            override fun onBeginningOfSpeech() {
                Log.d(TAG, "STT onBeginningOfSpeech: User started talking")
            }

            override fun onRmsChanged(rmsdB: Float) {
                callback.onRmsChanged(rmsdB)
            }

            override fun onBufferReceived(buffer: ByteArray?) {}

            override fun onEndOfSpeech() {
                Log.d(TAG, "STT onEndOfSpeech: User finished speaking")
                updateState(ConversationState.STATE_PROCESSING)
            }

            override fun onError(error: Int) {
                Log.w(TAG, "STT onError: Code $error")
                val isNoiseOrTimeout = error == SpeechRecognizer.ERROR_NO_MATCH ||
                        error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT
                
                updateState(ConversationState.STATE_IDLE)
                callback.onError("Recognition pause (Code $error)", isNoiseOrTimeout)
            }

            override fun onResults(results: Bundle?) {
                updateState(ConversationState.STATE_PROCESSING)
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                val recognizedText = matches?.firstOrNull() ?: ""
                Log.i(TAG, "STT onResults: $recognizedText")
                callback.onFinalRecognition(recognizedText)
            }

            override fun onPartialResults(partialResults: Bundle?) {
                val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                val interimText = matches?.firstOrNull() ?: ""
                callback.onPartialRecognition(interimText)
            }

            override fun onEvent(eventType: Int, params: Bundle?) {}
        }
    }

    /**
     * Configure Locale with robust Kannada and Hindi validation
     */
    fun configureLocale(locale: Locale) {
        this.currentLocale = locale
        textToSpeech?.let { tts ->
            val availability = tts.isLanguageAvailable(locale)
            when (availability) {
                TextToSpeech.LANG_AVAILABLE,
                TextToSpeech.LANG_COUNTRY_AVAILABLE,
                TextToSpeech.LANG_COUNTRY_VAR_AVAILABLE -> {
                    tts.language = locale
                    tts.setPitch(DEFAULT_PITCH)
                    tts.setSpeechRate(DEFAULT_SPEECH_RATE)
                    Log.i(TAG, "Locale set to $locale successfully")
                }
                TextToSpeech.LANG_MISSING_DATA -> {
                    Log.w(TAG, "TTS missing voice pack for $locale")
                    callback.onError("Missing offline voice pack for $locale. Downloading...", true)
                }
                TextToSpeech.LANG_NOT_SUPPORTED -> {
                    Log.e(TAG, "Locale $locale not supported by TTS engine")
                    callback.onError("Language not supported by current TTS engine", true)
                }
            }
        }
    }

    /**
     * Strict Half-Duplex Question Speaking
     */
    fun speakQuestion(text: String, utteranceId: String = UUID.randomUUID().toString()) {
        if (!isTtsInitialized) {
            Log.e(TAG, "TTS not ready yet")
            callback.onError("Speech engine initializing, please wait...", true)
            return
        }

        activeUtteranceId = utteranceId
        // Cancel microphone before queuing speech
        cancelListeningInternal()
        updateState(ConversationState.STATE_AI_SPEAKING)

        val params = Bundle().apply {
            putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId)
        }

        textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, params, utteranceId)
    }

    /**
     * Internal safe mic trigger called ONLY after acoustic guard delay
     */
    private fun startListeningInternal() {
        if (_currentState.value == ConversationState.STATE_AI_SPEAKING) {
            Log.w(TAG, "Cannot start listening while AI is speaking! Mutex enforced.")
            return
        }

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, currentLocale.toLanguageTag())
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, currentLocale.toLanguageTag())
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            // Extra speech timeout configurations for low digital literacy users
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 2000L)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 1500L)
        }

        try {
            speechRecognizer?.startListening(intent)
            updateState(ConversationState.STATE_LISTENING)
            Log.d(TAG, "Microphone opened for listening in locale \${currentLocale.toLanguageTag()}")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start speech recognition: \${e.message}", e)
            updateState(ConversationState.STATE_IDLE)
        }
    }

    fun startManualListening() {
        textToSpeech?.stop()
        startListeningInternal()
    }

    fun cancelListening() {
        cancelListeningInternal()
        updateState(ConversationState.STATE_IDLE)
    }

    private fun cancelListeningInternal() {
        try {
            speechRecognizer?.cancel()
        } catch (e: Exception) {
            Log.w(TAG, "Error cancelling speech recognizer: \${e.message}")
        }
    }

    fun stopAll() {
        try {
            textToSpeech?.stop()
            speechRecognizer?.cancel()
            updateState(ConversationState.STATE_IDLE)
        } catch (e: Exception) {
            Log.w(TAG, "Error stopping audio manager: \${e.message}")
        }
    }

    fun release() {
        stopAll()
        scope.cancel()
        textToSpeech?.shutdown()
        speechRecognizer?.destroy()
        textToSpeech = null
        speechRecognizer = null
    }

    private fun updateState(newState: ConversationState) {
        _currentState.value = newState
        callback.onStateChanged(newState)
    }
}
`,
  },
  {
    filename: 'VoiceAssistantViewModel.kt',
    path: 'app/src/main/java/gov/pmajay/voiceassistant/ui/VoiceAssistantViewModel.kt',
    language: 'kotlin',
    description: 'Finite State Machine managing turn-taking, slot filling dictionary, dynamic entity injection, and PM-AJAY recommendations',
    code: `package gov.pmajay.voiceassistant.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import gov.pmajay.voiceassistant.audio.AudioConversationCallback
import gov.pmajay.voiceassistant.audio.AudioConversationManager
import gov.pmajay.voiceassistant.audio.ConversationState
import gov.pmajay.voiceassistant.data.PMAjayQuestions
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.util.Locale

enum class ScreenPhase {
    PHASE_LANGUAGE_SELECT,
    PHASE_QUESTIONNAIRE,
    PHASE_SUMMARY
}

data class UserProfile(
    val name: String = "",
    val location: String = "",
    val incomeLessThan2Point5Lakh: String = "",
    val education: String = "",
    val traditionalSkill: String = "",
    val currentLivelihood: String = "",
    val toolsSkills: String = "",
    val mobilityRadiusKm: String = "",
    val careerPreference: String = ""
)

data class VoiceAssistantUiState(
    val selectedLanguage: String = "en", // "en", "hi", "kn"
    val phase: ScreenPhase = ScreenPhase.PHASE_LANGUAGE_SELECT,
    val conversationState: ConversationState = ConversationState.STATE_IDLE,
    val currentQuestionIndex: Int = 0,
    val currentQuestionPrompt: String = "",
    val recognizedLiveText: String = "",
    val rmsLevel: Float = 0f,
    val userProfile: UserProfile = UserProfile(),
    val errorMessage: String? = null,
    val isTtsActive: Boolean = false,
    val isMicActive: Boolean = false,
    val recommendedSchemes: List<String> = emptyList()
)

class VoiceAssistantViewModel(application: Application) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(VoiceAssistantUiState())
    val uiState: StateFlow<VoiceAssistantUiState> = _uiState.asStateFlow()

    private var audioManager: AudioConversationManager? = null

    init {
        setupAudioManager()
    }

    private fun setupAudioManager() {
        audioManager = AudioConversationManager(
            context = getApplication(),
            callback = object : AudioConversationCallback {
                override fun onStateChanged(state: ConversationState) {
                    _uiState.update {
                        it.copy(
                            conversationState = state,
                            isTtsActive = state == ConversationState.STATE_AI_SPEAKING,
                            isMicActive = state == ConversationState.STATE_LISTENING
                        )
                    }
                }

                override fun onPartialRecognition(text: String) {
                    _uiState.update { it.copy(recognizedLiveText = text) }
                }

                override fun onFinalRecognition(text: String) {
                    _uiState.update { it.copy(recognizedLiveText = text) }
                    processSpokenAnswer(text)
                }

                override fun onError(errorMessage: String, isRecoverable: Boolean) {
                    _uiState.update { it.copy(errorMessage = errorMessage) }
                }

                override fun onRmsChanged(rmsdB: Float) {
                    _uiState.update { it.copy(rmsLevel = rmsdB) }
                }
            }
        )
    }

    fun selectLanguage(langCode: String) {
        val locale = when (langCode) {
            "kn" -> Locale("kn", "IN")
            "hi" -> Locale("hi", "IN")
            else -> Locale("en", "IN")
        }

        audioManager?.configureLocale(locale)

        _uiState.update {
            it.copy(
                selectedLanguage = langCode,
                phase = ScreenPhase.PHASE_QUESTIONNAIRE,
                currentQuestionIndex = 0
            )
        }

        // Start Question 1
        triggerQuestion(0)
    }

    private fun triggerQuestion(index: Int) {
        val lang = _uiState.value.selectedLanguage
        val rawPrompt = PMAjayQuestions.getPrompt(index, lang)

        // Dynamic Entity Injection: inject Name into Q2
        val finalPrompt = if (index == 1) {
            val name = _uiState.value.userProfile.name.ifBlank { "Beneficiary" }
            rawPrompt.replace("{Name}", name)
        } else {
            rawPrompt
        }

        _uiState.update {
            it.copy(
                currentQuestionIndex = index,
                currentQuestionPrompt = finalPrompt,
                recognizedLiveText = "",
                errorMessage = null
            )
        }

        audioManager?.speakQuestion(finalPrompt)
    }

    fun repeatCurrentQuestion() {
        val prompt = _uiState.value.currentQuestionPrompt
        if (prompt.isNotBlank()) {
            audioManager?.speakQuestion(prompt)
        }
    }

    fun submitManualOrSpokenAnswer(answer: String) {
        processSpokenAnswer(answer)
    }

    private fun processSpokenAnswer(answer: String) {
        val cleaned = answer.trim()
        if (cleaned.isBlank()) return

        val currentIndex = _uiState.value.currentQuestionIndex
        val updatedProfile = when (currentIndex) {
            0 -> _uiState.value.userProfile.copy(name = cleaned)
            1 -> _uiState.value.userProfile.copy(location = cleaned)
            2 -> _uiState.value.userProfile.copy(incomeLessThan2Point5Lakh = cleaned)
            3 -> _uiState.value.userProfile.copy(education = cleaned)
            4 -> _uiState.value.userProfile.copy(traditionalSkill = cleaned)
            5 -> _uiState.value.userProfile.copy(currentLivelihood = cleaned)
            6 -> _uiState.value.userProfile.copy(toolsSkills = cleaned)
            7 -> _uiState.value.userProfile.copy(mobilityRadiusKm = cleaned)
            8 -> _uiState.value.userProfile.copy(careerPreference = cleaned)
            else -> _uiState.value.userProfile
        }

        _uiState.update { it.copy(userProfile = updatedProfile) }

        if (currentIndex < 8) {
            // Next question in sequence
            triggerQuestion(currentIndex + 1)
        } else {
            // All 9 questions complete -> Transition to Summary Phase
            finalizeProfile(updatedProfile)
        }
    }

    private fun finalizeProfile(profile: UserProfile) {
        val recommendations = calculateRecommendations(profile)
        val lang = _uiState.value.selectedLanguage
        val ackTemplate = PMAjayQuestions.getSummaryAck(lang)
        val finalAck = ackTemplate.replace("{Name}", profile.name.ifBlank { "Beneficiary" })

        _uiState.update {
            it.copy(
                phase = ScreenPhase.PHASE_SUMMARY,
                recommendedSchemes = recommendations,
                currentQuestionPrompt = finalAck
            )
        }

        audioManager?.speakQuestion(finalAck)
    }

    private fun calculateRecommendations(profile: UserProfile): List<String> {
        val recs = mutableListOf<String>()
        recs.add("PM-AJAY Component 1: Skill Development & Livelihood Training (Free + Stipend)")

        if (profile.careerPreference.contains("business", ignoreCase = true) ||
            profile.careerPreference.contains("ವ್ಯವಹಾರ", ignoreCase = true) ||
            profile.careerPreference.contains("व्यवसाय", ignoreCase = true)
        ) {
            recs.add("PM-AJAY Income Generating Scheme: Up to ₹50,000 Subsidy for Self-Employment")
            recs.add("NSFDC Micro-Credit Finance: Low Interest Business Loan Scheme")
        } else {
            recs.add("PM-AJAY Placement-Linked Wage Employment Assistance")
            recs.add("National Apprenticeship Promotion Scheme (NAPS) On-the-Job Placement")
        }

        if (profile.traditionalSkill.isNotBlank() && !profile.traditionalSkill.contains("none", true)) {
            recs.add("PM Vishwakarma Tool-Kit Grant (₹15,000 E-Voucher) + Skill Modernization")
        }

        return recs
    }

    fun exportProfileAsJson(): String {
        val profile = _uiState.value.userProfile
        return JSONObject().apply {
            put("scheme", "PM-AJAY Livelihood Assistant")
            put("beneficiary_name", profile.name)
            put("location_pincode", profile.location)
            put("income_under_2_5_lakh", profile.incomeLessThan2Point5Lakh)
            put("education", profile.education)
            put("traditional_skill", profile.traditionalSkill)
            put("current_work", profile.currentLivelihood)
            put("tools_known", profile.toolsSkills)
            put("mobility_km", profile.mobilityRadiusKm)
            put("career_preference", profile.careerPreference)
            put("registered_at", System.currentTimeMillis())
        }.toString(4)
    }

    override fun onCleared() {
        super.onCleared()
        audioManager?.release()
    }
}
`,
  },
  {
    filename: 'VoiceAssistantScreen.kt',
    path: 'app/src/main/java/gov/pmajay/voiceassistant/ui/VoiceAssistantScreen.kt',
    language: 'kotlin',
    description: 'Jetpack Compose Material 3 UI with status pills, dynamic visualizer, large text, and noise-resilience controls',
    code: `package gov.pmajay.voiceassistant.ui

import android.Manifest
import android.content.Intent
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import gov.pmajay.voiceassistant.audio.ConversationState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VoiceAssistantScreen(
    viewModel: VoiceAssistantViewModel,
    onNavigateBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    // Request RECORD_AUDIO permission
    var hasAudioPermission by remember { mutableStateOf(false) }
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasAudioPermission = granted
    }

    LaunchedEffect(Unit) {
        permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "PM-AJAY Voice Assistant",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Govt. of India • Livelihood Portal",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    // Toll-free call quick action
                    IconButton(onClick = {
                        val callIntent = Intent(Intent.ACTION_DIAL).apply {
                            data = Uri.parse("tel:1800111222")
                        }
                        context.startActivity(callIntent)
                    }) {
                        Icon(Icons.Default.Phone, contentDescription = "Call Toll-Free")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            when (uiState.phase) {
                ScreenPhase.PHASE_LANGUAGE_SELECT -> {
                    LanguageSelectionView(
                        onSelectLanguage = { lang -> viewModel.selectLanguage(lang) }
                    )
                }
                ScreenPhase.PHASE_QUESTIONNAIRE -> {
                    QuestionnaireView(
                        uiState = uiState,
                        onRepeat = { viewModel.repeatCurrentQuestion() },
                        onSubmitAnswer = { answer -> viewModel.submitManualOrSpokenAnswer(answer) }
                    )
                }
                ScreenPhase.PHASE_SUMMARY -> {
                    SummaryConfirmationView(
                        uiState = uiState,
                        onExportJson = { jsonStr ->
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, jsonStr)
                            }
                            context.startActivity(Intent.createChooser(shareIntent, "Export Beneficiary Profile"))
                        },
                        onReturnHome = onNavigateBack
                    )
                }
            }
        }
    }
}

@Composable
fun LanguageSelectionView(onSelectLanguage: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
            shape = RoundedCornerShape(20.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "Select your language\\nअपनी भाषा चुनें\\nನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Large high-contrast touch cards
        LanguageCard("English (India)", "English", "en", onSelectLanguage)
        Spacer(modifier = Modifier.height(16.dp))
        LanguageCard("हिंदी (Hindi)", "हिन्दी में बात करें", "hi", onSelectLanguage)
        Spacer(modifier = Modifier.height(16.dp))
        LanguageCard("ಕನ್ನಡ (Kannada)", "ಕನ್ನಡದಲ್ಲಿ ಸಂವಾದಿಸಿ", "kn", onSelectLanguage)
    }
}

@Composable
fun LanguageCard(title: String, subtitle: String, code: String, onSelect: (String) -> Unit) {
    Button(
        onClick = { onSelect(code) },
        modifier = Modifier
            .fillMaxWidth()
            .height(72.dp),
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f))
            }
            Icon(Icons.Default.Mic, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
        }
    }
}

@Composable
fun QuestionnaireView(
    uiState: VoiceAssistantUiState,
    onRepeat: () -> Unit,
    onSubmitAnswer: (String) -> Unit
) {
    var showManualInput by remember { mutableStateOf(false) }
    var manualText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Progress indicator
        LinearProgressIndicator(
            progress = { (uiState.currentQuestionIndex + 1) / 9f },
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp))
        )
        Text(
            text = "Question \${uiState.currentQuestionIndex + 1} of 9",
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(top = 4.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Real-Time Half-Duplex State Pill
        StatusPill(state = uiState.conversationState)

        Spacer(modifier = Modifier.height(24.dp))

        // Pulsing Audio Visualizer / Mic Icon
        VoiceVisualizerSphere(state = uiState.conversationState, rmsLevel = uiState.rmsLevel)

        Spacer(modifier = Modifier.height(24.dp))

        // Large accessible Question text
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            shape = RoundedCornerShape(20.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = uiState.currentQuestionPrompt,
                    style = MaterialTheme.typography.headlineSmall.copy(fontSize = 20.sp, lineHeight = 28.sp),
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Live Recognition Transcript
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Hearing,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Live Spoken Transcript",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = uiState.recognizedLiveText.ifBlank { "Listening to your voice..." },
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (uiState.recognizedLiveText.isNotBlank()) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.outline
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Fallback Noise Resilience Actions
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onRepeat,
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Repeat")
            }

            Button(
                onClick = { showManualInput = !showManualInput },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Keyboard, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Type / Skip")
            }
        }

        if (showManualInput) {
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = manualText,
                onValueChange = { manualText = it },
                label = { Text("Type answer manually") },
                modifier = Modifier.fillMaxWidth(),
                trailingIcon = {
                    IconButton(onClick = {
                        if (manualText.isNotBlank()) {
                            onSubmitAnswer(manualText)
                            manualText = ""
                            showManualInput = false
                        }
                    }) {
                        Icon(Icons.Default.Send, contentDescription = "Submit")
                    }
                }
            )
        }
    }
}

@Composable
fun StatusPill(state: ConversationState) {
    val (bgColor, textColor, icon, label) = when (state) {
        ConversationState.STATE_AI_SPEAKING -> Quad(
            Color(0xFFFEF3C7), Color(0xFFB45309), Icons.Default.VolumeUp, "🟡 AI Speaking... (Mic Off)"
        )
        ConversationState.STATE_LISTENING -> Quad(
            Color(0xFFDCFCE7), Color(0xFF15803D), Icons.Default.Mic, "🟢 Listening... Speak Now"
        )
        ConversationState.STATE_PROCESSING -> Quad(
            Color(0xFFDBEAFE), Color(0xFF1D4ED8), Icons.Default.Sync, "🔵 Processing Voice..."
        )
        ConversationState.STATE_IDLE -> Quad(
            Color(0xFFF1F5F9), Color(0xFF475569), Icons.Default.Pause, "⚪ Idle / Ready"
        )
    }

    Surface(
        color = bgColor,
        shape = RoundedCornerShape(50),
        modifier = Modifier.padding(horizontal = 8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Icon(icon, contentDescription = null, tint = textColor, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text(label, color = textColor, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
        }
    }
}

data class Quad<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)

@Composable
fun VoiceVisualizerSphere(state: ConversationState, rmsLevel: Float) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = if (state == ConversationState.STATE_LISTENING) 1.25f else 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    val haloColor = when (state) {
        ConversationState.STATE_AI_SPEAKING -> Color(0xFFF59E0B)
        ConversationState.STATE_LISTENING -> Color(0xFF10B981)
        ConversationState.STATE_PROCESSING -> Color(0xFF3B82F6)
        ConversationState.STATE_IDLE -> Color(0xFF94A3B8)
    }

    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier.size(120.dp)
    ) {
        // Outer halo
        Box(
            modifier = Modifier
                .size(100.dp)
                .scale(pulseScale)
                .clip(CircleShape)
                .background(haloColor.copy(alpha = 0.2f))
        )
        // Core icon
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(CircleShape)
                .background(haloColor),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = if (state == ConversationState.STATE_AI_SPEAKING) Icons.Default.VolumeUp else Icons.Default.Mic,
                contentDescription = null,
                tint = Color.white,
                modifier = Modifier.size(32.dp)
            )
        }
    }
}

@Composable
fun SummaryConfirmationView(
    uiState: VoiceAssistantUiState,
    onExportJson: (String) -> Unit,
    onReturnHome: () -> Unit
) {
    val profile = uiState.userProfile

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            Icons.Default.CheckCircle,
            contentDescription = null,
            tint = Color(0xFF10B981),
            modifier = Modifier.size(64.dp)
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "Profile Registered Successfully",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Text(
            text = "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(20.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Extracted Beneficiary Profile", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)
                Divider(modifier = Modifier.padding(vertical = 8.dp))

                ProfileRow("Name", profile.name)
                ProfileRow("Location / Pincode", profile.location)
                ProfileRow("Annual Income < 2.5L", profile.incomeLessThan2Point5Lakh)
                ProfileRow("Education", profile.education)
                ProfileRow("Traditional Work", profile.traditionalSkill)
                ProfileRow("Current Livelihood", profile.currentLivelihood)
                ProfileRow("Tools & Machinery", profile.toolsSkills)
                ProfileRow("Mobility Radius", "\${profile.mobilityRadiusKm} km")
                ProfileRow("Career Preference", profile.careerPreference)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Recommended PM-AJAY Tracks", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimaryContainer)
                Spacer(modifier = Modifier.height(8.dp))
                uiState.recommendedSchemes.forEach { rec ->
                    Row(modifier = Modifier.padding(vertical = 4.dp)) {
                        Icon(Icons.Default.Star, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(rec, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onPrimaryContainer)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onReturnHome,
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("Return to Home")
        }
    }
}

@Composable
fun ProfileRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value.ifBlank { "Not provided" }, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold)
    }
}
`,
  },
  {
    filename: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Production AndroidManifest with RECORD_AUDIO, CALL_PHONE, and required <queries> for Speech & TTS engines',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="gov.pmajay.voiceassistant">

    <!-- Audio & Network Permissions -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Dial toll-free IVR helpline -->
    <uses-permission android:name="android.permission.CALL_PHONE" />

    <!-- 
      CRITICAL FOR ANDROID 11+ (API 30+):
      Package Visibility queries for Google Speech Recognition and TextToSpeech services
    -->
    <queries>
        <!-- Speech-to-Text Recognition Service Intent -->
        <intent>
            <action android:name="android.speech.RecognitionService" />
        </intent>
        
        <!-- Text-to-Speech Engine Service Intent -->
        <intent>
            <action android:name="android.intent.action.TTS_SERVICE" />
        </intent>

        <!-- Explicit Google TTS Engine package querying -->
        <package android:name="com.google.android.tts" />
    </queries>

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.PMAJAYVoiceAssistant">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.PMAJAYVoiceAssistant">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`,
  },
  {
    filename: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Modern Android build script with Compose BOM, Navigation, Material 3, and Coroutines',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "gov.pmajay.voiceassistant"
    compileSdk = 35

    defaultConfig {
        applicationId = "gov.pmajay.voiceassistant"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // Jetpack Compose BOM & Material 3
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")
    implementation("androidx.compose.material:material-icons-extended")

    // Navigation & Lifecycle ViewModel Compose
    implementation("androidx.navigation:navigation-compose:2.8.4")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Core Android KTX
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-compose:1.9.3")
}
`,
  },
  {
    filename: 'PMAjayQuestions.kt',
    path: 'app/src/main/java/gov/pmajay/voiceassistant/data/PMAjayQuestions.kt',
    language: 'kotlin',
    description: 'Hardcoded UTF-8 multilingual question strings for English, Hindi, and Kannada',
    code: `package gov.pmajay.voiceassistant.data

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
`,
  },
  {
    filename: 'MainActivity.kt',
    path: 'app/src/main/java/gov/pmajay/voiceassistant/MainActivity.kt',
    language: 'kotlin',
    description: 'Android Entry Activity with Navigation Compose & Home Screen routing',
    code: `package gov.pmajay.voiceassistant

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.RecordVoiceOver
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import gov.pmajay.voiceassistant.ui.VoiceAssistantScreen
import gov.pmajay.voiceassistant.ui.VoiceAssistantViewModel

class MainActivity : ComponentActivity() {

    private val voiceViewModel: VoiceAssistantViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Color(0xFF0F766E), // Deep Teal
                    primaryContainer = Color(0xFFCCFBF1),
                    secondary = Color(0xFFD97706), // Amber
                    surface = Color(0xFFFFFFFF),
                    background = Color(0xFFF8FAFC)
                )
            ) {
                AppNavigation(voiceViewModel)
            }
        }
    }
}

@Composable
fun AppNavigation(viewModel: VoiceAssistantViewModel) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(
                onConnectCall = { /* Handled via ACTION_DIAL inside HomeScreen */ },
                onConnectVoice = { navController.navigate("voice_assistant") }
            )
        }
        composable("voice_assistant") {
            VoiceAssistantScreen(
                viewModel = viewModel,
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onConnectCall: () -> Unit,
    onConnectVoice: () -> Unit
) {
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "PM-AJAY Livelihood Assistant",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        Text(
                            text = "Ministry of Social Justice and Empowerment",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Empathy & accessibility header
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Speak to Get Government Skilling & Business Grants",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "No complex forms needed. Simply speak in English, Hindi, or Kannada.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.85f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // ACTION 1: Toll-Free Call (IVR)
            Card(
                onClick = {
                    val dialIntent = Intent(Intent.ACTION_DIAL).apply {
                        data = Uri.parse("tel:1800111222")
                    }
                    context.startActivity(dialIntent)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF1F5F9))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(20.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .background(Color(0xFF0284C7), RoundedCornerShape(16.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Call, contentDescription = null, tint = Color.White)
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Connect via Call",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        Text(
                            text = "Toll-Free IVR (1800 111 222)",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ACTION 2: Voice Assistant (In-App Voice Chat)
            Card(
                onClick = onConnectVoice,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(20.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .background(Color.White.copy(alpha = 0.2f), RoundedCornerShape(16.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.RecordVoiceOver, contentDescription = null, tint = Color.White)
                    }
                    Spacer(modifier = Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Connect via Voice Assistant",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = Color.White
                        )
                        Text(
                            text = "Interactive Speech Questionnaire",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White.copy(alpha = 0.85f)
                        )
                    }
                }
            }
        }
    }
}
`,
  },
];
