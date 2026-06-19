import alasql from 'alasql';
import { inferSchema } from './infer-schema';
import type { SchemaColumn } from './types';

export interface QueryResult {
  rows: Record<string, string>[];
  schema: SchemaColumn[];
  executionTimeMs: number;
}

export async function executeQuery(
  sql: string,
  datasetName: string,
  rows: Record<string, string>[]
): Promise<QueryResult> {
  const start = performance.now();

  try {
    // Create an in-memory table named after the dataset (safely escaped)
    const tableName = datasetName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'dataset';
    
    // AlaSQL expects an array of objects
    // It can handle basic standard SQL natively against this array
    const data = { [tableName]: rows };
    
    // If the user didn't specify the table name, try to replace a placeholder like '?' or 'dataset'
    let finalSql = sql;
    
    // Run the query
    // AlaSQL syntax for querying a JS array variable is: SELECT * FROM ?
    // But since we want to give them a real table name feel, we pass it as a database object
    // Or we can just use the standard AlaSQL '?' parameter for the single dataset
    
    // Let's support `SELECT * FROM data` by default
    finalSql = finalSql.replace(/from\s+data\b/i, 'FROM ?');

    // Run
    let resultRows = alasql(finalSql, [rows]);

    // AlaSQL might return an array of arrays if multiple statements, we assume single statement
    if (Array.isArray(resultRows) && Array.isArray(resultRows[0]) && resultRows.length > 0 && typeof resultRows[0][0] !== 'object') {
       // weird alasql multi-return
    }

    // Force result to be an array of string-record objects
    // SQL aggregation might return numbers, so we stringify everything to match our engine expectations
    const stringifiedRows = (resultRows as any[]).map((row) => {
      const newRow: Record<string, string> = {};
      for (const [k, v] of Object.entries(row)) {
        newRow[k] = v === null || v === undefined ? '' : String(v);
      }
      return newRow;
    });

    // Re-infer schema on the result
    const headers = stringifiedRows.length > 0 ? Object.keys(stringifiedRows[0]) : [];
    const schema = inferSchema(headers, stringifiedRows);

    return {
      rows: stringifiedRows,
      schema,
      executionTimeMs: Math.round(performance.now() - start),
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown SQL execution error');
  }
}
