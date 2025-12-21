export const DEFAULT_DECK = [
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
  '?',
  '☕️',
];

export const VOTE_OPTION_PRESETS = [
  {
    label: 'Default Fibonacci',
    deck: DEFAULT_DECK,
  },
  {
    label: 'Extended Fibonacci',
    deck: [
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
      '?',
      '☕️',
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
