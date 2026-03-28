import { Coffee, TreePine, BookOpen, Utensils, Swords, Moon, Zap, BatteryLow, Wind, Sun } from 'lucide-react';

export const vibes = [
  {
    id: 'adventurous',
    label: 'Adventurous',
    description: 'Seek the unknown',
    Icon: Swords,
    color: '#e8534a',
  },
  {
    id: 'bored',
    label: 'Bored',
    description: 'Need a spark',
    Icon: Moon,
    color: '#c084fc',
  },
  {
    id: 'excited',
    label: 'Excited',
    description: 'Ready to go',
    Icon: Zap,
    color: '#f5c842',
  },
  {
    id: 'lazy',
    label: 'Lazy',
    description: 'Low effort mode',
    Icon: BatteryLow,
    color: '#60a5fa',
  },
  {
    id: 'restless',
    label: 'Restless',
    description: 'Gotta move',
    Icon: Wind,
    color: '#4ade80',
  },
  {
    id: 'happy',
    label: 'Happy',
    description: 'Spread the joy',
    Icon: Sun,
    color: '#f97316',
  },
];

export const mockQuest = {
  title: 'The Urban Explorer',
  stops: [
    {
      id: 1,
      place: 'The Grind Coffee Co.',
      challenge: 'Order something you\'ve never tried before and chat with the barista.',
      duration: '30m',
      Icon: Coffee,
      color: '#e8534a',
    },
    {
      id: 2,
      place: 'Piedmont Park',
      challenge: 'Find a bench, close your eyes, and name 5 sounds you hear.',
      duration: '45m',
      Icon: TreePine,
      color: '#4ade80',
    },
    {
      id: 3,
      place: 'A Cappella Books',
      challenge: 'Pick a book at random, read the first page, and decide if you\'d read it.',
      duration: '20m',
      Icon: BookOpen,
      color: '#c084fc',
    },
    {
      id: 4,
      place: 'Ponce City Market',
      challenge: 'Try a food stall you\'ve never visited. No menus allowed — just point.',
      duration: '40m',
      Icon: Utensils,
      color: '#60a5fa',
    },
  ],
};
