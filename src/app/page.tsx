import RoomList from '@/src/components/room/RoomList';
import { ROUTES } from '@/src/constants/routes';
import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server';
import { redirect } from 'next/navigation';

const HomePage = async () => {
  const isAuthed = await isAuthenticatedNextjs();

  if (!isAuthed) {
    redirect(ROUTES.AUTH);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-center space-y-4">
      <RoomList />
    </div>
  );
};

export default HomePage;
