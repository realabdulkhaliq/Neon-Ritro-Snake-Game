import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 100;
export const SPEED_INCREMENT = 3;

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synth-Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://picsum.photos/seed/neon1/400/400'
  },
  {
    id: '2',
    title: 'Grid Runner',
    artist: 'Digital Voyager',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://picsum.photos/seed/grid2/400/400'
  },
  {
    id: '3',
    title: 'Slither Wave',
    artist: 'Electro Snake',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://picsum.photos/seed/slither3/400/400'
  }
];
