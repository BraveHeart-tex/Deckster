'use client';
import { api } from '@/convex/_generated/api';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import { ROUTES } from '@/src/constants/routes';
import {
  CreateRoomInput,
  createRoomSchema,
} from '@/src/validation/create-room.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const CreateRoomFormDialog = () => {
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
      const roomId = await createRoom(input);
      showSuccessToast('Room created successfully!');
      setIsOpen(false);

      router.refresh();
      router.push(ROUTES.ROOM(roomId));
    } catch (error) {
      console.error('Failed to create room:', error);
      showErrorToast(
        'Unexpected error occurred while creating your room. Please try again later.'
      );
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
        <Button>Create Room</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Room Instantly</DialogTitle>
          <DialogDescription>
            Just enter a room name and start your room.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roomName"
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
              name="userDisplayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Display Name (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Change your display name in the room"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isCreating}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isCreating}>
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
