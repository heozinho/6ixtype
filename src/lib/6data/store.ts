'use client';
import type { ParsedDataset } from './types';
import { mockWorkspaces, MockWorkspace } from '@/data/6data-workspaces';

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

const QUERY_STORAGE_KEY = '6data:queries:v1';

function loadQueries(): import('./types').SavedQuery[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(QUERY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueries(queries: import('./types').SavedQuery[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(QUERY_STORAGE_KEY, JSON.stringify(queries));
  } catch {}
}

export const queryStore = {
  getAll(): import('./types').SavedQuery[] {
    return loadQueries();
  },
  getByDatasetId(datasetId: string): import('./types').SavedQuery[] {
    return loadQueries().filter((q) => q.datasetId === datasetId);
  },
  add(query: import('./types').SavedQuery): void {
    const all = loadQueries();
    all.push(query);
    saveQueries(all);
  },
  remove(id: string): void {
    const all = loadQueries().filter((q) => q.id !== id);
    saveQueries(all);
  },
  generateId(): string {
    return `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
};

const CHART_STORAGE_KEY = '6data:charts:v1';

function loadCharts(): import('./types').SavedChart[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CHART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCharts(charts: import('./types').SavedChart[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CHART_STORAGE_KEY, JSON.stringify(charts));
  } catch {}
}

export const chartStore = {
  getAll(): import('./types').SavedChart[] {
    return loadCharts();
  },
  getByDatasetId(datasetId: string): import('./types').SavedChart[] {
    return loadCharts().filter((c) => c.datasetId === datasetId);
  },
  add(chart: import('./types').SavedChart): void {
    const all = loadCharts();
    all.push(chart);
    saveCharts(all);
  },
  remove(id: string): void {
    const all = loadCharts().filter((c) => c.id !== id);
    saveCharts(all);
  },
  generateId(): string {
    return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
};

const DASHBOARD_STORAGE_KEY = '6data:dashboards:v1';

function loadDashboards(): import('./types').SavedDashboard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DASHBOARD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDashboards(dashboards: import('./types').SavedDashboard[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(dashboards));
  } catch {}
}

export const dashboardStore = {
  getAll(): import('./types').SavedDashboard[] {
    return loadDashboards();
  },
  add(dashboard: import('./types').SavedDashboard): void {
    const all = loadDashboards();
    all.push(dashboard);
    saveDashboards(all);
  },
  update(id: string, patch: Partial<import('./types').SavedDashboard>): void {
    const all = loadDashboards();
    const index = all.findIndex((d) => d.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...patch, updatedAt: new Date().toISOString() };
      saveDashboards(all);
    }
  },
  remove(id: string): void {
    const all = loadDashboards().filter((d) => d.id !== id);
    saveDashboards(all);
  },
  generateId(): string {
    return `dash-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
};

const RESEARCH_STORAGE_KEY = '6data:research:v1';

function loadResearchNotes(): import('./types').ResearchNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RESEARCH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveResearchNotes(notes: import('./types').ResearchNote[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(notes));
  } catch {}
}

export const researchStore = {
  getAll(): import('./types').ResearchNote[] {
    return loadResearchNotes();
  },
  add(note: import('./types').ResearchNote): void {
    const all = loadResearchNotes();
    all.push(note);
    saveResearchNotes(all);
  },
  update(id: string, patch: Partial<import('./types').ResearchNote>): void {
    const all = loadResearchNotes();
    const index = all.findIndex((n) => n.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...patch, updatedAt: new Date().toISOString() };
      saveResearchNotes(all);
    }
  },
  remove(id: string): void {
    const all = loadResearchNotes().filter((n) => n.id !== id);
    saveResearchNotes(all);
  },
  generateId(): string {
    return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
};

const WORKSPACE_STORAGE_KEY = '6data:workspaces:v1';

function loadWorkspaces(): MockWorkspace[] {
  if (typeof window === 'undefined') return mockWorkspaces;
  try {
    const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(mockWorkspaces));
      return mockWorkspaces;
    }
    return JSON.parse(raw);
  } catch {
    return mockWorkspaces;
  }
}

function saveWorkspaces(workspaces: MockWorkspace[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspaces));
  } catch {}
}

export const workspaceStore = {
  getAll(): MockWorkspace[] {
    return loadWorkspaces();
  },
  getById(id: string): MockWorkspace | undefined {
    return loadWorkspaces().find((w) => w.id === id);
  },
  add(workspace: MockWorkspace): void {
    const all = loadWorkspaces();
    all.push(workspace);
    saveWorkspaces(all);
  },
  update(id: string, patch: Partial<MockWorkspace>): void {
    const all = loadWorkspaces();
    const index = all.findIndex((w) => w.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...patch };
      saveWorkspaces(all);
    }
  },
  remove(id: string): void {
    const all = loadWorkspaces().filter((w) => w.id !== id);
    saveWorkspaces(all);
  },
  generateId(): string {
    return `ws-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
};
