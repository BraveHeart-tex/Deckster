import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { isValidRoomCode } from '@/shared/generateRoomCode';
import RoomPageClient from '@/src/components/room/RoomPageClient';
import { ROUTES } from '@/src/lib/routes';
import { RoomPageParameters } from '@/src/types/room';

const RoomPage = async ({
  params,
}: {
  params: Promise<RoomPageParameters>;
}) => {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect(ROUTES.AUTH);
  }

  if (!isValidRoomCode((await params).code)) {
    redirect(ROUTES.HOME);
  }

  return <RoomPageClient roomCode={(await params).code} />;
};

export default RoomPage;
