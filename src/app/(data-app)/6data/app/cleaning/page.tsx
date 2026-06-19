'use client';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { ArrowLeft, Database, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import type { CleaningStep, CleaningStepType } from '@/lib/6data/types';
import { applyCleaningSteps } from '@/lib/6data/cleaning-engine';

import CleaningSidebar from '@/components/6data/cleaning/CleaningSidebar';
import CleaningPreview from '@/components/6data/cleaning/CleaningPreview';
import StepBuilder from '@/components/6data/cleaning/StepBuilder';

function CleaningStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const { datasets, getDataset, updateDataset } = useDatasetStore();

  const [selectedId, setSelectedId] = useState<string | null>(idParam);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const dataset = selectedId ? getDataset(selectedId) : null;

  // Derive transformed data
  const { rows, schema } = useMemo(() => {
    if (!dataset) return { rows: [], schema: [] };
    return applyCleaningSteps(dataset.rows, dataset.schema, dataset.cleaningSteps);
  }, [dataset]);

  const handleAddStep = (type: CleaningStepType, config: Record<string, unknown>, description: string) => {
    if (!dataset) return;
    const newStep: CleaningStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stepType: type,
      config,
      description,
      appliedAt: new Date().toISOString(),
    };
    updateDataset(dataset.id, {
      cleaningSteps: [...dataset.cleaningSteps, newStep],
    });
    setIsBuilderOpen(false);
  };

  const handleRemoveStep = (index: number) => {
    if (!dataset) return;
    const newSteps = [...dataset.cleaningSteps];
    newSteps.splice(index, 1);
    updateDataset(dataset.id, {
      cleaningSteps: newSteps,
    });
  };

  if (!selectedId || !dataset) {
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto min-h-full">
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Cleaning Studio</h1>
        <p className="text-sm text-white/50 mb-8">Select a dataset to begin transforming it without altering the raw data.</p>
        
        <div className="space-y-3">
          {datasets.map((ds) => (
            <button
              key={ds.id}
              onClick={() => {
                setSelectedId(ds.id);
                router.replace(`/6data/app/cleaning?id=${ds.id}`);
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/50 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white/90 group-hover:text-white transition-colors">{ds.name}</h3>
                  <p className="text-[10px] text-white/40">{ds.rows.length} rows · {ds.cleaningSteps.length} cleaning steps applied</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60 text-xs font-bold border border-white/10 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                Select
              </div>
            </button>
          ))}
          {datasets.length === 0 && (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <p className="text-sm text-white/40 mb-4">No datasets found in your workspace.</p>
              <Link href="/6data/app/import" className={cn(buttonVariants({ size: 'sm' }), 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30')}>
                Import Dataset
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a12]">
      {/* Studio Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/6 bg-[#0f0f18] shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => { setSelectedId(null); router.replace('/6data/app/cleaning'); }} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">{dataset.name}</h1>
              <p className="text-[10px] text-white/40 leading-none">Cleaning Studio</p>
            </div>
          </div>
        </div>
        <Link 
          href={`/6data/app/datasets/${dataset.id}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'border-white/10 text-white/60 hover:text-white hover:bg-white/5')}
        >
          View Profile
        </Link>
      </div>

      {/* Studio Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        <CleaningSidebar 
          steps={dataset.cleaningSteps} 
          onOpenBuilder={() => setIsBuilderOpen(true)}
          onRemoveStep={handleRemoveStep}
        />
        
        <CleaningPreview 
          schema={schema}
          rows={rows}
        />

        {/* Builder Overlay */}
        {isBuilderOpen && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0f0f18] border border-white/10 rounded-2xl shadow-2xl p-6">
              <StepBuilder 
                schema={schema} // We pass the transformed schema so user can chain operations on new columns
                onAddStep={handleAddStep}
                onCancel={() => setIsBuilderOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CleaningStudioPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white/40 text-sm">Loading studio...</div>}>
      <CleaningStudioContent />
    </Suspense>
  );
}
