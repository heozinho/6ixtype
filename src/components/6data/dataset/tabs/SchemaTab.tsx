'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Hash, Type, Tag, Calendar, ToggleLeft, Link as LinkIcon, Mail, HelpCircle, AlertTriangle } from 'lucide-react';
import type { ParsedDataset, SchemaColumn, ColumnType } from '@/lib/6data/types';

const TYPE_CONFIG: Record<ColumnType, { icon: React.ReactNode; colour: string; label: string }> = {
  integer:  { icon: <Hash className="w-3.5 h-3.5" />, colour: '#60a5fa', label: 'Integer' },
  decimal:  { icon: <Hash className="w-3.5 h-3.5" />, colour: '#34d399', label: 'Decimal' },
  text:     { icon: <Type className="w-3.5 h-3.5" />, colour: '#94a3b8', label: 'Text' },
  category: { icon: <Tag className="w-3.5 h-3.5" />, colour: '#a78bfa', label: 'Category' },
  date:     { icon: <Calendar className="w-3.5 h-3.5" />, colour: '#f472b6', label: 'Date' },
  datetime: { icon: <Calendar className="w-3.5 h-3.5" />, colour: '#fb923c', label: 'DateTime' },
  boolean:  { icon: <ToggleLeft className="w-3.5 h-3.5" />, colour: '#facc15', label: 'Boolean' },
  url:      { icon: <LinkIcon className="w-3.5 h-3.5" />, colour: '#22d3ee', label: 'URL' },
  email:    { icon: <Mail className="w-3.5 h-3.5" />, colour: '#22d3ee', label: 'Email' },
  unknown:  { icon: <HelpCircle className="w-3.5 h-3.5" />, colour: '#64748b', label: 'Unknown' },
};

const ALL_TYPES: ColumnType[] = [
  'text', 'integer', 'decimal', 'boolean', 'date', 'datetime', 'category', 'url', 'email',
];

function MissingBar({ pct }: { pct: number }) {
  const colour = pct === 0 ? '#10b981' : pct < 10 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: colour }} />
      </div>
      <span className="text-[10px] tabular-nums font-medium" style={{ color: colour }}>
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

function ColumnRow({ col, index }: { col: SchemaColumn; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const tc = TYPE_CONFIG[col.finalType] ?? TYPE_CONFIG.unknown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      className="border border-white/8 rounded-xl overflow-hidden"
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-colors text-left"
      >
        <span className="text-[10px] text-white/20 tabular-nums w-5 flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Type badge */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg border flex-shrink-0"
          style={{ borderColor: `${tc.colour}30`, backgroundColor: `${tc.colour}12`, color: tc.colour }}
        >
          {tc.icon}
          <span className="text-[10px] font-bold">{tc.label}</span>
        </div>

        {/* Name */}
        <span className="text-sm font-bold text-white/80 flex-1 truncate">{col.name}</span>

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-white/30 flex-shrink-0">
          <span>{col.uniqueCount.toLocaleString()} unique</span>
          {col.missingCount > 0 && (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-3 h-3" />
              {col.missingCount} missing
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-white/25 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-white/6 bg-white/[0.015]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: stats */}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Completeness</p>
                <MissingBar pct={col.missingPct} />
                <p className="text-[10px] text-white/25 mt-1">
                  {col.missingCount} missing · {(col.uniqueCount).toLocaleString()} unique values
                </p>
              </div>

              {/* Numeric stats */}
              {(col.finalType === 'integer' || col.finalType === 'decimal') && col.min !== undefined && (
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Statistics</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Min', value: col.min },
                      { label: 'Max', value: col.max },
                      { label: 'Mean', value: col.mean },
                      { label: 'Median', value: col.median },
                      { label: 'Std Dev', value: col.stdDev },
                      { label: 'Outliers', value: col.outlierCount },
                    ].map((s) => (
                      <div key={s.label} className="p-2 rounded-lg bg-white/4 border border-white/6 text-center">
                        <p className="text-xs font-bold text-white/70 tabular-nums">
                          {s.value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? '—'}
                        </p>
                        <p className="text-[9px] text-white/30">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date range */}
              {(col.finalType === 'date' || col.finalType === 'datetime') && col.dateMin && (
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Date Range</p>
                  <p className="text-xs text-white/55 font-mono">
                    {col.dateMin} → {col.dateMax}
                  </p>
                </div>
              )}
            </div>

            {/* Right: top values */}
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">
                Top Values (by frequency)
              </p>
              <div className="space-y-1.5">
                {col.topValues.slice(0, 8).map((tv) => {
                  const maxCount = col.topValues[0]?.count ?? 1;
                  const pct = (tv.count / maxCount) * 100;
                  return (
                    <div key={tv.value} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] text-white/60 truncate max-w-[120px]">{tv.value}</span>
                          <span className="text-[10px] text-white/30 tabular-nums">{tv.count}</span>
                        </div>
                        <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: tc.colour + '80' }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sample values */}
          {col.sampleValues.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/6">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Sample Values</p>
              <div className="flex flex-wrap gap-1.5">
                {col.sampleValues.map((v, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-md border border-white/8 bg-white/4 text-white/50 font-mono"
                  >
                    {v || <em className="text-white/20">empty</em>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

interface SchemaTabProps {
  dataset: ParsedDataset;
}

export default function SchemaTab({ dataset }: SchemaTabProps) {
  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-white/8 bg-white/[0.025]">
        {Object.entries(
          dataset.schema.reduce<Record<string, number>>((acc, col) => {
            const label = TYPE_CONFIG[col.finalType]?.label ?? 'Unknown';
            acc[label] = (acc[label] ?? 0) + 1;
            return acc;
          }, {})
        ).map(([type, count]) => (
          <span key={type} className="text-xs text-white/50">
            <span className="font-bold text-white/75">{count}</span> {type}
          </span>
        ))}
      </div>

      {/* Column list */}
      <div className="space-y-2">
        {dataset.schema.map((col, i) => (
          <ColumnRow key={col.name} col={col} index={i} />
        ))}
      </div>
    </div>
  );
}
