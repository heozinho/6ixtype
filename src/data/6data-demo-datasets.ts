export interface DemoColumn {
  name: string;
  type: 'text' | 'integer' | 'decimal' | 'date' | 'datetime' | 'category';
}

export interface DemoDataset {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  rowCount: number;
  columns: DemoColumn[];
  tags: string[];
  useCases: string[];
  qualityScore: number;
}

export const demoDatasetsMetadata: DemoDataset[] = [
  {
    id: 'demo-music-6stats',
    name: 'Music / 6Stats Demo',
    slug: 'music-6stats',
    description:
      'Simulated Spotify listening history with track metadata, audio features and play counts. Perfect for music analytics, 3D taste mapping and Audio DNA renders.',
    icon: '🎵',
    rowCount: 500,
    columns: [
      { name: 'played_at', type: 'datetime' },
      { name: 'track_name', type: 'text' },
      { name: 'artist_name', type: 'text' },
      { name: 'album_name', type: 'text' },
      { name: 'duration_ms', type: 'integer' },
      { name: 'tempo', type: 'decimal' },
      { name: 'energy', type: 'decimal' },
      { name: 'valence', type: 'decimal' },
      { name: 'danceability', type: 'decimal' },
      { name: 'genre', type: 'category' },
      { name: 'play_count', type: 'integer' },
    ],
    tags: ['Music', 'Spotify', '6Stats', 'Analytics'],
    useCases: ['Music analytics dashboard', '3D music taste cloud', 'Audio DNA render', 'SQL learning', 'Research mode'],
    qualityScore: 94,
  },
  {
    id: 'demo-research-survey',
    name: 'Research Survey Demo',
    slug: 'research-survey',
    description:
      'Anonymised student survey data covering study habits, sleep, stress levels and academic performance. Ideal for research workflows, correlation analysis and statistics lessons.',
    icon: '🔬',
    rowCount: 250,
    columns: [
      { name: 'respondent_id', type: 'text' },
      { name: 'age_group', type: 'category' },
      { name: 'study_hours', type: 'decimal' },
      { name: 'sleep_hours', type: 'decimal' },
      { name: 'stress_level', type: 'integer' },
      { name: 'grade_band', type: 'category' },
      { name: 'commute_time', type: 'integer' },
      { name: 'part_time_job', type: 'category' },
    ],
    tags: ['Research', 'Survey', 'Statistics', 'Education'],
    useCases: ['Research workflow', 'Correlation analysis', 'Chart building', 'Statistics lessons'],
    qualityScore: 88,
  },
  {
    id: 'demo-activity-data',
    name: 'Personal Activity Demo',
    slug: 'activity-data',
    description:
      'Generic personal activity tracking data with categories, durations and scores over time. Great for learning dashboards, chart types and personal analytics workflows.',
    icon: '📋',
    rowCount: 180,
    columns: [
      { name: 'date', type: 'date' },
      { name: 'category', type: 'category' },
      { name: 'activity', type: 'text' },
      { name: 'duration_minutes', type: 'integer' },
      { name: 'score', type: 'decimal' },
      { name: 'notes', type: 'text' },
    ],
    tags: ['Personal', 'Analytics', 'Dashboard', 'Learning'],
    useCases: ['Personal analytics', 'Chart building', 'Dashboard builder', 'Learning mode'],
    qualityScore: 91,
  },
];
export const demoDatasets = demoDatasetsMetadata.map((meta) => {
  const headers = meta.columns.map((c) => c.name);
  // Generate 100 mock rows
  const rows = Array.from({ length: 100 }).map((_, i) => {
    const row: Record<string, string> = {};
    meta.columns.forEach((c) => {
      if (c.type === 'integer') row[c.name] = Math.floor(Math.random() * 1000).toString();
      else if (c.type === 'decimal') row[c.name] = (Math.random() * 100).toFixed(2);
      else if (c.type === 'category') row[c.name] = `Category ${['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)]}`;
      else if (c.type === 'datetime') row[c.name] = new Date(Date.now() - Math.random() * 10000000000).toISOString();
      else if (c.type === 'date') row[c.name] = new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0];
      else row[c.name] = `Sample text ${i + 1}`;
    });
    return row;
  });

  return { ...meta, headers, rows };
});
