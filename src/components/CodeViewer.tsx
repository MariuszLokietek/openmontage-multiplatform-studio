import React, { useState, useEffect } from 'react';
import { Save, Check, FileCode, Eye, Edit3 } from 'lucide-react';
import { ProjectFile } from '../types';

interface CodeViewerProps {
  file: ProjectFile | null;
  onFileSaved: (fileId: string, newContent: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ file, onFileSaved }) => {
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [mode, setMode] = useState<'code' | 'render'>('code');

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setIsDirty(false);
      setJustSaved(false);
    }
  }, [file]);

  if (!file) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
        <FileCode className="w-12 h-12 text-slate-700 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">Wybierz plik z drzewa po lewej</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Możesz edytować kod źródłowy aplikacji OpenMontage, przeglądać skrypty i podglądać assety przed kompilacją APK.
        </p>
      </div>
    );
  }

  const handleSave = () => {
    onFileSaved(file.id, content);
    setIsDirty(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const isHtml = file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm');
  const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(file.name);
  const linesCount = (content.match(/\n/g) || []).length + 1;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* File Header Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 truncate">
          <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-mono font-semibold text-slate-200 truncate">{file.path}</span>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{linesCount} linii</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{file.size} bajtów</span>
          </div>
          {isDirty && (
            <span className="text-[11px] text-amber-400 font-medium">· Niezapisane zmiany</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isHtml && (
            <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
              <button
                onClick={() => setMode('code')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  mode === 'code' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Kod
                </span>
              </button>
              <button
                onClick={() => setMode('render')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  mode === 'render' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Render
                </span>
              </button>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              justSaved
                ? 'bg-emerald-600 text-white'
                : isDirty
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {justSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{justSaved ? 'Zapisano' : 'Zapisz'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        {isImage && file.content.startsWith('data:') ? (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950">
            <img
              src={file.content}
              alt={file.name}
              className="max-h-[70%] max-w-[80%] object-contain rounded shadow-lg border border-slate-800"
            />
            <p className="mt-4 text-xs font-mono text-slate-400">{file.name}</p>
          </div>
        ) : mode === 'render' && isHtml ? (
          <iframe
            srcDoc={content}
            title="Podgląd HTML"
            sandbox="allow-scripts allow-modals"
            className="w-full h-full border-none bg-white"
          />
        ) : (
          <div className="h-full flex">
            {/* Simple Line Numbers */}
            <div className="w-12 bg-slate-900/60 text-slate-600 font-mono text-xs select-none py-3 text-right pr-2.5 overflow-hidden">
              {Array.from({ length: Math.min(linesCount, 500) }).map((_, i) => (
                <div key={i} className="leading-5 tabular-nums text-[11px] text-slate-600">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code TextArea */}
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setIsDirty(true);
              }}
              spellCheck={false}
              className="flex-1 h-full bg-slate-950 text-slate-200 font-mono text-xs p-3 leading-5 resize-none focus:outline-none focus:ring-0 selection:bg-indigo-900 selection:text-white overflow-auto"
              style={{ tabSize: 2 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
