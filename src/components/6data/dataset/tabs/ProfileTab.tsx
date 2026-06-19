'use client';
import { motion } from 'framer-motion';
import type { ParsedDataset } from '@/lib/6data/types';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface ProfileTabProps {
  dataset: ParsedDataset;
}

export default function ProfileTab({ dataset }: ProfileTabProps) {
  const p = dataset.profile;

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Rows', value: p.rowCount.toLocaleString() },
          { label: 'Total Columns', value: p.columnCount },
          { label: 'Duplicate Rows', value: p.duplicateRows },
          { label: 'Missing Cells', value: `${p.missingCellsTotal.toLocaleString()} (${p.missingCellsPct.toFixed(1)}%)` },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border border-white/8 bg-white/[0.025]"
          >
            <p className="text-xl font-black text-white mb-1">{s.value}</p>
            <p className="text-xs text-white/40 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quality Dimensions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {p.qualityDimensions.map((dim, i) => {
          const colour = dim.score >= 90 ? '#10b981' : dim.score >= 70 ? '#f59e0b' : '#ef4444';
          const Icon = dim.score >= 90 ? CheckCircle2 : dim.score >= 70 ? Info : AlertTriangle;

          return (
            <motion.div
              key={dim.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-4 p-5 rounded-xl border border-white/8 bg-white/[0.025]"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border flex-shrink-0"
                style={{ backgroundColor: `${colour}15`, borderColor: `${colour}30`, color: colour }}
              >
                <span className="text-sm font-black">{dim.score}%</span>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white/80">{dim.label}</h3>
                  <Icon className="w-3.5 h-3.5" style={{ color: colour }} />
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{dim.detail}</p>
                <div className="w-full h-1.5 bg-white/6 rounded-full mt-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colour }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
