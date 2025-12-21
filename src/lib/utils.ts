import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { CONVEX_ID_LENGTH } from '@/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidConvexId = (value: string): boolean => {
  return (
    value !== undefined &&
    value != null &&
    !!value &&
    value.length === CONVEX_ID_LENGTH
  );
};
