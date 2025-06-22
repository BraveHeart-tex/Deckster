'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showErrorToast } from '@/components/ui/sonner';
import { ROOM_CODE_LENGTH } from '@/constants/room.constants';
import { isValidRoomCode } from '@/lib/roomCode.utils';
import { useMemo, useRef, useState } from 'react';

const JoinRoomInput = () => {
  const [roomCode, setRoomCode] = useState('');
  const inputReference = useRef<HTMLInputElement | null>(null);

  const handleRoomCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRoomCode(event.target.value.toUpperCase());
  };

  const handleJoinRoom = (): void => {
    if (roomCode.length !== ROOM_CODE_LENGTH) {
      showErrorToast(
        `Room code must be exactly ${ROOM_CODE_LENGTH} characters long.`
      );
      inputReference?.current?.focus();
      return;
    }
  };

  const isInvalidRoomCode: boolean = useMemo(() => {
    return roomCode.length === ROOM_CODE_LENGTH && !isValidRoomCode(roomCode);
  }, [roomCode]);

  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor="roomCode">Room Code</Label>
        <Input
          type="text"
          id="roomCode"
          name="roomCode"
          value={roomCode}
          ref={inputReference}
          onChange={handleRoomCodeChange}
          minLength={ROOM_CODE_LENGTH}
          max={ROOM_CODE_LENGTH}
        />
        {isInvalidRoomCode && (
          <p className="text-destructive text-sm">Invalid room code format</p>
        )}
      </div>
      <Button
        disabled={roomCode.length < ROOM_CODE_LENGTH}
        onClick={handleJoinRoom}
      >
        Join Room
      </Button>
    </div>
  );
};

export default JoinRoomInput;
