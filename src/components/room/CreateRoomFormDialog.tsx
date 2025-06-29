'use client';
import { api } from '@/convex/_generated/api';
import FormField from '@/src/components/common/FormField';
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
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import {
  MAX_ROOM_NAME_LENGTH,
  MIN_ROOM_NAME_LENGTH,
  ROOM_NAME_INPUT_ID,
} from '@/src/constants/room.constants';
import { ROUTES } from '@/src/constants/routes';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const CreateRoomFormDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const inputReference = useRef<HTMLInputElement>(null);
  const createRoom = useMutation(api.room.createRoom);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roomName = formData.get(ROOM_NAME_INPUT_ID) as string;
    const trimmedName = roomName.trim();
    if (
      trimmedName.length < MIN_ROOM_NAME_LENGTH ||
      trimmedName.length > MAX_ROOM_NAME_LENGTH
    ) {
      inputReference.current?.focus();
      return;
    }

    setIsCreating(true);

    try {
      const roomId = await createRoom({ name: trimmedName });
      showSuccessToast('Room created successfully!');
      setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField>
            <Label htmlFor={ROOM_NAME_INPUT_ID}>Room Name</Label>
            <Input
              id={ROOM_NAME_INPUT_ID}
              name={ROOM_NAME_INPUT_ID}
              ref={inputReference}
              type="text"
              minLength={MIN_ROOM_NAME_LENGTH}
              maxLength={MAX_ROOM_NAME_LENGTH}
              required
              autoFocus
            />
          </FormField>
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomFormDialog;
