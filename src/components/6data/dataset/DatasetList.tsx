'use client';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import DatasetCard from './DatasetCard';
import { Database } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DatasetList() {
  const { datasets } = useDatasetStore();

  if (datasets.length === 0) {
    return (
      <div className="text-center py-20 px-4 rounded-xl border border-white/8 bg-white/[0.02] border-dashed">
        <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
          <Database className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-sm font-bold text-white mb-2">No datasets found</h3>
        <p className="text-xs text-white/40 max-w-sm mx-auto mb-6 leading-relaxed">
          You haven't imported any datasets yet. Try loading a demo dataset or uploading your own CSV/JSON file.
        </p>
        <Link
          href="/6data/app/import"
          className={cn(buttonVariants({ size: 'sm' }), 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/25')}
        >
          Import your first dataset
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {datasets.map((ds, i) => (
        <DatasetCard key={ds.id} dataset={ds} index={i} />
      ))}
    </div>
  );
}
