'use client';
import ShareRoomDialog from '@/src/components/room/ShareRoomDialog';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useStateBus } from '@/src/hooks/useStateBus';

const ShareRoomDialogWrapper = () => {
  const [isJoining] = useStateBus('isJoiningRoom');

  if (isJoining) {
    return (
      <div className='flex items-center gap-2'>
        <Skeleton className='size-[1.5rem] rounded-md' />
        <Skeleton className='h-[1.5rem] w-20 rounded-md' />
      </div>
    );
  }

  return <ShareRoomDialog />;
};

export default ShareRoomDialogWrapper;
