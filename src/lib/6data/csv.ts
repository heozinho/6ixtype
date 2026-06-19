/**
 * Client-side CSV parser.
 * Handles quoted fields, escaped quotes, and CRLF/LF line endings.
 */

export interface ParseResult {
  headers: string[];
  rows: Record<string, string>[];
  rowCount: number;
  error?: string;
}

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      // Quoted field
      let field = '';
      i++; // skip opening quote
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          field += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++; // skip closing quote
          break;
        } else {
          field += line[i];
          i++;
        }
      }
      fields.push(field);
      if (line[i] === ',') i++;
    } else {
      // Unquoted field
      const start = i;
      while (i < line.length && line[i] !== ',') i++;
      fields.push(line.slice(start, i));
      if (line[i] === ',') i++;
    }
  }
  return fields;
}

export function parseCSV(text: string): ParseResult {
  try {
    // Normalise line endings
    const normalised = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalised.split('\n').filter((l) => l.trim() !== '');

    if (lines.length === 0) {
      return { headers: [], rows: [], rowCount: 0, error: 'File is empty.' };
    }

    const headers = parseLine(lines[0]).map((h) => h.trim());

    if (headers.length === 0) {
      return { headers: [], rows: [], rowCount: 0, error: 'No headers detected.' };
    }

    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = (values[idx] ?? '').trim();
      });
      rows.push(row);
    }

    return { headers, rows, rowCount: rows.length };
  } catch (e) {
    return {
      headers: [],
      rows: [],
      rowCount: 0,
      error: e instanceof Error ? e.message : 'Failed to parse CSV.',
    };
  }
}

/** Read a File object and parse it as CSV */
export async function readFileAsCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(parseCSV(text));
    };
    reader.onerror = () =>
      resolve({ headers: [], rows: [], rowCount: 0, error: 'Failed to read file.' });
    reader.readAsText(file, 'utf-8');
  });
}
