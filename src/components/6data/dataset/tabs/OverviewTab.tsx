'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, ChartColumn, HelpCircle, Calendar, Hash, Type, Tag } from 'lucide-react';
import QualityScore from '../QualityScore';
import type { ParsedDataset } from '@/lib/6data/types';

const typeIcons: Record<string, React.ReactNode> = {
  integer: <Hash className="w-3 h-3" />,
  decimal: <Hash className="w-3 h-3" />,
  text: <Type className="w-3 h-3" />,
  category: <Tag className="w-3 h-3" />,
  date: <Calendar className="w-3 h-3" />,
  datetime: <Calendar className="w-3 h-3" />,
  boolean: <span className="text-[9px] font-bold">01</span>,
  url: <span className="text-[9px]">URL</span>,
  email: <span className="text-[9px]">@</span>,
  unknown: <span className="text-[9px]">?</span>,
};

const typeColours: Record<string, string> = {
  integer: '#60a5fa',
  decimal: '#34d399',
  text: '#94a3b8',
  category: '#a78bfa',
  date: '#f472b6',
  datetime: '#fb923c',
  boolean: '#facc15',
  url: '#22d3ee',
  email: '#22d3ee',
  unknown: '#64748b',
};

interface OverviewTabProps {
  dataset: ParsedDataset;
}

export default function OverviewTab({ dataset }: OverviewTabProps) {
  const p = dataset.profile;

  return (
    <div className="space-y-5">
      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Rows', value: p.rowCount.toLocaleString() },
          { label: 'Columns', value: p.columnCount.toString() },
          { label: 'Duplicate Rows', value: p.duplicateRows.toString() },
          { label: 'Missing Cells', value: `${p.missingCellsPct.toFixed(1)}%` },
        ].map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-xl border border-white/8 bg-white/[0.025] text-center"
          >
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-[10px] text-white/35 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quality score */}
      <QualityScore score={p.qualityScore} dimensions={p.qualityDimensions} />

      {/* Column type summary */}
      <div className="p-5 rounded-xl border border-white/8 bg-white/[0.025]">
        <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">
          Column Types
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Numeric', count: p.numericColumnCount, colour: '#60a5fa' },
            { label: 'Categorical', count: p.categoricalColumnCount, colour: '#a78bfa' },
            { label: 'Text', count: p.textColumnCount, colour: '#94a3b8' },
          ].map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
              style={{ borderColor: `${t.colour}25`, backgroundColor: `${t.colour}10` }}
            >
              <span className="text-sm font-black" style={{ color: t.colour }}>{t.count}</span>
              <span className="text-xs text-white/50">{t.label}</span>
            </div>
          ))}
        </div>
        {p.detectedDateRange && (
          <p className="text-xs text-white/35 mt-3">
            Date range: <span className="text-white/55">{p.detectedDateRange.min}</span> →{' '}
            <span className="text-white/55">{p.detectedDateRange.max}</span> ({p.detectedDateRange.column})
          </p>
        )}
      </div>

      {/* Warnings */}
      {p.warnings.length > 0 && (
        <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Warnings ({p.warnings.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {p.warnings.map((w, i) => (
              <li key={i} className="text-xs text-white/55 flex gap-2">
                <span className="text-amber-400/60 flex-shrink-0">·</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested questions */}
      {p.suggestedQuestions.length > 0 && (
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.025]">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
              Suggested Questions
            </h3>
          </div>
          <ul className="space-y-2">
            {p.suggestedQuestions.map((q, i) => (
              <li key={i} className="text-xs text-white/60 flex gap-2">
                <span className="text-cyan-400/60 flex-shrink-0 font-bold">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested charts */}
      {p.suggestedCharts.length > 0 && (
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.025]">
          <div className="flex items-center gap-2 mb-3">
            <ChartColumn className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
              Suggested Charts
            </h3>
          </div>
          <div className="space-y-2">
            {p.suggestedCharts.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/4 border border-white/6"
              >
                <span className="text-[10px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 rounded-full flex-shrink-0">
                  {c.type}
                </span>
                <div>
                  <p className="text-[11px] text-white/60">{c.reason}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    Columns: {c.columns.join(', ')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
