import React from 'react';
import { MacConfig } from '../types';
import { Apple, Cpu, ShieldCheck, Sliders, CheckSquare, Square } from 'lucide-react';

interface MacConfigPanelProps {
  config: MacConfig;
  onChange: (updated: MacConfig) => void;
}

export const MacConfigPanel: React.FC<MacConfigPanelProps> = ({ config, onChange }) => {
  const updateField = <K extends keyof MacConfig>(field: K, value: MacConfig[K]) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Apple className="w-5 h-5 text-slate-200" />
            <span>Konfiguracja Pakietu Apple macOS (.DMG / .APP)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dostosuj parametry kompilacji dla komputerów Mac z procesorami Apple Silicon (M1, M2, M3, M4) oraz Intel.
          </p>
        </div>

        {/* Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Apple className="w-4 h-4 text-slate-200" />
            <span>Tożsamość Aplikacji macOS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nazwa Programu (Wyświetlana w Docku i pasku menu)
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => updateField('appName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Identyfikator Apple Bundle ID
              </label>
              <input
                type="text"
                value={config.bundleId}
                onChange={(e) => updateField('bundleId', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Wersja Programu
              </label>
              <input
                type="text"
                value={config.version}
                onChange={(e) => updateField('version', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nazwa Pliku Obrazu Dysku (.DMG)
              </label>
              <input
                type="text"
                value={config.dmgName}
                onChange={(e) => updateField('dmgName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Architecture & Entitlements */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Architektura Procesora i Uprawnienia Apple Entitlements</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Docelowa Architektura Mac
              </label>
              <select
                value={config.architecture}
                onChange={(e) => updateField('architecture', e.target.value as MacConfig['architecture'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="universal">Uniwersalny Pakiet Binarny (Apple Silicon M1-M4 + Intel x64)</option>
                <option value="arm64">Apple Silicon (M1 / M2 / M3 / M4)</option>
                <option value="x64">Intel (Tylko procesory Intel x64)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Styl Paska Tytułu Okna
              </label>
              <select
                value={config.titleBarStyle}
                onChange={(e) => updateField('titleBarStyle', e.target.value as 'hiddenInset' | 'default')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="hiddenInset">Nowoczesny styl macOS (Kontrolki wkomponowane w treść)</option>
                <option value="default">Klasyczny pasek tytułu okna</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => updateField('cameraAccess', !config.cameraAccess)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700"
            >
              {config.cameraAccess ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Dostęp do Kamery FaceTime</span>
                <span className="text-[11px] text-slate-500">Uprawnienie com.apple.security.device.camera</span>
              </div>
            </div>

            <div
              onClick={() => updateField('microphoneAccess', !config.microphoneAccess)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700"
            >
              {config.microphoneAccess ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Dostęp do Mikrofonu</span>
                <span className="text-[11px] text-slate-500">Nagrywanie głosu i dźwięku otoczenia do montażu</span>
              </div>
            </div>

            <div
              onClick={() => updateField('hardwareAcceleration', !config.hardwareAcceleration)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700"
            >
              {config.hardwareAcceleration ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Akceleracja Metal / GPU</span>
                <span className="text-[11px] text-slate-500">Wykorzystuje silnik graficzny Apple Metal dla 60 FPS</span>
              </div>
            </div>

            <div
              onClick={() => updateField('hardenedRuntime', !config.hardenedRuntime)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700"
            >
              {config.hardenedRuntime ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Środowisko Hardened Runtime</span>
                <span className="text-[11px] text-slate-500">Wymagane do notaryzacji przez Apple Gatekeeper</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
