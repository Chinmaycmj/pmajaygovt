package gov.pmajay.voiceassistant.ui

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
