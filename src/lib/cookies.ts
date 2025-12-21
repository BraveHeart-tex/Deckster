'use server';

import { cookies } from 'next/headers';
import { VIEW_MODE_COOKIE } from '@/constants';
import type { ViewMode } from '../types/view';

export const setViewModeCookie = async (viewMode: ViewMode) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: VIEW_MODE_COOKIE,
    value: viewMode,
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  });
};

export const getViewModeCookie = async () => {
  const cookieStore = await cookies();

  const viewMode = cookieStore.get(VIEW_MODE_COOKIE)?.value as
    | ViewMode
    | undefined;

  return viewMode || 'table';
};
