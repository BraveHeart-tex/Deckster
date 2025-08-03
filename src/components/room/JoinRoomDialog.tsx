'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/convex/_generated/api';
import {
  DOMAIN_ERROR_CODES,
  type DomainError,
} from '@/shared/domainErrorCodes';
import { ROOM_CODE_DEFAULT_SIZE } from '@/shared/generateRoomCode';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
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
import { showErrorToast } from '@/src/components/ui/sonner';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { ROUTES } from '@/src/lib/routes';
import {
  type JoinRoomInput,
  joinRoomSchema,
} from '@/src/validation/join-room.schema';

const JoinRoomDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const joinRoom = useMutation(api.rooms.joinRoom);
  const form = useForm<JoinRoomInput>({
    defaultValues: {
      roomCode: '',
      userDisplayName: '',
      roomPassword: '',
    },
    resolver: zodResolver(joinRoomSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: JoinRoomInput) => {
    setIsJoining(true);

    try {
      const result = await joinRoom(data);
      router.push(ROUTES.ROOM(result.roomCode));
    } catch (error) {
      const handlePasswordError = (domainError: DomainError) => {
        const message = domainError.data.message;
        showErrorToast(message);
        form.setError('roomPassword', { message });
        form.setFocus('roomPassword');
      };

      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (domainError) => {
          showErrorToast(domainError.data.message);
          router.push(ROUTES.SIGN_IN);
        },
        [DOMAIN_ERROR_CODES.ROOM.BANNED]: (domainError) => {
          showErrorToast(domainError.data.message);
          router.push(ROUTES.HOME);
        },
        [DOMAIN_ERROR_CODES.ROOM.PASSWORD_REQUIRED]: handlePasswordError,
        [DOMAIN_ERROR_CODES.ROOM.INVALID_PASSWORD]: handlePasswordError,
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }

    setIsOpen(isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='secondary' aria-label='Join Room'>
          Join Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Room</DialogTitle>
          <DialogDescription>
            Enter your room code to get started. Add your name if you’d like
            others to see it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='roomCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`${ROOM_CODE_DEFAULT_SIZE} character code`}
                      maxLength={ROOM_CODE_DEFAULT_SIZE}
                      {...field}
                    />
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
                    <Input {...field} autoComplete='off' />
                  </FormControl>
                  <FormDescription>
                    Optional: Change your name in the room
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={isJoining}
                isLoading={isJoining}
                aria-label='Join Room'
              >
                {isJoining ? 'Joining' : 'Join Room'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomDialog;
