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
import { useRef, useState } from 'react';

const CreateRoomFormDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const inputReference = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = roomName.trim();
    if (trimmedName.length < 2) {
      inputReference.current?.focus();
      return;
    }

    try {
      localStorage.setItem('roomName', trimmedName);
      showSuccessToast(`Room "${trimmedName}" created successfully!`);
      setIsOpen(false);
      setRoomName('');
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
              value={roomName}
              ref={inputReference}
              onChange={(e) => setRoomName(e.target.value)}
              type="text"
              minLength={2}
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
