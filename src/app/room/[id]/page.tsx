import UserVotesTable from '@/src/components/vote/UserVotesTable';
import VoteCards from '@/src/components/vote/VoteCards';
import VoteControls from '@/src/components/vote/VoteControls';
import { ROUTES } from '@/src/constants/routes';
import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server';
import { redirect } from 'next/navigation';

const RoomPage = async () => {
  // TODO: Check if the user has access to room
  const isAuthed = await isAuthenticatedNextjs();

  if (!isAuthed) {
    redirect(ROUTES.AUTH);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col items-center justify-center space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Estimate the Effort
        </h2>
        <p className="text-muted-foreground max-w-md text-center text-sm">
          Pick a card that reflects how complex or time-consuming you think this
          task is.
        </p>
      </div>
      <VoteCards />
      <VoteControls />
      <UserVotesTable />
    </div>
  );
};

export default RoomPage;
