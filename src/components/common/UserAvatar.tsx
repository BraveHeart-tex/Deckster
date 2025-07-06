import { useMemo } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { generateAvatarUrl, getAvatarFallback } from '@/src/lib/avatar.utils';

interface UserAvatarProps {
  userId: string;
  username: string;
}

const UserAvatar = ({ userId, username }: UserAvatarProps) => {
  const avatarUrl = useMemo(() => {
    if (!userId) {
      return '';
    }

    return generateAvatarUrl(userId);
  }, [userId]);

  return (
    <Avatar>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>{getAvatarFallback(username)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
