'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import type { ParsedDataset } from '@/lib/6data/types';

interface DatasetCardProps {
  dataset: ParsedDataset;
  index: number;
}

const typeColour: Record<string, string> = {
  csv: '#06b6d4',
  json: '#8b5cf6',
  demo: '#10b981',
  manual: '#f59e0b',
};

function qualityColour(score: number): string {
  if (score >= 90) return '#10b981';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
}

export default function DatasetCard({ dataset, index }: DatasetCardProps) {
  const qColour = qualityColour(dataset.profile.qualityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <Link
        href={`/6data/app/datasets/${dataset.id}`}
        className="group block p-5 rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white/85 group-hover:text-white truncate">
              {dataset.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                style={{
                  color: typeColour[dataset.sourceType] ?? '#94a3b8',
                  backgroundColor: `${typeColour[dataset.sourceType] ?? '#94a3b8'}18`,
                }}
              >
                {dataset.sourceType}
              </span>
              <span className="text-[10px] text-white/30">
                {dataset.profile.rowCount.toLocaleString()} rows · {dataset.profile.columnCount} cols
              </span>
            </div>
          </div>

          {/* Quality score */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {dataset.profile.warnings.length > 0 && (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span
              className="text-xs font-black tabular-nums"
              style={{ color: qColour }}
            >
              {dataset.profile.qualityScore}%
            </span>
          </div>
        </div>

        {/* Quality bar */}
        <div className="w-full h-1 bg-white/6 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${dataset.profile.qualityScore}%`,
              backgroundColor: qColour,
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/25">
            Imported {new Date(dataset.importedAt).toLocaleDateString()}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
