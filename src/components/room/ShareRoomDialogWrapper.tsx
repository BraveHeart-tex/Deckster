'use client';
import { usePathname } from 'next/navigation';
import { ShareRoomDialog } from '@/src/components/room/ShareRoomDialog';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useStateBus } from '@/src/hooks/useStateBus';
import { ROUTES } from '@/src/lib/routes';

export const ShareRoomDialogWrapper = () => {
  const [isJoining] = useStateBus('isJoiningRoom');
  const pathname = usePathname();

  if (isJoining && pathname.includes(ROUTES.ROOM('')))
    return (
      <div className='flex items-center gap-2'>
        <Skeleton className='size-[1.5rem] rounded-md' />
        <Skeleton className='h-[1.5rem] w-20 rounded-md' />
      </div>
    );

  return <ShareRoomDialog />;
};
