# 📱 StudyBuddy Android APK Build Guide

Complete guide to build a production-ready Android APK that will pass Google Play Store security checks.

## 📁 Complete Android Project Structure

```
StudyBuddyApp/
├── 📄 build.gradle (Project)           # Project-level build configuration
├── 📄 settings.gradle                  # Project settings
├── 📄 gradle.properties               # Gradle properties
├── 📄 local.properties                # Local SDK paths (auto-generated)
├── 🗂️ app/                            # Main application module
│   ├── 📄 build.gradle                # App-level build configuration
│   ├── 📄 proguard-rules.pro         # Code obfuscation rules
│   └── 🗂️ src/
│       ├── 🗂️ main/
│       │   ├── 📄 AndroidManifest.xml # App permissions and components
│       │   ├── 🗂️ java/com/studybuddy/aitutor/
│       │   │   ├── 📄 StudyBuddyApplication.java    # Application class
│       │   │   ├── 📄 SplashActivity.java           # Splash screen
│       │   │   ├── 📄 MainActivity.java             # Main WebView activity
│       │   │   ├── 📄 WebAppInterface.java          # JavaScript bridge
│       │   │   └── 📄 StudyBuddyService.java        # Background service
│       │   ├── 🗂️ res/                              # Resources directory
│       │   │   ├── 🗂️ layout/                       # UI layouts
│       │   │   │   ├── activity_splash.xml
│       │   │   │   └── activity_main.xml
│       │   │   ├── 🗂️ values/                       # App values
│       │   │   │   ├── strings.xml                  # Text strings
│       │   │   │   ├── colors.xml                   # Color definitions
│       │   │   │   ├── styles.xml                   # UI styles
│       │   │   │   └── themes.xml                   # App themes
│       │   │   ├── 🗂️ drawable/                     # Images and icons
│       │   │   │   ├── studybuddy_logo.png         # App logo (REPLACE THIS)
│       │   │   │   ├── splash_background.xml        # Splash background
│       │   │   │   ├── button_primary.xml           # Button styles
│       │   │   │   └── no_internet_icon.png         # Offline icon
│       │   │   ├── 🗂️ mipmap-*/                     # App icons (all sizes)
│       │   │   │   ├── ic_launcher.png              # App icon (REPLACE THIS)
│       │   │   │   └── ic_launcher_round.png        # Round app icon
│       │   │   ├── 🗂️ anim/                         # Animations
│       │   │   │   ├── fade_in.xml
│       │   │   │   ├── fade_out.xml
│       │   │   │   ├── slide_up.xml
│       │   │   │   └── pulse.xml
│       │   │   ├── 🗂️ xml/                          # XML configurations
│       │   │   │   ├── network_security_config.xml  # Network security
│       │   │   │   ├── backup_rules.xml             # Backup configuration
│       │   │   │   ├── data_extraction_rules.xml    # Data extraction rules
│       │   │   │   └── file_paths.xml               # File provider paths
│       │   │   └── 🗂️ font/                         # Custom fonts
│       │   │       └── fredoka_one.ttf              # App font
│       │   └── 🗂️ assets/                           # Static assets (optional)
│       └── 🗂️ androidTest/                          # Android tests
│           └── 🗂️ java/com/studybuddy/aitutor/
│               └── ExampleInstrumentedTest.java
└── 🗂️ gradle/wrapper/                              # Gradle wrapper
    ├── gradle-wrapper.jar
    └── gradle-wrapper.properties
```

## 🚀 Step-by-Step Build Instructions

### 1. **Prerequisites**

**Install Required Software:**
```bash
# Download and install Android Studio
# https://developer.android.com/studio

# Install Java 8 or 11 (required for Android development)
# Windows: Download from Oracle or use OpenJDK
# macOS: brew install openjdk@11
# Linux: sudo apt install openjdk-11-jdk
```

**System Requirements:**
- **RAM**: 8 GB minimum, 16 GB recommended
- **Storage**: 4 GB for Android Studio + 2 GB for SDK
- **OS**: Windows 10+, macOS 10.14+, or Linux (64-bit)

### 2. **Create New Android Project**

**In Android Studio:**
1. File → New → New Project
2. Choose "Empty Activity"
3. Configure project:
   - **Name**: StudyBuddy
   - **Package name**: `com.studybuddy.aitutor`
   - **Language**: Java
   - **Minimum SDK**: API 24 (Android 7.0)
   - **Target SDK**: API 34 (Android 14)

### 3. **Replace Default Files**

**Copy all the provided files to your project:**
```bash
# Copy Java files
cp android-app/app/src/main/java/com/studybuddy/aitutor/* 
   YourProject/app/src/main/java/com/studybuddy/aitutor/

# Copy layout files
cp android-app/app/src/main/res/layout/*
   YourProject/app/src/main/res/layout/

# Copy AndroidManifest.xml
cp android-app/app/src/main/AndroidManifest.xml
   YourProject/app/src/main/AndroidManifest.xml

# Copy build.gradle
cp android-app/app/build.gradle
   YourProject/app/build.gradle
```

### 4. **Add Required Resource Files**

Create these essential resource files:

#### `app/src/main/res/values/strings.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">StudyBuddy</string>
    <string name="app_tagline">Your AI Study Friend!</string>
    <string name="loading_message">Getting ready to learn…</string>
    <string name="version_info">Version 1.0.0</string>
    <string name="no_internet_title">No Internet Connection</string>
    <string name="no_internet_message">StudyBuddy needs internet to chat with you!\nPlease check your connection and try again.</string>
    <string name="retry_button">🔄 Try Again</string>
</resources>
```

#### `app/src/main/res/values/colors.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary_color">#FF6B6B</color>
    <color name="secondary_color">#4ECDC4</color>
    <color name="accent_color">#45B7D1</color>
    <color name="success_color">#96CEB4</color>
    <color name="warning_color">#FFEAA7</color>
    <color name="background_color">#667eea</color>
    <color name="progress_background">#E0E0E0</color>
    <color name="white">#FFFFFF</color>
    <color name="black">#000000</color>
</resources>
```

#### `app/src/main/res/values/themes.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Base application theme -->
    <style name="Theme.StudyBuddy" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary_color</item>
        <item name="colorPrimaryVariant">@color/secondary_color</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="colorSecondary">@color/accent_color</item>
        <item name="colorSecondaryVariant">@color/success_color</item>
        <item name="colorOnSecondary">@color/black</item>
        <item name="android:statusBarColor">@color/background_color</item>
        <item name="android:navigationBarColor">@color/background_color</item>
    </style>

    <!-- Splash screen theme -->
    <style name="Theme.StudyBuddy.Splash" parent="Theme.SplashScreen">
        <item name="windowSplashScreenBackground">@color/background_color</item>
        <item name="windowSplashScreenAnimatedIcon">@drawable/studybuddy_logo</item>
        <item name="windowSplashScreenAnimationDuration">2000</item>
        <item name="postSplashScreenTheme">@style/Theme.StudyBuddy</item>
    </style>
</resources>
```

### 5. **Add Required Drawable Resources**

#### `app/src/main/res/drawable/splash_background.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <gradient
        android:angle="135"
        android:startColor="#667eea"
        android:endColor="#764ba2"
        android:type="linear" />
</shape>
```

#### `app/src/main/res/drawable/button_primary.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="@color/primary_color" />
    <corners android:radius="25dp" />
    <stroke android:width="0dp" android:color="@android:color/transparent" />
</shape>
```

### 6. **Add Animation Files**

#### `app/src/main/res/anim/fade_in.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<alpha xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="1000"
    android:fromAlpha="0.0"
    android:toAlpha="1.0" />
```

#### `app/src/main/res/anim/slide_up.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<translate xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="800"
    android:fromYDelta="50%p"
    android:toYDelta="0" />
```

#### `app/src/main/res/anim/pulse.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:repeatCount="infinite"
    android:repeatMode="reverse">
    <alpha
        android:duration="1000"
        android:fromAlpha="1.0"
        android:toAlpha="0.5" />
</set>
```

### 7. **Add Security Configuration Files**

#### `app/src/main/res/xml/network_security_config.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">your-domain.com</domain>
    </domain-config>
    
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system"/>
        </trust-anchors>
    </base-config>
</network-security-config>
```

#### `app/src/main/res/xml/backup_rules.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <exclude domain="sharedpref" path="sensitive_prefs.xml"/>
    <exclude domain="database" path="sensitive.db"/>
</full-backup-content>
```

### 8. **Create App Icons**

**Icon Requirements for Google Play:**
- **Adaptive Icon**: 108x108dp (432x432px at xxxhdpi)
- **Legacy Icon**: 48x48dp (192x192px at xxxhdpi)
- **Round Icon**: Same sizes as adaptive

**Icon Sizes Needed:**
```
mipmap-mdpi/     (48x48px)
mipmap-hdpi/     (72x72px)  
mipmap-xhdpi/    (96x96px)
mipmap-xxhdpi/   (144x144px)
mipmap-xxxhdpi/  (192x192px)
```

**🎨 Replace these placeholder images with your custom StudyBuddy logo!**

### 9. **Update Configuration**

#### **Update URL in MainActivity.java:**
```java
// Line 40 in MainActivity.java
private static final String STUDYBUDDY_URL = "https://your-actual-domain.com";

// Line 120 in StudyBuddyWebViewClient
if (url.contains("your-actual-domain.com") || url.contains("localhost")) {
```

#### **Update AndroidManifest.xml:**
```xml
<!-- Line 65 in AndroidManifest.xml -->
<data android:scheme="https"
    android:host="your-actual-domain.com" />
```

### 10. **Build the APK**

#### **Debug Build (for testing):**
```bash
# In Android Studio terminal or command line
cd YourProjectDirectory
./gradlew assembleDebug

# APK location: app/build/outputs/apk/debug/app-debug.apk
```

#### **Release Build (for distribution):**
```bash
# Generate signed APK
./gradlew assembleRelease

# APK location: app/build/outputs/apk/release/app-release.apk
```

## 🔐 Code Signing for Google Play Store

### 1. **Generate Signing Key**

```bash
# Generate keystore file
keytool -genkey -v -keystore studybuddy-release-key.keystore -alias studybuddy -keyalg RSA -keysize 2048 -validity 10000

# Enter details when prompted:
# - First and Last Name: Your Name
# - Organizational Unit: Your Team
# - Organization: Your Company
# - City: Your City
# - State: Your State  
# - Country Code: Your Country (e.g., US)
```

### 2. **Configure Signing in build.gradle**

```gradle
android {
    signingConfigs {
        release {
            storeFile file('path/to/studybuddy-release-key.keystore')
            storePassword 'your_store_password'
            keyAlias 'studybuddy'
            keyPassword 'your_key_password'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. **Build Signed APK**

```bash
# Build signed release APK
./gradlew assembleRelease

# Or generate AAB (recommended for Play Store)
./gradlew bundleRelease
```

## 🛡️ Google Play Store Compliance

### 1. **Required Metadata**

**Create these files for Play Store:**
- **App Description** (4000 characters max)
- **Short Description** (80 characters max)
- **Screenshots** (at least 2, up to 8)
- **Feature Graphic** (1024x500px)
- **App Icon** (512x512px, PNG)

### 2. **Privacy Policy**

**Required for apps that:**
- Handle personal data
- Use permissions like camera, microphone
- Target children (StudyBuddy does!)

**Sample Privacy Policy URL:**
`https://your-domain.com/privacy-policy.html`

### 3. **App Content Rating**

**StudyBuddy should be rated:**
- **Target Audience**: Ages 6-14
- **Content**: Educational
- **Ads**: None (or specify if you add ads later)
- **Data Collection**: Minimal (only API key storage)

### 4. **Required Permissions Justification**

**For Google Play Console:**
```
INTERNET: Required to communicate with AI service for educational content
ACCESS_NETWORK_STATE: Check internet connectivity for better user experience  
RECORD_AUDIO: Enable voice input for accessibility and ease of use
CAMERA: Allow file uploads and future AR features (optional)
```

## 🧪 Testing Before Release

### 1. **Device Testing**

**Test on multiple devices:**
- **Android 7.0** (API 24) - minimum supported
- **Android 14** (API 34) - latest target
- **Different screen sizes** (phone, tablet)
- **Different manufacturers** (Samsung, Google, etc.)

### 2. **Functionality Testing**

**Test these features:**
- [ ] App launches without crashes
- [ ] Splash screen displays correctly
- [ ] WebView loads your website
- [ ] Voice input works (on HTTPS)
- [ ] Camera permission handling
- [ ] Offline message displays properly
- [ ] Back button navigation works
- [ ] App can be installed/uninstalled
- [ ] No security warnings

### 3. **Performance Testing**

**Check these metrics:**
- [ ] App startup time < 3 seconds
- [ ] Memory usage < 100MB
- [ ] No memory leaks
- [ ] Smooth scrolling and interactions
- [ ] Battery usage is reasonable

## 📦 Alternative APK Distribution

### **Direct APK Distribution (Outside Play Store)**

If you want to distribute the APK directly:

1. **Enable "Unknown Sources"** on target devices
2. **Host APK file** on your website
3. **Add download link** to your website
4. **Include installation instructions**

**Security considerations:**
- Sign your APK properly
- Use HTTPS for download
- Provide SHA256 hash for verification
- Include virus scan results

### **Amazon Appstore**
- Submit to Amazon Developer Console
- Similar process to Google Play
- Reaches Amazon Fire devices

### **Samsung Galaxy Store**
- Submit to Galaxy Store Seller Portal
- Pre-installed on Samsung devices
- Good alternative distribution channel

## 🚀 Build Automation

### **GitHub Actions CI/CD**

Create `.github/workflows/build.yml`:
```yaml
name: Build StudyBuddy APK

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 11
      uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'
        
    - name: Cache Gradle packages
      uses: actions/cache@v3
      with:
        path: |
          ~/.gradle/caches
          ~/.gradle/wrapper
        key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
        
    - name: Grant execute permission for gradlew
      run: chmod +x gradlew
      
    - name: Build Debug APK
      run: ./gradlew assembleDebug
      
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: studybuddy-debug-apk
        path: app/build/outputs/apk/debug/app-debug.apk
```

## 🆘 Common Build Issues & Solutions

### **Issue 1: "SDK not found"**
```bash
# Solution: Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### **Issue 2: "Gradle sync failed"**
```bash
# Solution: Clear Gradle cache
./gradlew clean
rm -rf ~/.gradle/caches/
```

### **Issue 3: "Duplicate class found"**
```gradle
// Solution: Add to app/build.gradle
android {
    packagingOptions {
        pickFirst '**/libc++_shared.so'
        pickFirst '**/libjsc.so'
    }
}
```

### **Issue 4: "WebView not loading"**
```xml
<!-- Solution: Add to AndroidManifest.xml -->
<application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config">
```

## 📋 Final Checklist

**Before submitting to Play Store:**

- [ ] App builds without errors
- [ ] All features work as expected
- [ ] Proper app icon and splash screen
- [ ] Signed with release key
- [ ] Tested on multiple devices
- [ ] Privacy policy created
- [ ] Store listing prepared
- [ ] Screenshots taken
- [ ] Age rating completed
- [ ] URL updated to production domain
- [ ] Security configurations verified

**Your StudyBuddy Android app is now ready for the world! 🌟📱**