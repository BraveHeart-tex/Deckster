import { CONVEX_JWT_TEMPLATE_NAME } from '@/constants';
import { api } from '@/convex/_generated/api';
import RoomList from '@/src/components/room/RoomList';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';

const HomePage = async () => {
  const token =
    (await (await auth()).getToken({ template: CONVEX_JWT_TEMPLATE_NAME })) ||
    '';

  const preloadedRooms = await preloadQuery(
    api.rooms.getUserRooms,
    {},
    { token }
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
