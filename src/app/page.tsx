import { api } from '@/convex/_generated/api';
import RoomList from '@/src/components/room/RoomList';
import { getConvexJwtToken } from '@/src/helpers/auth';
import { preloadQuery } from 'convex/nextjs';

const HomePage = async () => {
  const preloadedRooms = await preloadQuery(
    api.rooms.getUserRooms,
    {},
    { token: await getConvexJwtToken() }
  );

  return (
    <div className="bg-background box-border flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RoomList preloadedRooms={preloadedRooms} />
      </div>
    </div>
  );
};

export default HomePage;
