'use server';
import { auth } from '@clerk/nextjs/server';

import { CONVEX_JWT_TEMPLATE_NAME } from '@/constants';

export const getConvexJwtToken = async (): Promise<string> => {
  return (
    (await (await auth()).getToken({ template: CONVEX_JWT_TEMPLATE_NAME })) ||
    ''
  );
};
