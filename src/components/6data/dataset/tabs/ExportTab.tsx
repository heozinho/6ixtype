'use client';
import { Download, FileJson, FileSpreadsheet, Database } from 'lucide-react';
import type { ParsedDataset } from '@/lib/6data/types';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExportTabProps {
  dataset: ParsedDataset;
}

export default function ExportTab({ dataset }: ExportTabProps) {
  function downloadAsJSON() {
    const dataStr = JSON.stringify(dataset.rows, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.name.replace(/\s+/g, '_')}_export.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadAsCSV() {
    if (dataset.rows.length === 0) return;
    const headers = Object.keys(dataset.rows[0]);
    const csvRows = dataset.rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? '';
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    );
    const csvStr = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.name.replace(/\s+/g, '_')}_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-2">
          <Download className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Export Dataset</h2>
        <p className="text-sm text-white/40 max-w-md mx-auto">
          Download the current state of this dataset. Includes all {dataset.rows.length} rows and {dataset.schema.length} columns.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CSV Export */}
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/20 transition-colors flex flex-col items-center text-center gap-4">
          <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white/90">CSV</h3>
            <p className="text-xs text-white/40 mt-1">Standard comma-separated values</p>
          </div>
          <button
            onClick={downloadAsCSV}
            className={cn(
              buttonVariants({ size: 'sm' }),
              'w-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
            )}
          >
            Download CSV
          </button>
        </div>

        {/* JSON Export */}
        <div className="p-5 rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/20 transition-colors flex flex-col items-center text-center gap-4">
          <FileJson className="w-8 h-8 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white/90">JSON</h3>
            <p className="text-xs text-white/40 mt-1">Array of objects format</p>
          </div>
          <button
            onClick={downloadAsJSON}
            className={cn(
              buttonVariants({ size: 'sm' }),
              'w-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30'
            )}
          >
            Download JSON
          </button>
        </div>

        {/* SQLite (coming soon) */}
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] opacity-60 flex flex-col items-center text-center gap-4">
          <Database className="w-8 h-8 text-white/20" />
          <div>
            <h3 className="text-sm font-bold text-white/50">SQLite Database</h3>
            <p className="text-xs text-white/30 mt-1">Single table DB file</p>
          </div>
          <button
            disabled
            className={cn(
              buttonVariants({ size: 'sm', variant: 'outline' }),
              'w-full border-white/10 text-white/30'
            )}
          >
            Coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
