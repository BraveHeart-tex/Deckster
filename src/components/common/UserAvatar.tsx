import { CheckIcon, CrownIcon, ShieldUserIcon } from 'lucide-react';
import { useMemo } from 'react';

import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { getAvatarColorClass, getAvatarFallback } from '@/src/lib/avatar.utils';
import { cn } from '@/src/lib/utils';

interface UserAvatarProps {
  userId: string;
  username: string;
  className?: string;
  hasVoted?: boolean;
  role?: 'owner' | 'moderator' | 'participant';
}

export const UserAvatar = ({
  userId,
  username,
  className,
  hasVoted,
  role = 'participant',
}: UserAvatarProps) => {
  const avatarColorClass = useMemo(() => getAvatarColorClass(userId), [userId]);

  return (
    <div className='relative inline-block w-max'>
      <Avatar className={cn(className)}>
        <AvatarFallback
          className={cn('select-none font-semibold', avatarColorClass)}
        >
          {getAvatarFallback(username)}
        </AvatarFallback>
      </Avatar>
      {role !== 'participant' ? (
        <span
          className='bg-background absolute top-0 right-0 inline-flex size-5 items-center justify-center rounded-full border shadow-sm'
          title={role === 'owner' ? 'Room owner' : 'Moderator'}
        >
          {role === 'owner' ? (
            <CrownIcon className='size-3.5 text-amber-500' />
          ) : (
            <ShieldUserIcon className='size-3.5 text-sky-600' />
          )}
        </span>
      ) : null}
      {hasVoted ? (
        <span
          className='absolute -left-1 -bottom-1 inline-flex size-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-sm'
          title='Voted'
        >
          <CheckIcon className='size-3' />
        </span>
      ) : null}
    </div>
  );
};
