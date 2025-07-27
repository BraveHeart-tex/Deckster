'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
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
import { ROUTES } from '@/src/lib/routes';
import type { CommonDialogProps } from '@/src/types/dialog';
import {
  type SetRoomPasswordInput,
  setRoomPasswordSchema,
} from '@/src/validation/set-room-password.schema';

interface RoomPasswordDialogProps extends CommonDialogProps {
  roomId: Id<'rooms'>;
}

const RoomPasswordDialog = ({
  isOpen,
  onOpenChange,
  roomId,
}: RoomPasswordDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const setRoomPassword = useMutation(api.rooms.setRoomPassword);
  const form = useForm<SetRoomPasswordInput>({
    resolver: zodResolver(setRoomPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      roomPassword: '',
      roomPasswordAgain: '',
    },
  });
  const router = useRouter();

  const onSubmit = async (values: SetRoomPasswordInput) => {
    setIsLoading(true);
    try {
      await setRoomPassword({ roomId, password: values.roomPassword });
      showSuccessToast('Room password set successfully!');
      onOpenChange(false);
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.data.message);
          router.push(ROUTES.SIGN_IN);
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Room Password</DialogTitle>
          <DialogDescription>
            Set a password to make this room private. Participants must enter it
            to join
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='roomPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} autoComplete='off' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='roomPasswordAgain'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} autoComplete='off' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
        <DialogFooter>
          <Button type='button' variant='outline' disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type='button'
            disabled={
              (form.formState.isSubmitted && !form.formState.isValid) ||
              isLoading
            }
            isLoading={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? 'Setting' : 'Set'} Room Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomPasswordDialog;
