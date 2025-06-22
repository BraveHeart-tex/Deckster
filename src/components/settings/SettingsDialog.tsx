'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRoomStore } from '@/store/room';
import { RoomSettings } from '@/types/room';
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
      label: 'Show timer',
      settingKey: 'showTimer',
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
        <Button variant="ghost" size="icon">
          <CogIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Room Settings</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        {roomSettingToggles.map((setting) => (
          <SettingsToggle key={setting.settingKey} setting={setting} />
        ))}
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
