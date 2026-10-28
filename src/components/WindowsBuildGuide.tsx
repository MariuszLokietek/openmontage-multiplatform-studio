import React, { useState } from 'react';
import { ExeConfig } from '../types';
import { Terminal, Copy, Check, Cloud, Monitor, Cpu, Download, ExternalLink, HardDrive, ShieldCheck } from 'lucide-react';

interface WindowsBuildGuideProps {
  config: ExeConfig;
  onDownloadProject: () => void;
}

export const WindowsBuildGuide: React.FC<WindowsBuildGuideProps> = ({ config, onDownloadProject }) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'cloud' | 'bat' | 'terminal' | 'inno'>('cloud');
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
              <Monitor className="w-5 h-5 text-sky-400" />
              <span>Instrukcja Kompilacji do Pliku Instalatora Windows (.EXE)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Jak przekształcić spakowany projekt OpenMontage w gotowy plik instalacyjny <code className="text-sky-300 font-mono">{config.installerName}</code> dla Windows 10 i 11.
            </p>
          </div>

          <button
            onClick={onDownloadProject}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pobierz Paczkę Projektu Windows (.zip)</span>
          </button>
        </div>

        {/* Overview Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-400">
            Architektura Aplikacji Windows (.EXE) dla OpenMontage
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aplikacje OpenMontage (HTML5, Canvas, skrypty montażu, kodeki audio-wideo) na systemie Windows są uruchamiane w natywnym kontenerze <strong>Electron & Chromium z akceleracją sprzętową DirectX</strong>.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dzięki temu Twoja aplikacja zyskuje bezpośredni dostęp do dysków komputera (C:, D:, pendrive), natywny pasek menu Windows, możliwość wyboru plików z Eksploratora Windows oraz profesjonalny instalator <strong>NSIS / Inno Setup</strong> ze skrótami na Pulpicie i w Menu Start.
          </p>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveGuideTab('cloud')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeGuideTab === 'cloud'
                ? 'bg-sky-950/60 border-sky-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cloud className="w-4 h-4 text-sky-400 mb-1.5" />
            <div className="text-xs font-semibold">1. Chmura GitHub</div>
            <div className="text-[10px] opacity-75">Bez instalowania niczego</div>
          </button>

          <button
            onClick={() => setActiveGuideTab('bat')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeGuideTab === 'bat'
                ? 'bg-sky-950/60 border-sky-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-sky-400 mb-1.5" />
            <div className="text-xs font-semibold">2. Skrypt build.bat</div>
            <div className="text-[10px] opacity-75">1 kliknięcie na Windows</div>
          </button>

          <button
            onClick={() => setActiveGuideTab('terminal')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeGuideTab === 'terminal'
                ? 'bg-sky-950/60 border-sky-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-4 h-4 text-sky-400 mb-1.5" />
            <div className="text-xs font-semibold">3. Wiersz Poleceń</div>
            <div className="text-[10px] opacity-75">PowerShell / CMD</div>
          </button>

          <button
            onClick={() => setActiveGuideTab('inno')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
              activeGuideTab === 'inno'
                ? 'bg-sky-950/60 border-sky-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HardDrive className="w-4 h-4 text-sky-400 mb-1.5" />
            <div className="text-xs font-semibold">4. Inno Setup 6</div>
            <div className="text-[10px] opacity-75">Lekki instalator</div>
          </button>
        </div>

        {/* Tab 1: Cloud GitHub Actions */}
        {activeGuideTab === 'cloud' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cloud className="w-4 h-4 text-sky-400" />
                <span>Metoda 1: Darmowa kompilacja EXE w chmurze (GitHub Actions)</span>
              </h2>
              <span className="text-[11px] text-emerald-400 font-medium">Zalecana (Bez instalacji oprogramowania)</span>
            </div>

            <p className="text-xs text-slate-300">
              W wygenerowanej paczce ZIP dołączony jest gotowy plik <code className="text-sky-300 font-mono">.github/workflows/build-exe.yml</code>. 
              Dzięki niemu darmowe serwery maszyn wirtualnych Windows w chmurze skompilują dla Ciebie plik instalacyjny <code className="text-sky-300 font-mono">.exe</code> w około 2 minuty.
            </p>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside pl-1">
              <li className="leading-relaxed">
                Kliknij przycisk <strong>„Pobierz Paczkę Projektu Windows (.zip)”</strong> w prawym górnym rogu.
              </li>
              <li className="leading-relaxed">
                Otwórz stronę <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline inline-flex items-center gap-1 font-medium">github.com/new <ExternalLink className="w-3 h-3" /></a> i utwórz bezpłatne repozytorium (prywatne lub publiczne).
              </li>
              <li className="leading-relaxed">
                Rozpakuj pobrany plik ZIP i prześlij wszystkie pliki do repozytorium na GitHubie.
              </li>
              <li className="leading-relaxed">
                W swoim repozytorium przejdź do zakładki <strong>Actions</strong> — zobaczysz automatycznie trwający proces <em>„Kompiluj Instalator Windows EXE (OpenMontage)”</em>.
              </li>
              <li className="leading-relaxed">
                Po zakończeniu (zielony ptaszek) wejdź w zakończone zadanie i w sekcji <strong>Artifacts</strong> pobierz gotowy plik:
                <div className="mt-1.5 p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-sky-300">
                  {config.appName.replace(/[^a-zA-Z0-9_-]/g, '')}-Windows-Installers.zip (zawiera plik {config.installerName})
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Tab 2: build.bat */}
        {activeGuideTab === 'bat' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Metoda 2: 1-Kliknięcie na Twoim komputerze z Windows (build.bat)</span>
            </h2>

            <p className="text-xs text-slate-300">
              Wymaganie: Zainstalowany program <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-sky-400 underline font-medium">Node.js (LTS)</a> na komputerze.
            </p>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside pl-1">
              <li className="leading-relaxed">
                Wypakuj pobrany plik ZIP do folderu na dysku (np. <code className="text-slate-200 font-mono">C:\OpenMontage-App</code>).
              </li>
              <li className="leading-relaxed">
                Kliknij dwukrotnie plik:
                <div className="mt-1.5 p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-sky-300">
                  build.bat
                </div>
              </li>
              <li className="leading-relaxed">
                Skrypt automatycznie pobierze pakiety Electron i skompiluje plik instalatora Windows.
              </li>
              <li className="leading-relaxed">
                Gotowy plik <strong className="text-white">{config.installerName}</strong> znajdziesz w podkatalogu:
                <div className="mt-1.5 p-2.5 bg-slate-950 rounded border border-slate-800 font-mono text-emerald-400">
                  dist\{config.installerName}
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Tab 3: Terminal */}
        {activeGuideTab === 'terminal' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>Metoda 3: Wiersz Poleceń (PowerShell / Windows Terminal / CMD)</span>
            </h2>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  1. Instalacja zależności npm:
                </span>
                <div className="relative">
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
                    npm install
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm install', 'cmd-install')}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    {copiedCode === 'cmd-install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  2. Budowa pełnego instalatora Windows NSIS (.exe):
                </span>
                <div className="relative">
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
                    npm run build:win
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm run build:win', 'cmd-build-win')}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    {copiedCode === 'cmd-build-win' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  3. Budowa wersji przenośnej (Portable .exe bez instalacji, idealnej na pendrive):
                </span>
                <div className="relative">
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
                    npm run build:portable
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm run build:portable', 'cmd-build-port')}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    {copiedCode === 'cmd-build-port' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Inno Setup */}
        {activeGuideTab === 'inno' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>Metoda 4: Kompilacja instalatora w programie Inno Setup 6</span>
            </h2>

            <p className="text-xs text-slate-300">
              Inno Setup to najpopularniejszy darmowy kompilator instalatorów Windows o małej wadze pliku wynikowego i klasycznym kreatorze instalacji.
            </p>

            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside pl-1">
              <li>Pobierz i zainstaluj darmowy program <a href="https://jrsoftware.org/isdl.php" target="_blank" rel="noreferrer" className="text-sky-400 underline font-medium">Inno Setup 6</a>.</li>
              <li>Wypakuj pobraną z naszej aplikacji paczkę ZIP.</li>
              <li>Kliknij dwukrotnie plik <code className="text-sky-300 font-mono">installer.iss</code>.</li>
              <li>W oknie Inno Setup Compiler kliknij niebieski przycisk <strong>Compile</strong> (lub naciśnij klawisz F9).</li>
              <li>Gotowy plik instalacyjny zostanie utworzony w katalogu <code className="text-emerald-400 font-mono">dist-inno/</code>.</li>
            </ol>
          </div>
        )}

        {/* Windows Defender SmartScreen notice */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Wskazówka: Komunikat „System Windows ochronił ten komputer” (Microsoft Defender SmartScreen)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Przy pierwszym uruchomieniu świeżo skompilowanego pliku <code className="text-slate-200 font-mono">.exe</code> na nowym komputerze, Windows Defender SmartScreen może wyświetlić niebieskie okienko ostrzegawcze (ponieważ plik nie posiada jeszcze płatnego certyfikatu EV firmy Microsoft).<br />
            <strong>Aby uruchomić aplikację:</strong> kliknij napis <span className="text-white underline">Więcej informacji</span>, a następnie przycisk <span className="text-sky-400 font-semibold">Uruchom mimo to</span>. Aplikacja zainstaluje się normalnie na Twoim komputerze.
          </p>
        </div>
      </div>
    </div>
  );
};
