'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { getAvatarFallback } from '@/src/lib/avatar.utils';
import { useMemo } from 'react';

interface UserAvatarProps {
  src: string;
  username: string;
}

const UserAvatar = ({ src, username }: UserAvatarProps) => {
  const fallback = useMemo(() => {
    return getAvatarFallback(username);
  }, [username]);
  return (
    <Avatar>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
