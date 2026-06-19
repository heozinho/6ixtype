'use client';
export const runtime = 'edge';
import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import { ArrowLeft, GraduationCap, Play, Database } from 'lucide-react';
import Link from 'next/link';
import alasql from 'alasql';

// A simple hardcoded lesson dictionary for the MVP.
// In a real app, this would be fetched from a CMS or DB.
const LESSON_CONTENT: Record<string, { title: string; content: React.ReactNode; defaultQuery: string }> = {
  'intro-to-sql': {
    title: 'Intro to SQL with your data',
    content: (
      <div className="space-y-4">
        <p>SQL (Structured Query Language) is the standard language for dealing with Relational Databases.</p>
        <p>A basic query looks like this:</p>
        <pre className="bg-black/40 p-3 rounded-lg border border-white/10 text-cyan-400 font-mono text-sm">
          SELECT * FROM dataset
        </pre>
        <p>This selects <strong>all</strong> columns from your dataset. If you only want specific columns, you list them instead of the `*`.</p>
        <p>Try modifying the query on the right to select only one column from your dataset, then click <strong>Run Query</strong>.</p>
      </div>
    ),
    defaultQuery: 'SELECT * FROM ? LIMIT 10'
  },
  'understanding-outliers': {
    title: 'Understanding Outliers',
    content: (
      <div className="space-y-4">
        <p>Outliers are data points that differ significantly from other observations.</p>
        <p>You can use the <code>WHERE</code> clause in SQL to filter data and find or exclude these outliers.</p>
        <pre className="bg-black/40 p-3 rounded-lg border border-white/10 text-cyan-400 font-mono text-sm">
          SELECT * FROM dataset WHERE column_name {'>'} 100
        </pre>
        <p>Try writing a <code>WHERE</code> clause on the right using one of your numeric columns.</p>
      </div>
    ),
    defaultQuery: 'SELECT * FROM ? WHERE 1=1 LIMIT 10'
  },
  'data-quality-nulls': {
    title: 'Dealing with Missing Data',
    content: (
      <div className="space-y-4">
        <p>Missing data is represented as <code>NULL</code> in SQL. You can filter for nulls using <code>IS NULL</code> or <code>IS NOT NULL</code>.</p>
        <pre className="bg-black/40 p-3 rounded-lg border border-white/10 text-cyan-400 font-mono text-sm">
          SELECT * FROM dataset WHERE column_name IS NOT NULL
        </pre>
        <p>Run a query on the right to see if your dataset has any missing values.</p>
      </div>
    ),
    defaultQuery: 'SELECT * FROM ? LIMIT 10'
  }
};

export default function LessonPage() {
  const params = useParams();
  const slug = params.slug as string;
  const lesson = LESSON_CONTENT[slug];
  
  const { datasets } = useDatasetStore();
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0]?.id || '');
  const dataset = datasets.find(d => d.id === selectedDatasetId);

  const [query, setQuery] = useState(lesson?.defaultQuery || '');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!lesson) {
    return <div className="p-8 text-white/40">Lesson not found.</div>;
  }

  const handleRunQuery = () => {
    if (!dataset) return;
    try {
      setError(null);
      // We pass the dataset rows as the parameter '?' to alasql
      const res = alasql(query, [dataset.rows]) as any[];
      setResults(res);
    } catch (err: any) {
      setError(err.message || 'Error executing query');
      setResults([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a12]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/6 bg-[#0f0f18] shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/6data/app/learn" className="p-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none mb-1">{lesson.title}</h1>
              <p className="text-[10px] text-white/40 leading-none">Interactive Lesson</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Lesson Content */}
        <div className="w-1/3 border-r border-white/6 bg-[#0a0a0f] p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6">{lesson.title}</h2>
          <div className="text-white/80 leading-relaxed text-sm">
            {lesson.content}
          </div>
        </div>

        {/* Right: Interactive Playground */}
        <div className="flex-1 flex flex-col bg-[#0a0a12]">
          <div className="p-4 border-b border-white/6 bg-[#0f0f18] flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <select
                value={selectedDatasetId}
                onChange={(e) => {
                  setSelectedDatasetId(e.target.value);
                  setResults([]);
                  setError(null);
                }}
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 appearance-none"
              >
                {datasets.length === 0 ? (
                  <option value="">No datasets available</option>
                ) : (
                  datasets.map((ds) => (
                    <option key={ds.id} value={ds.id}>{ds.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            <div className="h-40 flex flex-col bg-[#0f0f18] border border-white/10 rounded-xl overflow-hidden shrink-0">
              <div className="p-2 border-b border-white/6 flex justify-between items-center bg-black/20">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">SQL Editor</span>
                <button
                  onClick={handleRunQuery}
                  disabled={!dataset}
                  className="flex items-center gap-1 px-3 py-1 bg-cyan-500 text-black text-xs font-bold rounded hover:bg-cyan-400 disabled:opacity-50"
                >
                  <Play className="w-3 h-3" />
                  Run Query
                </button>
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 w-full bg-transparent p-4 text-sm font-mono text-cyan-300 focus:outline-none resize-none"
                placeholder="Write SQL here. Use ? to refer to the selected dataset."
              />
            </div>

            <div className="flex-1 bg-[#0f0f18] border border-white/10 rounded-xl overflow-hidden flex flex-col">
              <div className="p-2 border-b border-white/6 bg-black/20">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Results</span>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {error ? (
                  <div className="text-red-400 text-sm font-mono">{error}</div>
                ) : results.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        {Object.keys(results[0]).map((col) => (
                          <th key={col} className="p-2 border-b border-white/10 text-xs font-bold text-white/60">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          {Object.values(row).map((val: any, j) => (
                            <td key={j} className="p-2 border-b border-white/5 text-xs text-white/80">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-white/30 text-sm h-full flex items-center justify-center">
                    Run a query to see results. Note: `?` references your chosen dataset.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
