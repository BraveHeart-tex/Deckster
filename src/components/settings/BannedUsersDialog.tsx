import { LoaderIcon } from 'lucide-react';
import { useCallback } from 'react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { isDomainError } from '@/src/helpers/handleDomainError';
import { useAuthenticatedQueryWithStatus } from '@/src/hooks/useAuthenticatedQueryWithStatus';
import { CommonDialogProps } from '@/src/types/dialog';

interface BannedUsersDialogProps extends CommonDialogProps {
  roomId: Id<'rooms'>;
}

const BannedUsersDialog = ({
  roomId,
  isOpen,
  onOpenChange,
}: BannedUsersDialogProps) => {
  const { data, isPending, isError, error } = useAuthenticatedQueryWithStatus(
    api.rooms.getBannedUsers,
    {
      roomId,
    }
  );

  const renderContent = useCallback(() => {
    if (isPending) {
      return (
        <div className="flex h-[2.5rem] w-full items-center justify-center gap-2">
          <LoaderIcon className="animate-spin" />
          <span className="font-semibold">Loading...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Something went wrong loading banned users
          </h3>
          <p>
            {isDomainError(error)
              ? error.data.message
              : 'An unexpected error occurred'}
          </p>
        </div>
      );
    }

    return data.length === 0 ? (
      <div className="h-[2.5rem] w-full">
        <h3 className="scroll-m-20 text-center text-lg font-semibold tracking-tight">
          No banned users were found
        </h3>
      </div>
    ) : (
      <></>
    );
  }, [data?.length, error, isError, isPending]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[98%] w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>Banned Users</DialogTitle>
          <DialogDescription>
            Manage users banned from this room. Review ban details and revoke
            bans to restore access.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannedUsersDialog;
