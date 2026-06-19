'use client';
import { useState } from 'react';
import { Plus, Type, Edit3, Trash2, Scissors, Copy, CheckCircle2, ChevronRight } from 'lucide-react';
import type { SchemaColumn, CleaningStepType, ColumnType } from '@/lib/6data/types';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface StepBuilderProps {
  schema: SchemaColumn[];
  onAddStep: (type: CleaningStepType, config: Record<string, unknown>, description: string) => void;
  onCancel: () => void;
}

const OPERATIONS: { type: CleaningStepType; label: string; icon: any; desc: string }[] = [
  { type: 'rename_column', label: 'Rename Column', icon: Edit3, desc: 'Change a column name.' },
  { type: 'change_type', label: 'Change Type', icon: Type, desc: 'Force a specific data type.' },
  { type: 'remove_duplicates', label: 'Remove Duplicates', icon: Copy, desc: 'Drop duplicate rows.' },
  { type: 'fill_missing', label: 'Fill Missing', icon: CheckCircle2, desc: 'Replace nulls with a value.' },
  { type: 'drop_column', label: 'Drop Column', icon: Trash2, desc: 'Remove a column entirely.' },
  { type: 'trim_whitespace', label: 'Trim Whitespace', icon: Scissors, desc: 'Remove leading/trailing spaces.' },
];

const COLUMN_TYPES: ColumnType[] = ['text', 'integer', 'decimal', 'boolean', 'date', 'datetime', 'category', 'url', 'email'];

export default function StepBuilder({ schema, onAddStep, onCancel }: StepBuilderProps) {
  const [selectedType, setSelectedType] = useState<CleaningStepType | null>(null);

  // Form states
  const [column, setColumn] = useState<string>(schema[0]?.name ?? '');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ColumnType>('text');
  const [fillValue, setFillValue] = useState('');

  const handleAdd = () => {
    if (!selectedType) return;

    let config: Record<string, unknown> = {};
    let description = '';

    switch (selectedType) {
      case 'rename_column':
        config = { oldName: column, newName };
        description = `Renamed '${column}' to '${newName}'`;
        break;
      case 'change_type':
        config = { column, newType };
        description = `Changed '${column}' to ${newType}`;
        break;
      case 'remove_duplicates':
        // For MVP, we just dedupe across all columns
        config = {};
        description = `Removed duplicate rows`;
        break;
      case 'fill_missing':
        config = { column, value: fillValue };
        description = `Filled missing '${column}' with '${fillValue}'`;
        break;
      case 'drop_column':
        config = { column };
        description = `Dropped column '${column}'`;
        break;
      case 'trim_whitespace':
        config = { column };
        description = `Trimmed whitespace in '${column}'`;
        break;
    }

    onAddStep(selectedType, config, description);
  };

  if (!selectedType) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Select Operation</h3>
          <button onClick={onCancel} className="text-xs text-white/40 hover:text-white">Cancel</button>
        </div>
        {OPERATIONS.map((op) => {
          const Icon = op.icon;
          return (
            <button
              key={op.type}
              onClick={() => setSelectedType(op.type)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90">{op.label}</p>
                  <p className="text-[10px] text-white/40">{op.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
            </button>
          );
        })}
      </div>
    );
  }

  const opInfo = OPERATIONS.find((o) => o.type === selectedType)!;
  const Icon = opInfo.icon;
  const requiresColumn = selectedType !== 'remove_duplicates';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <button onClick={() => setSelectedType(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">{opInfo.label}</h3>
          </div>
          <p className="text-[10px] text-white/40">{opInfo.desc}</p>
        </div>
      </div>

      <div className="space-y-4">
        {requiresColumn && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Target Column</label>
            <select
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            >
              {schema.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedType === 'rename_column' && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">New Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new column name"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        )}

        {selectedType === 'change_type' && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Target Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as ColumnType)}
              className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
            >
              {COLUMN_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedType === 'fill_missing' && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Fill Value</label>
            <input
              type="text"
              value={fillValue}
              onChange={(e) => setFillValue(e.target.value)}
              placeholder="e.g. 0, N/A, Unknown"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        )}

        {selectedType === 'remove_duplicates' && (
          <div className="p-3 rounded-lg border border-white/10 bg-white/5">
            <p className="text-xs text-white/60 leading-relaxed">
              This will evaluate all columns in the dataset and remove any rows that are exact duplicates of previous rows.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={handleAdd}
          disabled={selectedType === 'rename_column' && !newName}
          className={cn(
            buttonVariants({ size: 'sm' }),
            'w-full bg-cyan-500 hover:bg-cyan-400 text-[#0a0a12] disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Apply Step
        </button>
      </div>
    </div>
  );
}
