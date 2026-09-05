# PM-AJAY AI Assistant - Native Android APK Generation Guide

This guide documents how to generate the standalone **Signed Release APK (`app-release.apk`)** using Gradle in the `android/` directory for production distribution, confirming that all web-based download UI elements have been completely removed from the frontend application.

---

## 📱 Deliverables

- **Signed Release APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🚀 How to Run `./gradlew assembleRelease` in the `android` Folder

### Prerequisites
- **JDK 17 or higher** installed and set in `JAVA_HOME`.
- **Android SDK** (API Level 35, Build-Tools 35.0.0).

### Step 1: Open Terminal and Navigate to the `android/` Directory
```bash
cd android
```

### Step 2 (Optional): Generate a Production Signing Keystore
If you do not already have a release keystore, generate one using `keytool` (included with JDK):
```bash
keytool -genkey -v -keystore release.keystore -alias pmajay_key -keyalg RSA -keysize 2048 -validity 10000
```
Set your environment variables (or leave defaults configured in `app/build.gradle.kts`):
```bash
export RELEASE_KEYSTORE_PATH="release.keystore"
export KEYSTORE_PASSWORD="your_secure_password"
export KEY_ALIAS="pmajay_key"
export KEY_PASSWORD="your_secure_password"
```
> *Note: If no custom keystore is provided, the build script safely falls back to standard debug signing so `./gradlew assembleRelease` executes cleanly without breaking.*

### Step 3: Run the Release Build Command
```bash
./gradlew assembleRelease
```
*(On Windows Command Prompt or PowerShell, use `gradlew.bat assembleRelease`)*

### Step 4: Locate the Output Signed APK
Once compilation completes (`BUILD SUCCESSFUL`), the signed APK is generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🛡️ Confirmation of UI Cleanliness

All web-based download elements have been removed from the final build:
1. **No "Download APK" or "Install APK" buttons**: There are zero web-style download buttons, floating action icons, or install prompts in the user interface.
2. **No Web-like Installation Modals**: The previous `ApkExportModal` component and all corresponding state triggers have been deleted from the application codebase.
3. **Pure Native Interface**: The application behaves strictly as a native Android voice client with Voice Call, Voice Assistant, and Smart Chat modes.

---

## 📲 How to Distribute & Install the Release APK

1. Transfer `app-release.apk` to Android devices via USB, Google Drive, or internal MDM distribution.
2. On the Android device, tap `app-release.apk`.
3. If prompted with *"Install unknown apps"*, allow installation for your file manager or browser.
4. Tap **Install**.
5. Launch **वाणी सहायक • PM-AJAY** directly from the Android app drawer.
