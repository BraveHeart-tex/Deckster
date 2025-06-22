import UserVotesTable from '@/components/voting/UserVotesTable';

export default function Home() {
  return (
    <div>
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center">
        <UserVotesTable />
      </div>
    </div>
  );
}
