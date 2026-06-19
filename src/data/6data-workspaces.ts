export interface MockDataset {
  id: string;
  name: string;
  sourceType: string;
  rowCount: number;
  columnCount: number;
  qualityScore: number;
  status: 'ready' | 'importing' | 'error';
  lastUpdated: string;
}

export interface MockWorkspace {
  id: string;
  name: string;
  description: string;
  datasetCount: number;
  dashboardCount: number;
  lastActive: string;
  icon: string;
  datasets: MockDataset[];
}

export const mockWorkspaces: MockWorkspace[] = [
  {
    id: 'ws-spotify-research',
    name: 'Spotify Research',
    description: 'Music listening data analysis and visualisation',
    datasetCount: 3,
    dashboardCount: 2,
    lastActive: '2 hours ago',
    icon: '🎵',
    datasets: [
      {
        id: 'ds-music-history',
        name: 'Listening History',
        sourceType: 'CSV',
        rowCount: 500,
        columnCount: 11,
        qualityScore: 94,
        status: 'ready',
        lastUpdated: '2 hours ago',
      },
      {
        id: 'ds-top-tracks',
        name: 'Top Tracks',
        sourceType: '6Stats',
        rowCount: 50,
        columnCount: 8,
        qualityScore: 98,
        status: 'ready',
        lastUpdated: '3 hours ago',
      },
    ],
  },
  {
    id: 'ws-university-research',
    name: 'University Research Project',
    description: 'Student survey data and academic performance analysis',
    datasetCount: 2,
    dashboardCount: 1,
    lastActive: 'Yesterday',
    icon: '🔬',
    datasets: [
      {
        id: 'ds-survey-data',
        name: 'Student Survey 2024',
        sourceType: 'CSV',
        rowCount: 250,
        columnCount: 8,
        qualityScore: 88,
        status: 'ready',
        lastUpdated: 'Yesterday',
      },
    ],
  },
  {
    id: 'ws-personal-analytics',
    name: 'Personal Analytics',
    description: 'Personal habit tracking and activity data',
    datasetCount: 1,
    dashboardCount: 1,
    lastActive: '3 days ago',
    icon: '📋',
    datasets: [
      {
        id: 'ds-activity-log',
        name: 'Activity Log 2024',
        sourceType: 'CSV',
        rowCount: 180,
        columnCount: 6,
        qualityScore: 91,
        status: 'ready',
        lastUpdated: '3 days ago',
      },
    ],
  },
  {
    id: 'ws-demo-lab',
    name: 'Demo Data Lab',
    description: 'Explore built-in demo datasets and sample workflows',
    datasetCount: 3,
    dashboardCount: 0,
    lastActive: 'Just now',
    icon: '🧪',
    datasets: [],
  },
];
