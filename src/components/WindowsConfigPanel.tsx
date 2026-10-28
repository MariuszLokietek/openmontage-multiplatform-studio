import React from 'react';
import { ExeConfig } from '../types';
import { Monitor, Shield, Zap, Sliders, CheckSquare, Square, HardDrive } from 'lucide-react';

interface WindowsConfigPanelProps {
  config: ExeConfig;
  onChange: (updated: ExeConfig) => void;
}

export const WindowsConfigPanel: React.FC<WindowsConfigPanelProps> = ({ config, onChange }) => {
  const updateField = <K extends keyof ExeConfig>(field: K, value: ExeConfig[K]) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Intro */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Monitor className="w-5 h-5 text-sky-400" />
            <span>Konfiguracja Instalatora i Aplikacji Windows (.EXE)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dostosuj właściwości natywnej aplikacji Windows, parametry instalatora NSIS/Inno Setup oraz flagi wydajnościowe silnika Electron.
          </p>
        </div>

        {/* Section 1: Windows App Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Tożsamość Aplikacji Windows</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nazwa Programu (Wyświetlana w pasku tytułu i Menu Start)
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => updateField('appName', e.target.value)}
                placeholder="np. OpenMontage Studio"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nazwa Pliku Wykonywalnego (.EXE)
              </label>
              <input
                type="text"
                value={config.exeName}
                onChange={(e) => updateField('exeName', e.target.value)}
                placeholder="OpenMontage.exe"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-sky-300 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nazwa Pliku Instalatora (Setup .EXE)
              </label>
              <input
                type="text"
                value={config.installerName}
                onChange={(e) => updateField('installerName', e.target.value)}
                placeholder="OpenMontage_Setup_x64.exe"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Wersja Programu (Version)
              </label>
              <input
                type="text"
                value={config.version}
                onChange={(e) => updateField('version', e.target.value)}
                placeholder="1.0.0"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Wydawca / Producent (Company Name)
              </label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="OpenMontage Community"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Unikalny Identyfikator Aplikacji (App ID / GUID)
              </label>
              <input
                type="text"
                value={config.appId}
                onChange={(e) => updateField('appId', e.target.value)}
                placeholder="com.openmontage.desktop"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Windows Installer & Architecture Options */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Format Instalatora i Architektura Procesora</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Typ Generowanego Pliku Wykonywalnego
              </label>
              <select
                value={config.installerType}
                onChange={(e) => updateField('installerType', e.target.value as ExeConfig['installerType'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="nsis">Instalator NSIS (.exe) — Standard Windows 10/11</option>
                <option value="inno">Instalator Inno Setup 6 (.exe) — Lekki kreator</option>
                <option value="portable">Wersja Przenośna / Portable (.exe) — Bez instalacji</option>
                <option value="both">Komplet: Instalator Setup + Wersja Portable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Docelowa Architektura Windows
              </label>
              <select
                value={config.architecture}
                onChange={(e) => updateField('architecture', e.target.value as ExeConfig['architecture'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="x64">64-bit x64 (Intel & AMD — 99% komputerów PC)</option>
                <option value="arm64">ARM64 (Nowe laptopy Snapdragon X Elite / Surface Pro)</option>
                <option value="ia32">32-bit x86 (Starsze systemy)</option>
                <option value="universal">Wieloplatformowy pakiet instalacyjny</option>
              </select>
            </div>
          </div>

          {/* Desktop & Start Menu Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => updateField('createDesktopShortcut', !config.createDesktopShortcut)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {config.createDesktopShortcut ? (
                <CheckSquare className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Skrót na Pulpicie Windows</span>
                <span className="text-[11px] text-slate-500">Automatycznie dodaje ikonę programu na pulpicie użytkownika</span>
              </div>
            </div>

            <div
              onClick={() => updateField('createStartMenuShortcut', !config.createStartMenuShortcut)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {config.createStartMenuShortcut ? (
                <CheckSquare className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Wpis w Menu Start i Wyszukiwarce</span>
                <span className="text-[11px] text-slate-500">Program pojawia się po wpisaniu nazwy w wyszukiwarkę Windows</span>
              </div>
            </div>

            <div
              onClick={() => updateField('allowMultipleInstances', !config.allowMultipleInstances)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {!config.allowMultipleInstances ? (
                <CheckSquare className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Blokada Podwójnego Uruchomienia (Single Instance)</span>
                <span className="text-[11px] text-slate-500">Gdy program już działa, ponowne kliknięcie aktywuje otwarte okno</span>
              </div>
            </div>

            <div
              onClick={() => updateField('hardwareAcceleration', !config.hardwareAcceleration)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {config.hardwareAcceleration ? (
                <CheckSquare className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Akceleracja GPU (DirectX / Vulkan)</span>
                <span className="text-[11px] text-slate-500">Płynne renderowanie Canvas, osi czasu i filtrów wideo 60 FPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Window Geometry & Local Files */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>Wymiary Okna i Dostęp do Dysków Komputera</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Domyślna Szerokość Okna (px)
              </label>
              <input
                type="number"
                min="800"
                step="20"
                value={config.windowWidth}
                onChange={(e) => updateField('windowWidth', parseInt(e.target.value) || 1280)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Domyślna Wysokość Okna (px)
              </label>
              <input
                type="number"
                min="600"
                step="20"
                value={config.windowHeight}
                onChange={(e) => updateField('windowHeight', parseInt(e.target.value) || 800)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-200 block">Dostęp do plików lokalnych:</span>
            <p>
              Wygenerowany kod Electrona zawiera natywny mostek <code className="text-sky-300 font-mono">window.openMontageDesktop</code>, który pozwala użytkownikom na bezpośrednie otwieranie klipów wideo z dysków komputera (C:, D:, pendrive) oraz zapisywanie gotowych renderów montażu bez ograniczeń sandboxa przeglądarki.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
