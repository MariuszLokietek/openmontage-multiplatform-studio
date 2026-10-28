import React, { useState, useMemo } from 'react';
import { ProjectFile, ApkConfig } from '../types';
import { RotateCw, RefreshCw, Smartphone, Tablet, Wifi, Battery, Maximize2 } from 'lucide-react';

interface DeviceSimulatorProps {
  files: ProjectFile[];
  config: ApkConfig;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({ files, config }) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet'>('phone');
  const [reloadKey, setReloadKey] = useState(0);

  // Bundle files into an executable HTML document
  const bundledHtml = useMemo(() => {
    const indexFile = files.find(f => f.name.toLowerCase() === 'index.html') || files[0];
    if (!indexFile) {
      return '<html><body style="background:#111;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">Brak pliku index.html</body></html>';
    }

    let html = indexFile.content;

    // Inject inline styles for linked stylesheets
    const cssFiles = files.filter(f => f.name.endsWith('.css'));
    for (const css of cssFiles) {
      const linkRegex = new RegExp(`<link[^>]*href=["'](?:\\./)?${css.name}["'][^>]*>`, 'gi');
      html = html.replace(linkRegex, `<style>${css.content}</style>`);
    }

    // Inject inline scripts for linked JS files
    const jsFiles = files.filter(f => f.name.endsWith('.js'));
    for (const js of jsFiles) {
      const scriptRegex = new RegExp(`<script[^>]*src=["'](?:\\./)?${js.name}["'][^>]*>\\s*</script>`, 'gi');
      html = html.replace(scriptRegex, `<script>${js.content}</script>`);
    }

    return html;
  }, [files, reloadKey]);

  const isPortrait = orientation === 'portrait';
  const width = deviceType === 'phone' ? (isPortrait ? 375 : 667) : (isPortrait ? 600 : 800);
  const height = deviceType === 'phone' ? (isPortrait ? 760 : 375) : (isPortrait ? 800 : 540);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top simulator toolbar */}
      <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <span>Symulator Androida</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {width} × {height} px ({isPortrait ? 'Pion' : 'Poziom'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceType('phone')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceType === 'phone' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Smartfon"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceType('tablet')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceType === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Orientation switch */}
          <button
            onClick={() => setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Obróć Ekran</span>
          </button>

          {/* Refresh iframe */}
          <button
            onClick={() => setReloadKey(k => k + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Przeładuj aplikację w telefonie"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator Stage */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-radial from-slate-900 to-slate-950">
        <div
          style={{ width: `${width}px`, height: `${height}px` }}
          className="relative transition-all duration-300 ease-out bg-black rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 flex flex-col"
        >
          {/* Phone Speaker & Punch hole Camera */}
          {isPortrait && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full border border-slate-800 z-30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-indigo-950 rounded-full"></div>
            </div>
          )}

          {/* Android Status Bar */}
          <div className="h-6 w-full px-5 flex items-center justify-between text-[11px] text-slate-300 select-none z-20 shrink-0 font-mono">
            <span>12:00</span>
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-slate-400" />
              <Battery className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>

          {/* App Screen / IFrame */}
          <div className="flex-1 w-full bg-slate-950 rounded-[28px] overflow-hidden relative shadow-inner">
            <iframe
              key={reloadKey}
              srcDoc={bundledHtml}
              title="OpenMontage Android Simulation"
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
              className="w-full h-full border-none"
            />
          </div>

          {/* Android Home Gesture Indicator Bar */}
          <div className="h-4 w-full flex items-center justify-center shrink-0">
            <div className="w-24 h-1 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
