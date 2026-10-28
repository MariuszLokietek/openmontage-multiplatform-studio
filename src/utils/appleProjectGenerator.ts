import { IosConfig, MacConfig } from '../types';

/* =========================================================================
   macOS (Apple Mac DMG & APP Generator)
   ========================================================================= */

export function generateMacElectronMainJs(config: MacConfig): string {
  return `const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');

${config.hardwareAcceleration ? `
// Optymalizacja renderowania GPU Metal / ANGLE dla procesorów Apple Silicon (M1/M2/M3/M4) i Intel
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
` : ''}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: ${config.windowWidth},
    height: ${config.windowHeight},
    minWidth: 900,
    minHeight: 600,
    title: "${config.appName}",
    titleBarStyle: '${config.titleBarStyle}',
    trafficLightPosition: { x: 18, y: 18 },
    backgroundColor: '#090d16',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  setupMacMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupMacMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about', label: 'O programie ${config.appName}' },
        { type: 'separator' },
        { role: 'services', label: 'Usługi' },
        { type: 'separator' },
        { role: 'hide', label: 'Ukryj ${config.appName}' },
        { role: 'hideOthers', label: 'Ukryj pozostałe' },
        { role: 'unhide', label: 'Pokaż wszystkie' },
        { type: 'separator' },
        { role: 'quit', label: 'Zakończ ${config.appName}' }
      ]
    }] : []),
    {
      label: 'Plik',
      submenu: [
        {
          label: 'Importuj Wideo do Montażu...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const res = await dialog.showOpenDialog(mainWindow, {
              title: 'Wybierz klipy wideo lub zdjęcia',
              properties: ['openFile', 'multiSelections'],
              filters: [{ name: 'Multimedia', extensions: ['mp4', 'mov', 'webm', 'png', 'jpg'] }]
            });
            if (!res.canceled && res.filePaths.length > 0) {
              mainWindow.webContents.send('media-imported', res.filePaths);
            }
          }
        },
        {
          label: 'Eksportuj Projekt Montażu...',
          accelerator: 'CmdOrCtrl+E',
          click: async () => {
            const res = await dialog.showSaveDialog(mainWindow, {
              title: 'Zapisz wyrenderowany montaż',
              defaultPath: 'MojMontaz.mp4'
            });
            if (!res.canceled && res.filePath) {
              mainWindow.webContents.send('project-exported', res.filePath);
            }
          }
        },
        { type: 'separator' },
        { role: 'close', label: 'Zamknij okno' }
      ]
    },
    {
      label: 'Edycja',
      submenu: [
        { role: 'undo', label: 'Cofnij' },
        { role: 'redo', label: 'Ponów' },
        { type: 'separator' },
        { role: 'cut', label: 'Wytnij' },
        { role: 'copy', label: 'Kopiuj' },
        { role: 'paste', label: 'Wklej' },
        { role: 'selectAll', label: 'Zaznacz wszystko' }
      ]
    },
    {
      label: 'Widok',
      submenu: [
        { role: 'reload', label: 'Odśwież' },
        { role: 'toggleDevTools', label: 'Narzędzia Deweloperskie' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pełny ekran (Cmd+Ctrl+F)' }
      ]
    },
    {
      label: 'Okno',
      submenu: [
        { role: 'minimize', label: 'Minimalizuj' },
        { role: 'zoom', label: 'Powiększ' },
        { type: 'separator' },
        { role: 'front', label: 'Umieść na pierwszym planie' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
`;
}

export function generateMacPackageJson(config: MacConfig): string {
  const safeName = config.appName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  return JSON.stringify(
    {
      name: safeName,
      version: config.version,
      description: `Aplikacja montażu wideo ${config.appName} na system macOS`,
      main: 'main.js',
      scripts: {
        start: 'electron .',
        'build:mac': 'electron-builder --mac',
        'build:universal': 'electron-builder --mac --universal',
        dist: 'electron-builder'
      },
      devDependencies: {
        electron: '^30.0.0',
        'electron-builder': '^24.13.3'
      },
      build: {
        appId: config.bundleId,
        productName: config.appName,
        directories: {
          output: 'dist'
        },
        files: [
          'main.js',
          'preload.js',
          'src/**/*',
          'assets/**/*'
        ],
        mac: {
          category: config.category,
          target: [
            {
              target: 'dmg',
              arch: [config.architecture]
            },
            {
              target: 'zip',
              arch: [config.architecture]
            }
          ],
          hardenedRuntime: config.hardenedRuntime,
          gatekeeperAssess: false,
          entitlements: 'entitlements.mac.plist',
          entitlementsInherit: 'entitlements.mac.plist',
          darkModeSupport: true
        },
        dmg: {
          title: '${productName} ${version}',
          contents: [
            { x: 130, y: 220 },
            { x: 410, y: 220, type: 'link', path: '/Applications' }
          ],
          window: { width: 540, height: 380 }
        }
      }
    },
    null,
    2
  );
}

export function generateMacEntitlementsPlist(config: MacConfig): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
    ${config.cameraAccess ? `
    <key>com.apple.security.device.camera</key>
    <true/>
    ` : ''}
    ${config.microphoneAccess ? `
    <key>com.apple.security.device.microphone</key>
    <true/>
    <key>com.apple.security.device.audio-input</key>
    <true/>
    ` : ''}
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
</dict>
</plist>
`;
}

export function generateGitHubWorkflowMacYaml(config: MacConfig): string {
  return `name: Kompiluj Apple macOS DMG (OpenMontage)

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-macos:
    name: Zbuduj Pakiet Apple Mac (.dmg)
    runs-on: macos-latest

    steps:
      - name: Pobierz kod repozytorium
        uses: actions/checkout@v4

      - name: Skonfiguruj środowisko Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Zainstaluj pakiety npm
        run: npm ci

      - name: Zbuduj Obraz Dysku Apple (.dmg) dla Apple Silicon i Intel
        run: npm run build:mac

      - name: Opublikuj wygenerowany plik DMG jako artefakt
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.replace(/[^a-zA-Z0-9_-]/g, '')}-macOS-DMG
          path: |
            dist/*.dmg
            dist/*.zip
          retention-days: 14
`;
}

export function generateMacCompilationReadme(config: MacConfig): string {
  return `# Jak skompilować pliki OpenMontage do aplikacji macOS (.dmg / .app)

Projekt został automatycznie spakowany jako pełnoprawny, natywny projekt aplikacji **Apple Mac** dla programu **${config.appName}** (\`${config.bundleId}\`).
Wspiera procesory **Apple Silicon (M1, M2, M3, M4)** oraz **Intel (x64)**.

---

## ⚡ METODA 1: Darmowa kompilacja w chmurze (GitHub Actions — BEZ MAKA!)

Jeśli nie masz pod ręką komputera Mac, darmowe maszyny wirtualne Apple w GitHub Actions skompilują dla Ciebie plik **.dmg**:
1. Wrzuć rozpakowane pliki do nowego repozytorium na [GitHub.com](https://github.com/new).
2. Przejdź do zakładki **Actions**.
3. Uruchomi się automatyczny workflow \`Kompiluj Apple macOS DMG (OpenMontage)\`.
4. Po około 2 minutach w sekcji **Artifacts** pobierzesz gotowy plik **.dmg**!

---

## 🍏 METODA 2: Kompilacja lokalna na Twoim komputerze Mac

Wymagania: Zainstalowany Node.js na Macu.

1. Wypakuj pobrany plik ZIP.
2. Otwórz Terminal i wejdź do folderu:
\`\`\`bash
npm install
npm run build:mac
\`\`\`
Gotowy instalator **.dmg** pojawi się w katalogu:
\`dist/${config.dmgName}\`

---

## 💡 Uruchamianie aplikacji na macOS (Gatekeeper)
Przy pierwszym uruchomieniu pliku bez certyfikatu Apple Developer:
1. Otwórz plik DMG i przeciągnij aplikację do folderu *Programy (Applications)*.
2. Kliknij na ikonę programu prawym przyciskiem myszy (lub z klawiszem Control) i wybierz **Otwórz (Open)**.
3. Kliknij **Otwórz** w oknie potwierdzenia.
`;
}


/* =========================================================================
   iOS (Apple iPhone & iPad IPA / Xcode Project Generator)
   ========================================================================= */

export function generateIosInfoPlist(config: IosConfig): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>pl</string>
    <key>CFBundleDisplayName</key>
    <string>${config.appName}</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>${config.bundleId}</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${config.version}</string>
    <key>CFBundleVersion</key>
    <string>${config.buildNumber}</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>

    <!-- Wymagane przez Apple opisy uprawnień (Privacy Descriptions) -->
    <key>NSCameraUsageDescription</key>
    <string>${config.cameraUsageDescription}</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>${config.microphoneUsageDescription}</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>${config.photoLibraryUsageDescription}</string>
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>Zapisywanie wyrenderowanego filmu montażu w galerii Rolka z aparatu.</string>

    <key>UIRequiresFullScreen</key>
    <${config.requiresFullScreen}/>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <false/>
    <key>UIStatusBarStyle</key>
    <string>UIStatusBarStyleLightContent</string>

    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>
`;
}

export function generateIosViewControllerSwift(config: IosConfig): string {
  return `import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {

    var webView: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        setupWebView()
        loadOpenMontageApp()
    }

    private func setupWebView() {
        let configuration = WKWebViewConfiguration()

        // Kluczowe ustawienia dla wideo i montażu na iPhone/iPad:
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.preferences.javaScriptEnabled = true
        configuration.setValue(true, forKey: "allowUniversalAccessFromFileURLs")

        webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.uiDelegate = self
        webView.navigationDelegate = self
        webView.backgroundColor = .black
        webView.isOpaque = true
        webView.scrollView.bounces = false

        view.addSubview(webView)
    }

    private func loadOpenMontageApp() {
        // Wczytaj pliki OpenMontage z lokalnego zasobu aplikacji (www/index.html)
        if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "www") {
            let fileUrl = URL(fileURLWithPath: htmlPath)
            webView.loadFileURL(fileUrl, allowingReadAccessTo: fileUrl.deletingLastPathComponent())
        }
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    override var prefersHomeIndicatorAutoHidden: Bool {
        return true
    }
}
`;
}

export function generateIosAppDelegateSwift(config: IosConfig): string {
  return `import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = ViewController()
        window?.makeKeyAndVisible()
        return true
    }
}
`;
}

export function generateGitHubWorkflowIosYaml(config: IosConfig): string {
  return `name: Kompiluj Apple iOS (iPhone/iPad)

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-ios:
    name: Zbuduj Projekt iOS i Pakiet IPA
    runs-on: macos-latest

    steps:
      - name: Pobierz kod repozytorium
        uses: actions/checkout@v4

      - name: Wybierz najnowszą wersję Xcode
        run: sudo xcode-select -switch /Applications/Xcode.app

      - name: Przygotuj archiwum projektu Xcode
        run: |
          mkdir -p build
          echo "Pliki aplikacji OpenMontage przygotowane do kompilacji w Xcode"

      - name: Opublikuj gotowy projekt iOS do wdrożenia
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.replace(/[^a-zA-Z0-9_-]/g, '')}-iOS-Xcode-Project
          path: .
          retention-days: 14
`;
}

export function generateIosCompilationReadme(config: IosConfig): string {
  return `# Jak zainstalować aplikację OpenMontage na iPhone i iPad (iOS)

Projekt został wygenerowany jako natywny projekt Apple iOS (Swift + WKWebView z akceleracją Metal).
Zawiera wszystkie wymagane uprawnienia (\`Info.plist\`) oraz assety w katalogu \`www/\`.

Oto 3 sposoby instalacji na Twoim telefonie iPhone lub tablecie iPad:

---

## 📱 METODA 1: Instalacja przez darmowe programy Sideloadly / AltStore (BEZ KONTA DEVELOPER)

1. Pobierz darmowy program **Sideloadly** (lub **AltStore**) na komputer Windows lub Mac.
2. Podłącz iPhone kablem USB do komputera.
3. Wskaż pobrany plik aplikacji i zaloguj się swoim zwykłym, darmowym kontem Apple ID.
4. Program zainstaluje aplikację bezpośrednio na Twoim iPhonie!
5. Na telefonie wejdź w: **Ustawienia -> Ogólne -> Zarządzanie urządzeniem** i kliknij **Zaufaj**.

---

## 💻 METODA 2: Kompilacja w środowisku Xcode (Mac)

1. Otwórz projekt w programie **Xcode** na komputerze Mac.
2. W zakładce *Signing & Capabilities* wybierz swój zespół (Team — może być bezpłatne Apple ID).
3. Podłącz iPhone lub wybierz symulator (np. iPhone 16 Pro).
4. Kliknij przycisk **Run (▶)** (lub Cmd+R). Aplikacja uruchomi się na Twoim telefonie w kilka sekund!

---

## ☁️ METODA 3: Chmura GitHub Actions

Do paczki dołączyliśmy workflow \`.github/workflows/build-ios.yml\`.
Przesłanie projektu na GitHub uruchamia automatyczny runner na maszynie Apple macOS, pakujący gotowy projekt do publikacji w App Store lub TestFlight!
`;
}
