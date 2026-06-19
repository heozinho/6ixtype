'use client';
import { Upload, Database, HardDrive, Search, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ImportSourceGridProps {
  onSelect: (sourceId: string) => void;
  selectedId?: string;
}

const SOURCES = [
  {
    id: 'local_file',
    name: 'Local File',
    description: 'Upload a CSV or JSON file directly from your computer.',
    icon: Upload,
    colour: '#06b6d4',
    badge: 'Popular',
    disabled: false,
  },
  {
    id: 'demo_data',
    name: 'Demo Dataset',
    description: 'Load a pre-configured dataset to explore the platform.',
    icon: Hexagon,
    colour: '#10b981',
    disabled: false,
  },
  {
    id: 'sqlite',
    name: 'SQLite (.db)',
    description: 'Upload a local SQLite database and import tables securely in the browser.',
    icon: Database,
    colour: '#f59e0b',
    badge: 'New',
    disabled: false,
  },
  {
    id: '6stats',
    name: '6Stats Connector',
    description: 'Import your authenticated listening history from 6Stats instantly.',
    icon: Search,
    colour: '#ec4899',
    badge: 'Ecosystem',
    disabled: false,
  },
];

export default function ImportSourceGrid({ onSelect, selectedId }: ImportSourceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SOURCES.map((s, i) => {
        const Icon = s.icon;
        const isSelected = selectedId === s.id;
        return (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => !s.disabled && onSelect(s.id)}
            disabled={s.disabled}
            className={cn(
              'relative flex flex-col items-start p-5 rounded-xl border text-left transition-all duration-200 h-full',
              s.disabled
                ? 'opacity-50 cursor-not-allowed border-white/5 bg-white/[0.01]'
                : isSelected
                ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            )}
          >
            {s.badge && (
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                {s.badge}
              </span>
            )}
            {s.disabled && (
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/30 border border-white/10">
                Coming soon
              </span>
            )}
            <div
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors',
                isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/50'
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h3 className={cn('text-base font-bold mb-1 transition-colors', isSelected ? 'text-cyan-400' : 'text-white/90')}>
              {s.name}
            </h3>
            <p className="text-xs text-white/40 leading-relaxed pr-8">{s.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
