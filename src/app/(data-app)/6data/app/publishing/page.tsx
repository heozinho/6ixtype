'use client';
import { useState } from 'react';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { Share2, Download, FileJson, FileText, Database, FlaskConical, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublishingHubPage() {
  const { datasets, queries, researchNotes } = useDatasetStore();
  const [activeTab, setActiveTab] = useState<'datasets' | 'queries' | 'research'>('datasets');

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportDatasetCSV = (dataset: any) => {
    if (!dataset.rows || dataset.rows.length === 0) return;
    const headers = dataset.schema.map((c: any) => c.name);
    const csvContent = [
      headers.join(','),
      ...dataset.rows.map((r: any) => headers.map((h: string) => JSON.stringify(r[h] ?? '')).join(','))
    ].join('\n');
    downloadFile(`${dataset.name.replace(/\s+/g, '_')}.csv`, csvContent, 'text/csv;charset=utf-8;');
  };

  const exportDatasetJSON = (dataset: any) => {
    downloadFile(`${dataset.name.replace(/\s+/g, '_')}.json`, JSON.stringify(dataset.rows, null, 2), 'application/json');
  };

  const exportResearchMD = (note: any) => {
    downloadFile(`${note.title.replace(/\s+/g, '_')}.md`, note.content, 'text/markdown');
  };

  return (
    <div className="p-5 max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Publishing Hub</h1>
          <p className="text-sm text-white/40">Export your datasets, query results, and research notes.</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-px">
        {[
          { id: 'datasets', label: 'Datasets', icon: Database, count: datasets.length },
          { id: 'queries', label: 'Saved Queries', icon: LayoutTemplate, count: queries.length },
          { id: 'research', label: 'Research Notes', icon: FlaskConical, count: researchNotes?.length || 0 },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                isActive ? 'border-violet-500 text-violet-400' : 'border-transparent text-white/40 hover:text-white/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              <span className="ml-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/60">{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'datasets' && datasets.length === 0 && (
          <div className="col-span-full py-10 text-center text-white/30 text-sm">No datasets available to export.</div>
        )}
        {activeTab === 'datasets' && datasets.map(ds => (
          <div key={ds.id} className="p-5 rounded-xl border border-white/10 bg-[#0f0f18] hover:border-violet-500/30 transition-colors group">
            <h3 className="text-sm font-bold text-white mb-1 truncate">{ds.name}</h3>
            <p className="text-xs text-white/40 mb-4">{ds.rows.length} rows · {ds.schema.length} columns</p>
            <div className="flex items-center gap-2">
              <button onClick={() => exportDatasetCSV(ds)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                CSV
              </button>
              <button onClick={() => exportDatasetJSON(ds)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-colors">
                <FileJson className="w-3.5 h-3.5 text-amber-400" />
                JSON
              </button>
            </div>
          </div>
        ))}

        {activeTab === 'queries' && queries.length === 0 && (
          <div className="col-span-full py-10 text-center text-white/30 text-sm">No saved queries available. Execute queries in the Lab first.</div>
        )}
        {activeTab === 'queries' && queries.map(q => (
          <div key={q.id} className="p-5 rounded-xl border border-white/10 bg-[#0f0f18] flex flex-col">
            <h3 className="text-sm font-bold text-white mb-2 truncate">{q.name}</h3>
            <div className="flex-1 bg-black/40 rounded p-2 mb-4 overflow-x-auto">
              <code className="text-[10px] text-cyan-400 whitespace-nowrap">{q.sql}</code>
            </div>
            <p className="text-[10px] text-white/40">Run query in Lab to export results.</p>
          </div>
        ))}

        {activeTab === 'research' && (!researchNotes || researchNotes.length === 0) && (
          <div className="col-span-full py-10 text-center text-white/30 text-sm">No research notes available. Create one in the Research Workspace.</div>
        )}
        {activeTab === 'research' && researchNotes && researchNotes.map(rn => (
          <div key={rn.id} className="p-5 rounded-xl border border-white/10 bg-[#0f0f18] hover:border-violet-500/30 transition-colors group flex flex-col">
            <h3 className="text-sm font-bold text-white mb-1 truncate">{rn.title}</h3>
            <p className="text-xs text-white/40 line-clamp-2 mb-4 flex-1">{rn.content || 'Empty note'}</p>
            <button onClick={() => exportResearchMD(rn)} className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-lg text-xs font-bold text-violet-300 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download Markdown
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
