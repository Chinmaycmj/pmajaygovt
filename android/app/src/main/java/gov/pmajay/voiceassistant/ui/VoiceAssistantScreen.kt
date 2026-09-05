package gov.pmajay.voiceassistant.ui

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
                    text = "Select your language\nअपनी भाषा चुनें\nನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
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
            text = "Question ${uiState.currentQuestionIndex + 1} of 9",
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
                tint = Color.White,
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
                ProfileRow("Mobility Radius", "${profile.mobilityRadiusKm} km")
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
