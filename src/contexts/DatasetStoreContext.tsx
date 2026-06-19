'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ParsedDataset } from '@/lib/6data/types';
import { datasetStore } from '@/lib/6data/store';

interface DatasetStoreCtx {
  datasets: ParsedDataset[];
  addDataset: (ds: ParsedDataset) => void;
  updateDataset: (id: string, patch: Partial<ParsedDataset>) => void;
  removeDataset: (id: string) => void;
  getDataset: (id: string) => ParsedDataset | undefined;
  refresh: () => void;
}

const DatasetStoreContext = createContext<DatasetStoreCtx>({
  datasets: [],
  addDataset: () => undefined,
  updateDataset: () => undefined,
  removeDataset: () => undefined,
  getDataset: () => undefined,
  refresh: () => undefined,
});

export function DatasetStoreProvider({ children }: { children: React.ReactNode }) {
  const [datasets, setDatasets] = useState<ParsedDataset[]>([]);

  const refresh = useCallback(() => {
    setDatasets(datasetStore.getAll());
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

  return (
    <DatasetStoreContext.Provider
      value={{ datasets, addDataset, updateDataset, removeDataset, getDataset, refresh }}
    >
      {children}
    </DatasetStoreContext.Provider>
  );
}

export function useDatasetStore() {
  return useContext(DatasetStoreContext);
}
