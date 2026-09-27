import React from 'react';
import { Terminal, Database, Server, X, Trash2, ArrowRight } from 'lucide-react';
import { FinPilotStore, RequestLog } from '../services/apiEmulator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FlowDebuggerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const logs = FinPilotStore.getLogs();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden">
        {/* Header */}
        <div className="bg-[#080808] border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2 tracking-tight">
                Live HTTP & JDBC Query Flow Tracer
                <span className="text-[10px] bg-black text-emerald-400 border border-zinc-800 px-2 py-0.5 rounded font-mono-num">
                  {logs.length} Operations Logged
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Inspect real-time request dispatches, Java handler routes, and SQL prepared statements
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => FinPilotStore.clearLogs()}
              className="text-xs text-zinc-400 hover:text-rose-400 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition bg-black hover:bg-[#181818]"
              title="Clear all logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg transition hover:bg-[#181818]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              No HTTP operations recorded yet. Add, edit, or delete a transaction or budget to see the live trace!
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className="bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-4 space-y-2.5 font-mono-num text-xs shadow-2xl shadow-black/80"
              >
                {/* Method & Route line */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      log.method === 'POST' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' :
                      log.method === 'PUT' ? 'bg-teal-950/40 text-teal-400 border border-teal-800/40' :
                      log.method === 'DELETE' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/40' :
                      'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                    }`}>
                      {log.method}
                    </span>
                    <span className="text-white font-bold tracking-tight">{log.endpoint}</span>
                    <span className="text-zinc-500 text-[10px]">[{log.timestamp}]</span>
                  </div>

                  <span className="text-emerald-300 bg-black border border-zinc-800 px-2.5 py-0.5 rounded text-[11px] font-semibold">
                    Status: {log.status}
                  </span>
                </div>

                {/* Java Handler route */}
                <div className="flex items-start space-x-2 text-zinc-400 bg-black border border-zinc-800 p-2.5 rounded-lg">
                  <Server className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-emerald-400 font-semibold">Java Handler Chain:</span>{' '}
                    <span className="text-zinc-300">{log.javaHandler}</span>
                  </div>
                </div>

                {/* Executed SQL */}
                <div className="flex items-start space-x-2 text-zinc-400 bg-black border border-zinc-800 p-2.5 rounded-lg">
                  <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="overflow-x-auto w-full">
                    <span className="text-emerald-400 font-semibold">PreparedStatement SQL:</span>{' '}
                    <span className="text-zinc-300 font-mono-num">{log.sqlExecuted}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
