import React, { useState } from 'react';
import { ProjectFile, ExeConfig, ApkConfig, TargetPlatform, AiDiagnosticResult } from '../types';
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Code, RefreshCw, Monitor, Smartphone } from 'lucide-react';

interface AiDiagnosticsProps {
  files: ProjectFile[];
  targetPlatform: TargetPlatform;
  exeConfig: ExeConfig;
  apkConfig: ApkConfig;
}

export const AiDiagnostics: React.FC<AiDiagnosticsProps> = ({
  files,
  targetPlatform,
  exeConfig,
  apkConfig,
}) => {
  const [result, setResult] = useState<AiDiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isWin = targetPlatform === 'windows';

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const filePayload = files.slice(0, 10).map(f => ({
        name: f.name,
        size: f.size,
        preview: f.isBinary ? '[Plik binarny]' : f.content.slice(0, 1000),
      }));

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: filePayload,
          config: isWin
            ? {
                targetPlatform: 'windows',
                appName: exeConfig.appName,
                exeName: exeConfig.exeName,
                installerType: exeConfig.installerType,
                architecture: exeConfig.architecture,
                hardwareAcceleration: exeConfig.hardwareAcceleration,
              }
            : {
                targetPlatform: 'android',
                packageName: apkConfig.packageName,
                versionName: apkConfig.versionName,
                permissions: [
                  apkConfig.allowCameraAccess && 'CAMERA',
                  apkConfig.allowAudioRecord && 'RECORD_AUDIO',
                  apkConfig.allowExternalStorage && 'READ_MEDIA_VIDEO',
                  apkConfig.allowInternet && 'INTERNET',
                ].filter(Boolean),
              },
        }),
      });

      if (!res.ok) throw new Error('Nie udało się połączyć z usługą analizy');
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      console.error(err);
      setError('Wystąpił problem podczas analizy projektu. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>AI Doktor Zgodności z {isWin ? 'Windows (EXE)' : 'Android (APK)'}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automatyczna analiza kodu OpenMontage pod kątem architektury {isWin ? 'desktopowej Windows 10/11 i silnika Electron' : 'Android WebView i kompilacji APK'}.
            </p>
          </div>

          <button
            onClick={runAnalysis}
            disabled={loading || files.length === 0}
            className={`flex items-center gap-2 px-4 py-2 ${
              isWin ? 'bg-sky-600 hover:bg-sky-500' : 'bg-indigo-600 hover:bg-indigo-500'
            } disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0`}
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{loading ? 'Analizowanie...' : 'Rozpocznij Badanie Projektu'}</span>
          </button>
        </div>

        {/* Not run yet state */}
        {!result && !loading && !error && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-3">
            <div className={`w-12 h-12 rounded-full ${isWin ? 'bg-sky-950 text-sky-400 border-sky-800/40' : 'bg-indigo-950 text-indigo-400 border-indigo-800/40'} flex items-center justify-center mx-auto border`}>
              {isWin ? <Monitor className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
            </div>
            <h3 className="text-sm font-semibold text-white">Gotowy do zbadania Twojego projektu pod Windows</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              AI sprawdzi w plikach OpenMontage: obsługę odtwarzania wideo z dysków lokalnych, akcelerację GPU DirectX, obsługę skrótów klawiszowych Windows oraz konfigurację instalatora NSIS.
            </p>
            <div className="pt-2">
              <button
                onClick={runAnalysis}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Uruchom Diagnostykę
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-4">
            <div className={`w-10 h-10 border-2 ${isWin ? 'border-sky-500' : 'border-indigo-500'} border-t-transparent rounded-full animate-spin mx-auto`}></div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-white">Analizowanie plików źródłowych OpenMontage...</p>
              <p className="text-[11px] text-slate-400">
                Weryfikowanie zgodności z systemem Windows, bibliotekami wideo i instalatorem EXE
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-4 text-xs text-rose-300 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={runAnalysis}
              className="text-white underline hover:no-underline font-medium"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Score & Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1">
                <span className={`text-xs font-semibold ${isWin ? 'text-sky-400' : 'text-indigo-400'} uppercase tracking-wider block`}>
                  Podsumowanie Zgodności z Windows
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {result.summary}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center min-w-[140px] shrink-0">
                <span className="text-[11px] text-slate-400 block mb-1">Ocena Gotowości</span>
                <div className={`text-3xl font-extrabold ${isWin ? 'text-sky-400' : 'text-indigo-400'} font-mono tabular-nums`}>
                  {result.compatibilityScore}%
                </div>
                <span className="text-[10px] text-emerald-400 font-medium">Gotowy do Kompilacji EXE</span>
              </div>
            </div>

            {/* Positives & Potential Issues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mocne Strony Projektu</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {result.positives?.map((pos, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{pos}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Kwestie do Zwrócenia Uwagi</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {result.potentialIssues?.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0">!</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
                <Lightbulb className="w-4 h-4 text-sky-400" />
                <span>Rekomendacje Optymalizacyjne</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.recommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-sky-400 shrink-0">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Config snippet if present */}
            {result.configSnippet && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Code className="w-4 h-4 text-slate-400" />
                  <span>Sugerowany Fragment Konfiguracji Windows</span>
                </div>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto">
                  {result.configSnippet}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
