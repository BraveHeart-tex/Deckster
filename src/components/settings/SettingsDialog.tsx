'use client';
import { useUser } from '@clerk/nextjs';
import { CogIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import SettingRow from '@/src/components/settings/SettingRow';
import SettingsToggle from '@/src/components/settings/SettingsToggle';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { MODAL_TYPES, useModalStore } from '@/src/store/modal';
import type { RoomPageParameters, RoomSettingKey } from '@/src/types/room';

const roomSettingToggles: {
  label: string;
  settingKey: Exclude<RoomSettingKey, 'deck'>;
  helperText?: string;
}[] = [
  {
    label: 'Allow others to delete votes',
    settingKey: 'allowOthersToDeleteVotes',
  },
  {
    label: 'Allow others to reveal votes',
    settingKey: 'allowOthersToRevealVotes',
  },
  {
    label: 'Show user presence',
    settingKey: 'showUserPresence',
  },
  {
    label: 'Show average of votes',
    settingKey: 'showAverageOfVotes',
  },
  {
    label: 'Show voting indicator',
    settingKey: 'showVotingIndicator',
  },
  {
    label: 'Highlight consensus votes',
    settingKey: 'highlightConsensusVotes',
    helperText:
      'Consensus means every participant voted the same. This setting makes it easier to spot unanimous agreement.',
  },
];

const SettingsDialog = () => {
  const parameters = useParams<RoomPageParameters>();
  const roomDetails = useRoomDetails();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useModalStore((state) => state.openModal);

  if (!roomDetails?.roomSettings) {
    return null;
  }

  const roomSettings = roomDetails.roomSettings;
  const handleDeleteRoomClick = () => {
    openModal({
      type: MODAL_TYPES.DELETE_ROOM,
    });
  };

  const handleTransferRoomClick = () => {
    openModal({
      type: MODAL_TYPES.TRANSFER_OWNERSHIP,
    });
  };

  const handleChangeDeckClick = () => {
    openModal({
      type: MODAL_TYPES.CHANGE_DECK,
    });
  };

  const handleLockOrUnlockRoomClick = () => {
    openModal({
      type: MODAL_TYPES.LOCK_OR_UNLOCK_ROOM,
    });
  };

  const handleBannedUsers = () => {
    openModal({
      type: MODAL_TYPES.BANNED_USERS,
      payload: { roomId: roomDetails.room._id },
    });
  };

  const handleSetRoomPassword = () => {
    openModal({
      type: MODAL_TYPES.SET_ROOM_PASSWORD,
      payload: { roomId: roomDetails.room._id },
    });
  };

  const handleResetPasswordClick = () => {
    openModal({
      type: MODAL_TYPES.RESET_ROOM_PASSWORD,
      payload: { roomId: roomDetails.room._id },
    });
  };

  const handleOpenClick = () => {
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' onClick={handleOpenClick}>
              <CogIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Room settings</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className='max-h-[98%] w-full overflow-hidden'>
        <DialogHeader>
          <DialogTitle>Room Settings</DialogTitle>
          <DialogDescription>
            Customize how this room works by choosing who can manage votes,
            showing averages or user presence, and setting your own voting
            options.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-1 flex-col gap-6 overflow-y-auto'>
          <div className='space-y-2'>
            <h3 className='scroll-m-20 text-lg font-semibold tracking-tight'>
              Room Configuration
            </h3>
            <div className='flex flex-col gap-4 overflow-hidden rounded-md border p-3'>
              {roomSettingToggles.map((setting) => (
                <SettingsToggle
                  key={setting.settingKey}
                  roomSettingId={roomSettings._id}
                  roomCode={parameters.code}
                  checked={!!roomSettings[setting.settingKey]}
                  label={setting.label}
                  settingKey={setting.settingKey}
                  helperText={setting.helperText}
                />
              ))}
            </div>
          </div>
          <div className='space-y-2'>
            <h3 className='scroll-m-20 text-lg font-semibold tracking-tight'>
              Session Controls
            </h3>
            <div className='overflow-hidden rounded-md border'>
              <SettingRow
                title='Change Deck'
                description='Change the deck of cards for this room.'
                buttonText='Change Deck'
                onClick={handleChangeDeckClick}
              />
              <SettingRow
                title={`${roomDetails.room.locked ? 'Unlock' : 'Lock'} Room`}
                description={
                  roomDetails.room.locked
                    ? 'Unlock the room and allow others to join.'
                    : 'Lock the room and prevent others from joining.'
                }
                buttonText={`${roomDetails.room.locked ? 'Unlock' : 'Lock'} Room`}
                onClick={handleLockOrUnlockRoomClick}
              />
              <SettingRow
                title='Set Room Password'
                description={
                  'Set a password to make this room private. Participants must enter it to join'
                }
                buttonText='Set Room Password'
                onClick={handleSetRoomPassword}
              />
              <SettingRow
                title='Banned Users'
                description={
                  'Review ban details and revoke bans to restore access.'
                }
                isLast
                buttonText='Manage Banned Users'
                onClick={handleBannedUsers}
              />
            </div>
          </div>
          {roomDetails.room.ownerId === user?.id && (
            <div className='space-y-2'>
              <h3 className='text-destructive scroll-m-20 text-lg font-semibold tracking-tight'>
                Danger Zone
              </h3>
              <div className='border-destructive/50 overflow-hidden rounded-md border'>
                {roomDetails.room.hasPassword && (
                  <SettingRow
                    title='Reset Password'
                    description='Reset the password for this room.'
                    buttonText='Reset Password'
                    buttonVariant='destructiveOutline'
                    onClick={handleResetPasswordClick}
                  />
                )}
                {roomDetails.participants.length > 1 && (
                  <SettingRow
                    title='Transfer Ownership'
                    description=' Transfer ownership of this room to another user.'
                    isLast
                    buttonVariant='destructiveOutline'
                    buttonText='Transfer Ownership'
                    onClick={handleTransferRoomClick}
                  />
                )}
                <SettingRow
                  title='Delete Room'
                  description='Once you delete a room, there is no going back. Please be certain.'
                  buttonText='Delete Room'
                  buttonVariant='destructive'
                  onClick={handleDeleteRoomClick}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setIsOpen(false)}
            className='w-full'
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
