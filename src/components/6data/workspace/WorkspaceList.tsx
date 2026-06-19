'use client';
import { mockWorkspaces } from '@/data/6data-workspaces';
import WorkspaceCard from './WorkspaceCard';

export default function WorkspaceList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockWorkspaces.map((ws, i) => (
        <WorkspaceCard key={ws.id} workspace={ws} index={i} />
      ))}
    </div>
  );
}
