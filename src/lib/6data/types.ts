// ─── Core column types ────────────────────────────────────────────────────────

export type ColumnType =
  | 'text'
  | 'integer'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'category'
  | 'url'
  | 'email'
  | 'unknown';

export interface SchemaColumn {
  name: string;
  detectedType: ColumnType;
  finalType: ColumnType;
  nullable: boolean;
  missingCount: number;
  missingPct: number;
  uniqueCount: number;
  topValues: Array<{ value: string; count: number }>;
  sampleValues: string[];
  // Numeric stats (for integer/decimal)
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  mode?: string;
  stdDev?: number;
  outlierCount?: number;
  // Date stats
  dateMin?: string;
  dateMax?: string;
}

// ─── Profile report ───────────────────────────────────────────────────────────

export interface QualityDimension {
  label: string;
  score: number; // 0–100
  detail: string;
}

export interface ProfileReport {
  rowCount: number;
  columnCount: number;
  duplicateRows: number;
  missingCellsTotal: number;
  missingCellsPct: number;
  detectedDateRange?: { min: string; max: string; column: string };
  numericColumnCount: number;
  categoricalColumnCount: number;
  textColumnCount: number;
  qualityScore: number;
  qualityDimensions: QualityDimension[];
  warnings: string[];
  suggestedQuestions: string[];
  suggestedCharts: Array<{ type: string; columns: string[]; reason: string }>;
  columns: SchemaColumn[];
}

// ─── In-browser dataset ────────────────────────────────────────────────────────

export interface ParsedDataset {
  id: string;
  name: string;
  sourceType: 'csv' | 'json' | 'demo' | 'manual';
  workspaceId: string;
  rawHeaders: string[];
  rows: Record<string, string>[]; // raw string values
  schema: SchemaColumn[];
  profile: ProfileReport;
  importedAt: string;
  version: number;
  cleaningSteps: CleaningStep[];
  tags: string[];
}

// ─── Cleaning steps ───────────────────────────────────────────────────────────

export type CleaningStepType =
  | 'rename_column'
  | 'change_type'
  | 'remove_duplicates'
  | 'fill_missing'
  | 'remove_missing_rows'
  | 'trim_whitespace'
  | 'replace_values'
  | 'filter_rows'
  | 'lowercase'
  | 'uppercase'
  | 'drop_column'
  | 'create_calculated_column';

export interface CleaningStep {
  id: string;
  stepType: CleaningStepType;
  description: string;
  config: Record<string, unknown>;
  appliedAt: string;
}

// ─── Query Lab ────────────────────────────────────────────────────────────────

export interface SavedQuery {
  id: string;
  name: string;
  description?: string;
  datasetId: string;
  sql: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Visualisation Studio ───────────────────────────────────────────────────────

export type ChartType = 'bar' | 'line' | 'area' | 'scatter';

export interface SavedChart {
  id: string;
  name: string;
  datasetId: string;
  type: ChartType;
  xAxis: string;
  yAxis: string;
  createdAt: string;
}

// ─── Dashboard Builder ─────────────────────────────────────────────────────────

export interface DashboardWidget {
  id: string;
  chartId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SavedDashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

// ─── Research Workspace ────────────────────────────────────────────────────────

export interface ResearchNote {
  id: string;
  title: string;
  content: string; // Markdown content
  linkedChartIds: string[]; // Reference to SavedCharts
  createdAt: string;
  updatedAt: string;
}
