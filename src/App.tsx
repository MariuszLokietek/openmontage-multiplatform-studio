import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProjectUploader } from './components/ProjectUploader';
import { CodeViewer } from './components/CodeViewer';
import { WindowsConfigPanel } from './components/WindowsConfigPanel';
import { ApkConfigPanel } from './components/ApkConfigPanel';
import { MacConfigPanel } from './components/MacConfigPanel';
import { IosConfigPanel } from './components/IosConfigPanel';
import { WindowsSimulator } from './components/WindowsSimulator';
import { DeviceSimulator } from './components/DeviceSimulator';
import { AppleSimulator } from './components/AppleSimulator';
import { AiDiagnostics } from './components/AiDiagnostics';
import { UniversalBuildGuide } from './components/UniversalBuildGuide';
import { ActiveTab, ApkConfig, ExeConfig, IosConfig, MacConfig, ProjectFile, TargetPlatform } from './types';
import { sampleOpenMontageStudio } from './utils/sampleProjects';
import {
  packageFullAndroidProjectZip,
  packageFullIosProjectZip,
  packageFullMacProjectZip,
  packageFullWindowsProjectZip,
} from './utils/zipHandler';

export default function App() {
  const [targetPlatform, setTargetPlatform] = useState<TargetPlatform>('windows');
  const [activeTab, setActiveTab] = useState<ActiveTab>('files');
  const [files, setFiles] = useState<ProjectFile[]>(sampleOpenMontageStudio);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(files[0]?.id || null);

  // 1. Windows EXE Configuration
  const [exeConfig, setExeConfig] = useState<ExeConfig>({
    appName: 'OpenMontage Studio',
    exeName: 'OpenMontage.exe',
    installerName: 'OpenMontage_Setup_x64.exe',
    version: '1.0.0',
    companyName: 'OpenMontage Community',
    appDescription: 'Natywna aplikacja montażu wideo OpenMontage dla systemów Windows 10 i 11',
    appId: 'com.openmontage.desktop',
    architecture: 'x64',
    installerType: 'nsis',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    runAtStartup: false,
    hardwareAcceleration: true,
    enableNodeIntegration: false,
    fileAssociations: ['.omproj', '.montage', '.mp4'],
    allowMultipleInstances: false,
    windowWidth: 1280,
    windowHeight: 800,
    themeColor: '#0284c7',
  });

  // 2. Android APK Configuration
  const [apkConfig, setApkConfig] = useState<ApkConfig>({
    appName: 'OpenMontage Studio',
    packageName: 'com.openmontage.app',
    versionName: '1.0.0',
    versionCode: 1,
    minSdk: 24,
    targetSdk: 34,
    orientation: 'sensor',
    fullscreen: false,
    hardwareAccelerated: true,
    allowCameraAccess: true,
    allowAudioRecord: true,
    allowExternalStorage: true,
    allowInternet: true,
    enableDomStorage: true,
    enableJavascript: true,
    themeColor: '#6366F1',
    splashDurationMs: 1500,
  });

  // 3. Apple macOS Configuration
  const [macConfig, setMacConfig] = useState<MacConfig>({
    appName: 'OpenMontage Studio',
    bundleId: 'com.openmontage.mac',
    version: '1.0.0',
    category: 'public.app-category.video',
    architecture: 'universal',
    dmgName: 'OpenMontage_macOS_Universal.dmg',
    hardenedRuntime: true,
    cameraAccess: true,
    microphoneAccess: true,
    hardwareAcceleration: true,
    windowWidth: 1280,
    windowHeight: 800,
    titleBarStyle: 'hiddenInset',
  });

  // 4. Apple iOS Configuration (iPhone & iPad)
  const [iosConfig, setIosConfig] = useState<IosConfig>({
    appName: 'OpenMontage',
    bundleId: 'com.openmontage.ios',
    version: '1.0.0',
    buildNumber: 1,
    minIosVersion: '16.0',
    targetDevice: 'universal',
    cameraUsageDescription: 'Aplikacja OpenMontage wymaga dostępu do aparatu do nagrywania wideo do montażu.',
    microphoneUsageDescription: 'Dostęp do mikrofonu jest wymagany do rejestracji dźwięku i komentarzy głosowych.',
    photoLibraryUsageDescription: 'Wybieranie filmów i zdjęć z galerii urządzenia w celu ich montażu.',
    requiresFullScreen: true,
    enableWebRTC: true,
    allowsInlinePlayback: true,
    statusBarColor: 'light',
  });

  const [isPackaging, setIsPackaging] = useState(false);
  const [packagingProgress, setPackagingProgress] = useState<{ percent: number; step: string } | null>(null);

  const selectedFile = files.find(f => f.id === selectedFileId) || null;

  const handleSelectFile = (file: ProjectFile) => {
    setSelectedFileId(file.id);
    if (activeTab !== 'files') {
      setActiveTab('files');
    }
  };

  const handleFilesUpdated = (updatedFiles: ProjectFile[]) => {
    setFiles(updatedFiles);
    if (updatedFiles.length > 0 && (!selectedFileId || !updatedFiles.some(f => f.id === selectedFileId))) {
      setSelectedFileId(updatedFiles[0].id);
    }
  };

  const handleFileSaved = (fileId: string, newContent: string) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId
          ? { ...f, content: newContent, size: newContent.length, lastModified: Date.now() }
          : f
      )
    );
  };

  const handleAddBlankFile = () => {
    const fileName = prompt('Podaj nazwę nowego pliku (np. script.js, style.css, project.json):', 'custom.js');
    if (!fileName || !fileName.trim()) return;

    const newFile: ProjectFile = {
      id: 'f_' + Math.random().toString(36).substring(2, 9),
      name: fileName.trim(),
      path: fileName.trim(),
      content: '// Nowy plik projektu OpenMontage\n',
      size: 34,
      lastModified: Date.now(),
    };

    setFiles(prev => [...prev, newFile]);
    setSelectedFileId(newFile.id);
  };

  const handleDeleteFile = (fileId: string) => {
    if (files.length <= 1) {
      alert('Projekt musi zawierać co najmniej jeden plik.');
      return;
    }
    const target = files.find(f => f.id === fileId);
    if (!confirm(`Czy na pewno usunąć plik "${target?.name || fileId}"?`)) return;

    setFiles(prev => {
      const remaining = prev.filter(f => f.id !== fileId);
      if (selectedFileId === fileId) {
        setSelectedFileId(remaining[0]?.id || null);
      }
      return remaining;
    });
  };

  const handlePackageAndDownload = async () => {
    if (files.length === 0) {
      alert('Dodaj pliki projektu OpenMontage przed kompilacją.');
      return;
    }

    setIsPackaging(true);
    setPackagingProgress({
      percent: 10,
      step: `Przygotowywanie projektu dla platformy ${targetPlatform.toUpperCase()}...`,
    });

    try {
      let blob: Blob;
      let filename = '';

      if (targetPlatform === 'windows') {
        blob = await packageFullWindowsProjectZip(files, exeConfig, (percent, step) => {
          setPackagingProgress({ percent, step });
        });
        const cleanName = exeConfig.appName.replace(/[^a-zA-Z0-9_-]/g, '_');
        filename = `${cleanName}-Windows-EXE-Project.zip`;
      } else if (targetPlatform === 'android') {
        blob = await packageFullAndroidProjectZip(files, apkConfig, (percent, step) => {
          setPackagingProgress({ percent, step });
        });
        const cleanName = apkConfig.appName.replace(/[^a-zA-Z0-9_-]/g, '_');
        filename = `${cleanName}-Android-APK-Project.zip`;
      } else if (targetPlatform === 'macos') {
        blob = await packageFullMacProjectZip(files, macConfig, (percent, step) => {
          setPackagingProgress({ percent, step });
        });
        const cleanName = macConfig.appName.replace(/[^a-zA-Z0-9_-]/g, '_');
        filename = `${cleanName}-macOS-DMG-Project.zip`;
      } else {
        blob = await packageFullIosProjectZip(files, iosConfig, (percent, step) => {
          setPackagingProgress({ percent, step });
        });
        const cleanName = iosConfig.appName.replace(/[^a-zA-Z0-9_-]/g, '_');
        filename = `${cleanName}-iOS-Xcode-IPA-Project.zip`;
      }

      // Trigger automatic browser file download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setPackagingProgress(null);
        setIsPackaging(false);
      }, 1000);
    } catch (err) {
      console.error('Błąd pakowania projektu:', err);
      alert('Wystąpił problem podczas pakowania projektu.');
      setIsPackaging(false);
      setPackagingProgress(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Bar matching Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        targetPlatform={targetPlatform}
        setTargetPlatform={setTargetPlatform}
        fileCount={files.length}
        isPackaging={isPackaging}
        onPackageClick={handlePackageAndDownload}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'files' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left sidebar: File Tree & Uploader */}
            <div className="w-80 shrink-0 h-full">
              <ProjectUploader
                files={files}
                selectedFileId={selectedFileId}
                onSelectFile={handleSelectFile}
                onFilesUpdated={handleFilesUpdated}
                onAddBlankFile={handleAddBlankFile}
                onDeleteFile={handleDeleteFile}
              />
            </div>

            {/* Right pane: Code Editor & Preview */}
            <div className="flex-1 h-full">
              <CodeViewer
                file={selectedFile}
                onFileSaved={handleFileSaved}
              />
            </div>
          </div>
        )}

        {/* Configuration Panel */}
        {activeTab === 'config' && (
          targetPlatform === 'windows' ? (
            <WindowsConfigPanel config={exeConfig} onChange={setExeConfig} />
          ) : targetPlatform === 'android' ? (
            <ApkConfigPanel config={apkConfig} onChange={setApkConfig} />
          ) : targetPlatform === 'macos' ? (
            <MacConfigPanel config={macConfig} onChange={setMacConfig} />
          ) : (
            <IosConfigPanel config={iosConfig} onChange={setIosConfig} />
          )
        )}

        {/* Device & Desktop Simulator */}
        {activeTab === 'preview' && (
          targetPlatform === 'windows' ? (
            <WindowsSimulator files={files} config={exeConfig} />
          ) : targetPlatform === 'android' ? (
            <DeviceSimulator files={files} config={apkConfig} />
          ) : targetPlatform === 'macos' ? (
            <AppleSimulator files={files} macConfig={macConfig} iosConfig={iosConfig} subType="mac" />
          ) : (
            <AppleSimulator files={files} macConfig={macConfig} iosConfig={iosConfig} subType="ios" />
          )
        )}

        {/* AI Doctor Diagnostics */}
        {activeTab === 'ai-doctor' && (
          <AiDiagnostics
            files={files}
            targetPlatform={targetPlatform}
            exeConfig={exeConfig}
            apkConfig={apkConfig}
          />
        )}

        {/* Multiplatform Build Guide */}
        {activeTab === 'build-guide' && (
          <UniversalBuildGuide
            targetPlatform={targetPlatform}
            exeConfig={exeConfig}
            apkConfig={apkConfig}
            macConfig={macConfig}
            iosConfig={iosConfig}
            onDownloadProject={handlePackageAndDownload}
          />
        )}
      </main>

      {/* Progress Dialog when generating ZIP */}
      {packagingProgress && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Generowanie Paczki {targetPlatform.toUpperCase()}
              </h3>
              <span className="text-xs font-mono tabular-nums text-indigo-400">
                {packagingProgress.percent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 h-full transition-all duration-200"
                style={{ width: `${packagingProgress.percent}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-400 font-mono truncate">
              {packagingProgress.step}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
