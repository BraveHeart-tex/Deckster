import { VoteOption } from '@/types/voteOption';

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
