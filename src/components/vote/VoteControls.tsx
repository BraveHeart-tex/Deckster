'use client';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '@/store/room';

const VoteControls = () => {
  const votesRevealed = useRoomStore((state) => state.votesRevealed);
  const deleteVotes = useRoomStore((state) => state.deleteVotes);

  const handleDeleteEstimates = () => {
    deleteVotes();
  };

  const handleRevealVotes = () => {
    useRoomStore.setState((state) => ({
      votesRevealed: !state.votesRevealed,
    }));
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleDeleteEstimates} variant="outline">
        Delete Estimates
      </Button>
      <Button
        onClick={handleRevealVotes}
        variant="secondary"
        className="min-w-[110px]"
      >
        {votesRevealed ? 'Hide' : 'Show'} Votes
      </Button>
    </div>
  );
};

export default VoteControls;
