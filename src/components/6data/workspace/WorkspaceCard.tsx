'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Database } from 'lucide-react';
import type { MockWorkspace } from '@/data/6data-workspaces';

interface WorkspaceCardProps {
  workspace: MockWorkspace;
  index: number;
}

export default function WorkspaceCard({ workspace, index }: WorkspaceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <Link
        href={`/6data/app/workspaces/${workspace.id}`}
        className="group block p-5 rounded-xl border border-white/8 bg-white/[0.025] hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-all duration-200"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{workspace.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-white/85 group-hover:text-cyan-300 transition-colors">
                {workspace.name}
              </h3>
              <p className="text-xs text-white/35 mt-0.5">{workspace.description}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors mt-0.5 flex-shrink-0" />
        </div>

        <div className="flex items-center gap-4 text-[10px] text-white/30">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            {workspace.datasetCount} dataset{workspace.datasetCount !== 1 ? 's' : ''}
          </span>
          <span>·</span>
          <span>{workspace.dashboardCount} dashboard{workspace.dashboardCount !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>Active {workspace.lastActive}</span>
        </div>
      </Link>
    </motion.div>
  );
}
