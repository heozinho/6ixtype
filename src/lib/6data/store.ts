'use client';
import type { ParsedDataset } from './types';

const STORAGE_KEY = '6data:datasets:v1';

function load(): ParsedDataset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ParsedDataset[]) : [];
  } catch {
    return [];
  }
}

function save(datasets: ParsedDataset[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Only store the first 200 rows of each dataset to avoid localStorage quota
    const trimmed = datasets.map((ds) => ({
      ...ds,
      rows: ds.rows.slice(0, 200),
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Ignore storage quota errors
  }
}

export const datasetStore = {
  getAll(): ParsedDataset[] {
    return load();
  },

  getById(id: string): ParsedDataset | undefined {
    return load().find((ds) => ds.id === id);
  },

  add(dataset: ParsedDataset): void {
    const all = load();
    all.push(dataset);
    save(all);
  },

  update(id: string, patch: Partial<ParsedDataset>): void {
    const all = load();
    const idx = all.findIndex((ds) => ds.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...patch };
      save(all);
    }
  },

  remove(id: string): void {
    const all = load().filter((ds) => ds.id !== id);
    save(all);
  },

  generateId(): string {
    return `ds-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
};
