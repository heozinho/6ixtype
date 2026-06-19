'use client';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import WorkspaceCard from './WorkspaceCard';

export default function WorkspaceList() {
  const { workspaces } = useDatasetStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspaces.map((ws, i) => (
        <WorkspaceCard key={ws.id} workspace={ws} index={i} />
      ))}
    </div>
  );
}
