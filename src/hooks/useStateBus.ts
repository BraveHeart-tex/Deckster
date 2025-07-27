'use client';
import { useEffect, useState } from 'react';
import {
  getState,
  setState as setSharedState,
  subscribe,
} from '@/src/lib/stateBus';

export function useStateBus<K extends keyof ReturnType<typeof getState>>(
  key: K
) {
  const [value, setValue] = useState(() => getState()[key]);

  useEffect(() => {
    const unsubscribe = subscribe((newState) => {
      setValue(newState[key]);
    });
    return unsubscribe;
  }, [key]);

  const setValueForKey = (newValue: ReturnType<typeof getState>[K]) => {
    setSharedState({ [key]: newValue } as Partial<ReturnType<typeof getState>>);
  };

  return [value, setValueForKey] as const;
}
