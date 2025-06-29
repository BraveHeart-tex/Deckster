'use client';
import SettingsDialog from '@/src/components/settings/SettingsDialog';
import { Button } from '@/src/components/ui/button';
import { useRoomStore } from '@/src/store/room';

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
      <Button onClick={handleRevealVotes} className="min-w-[110px]">
        {votesRevealed ? 'Hide' : 'Show'} Votes
      </Button>
      <SettingsDialog />
    </div>
  );
};

export default VoteControls;
