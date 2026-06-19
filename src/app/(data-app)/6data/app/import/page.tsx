'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Check, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useDatasetStore } from '@/contexts/DatasetStoreContext';
import ImportSourceGrid from '@/components/6data/import/ImportSourceGrid';
import FileDropzone from '@/components/6data/import/FileDropzone';
import ImportPreviewTable from '@/components/6data/import/ImportPreviewTable';
import SchemaReviewPanel from '@/components/6data/import/SchemaReviewPanel';
import ImportProgress from '@/components/6data/import/ImportProgress';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { readFileAsCSV } from '@/lib/6data/csv';
import SQLiteUploader from '@/components/6data/import/SQLiteUploader';
import SixStatsConnector from '@/components/6data/import/SixStatsConnector';
import { inferSchema } from '@/lib/6data/infer-schema';
import { generateProfile } from '@/lib/6data/profile';
import type { ParsedDataset, SchemaColumn, ColumnType } from '@/lib/6data/types';
import { demoDatasets } from '@/data/6data-demo-datasets';

export default function ImportPage() {
  const router = useRouter();
  const { addDataset } = useDatasetStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Source, 2: Upload/Select, 3: Review, 4: Progress
  const [sourceId, setSourceId] = useState<string>('local_file');
  const [file, setFile] = useState<File | null>(null);
  
  // Parsed state
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [schema, setSchema] = useState<SchemaColumn[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Progress state
  const [stage, setStage] = useState<'parsing' | 'profiling' | 'saving' | 'complete'>('parsing');
  const [progress, setProgress] = useState(0);

  const handleSourceSelect = (id: string) => {
    setSourceId(id);
    setStep(2); // Automatically advance for all active sources
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStep(3); // Go directly to review

    try {
      const result = await readFileAsCSV(selectedFile);
      if (result.error) throw new Error(result.error);
      setHeaders(result.headers);
      setRows(result.rows);
      
      const inferred = inferSchema(result.headers, result.rows);
      setSchema(inferred);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error parsing file');
      setStep(2);
    }
  };

  const handleTypeChange = (colName: string, newType: ColumnType) => {
    setSchema((prev) =>
      prev.map((c) => (c.name === colName ? { ...c, finalType: newType } : c))
    );
  };

  const handleFinaliseImport = async () => {
    setStep(4);
    setStage('profiling');
    setProgress(30);

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 500));
    
    try {
      setProgress(60);
      const profile = generateProfile(rows, schema);

      setStage('saving');
      setProgress(85);
      await new Promise((r) => setTimeout(r, 400));

      const dataset: ParsedDataset = {
        id: `ds-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file?.name.replace(/\.[^/.]+$/, '') ?? 'Imported Dataset',
        sourceType: 'csv',
        workspaceId: 'ws-1', // Default workspace
        rawHeaders: headers,
        rows,
        schema,
        profile,
        importedAt: new Date().toISOString(),
        version: 1,
        cleaningSteps: [],
        tags: [],
      };

      addDataset(dataset);
      
      setProgress(100);
      setStage('complete');
      
      setTimeout(() => {
        router.push(`/6data/app/datasets/${dataset.id}`);
      }, 500);

    } catch (e) {
      setError('Failed to generate profile or save dataset.');
      setStep(3);
    }
  };

  const handleLoadDemo = async (demoId: string) => {
    const demo = demoDatasets.find((d) => d.id === demoId);
    if (!demo) return;
    
    setStep(4);
    setStage('parsing');
    setProgress(20);

    try {
      // Simulate fetching and parsing the demo data
      await new Promise((r) => setTimeout(r, 600));
      setStage('profiling');
      setProgress(50);
      
      const inferredSchema = inferSchema(demo.headers, demo.rows);
      await new Promise((r) => setTimeout(r, 400));
      
      setStage('saving');
      setProgress(80);
      const profile = generateProfile(demo.rows, inferredSchema);
      
      const dataset: ParsedDataset = {
        id: `ds-demo-${Date.now()}`,
        name: demo.name,
        sourceType: 'demo',
        workspaceId: 'ws-1',
        rawHeaders: demo.headers,
        rows: demo.rows,
        schema: inferredSchema,
        profile,
        importedAt: new Date().toISOString(),
        version: 1,
        cleaningSteps: [],
        tags: ['demo'],
      };

      addDataset(dataset);
      
      setProgress(100);
      setStage('complete');
      
      setTimeout(() => {
        router.push(`/6data/app/datasets/${dataset.id}`);
      }, 500);

    } catch (e) {
      setError('Failed to load demo dataset.');
      setStep(2);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto min-h-full">
      <Link
        href="/6data/app/datasets"
        className="inline-flex items-center gap-1.5 text-[10px] text-white/40 hover:text-cyan-400 transition-colors uppercase tracking-widest font-semibold mb-6"
      >
        <ArrowLeft className="w-3 h-3" />
        Cancel Import
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Import Data</h1>
        <p className="text-sm text-white/50 mt-1">Connect a source or upload a file to begin profiling.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-red-400">Import Failed</h3>
            <p className="text-xs text-red-400/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white">Select a Source</h2>
          <ImportSourceGrid onSelect={handleSourceSelect} selectedId={sourceId} />
        </div>
      )}

      {step === 2 && sourceId === 'local_file' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Upload File</h2>
            <button onClick={() => setStep(1)} className="text-xs text-cyan-400 hover:text-cyan-300">Change source</button>
          </div>
          <FileDropzone onFileSelect={handleFileSelect} />
        </div>
      )}

      {step === 2 && sourceId === 'demo_data' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Select a Demo Dataset</h2>
            <button onClick={() => setStep(1)} className="text-xs text-cyan-400 hover:text-cyan-300">Change source</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {demoDatasets.map((demo) => (
              <button
                key={demo.id}
                onClick={() => handleLoadDemo(demo.id)}
                className="flex items-center justify-between p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-500/50 hover:bg-cyan-500/10 text-left transition-all group"
              >
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">{demo.name}</h3>
                  <p className="text-xs text-white/40 mt-1">{demo.rows.length} rows · {demo.headers.length} columns</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                  Load
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && sourceId === 'sqlite' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Upload SQLite Database</h2>
            <button onClick={() => setStep(1)} className="text-xs text-cyan-400 hover:text-cyan-300">Change source</button>
          </div>
          <p className="text-xs text-white/40">Powered by WebAssembly. The database is processed entirely in your browser.</p>
          <SQLiteUploader 
            onDataExtracted={(h, r, fname) => {
              setHeaders(h);
              setRows(r);
              setFile(new File([], fname));
              setSchema(inferSchema(h, r));
              setStep(3);
            }} 
            onError={(err) => setError(err)} 
          />
        </div>
      )}

      {step === 2 && sourceId === '6stats' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">6Stats Connector</h2>
            <button onClick={() => setStep(1)} className="text-xs text-cyan-400 hover:text-cyan-300">Change source</button>
          </div>
          <SixStatsConnector 
            onConnect={async () => {
              // Simulate pulling from 6Stats
              setStep(4);
              setStage('parsing');
              setProgress(20);
              const demo = demoDatasets.find(d => d.id === 'demo-music-6stats');
              if (demo) await handleLoadDemo('demo-music-6stats');
            }} 
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/6 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                {file?.name}
              </h2>
              <p className="text-xs text-white/40 mt-1">{rows.length.toLocaleString()} rows · {headers.length} columns detected</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setStep(2)} className="text-xs text-white/50 hover:text-white">Cancel</button>
              <button
                onClick={handleFinaliseImport}
                className={cn(buttonVariants({ size: 'sm' }), 'bg-cyan-500 hover:bg-cyan-400 text-[#0a0a12]')}
              >
                Import & Profile
              </button>
            </div>
          </div>

          <ImportPreviewTable headers={headers} rows={rows} />
          
          <div className="pt-4 border-t border-white/6">
            <SchemaReviewPanel schema={schema} onTypeChange={handleTypeChange} />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mt-12">
          <ImportProgress stage={stage} progress={progress} />
        </div>
      )}
    </div>
  );
}
