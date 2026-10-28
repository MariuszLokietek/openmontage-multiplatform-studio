export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  isBinary?: boolean;
  size: number;
  lastModified?: number;
}

export type TargetPlatform = 'windows' | 'android' | 'macos' | 'ios';

export interface ExeConfig {
  appName: string;
  exeName: string;
  installerName: string;
  version: string;
  companyName: string;
  appDescription: string;
  appId: string;
  architecture: 'x64' | 'arm64' | 'ia32' | 'universal';
  installerType: 'nsis' | 'inno' | 'portable' | 'both';
  createDesktopShortcut: boolean;
  createStartMenuShortcut: boolean;
  runAtStartup: boolean;
  hardwareAcceleration: boolean;
  enableNodeIntegration: boolean;
  fileAssociations: string[];
  allowMultipleInstances: boolean;
  windowWidth: number;
  windowHeight: number;
  themeColor: string;
}

export interface ApkConfig {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  targetSdk: number;
  orientation: 'sensor' | 'portrait' | 'landscape';
  fullscreen: boolean;
  hardwareAccelerated: boolean;
  allowCameraAccess: boolean;
  allowAudioRecord: boolean;
  allowExternalStorage: boolean;
  allowInternet: boolean;
  enableDomStorage: boolean;
  enableJavascript: boolean;
  themeColor: string;
  splashDurationMs: number;
}

export interface MacConfig {
  appName: string;
  bundleId: string;
  version: string;
  category: string;
  architecture: 'universal' | 'arm64' | 'x64';
  dmgName: string;
  hardenedRuntime: boolean;
  cameraAccess: boolean;
  microphoneAccess: boolean;
  hardwareAcceleration: boolean;
  windowWidth: number;
  windowHeight: number;
  titleBarStyle: 'hiddenInset' | 'default';
}

export interface IosConfig {
  appName: string;
  bundleId: string;
  version: string;
  buildNumber: number;
  minIosVersion: string;
  targetDevice: 'universal' | 'iphone' | 'ipad';
  cameraUsageDescription: string;
  microphoneUsageDescription: string;
  photoLibraryUsageDescription: string;
  requiresFullScreen: boolean;
  enableWebRTC: boolean;
  allowsInlinePlayback: boolean;
  statusBarColor: 'dark' | 'light';
}

export interface AiDiagnosticResult {
  compatibilityScore: number;
  summary: string;
  positives: string[];
  potentialIssues: string[];
  recommendations: string[];
  configSnippet?: string;
}

export type ActiveTab = 'files' | 'config' | 'preview' | 'ai-doctor' | 'build-guide';
