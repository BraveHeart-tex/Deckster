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
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RoomList />
      </div>
    </div>
  );
};

export default HomePage;
