import React, { useState } from 'react';
import { GitBranch, ExternalLink, Copy, Check, Lock, Globe, Share2, Sparkles, AlertCircle, X } from 'lucide-react';

interface GitHubPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedAppUrl?: string;
}

export const GitHubPublishModal: React.FC<GitHubPublishModalProps> = ({
  isOpen,
  onClose,
  sharedAppUrl = window.location.href,
}) => {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState('openmontage-multiplatform-studio');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ repoUrl: string; cloneUrl: string; owner: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Wprowadź swój token GitHub Personal Access Token.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/github-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          repoName: repoName.trim(),
          isPrivate,
          description: 'OpenMontage MultiPlatform Studio - Kompilator aplikacji na Windows (.EXE), Android (.APK), Mac (.DMG) i iOS (.IPA)',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Nie udało się utworzyć repozytorium na GitHubie.');
      }

      setSuccessResult(data);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message || 'Wystąpił błąd podczas publikacji.');
    } finally {
      setLoading(false);
    }
  };

  const copyLiveLink = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyGitCommands = () => {
    const cmds = `git remote add origin https://github.com/TWÓJ_LOGIN/${repoName}.git\ngit branch -M main\ngit push -u origin main`;
    navigator.clipboard.writeText(cmds);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Publikacja na GitHub & Udostępnianie</h2>
              <p className="text-[11px] text-slate-400">
                Utwórz publiczne repozytorium, aby inni mogli pobierać i uruchamiać aplikację
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Share Link Banner */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/80 to-slate-900 rounded-xl border border-indigo-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>Twoja Aplikacja jest już AKTYWNA w Internecie!</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Inni użytkownicy mogą natychmiast korzystać ze studia w przeglądarce bez instalacji:
              </p>
              <code className="text-[11px] font-mono text-indigo-200 block truncate max-w-md">
                {sharedAppUrl}
              </code>
            </div>

            <button
              onClick={copyLiveLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Skopiowano!' : 'Kopiuj Link Aplikacji'}</span>
            </button>
          </div>

          {/* Success state if published */}
          {successResult ? (
            <div className="p-5 bg-emerald-950/50 border border-emerald-800/60 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Repozytorium GitHub zostało pomyślnie utworzone i zsynchronizowane!</span>
              </div>
              <p className="text-xs text-slate-300">
                Wszystkie pliki aplikacji, konfiguracje budowy oraz automatyczne workflow GitHub Actions dla systemów Windows, Android, Mac i iOS znajdują się pod adresem:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 break-all">
                {successResult.repoUrl}
              </div>
              <div className="pt-2 flex gap-3">
                <a
                  href={successResult.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Otwórz Repozytorium na GitHub</span>
                </a>
                <button
                  onClick={() => setSuccessResult(null)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Wróć do formularza
                </button>
              </div>
            </div>
          ) : (
            /* Automated GitHub Form */
            <form onSubmit={handlePublish} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Automatyczne Utworzenie Repozytorium na Twoim Koncie GitHub
                </h3>
                <span className="text-[10px] text-slate-500">API GitHub REST</span>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      GitHub Personal Access Token (PAT)
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=OpenMontage+Studio"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      Wygeneruj token na GitHubie (10 sek) <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Wymagane uprawnienie: <strong>repo</strong> (służy wyłącznie do utworzenia repozytorium i jednorazowego wypchnięcia kodu).
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nazwa Repozytorium
                    </label>
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="openmontage-multiplatform-studio"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Widoczność Repozytorium
                    </label>
                    <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsPrivate(false)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                          !isPrivate ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Globe className="w-3 h-3 text-emerald-400" />
                        <span>Publiczne</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPrivate(true)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                          isPrivate ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Prywatne</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>{loading ? 'Tworzenie repozytorium i wysyłanie kodu...' : 'Utwórz Repozytorium i Wyślij Kod na GitHub'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Manual CLI option */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Alternatywnie: Wypchnij z własnego terminala
              </span>
              <button
                onClick={copyGitCommands}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Skopiowano' : 'Kopiuj komendy'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-5">
              git remote add origin https://github.com/TWÓJ_LOGIN/{repoName}.git{'\n'}
              git branch -M main{'\n'}
              git push -u origin main
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
