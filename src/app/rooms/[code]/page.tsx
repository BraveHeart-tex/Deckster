import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { APP_NAME } from '@/constants';
import { isValidRoomCode } from '@/shared/generateRoomCode';
import { RoomPageClient } from '@/src/components/room/RoomPageClient';
import { getViewModeCookie } from '@/src/lib/cookies';
import { ROUTES } from '@/src/lib/routes';
import type { RoomPageParameters } from '@/src/types/room';

interface RoomPageProps {
  params: Promise<RoomPageParameters>;
}

export async function generateMetadata({
  params,
}: RoomPageProps): Promise<Metadata> {
  const { code } = await params;

  return {
    title: `${APP_NAME} | Room ${code}`,
  };
}

const RoomPage = async ({ params }: RoomPageProps) => {
  const viewMode = await getViewModeCookie();
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect(ROUTES.SIGN_IN);
  }

  if (!isValidRoomCode((await params).code)) {
    redirect(ROUTES.HOME);
  }

  return (
    <RoomPageClient roomCode={(await params).code} initialViewMode={viewMode} />
  );
};

export default RoomPage;
