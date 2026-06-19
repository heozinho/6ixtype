'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { LayoutDashboard, Plus, Trash2, ArrowRight } from 'lucide-react';
import { dashboardStore } from '@/lib/6data/store';

export default function DashboardsPage() {
  const router = useRouter();
  const { dashboards, removeDashboard, refresh } = useDatasetStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newDashName, setNewDashName] = useState('');

  const handleCreate = () => {
    if (!newDashName.trim()) return;
    const newId = dashboardStore.generateId();
    dashboardStore.add({
      id: newId,
      name: newDashName,
      widgets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    refresh();
    setIsCreating(false);
    setNewDashName('');
    router.push(`/6data/app/dashboards/${newId}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a12] p-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white mb-2">Dashboards</h1>
          <p className="text-sm text-white/40">Combine charts to build custom views.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Dashboard
        </button>
      </div>

      {dashboards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <LayoutDashboard className="w-6 h-6 text-white/40" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No dashboards yet</h3>
          <p className="text-sm text-white/40 mb-6">Create a dashboard to organise your saved charts.</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
          >
            Create Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dash) => (
            <div key={dash.id} className="group flex flex-col bg-[#0f0f18] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeDashboard(dash.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{dash.name}</h3>
              <p className="text-xs text-white/40 mb-6 uppercase tracking-widest">
                {dash.widgets.length} Widget{dash.widgets.length !== 1 ? 's' : ''}
              </p>

              <div className="mt-auto">
                <Link
                  href={`/6data/app/dashboards/${dash.id}`}
                  className="inline-flex items-center gap-2 text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0f0f18] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4">New Dashboard</h3>
            <input
              type="text"
              value={newDashName}
              onChange={(e) => setNewDashName(e.target.value)}
              placeholder="e.g. Sales Overview"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-cyan-500/50"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-xs text-white/60 hover:text-white">Cancel</button>
              <button onClick={handleCreate} disabled={!newDashName.trim()} className="px-4 py-2 bg-cyan-500 text-black text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-cyan-400">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
