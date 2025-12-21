'use client';

import { useMutation } from 'convex/react';
import { CircleQuestionMark } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { Label } from '@/src/components/ui/label';
import { showErrorToast } from '@/src/components/ui/sonner';
import { Switch } from '@/src/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { ROUTES } from '@/src/lib/routes';
import type { RoomSettingKey } from '@/src/types/room';

interface SettingsToggleProps {
  label: string;
  settingKey: Exclude<RoomSettingKey, 'deck'>;
  checked: boolean;
  roomSettingId: Id<'roomSettings'>;
  roomCode: string;
  helperText?: string;
}

const SettingsToggle = ({
  settingKey,
  checked,
  label,
  roomSettingId,
  roomCode,
  helperText,
}: SettingsToggleProps) => {
  const router = useRouter();
  const updateRoomSettings = useMutation(
    api.roomSettings.updateRoomSettings
  ).withOptimisticUpdate((localStore, args) => {
    const current = localStore.getQuery(api.rooms.getRoomWithDetailsByCode, {
      roomCode,
    });
    if (current && current.roomSettings) {
      localStore.setQuery(
        api.rooms.getRoomWithDetailsByCode,
        { roomCode },
        {
          ...current,
          roomSettings: {
            ...current.roomSettings,
            [settingKey]: args[settingKey],
          },
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
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.data.message);
          router.push(ROUTES.SIGN_IN);
        },
        [DOMAIN_ERROR_CODES.ROOM.NOT_FOUND]: (error) => {
          showErrorToast(error.data.message);
          router.push(ROUTES.HOME);
        },
      });
    }
  };

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-2'>
        <Label htmlFor={settingKey}>{label}</Label>
        {helperText && helperText?.length > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <CircleQuestionMark size={16} />
            </TooltipTrigger>
            <TooltipContent
              className='max-w-xs text-center px-3 py-2 text-sm shadow-lg prose prose-sm prose-neutral prose-p:leading-relaxed prose-p:my-0'
              side='top'
            >
              <p>{helperText}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
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
