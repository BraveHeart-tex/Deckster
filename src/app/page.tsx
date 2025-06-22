import UserVotesTable from '@/components/vote/UserVotesTable';
import VoteCards from '@/components/vote/VoteCards';

export default function Home() {
  return (
    <div>
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center">
        <VoteCards />
        <UserVotesTable />
      </div>
    </div>
  );
}
