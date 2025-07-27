'use client';
import ShareRoomDialog from '@/src/components/room/ShareRoomDialog';
import { useStateBus } from '@/src/hooks/useStateBus';

const ShareRoomDialogWrapper = () => {
  const [isJoining] = useStateBus('isJoiningRoom');

  if (isJoining) {
    return null;
  }

  return <ShareRoomDialog />;
};

export default ShareRoomDialogWrapper;
