'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/convex/_generated/api';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { ROUTES } from '@/src/lib/routes';
import {
  type CreateRoomInput,
  createRoomSchema,
} from '@/src/validation/create-room.schema';

type CreateRoomFormDialogProps = {
  trigger?: React.ReactNode;
};

const CreateRoomFormDialog = ({ trigger }: CreateRoomFormDialogProps) => {
  const form = useForm<CreateRoomInput>({
    defaultValues: {
      roomName: '',
      userDisplayName: '',
    },
    resolver: zodResolver(createRoomSchema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const createRoom = useMutation(api.rooms.createRoom);
  const router = useRouter();

  const onSubmit = async (input: CreateRoomInput) => {
    setIsCreating(true);

    try {
      const createRoomResult = await createRoom(input);
      showSuccessToast('Room created successfully!');
      setIsOpen(false);

      router.push(ROUTES.ROOM(createRoomResult.roomCode));
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.data.message);
          router.push(ROUTES.SIGN_IN);
        },
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button aria-label='Create a new room'>Create Room</Button>}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Room</DialogTitle>
          <DialogDescription>Enter a name to get started.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='roomName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='userDisplayName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional: Change your name in the room
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-2'>
              <DialogClose asChild>
                <Button type='button' variant='secondary' disabled={isCreating}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='submit'
                disabled={isCreating}
                isLoading={isCreating}
              >
                {isCreating ? 'Creating' : 'Create'} Room
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomFormDialog;
