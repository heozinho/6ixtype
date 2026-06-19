'use client';
import { GitCommit, Download, Upload, Cpu } from 'lucide-react';
import type { ParsedDataset } from '@/lib/6data/types';

interface LineageTabProps {
  dataset: ParsedDataset;
}

export default function LineageTab({ dataset }: LineageTabProps) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-[1.15rem] top-6 bottom-6 w-px bg-white/10" />

        <div className="space-y-8">
          {/* Node: Source */}
          <div className="relative flex gap-6">
            <div className="w-10 h-10 rounded-full border border-cyan-500/30 bg-[#0a0a12] flex items-center justify-center flex-shrink-0 z-10 relative">
              <Upload className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="pt-2 flex-1">
              <h3 className="text-sm font-bold text-white/90">Source Import</h3>
              <p className="text-xs text-white/40 mt-1">
                Imported via {dataset.sourceType} on {new Date(dataset.importedAt).toLocaleString()}
              </p>
              <div className="mt-3 p-3 rounded-lg bg-white/4 border border-white/6 inline-block">
                <p className="text-[10px] text-white/50 font-mono">
                  {dataset.rawHeaders.length} initial columns detected
                </p>
              </div>
            </div>
          </div>

          {/* Node: Profiling */}
          <div className="relative flex gap-6">
            <div className="w-10 h-10 rounded-full border border-violet-500/30 bg-[#0a0a12] flex items-center justify-center flex-shrink-0 z-10 relative">
              <Cpu className="w-4 h-4 text-violet-400" />
            </div>
            <div className="pt-2 flex-1">
              <h3 className="text-sm font-bold text-white/90">Automated Profiling</h3>
              <p className="text-xs text-white/40 mt-1">
                Types inferred, stats calculated, quality score computed.
              </p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 rounded bg-violet-500/10 text-violet-300 text-[10px] border border-violet-500/20">
                  Quality: {dataset.profile.qualityScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Cleaning steps (placeholder for future) */}
          {dataset.cleaningSteps.length === 0 ? (
            <div className="relative flex gap-6">
              <div className="w-10 h-10 rounded-full border border-white/10 bg-[#0a0a12] flex items-center justify-center flex-shrink-0 z-10 relative">
                <GitCommit className="w-4 h-4 text-white/20" />
              </div>
              <div className="pt-2 flex-1">
                <h3 className="text-sm font-bold text-white/40">No cleaning steps</h3>
                <p className="text-xs text-white/30 mt-1">
                  Data remains in its original imported state.
                </p>
              </div>
            </div>
          ) : (
            dataset.cleaningSteps.map((step, i) => (
              <div key={step.id} className="relative flex gap-6">
                <div className="w-10 h-10 rounded-full border border-emerald-500/30 bg-[#0a0a12] flex items-center justify-center flex-shrink-0 z-10 relative">
                  <GitCommit className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="pt-2 flex-1">
                  <h3 className="text-sm font-bold text-white/90">Cleaning Step {i + 1}</h3>
                  <p className="text-xs text-white/40 mt-1">{step.description}</p>
                </div>
              </div>
            ))
          )}

          {/* Node: Current state */}
          <div className="relative flex gap-6">
            <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center flex-shrink-0 z-10 relative">
              <Download className="w-4 h-4 text-amber-400" />
            </div>
            <div className="pt-2 flex-1">
              <h3 className="text-sm font-bold text-amber-400">Current State</h3>
              <p className="text-xs text-white/50 mt-1">Ready for analysis and export.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
