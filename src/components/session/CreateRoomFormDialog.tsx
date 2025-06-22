'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
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
  DISPLAY_NAME_INPUT_ID,
  DISPLAY_NAME_LOCAL_STORAGE_KEY,
  MAX_DISPLAY_NAME_LENGTH,
  MIN_DISPLAY_NAME_LENGTH,
} from '@/constants/room.constants';
import { useRef, useState } from 'react';

const CreateRoomFormDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputReference = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roomName = formData.get(DISPLAY_NAME_INPUT_ID) as string;
    const trimmedName = roomName.trim();
    if (
      trimmedName.length < MIN_DISPLAY_NAME_LENGTH ||
      trimmedName.length > MAX_DISPLAY_NAME_LENGTH
    ) {
      inputReference.current?.focus();
      return;
    }

    try {
      localStorage.setItem(DISPLAY_NAME_LOCAL_STORAGE_KEY, trimmedName);
      showSuccessToast('Room created successfully!');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create room:', error);
      showErrorToast(
        'Unexpected error occurred while creating your room. Please try again later.'
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
            No sign-ups or logins required. Just enter a display name and start
            your session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor={DISPLAY_NAME_INPUT_ID}>Display Name</Label>
            <Input
              id={DISPLAY_NAME_INPUT_ID}
              name={DISPLAY_NAME_INPUT_ID}
              ref={inputReference}
              type="text"
              minLength={MIN_DISPLAY_NAME_LENGTH}
              maxLength={MAX_DISPLAY_NAME_LENGTH}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Room</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomFormDialog;
