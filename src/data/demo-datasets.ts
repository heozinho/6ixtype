import { inferSchema } from '@/lib/6data/infer-schema';
import { generateProfile } from '@/lib/6data/profile';
import type { ParsedDataset } from '@/lib/6data/types';

export const demoSpotifyData = [
  { track: 'Blinding Lights', artist: 'The Weeknd', plays: 124, duration_ms: 200040, skipped: false },
  { track: 'Shape of You', artist: 'Ed Sheeran', plays: 89, duration_ms: 233712, skipped: true },
  { track: 'Dance Monkey', artist: 'Tones and I', plays: 45, duration_ms: 209438, skipped: false },
  { track: 'Rockstar', artist: 'Post Malone', plays: 156, duration_ms: 218146, skipped: false },
  { track: 'Someone You Loved', artist: 'Lewis Capaldi', plays: 78, duration_ms: 182160, skipped: true },
  { track: 'Sunflower', artist: 'Post Malone', plays: 210, duration_ms: 157560, skipped: false },
  { track: 'One Dance', artist: 'Drake', plays: 144, duration_ms: 173986, skipped: false },
  { track: 'Closer', artist: 'The Chainsmokers', plays: 132, duration_ms: 244960, skipped: false },
  { track: 'Believer', artist: 'Imagine Dragons', plays: 95, duration_ms: 204346, skipped: false },
  { track: 'Perfect', artist: 'Ed Sheeran', plays: 64, duration_ms: 263400, skipped: true },
];

export const demoSalesData = [
  { date: '2023-01-01', revenue: 1500, customers: 45, region: 'North' },
  { date: '2023-01-02', revenue: 1800, customers: 50, region: 'North' },
  { date: '2023-01-03', revenue: 1200, customers: 35, region: 'South' },
  { date: '2023-01-04', revenue: 2100, customers: 60, region: 'West' },
  { date: '2023-01-05', revenue: 1600, customers: 48, region: 'East' },
  { date: '2023-01-06', revenue: 2500, customers: 72, region: 'North' },
  { date: '2023-01-07', revenue: 3100, customers: 85, region: 'West' },
  { date: '2023-01-08', revenue: 1400, customers: 42, region: 'South' },
  { date: '2023-01-09', revenue: 1900, customers: 55, region: 'East' },
  { date: '2023-01-10', revenue: 2200, customers: 65, region: 'North' },
];

export function getDemoDatasets(): ParsedDataset[] {
  const spotifySchema = inferSchema(Object.keys(demoSpotifyData[0]), demoSpotifyData as any);
  const salesSchema = inferSchema(Object.keys(demoSalesData[0]), demoSalesData as any);

  const ds1: ParsedDataset = {
    id: `ds-demo-spotify-${Date.now()}`,
    name: 'Spotify Listening History',
    sourceType: 'demo',
    workspaceId: 'ws-1',
    rawHeaders: Object.keys(demoSpotifyData[0]),
    rows: demoSpotifyData as any,
    schema: spotifySchema,
    profile: generateProfile(demoSpotifyData as any, spotifySchema),
    importedAt: new Date().toISOString(),
    version: 1,
    cleaningSteps: [],
    tags: ['demo']
  };

  const ds2: ParsedDataset = {
    id: `ds-demo-sales-${Date.now()}`,
    name: 'E-commerce Sales',
    sourceType: 'demo',
    workspaceId: 'ws-1',
    rawHeaders: Object.keys(demoSalesData[0]),
    rows: demoSalesData as any,
    schema: salesSchema,
    profile: generateProfile(demoSalesData as any, salesSchema),
    importedAt: new Date().toISOString(),
    version: 1,
    cleaningSteps: [],
    tags: ['demo']
  };

  return [ds1, ds2];
}
