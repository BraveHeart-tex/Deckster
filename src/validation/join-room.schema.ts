import z from 'zod';

import {
  roomCodeSchema,
  userDisplayNameSchema,
} from '@/src/validation/common.validation';

export const joinRoomSchema = z.object({
  userDisplayName: userDisplayNameSchema,
  roomCode: roomCodeSchema,
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
