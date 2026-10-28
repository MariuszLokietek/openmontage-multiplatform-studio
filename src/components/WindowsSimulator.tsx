import React, { useState, useMemo } from 'react';
import { ProjectFile, ExeConfig } from '../types';
import { Minus, Square, X, RefreshCw, Maximize2, Monitor, HardDrive, Check } from 'lucide-react';

interface WindowsSimulatorProps {
  files: ProjectFile[];
  config: ExeConfig;
}

export const WindowsSimulator: React.FC<WindowsSimulatorProps> = ({ files, config }) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Bundle files into executable HTML
  const bundledHtml = useMemo(() => {
    const indexFile = files.find(f => f.name.toLowerCase() === 'index.html') || files[0];
    if (!indexFile) {
      return '<html><body style="background:#090d16;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">Brak pliku index.html</body></html>';
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

  const showDesktopToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top simulator toolbar */}
      <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>Symulator Aplikacji Windows 11</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {config.exeName} · x64 · Akceleracja GPU DirectX
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showDesktopToast('Wywołano natywne okno wyboru plików Windows (dialog.showOpenDialog)')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            <span>Testuj Dialog Windows</span>
          </button>

          <button
            onClick={() => setReloadKey(k => k + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Odśwież okno aplikacji (Ctrl+R)"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
            title={isMaximized ? 'Przywróć okno' : 'Maksymalizuj okno'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Windows 11 Desktop Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-950 relative">
        {/* Windows 11 Window Frame */}
        <div
          style={{
            width: isMaximized ? '100%' : 'min(1180px, 95%)',
            height: isMaximized ? '100%' : 'min(720px, 92%)',
          }}
          className={`flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700/80 transition-all duration-200 relative ${
            isMaximized ? 'rounded-none border-none' : ''
          }`}
        >
          {/* Windows 11 Title Bar */}
          <div className="h-9 bg-slate-900 border-b border-slate-800 flex items-center justify-between select-none px-3 shrink-0">
            {/* Left: Window Icon + Title */}
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-4 h-4 rounded bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-[10px] text-sky-300 font-bold">
                M
              </div>
              <span className="text-xs text-slate-200 font-medium truncate">
                {config.appName} — [Projekt OpenMontage]
              </span>
            </div>

            {/* Right: Windows 11 Window Controls */}
            <div className="flex items-center h-full -mr-3">
              <button
                onClick={() => showDesktopToast('Zminimalizowano okno do paska zadań')}
                className="w-11 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Minimalizuj"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-11 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isMaximized ? 'Przywróć okno' : 'Maksymalizuj'}
              >
                <Square className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => showDesktopToast('Zamknięto aplikację Windows (app.quit)')}
                className="w-11 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600 transition-colors"
                title="Zamknij"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Windows Classic Menu Bar */}
          <div className="h-7 bg-slate-900/90 border-b border-slate-800/80 px-3 flex items-center gap-4 text-xs text-slate-300 select-none shrink-0 relative">
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
                className="hover:text-white hover:bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
              >
                Plik
              </button>
              {activeMenu === 'file' && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs text-slate-200 divide-y divide-slate-800">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        showDesktopToast('Otwarto okno wyboru wideo...');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-sky-600 hover:text-white flex justify-between"
                    >
                      <span>Importuj klip wideo</span>
                      <span className="text-[10px] text-slate-400">Ctrl+O</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        showDesktopToast('Zapisano projekt montażu!');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-sky-600 hover:text-white flex justify-between"
                    >
                      <span>Zapisz projekt</span>
                      <span className="text-[10px] text-slate-400">Ctrl+S</span>
                    </button>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveMenu(null);
                        showDesktopToast('Zakończono program');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white flex justify-between"
                    >
                      <span>Zakończ</span>
                      <span className="text-[10px] text-slate-400">Alt+F4</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => showDesktopToast('Wybrano menu Edycja')}
              className="hover:text-white hover:bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
            >
              Edycja
            </button>
            <button
              onClick={() => showDesktopToast('Wybrano menu Widok')}
              className="hover:text-white hover:bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
            >
              Widok
            </button>
            <button
              onClick={() => showDesktopToast('Wybrano menu Odtwarzanie')}
              className="hover:text-white hover:bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
            >
              Montaż
            </button>
            <button
              onClick={() => showDesktopToast(`${config.appName} v${config.version} dla Windows x64`)}
              className="hover:text-white hover:bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
            >
              Pomoc
            </button>
          </div>

          {/* Window Client Area: The live OpenMontage app */}
          <div className="flex-1 w-full bg-slate-950 relative overflow-hidden">
            <iframe
              key={reloadKey}
              srcDoc={bundledHtml}
              title="OpenMontage Windows Execution"
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
              className="w-full h-full border-none"
            />

            {/* Desktop Notification Toast */}
            {notification && (
              <div className="absolute bottom-4 right-4 bg-slate-900 border border-sky-500/50 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                <Check className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{notification}</span>
              </div>
            )}
          </div>

          {/* Windows Status Bar */}
          <div className="h-6 bg-slate-900 border-t border-slate-800 px-3 flex items-center justify-between text-[11px] text-slate-400 select-none shrink-0 font-mono">
            <span>Gotowy</span>
            <div className="flex items-center gap-4">
              <span>Renderer: DirectX 12 / WebGL 2.0</span>
              <span className="text-emerald-400 font-semibold">60 FPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
