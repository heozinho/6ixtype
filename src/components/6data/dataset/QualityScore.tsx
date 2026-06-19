'use client';
import { motion } from 'framer-motion';
import type { QualityDimension } from '@/lib/6data/types';

interface QualityScoreProps {
  score: number;
  dimensions: QualityDimension[];
}

function scoreColour(score: number): string {
  if (score >= 90) return '#10b981';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
}

function scoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs work';
}

export default function QualityScore({ score, dimensions }: QualityScoreProps) {
  const colour = scoreColour(score);
  const label = scoreLabel(score);
  const circumference = 2 * Math.PI * 36;
  const dash = ((100 - score) / 100) * circumference;

  return (
    <div className="p-5 rounded-xl border border-white/8 bg-white/[0.025] space-y-5">
      <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
        Data Quality Score
      </h3>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle
              cx="40" cy="40" r="36"
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"
            />
            <motion.circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke={colour}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dash }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black" style={{ color: colour }}>
              {score}%
            </span>
            <span className="text-[9px] text-white/35 font-medium">{label}</span>
          </div>
        </div>

        {/* Dimension bars */}
        <div className="flex-1 space-y-2.5">
          {dimensions.map((dim) => {
            const c = scoreColour(dim.score);
            return (
              <div key={dim.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white/55 font-medium">{dim.label}</span>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: c }}>
                    {dim.score}%
                  </span>
                </div>
                <div className="h-1 bg-white/6 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: c }}
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.score}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
