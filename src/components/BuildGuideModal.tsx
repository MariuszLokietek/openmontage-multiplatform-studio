import React, { useState } from 'react';
import { ApkConfig } from '../types';
import { Terminal, Copy, Check, Cloud, Monitor, Cpu, Smartphone, Download, ExternalLink } from 'lucide-react';

interface BuildGuideModalProps {
  config: ApkConfig;
  onDownloadProject: () => void;
}

export const BuildGuideModal: React.FC<BuildGuideModalProps> = ({ config, onDownloadProject }) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'cloud' | 'android-studio' | 'terminal' | 'termux'>('cloud');
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
              <span>Instrukcja Uzyskania Pliku APK</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Jak przekształcić spakowany projekt OpenMontage w gotowy plik instalacyjny <code className="text-indigo-300 font-mono">.apk</code> na telefonie.
            </p>
          </div>

          <button
            onClick={onDownloadProject}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pobierz Paczkę Projektu (.zip)</span>
          </button>
        </div>

        {/* Essential Explanation Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Dlaczego pliki OpenMontage wymagają pakowania do APK?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Narzędzie <strong>OpenMontage</strong> eksportuje warstwę aplikacji jako kod Web/HTML5/JavaScript wraz z mediami. 
            Plik <strong>APK (Android Package)</strong> to binarny plik wykonywalny, który wymaga natywnego kontenera Androida (Android WebView z akceleracją sprzętową), manifestu uprawnień oraz kompilacji kompilatorem Gradle/D8.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Nasze studio wygenerowało dla Ciebie <strong>pełną architekturę natywnego projektu Android Studio</strong> z gotowym skryptem CI, który pozwala skompilować plik <code className="text-slate-100 font-mono">.apk</code> całkowicie za darmo w chmurze bez instalacji czegokolwiek na komputerze!
          </p>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveGuideTab('cloud')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeGuideTab === 'cloud'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cloud className="w-4 h-4 text-indigo-400 mb-1.5" />
            <div className="text-xs font-semibold">1. Chmura GitHub</div>
            <div className="text-[10px] opacity-75">Bez instalowania niczego</div>
          </button>

          <button
            onClick={() => setActiveGuideTab('android-studio')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeGuideTab === 'android-studio'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Monitor className="w-4 h-4 text-indigo-400 mb-1.5" />
            <div className="text-xs font-semibold">2. Android Studio</div>
            <div className="text-[10px] opacity-75">Interfejs graficzny</div>
          </button>

          <button
            onClick={() => setActiveGuideTab('terminal')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeGuideTab === 'terminal'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-400 mb-1.5" />
            <div className="text-xs font-semibold">3. Wiersz Poleceń</div>
            <div className="text-[10px] opacity-75">Linux / macOS / Windows</div>
          </button>

          <button
            onClick={() => setActiveGuideTab('termux')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeGuideTab === 'termux'
                ? 'bg-indigo-950/60 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-4 h-4 text-indigo-400 mb-1.5" />
            <div className="text-xs font-semibold">4. W Telefonie</div>
            <div className="text-[10px] opacity-75">Aplikacja Termux</div>
          </button>
        </div>

        {/* Guide Content Panels */}
        {activeGuideTab === 'cloud' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cloud className="w-4 h-4 text-indigo-400" />
                <span>Metoda 1: Darmowa kompilacja w chmurze (GitHub Actions)</span>
              </h2>
              <span className="text-[11px] text-emerald-400 font-medium">Polecana dla początkujących</span>
            </div>

            <p className="text-xs text-slate-300">
              W wygenerowanej paczce ZIP dołączyliśmy plik <code className="text-indigo-300 font-mono">.github/workflows/build-apk.yml</code>. 
              Dzięki niemu darmowe serwery GitHub skompilują dla Ciebie plik APK w 2 minuty.
            </p>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside pl-1">
              <li className="leading-relaxed">
                Pobierz wygenerowany projekt klikając przycisk <strong>„Pobierz Paczkę Projektu (.zip)”</strong>.
              </li>
              <li className="leading-relaxed">
                Wejdź na stronę <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium">github.com/new <ExternalLink className="w-3 h-3" /></a> i utwórz nowe repozytorium (może być prywatne lub publiczne).
              </li>
              <li className="leading-relaxed">
                Rozpakuj pobrany plik ZIP na komputerze i prześlij wszystkie pliki do repozytorium na GitHubie.
              </li>
              <li className="leading-relaxed">
                Na stronie swojego repozytorium kliknij zakładkę <strong>Actions</strong> — zobaczysz działający proces kompilacji <em>„Kompiluj APK Android (OpenMontage)”</em>.
              </li>
              <li className="leading-relaxed">
                Gdy kompilacja zakończy się zielonym ptaszkiem (ok. 2 min), kliknij w zadanie i w sekcji <strong>Artifacts</strong> pobierz gotowy plik:
                <div className="mt-1.5 p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-indigo-300 flex items-center justify-between">
                  <span>OpenMontage-App-Debug-APK.zip (zawiera plik app-debug.apk)</span>
                </div>
              </li>
            </ol>
          </div>
        )}

        {activeGuideTab === 'android-studio' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-400" />
              <span>Metoda 2: Kompilacja w środowisku Android Studio (GUI)</span>
            </h2>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside pl-1">
              <li className="leading-relaxed">
                Pobierz i zainstaluj darmowe oprogramowanie <a href="https://developer.android.com/studio" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium">Android Studio <ExternalLink className="w-3 h-3" /></a>.
              </li>
              <li className="leading-relaxed">
                Pobierz paczkę ZIP z naszej aplikacji i rozpakuj ją do dowolnego folderu na dysku.
              </li>
              <li className="leading-relaxed">
                W Android Studio wybierz <strong>File -&gt; Open...</strong> i wskaż rozpakowany katalog.
              </li>
              <li className="leading-relaxed">
                Poczekaj chwilę, aż Gradle automatycznie zindeksuje projekt i pobierze biblioteki.
              </li>
              <li className="leading-relaxed">
                W górnym menu programu wybierz: <strong className="text-white">Build -&gt; Build Bundle(s) / APK(s) -&gt; Build APK(s)</strong>.
              </li>
              <li className="leading-relaxed">
                Po kilkudziesięciu sekundach w prawym dolnym rogu pojawi się powiadomienie: <em>APK(s) generated successfully</em>. Kliknij niebieski link <strong>locate</strong>.
              </li>
            </ol>
          </div>
        )}

        {activeGuideTab === 'terminal' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Metoda 3: Kompilacja z poziomu wiersza poleceń / terminala</span>
            </h2>

            <p className="text-xs text-slate-300">
              Wymagania: Zainstalowana Java 17+ (JDK) na komputerze.
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  Na systemach Linux oraz macOS:
                </span>
                <div className="relative">
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
                    chmod +x gradlew{'\n'}./gradlew assembleDebug
                  </pre>
                  <button
                    onClick={() => copyToClipboard('chmod +x gradlew\n./gradlew assembleDebug', 'cmd-unix')}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    {copiedCode === 'cmd-unix' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  Na systemie Windows (PowerShell lub CMD):
                </span>
                <div className="relative">
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
                    .\gradlew.bat assembleDebug
                  </pre>
                  <button
                    onClick={() => copyToClipboard('.\\gradlew.bat assembleDebug', 'cmd-win')}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    {copiedCode === 'cmd-win' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
                Lokalizacja wygenerowanego pliku APK:
                <code className="text-emerald-400 block font-mono mt-1">app/build/outputs/apk/debug/app-debug.apk</code>
              </div>
            </div>
          </div>
        )}

        {activeGuideTab === 'termux' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>Metoda 4: Kompilacja bezpośrednio na telefonie (Termux)</span>
            </h2>

            <p className="text-xs text-slate-300">
              Jeśli nie masz komputera, możesz skompilować plik APK bezpośrednio w systemie Android za pomocą emulatora terminala Termux.
            </p>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside pl-1">
              <li>Zainstaluj darmową aplikację <strong>Termux</strong> ze sklepu F-Droid.</li>
              <li>Wypakuj pobrany plik ZIP w pamięci telefonu.</li>
              <li>Wpisz w Termuxie poniższe polecenia:</li>
            </ol>

            <div className="relative">
              <pre className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto leading-5">
                pkg update && pkg install openjdk-17 -y{'\n'}
                cd /sdcard/Download/OpenMontage-Android-Project{'\n'}
                chmod +x gradlew{'\n'}
                ./gradlew assembleDebug
              </pre>
              <button
                onClick={() => copyToClipboard('pkg update && pkg install openjdk-17 -y\ncd /sdcard/Download/OpenMontage-Android-Project\nchmod +x gradlew\n./gradlew assembleDebug', 'cmd-termux')}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
              >
                {copiedCode === 'cmd-termux' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Installation on phone notice */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-200">
            Jak zainstalować skompilowany plik APK na telefonie Android?
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            1. Prześlij plik <code className="text-slate-200 font-mono">app-debug.apk</code> na swój telefon (np. przez kabel USB, Dysk Google lub komunikator Telegram/WhatsApp).<br />
            2. Kliknij w plik w menedżerze plików telefonu.<br />
            3. Jeśli Android zapyta o zgodę, wybierz <strong>„Zezwalaj na instalację z tego źródła”</strong>.<br />
            4. Gotowe! Twoja aplikacja OpenMontage pojawi się na pulpicie telefonu jak każda natywna aplikacja.
          </p>
        </div>
      </div>
    </div>
  );
};
