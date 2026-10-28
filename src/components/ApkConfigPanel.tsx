import React from 'react';
import { ApkConfig } from '../types';
import { Smartphone, Shield, Zap, Sparkles, Sliders, CheckSquare, Square } from 'lucide-react';

interface ApkConfigPanelProps {
  config: ApkConfig;
  onChange: (updated: ApkConfig) => void;
}

export const ApkConfigPanel: React.FC<ApkConfigPanelProps> = ({ config, onChange }) => {
  const updateField = <K extends keyof ApkConfig>(field: K, value: ApkConfig[K]) => {
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
          <h1 className="text-xl font-bold text-white tracking-tight">
            Konfiguracja Pakietu APK / Android Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dostosuj parametry kompilacji, uprawnienia systemowe oraz właściwości kontenera WebView dla projektu OpenMontage.
          </p>
        </div>

        {/* Section 1: Basic Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Tożsamość Aplikacji</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nazwa Aplikacji (Wyświetlana na telefonie)
              </label>
              <input
                type="text"
                value={config.appName}
                onChange={(e) => updateField('appName', e.target.value)}
                placeholder="np. OpenMontage Studio"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Identyfikator Pakietu (Package Name)
              </label>
              <input
                type="text"
                value={config.packageName}
                onChange={(e) => updateField('packageName', e.target.value)}
                placeholder="np. com.mariusz.openmontage"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Musi składać się z co najmniej dwóch segmentów (np. com.nazwa.app).
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Wersja Widoczna (Version Name)
              </label>
              <input
                type="text"
                value={config.versionName}
                onChange={(e) => updateField('versionName', e.target.value)}
                placeholder="1.0.0"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kod Wersji (Version Code)
              </label>
              <input
                type="number"
                min="1"
                value={config.versionCode}
                onChange={(e) => updateField('versionCode', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: SDK Targets & Display */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Wymagania Systemowe i Orientacja Ekranu</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Minimalny Android (Min SDK)
              </label>
              <select
                value={config.minSdk}
                onChange={(e) => updateField('minSdk', parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={24}>Android 7.0 (API 24 - 96% urządzeń)</option>
                <option value={26}>Android 8.0 (API 26)</option>
                <option value={29}>Android 10 (API 29)</option>
                <option value={33}>Android 13 (API 33)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Docelowy Android (Target SDK)
              </label>
              <select
                value={config.targetSdk}
                onChange={(e) => updateField('targetSdk', parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value={34}>Android 14 (API 34 - Rekomendowany)</option>
                <option value={35}>Android 15 (API 35)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Orientacja Ekranu
              </label>
              <select
                value={config.orientation}
                onChange={(e) => updateField('orientation', e.target.value as 'sensor' | 'portrait' | 'landscape')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="sensor">Automatyczna (Czujnik obrotu)</option>
                <option value="portrait">Pionowa (Portrait)</option>
                <option value="landscape">Pozioma (Landscape - Montaż wideo)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={config.fullscreen}
                onChange={(e) => updateField('fullscreen', e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="text-xs font-medium text-white block">Tryb Pełnoekranowy (Immersive)</span>
                <span className="text-[11px] text-slate-500">Ukrywa pasek stanu Androida dla maksymalnego obszaru montażu</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={config.hardwareAccelerated}
                onChange={(e) => updateField('hardwareAccelerated', e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="text-xs font-medium text-white block">Akceleracja Sprzętowa GPU</span>
                <span className="text-[11px] text-slate-500">Płynne renderowanie Canvas i odtwarzanie klipów 60 FPS</span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Android Permissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Uprawnienia Systemowe w AndroidManifest.xml</span>
          </div>

          <p className="text-xs text-slate-400">
            Wybierz uprawnienia, których wymaga Twój projekt OpenMontage (np. nagrywanie wideo, mikrofon lub dostęp do galerii plików w telefonie):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              onClick={() => updateField('allowCameraAccess', !config.allowCameraAccess)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {config.allowCameraAccess ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Aparat (android.permission.CAMERA)</span>
                <span className="text-[11px] text-slate-500">Umożliwia nagrywanie wideo bezpośrednio do osi czasu OpenMontage</span>
              </div>
            </div>

            <div
              onClick={() => updateField('allowAudioRecord', !config.allowAudioRecord)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {config.allowAudioRecord ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Mikrofon (RECORD_AUDIO)</span>
                <span className="text-[11px] text-slate-500">Pozwala nagrywać lektora (voice-over) lub dźwięk otoczenia</span>
              </div>
            </div>

            <div
              onClick={() => updateField('allowExternalStorage', !config.allowExternalStorage)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {config.allowExternalStorage ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Dostęp do Pamięci & Galerii (READ_MEDIA_VIDEO)</span>
                <span className="text-[11px] text-slate-500">Wybieranie plików wideo i zdjęć użytkownika z pamięci urządzenia</span>
              </div>
            </div>

            <div
              onClick={() => updateField('allowInternet', !config.allowInternet)}
              className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {config.allowInternet ? (
                <CheckSquare className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              )}
              <div>
                <span className="text-xs font-medium text-white block">Dostęp do Internetu (INTERNET)</span>
                <span className="text-[11px] text-slate-500">Pobieranie zewnętrznych fontów, muzyki lub synchronizacja w chmurze</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Web Engine & Storage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Ustawienia Silnika WebView</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableDomStorage}
                onChange={(e) => updateField('enableDomStorage', e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="text-xs font-medium text-white block">Obsługa localStorage & IndexedDB</span>
                <span className="text-[11px] text-slate-500">Zapisywanie projektów montażu w pamięci podręcznej telefonu</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableJavascript}
                onChange={(e) => updateField('enableJavascript', e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="text-xs font-medium text-white block">Włącz JavaScript w WebView</span>
                <span className="text-[11px] text-slate-500">Wymagane do działania interaktywnych skryptów OpenMontage</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
