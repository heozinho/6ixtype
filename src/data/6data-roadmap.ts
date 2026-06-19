export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapStage {
  stage: string;
  label: string;
  status: 'active' | 'next' | 'future';
  items: RoadmapItem[];
}

export const roadmap: RoadmapStage[] = [
  {
    stage: 'MVP',
    label: 'Foundation',
    status: 'active',
    items: [
      { id: 'launchpad', title: 'Launchpad & Landing', description: 'Ecosystem hub and 6Data public product page' },
      { id: 'app-shell', title: 'App Shell', description: 'Sidebar, topbar, workspace selector, empty states' },
      { id: 'csv-import', title: 'CSV & JSON Import', description: 'Upload, preview, schema inference, profile generation' },
      { id: 'dataset-profile', title: 'Dataset Profiler', description: 'Quality score, column stats, warnings, suggested questions' },
      { id: 'data-preview', title: 'Data Preview Table', description: 'Paginated, searchable, filterable, sortable' },
      { id: 'cleaning-studio', title: 'Cleaning Studio', description: 'Tracked steps, before/after preview, lineage' },
      { id: 'query-lab', title: 'Query Lab MVP', description: 'SQL editor, result table, save query, turn result into chart' },
      { id: 'chart-builder', title: 'Chart Builder', description: 'Bar, line, area, scatter, donut, histogram, heatmap' },
      { id: 'dashboard-builder', title: 'Dashboard Builder', description: 'Widgets, layout, save, preview mode' },
      { id: 'research-workspace', title: 'Research Workspace', description: 'Question, hypothesis, datasets, findings, markdown export' },
      { id: 'learning-mode', title: 'Learning Mode', description: 'Dataset-aware SQL and stats lessons' },
      { id: 'demo-datasets', title: 'Demo Datasets', description: 'Music/6Stats, Research Survey, Activity data' },
    ],
  },
  {
    stage: 'v1',
    label: 'Depth',
    status: 'next',
    items: [
      { id: '3d-scatter', title: '3D Scatter Plot', description: 'X/Y/Z mapping, orbit, tooltips, screenshot export' },
      { id: 'render-studio', title: 'Render Studio v1', description: 'Data Orb, Category Towers, Audio DNA, PNG export' },
      { id: '6stats-connector', title: '6Stats Demo Import', description: 'Music analytics dataset connector' },
      { id: 'publishing-hub', title: 'Publishing Hub', description: 'CSV, JSON, Markdown, PNG exports' },
      { id: 'sqlite-upload', title: 'SQLite Upload', description: 'Upload .db files, inspect schema, import tables' },
      { id: 'saved-queries', title: 'Saved Queries & History', description: 'Query library, run history, version tracking' },
      { id: 'lineage-timeline', title: 'Lineage Timeline', description: 'Visual dataset history from import to export' },
    ],
  },
  {
    stage: 'v2',
    label: 'Power',
    status: 'future',
    items: [
      { id: 'postgres-connector', title: 'Postgres & Supabase', description: 'Read-only connections, schema explorer, live queries' },
      { id: 'rest-api', title: 'REST API Connector', description: 'Connect any JSON API, map fields, schedule refreshes' },
      { id: 'automation-centre', title: 'Automation Centre', description: 'Scheduled imports, cleaning pipelines, quality alerts' },
      { id: 'public-dashboards', title: 'Public Dashboards', description: 'Share links, public/private modes, embedded views' },
      { id: 'ai-analyst', title: 'AI Analyst', description: 'Explain datasets, suggest cleaning, generate SQL with full transparency' },
      { id: 'team-workspaces', title: 'Team Workspaces', description: 'Shared workspaces, roles, activity logs' },
      { id: '3d-advanced', title: '3D Advanced Views', description: 'Cluster galaxies, density clouds, animated timelines' },
    ],
  },
];
