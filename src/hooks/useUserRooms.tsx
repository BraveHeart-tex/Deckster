import { api } from '@/convex/_generated/api';
import { useAuthenticatedQueryWithStatus } from '@/src/hooks/useAuthenticatedQueryWithStatus';

export const useUserRooms = () => {
  return useAuthenticatedQueryWithStatus(api.rooms.getUserRooms, {});
};
