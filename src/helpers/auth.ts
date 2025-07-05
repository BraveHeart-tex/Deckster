'use server';
import { CONVEX_JWT_TEMPLATE_NAME } from '@/constants';
import { auth } from '@clerk/nextjs/server';

export const getConvexJwtToken = async (): Promise<string> => {
  return (
    (await (await auth()).getToken({ template: CONVEX_JWT_TEMPLATE_NAME })) ||
    ''
  );
};
