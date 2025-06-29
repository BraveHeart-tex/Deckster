'use client';
import CustomVoteOptionsInput from '@/src/components/settings/CustomVoteOptionsInput';
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
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import { useRoomStore } from '@/src/store/room';
import { RoomSettings } from '@/src/types/room';
import { CogIcon } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

const roomSettingToggles: { label: string; settingKey: keyof RoomSettings }[] =
  [
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
  const [isOpen, setIsOpen] = useState(false);

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
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <CustomVoteOptionsInput />
          <div className="flex flex-col gap-4">
            {roomSettingToggles.map((setting) => (
              <SettingsToggle key={setting.settingKey} setting={setting} />
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

const SettingsToggle = ({
  setting,
}: {
  setting: (typeof roomSettingToggles)[number];
}) => {
  const checked = useRoomStore(
    useShallow((state) => state.settings[setting.settingKey])
  );

  const handleCheckedChange = (checked: boolean) => {
    useRoomStore.setState((state) => ({
      settings: {
        ...state.settings,
        [setting.settingKey]: checked,
      },
    }));
  };

  return (
    <div className="flex w-full items-center justify-between">
      <Label htmlFor={setting.settingKey}>{setting.label}</Label>
      <Switch
        id={setting.settingKey}
        name={setting.settingKey}
        checked={checked}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
};

export default SettingsDialog;
