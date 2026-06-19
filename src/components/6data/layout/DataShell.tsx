'use client';
import { useState } from 'react';
import DataSidebar from '@/components/6data/layout/DataSidebar';
import DataTopbar from '@/components/6data/layout/DataTopbar';
import { DatasetStoreProvider } from '@/contexts/DatasetStoreContext';

interface DataAppShellProps {
  children: React.ReactNode;
}

export default function DataShell({ children }: DataAppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <DatasetStoreProvider>
      <div className="flex h-screen bg-[#0a0a12] text-white overflow-hidden">
        {/* Sidebar */}
        <DataSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

        {/* Main */}
        <div className="flex flex-col flex-1 min-w-0">
          <DataTopbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </DatasetStoreProvider>
  );
}
