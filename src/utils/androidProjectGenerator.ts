import { ApkConfig, ProjectFile } from '../types';

export function packageNameToPath(packageName: string): string {
  return packageName.replace(/\./g, '/');
}

export function generateAndroidManifest(config: ApkConfig): string {
  const permissionsList = [];
  if (config.allowInternet) permissionsList.push('    <uses-permission android:name="android.permission.INTERNET" />');
  if (config.allowCameraAccess) permissionsList.push('    <uses-permission android:name="android.permission.CAMERA" />\n    <uses-feature android:name="android.hardware.camera" android:required="false" />');
  if (config.allowAudioRecord) permissionsList.push('    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />');
  if (config.allowExternalStorage) {
    permissionsList.push('    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />');
    permissionsList.push('    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />');
    permissionsList.push('    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />');
    permissionsList.push('    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />');
    permissionsList.push('    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />');
  }

  const orientationAttr = config.orientation === 'portrait' 
    ? 'android:screenOrientation="portrait"' 
    : config.orientation === 'landscape' 
    ? 'android:screenOrientation="landscape"' 
    : 'android:screenOrientation="sensor"';

  const hwAccAttr = config.hardwareAccelerated ? 'android:hardwareAccelerated="true"' : 'android:hardwareAccelerated="false"';

  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageName}">

${permissionsList.join('\n')}

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.OpenMontageApp"
        ${hwAccAttr}
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            ${orientationAttr}
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`;
}

export function generateMainActivityJava(config: ApkConfig): string {
  const packageName = config.packageName;
  return `package ${packageName};

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private final static int FILECHOOSER_RESULTCODE = 101;
    private final static int PERMISSION_REQ_CODE = 202;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ${config.fullscreen ? 'Włącz pełny ekran (Immersive Mode)' : 'Standardowy widok z paskiem stanu'}
        ${config.fullscreen ? `
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        ` : ''}

        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.openmontage_webview);
        setupWebView();
        checkAndRequestPermissions();

        // Załaduj spakowaną aplikację OpenMontage z lokalnych assetów
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(${config.enableJavascript});
        settings.setDomStorageEnabled(${config.enableDomStorage});
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false); // Automatyczne odtwarzanie klipów wideo montażu
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);

        // Obsługa wyboru plików multimedialnych oraz uprawnień WebRTC
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                            FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILECHOOSER_RESULTCODE);
                } catch (Exception e) {
                    MainActivity.this.filePathCallback = null;
                    return false;
                }
                return true;
            }

            @Override
            @TargetApi(Build.VERSION_CODES.LOLLIPOP)
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> request.grant(request.getResources()));
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file:///android_asset/")) {
                    return false;
                }
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
                return true;
            }
        });
    }

    private void checkAndRequestPermissions() {
        String[] permissions = new String[]{
            android.Manifest.permission.CAMERA,
            android.Manifest.permission.RECORD_AUDIO
        };
        boolean needsRequest = false;
        for (String p : permissions) {
            if (ContextCompat.checkSelfPermission(this, p) != PackageManager.PERMISSION_GRANTED) {
                needsRequest = true;
                break;
            }
        }
        if (needsRequest) {
            ActivityCompat.requestPermissions(this, permissions, PERMISSION_REQ_CODE);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == Activity.RESULT_OK && data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    } else if (data.getClipData() != null) {
                        final int numSelectedFiles = data.getClipData().getItemCount();
                        results = new Uri[numSelectedFiles];
                        for (int i = 0; i < numSelectedFiles; i++) {
                            results[i] = data.getClipData().getItemAt(i).getUri();
                        }
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`;
}

export function generateAppBuildGradle(config: ApkConfig): string {
  return `plugins {
    id 'com.android.application'
}

android {
    namespace '${config.packageName}'
    compileSdk ${config.targetSdk}

    defaultConfig {
        applicationId "${config.packageName}"
        minSdk ${config.minSdk}
        targetSdk ${config.targetSdk}
        versionCode ${config.versionCode}
        versionName "${config.versionName}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            // Podpisz kluczem debug dla łatwego testowania release na telefonie
            signingConfig signingConfigs.debug
        }
        debug {
            applicationIdSuffix ".debug"
            debuggable true
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.10.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
}
`;
}

export function generateRootBuildGradle(): string {
  return `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'com.android.application' version '8.3.0' apply false
}
`;
}

export function generateSettingsGradle(config: ApkConfig): string {
  return `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${config.appName.replace(/[^a-zA-Z0-9_-]/g, '')}"
include ':app'
`;
}

export function generateGradleProperties(): string {
  return `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=true
`;
}

export function generateActivityMainXml(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#000000">

    <WebView
        android:id="@+id/openmontage_webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
`;
}

export function generateStringsXml(config: ApkConfig): string {
  return `<resources>
    <string name="app_name">${config.appName}</string>
</resources>
`;
}

export function generateColorsXml(config: ApkConfig): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">${config.themeColor}</color>
    <color name="primary_dark">#090D16</color>
    <color name="accent">${config.themeColor}</color>
    <color name="black">#000000</color>
    <color name="white">#FFFFFF</color>
</resources>
`;
}

export function generateStylesXml(): string {
  return `<resources>
    <style name="Theme.OpenMontageApp" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryDark">@color/primary_dark</item>
        <item name="colorAccent">@color/accent</item>
        <item name="android:windowBackground">@color/primary_dark</item>
    </style>
</resources>
`;
}

export function generateGitHubWorkflowYaml(): string {
  return `name: Kompiluj APK Android (OpenMontage)

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Zbuduj plik APK
    runs-on: ubuntu-latest

    steps:
      - name: Pobierz kod repozytorium
        uses: actions/checkout@v4

      - name: Skonfiguruj środowisko Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
          cache: 'gradle'

      - name: Nadaj uprawnienia wykonywania skryptowi gradlew
        run: chmod +x gradlew

      - name: Skompiluj aplikację APK (Debug)
        run: ./gradlew assembleDebug --stacktrace

      - name: Opublikuj wygenerowany plik APK jako artefakt
        uses: actions/upload-artifact@v4
        with:
          name: OpenMontage-App-Debug-APK
          path: app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14
`;
}

export function generateCompilationReadme(config: ApkConfig): string {
  return `# Jak skompilować pliki OpenMontage do pliku APK (.apk)

Projekt został automatycznie spakowany i wygenerowany jako pełnoprawny, natywny projekt Android Studio dla aplikacji **${config.appName}** (\`${config.packageName}\`).

Wszystkie Twoje pliki OpenMontage (HTML, CSS, JS, media) znajdują się w katalogu:
\`app/src/main/assets/www/\`

Oto 4 najprostsze i najszybsze sposoby uzyskania pliku **.apk**:

---

## ⚡ METODA 1: Bez instalacji niczego (Darmowa chmura GitHub Actions - NAJPROSTSZA)

1. Załóż nowe prywatne lub publiczne repozytorium na [GitHub.com](https://github.com/new).
2. Rozpakuj pobrany plik ZIP i wrzuć wszystkie pliki do repozytorium.
3. W GitHubie przejdź do zakładki **Actions**.
4. Zobaczysz automatycznie uruchomiony proces \`Kompiluj APK Android (OpenMontage)\`.
5. Po około 2 minutach kompilacja się zakończy — kliknij w zakończone zadanie i pobierz gotowy plik **OpenMontage-App-Debug-APK.zip** zawierający plik **.apk**!
6. Prześlij plik APK na telefon i zainstaluj!

---

## 💻 METODA 2: Kompilacja w Android Studio (Wizualna)

1. Pobierz i zainstaluj darmowe [Android Studio](https://developer.android.com/studio).
2. Wybierz **File -> Open...** i wskaż rozpakowany katalog tego projektu.
3. Poczekaj, aż Gradle automatycznie pobierze zależności.
4. W menu górnym wybierz: **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
5. Po zakończeniu kliknij powiadomienie **locate** w prawym dolnym rogu. Plik APK będzie gotowy w katalogu:
   \`app/build/outputs/apk/debug/app-debug.apk\`

---

## 🖥️ METODA 3: Kompilacja w terminalu (Linux / macOS / Windows)

Wymagania: Zainstalowane JDK 17 i zmienna JAVA_HOME.

### Na Linux / macOS:
\`\`\`bash
chmod +x gradlew
./gradlew assembleDebug
\`\`\`

### Na Windows (PowerShell / CMD):
\`\`\`cmd
.\\gradlew.bat assembleDebug
\`\`\`

Gotowy plik APK znajdziesz w:
\`app/build/outputs/apk/debug/app-debug.apk\`

---

## 📱 METODA 4: Bezpośrednio na telefonie z Androidem (przez Termux)

Jeśli nie masz komputera pod ręką:
1. Zainstaluj darmową aplikację **Termux** (z F-Droid) na telefonie.
2. Wpisz polecenia:
\`\`\`bash
pkg update && pkg install openjdk-17 git
cd /sciezka/do/rozpakowanego/projektu
chmod +x gradlew
./gradlew assembleDebug
\`\`\`
Plik APK zostanie skompilowany bezpośrednio w pamięci telefonu!
`;
}

export function generateGradlewScript(): string {
  return `#!/bin/sh

# Attempt to set APP_HOME
# Resolve links: $0 may be a link
PRG="$0"
# Need this for relative symlinks.
while [ -h "$PRG" ] ; do
    ls=\`ls -ld "$PRG"\`
    link=\`expr "$ls" : '.*-> \\(.*\\)$'\`
    if expr "$link" : '/.*' > /dev/null; then
        PRG="$link"
    else
        PRG=\`dirname "$PRG"\`"/$link"
    fi
done
SAVED="\`pwd\`"
cd "\`dirname \\"$PRG\\"\`/" >/dev/null
APP_HOME="\`pwd -P\`"
cd "$SAVED" >/dev/null

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        JAVACMD="$JAVA_HOME/jre/sh/java"
    else
        JAVACMD="$JAVA_HOME/bin/java"
    fi
else
    JAVACMD="java"
fi

exec "$JAVACMD" -jar "$CLASSPATH" "$@"
`;
}

export function generateGradlewBatScript(): string {
  return `@rem
@rem Copyright 2015 the original author or authors.
@rem
@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Resolve Java
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto execute

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

:execute
set CLASSPATH=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar

"%JAVA_EXE%" -jar "%CLASSPATH%" %*
`;
}

export function generateGradleWrapperProperties(): string {
  return `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;
}
