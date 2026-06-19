'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Table2, ListTree, Activity, GitCommit, Download } from 'lucide-react';
import OverviewTab from './tabs/OverviewTab';
import PreviewTab from './tabs/PreviewTab';
import SchemaTab from './tabs/SchemaTab';
import ProfileTab from './tabs/ProfileTab';
import LineageTab from './tabs/LineageTab';
import ExportTab from './tabs/ExportTab';
import type { ParsedDataset } from '@/lib/6data/types';

interface DatasetTabsProps {
  dataset: ParsedDataset;
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, component: OverviewTab },
  { id: 'preview', label: 'Preview', icon: Table2, component: PreviewTab },
  { id: 'schema', label: 'Schema', icon: ListTree, component: SchemaTab },
  { id: 'profile', label: 'Profile', icon: Activity, component: ProfileTab },
  { id: 'lineage', label: 'Lineage', icon: GitCommit, component: LineageTab },
  { id: 'export', label: 'Export', icon: Download, component: ExportTab },
] as const;

export default function DatasetTabs({ dataset }: DatasetTabsProps) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('overview');

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component ?? OverviewTab;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/6 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1 min-w-max pb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                } rounded-t-lg`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent dataset={dataset} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
