import { useConvexAuth, useQueries } from 'convex/react';
import { FunctionReference, OptionalRestArgs } from 'convex/server';
import { makeUseQueryWithStatus } from 'convex-helpers/react';

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);

export const useAuthenticatedQueryWithStatus = <
  Query extends FunctionReference<'query'>,
>(
  query: Query,
  args: OptionalRestArgs<Query>[0] | 'skip'
) => {
  const { isAuthenticated } = useConvexAuth();
  console.log('isAuthenticated', isAuthenticated);

  return useQueryWithStatus(query, isAuthenticated ? args : 'skip');
};
