import { useQueries } from 'convex/react';
import type { FunctionReference } from 'convex/server';
import { makeUseQueryWithStatus } from 'convex-helpers/react';
import { useGuestSession } from '@/src/components/GuestSessionProvider';

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);

export const useAuthenticatedQueryWithStatus = <
  Query extends FunctionReference<'query'>,
>(
  query: Query,
  args: Record<string, unknown> | 'skip'
) => {
  const { user, isReady } = useGuestSession();
  const queryArgs =
    !isReady || !user || args === 'skip'
      ? ('skip' as never)
      : ({
          ...args,
          sessionToken: user.id,
        } as never);

  return useQueryWithStatus(query, queryArgs);
};
