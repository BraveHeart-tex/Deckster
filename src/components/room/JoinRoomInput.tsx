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
    <div className="flex flex-col gap-2">
      <Label htmlFor="roomCode">Room Code</Label>
      <div className="flex items-start gap-2">
        <div className="flex flex-col">
          <Input
            type="text"
            id="roomCode"
            name="roomCode"
            value={roomCode}
            ref={inputReference}
            onChange={handleRoomCodeChange}
            minLength={ROOM_CODE_LENGTH}
            maxLength={ROOM_CODE_LENGTH}
          />
          {isInvalidRoomCode && (
            <p className="text-destructive mt-1 text-sm">
              Invalid room code format
            </p>
          )}
        </div>

        <Button
          disabled={roomCode.length < ROOM_CODE_LENGTH}
          onClick={handleJoinRoom}
          className="self-start"
        >
          Join Room
        </Button>
      </div>
    </div>
  );
};

export default JoinRoomInput;
