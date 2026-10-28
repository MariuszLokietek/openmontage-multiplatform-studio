import React, { useRef, useState } from 'react';
import { UploadCloud, FileCode, FolderArchive, FileText, Image as ImageIcon, Music, Video, Plus, Trash2, RefreshCw } from 'lucide-react';
import { ProjectFile } from '../types';
import { extractZipToProjectFiles } from '../utils/zipHandler';
import { sampleOpenMontageStudio, sampleSlideReel } from '../utils/sampleProjects';

interface ProjectUploaderProps {
  files: ProjectFile[];
  selectedFileId: string | null;
  onSelectFile: (file: ProjectFile) => void;
  onFilesUpdated: (files: ProjectFile[]) => void;
  onAddBlankFile: () => void;
  onDeleteFile: (fileId: string) => void;
}

export const ProjectUploader: React.FC<ProjectUploaderProps> = ({
  files,
  selectedFileId,
  onSelectFile,
  onFilesUpdated,
  onAddBlankFile,
  onDeleteFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    await processUploadedFileList(Array.from(uploadedFiles));
  };

  const processUploadedFileList = async (fileList: File[]) => {
    setIsProcessing(true);
    try {
      const isZip = fileList.length === 1 && fileList[0].name.toLowerCase().endsWith('.zip');
      if (isZip) {
        const extracted = await extractZipToProjectFiles(fileList[0]);
        if (extracted.length > 0) {
          onFilesUpdated(extracted);
          onSelectFile(extracted[0]);
        }
      } else {
        // Individual files
        const newFiles: ProjectFile[] = [];
        for (const file of fileList) {
          const isBinary = /\.(png|jpe?g|gif|svg|webp|ico|mp4|webm|mp3|wav|ogg)$/i.test(file.name);
          let content = '';
          if (isBinary) {
            content = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
          } else {
            content = await file.text();
          }

          newFiles.push({
            id: 'f_' + Math.random().toString(36).substring(2, 9),
            name: file.name,
            path: file.name,
            content,
            isBinary,
            size: file.size,
            lastModified: file.lastModified,
          });
        }
        onFilesUpdated([...files, ...newFiles]);
        if (newFiles.length > 0) onSelectFile(newFiles[0]);
      }
    } catch (err) {
      console.error('Błąd wczytywania plików:', err);
      alert('Nie udało się wczytać archiwum. Upewnij się, że plik ZIP jest poprawny.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFileList(Array.from(e.dataTransfer.files));
    }
  };

  const loadSample = (type: 'studio' | 'slide') => {
    const sample = type === 'studio' ? sampleOpenMontageStudio : sampleSlideReel;
    onFilesUpdated(sample);
    onSelectFile(sample[0]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'html') return <FileCode className="w-4 h-4 text-orange-400" />;
    if (ext === 'js' || ext === 'ts') return <FileCode className="w-4 h-4 text-yellow-400" />;
    if (ext === 'css') return <FileCode className="w-4 h-4 text-sky-400" />;
    if (ext === 'json') return <FileText className="w-4 h-4 text-emerald-400" />;
    if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext || '')) return <ImageIcon className="w-4 h-4 text-purple-400" />;
    if (['mp4', 'webm', 'mov'].includes(ext || '')) return <Video className="w-4 h-4 text-rose-400" />;
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return <Music className="w-4 h-4 text-indigo-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Top action header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Drzewo Projektu OpenMontage
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
            <span className="font-mono tabular-nums">{files.length} plików</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {formatFileSize(files.reduce((acc, f) => acc + (f.size || 0), 0))}
            </span>
          </div>
        </div>

        <button
          onClick={onAddBlankFile}
          title="Utwórz nowy plik w projekcie"
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Dropzone */}
      <div className="p-3 border-b border-slate-800">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-3.5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/30'
              : 'border-slate-700 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept=".zip,.html,.htm,.js,.css,.json,.png,.jpg,.jpeg,.mp4,.webm,.mp3"
            className="hidden"
          />
          <UploadCloud className="w-6 h-6 mx-auto text-indigo-400 mb-1.5" />
          <p className="text-xs font-medium text-slate-200">
            {isProcessing ? 'Przetwarzanie plików...' : 'Upuść archiwum .ZIP lub pliki OpenMontage'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            lub kliknij, aby wybrać z dysku komputera
          </p>
        </div>

        {/* Demo Templates */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Przykładowe szablony:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => loadSample('studio')}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline transition-colors cursor-pointer"
            >
              Edytor Wideo
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => loadSample('slide')}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline transition-colors cursor-pointer"
            >
              CineSlide
            </button>
          </div>
        </div>
      </div>

      {/* File Search */}
      <div className="px-3 py-2 border-b border-slate-800">
        <input
          type="text"
          placeholder="Filtruj pliki..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 px-2.5 py-1.5 rounded border border-slate-800 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredFiles.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            Brak pasujących plików. Upuść pliki OpenMontage powyżej.
          </div>
        ) : (
          filteredFiles.map((file) => {
            const isSelected = file.id === selectedFileId;
            return (
              <div
                key={file.id}
                onClick={() => onSelectFile(file)}
                className={`group flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-indigo-950/60 text-white border-l-2 border-indigo-500'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {getFileIcon(file.name)}
                  <span className="truncate font-mono text-[12px]">{file.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                    {formatFileSize(file.size || 0)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(file.id);
                    }}
                    title="Usuń plik"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Directory notice footer */}
      <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <FolderArchive className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="truncate">Ścieżka docelowa: <code className="text-slate-300">assets/www/</code></span>
      </div>
    </div>
  );
};
