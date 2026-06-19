'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ParsedDataset, SavedQuery, SavedChart } from '@/lib/6data/types';
import { datasetStore, queryStore, chartStore } from '@/lib/6data/store';

interface DatasetStoreCtx {
  datasets: ParsedDataset[];
  queries: SavedQuery[];
  charts: SavedChart[];
  addDataset: (ds: ParsedDataset) => void;
  updateDataset: (id: string, patch: Partial<ParsedDataset>) => void;
  removeDataset: (id: string) => void;
  getDataset: (id: string) => ParsedDataset | undefined;
  addQuery: (q: SavedQuery) => void;
  removeQuery: (id: string) => void;
  addChart: (c: SavedChart) => void;
  removeChart: (id: string) => void;
  refresh: () => void;
}

const DatasetStoreContext = createContext<DatasetStoreCtx>({
  datasets: [],
  queries: [],
  charts: [],
  addDataset: () => undefined,
  updateDataset: () => undefined,
  removeDataset: () => undefined,
  getDataset: () => undefined,
  addQuery: () => undefined,
  removeQuery: () => undefined,
  addChart: () => undefined,
  removeChart: () => undefined,
  refresh: () => undefined,
});

export function DatasetStoreProvider({ children }: { children: React.ReactNode }) {
  const [datasets, setDatasets] = useState<ParsedDataset[]>([]);
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [charts, setCharts] = useState<SavedChart[]>([]);

  const refresh = useCallback(() => {
    setDatasets(datasetStore.getAll());
    setQueries(queryStore.getAll());
    setCharts(chartStore.getAll());
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

  return (
    <DatasetStoreContext.Provider
      value={{ 
        datasets, queries, charts, 
        addDataset, updateDataset, removeDataset, getDataset, 
        addQuery, removeQuery, 
        addChart, removeChart, 
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
