'use client';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { notFound, useParams } from 'next/navigation';
import DatasetHeader from '@/components/6data/dataset/DatasetHeader';
import DatasetTabs from '@/components/6data/dataset/DatasetTabs';
import { use } from 'react';
import { Database } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DatasetPage() {
  const params = useParams();
  const id = params.id as string;
  const { getDataset } = useDatasetStore();

  const dataset = getDataset(id);

  if (!dataset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Database className="w-8 h-8 text-white/20" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Dataset not found</h1>
        <p className="text-sm text-white/40 mb-8 max-w-sm">
          The dataset you are looking for does not exist, has been deleted, or your browser storage was cleared.
        </p>
        <Link
          href="/6data/app/datasets"
          className={cn(buttonVariants({ variant: 'outline' }), 'border-white/10 text-white/60 hover:text-white')}
        >
          Return to Datasets
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-full">
      <DatasetHeader dataset={dataset} />
      <div className="mt-8">
        <DatasetTabs dataset={dataset} />
      </div>
    </div>
  );
}
