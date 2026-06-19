'use client';
import { useState } from 'react';
import type { SchemaColumn, ColumnType } from '@/lib/6data/types';
import { Search, Hash, Type, ToggleLeft, Calendar, Link as LinkIcon, Mail, Tag, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CleaningPreviewProps {
  schema: SchemaColumn[];
  rows: Record<string, string>[];
}

const getTypeIcon = (type: ColumnType) => {
  switch (type) {
    case 'integer':
    case 'decimal':
      return <Hash className="w-3 h-3" />;
    case 'text':
      return <Type className="w-3 h-3" />;
    case 'boolean':
      return <ToggleLeft className="w-3 h-3" />;
    case 'date':
    case 'datetime':
      return <Calendar className="w-3 h-3" />;
    case 'url':
      return <LinkIcon className="w-3 h-3" />;
    case 'email':
      return <Mail className="w-3 h-3" />;
    case 'category':
      return <Tag className="w-3 h-3" />;
    default:
      return <HelpCircle className="w-3 h-3" />;
  }
};

const getTypeColour = (type: ColumnType) => {
  switch (type) {
    case 'integer':
    case 'decimal':
      return 'text-blue-400';
    case 'boolean':
      return 'text-purple-400';
    case 'date':
    case 'datetime':
      return 'text-emerald-400';
    case 'category':
      return 'text-amber-400';
    case 'url':
    case 'email':
      return 'text-pink-400';
    default:
      return 'text-white/60';
  }
};

export default function CleaningPreview({ schema, rows }: CleaningPreviewProps) {
  const [search, setSearch] = useState('');

  // Filter rows
  const filteredRows = search
    ? rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      )
    : rows;

  const displayRows = filteredRows.slice(0, 50);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0f0f18]">
      <div className="p-4 border-b border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white">Preview</h2>
          <p className="text-[10px] text-white/40">
            {displayRows.length} of {filteredRows.length} rows visible
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search preview data…"
            className="w-full bg-white/4 border border-white/8 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white/60 placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/6">
              <th className="px-3 py-2 text-[10px] font-bold text-white/30 text-right w-12 sticky left-0 bg-[#0f0f18] z-20 border-r border-white/6">
                #
              </th>
              {schema.map((col) => (
                <th key={col.name} className="px-3 py-2 whitespace-nowrap bg-white/[0.02] sticky top-0 z-10 border-b border-white/6">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-white/40", getTypeColour(col.finalType))}>
                      {getTypeIcon(col.finalType)}
                    </span>
                    <span className="text-[11px] font-bold text-white/80">{col.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {displayRows.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-3 py-2 text-[10px] text-white/25 text-right font-mono tabular-nums sticky left-0 bg-[#0f0f18] border-r border-white/6 z-10">
                  {i + 1}
                </td>
                {schema.map((col) => {
                  const val = row[col.name];
                  const isEmpty = val === undefined || val === null || val === '';
                  return (
                    <td key={col.name} className="px-3 py-1.5 whitespace-nowrap max-w-[300px] truncate">
                      {isEmpty ? (
                        <span className="text-[10px] text-white/15 italic">null</span>
                      ) : (
                        <span className={cn("text-[11px]", getTypeColour(col.finalType))}>
                          {val}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {displayRows.length === 0 && (
              <tr>
                <td colSpan={schema.length + 1} className="p-8 text-center text-xs text-white/40">
                  No rows found matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
