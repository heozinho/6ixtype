'use client';
import { useState, useRef } from 'react';
import { Database, Loader2, Table as TableIcon } from 'lucide-react';

interface SQLiteUploaderProps {
  onDataExtracted: (headers: string[], rows: any[], filename: string) => void;
  onError: (msg: string) => void;
}

export default function SQLiteUploader({ onDataExtracted, onError }: SQLiteUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<string[]>([]);
  const [dbInstance, setDbInstance] = useState<any>(null);
  const [filename, setFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFilename(file.name);

    try {
      // Lazy load initSqlJs so it runs only on client
      const initSqlJs = (await import('sql.js')).default;
      
      const SQL = await initSqlJs({
        locateFile: file => `/${file}` // Loads sql-wasm.wasm from public dir
      });

      const buffer = await file.arrayBuffer();
      const db = new SQL.Database(new Uint8Array(buffer));
      
      // Get all tables
      const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      
      if (res.length > 0 && res[0].values) {
        const tableNames = res[0].values.map((row: any) => row[0]);
        setTables(tableNames);
        setDbInstance(db);
      } else {
        onError("No tables found in this SQLite database.");
      }
    } catch (err: any) {
      console.error(err);
      onError("Failed to parse SQLite database. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTable = (tableName: string) => {
    if (!dbInstance) return;
    
    try {
      // Select all from chosen table
      const res = dbInstance.exec(`SELECT * FROM "${tableName}"`);
      if (res.length === 0) {
        onError(`Table ${tableName} is empty.`);
        return;
      }
      
      const headers = res[0].columns;
      const rawRows = res[0].values;
      
      // Map raw arrays to objects mapping headers to values
      const rows = rawRows.map((rowArr: any[]) => {
        const obj: any = {};
        headers.forEach((h: string, i: number) => {
          obj[h] = rowArr[i];
        });
        return obj;
      });

      onDataExtracted(headers, rows, `${filename} - ${tableName}`);
    } catch (err: any) {
      onError("Failed to read table data. " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {!dbInstance && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-white/[0.02] hover:bg-cyan-500/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".sqlite,.db,.sqlite3"
            className="hidden"
          />
          {loading ? (
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
          ) : (
            <Database className="w-10 h-10 text-cyan-400 mb-4" />
          )}
          <h3 className="text-sm font-bold text-white mb-2">
            {loading ? 'Parsing Database...' : 'Click to Upload SQLite Database'}
          </h3>
          <p className="text-xs text-white/40 max-w-[250px]">
            Accepts .db, .sqlite, and .sqlite3 files. Parsed entirely via WebAssembly.
          </p>
        </div>
      )}

      {dbInstance && tables.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-white/50">Found {tables.length} tables in <span className="font-bold text-white">{filename}</span>. Select a table to import as a Dataset:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tables.map(t => (
              <button
                key={t}
                onClick={() => handleSelectTable(t)}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <TableIcon className="w-4 h-4" />
                </div>
                <div className="truncate text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {t}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
