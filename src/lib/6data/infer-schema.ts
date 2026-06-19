import type { ColumnType, SchemaColumn } from './types';

// ─── Type detection helpers ───────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\//i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/;
const BOOL_VALUES = new Set(['true', 'false', '1', '0', 'yes', 'no', 'y', 'n']);

function detectCellType(value: string): ColumnType {
  const v = value.trim();
  if (v === '' || v === 'null' || v === 'NULL' || v === 'N/A' || v === 'n/a') return 'unknown';
  if (BOOL_VALUES.has(v.toLowerCase())) return 'boolean';
  if (DATETIME_RE.test(v)) return 'datetime';
  if (DATE_RE.test(v)) return 'date';
  if (EMAIL_RE.test(v)) return 'email';
  if (URL_RE.test(v)) return 'url';
  const num = Number(v);
  if (!isNaN(num)) {
    return Number.isInteger(num) && !v.includes('.') ? 'integer' : 'decimal';
  }
  return 'text';
}

function mode<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const freq = new Map<T, number>();
  for (const v of arr) freq.set(v, (freq.get(v) ?? 0) + 1);
  let best: T | undefined;
  let bestN = 0;
  freq.forEach((n, v) => { if (n > bestN) { bestN = n; best = v; } });
  return best;
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdDev(nums: number[], mean: number): number {
  if (nums.length < 2) return 0;
  const variance = nums.reduce((s, n) => s + (n - mean) ** 2, 0) / (nums.length - 1);
  return Math.sqrt(variance);
}

// ─── Main inference function ──────────────────────────────────────────────────

export function inferSchema(
  headers: string[],
  rows: Record<string, string>[]
): SchemaColumn[] {
  return headers.map((name) => {
    const allValues = rows.map((r) => (r[name] ?? '').trim());
    const missingValues: string[] = allValues.filter(
      (v) => v === '' || v === 'null' || v === 'NULL' || v === 'N/A' || v === 'n/a'
    );
    const nonMissing = allValues.filter((v) => !missingValues.includes(v));

    // Detect types for non-missing values
    const typeCounts = new Map<ColumnType, number>();
    for (const v of nonMissing) {
      const t = detectCellType(v);
      typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1);
    }

    // Pick the most common non-unknown type
    let detectedType: ColumnType = 'text';
    let bestCount = 0;
    typeCounts.forEach((count, type) => {
      if (type !== 'unknown' && count > bestCount) {
        bestCount = count;
        detectedType = type;
      }
    });

    // If mostly category (< 20 unique values and text)
    const uniqueVals = Array.from(new Set(nonMissing));
    if (
      detectedType === 'text' &&
      uniqueVals.length <= 20 &&
      nonMissing.length > 10
    ) {
      detectedType = 'category';
    }

    // Top values by frequency
    const freq = new Map<string, number>();
    for (const v of nonMissing) freq.set(v, (freq.get(v) ?? 0) + 1);
    const topValues = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([value, count]) => ({ value, count }));

    const sampleValues = uniqueVals.slice(0, 5);

    const col: SchemaColumn = {
      name,
      detectedType,
      finalType: detectedType,
      nullable: missingValues.length > 0,
      missingCount: missingValues.length,
      missingPct: rows.length > 0 ? (missingValues.length / rows.length) * 100 : 0,
      uniqueCount: uniqueVals.length,
      topValues,
      sampleValues,
    };

    // Numeric stats
    if (col.finalType === 'integer' || col.finalType === 'decimal') {
      const nums = nonMissing.map(Number).filter((n) => !isNaN(n));
      if (nums.length > 0) {
        const sorted = [...nums].sort((a, b) => a - b);
        const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
        const sd = stdDev(nums, mean);
        const iqrLow = sorted[Math.floor(sorted.length * 0.25)];
        const iqrHigh = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = iqrHigh - iqrLow;
        const lowerFence = iqrLow - 1.5 * iqr;
        const upperFence = iqrHigh + 1.5 * iqr;
        col.min = sorted[0];
        col.max = sorted[sorted.length - 1];
        col.mean = Math.round(mean * 1000) / 1000;
        col.median = median(sorted);
        col.mode = mode(nums)?.toString();
        col.stdDev = Math.round(sd * 1000) / 1000;
        col.outlierCount = nums.filter(
          (n) => n < lowerFence || n > upperFence
        ).length;
      }
    }

    // Date stats
    if (col.finalType === 'date' || col.finalType === 'datetime') {
      const sorted = nonMissing.slice().sort();
      col.dateMin = sorted[0];
      col.dateMax = sorted[sorted.length - 1];
    }

    return col;
  });
}
