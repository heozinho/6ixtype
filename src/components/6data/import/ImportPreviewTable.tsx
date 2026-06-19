'use client';

interface ImportPreviewTableProps {
  headers: string[];
  rows: Record<string, string>[];
}

export default function ImportPreviewTable({ headers, rows }: ImportPreviewTableProps) {
  if (headers.length === 0 || rows.length === 0) return null;

  const displayRows = rows.slice(0, 10); // Show max 10 rows

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden bg-white/[0.015]">
      <div className="px-4 py-2.5 border-b border-white/6 flex items-center justify-between">
        <h3 className="text-xs font-bold text-white/60">Data Preview</h3>
        <span className="text-[10px] text-white/30">Showing {displayRows.length} of {rows.length} rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/6">
              <th className="px-3 py-2 text-[10px] font-bold text-white/30 text-right w-12 sticky left-0 bg-[#0f0f18] z-10 border-r border-white/6">
                #
              </th>
              {headers.map((h) => (
                <th key={h} className="px-3 py-2 text-[11px] font-bold text-white/70 whitespace-nowrap">
                  {h}
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
                {headers.map((h) => {
                  const val = row[h];
                  const isEmpty = !val || val.trim() === '';
                  return (
                    <td key={h} className="px-3 py-1.5 whitespace-nowrap max-w-[200px] truncate">
                      {isEmpty ? (
                        <span className="text-[10px] text-white/15 italic">null</span>
                      ) : (
                        <span className="text-[11px] text-white/60">{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
