'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { ROUTES } from '@/src/lib/routes';
import {
  type SetRoomPasswordInput,
  setRoomPasswordSchema,
} from '@/src/validation/set-room-password.schema';

type RoomPasswordInput = Pick<SetRoomPasswordInput, 'roomPassword'>;

interface RoomPasswordFormProps {
  onFormSubmit: (roomPassword: string) => Promise<void>;
}

export const RoomPasswordForm = ({ onFormSubmit }: RoomPasswordFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const form = useForm<RoomPasswordInput>({
    defaultValues: {
      roomPassword: '',
    },
    resolver: zodResolver(
      setRoomPasswordSchema._def.schema.pick({
        roomPassword: true,
      })
    ),
  });

  const onSubmit = async (values: RoomPasswordInput) => {
    if (isPending) return;
    setIsPending(true);
    await onFormSubmit(values.roomPassword);
    setIsPending(false);
  };

  const handleCancel = () => {
    form.reset();
    router.push(ROUTES.HOME);
  };

  return (
    <Card className='w-full max-w-lg'>
      <CardHeader>
        <CardTitle>Enter Room Password</CardTitle>
        <CardDescription>
          In order to join this room, you need to enter the room password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='roomPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' autoComplete='off' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-end gap-2'>
              <Button
                variant='outline'
                disabled={isPending}
                aria-label='Cancel'
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                isLoading={isPending}
                className='w-37.5'
                aria-label='Join Room'
              >
                {isPending ? 'Joining' : 'Join'} Room
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
