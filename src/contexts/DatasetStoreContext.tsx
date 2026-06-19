'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ParsedDataset, SavedQuery, SavedChart, SavedDashboard, ResearchNote } from '@/lib/6data/types';
import type { MockWorkspace } from '@/data/6data-workspaces';
import { datasetStore, queryStore, chartStore, dashboardStore, researchStore, workspaceStore } from '@/lib/6data/store';

interface DatasetStoreCtx {
  datasets: ParsedDataset[];
  queries: SavedQuery[];
  charts: SavedChart[];
  dashboards: SavedDashboard[];
  researchNotes: ResearchNote[];
  workspaces: MockWorkspace[];
  addWorkspace: (w: MockWorkspace) => void;
  removeWorkspace: (id: string) => void;
  addDataset: (ds: ParsedDataset) => void;
  updateDataset: (id: string, patch: Partial<ParsedDataset>) => void;
  removeDataset: (id: string) => void;
  getDataset: (id: string) => ParsedDataset | undefined;
  addQuery: (q: SavedQuery) => void;
  removeQuery: (id: string) => void;
  addChart: (c: SavedChart) => void;
  removeChart: (id: string) => void;
  addDashboard: (d: SavedDashboard) => void;
  updateDashboard: (id: string, patch: Partial<SavedDashboard>) => void;
  removeDashboard: (id: string) => void;
  addResearchNote: (note: ResearchNote) => void;
  updateResearchNote: (id: string, patch: Partial<ResearchNote>) => void;
  removeResearchNote: (id: string) => void;
  refresh: () => void;
}

const DatasetStoreContext = createContext<DatasetStoreCtx>({
  datasets: [],
  queries: [],
  charts: [],
  dashboards: [],
  researchNotes: [],
  workspaces: [],
  addWorkspace: () => undefined,
  removeWorkspace: () => undefined,
  addDataset: () => undefined,
  updateDataset: () => undefined,
  removeDataset: () => undefined,
  getDataset: () => undefined,
  addQuery: () => undefined,
  removeQuery: () => undefined,
  addChart: () => undefined,
  removeChart: () => undefined,
  addDashboard: () => undefined,
  updateDashboard: () => undefined,
  removeDashboard: () => undefined,
  addResearchNote: () => undefined,
  updateResearchNote: () => undefined,
  removeResearchNote: () => undefined,
  refresh: () => undefined,
});

export function DatasetStoreProvider({ children }: { children: React.ReactNode }) {
  const [datasets, setDatasets] = useState<ParsedDataset[]>([]);
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([]);
  const [workspaces, setWorkspaces] = useState<MockWorkspace[]>([]);

  const refresh = useCallback(() => {
    setDatasets(datasetStore.getAll());
    setQueries(queryStore.getAll());
    setCharts(chartStore.getAll());
    setDashboards(dashboardStore.getAll());
    setResearchNotes(researchStore.getAll());
    setWorkspaces(workspaceStore.getAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addDataset = useCallback(
    (ds: ParsedDataset) => {
      datasetStore.add(ds);
      refresh();
    },
    [refresh]
  );

  const updateDataset = useCallback(
    (id: string, patch: Partial<ParsedDataset>) => {
      datasetStore.update(id, patch);
      refresh();
    },
    [refresh]
  );

  const removeDataset = useCallback(
    (id: string) => {
      datasetStore.remove(id);
      refresh();
    },
    [refresh]
  );

  const getDataset = useCallback(
    (id: string) => datasets.find((ds) => ds.id === id),
    [datasets]
  );

  const addQuery = useCallback(
    (q: SavedQuery) => {
      queryStore.add(q);
      refresh();
    },
    [refresh]
  );

  const removeQuery = useCallback(
    (id: string) => {
      queryStore.remove(id);
      refresh();
    },
    [refresh]
  );

  const addChart = useCallback(
    (c: SavedChart) => {
      chartStore.add(c);
      refresh();
    },
    [refresh]
  );

  const removeChart = useCallback(
    (id: string) => {
      chartStore.remove(id);
      refresh();
    },
    [refresh]
  );

  const addDashboard = useCallback(
    (d: SavedDashboard) => {
      dashboardStore.add(d);
      refresh();
    },
    [refresh]
  );

  const updateDashboard = useCallback(
    (id: string, patch: Partial<SavedDashboard>) => {
      dashboardStore.update(id, patch);
      refresh();
    },
    [refresh]
  );

  const removeDashboard = useCallback(
    (id: string) => {
      dashboardStore.remove(id);
      refresh();
    },
    [refresh]
  );

  const addResearchNote = useCallback(
    (note: ResearchNote) => {
      researchStore.add(note);
      refresh();
    },
    [refresh]
  );

  const updateResearchNote = useCallback(
    (id: string, patch: Partial<ResearchNote>) => {
      researchStore.update(id, patch);
      refresh();
    },
    [refresh]
  );

  const removeResearchNote = useCallback(
    (id: string) => {
      researchStore.remove(id);
      refresh();
    },
    [refresh]
  );

  const addWorkspace = useCallback(
    (w: MockWorkspace) => {
      workspaceStore.add(w);
      refresh();
    },
    [refresh]
  );

  const removeWorkspace = useCallback(
    (id: string) => {
      workspaceStore.remove(id);
      refresh();
    },
    [refresh]
  );

  return (
    <DatasetStoreContext.Provider
      value={{ 
        datasets, queries, charts, dashboards, researchNotes, workspaces,
        addWorkspace, removeWorkspace,
        addDataset, updateDataset, removeDataset, getDataset, 
        addQuery, removeQuery, 
        addChart, removeChart, 
        addDashboard, updateDashboard, removeDashboard,
        addResearchNote, updateResearchNote, removeResearchNote,
        refresh 
      }}
    >
      {children}
    </DatasetStoreContext.Provider>
  );
}

export function useDatasetStore() {
  return useContext(DatasetStoreContext);
}
