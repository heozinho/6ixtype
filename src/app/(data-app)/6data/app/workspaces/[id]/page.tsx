'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Database, Activity, Search } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import DatasetList from '@/components/6data/dataset/DatasetList';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import type { MockWorkspace } from '@/data/6data-workspaces';

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { workspaces } = useDatasetStore();
  const [workspace, setWorkspace] = useState<MockWorkspace | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setWorkspace(workspaces.find((w) => w.id === id));
    setMounted(true);
  }, [workspaces, id]);

  if (!mounted) return null;
  if (!workspace) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl text-white font-bold">Workspace Not Found</h1>
        <button onClick={() => router.push('/6data/app/workspaces')} className="mt-4 text-cyan-400">Return to Workspaces</button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/6 mb-8">
        <div className="space-y-2">
          <Link
            href="/6data/app/workspaces"
            className="inline-flex items-center gap-1.5 text-[10px] text-white/40 hover:text-cyan-400 transition-colors uppercase tracking-widest font-semibold mb-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Workspaces
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{workspace.icon}</span>
            <h1 className="text-2xl font-black text-white tracking-tight">{workspace.name}</h1>
          </div>
          <p className="text-sm text-white/40">{workspace.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'text-xs h-8 border-white/10 text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.025] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="text-xl font-black text-white">{workspace.datasetCount}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Datasets</p>
          </div>
        </div>
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.025] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-xl font-black text-white">{workspace.dashboardCount}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Dashboards</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Datasets</h2>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
            <input
              type="text"
              placeholder="Search datasets…"
              className="w-full bg-white/4 border border-white/8 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white/60 placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40 transition-all"
            />
          </div>
        </div>
        <DatasetList />
      </div>
    </div>
  );
}
