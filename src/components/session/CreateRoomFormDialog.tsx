'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showErrorToast, showSuccessToast } from '@/components/ui/sonner';
import {
  MAX_ROOM_NAME_LENGTH,
  MIN_ROOM_NAME_LENGTH,
} from '@/constants/room.constants';
import { useRef, useState } from 'react';

const CreateRoomFormDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputReference = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roomName = formData.get('roomName') as string;
    const trimmedName = roomName.trim();
    if (
      trimmedName.length < MIN_ROOM_NAME_LENGTH ||
      trimmedName.length > MAX_ROOM_NAME_LENGTH
    ) {
      inputReference.current?.focus();
      return;
    }

    try {
      localStorage.setItem('roomName', trimmedName);
      showSuccessToast(`Room "${trimmedName}" created successfully!`);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save room name:', error);
      showErrorToast(
        'Unexpected error occurred saving room name. Please try again later.'
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Session</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Room Instantly</DialogTitle>
          <DialogDescription>
            No sign-ups or logins required. Just enter a room name and start
            your session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              name="roomName"
              ref={inputReference}
              type="text"
              minLength={MIN_ROOM_NAME_LENGTH}
              maxLength={MAX_ROOM_NAME_LENGTH}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Session</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomFormDialog;
