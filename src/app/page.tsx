import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import RoomList from '@/src/components/room/RoomList';
import { getConvexJwtToken } from '@/src/helpers/auth';

const HomePage = async () => {
  const preloadedRooms = await preloadQuery(
    api.rooms.getUserRooms,
    {},
    { token: await getConvexJwtToken() }
  );

  return (
    <div className="bg-background h-full px-4 md:px-8">
      <div className="mx-auto h-full w-full max-w-screen-xl">
        <RoomList preloadedRooms={preloadedRooms} />
      </div>
    </div>
  );
};

export default HomePage;
