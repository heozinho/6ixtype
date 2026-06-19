'use client';
import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import type { ParsedDataset } from '@/lib/6data/types';

interface PreviewTabProps {
  dataset: ParsedDataset;
}

const PAGE_SIZE = 20;

function CellValue({ value, type }: { value: string; type: string }) {
  const isEmpty = value === '' || value === 'null' || value === 'NULL' || value === 'N/A';
  if (isEmpty) {
    return <span className="text-white/20 italic text-[11px]">null</span>;
  }
  if (type === 'integer' || type === 'decimal') {
    return <span className="text-cyan-300 font-mono text-[11px] tabular-nums">{value}</span>;
  }
  if (type === 'date' || type === 'datetime') {
    return <span className="text-pink-300 text-[11px] font-mono">{value}</span>;
  }
  if (type === 'boolean') {
    const isTrue = ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
    return (
      <span className={`text-[11px] font-bold ${isTrue ? 'text-emerald-400' : 'text-red-400'}`}>
        {value}
      </span>
    );
  }
  if (type === 'category') {
    return <span className="text-violet-300 text-[11px]">{value}</span>;
  }
  return <span className="text-white/65 text-[11px]">{value}</span>;
}

export default function PreviewTab({ dataset }: PreviewTabProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [showColMenu, setShowColMenu] = useState(false);

  const colTypeMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of dataset.schema) m[c.name] = c.finalType;
    return m;
  }, [dataset.schema]);

  const visibleHeaders = dataset.rawHeaders.filter((h) => !hiddenCols.has(h));

  const filtered = useMemo(() => {
    if (!search.trim()) return dataset.rows;
    const q = search.toLowerCase();
    return dataset.rows.filter((row) =>
      Object.values(row).some((v) => v.toLowerCase().includes(q))
    );
  }, [dataset.rows, search]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol] ?? '';
      const bv = b[sortCol] ?? '';
      const type = colTypeMap[sortCol];
      if (type === 'integer' || type === 'decimal') {
        const diff = (parseFloat(av) || 0) - (parseFloat(bv) || 0);
        return sortDir === 'asc' ? diff : -diff;
      }
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortCol, sortDir, colTypeMap]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageRows = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSort(col: string) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
    setPage(0);
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ArrowUpDown className="w-3 h-3 text-white/20" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-cyan-400" />
      : <ArrowDown className="w-3 h-3 text-cyan-400" />;
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search rows…"
            className="w-full bg-white/4 border border-white/8 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white/60 placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40 transition-all"
          />
        </div>
        <div className="text-[10px] text-white/30 ml-auto">
          {sorted.length.toLocaleString()} row{sorted.length !== 1 ? 's' : ''} · {dataset.rawHeaders.length} cols
        </div>
        <div className="relative">
          <button
            onClick={() => setShowColMenu((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 bg-white/4 text-xs text-white/50 hover:text-white/80 hover:bg-white/8 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Columns
          </button>
          {showColMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowColMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-white/10 bg-[#13131f] shadow-2xl shadow-black/60 overflow-hidden">
                <div className="p-2 space-y-0.5 max-h-64 overflow-y-auto">
                  {dataset.rawHeaders.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHiddenCols((prev) => {
                        const next = new Set(prev);
                        if (next.has(h)) next.delete(h); else next.add(h);
                        return next;
                      })}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      {hiddenCols.has(h)
                        ? <EyeOff className="w-3 h-3 text-white/25 flex-shrink-0" />
                        : <Eye className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                      <span className="text-xs text-white/60 truncate">{h}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/6 bg-white/[0.03]">
                <th className="px-3 py-2.5 text-[10px] font-bold text-white/25 w-12 text-right">#</th>
                {visibleHeaders.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 whitespace-nowrap cursor-pointer group"
                    onClick={() => toggleSort(h)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-white/55 group-hover:text-white/80 transition-colors">
                        {h}
                      </span>
                      <SortIcon col={h} />
                    </div>
                    <div className="text-[9px] text-white/20 mt-0.5 font-normal">
                      {colTypeMap[h] ?? 'text'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {pageRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-white/[0.025] transition-colors">
                  <td className="px-3 py-2 text-[10px] text-white/20 text-right font-mono tabular-nums">
                    {page * PAGE_SIZE + ri + 1}
                  </td>
                  {visibleHeaders.map((h) => (
                    <td key={h} className="px-3 py-2 whitespace-nowrap max-w-[200px] truncate">
                      <CellValue value={row[h] ?? ''} type={colTypeMap[h] ?? 'text'} />
                    </td>
                  ))}
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={visibleHeaders.length + 1} className="px-3 py-8 text-center text-xs text-white/25">
                    No rows match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/30">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of{' '}
            {sorted.length.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-white/8 text-white/40 hover:text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-white/35 px-2">
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-white/8 text-white/40 hover:text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
