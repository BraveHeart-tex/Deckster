import { useMemo } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { generateAvatarUrl, getAvatarFallback } from '@/src/lib/avatar.utils';
import { cn } from '@/src/lib/utils';

interface UserAvatarProps {
  userId: string;
  username: string;
  presence?: 'online' | 'offline';
  className?: string;
}

export const UserAvatar = ({
  userId,
  username,
  presence,
  className,
}: UserAvatarProps) => {
  const avatarUrl = useMemo(() => {
    if (!userId) {
      return '';
    }

    return generateAvatarUrl(userId);
  }, [userId]);

  return (
    <div className='relative inline-block w-max'>
      <Avatar className={cn(className)}>
        <AvatarImage loading='lazy' fetchPriority='low' src={avatarUrl} />
        <AvatarFallback>{getAvatarFallback(username)}</AvatarFallback>
      </Avatar>
      {presence ? (
        <span
          className={cn(
            'absolute right-0 bottom-0 block h-2 w-2 rounded-full ring-2 ring-white',
            presence === 'online' && 'bg-green-500',
            presence === 'offline' && 'bg-gray-500'
          )}
          title={presence === 'online' ? 'Online' : 'Offline'}
        />
      ) : null}
    </div>
  );
};
