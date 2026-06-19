export interface Capability {
  id: string;
  name: string;
  icon: string;
  description: string;
  stage: 'mvp' | 'v1' | 'v2';
  tags: string[];
}

export const capabilities: Capability[] = [
  {
    id: 'import-centre',
    name: 'Import Centre',
    icon: '📥',
    description:
      'Bring in data from CSV, JSON, databases, APIs and apps. Every import is versioned and preserved.',
    stage: 'mvp',
    tags: ['CSV', 'JSON', 'API'],
  },
  {
    id: 'data-vault',
    name: 'Data Vault',
    icon: '🗄️',
    description:
      'Long-term storage for raw files, cleaned versions, dataset snapshots and export history. Nothing gets deleted.',
    stage: 'mvp',
    tags: ['Storage', 'Versioning', 'Lineage'],
  },
  {
    id: 'dataset-profiles',
    name: 'Dataset Profiles',
    icon: '📊',
    description:
      'Automatic profiling of every dataset: row counts, column types, missing values, quality scores and warnings.',
    stage: 'mvp',
    tags: ['Quality', 'Statistics', 'Insights'],
  },
  {
    id: 'cleaning-studio',
    name: 'Cleaning Studio',
    icon: '🧹',
    description:
      'Apply tracked cleaning steps without destroying raw data. Rename, type-cast, deduplicate, fill, filter and transform.',
    stage: 'mvp',
    tags: ['Cleaning', 'Transform', 'Lineage'],
  },
  {
    id: 'query-lab',
    name: 'Query Lab',
    icon: '🔍',
    description:
      'SQL editor and visual query builder for any skill level. Save queries, view history, turn results into charts.',
    stage: 'mvp',
    tags: ['SQL', 'Visual', 'History'],
  },
  {
    id: 'visualisation-studio',
    name: 'Visualisation Studio',
    icon: '📈',
    description:
      'Build charts from datasets or query results. Bar, line, area, scatter, histogram, heatmap, donut and more.',
    stage: 'mvp',
    tags: ['Charts', 'Analytics', 'Exports'],
  },
  {
    id: '3d-lab',
    name: '3D Lab',
    icon: '🧊',
    description:
      'Explore data spatially. 3D scatter plots, bar fields, terrain surfaces and animated timelines.',
    stage: 'v1',
    tags: ['3D', 'Exploration', 'Interactive'],
  },
  {
    id: 'render-studio',
    name: 'Render Studio',
    icon: '🎨',
    description:
      'Create polished data-driven renders and visual stories. Data Orb, Category Towers, Audio DNA and more.',
    stage: 'v1',
    tags: ['Renders', 'Export', 'Storytelling'],
  },
  {
    id: 'dashboard-builder',
    name: 'Dashboard Builder',
    icon: '🗂️',
    description:
      'Combine charts, queries, tables, notes and renders into reusable, shareable dashboards.',
    stage: 'mvp',
    tags: ['Dashboards', 'Sharing', 'Widgets'],
  },
  {
    id: 'research-workspace',
    name: 'Research Workspace',
    icon: '🔬',
    description:
      'Reproducible research projects with question, hypothesis, datasets, methods, findings and export.',
    stage: 'mvp',
    tags: ['Research', 'Reproducibility', 'Export'],
  },
  {
    id: 'learning-mode',
    name: 'Learning Mode',
    icon: '🎓',
    description:
      'Learn SQL, data cleaning, statistics and chart selection using your own datasets. Dataset-aware lessons.',
    stage: 'mvp',
    tags: ['SQL', 'Statistics', 'Learning'],
  },
  {
    id: 'automation-centre',
    name: 'Automation Centre',
    icon: '⚡',
    description:
      'Schedule imports, run cleaning pipelines automatically, trigger quality alerts and refresh dashboards.',
    stage: 'v2',
    tags: ['Automation', 'Scheduling', 'Alerts'],
  },
  {
    id: 'publishing-hub',
    name: 'Publishing Hub',
    icon: '🌐',
    description:
      'Export CSV, JSON, Markdown reports, chart images and renders. Share dashboards publicly or privately.',
    stage: 'v1',
    tags: ['Export', 'Sharing', 'Reports'],
  },
  {
    id: 'connector-marketplace',
    name: 'Connector Marketplace',
    icon: '🔌',
    description:
      'Connect Postgres, Supabase, SQLite, REST APIs, Google Sheets and 6Stats for richer data intake.',
    stage: 'v2',
    tags: ['Connectors', 'Databases', 'APIs'],
  },
];

export const lifecycleSteps = [
  'Import',
  'Inspect',
  'Profile',
  'Clean',
  'Transform',
  'Query',
  'Visualise',
  'Explore',
  'Render',
  'Research',
  'Learn',
  'Dashboard',
  'Publish',
  'Automate',
];
