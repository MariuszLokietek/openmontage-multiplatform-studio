import React, { useState } from 'react';
import { ApkConfig, ExeConfig, IosConfig, MacConfig, TargetPlatform } from '../types';
import { Monitor, Smartphone, Apple, Terminal, Copy, Check, Cloud, Cpu, Download, ExternalLink, HardDrive, ShieldCheck } from 'lucide-react';

interface UniversalBuildGuideProps {
  targetPlatform: TargetPlatform;
  exeConfig: ExeConfig;
  apkConfig: ApkConfig;
  macConfig: MacConfig;
  iosConfig: IosConfig;
  onDownloadProject: () => void;
}

export const UniversalBuildGuide: React.FC<UniversalBuildGuideProps> = ({
  targetPlatform,
  exeConfig,
  apkConfig,
  macConfig,
  iosConfig,
  onDownloadProject,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span>Instrukcja Kompilacji i Wdrożenia</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Szczegółowy poradnik uzyskania gotowych plików instalacyjnych na systemy Windows, Android, macOS oraz iOS.
            </p>
          </div>

          <button
            onClick={onDownloadProject}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pobierz Paczkę Wybranej Platformy (.zip)</span>
          </button>
        </div>

        {/* Windows Guide */}
        {targetPlatform === 'windows' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-sky-400" />
                  <span>Kompilacja Instalatora Windows EXE (.exe)</span>
                </h2>
                <span className="text-[11px] text-emerald-400 font-medium">Windows 10 / 11 (x64 & ARM64)</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-sky-300 block mb-1">Metoda A: 1-Kliknięcie na komputerze z Windows:</strong>
                  Wypakuj pobrany plik ZIP i uruchom dołączony plik <code className="text-white font-mono">build.bat</code>. Instalator pojawi się w folderze <code className="text-emerald-400 font-mono">dist\{exeConfig.installerName}</code>.
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-sky-300 block mb-1">Metoda B: Wiersz poleceń (PowerShell / CMD):</strong>
                  <div className="relative mt-2">
                    <pre className="p-3 bg-slate-900 rounded border border-slate-800 font-mono text-xs text-sky-300">
                      npm install{'\n'}npm run build:win
                    </pre>
                    <button
                      onClick={() => copyToClipboard('npm install\nnpm run build:win', 'win-cmd')}
                      className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-300 rounded"
                    >
                      {copiedCode === 'win-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-sky-300 block mb-1">Metoda C: Darmowa chmura GitHub Actions:</strong>
                  Wrzuć pliki do darmowego repozytorium GitHub. Serwery w chmurze skompilują instalator i wystawią plik .exe w zakładce <em>Actions -&gt; Artifacts</em>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Android Guide */}
        {targetPlatform === 'android' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Kompilacja Pakietu Android APK (.apk)</span>
                </h2>
                <span className="text-[11px] text-emerald-400 font-medium">Android 7.0 - 15 (Smartfony & Tablety)</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-300 block mb-1">Metoda A: W darmowej chmurze GitHub Actions:</strong>
                  Prześlij rozpakowany projekt do GitHuba. Wbudowany workflow <code className="text-white font-mono">.github/workflows/build-apk.yml</code> skompiluje plik <code className="text-emerald-400 font-mono">app-debug.apk</code> w 2 minuty bez instalowania czegokolwiek na komputerze!
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-300 block mb-1">Metoda B: W Android Studio:</strong>
                  Wybierz <em>File -&gt; Open...</em>, wskaż katalog projektu, a następnie w menu górnym kliknij <em>Build -&gt; Build APK(s)</em>.
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-emerald-300 block mb-1">Metoda C: W terminalu (Gradle):</strong>
                  <div className="relative mt-2">
                    <pre className="p-3 bg-slate-900 rounded border border-slate-800 font-mono text-xs text-emerald-300">
                      chmod +x gradlew{'\n'}./gradlew assembleDebug
                    </pre>
                    <button
                      onClick={() => copyToClipboard('chmod +x gradlew\n./gradlew assembleDebug', 'apk-cmd')}
                      className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-300 rounded"
                    >
                      {copiedCode === 'apk-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* macOS Guide */}
        {targetPlatform === 'macos' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Apple className="w-4 h-4 text-slate-200" />
                  <span>Kompilacja Pakietu Apple macOS (.DMG / .APP)</span>
                </h2>
                <span className="text-[11px] text-indigo-400 font-medium">Apple Silicon (M1-M4) & Intel</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 block mb-1">Metoda A: Kompilacja w chmurze GitHub (BEZ KOMPUTERA MAC):</strong>
                  Nie musisz posiadać Maca! Maszyny wirtualne Apple w GitHub Actions skompilują dla Ciebie plik <code className="text-slate-100 font-mono">{macConfig.dmgName}</code> w około 2 minuty i udostępnią go do pobrania.
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 block mb-1">Metoda B: Na komputerze Mac w Terminalu:</strong>
                  <div className="relative mt-2">
                    <pre className="p-3 bg-slate-900 rounded border border-slate-800 font-mono text-xs text-indigo-300">
                      npm install{'\n'}npm run build:mac
                    </pre>
                    <button
                      onClick={() => copyToClipboard('npm install\nnpm run build:mac', 'mac-cmd')}
                      className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-300 rounded"
                    >
                      {copiedCode === 'mac-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* iOS Guide */}
        {targetPlatform === 'ios' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>Instalacja Aplikacji na iPhone & iPad (Apple iOS)</span>
                </h2>
                <span className="text-[11px] text-indigo-400 font-medium">iOS 16 / 17 / 18</span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-indigo-300 block mb-1">Metoda A: Instalacja na iPhone kablem USB (Sideloadly / AltStore):</strong>
                  Nie potrzebujesz płatnego konta programisty Apple!
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-slate-400 pl-1">
                    <li>Pobierz darmowy program <a href="https://sideloadly.io" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-medium">Sideloadly</a> na Windows lub Mac.</li>
                    <li>Podłącz iPhone kablem USB do komputera.</li>
                    <li>Wskaż plik aplikacji, wpisz swoje darmowe Apple ID i kliknij <strong>Start</strong>.</li>
                    <li>Aplikacja OpenMontage zainstaluje się bezpośrednio na Twoim iPhonie!</li>
                  </ol>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-indigo-300 block mb-1">Metoda B: W środowisku Xcode na Macu:</strong>
                  Otwórz wygenerowany katalog w Xcode, podłącz telefon i naciśnij <strong className="text-white">Run (Cmd+R)</strong>.
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <strong className="text-indigo-300 block mb-1">Metoda C: Publikacja w TestFlight & App Store:</strong>
                  Dołączony workflow <code className="text-slate-100 font-mono">.github/workflows/build-ios.yml</code> przygotowuje archiwum aplikacji do dystrybucji na urządzenia testerów w TestFlight.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
