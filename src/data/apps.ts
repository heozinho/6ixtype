export type AppStatus = 'live' | 'building' | 'prototype';
export type AppType = 'platform' | 'analytics' | 'music' | 'portfolio' | 'ai';

export interface AppAction {
  label: string;
  href: string;
  external?: boolean;
}

export interface EcosystemApp {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  status: AppStatus;
  type: AppType;
  tags: string[];
  features: string[];
  accent: string;
  accentHex: string;
  primaryAction: AppAction;
  secondaryAction?: AppAction;
}

export const ecosystemApps: EcosystemApp[] = [
  {
    id: '6ixtype',
    name: '6ixtype',
    slug: '6ixtype',
    tagline: 'Parent brand & portfolio launchpad',
    description:
      'The parent software identity and launchpad for deployed apps, experiments and long-term products. This is where all 6ixtype work lives.',
    status: 'live',
    type: 'portfolio',
    tags: ['Platform', 'Live'],
    features: [
      'Portfolio & project hub',
      'Ecosystem launchpad',
      'Software identity',
      'Developer profile',
    ],
    accent: 'violet',
    accentHex: '#8b5cf6',
    primaryAction: { label: 'Open Site', href: '/', external: false },
  },
  {
    id: '6stats',
    name: '6Stats',
    slug: '6stats',
    tagline: 'Spotify analytics & music insights',
    description:
      'Spotify listening analytics, top tracks, top artists, listening history, dashboards and music-data insights. The first deployed product in the ecosystem.',
    status: 'live',
    type: 'analytics',
    tags: ['Music', 'Live'],
    features: [
      'Listening history & trends',
      'Top tracks & artists',
      'Music taste analytics',
      'Data dashboards',
    ],
    accent: 'green',
    accentHex: '#1db954',
    primaryAction: {
      label: 'Open App',
      href: 'https://6stats.pages.dev',
      external: true,
    },
    secondaryAction: { label: 'View Case Study', href: '/projects' },
  },
  {
    id: '6data',
    name: '6Data',
    slug: '6data',
    tagline: 'Your data, understood.',
    description:
      'Import files, databases and app data. Profile, clean, query, visualise, research, learn from and render datasets from one workspace. The flagship data platform.',
    status: 'building',
    type: 'platform',
    tags: ['Data', 'Building'],
    features: [
      'CSV & JSON import',
      'Dataset profiling & quality scores',
      'Cleaning studio with lineage',
      'SQL query lab',
      'Chart & dashboard builder',
      '3D data exploration',
      'Render studio',
      'Research & learning workspace',
    ],
    accent: 'cyan',
    accentHex: '#06b6d4',
    primaryAction: { label: 'View Product', href: '/6data' },
    secondaryAction: { label: 'View Roadmap', href: '/6data#roadmap' },
  },
  {
    id: '6play',
    name: '6Play',
    slug: '6play',
    tagline: 'Music & audio software direction',
    description:
      'The music and audio software direction under 6ixtype. Focused on playback, creative tools and audio-related experiments. Desktop music player, library tools, and audio visualisation.',
    status: 'prototype',
    type: 'music',
    tags: ['Music', 'Prototype'],
    features: [
      'Desktop music player concept',
      'Audio library manager',
      'Playlist tools',
      'Music visualiser',
    ],
    accent: 'amber',
    accentHex: '#f59e0b',
    primaryAction: { label: 'View Concept', href: '/projects' },
    secondaryAction: { label: 'Coming Soon', href: '/projects' },
  },
  {
    id: 'promptlab',
    name: 'PromptLab',
    slug: 'promptlab',
    tagline: 'Experimental design-lab for LLM prompts',
    description:
      'A minimal, cold, and precise creative workstation for testing LLM prompts, model configurations, and generative outputs. 100% client-side with keyless execution and integrated diffusion.',
    status: 'live',
    type: 'ai',
    tags: ['AI', 'Live', 'Workstation'],
    features: [
      'Mechanical UI with dynamic blocks',
      'Keyless execution via community pool',
      'Integrated diffusion engine',
      'Compare mode & persistent archive',
    ],
    accent: 'slate',
    accentHex: '#64748b',
    primaryAction: {
      label: 'Open Lab',
      href: 'https://prompt-playground.pages.dev',
      external: true,
    },
  },
];
