'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { PencilIcon, RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { useGuestSession } from '@/src/components/GuestSessionProvider';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import {
  type ChangeDisplayNameInput,
  changeDisplayNameSchema,
} from '@/src/validation/change-display-name.schema';

export const UserMenu = () => {
  const { user, resetSession, setDisplayName } = useGuestSession();
  const roomDetails = useRoomDetails();
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const changeDisplayName = useMutation(api.participants.changeDisplayName);
  const currentParticipant = roomDetails?.participants.find(
    (participant) => participant.isCurrentUser
  );
  const form = useForm<ChangeDisplayNameInput>({
    defaultValues: {
      userDisplayName: user?.name || '',
    },
    resolver: zodResolver(changeDisplayNameSchema),
  });

  if (!user) {
    return null;
  }

  const handleDialogChange = (open: boolean) => {
    setIsEditOpen(open);

    if (!open) {
      form.reset({
        userDisplayName: user.name,
      });
    }
  };

  const handleDisplayNameSave = async (values: ChangeDisplayNameInput) => {
    setIsSaving(true);

    try {
      if (currentParticipant) {
        await changeDisplayName({
          displayName: values.userDisplayName,
          participantId: currentParticipant._id,
          sessionToken: user.id,
        });
      }

      setDisplayName(values.userDisplayName);
      showSuccessToast('Display name updated successfully!');
      setIsEditOpen(false);
      router.refresh();
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (domainError) => {
          showErrorToast(domainError.data.message);
        },
        [DOMAIN_ERROR_CODES.AUTH.FORBIDDEN]: (domainError) => {
          showErrorToast(domainError.data.message);
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='rounded-md border px-3 py-2 text-sm font-medium'>
          {user.name}
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDialogChange(true)}>
            <PencilIcon />
            Change display name
          </DropdownMenuItem>
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

      <Dialog open={isEditOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change display name</DialogTitle>
            <DialogDescription>
              Update the name people see for you across the app and in the
              current room.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              className='space-y-4'
              onSubmit={form.handleSubmit(handleDisplayNameSave)}
            >
              <FormField
                control={form.control}
                name='userDisplayName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete='off' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type='button' variant='outline' disabled={isSaving}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type='submit'
                  disabled={
                    isSaving || form.watch('userDisplayName') === user.name
                  }
                  isLoading={isSaving}
                >
                  {isSaving ? 'Saving' : 'Save'} changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
