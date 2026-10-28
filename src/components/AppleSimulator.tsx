import React, { useState, useMemo } from 'react';
import { ProjectFile, MacConfig, IosConfig } from '../types';
import { RotateCw, RefreshCw, Smartphone, Tablet, Apple, Maximize2, Wifi, Battery } from 'lucide-react';

interface AppleSimulatorProps {
  files: ProjectFile[];
  macConfig: MacConfig;
  iosConfig: IosConfig;
  subType: 'mac' | 'ios';
}

export const AppleSimulator: React.FC<AppleSimulatorProps> = ({
  files,
  macConfig,
  iosConfig,
  subType,
}) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [deviceModel, setDeviceModel] = useState<'iphone' | 'ipad'>('iphone');

  const bundledHtml = useMemo(() => {
    const indexFile = files.find(f => f.name.toLowerCase() === 'index.html') || files[0];
    if (!indexFile) {
      return '<html><body style="background:#090d16;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:-apple-system,sans-serif;">Brak pliku index.html</body></html>';
    }

    let html = indexFile.content;

    const cssFiles = files.filter(f => f.name.endsWith('.css'));
    for (const css of cssFiles) {
      const linkRegex = new RegExp(`<link[^>]*href=["'](?:\\./)?${css.name}["'][^>]*>`, 'gi');
      html = html.replace(linkRegex, `<style>${css.content}</style>`);
    }

    const jsFiles = files.filter(f => f.name.endsWith('.js'));
    for (const js of jsFiles) {
      const scriptRegex = new RegExp(`<script[^>]*src=["'](?:\\./)?${js.name}["'][^>]*>\\s*</script>`, 'gi');
      html = html.replace(scriptRegex, `<script>${js.content}</script>`);
    }

    return html;
  }, [files, reloadKey]);

  const isPortrait = orientation === 'portrait';
  const phoneWidth = deviceModel === 'iphone' ? (isPortrait ? 385 : 780) : (isPortrait ? 620 : 860);
  const phoneHeight = deviceModel === 'iphone' ? (isPortrait ? 780 : 385) : (isPortrait ? 820 : 580);

  if (subType === 'mac') {
    return (
      <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
        {/* macOS Toolbar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
              <Apple className="w-4 h-4 text-slate-200" />
              <span>Symulator Apple macOS (Sonoma / Sequoia)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {macConfig.appName} · Apple Silicon M1-M4 (Metal 3)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReloadKey(k => k + 1)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Przeładuj okno (Cmd+R)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* macOS Window Canvas */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-950">
          <div className="w-[min(1180px,96%)] h-[min(720px,92%)] flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 ring-1 ring-white/10">
            {/* macOS Titlebar with Traffic Lights */}
            <div className="h-10 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between px-4 select-none shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer" title="Zamknij" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer" title="Minimalizuj" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer" title="Pełny ekran" />
              </div>

              <div className="text-xs text-slate-300 font-medium">
                {macConfig.appName}
              </div>

              <div className="w-14"></div>
            </div>

            {/* macOS System Menu Bar */}
            <div className="h-6 bg-slate-950/60 border-b border-slate-800/80 px-4 flex items-center gap-4 text-[11px] text-slate-400 select-none shrink-0">
              <span className="font-bold text-slate-200"></span>
              <span className="font-semibold text-slate-200">{macConfig.appName}</span>
              <span>Plik</span>
              <span>Edycja</span>
              <span>Widok</span>
              <span>Montaż</span>
              <span>Okno</span>
              <span>Pomoc</span>
            </div>

            {/* Content App Frame */}
            <div className="flex-1 w-full bg-slate-950 relative overflow-hidden">
              <iframe
                key={reloadKey}
                srcDoc={bundledHtml}
                title="OpenMontage macOS App"
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // iOS iPhone Simulator
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* iOS Toolbar */}
      <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Symulator Apple iPhone 16 Pro (iOS 18)</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {phoneWidth} × {phoneHeight} px ({isPortrait ? 'Pion' : 'Poziom'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceModel('iphone')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceModel === 'iphone' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="iPhone 16 Pro"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceModel('ipad')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceModel === 'ipad' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="iPad Pro"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Obróć Ekran</span>
          </button>

          <button
            onClick={() => setReloadKey(k => k + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Przeładuj aplikację"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* iPhone 16 Pro Chassis */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-950">
        <div
          style={{ width: `${phoneWidth}px`, height: `${phoneHeight}px` }}
          className="relative transition-all duration-300 ease-out bg-black rounded-[50px] p-3 shadow-2xl border-[5px] border-slate-700 ring-1 ring-white/20 flex flex-col"
        >
          {/* iOS Dynamic Island */}
          {isPortrait && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-between px-3.5 border border-slate-900 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-950/60 border border-indigo-700/40"></div>
            </div>
          )}

          {/* iOS Status Bar */}
          <div className="h-6 w-full px-7 flex items-center justify-between text-[11px] text-white select-none z-20 shrink-0 font-medium">
            <span>9:41</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3 h-3 text-white" />
              <Battery className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 w-full bg-slate-950 rounded-[38px] overflow-hidden relative shadow-inner">
            <iframe
              key={reloadKey}
              srcDoc={bundledHtml}
              title="OpenMontage iOS iPhone App"
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
              className="w-full h-full border-none"
            />
          </div>

          {/* Bottom iOS Home Indicator */}
          <div className="h-4 w-full flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
