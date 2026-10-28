import React from 'react';
import { Download, Sparkles, Monitor, Code2, Settings, Terminal, Smartphone, Apple, GitBranch } from 'lucide-react';
import { ActiveTab, TargetPlatform } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  targetPlatform: TargetPlatform;
  setTargetPlatform: (platform: TargetPlatform) => void;
  fileCount: number;
  isPackaging: boolean;
  onPackageClick: () => void;
  onOpenGitHubModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  targetPlatform,
  setTargetPlatform,
  fileCount,
  isPackaging,
  onPackageClick,
  onOpenGitHubModal,
}) => {
  const getPlatformLabel = () => {
    switch (targetPlatform) {
      case 'windows': return 'Windows .EXE';
      case 'android': return 'Android .APK';
      case 'macos': return 'Apple Mac .DMG';
      case 'ios': return 'iPhone / iOS';
    }
  };

  const getPlatformIcon = () => {
    switch (targetPlatform) {
      case 'windows': return <Monitor className="w-4 h-4 text-white" />;
      case 'android': return <Smartphone className="w-4 h-4 text-white" />;
      case 'macos': return <Apple className="w-4 h-4 text-white" />;
      case 'ios': return <Smartphone className="w-4 h-4 text-white" />;
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-600 to-violet-500 flex items-center justify-center shadow-inner shadow-white/20">
            {getPlatformIcon()}
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            OpenMontage <span className="text-sky-400 font-semibold">Studio</span>
          </span>

          {/* 4-Platform Switcher */}
          <div className="hidden lg:flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 ml-1">
            <button
              onClick={() => setTargetPlatform('windows')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                targetPlatform === 'windows' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Windows .EXE</span>
            </button>
            <button
              onClick={() => setTargetPlatform('android')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                targetPlatform === 'android' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Android .APK</span>
            </button>
            <button
              onClick={() => setTargetPlatform('macos')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                targetPlatform === 'macos' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Apple className="w-3 h-3" />
              <span>Mac .DMG</span>
            </button>
            <button
              onClick={() => setTargetPlatform('ios')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                targetPlatform === 'ios' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>iPhone .IPA</span>
            </button>
          </div>
        </div>

        {/* Zone 2: 4-5 single-line navigation links/tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'files'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Pliki Projektu</span>
            <span className="font-mono tabular-nums text-[11px] text-slate-400">({fileCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'config'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Konfiguracja ({getPlatformLabel().split(' ')[0]})</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Symulator Urządzenia</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-doctor')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'ai-doctor'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Doktor & Zgodność</span>
          </button>

          <button
            onClick={() => setActiveTab('build-guide')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'build-guide'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Poradnik Kompilacji</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenGitHubModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700/80 shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
            title="Utwórz repozytorium GitHub lub udostępnij aplikację online"
          >
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            <span>GitHub / Udostępnij</span>
          </button>

          <button
            onClick={onPackageClick}
            disabled={isPackaging || fileCount === 0}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {isPackaging
                ? 'Pakowanie...'
                : `Pobierz Projekt ${getPlatformLabel().split(' ')[0]} (.zip)`}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
