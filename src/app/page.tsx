import { Metadata } from 'next';

import { APP_NAME } from '@/constants';
import RoomList from '@/src/components/room/RoomList';

export const metadata: Metadata = {
  title: `${APP_NAME} | Home`,
};

const HomePage = async () => {
  return (
    <div className="bg-background h-full">
      <div className="mx-auto h-full w-full max-w-screen-xl">
        <RoomList />
      </div>
    </div>
  );
};

export default HomePage;
