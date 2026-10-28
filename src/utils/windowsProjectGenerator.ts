import { ExeConfig } from '../types';

export function generateElectronMainJs(config: ExeConfig): string {
  return `const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');

// Flagi akceleracji sprzętowej GPU dla płynnego renderowania wideo OpenMontage
${config.hardwareAcceleration ? `
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-zero-copy');
` : ''}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: ${config.windowWidth},
    height: ${config.windowHeight},
    minWidth: 800,
    minHeight: 600,
    title: "${config.appName}",
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    backgroundColor: '#090d16',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: ${config.enableNodeIntegration},
      contextIsolation: true,
      webSecurity: false, // Pozwala na lokalne wczytywanie klipów wideo z dysku C: / D:
      allowRunningInsecureContent: true
    }
  });

  // Wczytaj główny plik projektu OpenMontage
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Konfiguracja menu aplikacji Windows
  createApplicationMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createApplicationMenu() {
  const template = [
    {
      label: 'Plik',
      submenu: [
        {
          label: 'Importuj Wideo do Montażu...',
          accelerator: 'Ctrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              title: 'Wybierz klipy wideo lub zdjęcia',
              properties: ['openFile', 'multiSelections'],
              filters: [
                { name: 'Pliki Multimedialne', extensions: ['mp4', 'mov', 'webm', 'png', 'jpg', 'jpeg', 'mp3', 'wav'] },
                { name: 'Wszystkie pliki', extensions: ['*'] }
              ]
            });
            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send('media-imported', result.filePaths);
            }
          }
        },
        {
          label: 'Eksportuj Projekt...',
          accelerator: 'Ctrl+E',
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              title: 'Zapisz wyrenderowany projekt montażu',
              defaultPath: 'MojMontaz.mp4',
              filters: [
                { name: 'Wideo MP4', extensions: ['mp4'] },
                { name: 'Projekt OpenMontage', extensions: ['json', 'omproj'] }
              ]
            });
            if (!result.canceled && result.filePath) {
              mainWindow.webContents.send('project-exported', result.filePath);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Zakończ',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Widok',
      submenu: [
        { role: 'reload', label: 'Odśwież' },
        { role: 'forceReload', label: 'Wymuś odświeżenie' },
        { role: 'toggleDevTools', label: 'Narzędzia Deweloperskie (F12)' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Domyślny rozmiar' },
        { role: 'zoomIn', label: 'Powiększ' },
        { role: 'zoomOut', label: 'Pomniejsz' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pełny ekran (F11)' }
      ]
    },
    {
      label: 'Pomoc',
      submenu: [
        {
          label: 'O programie ${config.appName}',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'O programie',
              message: '${config.appName} v${config.version}',
              detail: 'Aplikacja OpenMontage skompilowana dla systemu Microsoft Windows.\\nProducent: ${config.companyName}',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Blokada wielokrotnego uruchamiania (Single Instance Lock)
${!config.allowMultipleInstances ? `
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
` : ''}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
`;
}

export function generatePreloadJs(): string {
  return `const { contextBridge, ipcRenderer } = require('electron');

// Bezpieczny mostek komunikacyjny pomiędzy warstwą Web (OpenMontage) a systemem Windows
contextBridge.exposeInMainWorld('openMontageDesktop', {
  platform: 'win32',
  isElectron: true,
  onMediaImported: (callback) => ipcRenderer.on('media-imported', (_event, paths) => callback(paths)),
  onProjectExported: (callback) => ipcRenderer.on('project-exported', (_event, path) => callback(path)),
  showNotification: (title, body) => {
    new Notification(title, { body });
  }
});
`;
}

export function generateWindowsPackageJson(config: ExeConfig): string {
  const safeName = config.appName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  return JSON.stringify(
    {
      name: safeName,
      version: config.version,
      description: config.appDescription || `Aplikacja ${config.appName} dla Windows`,
      main: 'main.js',
      author: config.companyName || 'OpenMontage Community',
      scripts: {
        start: 'electron .',
        'build:win': 'electron-builder --win nsis:x64',
        'build:portable': 'electron-builder --win portable:x64',
        dist: 'electron-builder'
      },
      devDependencies: {
        electron: '^30.0.0',
        'electron-builder': '^24.13.3'
      },
      build: {
        appId: config.appId || 'com.openmontage.desktop',
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
        win: {
          target: [
            config.installerType === 'portable'
              ? 'portable'
              : {
                  target: 'nsis',
                  arch: [config.architecture === 'universal' ? 'x64' : config.architecture]
                }
          ],
          icon: 'assets/icon.ico',
          legalTrademarks: config.companyName,
          requestedExecutionLevel: 'asInvoker'
        },
        nsis: {
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: config.createDesktopShortcut,
          createStartMenuShortcut: config.createStartMenuShortcut,
          shortcutName: config.appName,
          uninstallDisplayName: `${config.appName} (Odinstaluj)`,
          artifactName: '${productName}_Setup_${version}.${ext}'
        },
        portable: {
          artifactName: '${productName}_Portable_${version}.${ext}'
        }
      }
    },
    null,
    2
  );
}

export function generateInnoSetupScript(config: ExeConfig): string {
  return `; Skrypt instalatora Inno Setup 6 dla aplikacji ${config.appName}
#define MyAppName "${config.appName}"
#define MyAppVersion "${config.version}"
#define MyAppPublisher "${config.companyName}"
#define MyAppExeName "${config.exeName}"

[Setup]
AppId={{${config.appId.replace(/[{}]/g, '')}}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\\{#MyAppName}
DisableProgramGroupPage=yes
OutputDir=dist-inno
OutputBaseFilename=${config.installerName.replace(/\.exe$/i, '')}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest

[Languages]
Name: "polish"; MessagesFile: "compiler:Languages\\Polish.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\\win-unpacked\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"
Name: "{autodesktop}\\{#MyAppName}"; Filename: "{app}\\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
`;
}

export function generateWindowsBuildBat(config: ExeConfig): string {
  return `@echo off
chcp 65001 >nul
echo =======================================================
echo   Kompilator OpenMontage do pliku instalatora Windows EXE
echo   Aplikacja: ${config.appName} v${config.version}
echo =======================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [BŁĄD] Node.js nie został znaleziony w systemie!
    echo Zainstaluj Node.js ze strony https://nodejs.org i spróbuj ponownie.
    pause
    exit /b 1
)

echo [1/3] Instalowanie zależności deweloperskich Electron...
call npm install
if %errorlevel% neq 0 (
    echo [BŁĄD] Wystąpił problem podczas instalacji zależności npm!
    pause
    exit /b 1
)

echo.
echo [2/3] Budowanie instalatora Windows (.exe)...
call npm run build:win
if %errorlevel% neq 0 (
    echo [BŁĄD] Kompilacja instalatora nie powiodła się.
    pause
    exit /b 1
)

echo.
echo [3/3] Sukces! Wygenerowano instalator:
dir /b dist\\*.exe
echo.
echo Plik instalacyjny znajdziesz w folderze: dist\\
pause
`;
}

export function generateWindowsBuildPs1(): string {
  return `# Skrypt PowerShell do budowy instalatora EXE
Write-Host "Rozpoczynam budowę instalatora Windows dla OpenMontage..." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "BŁĄD: Node.js nie jest zainstalowany. Pobierz go z https://nodejs.org" -ForegroundColor Red
    Exit 1
}

Write-Host "Instalacja pakietów npm..." -ForegroundColor Yellow
npm install

Write-Host "Kompilacja instalatora EXE przy użyciu electron-builder..." -ForegroundColor Green
npm run build:win

Write-Host "Zakończono pomyślnie! Sprawdź katalog 'dist/'" -ForegroundColor Cyan
Get-ChildItem -Path dist/*.exe | Select-Object Name, Length, LastWriteTime
`;
}

export function generateGitHubWorkflowWindowsYaml(config: ExeConfig): string {
  return `name: Kompiluj Instalator Windows EXE (OpenMontage)

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build-windows:
    name: Zbuduj Instalator Windows (.exe)
    runs-on: windows-latest

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

      - name: Zbuduj Instalator NSIS i Wersję Przenośną (.exe)
        run: npm run dist

      - name: Zapisz gotowy Instalator EXE jako artefakt
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.replace(/[^a-zA-Z0-9_-]/g, '')}-Windows-Installers
          path: |
            dist/*.exe
          retention-days: 14
`;
}

export function generateWindowsCompilationReadme(config: ExeConfig): string {
  return `# Jak skompilować pliki OpenMontage do instalatora Windows EXE (.exe)

Projekt został automatycznie spakowany jako pełnoprawny, natywny projekt aplikacji **Microsoft Windows** dla programu **${config.appName}** w wersji **${config.version}**.

Wszystkie Twoje pliki OpenMontage (HTML, CSS, JS, media) znajdują się w katalogu:
\`src/\`

---

## ⚡ METODA 1: Bez instalowania czegokolwiek (Darmowa chmura GitHub Actions - ZALECANA)

1. Wejdź na [GitHub.com/new](https://github.com/new) i utwórz nowe repozytorium (prywatne lub publiczne).
2. Wypakuj pobrany plik ZIP na dysku i prześlij wszystkie pliki do repozytorium na GitHubie.
3. W GitHubie przejdź do zakładki **Actions**.
4. Zobaczysz automatycznie uruchomiony proces \`Kompiluj Instalator Windows EXE (OpenMontage)\`.
5. Serwery Windows w chmurze skompilują dla Ciebie plik:
   - **\`${config.installerName}\`** (instalator ze skrótem na Pulpicie i w menu Start)
   - **\`${config.appName}_Portable.exe\`** (wersja przenośna)
6. W zakładce *Artifacts* pobierzesz gotowy plik wykonywalny **.exe** i zainstalujesz go na dowolnym komputerze z Windows 10 lub Windows 11!

---

## 💻 METODA 2: Kompilacja na Twoim komputerze z Windows (1-kliknięcie)

Wymagania: Zainstalowane bezpłatne środowisko [Node.js](https://nodejs.org) (wersja LTS).

1. Wypakuj pobrany plik ZIP do folderu na dysku.
2. Kliknij dwukrotnie plik:
   \`build.bat\`
3. Skrypt automatycznie pobierze zależności Electrona i skompiluje plik instalacyjny **.exe**.
4. Gotowy instalator znajdziesz w podfolderze:
   \`dist\\${config.installerName}\`

---

## 🛠️ METODA 3: Przez Wiersz Poleceń (PowerShell / CMD)

W rozpakowanym katalogu projektu wpisz:
\`\`\`bash
npm install
npm run build:win
\`\`\`

Jeśli chcesz utworzyć wersję przenośną (bez konieczności instalacji w systemie, idealną na pendrive):
\`\`\`bash
npm run build:portable
\`\`\`

---

## 📦 METODA 4: Inno Setup 6 (Dla zaawansowanych instalatorów)

Do paczki dołączyliśmy również skrypt:
\`installer.iss\`
Możesz go otworzyć w darmowym programie [Inno Setup 6](https://jrsoftware.org/isdl.php), aby wygenerować klasyczny, superlekki instalator Windows z kreatorem w języku polskim.
`;
}
