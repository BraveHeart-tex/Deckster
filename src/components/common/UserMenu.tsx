'use client';
import UserAvatar from '@/src/components/common/UserAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { generateAvatarUrl } from '@/src/lib/avatar.utils';
import { useRoomStore } from '@/src/store/room';
import { useAuthActions } from '@convex-dev/auth/react';
import { LogOutIcon } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

const UserMenu = () => {
  const { signOut } = useAuthActions();
  const user = useRoomStore(
    useShallow((state) => state.users[state.currentUserId])
  );

  const handleLogout = () => {
    void signOut();
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
