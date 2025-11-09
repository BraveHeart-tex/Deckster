'use client';
import { useUser } from '@clerk/nextjs';
import { memo, useMemo } from 'react';

import type { Doc, Id } from '@/convex/_generated/dataModel';
import UserAvatar from '@/src/components/common/UserAvatar';
import ChangeDisplaynameDialog from '@/src/components/room/ChangeDisplaynameDialog';
import { Badge } from '@/src/components/ui/badge';
import { TableCell, TableRow } from '@/src/components/ui/table';
import UserActionsDropdown from '@/src/components/vote/UserActionsDropdown';
import UserVoteCard from '@/src/components/vote/UserVoteCard';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { cn } from '@/src/lib/utils';

interface UserVotesTableRowProps {
  vote: string;
  participantId: Id<'participants'>;
  userName: string;
  participantUserId: string;
  isOwner: boolean;
  isOnline: boolean;
  shouldHighlightConsensus: boolean;
  role: Doc<'participants'>['role'];
}

const UserVotesTableRow = memo(
  ({
    vote,
    userName,
    participantUserId,
    participantId,
    isOwner,
    isOnline,
    shouldHighlightConsensus,
    role,
  }: UserVotesTableRowProps) => {
    const roomDetails = useRoomDetails();
    const { user } = useUser();

    const isSelf = useMemo(() => {
      return user?.id && participantUserId && user.id === participantUserId;
    }, [user?.id, participantUserId]);

    return (
      <TableRow>
        <TableCell
          className={cn('font-medium', isSelf && 'group font-semibold')}
        >
          <div className='flex items-center gap-2'>
            <UserAvatar
              userId={participantUserId}
              username={userName}
              presence={
                roomDetails?.roomSettings?.showUserPresence
                  ? isOnline
                    ? 'online'
                    : 'offline'
                  : undefined
              }
            />
            <div>
              <span className='truncate'>{userName}</span>
              {isSelf && ' (You)'}{' '}
            </div>
            {isOwner && <Badge variant='secondary'>Owner</Badge>}
            {isSelf && (
              <ChangeDisplaynameDialog
                defaultValue={userName}
                participantId={participantId}
              />
            )}
          </div>
        </TableCell>
        <TableCell className='flex items-center justify-center text-center'>
          <UserVoteCard
            vote={vote}
            votesRevealed={roomDetails?.room.votesRevealed}
            shouldHighlightConsensus={shouldHighlightConsensus}
          />
        </TableCell>
        {roomDetails && roomDetails?.room.ownerId === user?.id && !isSelf && (
          <TableCell className='text-center'>
            <UserActionsDropdown
              userName={userName}
              participantId={participantId}
              roomId={roomDetails.room._id}
              userId={participantUserId}
              role={role}
            />
          </TableCell>
        )}
      </TableRow>
    );
  }
);

UserVotesTableRow.displayName = 'UserVotesTableRow';

export default UserVotesTableRow;
