import React from 'react';
import { IosConfig } from '../types';
import { Smartphone, Shield, Video, Sliders, CheckSquare, Square } from 'lucide-react';

interface IosConfigPanelProps {
  config: IosConfig;
  onChange: (updated: IosConfig) => void;
}

export const IosConfigPanel: React.FC<IosConfigPanelProps> = ({ config, onChange }) => {
  const updateField = <K extends keyof IosConfig>(field: K, value: IosConfig[K]) => {
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
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <span>Konfiguracja Pakietu Apple iOS (iPhone & iPad)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ustawienia projektu Xcode, uprawnienia prywatności Info.plist oraz parametry silnika WKWebView dla systemu iOS.
          </p>
        </div>

        {/* Basic iOS Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Identyfikator i Wersja iOS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nazwa Aplikacji (Wyświetlana pod ikoną na ekranie początkowym)
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => updateField('appName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Bundle Identifier (np. com.twojanazwa.openmontage)
              </label>
              <input
                type="text"
                value={config.bundleId}
                onChange={(e) => updateField('bundleId', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Wersja Widoczna (CFBundleShortVersionString)
              </label>
              <input
                type="text"
                value={config.version}
                onChange={(e) => updateField('version', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Numer Kompilacji (CFBundleVersion / Build)
              </label>
              <input
                type="number"
                min="1"
                value={config.buildNumber}
                onChange={(e) => updateField('buildNumber', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Target Devices & iOS versions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Rodzina Urządzeń i Minimalna Wersja iOS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Obsługiwane Urządzenia Apple
              </label>
              <select
                value={config.targetDevice}
                onChange={(e) => updateField('targetDevice', e.target.value as IosConfig['targetDevice'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="universal">iPhone & iPad (Aplikacja Uniwersalna)</option>
                <option value="iphone">Tylko iPhone</option>
                <option value="ipad">Tylko iPad</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Minimalna Wersja Systemu iOS
              </label>
              <select
                value={config.minIosVersion}
                onChange={(e) => updateField('minIosVersion', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="16.0">iOS 16.0 (Wspiera iPhone 8, X, 11 i nowsze)</option>
                <option value="17.0">iOS 17.0 (Wspiera iPhone XR/11 i nowsze)</option>
                <option value="18.0">iOS 18.0 (Najnowszy standard Apple)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Apple Required Privacy Permissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Wymagane Komunikaty Prywatności Apple (Info.plist)</span>
          </div>
          <p className="text-xs text-slate-400">
            Firma Apple wymaga, aby każda aplikacja korzystająca z aparatu, mikrofonu lub galerii zdjęć posiadała czytelne uzasadnienie dla użytkownika:
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Aparat (NSCameraUsageDescription)
              </label>
              <input
                type="text"
                value={config.cameraUsageDescription}
                onChange={(e) => updateField('cameraUsageDescription', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mikrofon (NSMicrophoneUsageDescription)
              </label>
              <input
                type="text"
                value={config.microphoneUsageDescription}
                onChange={(e) => updateField('microphoneUsageDescription', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Zdjęcia & Wideo (NSPhotoLibraryUsageDescription)
              </label>
              <input
                type="text"
                value={config.photoLibraryUsageDescription}
                onChange={(e) => updateField('photoLibraryUsageDescription', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Media & Video Playback */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Video className="w-4 h-4 text-sky-400" />
            <span>Odtwarzanie Wideo i Oś Czasu na iOS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => updateField('allowsInlinePlayback', !config.allowsInlinePlayback)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700"
            >
              {config.allowsInlinePlayback ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Inline Video Playback</span>
                <span className="text-[11px] text-slate-500">Zapobiega wymuszonemu wyskakiwaniu wideo w natywnym odtwarzaczu Apple</span>
              </div>
            </div>

            <div
              onClick={() => updateField('requiresFullScreen', !config.requiresFullScreen)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700"
            >
              {config.requiresFullScreen ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Tryb Pełnoekranowy (Immersive)</span>
                <span className="text-[11px] text-slate-500">Optymalne wykorzystanie całego ekranu iPhone'a bez pasków nawigacji</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
