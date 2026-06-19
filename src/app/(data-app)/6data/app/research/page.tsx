'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { BookOpen, Plus, SaveAll, Download, Trash2, Link as LinkIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChartRenderer from '@/components/6data/visualise/ChartRenderer';
import { applyCleaningSteps } from '@/lib/6data/cleaning-engine';
import { researchStore } from '@/lib/6data/store';
import type { ResearchNote } from '@/lib/6data/types';

function ResearchContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const router = useRouter();

  const { researchNotes, addResearchNote, updateResearchNote, removeResearchNote, charts, datasets } = useDatasetStore();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(idParam || (researchNotes.length > 0 ? researchNotes[0].id : ''));
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const activeNote = researchNotes.find((n) => n.id === selectedNoteId);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const noteId = researchStore.generateId();
    addResearchNote({
      id: noteId,
      title: newTitle,
      content: `# ${newTitle}\n\nWrite your findings here...`,
      linkedChartIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setNewTitle('');
    setIsCreating(false);
    setSelectedNoteId(noteId);
    router.push(`/6data/app/research?id=${noteId}`);
  };

  const handleExport = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeNote.title.toLowerCase().replace(/\s+/g, '-')}-research.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a12]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/6 bg-[#0f0f18] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">Research Workspace</h1>
            <p className="text-[10px] text-white/40 leading-none">Document findings and export to Markdown</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeNote && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export .md
            </button>
          )}
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500 text-black text-xs font-bold rounded-lg hover:bg-cyan-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Note Selection */}
        <div className="w-64 border-r border-white/6 bg-[#0a0a0f] flex flex-col shrink-0">
          <div className="p-4 border-b border-white/6">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">Your Notes</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {researchNotes.length === 0 ? (
              <div className="p-4 text-center text-white/30 text-xs">
                No research notes yet. Create one to get started.
              </div>
            ) : (
              researchNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    router.push(`/6data/app/research?id=${note.id}`);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group",
                    selectedNoteId === note.id
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 shrink-0 opacity-50" />
                    <span className="text-sm font-medium truncate">{note.title}</span>
                  </div>
                  <div 
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeResearchNote(note.id);
                      if (selectedNoteId === note.id) setSelectedNoteId('');
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/40 hover:text-red-400" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        {activeNote ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className="flex-1 border-r border-white/6 flex flex-col">
              <div className="p-2 border-b border-white/6 bg-[#0f0f18] text-xs font-bold text-white/40 uppercase tracking-widest text-center">
                Markdown Editor
              </div>
              <textarea
                value={activeNote.content}
                onChange={(e) => updateResearchNote(activeNote.id, { content: e.target.value })}
                className="flex-1 w-full bg-transparent resize-none p-6 text-sm text-white/80 focus:outline-none font-mono leading-relaxed"
                placeholder="Write your research findings in Markdown..."
              />
              {/* Chart Linker Tool */}
              <div className="p-4 border-t border-white/6 bg-[#0a0a0f]">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                  Attach Saved Charts
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {charts.map((c) => {
                    const isLinked = activeNote.linkedChartIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          const newLinked = isLinked 
                            ? activeNote.linkedChartIds.filter(id => id !== c.id)
                            : [...activeNote.linkedChartIds, c.id];
                          updateResearchNote(activeNote.id, { linkedChartIds: newLinked });
                        }}
                        className={cn(
                          "shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                          isLinked 
                            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                        )}
                      >
                        <LinkIcon className="w-3 h-3" />
                        {c.name}
                      </button>
                    )
                  })}
                  {charts.length === 0 && (
                    <span className="text-xs text-white/30 italic">No saved charts available to link.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="w-[50%] flex flex-col bg-white">
              <div className="p-2 border-b border-black/10 bg-gray-100 text-xs font-bold text-black/40 uppercase tracking-widest text-center">
                Live Preview
              </div>
              <div className="flex-1 overflow-y-auto p-8 prose prose-sm max-w-none text-black">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeNote.content}
                </ReactMarkdown>

                {activeNote.linkedChartIds.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-6">Linked Charts</h3>
                    <div className="space-y-8">
                      {activeNote.linkedChartIds.map((chartId) => {
                        const chart = charts.find(c => c.id === chartId);
                        if (!chart) return null;
                        const dataset = datasets.find(d => d.id === chart.datasetId);
                        return (
                          <div key={chart.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                            <h4 className="font-bold text-lg mb-1 text-black">{chart.name}</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                              {chart.type} chart · Dataset: {dataset?.name || 'Unknown'}
                            </p>
                            <div className="h-[300px]">
                              {dataset ? (
                                <ChartPreview chart={chart} dataset={dataset} />
                              ) : (
                                <p className="text-gray-400">Dataset missing</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
            Select a note or create a new one.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0f0f18] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4">New Research Note</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Q3 Sales Analysis"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-cyan-500/50"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-xs text-white/60 hover:text-white">Cancel</button>
              <button onClick={handleCreate} disabled={!newTitle.trim()} className="px-4 py-2 bg-cyan-500 text-black text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-cyan-400">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChartPreview({ chart, dataset }: { chart: any, dataset: any }) {
  const { rows } = useMemo(() => {
    return applyCleaningSteps(dataset.rows, dataset.schema, dataset.cleaningSteps);
  }, [dataset]);

  return (
    <ChartRenderer
      type={chart.type}
      data={rows.slice(0, 500)}
      xAxis={chart.xAxis}
      yAxis={chart.yAxis}
    />
  );
}

export default function ResearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white/40 text-sm">Loading workspace...</div>}>
      <ResearchContent />
    </Suspense>
  );
}
