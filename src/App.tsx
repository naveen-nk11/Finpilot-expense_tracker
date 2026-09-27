import React, { useState } from 'react';
import { 
  PiggyBank, Code2, BookOpen, Terminal, Download, 
  ExternalLink, Sparkles, Layers, CheckCircle2
} from 'lucide-react';
import { FinPilotApp } from './components/FinPilotApp';
import { CodeExplorer } from './components/CodeExplorer';
import { PlacementGuide } from './components/PlacementGuide';
import { FlowDebuggerModal } from './components/FlowDebuggerModal';
import { generateProjectZip, downloadBlob } from './utils/zipExport';

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState<'app' | 'code' | 'placement'>('app');
  const [isDebuggerOpen, setIsDebuggerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateProjectZip();
      downloadBlob(blob, 'finpilot-expense-tracker.zip');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-slate-100 overflow-hidden font-sans">
      {/* Top Global Application Bar */}
      <header className="bg-black/95 border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between shrink-0 z-30 shadow-2xl shadow-black/80 backdrop-blur">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-950/40 text-emerald-400 flex items-center justify-center font-bold border border-emerald-800/40 shadow-inner shadow-emerald-950">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Fin<span className="text-emerald-400">Pilot</span>
              </h1>
              <span className="text-[10px] bg-[#0c0c0c] text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-900/40 font-mono-num">
                Core Java HttpServer &amp; MySQL
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Standalone Personal Expense Tracker • Zero-Tomcat / Zero-Spring Architecture
            </p>
          </div>
        </div>

        {/* Primary View Switcher */}
        <div className="flex items-center space-x-1 bg-[#0a0a0a] border border-zinc-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveMainTab('app')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeMainTab === 'app'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-950/50'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141414]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Live Application</span>
          </button>

          <button
            onClick={() => setActiveMainTab('code')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeMainTab === 'code'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-950/50'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141414]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Java Source &amp; SQL</span>
          </button>

          <button
            onClick={() => setActiveMainTab('placement')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeMainTab === 'placement'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-950/50'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141414]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Placement &amp; Interview Guide</span>
          </button>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDebuggerOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d0d0d] hover:bg-[#181818] border border-zinc-800 text-emerald-400 text-xs font-medium transition"
            title="Inspect live HTTP request dispatches and SQL queries"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Flow Debugger</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 text-xs font-bold transition shadow-lg shadow-emerald-950/60"
            title="Download full runnable Maven project with all Java sources, SQL, and static assets"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" />
                <span className="hidden sm:inline">Downloaded!</span>
              </>
            ) : isDownloading ? (
              <>
                <div className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Packaging...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Java Project (.zip)</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main View Container */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeMainTab === 'app' && (
          <FinPilotApp 
            onOpenFlowLog={() => setIsDebuggerOpen(true)} 
            onNavigateToCode={() => setActiveMainTab('code')}
          />
        )}
        {activeMainTab === 'code' && <CodeExplorer />}
        {activeMainTab === 'placement' && <PlacementGuide />}
      </div>

      {/* Live HTTP/SQL Debugger Drawer Modal */}
      <FlowDebuggerModal
        isOpen={isDebuggerOpen}
        onClose={() => setIsDebuggerOpen(false)}
      />
    </div>
  );
}
