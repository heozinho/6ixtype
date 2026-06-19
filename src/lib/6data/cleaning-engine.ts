import type { SchemaColumn, CleaningStep, ColumnType } from './types';
import { inferSchema } from './infer-schema';

interface CleaningResult {
  rows: Record<string, string>[];
  schema: SchemaColumn[];
}

export function applyCleaningSteps(
  rawRows: Record<string, string>[],
  rawSchema: SchemaColumn[],
  steps: CleaningStep[]
): CleaningResult {
  if (steps.length === 0) {
    return { rows: rawRows, schema: rawSchema };
  }

  // Deep clone rows to avoid mutating the original dataset
  let currentRows = rawRows.map((r) => ({ ...r }));
  let currentHeaders = rawSchema.map((s) => s.name);

  for (const step of steps) {
    const config = step.config;

    switch (step.stepType) {
      case 'rename_column': {
        const { oldName, newName } = config as { oldName: string; newName: string };
        if (oldName && newName && oldName !== newName) {
          currentHeaders = currentHeaders.map((h) => (h === oldName ? newName : h));
          for (const row of currentRows) {
            if (oldName in row) {
              row[newName] = row[oldName];
              delete row[oldName];
            }
          }
        }
        break;
      }

      case 'drop_column': {
        const { column } = config as { column: string };
        if (column) {
          currentHeaders = currentHeaders.filter((h) => h !== column);
          for (const row of currentRows) {
            delete row[column];
          }
        }
        break;
      }

      case 'fill_missing': {
        const { column, value } = config as { column: string; value: string };
        if (column && value !== undefined) {
          for (const row of currentRows) {
            const val = row[column]?.trim();
            if (!val || val === 'null' || val === 'NULL' || val === 'N/A' || val === 'n/a') {
              row[column] = value;
            }
          }
        }
        break;
      }

      case 'trim_whitespace': {
        const { column } = config as { column: string };
        if (column) {
          for (const row of currentRows) {
            if (row[column]) {
              row[column] = row[column].trim();
            }
          }
        }
        break;
      }

      case 'remove_duplicates': {
        // If columns are specified, dedupe based on those. Otherwise, dedupe whole row.
        const { columns } = config as { columns?: string[] };
        const colsToHash = columns && columns.length > 0 ? columns : currentHeaders;
        
        const seen = new Set<string>();
        const uniqueRows = [];
        for (const row of currentRows) {
          const hash = colsToHash.map((c) => row[c] ?? '').join('|~|');
          if (!seen.has(hash)) {
            seen.add(hash);
            uniqueRows.push(row);
          }
        }
        currentRows = uniqueRows;
        break;
      }

      // Note: 'change_type' affects the inferred schema. The engine applies this by 
      // coercing values if needed, but the actual schema type override should be passed down.
      // For this MVP, we let inferSchema run at the end. If the user forced a type, 
      // we need to remember it, but currently the schema generated from inferSchema overrides it.
      // Let's handle forced types by applying them after inferSchema.
      case 'change_type': {
        const { column, newType } = config as { column: string; newType: ColumnType };
        // We do nothing to the string values themselves, they remain strings.
        // The type override is handled below after inferSchema.
        break;
      }
    }
  }

  // Re-infer schema based on cleaned data
  const newSchema = inferSchema(currentHeaders, currentRows);

  // Apply explicit type overrides from 'change_type' steps
  for (const step of steps) {
    if (step.stepType === 'change_type') {
      const { column, newType } = step.config as { column: string; newType: ColumnType };
      const schemaCol = newSchema.find((c) => c.name === column);
      if (schemaCol) {
        schemaCol.finalType = newType;
      }
    }
  }

  return { rows: currentRows, schema: newSchema };
}
