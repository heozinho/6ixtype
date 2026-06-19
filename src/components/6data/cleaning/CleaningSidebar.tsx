'use client';
import { Plus, Type, Edit3, Trash2, Scissors, Copy, CheckCircle2, ChevronRight, Workflow } from 'lucide-react';
import type { CleaningStep, CleaningStepType } from '@/lib/6data/types';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface CleaningSidebarProps {
  steps: CleaningStep[];
  onOpenBuilder: () => void;
  onRemoveStep: (index: number) => void;
}

const getIconForType = (type: CleaningStepType) => {
  switch (type) {
    case 'rename_column': return Edit3;
    case 'change_type': return Type;
    case 'remove_duplicates': return Copy;
    case 'fill_missing': return CheckCircle2;
    case 'drop_column': return Trash2;
    case 'trim_whitespace': return Scissors;
    default: return Workflow;
  }
};

export default function CleaningSidebar({ steps, onOpenBuilder, onRemoveStep }: CleaningSidebarProps) {
  return (
    <div className="w-80 border-r border-white/6 bg-[#0a0a0f] flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-white/6">
        <h2 className="text-sm font-bold text-white mb-1">Lineage & Steps</h2>
        <p className="text-[10px] text-white/40">Transformations are applied in order.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {steps.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
              <Workflow className="w-5 h-5 text-white/20" />
            </div>
            <p className="text-xs text-white/60 mb-1">No steps applied yet.</p>
            <p className="text-[10px] text-white/40">Add your first cleaning step to begin transforming this dataset.</p>
          </div>
        ) : (
          <div className="relative pl-4 border-l border-white/10 space-y-6">
            {steps.map((step, i) => {
              const Icon = getIconForType(step.stepType);
              return (
                <div key={step.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500/20 border border-cyan-500/50" />
                  
                  <div className="bg-white/[0.02] border border-white/8 rounded-lg p-3 group-hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{step.stepType.replace('_', ' ')}</span>
                      </div>
                      <button 
                        onClick={() => onRemoveStep(i)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-red-400 transition-all"
                        title="Remove step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/6 bg-[#0f0f18]">
        <button
          onClick={onOpenBuilder}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300'
          )}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Cleaning Step
        </button>
      </div>
    </div>
  );
}
