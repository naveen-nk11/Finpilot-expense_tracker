import React, { useState } from 'react';
import { 
  Folder, FileCode, Copy, Check, Download, Search, 
  Terminal, Database, Globe, Server, FileText, CheckCircle
} from 'lucide-react';
import { JAVA_SOURCE_FILES, FINPILOT_POM_XML, FINPILOT_SQL, JavaFileItem } from '../data/javaSourceFiles';
import { FRONTEND_FILES, FrontendFileItem } from '../data/frontendSourceFiles';
import { generateProjectZip, downloadBlob } from '../utils/zipExport';

export const CodeExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<JavaFileItem | FrontendFileItem | { name: string; path: string; code: string; description: string }>(JAVA_SOURCE_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Group all project files
  const allFiles: Array<{ name: string; path: string; category: string; description: string; code: string }> = [
    ...JAVA_SOURCE_FILES.map(f => ({ ...f, category: f.category })),
    { name: 'pom.xml', path: 'pom.xml', category: 'config', description: 'Maven project configuration (JDK 17+, Gson, MySQL Connector/J, jBCrypt, Fat JAR plugin)', code: FINPILOT_POM_XML },
    { name: 'finpilot.sql', path: 'finpilot.sql', category: 'sql', description: 'MySQL 8.0 DDL schema for users, transactions, and budgets with foreign keys, indexes, and seed data', code: FINPILOT_SQL },
    ...FRONTEND_FILES.map(f => ({ ...f, category: 'frontend' }))
  ];

  const filteredFiles = allFiles.filter(f => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.path.toLowerCase().includes(search.toLowerCase()) ||
                          f.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const blob = await generateProjectZip();
      downloadBlob(blob, 'finpilot-expense-tracker.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to generate zip', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black text-slate-100 overflow-hidden font-sans">
      {/* Top action bar */}
      <div className="bg-[#080808] border-b border-zinc-900 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl shadow-black/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
              FinPilot Core Java Project Explorer
              <span className="text-[10px] bg-black text-emerald-400 border border-zinc-800 px-2 py-0.5 rounded font-mono-num">
                Standalone Maven Project
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Browse complete Java source code, MySQL schema, and Vanilla frontend files
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-lg shadow-emerald-950/50"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-zinc-950" />
                <span>Downloaded ZIP!</span>
              </>
            ) : isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>Generating ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Full Project (.ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left file tree / list */}
        <aside className="w-full md:w-80 bg-[#080808] border-r border-zinc-900 flex flex-col shrink-0 min-h-0">
          {/* Search and category filters */}
          <div className="p-3 border-b border-zinc-800/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'server', label: 'Server' },
                { id: 'model', label: 'Models' },
                { id: 'dao', label: 'DAOs' },
                { id: 'service', label: 'Services' },
                { id: 'util', label: 'Utils' },
                { id: 'sql', label: 'SQL' },
                { id: 'frontend', label: 'Frontend' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[11px] px-2 py-0.5 rounded transition ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredFiles.map(file => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2 rounded-xl transition flex items-start space-x-2.5 ${
                    isSelected 
                      ? 'bg-[#0d1e16] border border-emerald-800/40 text-white shadow-sm' 
                      : 'hover:bg-[#121212] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <div className="overflow-hidden flex-1">
                    <div className="text-xs font-semibold truncate text-white">{file.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate font-mono-num">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right code viewer */}
        <section className="flex-1 flex flex-col min-h-0 bg-black overflow-hidden">
          {/* File header */}
          <div className="bg-[#080808] border-b border-zinc-900 px-5 py-3 flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="flex items-center space-x-2">
                <span className="font-mono-num text-xs font-bold text-emerald-400">{selectedFile.name}</span>
                <span className="text-xs text-zinc-500 font-mono-num">({selectedFile.path})</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] text-zinc-300 text-xs font-medium transition border border-zinc-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Syntax Highlighted Pre/Code Block */}
          <div className="flex-1 overflow-auto p-4 font-mono-num text-xs text-zinc-300 leading-relaxed bg-black">
            <pre className="select-text whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};
