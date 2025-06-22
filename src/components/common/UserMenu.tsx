'use client';
import UserAvatar from '@/components/common/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { generateAvatarUrl } from '@/lib/avatar.utils';
import { useRoomStore } from '@/store/room';
import { LogOutIcon } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

const UserMenu = () => {
  const user = useRoomStore(
    useShallow((state) => state.users[state.currentUserId])
  );

  const handleLogout = () => {
    useRoomStore.getState().resetState();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar src={generateAvatarUrl(user.id)} username={user.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
