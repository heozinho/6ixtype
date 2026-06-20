'use client';
import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { ChartColumn, ChartLine, ChartArea, ChartScatter, SaveAll, Database, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import ChartRenderer from '@/components/6data/visualise/ChartRenderer';
import { chartStore } from '@/lib/6data/store';
import type { ChartType, SavedChart } from '@/lib/6data/types';
import { applyCleaningSteps } from '@/lib/6data/cleaning-engine';

const CHART_TYPES: { type: ChartType; label: string; icon: any }[] = [
  { type: 'bar', label: 'Bar Chart', icon: ChartColumn },
  { type: 'line', label: 'Line Chart', icon: ChartLine },
  { type: 'area', label: 'Area Chart', icon: ChartArea },
  { type: 'scatter', label: 'Scatter Plot', icon: ChartScatter },
];

function VisualiseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const { datasets, charts, addChart } = useDatasetStore();

  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(idParam || datasets[0]?.id || '');
  const [selectedType, setSelectedType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState('');

  const dataset = datasets.find((ds) => ds.id === selectedDatasetId);

  // Derive transformed data (if cleaning steps exist)
  const { rows, schema } = useMemo(() => {
    if (!dataset) return { rows: [], schema: [] };
    return applyCleaningSteps(dataset.rows, dataset.schema, dataset.cleaningSteps);
  }, [dataset]);

  // Set default axes when dataset changes
  useMemo(() => {
    if (schema.length >= 2 && !xAxis && !yAxis) {
      setXAxis(schema[0].name);
      const numCol = schema.find((c) => c.finalType === 'integer' || c.finalType === 'decimal');
      setYAxis(numCol ? numCol.name : schema[1].name);
    }
  }, [schema, xAxis, yAxis]);

  const handleSave = () => {
    if (!dataset || !saveName.trim() || !xAxis || !yAxis) return;
    const c: SavedChart = {
      id: chartStore.generateId(),
      name: saveName,
      datasetId: dataset.id,
      type: selectedType,
      xAxis,
      yAxis,
      createdAt: new Date().toISOString(),
    };
    addChart(c);
    setIsSaving(false);
    setSaveName('');
  };

  if (datasets.length === 0) {
    return (
      <div className="p-10 max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-4">Visualisation Studio</h1>
        <p className="text-white/40">You need to import a dataset before you can build charts.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a12]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/6 bg-[#0f0f18] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <LayoutTemplate className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">Visualisation Studio</h1>
            <p className="text-[10px] text-white/40 leading-none">Build charts from your datasets</p>
          </div>
        </div>
        <button
          onClick={() => setIsSaving(true)}
          className={cn(buttonVariants({ size: 'sm' }), 'h-8 text-xs bg-cyan-500 text-black hover:bg-cyan-400')}
        >
          <SaveAll className="w-3.5 h-3.5 mr-1.5" />
          Save Chart
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Configuration */}
        <div className="w-72 border-r border-white/6 bg-[#0a0a0f] flex flex-col shrink-0 p-4 space-y-6 overflow-y-auto">
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Data Source</label>
            <div className="relative">
              <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <select
                value={selectedDatasetId}
                onChange={(e) => {
                  setSelectedDatasetId(e.target.value);
                  setXAxis('');
                  setYAxis('');
                }}
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 appearance-none"
              >
                {datasets.map((ds) => (
                  <option key={ds.id} value={ds.id}>{ds.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Chart Type</label>
            <div className="grid grid-cols-2 gap-2">
              {CHART_TYPES.map((ct) => {
                const Icon = ct.icon;
                return (
                  <button
                    key={ct.type}
                    onClick={() => setSelectedType(ct.type)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
                      selectedType === ct.type
                        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-[10px] font-bold">{ct.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">X-Axis (Dimension)</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="" disabled>Select column...</option>
                {schema.map((col) => (
                  <option key={col.name} value={col.name}>{col.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Y-Axis (Measure)</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="" disabled>Select column...</option>
                {schema.map((col) => (
                  <option key={col.name} value={col.name}>
                    {col.name} {col.finalType === 'integer' || col.finalType === 'decimal' ? '(Numeric)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col p-6 bg-[#0a0a12]">
          {dataset && xAxis && yAxis ? (
            <div className="flex-1 bg-[#0f0f18] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-lg font-bold text-white mb-1">
                {yAxis} by {xAxis}
              </h2>
              <p className="text-[10px] text-white/40 mb-6 uppercase tracking-widest">
                Dataset: {dataset.name} · {rows.length} records
              </p>
              <div className="flex-1 min-h-0 relative">
                <ChartRenderer
                  type={selectedType}
                  data={rows.slice(0, 500)} // Cap at 500 for MVP performance
                  xAxis={xAxis}
                  yAxis={yAxis}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-white/30 text-sm">
              Select axes to generate a chart preview.
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {isSaving && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0f0f18] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Save Chart</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. Sales by Month"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsSaving(false)} className="px-4 py-2 text-xs text-white/60 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={!saveName.trim() || !xAxis || !yAxis} className="px-4 py-2 bg-cyan-500 text-black text-xs font-bold rounded-lg disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Suspense } from 'react';
export default function VisualisePage() {
  return (
    <Suspense fallback={<div className="p-10 text-white/40 text-sm">Loading studio...</div>}>
      <VisualiseContent />
    </Suspense>
  );
}
