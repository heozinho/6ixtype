import type { SchemaColumn, QualityDimension, ProfileReport } from './types';

// ─── Quality score computation ─────────────────────────────────────────────

function computeCompleteness(columns: SchemaColumn[]): QualityDimension {
  if (columns.length === 0) return { label: 'Completeness', score: 100, detail: 'No columns' };
  const avgMissing = columns.reduce((s, c) => s + c.missingPct, 0) / columns.length;
  const score = Math.round(100 - avgMissing);
  return {
    label: 'Completeness',
    score: Math.max(0, score),
    detail: `${score}% of cells have values`,
  };
}

function computeUniqueness(
  columns: SchemaColumn[],
  rowCount: number,
  duplicateRows: number
): QualityDimension {
  const dupPct = rowCount > 0 ? (duplicateRows / rowCount) * 100 : 0;
  const score = Math.round(100 - dupPct);
  return {
    label: 'Uniqueness',
    score: Math.max(0, score),
    detail:
      duplicateRows === 0
        ? 'No duplicate rows detected'
        : `${duplicateRows} duplicate row${duplicateRows !== 1 ? 's' : ''} found`,
  };
}

function computeTypeConfidence(columns: SchemaColumn[], rowCount: number): QualityDimension {
  if (columns.length === 0 || rowCount === 0)
    return { label: 'Type Confidence', score: 100, detail: 'No data' };
  // Measure how many non-missing cells match the inferred type (proxy: columns with unknown < 5%)
  const wellTyped = columns.filter(
    (c) =>
      c.detectedType !== 'unknown' &&
      c.missingPct < 5
  ).length;
  const score = Math.round((wellTyped / columns.length) * 100);
  return {
    label: 'Type Confidence',
    score,
    detail: `${wellTyped}/${columns.length} columns have confident types`,
  };
}

function computeConsistency(columns: SchemaColumn[]): QualityDimension {
  // Columns with mixed formats penalise consistency
  const dateColsWithRange = columns.filter(
    (c) => (c.detectedType === 'date' || c.detectedType === 'datetime') && c.dateMin
  );
  const inconsistentCols = columns.filter((c) => c.detectedType === 'unknown' && c.missingPct < 50);
  const score = Math.max(0, Math.round(100 - (inconsistentCols.length / Math.max(1, columns.length)) * 40));
  const _ = dateColsWithRange; // used to avoid lint
  return {
    label: 'Consistency',
    score,
    detail:
      inconsistentCols.length === 0
        ? 'No inconsistencies detected'
        : `${inconsistentCols.length} column${inconsistentCols.length !== 1 ? 's' : ''} with inconsistent values`,
  };
}

function computeValidity(columns: SchemaColumn[], rowCount: number): QualityDimension {
  if (rowCount === 0) return { label: 'Validity', score: 100, detail: 'No data' };
  const avgOutlierPct =
    columns
      .filter((c) => c.outlierCount !== undefined)
      .reduce((s, c) => s + (((c.outlierCount ?? 0) / rowCount) * 100), 0) /
    Math.max(1, columns.filter((c) => c.outlierCount !== undefined).length);
  const score = Math.max(0, Math.round(100 - avgOutlierPct * 2));
  return {
    label: 'Validity',
    score,
    detail: `${Math.round(avgOutlierPct)}% outlier rate in numeric columns`,
  };
}

// ─── Duplicate row detection (hash-based) ─────────────────────────────────────

function countDuplicates(rows: Record<string, string>[]): number {
  const seen = new Set<string>();
  let dupes = 0;
  for (const row of rows) {
    const key = JSON.stringify(row);
    if (seen.has(key)) dupes++;
    else seen.add(key);
  }
  return dupes;
}

// ─── Suggested charts ─────────────────────────────────────────────────────────

function suggestCharts(columns: SchemaColumn[]): Array<{ type: string; columns: string[]; reason: string }> {
  const suggestions: Array<{ type: string; columns: string[]; reason: string }> = [];
  const dateCol = columns.find((c) => c.detectedType === 'date' || c.detectedType === 'datetime');
  const numericCols = columns.filter((c) => c.detectedType === 'integer' || c.detectedType === 'decimal');
  const catCols = columns.filter((c) => c.detectedType === 'category');

  if (dateCol && numericCols.length > 0) {
    suggestions.push({
      type: 'Line Chart',
      columns: [dateCol.name, numericCols[0].name],
      reason: 'Date + numeric column — good for trends over time',
    });
  }
  if (catCols.length > 0 && numericCols.length > 0) {
    suggestions.push({
      type: 'Bar Chart',
      columns: [catCols[0].name, numericCols[0].name],
      reason: 'Category + numeric — compare values across groups',
    });
  }
  if (numericCols.length >= 2) {
    suggestions.push({
      type: 'Scatter Plot',
      columns: [numericCols[0].name, numericCols[1].name],
      reason: 'Two numeric columns — explore correlations',
    });
    suggestions.push({
      type: 'Histogram',
      columns: [numericCols[0].name],
      reason: `Distribution of ${numericCols[0].name}`,
    });
  }
  if (catCols.length > 0) {
    suggestions.push({
      type: 'Donut Chart',
      columns: [catCols[0].name],
      reason: `Share breakdown of ${catCols[0].name}`,
    });
  }
  return suggestions.slice(0, 5);
}

// ─── Suggested questions ──────────────────────────────────────────────────────

function suggestQuestions(columns: SchemaColumn[]): string[] {
  const qs: string[] = [];
  const catCols = columns.filter((c) => c.detectedType === 'category');
  const numCols = columns.filter((c) => c.detectedType === 'integer' || c.detectedType === 'decimal');
  const dateCols = columns.filter((c) => c.detectedType === 'date' || c.detectedType === 'datetime');
  const missingCols = columns.filter((c) => c.missingCount > 0);

  if (catCols.length > 0) qs.push(`What are the top ${catCols[0].name} values by count?`);
  if (numCols.length > 0) qs.push(`What is the average ${numCols[0].name}?`);
  if (dateCols.length > 0 && numCols.length > 0)
    qs.push(`How does ${numCols[0].name} change over time?`);
  if (missingCols.length > 0) qs.push('Which rows have missing values?');
  qs.push('Which records are duplicates?');
  if (numCols.length > 0) qs.push(`What are the highest and lowest ${numCols[0].name} values?`);
  if (catCols.length > 0 && numCols.length > 0)
    qs.push(`What is the total ${numCols[0].name} by ${catCols[0].name}?`);
  return qs.slice(0, 6);
}

// ─── Warnings ────────────────────────────────────────────────────────────────

function buildWarnings(
  columns: SchemaColumn[],
  duplicateRows: number,
  rowCount: number
): string[] {
  const warnings: string[] = [];
  if (duplicateRows > 0) warnings.push(`${duplicateRows} duplicate row${duplicateRows !== 1 ? 's' : ''} detected.`);
  for (const col of columns) {
    if (col.missingCount > 0)
      warnings.push(
        `Column "${col.name}" has ${col.missingCount} missing value${col.missingCount !== 1 ? 's' : ''} (${col.missingPct.toFixed(1)}%).`
      );
    if (col.detectedType === 'unknown' && col.missingPct < 80)
      warnings.push(`Column "${col.name}" contains mixed or unrecognised value types.`);
    if (col.outlierCount && col.outlierCount > 0 && rowCount > 0)
      warnings.push(
        `Column "${col.name}" has ${col.outlierCount} possible outlier${col.outlierCount !== 1 ? 's' : ''}.`
      );
    if (col.uniqueCount === (rowCount - col.missingCount) && rowCount > 10)
      warnings.push(`Column "${col.name}" has all unique values — possible primary key.`);
  }
  return warnings.slice(0, 8);
}

// ─── Main profile function ────────────────────────────────────────────────────

export function generateProfile(
  rows: Record<string, string>[],
  columns: SchemaColumn[]
): ProfileReport {
  const rowCount = rows.length;
  const duplicateRows = countDuplicates(rows);
  const missingCellsTotal = columns.reduce((s, c) => s + c.missingCount, 0);
  const totalCells = rowCount * columns.length;
  const missingCellsPct = totalCells > 0 ? (missingCellsTotal / totalCells) * 100 : 0;

  const dateCols = columns.filter(
    (c) => (c.detectedType === 'date' || c.detectedType === 'datetime') && c.dateMin
  );
  const detectedDateRange =
    dateCols.length > 0
      ? { min: dateCols[0].dateMin!, max: dateCols[0].dateMax!, column: dateCols[0].name }
      : undefined;

  const dims: QualityDimension[] = [
    computeCompleteness(columns),
    computeConsistency(columns),
    computeUniqueness(columns, rowCount, duplicateRows),
    computeTypeConfidence(columns, rowCount),
    computeValidity(columns, rowCount),
    { label: 'Freshness', score: 100, detail: 'Just imported' },
  ];

  const qualityScore = Math.round(dims.reduce((s, d) => s + d.score, 0) / dims.length);

  return {
    rowCount,
    columnCount: columns.length,
    duplicateRows,
    missingCellsTotal,
    missingCellsPct,
    detectedDateRange,
    numericColumnCount: columns.filter(
      (c) => c.detectedType === 'integer' || c.detectedType === 'decimal'
    ).length,
    categoricalColumnCount: columns.filter((c) => c.detectedType === 'category').length,
    textColumnCount: columns.filter((c) => c.detectedType === 'text').length,
    qualityScore,
    qualityDimensions: dims,
    warnings: buildWarnings(columns, duplicateRows, rowCount),
    suggestedQuestions: suggestQuestions(columns),
    suggestedCharts: suggestCharts(columns),
    columns,
  };
}
