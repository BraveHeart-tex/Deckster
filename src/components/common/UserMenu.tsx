'use client';
import { RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useGuestSession } from '@/src/components/GuestSessionProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

export const UserMenu = () => {
  const { user, resetSession } = useGuestSession();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='rounded-md border px-3 py-2 text-sm font-medium'>
        {user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            resetSession();
            router.refresh();
          }}
        >
          <RefreshCwIcon />
          New guest session
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
