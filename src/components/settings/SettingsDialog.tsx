'use client';
import { useUser } from '@clerk/nextjs';
import { CogIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import DangerZoneRow from '@/src/components/settings/DangerZoneRow';
import DeleteRoomDialog from '@/src/components/settings/DeleteRoomDialog';
import SettingsToggle from '@/src/components/settings/SettingsToggle';
import TransferOwnershipDialog from '@/src/components/settings/TransferOwnershipDialog';
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
import { RoomPageParameters, RoomSettingKey } from '@/src/types/room';

const roomSettingToggles: {
  label: string;
  settingKey: RoomSettingKey;
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
];

const SettingsDialog = () => {
  const parameters = useParams<RoomPageParameters>();
  const roomDetails = useRoomDetails();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTransferOwnershipDialogOpen, setIsTransferOwnershipDialogOpen] =
    useState(false);

  if (!roomDetails?.roomSettings) {
    return null;
  }

  const roomSettings = roomDetails.roomSettings;
  const handleDeleteRoomClick = () => setIsDeleteDialogOpen(true);
  const handleTransferRoomClick = () => setIsTransferOwnershipDialogOpen(true);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <CogIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Room settings</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Room Settings</DialogTitle>
            <DialogDescription>
              Customize how this room works by choosing who can manage votes,
              showing averages or user presence, and setting your own voting
              options.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            {/* TODO: Add voting options */}
            <div className="flex flex-col gap-4">
              {roomSettingToggles.map((setting) => (
                <SettingsToggle
                  key={setting.settingKey}
                  roomSettingId={roomSettings._id}
                  roomCode={parameters.code}
                  checked={!!roomSettings[setting.settingKey]}
                  label={setting.label}
                  settingKey={setting.settingKey}
                />
              ))}
            </div>
            {roomDetails.room.ownerId === user?.id && (
              <div className="space-y-2">
                <h3 className="text-destructive scroll-m-20 text-lg font-semibold tracking-tight">
                  Danger Zone
                </h3>
                <div className="border-destructive/50 overflow-hidden rounded-md border">
                  <DangerZoneRow
                    title="Delete Room"
                    description="Once you delete a room, there is no going back. Please be certain."
                    buttonText="Delete Room"
                    onClick={handleDeleteRoomClick}
                  />
                  <DangerZoneRow
                    title="Transfer Ownership"
                    description=" Transfer ownership of this room to another user."
                    isLast
                    buttonVariant="destructiveOutline"
                    buttonText="Transfer Ownership"
                    onClick={handleTransferRoomClick}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TransferOwnershipDialog
        isOpen={isTransferOwnershipDialogOpen}
        onOpenChange={setIsTransferOwnershipDialogOpen}
      />
      <DeleteRoomDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
};

export default SettingsDialog;
