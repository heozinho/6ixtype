'use client';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ImportProgressProps {
  stage: 'parsing' | 'profiling' | 'saving' | 'complete';
  progress: number; // 0-100
}

export default function ImportProgress({ stage, progress }: ImportProgressProps) {
  const stages = [
    { id: 'parsing', label: 'Parsing data' },
    { id: 'profiling', label: 'Profiling & inferring schema' },
    { id: 'saving', label: 'Saving to store' },
    { id: 'complete', label: 'Complete' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === stage);

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      <div className="relative mb-8">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a12] px-3 py-1 rounded-full text-[10px] font-bold tabular-nums text-white/60 border border-white/10">
          {Math.round(progress)}%
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((s, i) => {
          const isPast = i < currentStageIndex;
          const isCurrent = i === currentStageIndex;
          const isFuture = i > currentStageIndex;

          return (
            <div key={s.id} className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                  isPast || (s.id === 'complete' && stage === 'complete')
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-white/5 text-white/20'
                }`}
              >
                {isPast || (s.id === 'complete' && stage === 'complete') ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-300 ${
                  isPast || (s.id === 'complete' && stage === 'complete')
                    ? 'text-white/80'
                    : isCurrent
                    ? 'text-white font-bold'
                    : 'text-white/30'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
