'use client';
import { useQuery } from 'convex/react';
import { CogIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';
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
  const roomDetails = useQuery(api.rooms.getRoomWithDetailsByCode, {
    roomCode: parameters.code,
  });
  const [isOpen, setIsOpen] = useState(false);

  if (!roomDetails?.roomSettings) {
    return null;
  }

  const roomSettings = roomDetails.roomSettings;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
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
  );
};

export default SettingsDialog;
