'use client';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';
import { Button } from '@/src/components/ui/button';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { ROUTES } from '@/src/lib/routes';
import type { CommonDialogProps } from '@/src/types/dialog';

interface ModifyRoleDialogProps extends CommonDialogProps {
  participantId: Id<'participants'>;
  userName: string;
  currentRole: Doc<'participants'>['role'];
}

export const ModifyRoleDialog = ({
  isOpen,
  onOpenChange,
  participantId,
  currentRole,
  userName,
}: ModifyRoleDialogProps) => {
  const [isModifyingRole, setIsModifyingRole] = useState(false);
  const isPromotion = currentRole === 'participant';
  const modifyParticipantRole = useMutation(
    api.participants.modifyParticipantRole
  );
  const router = useRouter();

  const handleModifyRoleSubmit = async () => {
    setIsModifyingRole(true);

    try {
      await modifyParticipantRole({
        participantId,
        role: isPromotion ? 'moderator' : 'participant',
      });
      showSuccessToast(
        isPromotion
          ? `Successfully promoted ${userName} to moderator`
          : `Successfully demoted ${userName} to participant`
      );
      onOpenChange(false);
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.data.message);
          router.push(ROUTES.SIGN_IN);
        },
        [DOMAIN_ERROR_CODES.AUTH.FORBIDDEN]: (error) => {
          showErrorToast(error.data.message);
          onOpenChange(false);
        },
      });
    } finally {
      setIsModifyingRole(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isPromotion
              ? `Promote ${userName} to moderator?`
              : `Demote ${userName} to participant?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isPromotion
              ? `Are you sure you want to promote ${userName} to moderator?`
              : `Are you sure you want to demote ${userName} to participant?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isModifyingRole}>
            Cancel
          </AlertDialogCancel>
          <Button
            variant={isPromotion ? 'default' : 'destructive'}
            disabled={isModifyingRole}
            isLoading={isModifyingRole}
            onClick={handleModifyRoleSubmit}
          >
            {isModifyingRole
              ? `${isPromotion ? 'Promot' : 'Demot'}ing...`
              : isPromotion
                ? 'Promote'
                : 'Demote'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
