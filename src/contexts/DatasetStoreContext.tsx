'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ParsedDataset, SavedQuery } from '@/lib/6data/types';
import { datasetStore, queryStore } from '@/lib/6data/store';

interface DatasetStoreCtx {
  datasets: ParsedDataset[];
  queries: SavedQuery[];
  addDataset: (ds: ParsedDataset) => void;
  updateDataset: (id: string, patch: Partial<ParsedDataset>) => void;
  removeDataset: (id: string) => void;
  getDataset: (id: string) => ParsedDataset | undefined;
  addQuery: (q: SavedQuery) => void;
  removeQuery: (id: string) => void;
  refresh: () => void;
}

const DatasetStoreContext = createContext<DatasetStoreCtx>({
  datasets: [],
  queries: [],
  addDataset: () => undefined,
  updateDataset: () => undefined,
  removeDataset: () => undefined,
  getDataset: () => undefined,
  addQuery: () => undefined,
  removeQuery: () => undefined,
  refresh: () => undefined,
});

export function DatasetStoreProvider({ children }: { children: React.ReactNode }) {
  const [datasets, setDatasets] = useState<ParsedDataset[]>([]);
  const [queries, setQueries] = useState<SavedQuery[]>([]);

  const refresh = useCallback(() => {
    setDatasets(datasetStore.getAll());
    setQueries(queryStore.getAll());
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

  return (
    <DatasetStoreContext.Provider
      value={{ datasets, queries, addDataset, updateDataset, removeDataset, getDataset, addQuery, removeQuery, refresh }}
    >
      {children}
    </DatasetStoreContext.Provider>
  );
}

export function useDatasetStore() {
  return useContext(DatasetStoreContext);
}
