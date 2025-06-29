'use client';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
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
import { ROOM_ID_INPUT_ID } from '@/src/constants/room.constants';
import { ROUTES } from '@/src/constants/routes';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const JoinRoomDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const inputReference = useRef<HTMLInputElement | null>(null);
  const joinRoom = useMutation(api.room.joinRoom);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roomId = formData.get(ROOM_ID_INPUT_ID) as string;
    const trimmedId = roomId.trim();

    if (!trimmedId) {
      inputReference.current?.focus();
      return;
    }

    setIsJoining(true);

    try {
      const joinedRoomId = await joinRoom({ roomId: trimmedId as Id<'rooms'> });
      showSuccessToast('Joined room successfully!');
      router.refresh();
      router.push(ROUTES.ROOM(joinedRoomId));
    } catch (error) {
      console.error('Failed to join room:', error);
      showErrorToast(
        'Unexpected error occurred while joining the room. Please try again later.'
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Join Room</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Room</DialogTitle>
          <DialogDescription>
            Enter the Room ID to join the room
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField>
            <Label htmlFor={ROOM_ID_INPUT_ID}>Room ID</Label>
            <Input
              id={ROOM_ID_INPUT_ID}
              name={ROOM_ID_INPUT_ID}
              ref={inputReference}
              type="text"
              required
              autoFocus
            />
          </FormField>
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isJoining}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isJoining}>
              {isJoining ? 'Joining' : 'Join'} Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomDialog;
