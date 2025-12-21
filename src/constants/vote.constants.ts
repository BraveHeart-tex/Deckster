import type { VoteOption } from '@/src/types/voteOption';

export const VOTE_OPTIONS: VoteOption[] = [
  { value: '?', label: '?', description: 'I am unsure or need more info' },
  { value: '☕️', label: '☕️', description: 'Taking a break / abstain' },

  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '5', label: '5' },
  { value: '8', label: '8' },
  { value: '13', label: '13' },
  { value: '20', label: '20' },
  { value: '40', label: '40' },
  { value: '100', label: '100' },
];

export const DEFAULT_DECK = [
  '?',
  '☕️',
  '0',
  '1',
  '2',
  '3',
  '5',
  '8',
  '13',
  '20',
  '40',
  '100',
];

export const VOTE_OPTION_PRESETS = [
  {
    label: 'Default Fibonacci',
    deck: DEFAULT_DECK,
  },
  {
    label: 'Extended Fibonacci',
    deck: [
      '?',
      '☕️',
      '0',
      '0.5',
      '1',
      '2',
      '3',
      '5',
      '8',
      '13',
      '20',
      '40',
      '100',
      '∞',
    ],
  },
  {
    label: 'T-Shirt Sizes',
    deck: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    label: 'Binary Options',
    deck: ['👍', '👎', '🤷‍♂️'],
  },
];

export const DECK_MAX_SIZE = 20;
