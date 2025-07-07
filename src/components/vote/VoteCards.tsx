'use client';
import { useMutation, useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { ERROR_CODES } from '@/shared/errorCodes';
import { showErrorToast } from '@/src/components/ui/sonner';
import VoteCard from '@/src/components/vote/VoteCard';
import { VOTE_OPTIONS } from '@/src/constants/vote.constants';
import { handleApplicationError } from '@/src/helpers/handleApplicationError';
import { ROUTES } from '@/src/lib/routes';
import { RoomPageParameters } from '@/src/types/room';
import { VoteOption } from '@/src/types/voteOption';

const VoteCards = () => {
  const router = useRouter();
  const roomPageParameters = useParams<RoomPageParameters>();
  const castVote = useMutation(api.votes.castVote).withOptimisticUpdate(
    (localStore, args) => {
      const current = localStore.getQuery(api.votes.getUserVote, {
        roomId: args.roomId,
      });
      if (current) {
        localStore.setQuery(
          api.votes.getUserVote,
          { roomId: args.roomId },
          {
            ...current,
            ...args,
          }
        );
      }
    }
  );
  const room = useQuery(api.rooms.getRoomByCode, {
    roomCode: roomPageParameters.code,
  });

  const handleVote = useCallback(
    async (option: VoteOption) => {
      if (!room) {
        return;
      }

      try {
        await castVote({ roomId: room._id, value: option.value });
      } catch (error) {
        handleApplicationError(error, {
          [ERROR_CODES.UNAUTHORIZED]: () => {
            showErrorToast('You are not authorized to perform this action.');
            router.push(ROUTES.AUTH);
          },
          [ERROR_CODES.NOT_FOUND]: () => {
            showErrorToast('Room not found');
            router.push(ROUTES.HOME);
          },
          [ERROR_CODES.FORBIDDEN]: () => {
            showErrorToast('You must be a room participant to vote.');
          },
        });
      }
    },
    [castVote, room, router]
  );

  if (!room) {
    return null;
  }

  return (
    <div className="flex max-w-screen-sm flex-wrap items-center justify-center gap-2">
      <VoteOptions onVoteClick={handleVote} roomId={room._id} />
    </div>
  );
};

interface VoteOptionsProps {
  onVoteClick: (option: VoteOption) => void;
  roomId: Id<'rooms'>;
}

const VoteOptions = ({ onVoteClick, roomId }: VoteOptionsProps) => {
  const currentUserVote = useQuery(api.votes.getUserVote, {
    roomId,
  });

  return VOTE_OPTIONS.map((option) => (
    <VoteCard
      key={option.value}
      option={option}
      isSelected={option.value === currentUserVote?.value}
      onClick={onVoteClick}
    />
  ));
};

export default VoteCards;
