'use client';
import { useState } from 'react';
import { Type, Hash, Calendar, ToggleLeft, Link as LinkIcon, Mail, Tag, HelpCircle, AlertTriangle } from 'lucide-react';
import type { SchemaColumn, ColumnType } from '@/lib/6data/types';
import { cn } from '@/lib/utils';

interface SchemaReviewPanelProps {
  schema: SchemaColumn[];
  onTypeChange: (columnName: string, newType: ColumnType) => void;
}

const TYPE_OPTIONS: { value: ColumnType; label: string; icon: React.ReactNode }[] = [
  { value: 'text', label: 'Text', icon: <Type className="w-3.5 h-3.5" /> },
  { value: 'integer', label: 'Integer', icon: <Hash className="w-3.5 h-3.5" /> },
  { value: 'decimal', label: 'Decimal', icon: <Hash className="w-3.5 h-3.5" /> },
  { value: 'boolean', label: 'Boolean', icon: <ToggleLeft className="w-3.5 h-3.5" /> },
  { value: 'date', label: 'Date', icon: <Calendar className="w-3.5 h-3.5" /> },
  { value: 'datetime', label: 'DateTime', icon: <Calendar className="w-3.5 h-3.5" /> },
  { value: 'category', label: 'Category', icon: <Tag className="w-3.5 h-3.5" /> },
  { value: 'url', label: 'URL', icon: <LinkIcon className="w-3.5 h-3.5" /> },
  { value: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
  { value: 'unknown', label: 'Unknown', icon: <HelpCircle className="w-3.5 h-3.5" /> },
];

export default function SchemaReviewPanel({ schema, onTypeChange }: SchemaReviewPanelProps) {
  const [editingCol, setEditingCol] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-sm font-bold text-white">Review inferred schema</h3>
          <p className="text-xs text-white/40 mt-0.5">We detected types for {schema.length} columns. Review and adjust if necessary.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {schema.map((col) => {
          const currentType = TYPE_OPTIONS.find((t) => t.value === col.finalType) ?? TYPE_OPTIONS[0];
          const isUnknown = col.finalType === 'unknown';
          const hasMissing = col.missingCount > 0;

          return (
            <div
              key={col.name}
              className={cn(
                'p-3 rounded-xl border transition-colors',
                isUnknown ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/8 bg-white/[0.02]'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-white/90 truncate flex-1" title={col.name}>
                  {col.name}
                </span>
                {hasMissing && (
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Nulls
                  </div>
                )}
              </div>

              <div className="relative">
                <select
                  value={col.finalType}
                  onChange={(e) => onTypeChange(col.name, e.target.value as ColumnType)}
                  onFocus={() => setEditingCol(col.name)}
                  onBlur={() => setEditingCol(null)}
                  className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg pl-8 pr-8 py-1.5 text-xs text-white/80 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  {currentType.icon}
                </div>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
