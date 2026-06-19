'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { Database, Play, Save, Code2, AlertCircle, Clock, SaveAll } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { executeQuery, type QueryResult } from '@/lib/6data/query-engine';
import CleaningPreview from '@/components/6data/cleaning/CleaningPreview';
import { queryStore } from '@/lib/6data/store';
import type { SavedQuery } from '@/lib/6data/types';

export default function QueryLabPage() {
  const router = useRouter();
  const { datasets, queries, addQuery } = useDatasetStore();
  
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0]?.id || '');
  const [sql, setSql] = useState('SELECT * FROM data\nLIMIT 100');
  
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [runHistory, setRunHistory] = useState<{sql: string, timestamp: string}[]>([]);

  const activeDataset = datasets.find((ds) => ds.id === selectedDatasetId);

  const handleRun = async () => {
    if (!activeDataset || !sql.trim()) return;
    setIsRunning(true);
    setError(null);
    try {
      const res = await executeQuery(sql, activeDataset.name, activeDataset.rows);
      setResult(res);
      setRunHistory(prev => [{ sql, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    if (!activeDataset || !sql.trim() || !saveName.trim()) return;
    const q: SavedQuery = {
      id: queryStore.generateId(),
      name: saveName,
      datasetId: activeDataset.id,
      sql,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addQuery(q);
    setIsSaving(false);
    setSaveName('');
  };

  if (datasets.length === 0) {
    return (
      <div className="p-10 max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-4">Query Lab</h1>
        <p className="text-white/40">You need to import a dataset before you can run queries.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a12]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/6 bg-[#0f0f18] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">Query Lab</h1>
            <p className="text-[10px] text-white/40 leading-none">Write SQL to explore your data</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
          >
            {datasets.map((ds) => (
              <option key={ds.id} value={ds.id}>{ds.name}</option>
            ))}
          </select>
          <button
            onClick={() => setIsSaving(true)}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-8 text-xs border-white/10')}
          >
            <SaveAll className="w-3.5 h-3.5 mr-1.5" />
            Save Query
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Schema & Saved */}
        <div className="w-64 border-r border-white/6 bg-[#0a0a0f] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/6">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Schema</h3>
            <div className="space-y-1 overflow-y-auto max-h-48">
              {activeDataset?.schema.map((col) => (
                <div key={col.name} className="flex justify-between items-center text-xs">
                  <span className="text-white/80 truncate pr-2">{col.name}</span>
                  <span className="text-white/30 text-[10px] uppercase">{col.finalType}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Saved Queries</h3>
            <div className="space-y-2 mb-6">
              {queries.filter(q => q.datasetId === activeDataset?.id).length === 0 ? (
                <p className="text-xs text-white/30 italic">No saved queries for this dataset.</p>
              ) : (
                queries.filter(q => q.datasetId === activeDataset?.id).map((q) => (
                  <button
                    key={q.id}
                    onClick={() => setSql(q.sql)}
                    className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition border border-white/10"
                  >
                    <p className="text-xs font-bold text-white/80">{q.name}</p>
                    <p className="text-[10px] text-white/40 truncate">{q.sql}</p>
                  </button>
                ))
              )}
            </div>

            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Run History (Last 10)</h3>
            <div className="space-y-2">
              {runHistory.length === 0 ? (
                <p className="text-xs text-white/30 italic">No queries run yet.</p>
              ) : (
                runHistory.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setSql(h.sql)}
                    className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition border border-white/10 flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] text-cyan-400 font-mono truncate max-w-[120px]">{h.sql}</span>
                      <span className="text-[9px] text-white/30">{h.timestamp}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main Editor & Results */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor */}
          <div className="h-64 flex flex-col border-b border-white/6 bg-[#0f0f18] shrink-0">
            <div className="p-2 border-b border-white/6 flex items-center justify-between bg-black/20">
              <span className="text-[10px] font-mono text-cyan-500/70 ml-2">Use <strong className="text-cyan-400">data</strong> as your table name</span>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'h-7 px-3 bg-cyan-500 hover:bg-cyan-400 text-black text-xs disabled:opacity-50'
                )}
              >
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                {isRunning ? 'Running...' : 'Run Query'}
              </button>
            </div>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              className="flex-1 w-full bg-transparent text-sm font-mono text-white/90 p-4 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-hidden relative bg-[#0a0a12]">
            {error ? (
              <div className="p-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-red-400 mb-1">SQL Error</h3>
                    <p className="text-xs text-red-300/80 font-mono">{error}</p>
                  </div>
                </div>
              </div>
            ) : result ? (
              <div className="h-full flex flex-col">
                <div className="px-4 py-2 border-b border-white/6 flex items-center justify-between bg-white/[0.02]">
                  <span className="text-xs text-white/60">
                    <strong className="text-white">{result.rows.length}</strong> rows returned
                  </span>
                  <span className="text-[10px] text-white/30 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {result.executionTimeMs}ms
                  </span>
                </div>
                <CleaningPreview schema={result.schema} rows={result.rows} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/30 text-sm">
                Run a query to see results here.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal Overlay */}
      {isSaving && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0f0f18] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Save Query</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. Top 10 Artists"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsSaving(false)} className="px-4 py-2 text-xs text-white/60 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={!saveName.trim()} className="px-4 py-2 bg-cyan-500 text-black text-xs font-bold rounded-lg disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
