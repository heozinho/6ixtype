import { Plus } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import WorkspaceList from '@/components/6data/workspace/WorkspaceList';

export default function WorkspacesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Workspaces</h1>
          <p className="text-sm text-white/50 mt-1">
            Organise your datasets, pipelines, and dashboards.
          </p>
        </div>
        <button
          className={cn(
            buttonVariants({ size: 'sm' }),
            'bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/20'
          )}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Workspace
        </button>
      </div>

      <WorkspaceList />
    </div>
  );
}
