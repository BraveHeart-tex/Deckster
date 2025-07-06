'use client';

import { useMutation } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Label } from '@/src/components/ui/label';
import { showErrorToast } from '@/src/components/ui/sonner';
import { Switch } from '@/src/components/ui/switch';
import { RoomSettingKey } from '@/src/types/room';

interface SettingsToggleProps {
  label: string;
  settingKey: RoomSettingKey;
  checked: boolean;
  roomSettingId: Id<'roomSettings'>;
  roomCode: string;
}

const SettingsToggle = ({
  settingKey,
  checked,
  label,
  roomSettingId,
  roomCode,
}: SettingsToggleProps) => {
  const updateRoomSettings = useMutation(
    api.roomSettings.updateRoomSettings
  ).withOptimisticUpdate((localStore, args) => {
    const current = localStore.getQuery(api.roomSettings.getRoomSettings, {
      roomCode,
    });
    if (current) {
      localStore.setQuery(
        api.roomSettings.getRoomSettings,
        { roomCode },
        {
          ...current,
          ...args,
        }
      );
    }
  });
  const handleCheckedChange = async (isChecked: boolean) => {
    try {
      await updateRoomSettings({
        roomSettingId,
        [settingKey]: isChecked,
      });
    } catch (error) {
      // TODO: Handle mutation errors here
      console.error('Failed to update room settings:', error);
      showErrorToast('Failed to update room settings. Please try again.');
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <Label htmlFor={settingKey}>{label}</Label>
      <Switch
        id={settingKey}
        name={settingKey}
        checked={checked}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
};

export default SettingsToggle;
