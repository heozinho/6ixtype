'use client';
import { Share2, Settings, Download, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import type { ParsedDataset } from '@/lib/6data/types';

interface DatasetHeaderProps {
  dataset: ParsedDataset;
}

export default function DatasetHeader({ dataset }: DatasetHeaderProps) {
  const router = useRouter();
  const { removeDataset } = useDatasetStore();

  const typeColour: Record<string, string> = {
    csv: '#06b6d4',
    json: '#8b5cf6',
    demo: '#10b981',
    manual: '#f59e0b',
  };

  function handleDelete() {
    if (confirm('Are you sure you want to delete this dataset? This cannot be undone.')) {
      removeDataset(dataset.id);
      router.push('/6data/app/datasets');
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/6">
      <div className="space-y-2">
        <Link
          href="/6data/app/datasets"
          className="inline-flex items-center gap-1.5 text-[10px] text-white/40 hover:text-cyan-400 transition-colors uppercase tracking-widest font-semibold mb-2"
        >
          <ArrowLeft className="w-3 h-3" />
          Datasets
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-white tracking-tight">{dataset.name}</h1>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
            style={{
              color: typeColour[dataset.sourceType] ?? '#94a3b8',
              backgroundColor: `${typeColour[dataset.sourceType] ?? '#94a3b8'}18`,
            }}
          >
            {dataset.sourceType}
          </span>
        </div>
        <p className="text-xs text-white/40">
          ID: {dataset.id} · Imported {new Date(dataset.importedAt).toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'text-xs h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/5'
          )}
        >
          <Share2 className="w-3.5 h-3.5 mr-1.5" />
          Share
        </button>
        <Link
          href={`/6data/app/cleaning?id=${dataset.id}`}
          className={cn(
            buttonVariants({ size: 'sm' }),
            'text-xs h-8 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20'
          )}
        >
          <Settings className="w-3.5 h-3.5 mr-1.5" />
          Clean Data
        </Link>
        <button
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'text-xs h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/5'
          )}
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export
        </button>
        <button
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'text-xs h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/5 px-2'
          )}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'text-xs h-8 border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2'
          )}
          title="Delete dataset"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
