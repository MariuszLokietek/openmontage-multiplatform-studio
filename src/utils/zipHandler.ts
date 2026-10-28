import JSZip from 'jszip';
import { ApkConfig, ExeConfig, IosConfig, MacConfig, ProjectFile } from '../types';
import {
  generateActivityMainXml,
  generateAndroidManifest,
  generateAppBuildGradle,
  generateColorsXml,
  generateCompilationReadme,
  generateGitHubWorkflowYaml,
  generateGradleProperties,
  generateGradleWrapperProperties,
  generateGradlewBatScript,
  generateGradlewScript,
  generateMainActivityJava,
  generateRootBuildGradle,
  generateSettingsGradle,
  generateStringsXml,
  generateStylesXml,
  packageNameToPath,
} from './androidProjectGenerator';
import {
  generateElectronMainJs,
  generateGitHubWorkflowWindowsYaml,
  generateInnoSetupScript,
  generatePreloadJs,
  generateWindowsBuildBat,
  generateWindowsBuildPs1,
  generateWindowsCompilationReadme,
  generateWindowsPackageJson,
} from './windowsProjectGenerator';
import {
  generateGitHubWorkflowIosYaml,
  generateGitHubWorkflowMacYaml,
  generateIosAppDelegateSwift,
  generateIosCompilationReadme,
  generateIosInfoPlist,
  generateIosViewControllerSwift,
  generateMacCompilationReadme,
  generateMacElectronMainJs,
  generateMacEntitlementsPlist,
  generateMacPackageJson,
} from './appleProjectGenerator';

export async function extractZipToProjectFiles(file: File): Promise<ProjectFile[]> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);
  const files: ProjectFile[] = [];

  for (const [relativePath, zipEntry] of Object.entries(loadedZip.files)) {
    if (zipEntry.dir) continue;
    if (relativePath.includes('__MACOSX') || relativePath.includes('.DS_Store')) continue;

    const fileName = relativePath.split('/').pop() || relativePath;
    const isImage = /\.(png|jpe?g|gif|svg|webp|ico|mp4|webm|mp3|wav|ogg)$/i.test(fileName);

    let content = '';
    if (isImage) {
      const base64 = await zipEntry.async('base64');
      content = `data:application/octet-stream;base64,${base64}`;
    } else {
      content = await zipEntry.async('text');
    }

    files.push({
      id: 'f_' + Math.random().toString(36).substring(2, 9),
      name: fileName,
      path: relativePath,
      content,
      isBinary: isImage,
      size: (zipEntry as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize || content.length,
      lastModified: zipEntry.date?.getTime() || Date.now(),
    });
  }

  return files;
}

export async function packageFullWindowsProjectZip(
  files: ProjectFile[],
  config: ExeConfig,
  onProgress?: (percent: number, step: string) => void
): Promise<Blob> {
  const zip = new JSZip();

  onProgress?.(15, 'Przygotowywanie plików konfiguracyjnych Electron i skryptów Windows...');

  zip.file('package.json', generateWindowsPackageJson(config));
  zip.file('main.js', generateElectronMainJs(config));
  zip.file('preload.js', generatePreloadJs());
  zip.file('installer.iss', generateInnoSetupScript(config));
  zip.file('build.bat', generateWindowsBuildBat(config));
  zip.file('build.ps1', generateWindowsBuildPs1());
  zip.file('README-KOMPILACJA-EXE.md', generateWindowsCompilationReadme(config));
  zip.file('.github/workflows/build-exe.yml', generateGitHubWorkflowWindowsYaml(config));

  onProgress?.(45, 'Pakowanie assetów OpenMontage do folderu src/...');

  let hasIndex = false;
  for (const f of files) {
    let cleanPath = f.path.startsWith('/') ? f.path.substring(1) : f.path;
    if (cleanPath.startsWith('src/')) cleanPath = cleanPath.substring(4);
    if (cleanPath.toLowerCase().endsWith('index.html')) hasIndex = true;

    if (f.isBinary && f.content.startsWith('data:')) {
      const base64Data = f.content.split(',')[1];
      zip.file(`src/${cleanPath}`, base64Data, { base64: true });
    } else {
      zip.file(`src/${cleanPath}`, f.content);
    }
  }

  if (!hasIndex) {
    zip.file(
      'src/index.html',
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${config.appName}</title></head><body><h1>OpenMontage Project</h1></body></html>`
    );
  }

  onProgress?.(80, 'Kompresowanie archiwum instalatora Windows...');

  return await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => onProgress?.(80 + Math.round(metadata.percent * 0.19), `Kompresowanie: ${Math.round(metadata.percent)}%`)
  );
}

export async function packageFullAndroidProjectZip(
  files: ProjectFile[],
  config: ApkConfig,
  onProgress?: (percent: number, step: string) => void
): Promise<Blob> {
  const zip = new JSZip();
  const pkgPath = packageNameToPath(config.packageName);

  onProgress?.(10, 'Przygotowywanie plików konfiguracyjnych Gradle...');

  zip.file('build.gradle', generateRootBuildGradle());
  zip.file('settings.gradle', generateSettingsGradle(config));
  zip.file('gradle.properties', generateGradleProperties());
  zip.file('gradlew', generateGradlewScript(), { unixPermissions: '755' });
  zip.file('gradlew.bat', generateGradlewBatScript());
  zip.file('gradle/wrapper/gradle-wrapper.properties', generateGradleWrapperProperties());
  zip.file('README-KOMPILACJA-APK.md', generateCompilationReadme(config));
  zip.file('.github/workflows/build-apk.yml', generateGitHubWorkflowYaml());

  onProgress?.(30, 'Generowanie kodu natywnego Android...');
  zip.file('app/build.gradle', generateAppBuildGradle(config));
  zip.file('app/src/main/AndroidManifest.xml', generateAndroidManifest(config));
  zip.file(`app/src/main/java/${pkgPath}/MainActivity.java`, generateMainActivityJava(config));
  zip.file('app/src/main/res/layout/activity_main.xml', generateActivityMainXml());
  zip.file('app/src/main/res/values/strings.xml', generateStringsXml(config));
  zip.file('app/src/main/res/values/colors.xml', generateColorsXml(config));
  zip.file('app/src/main/res/values/styles.xml', generateStylesXml());

  onProgress?.(60, 'Pakowanie assetów OpenMontage do assets/www/...');

  let hasIndex = false;
  for (const f of files) {
    const cleanPath = f.path.startsWith('/') ? f.path.substring(1) : f.path;
    if (cleanPath.toLowerCase().endsWith('index.html')) hasIndex = true;

    if (f.isBinary && f.content.startsWith('data:')) {
      const base64Data = f.content.split(',')[1];
      zip.file(`app/src/main/assets/www/${cleanPath}`, base64Data, { base64: true });
    } else {
      zip.file(`app/src/main/assets/www/${cleanPath}`, f.content);
    }
  }

  if (!hasIndex) {
    zip.file(
      'app/src/main/assets/www/index.html',
      `<!DOCTYPE html><html><head><title>${config.appName}</title></head><body><h1>OpenMontage Project</h1></body></html>`
    );
  }

  onProgress?.(85, 'Kompresja archiwum ZIP...');

  return await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => onProgress?.(85 + Math.round(metadata.percent * 0.14), `Kompresowanie: ${Math.round(metadata.percent)}%`)
  );
}

export async function packageFullMacProjectZip(
  files: ProjectFile[],
  config: MacConfig,
  onProgress?: (percent: number, step: string) => void
): Promise<Blob> {
  const zip = new JSZip();

  onProgress?.(15, 'Konfiguracja środowiska macOS dla procesorów Apple Silicon i Intel...');

  zip.file('package.json', generateMacPackageJson(config));
  zip.file('main.js', generateMacElectronMainJs(config));
  zip.file('preload.js', generatePreloadJs());
  zip.file('entitlements.mac.plist', generateMacEntitlementsPlist(config));
  zip.file('README-KOMPILACJA-MACOS.md', generateMacCompilationReadme(config));
  zip.file('.github/workflows/build-mac.yml', generateGitHubWorkflowMacYaml(config));

  onProgress?.(45, 'Pakowanie plików OpenMontage do src/...');

  let hasIndex = false;
  for (const f of files) {
    let cleanPath = f.path.startsWith('/') ? f.path.substring(1) : f.path;
    if (cleanPath.startsWith('src/')) cleanPath = cleanPath.substring(4);
    if (cleanPath.toLowerCase().endsWith('index.html')) hasIndex = true;

    if (f.isBinary && f.content.startsWith('data:')) {
      const base64Data = f.content.split(',')[1];
      zip.file(`src/${cleanPath}`, base64Data, { base64: true });
    } else {
      zip.file(`src/${cleanPath}`, f.content);
    }
  }

  if (!hasIndex) {
    zip.file('src/index.html', `<!DOCTYPE html><html><head><title>${config.appName}</title></head><body><h1>OpenMontage Project</h1></body></html>`);
  }

  onProgress?.(80, 'Kompresowanie archiwum macOS DMG...');

  return await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => onProgress?.(80 + Math.round(metadata.percent * 0.19), `Kompresowanie: ${Math.round(metadata.percent)}%`)
  );
}

export async function packageFullIosProjectZip(
  files: ProjectFile[],
  config: IosConfig,
  onProgress?: (percent: number, step: string) => void
): Promise<Blob> {
  const zip = new JSZip();

  onProgress?.(15, 'Generowanie natywnego projektu Apple iOS (Xcode / Swift)...');

  zip.file('App/Info.plist', generateIosInfoPlist(config));
  zip.file('App/ViewController.swift', generateIosViewControllerSwift(config));
  zip.file('App/AppDelegate.swift', generateIosAppDelegateSwift(config));
  zip.file('README-KOMPILACJA-IOS.md', generateIosCompilationReadme(config));
  zip.file('.github/workflows/build-ios.yml', generateGitHubWorkflowIosYaml(config));

  onProgress?.(50, 'Kopiowanie plików OpenMontage do zasobów www/...');

  let hasIndex = false;
  for (const f of files) {
    let cleanPath = f.path.startsWith('/') ? f.path.substring(1) : f.path;
    if (cleanPath.startsWith('www/')) cleanPath = cleanPath.substring(4);
    if (cleanPath.toLowerCase().endsWith('index.html')) hasIndex = true;

    if (f.isBinary && f.content.startsWith('data:')) {
      const base64Data = f.content.split(',')[1];
      zip.file(`App/www/${cleanPath}`, base64Data, { base64: true });
    } else {
      zip.file(`App/www/${cleanPath}`, f.content);
    }
  }

  if (!hasIndex) {
    zip.file('App/www/index.html', `<!DOCTYPE html><html><head><title>${config.appName}</title></head><body><h1>OpenMontage Project</h1></body></html>`);
  }

  onProgress?.(85, 'Kompresowanie projektu iOS...');

  return await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => onProgress?.(85 + Math.round(metadata.percent * 0.14), `Kompresowanie: ${Math.round(metadata.percent)}%`)
  );
}
