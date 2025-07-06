import { z } from 'zod';

import { userDisplayNameSchema } from '@/src/validation/common.validation';

const ROOM_NAME_MIN_LENGTH = 2;
const ROOM_NAME_MAX_LENGTH = 50;

export const createRoomSchema = z.object({
  roomName: z
    .string()
    .min(
      ROOM_NAME_MIN_LENGTH,
      `Room name must be at least ${ROOM_NAME_MIN_LENGTH} characters`
    )
    .max(
      ROOM_NAME_MAX_LENGTH,
      `Room name must be no longer than ${ROOM_NAME_MAX_LENGTH} characters`
    )
    .refine((value) => value.trim().length >= ROOM_NAME_MIN_LENGTH, {
      message: `Room name cannot be only whitespace and must be at least ${ROOM_NAME_MIN_LENGTH} characters`,
    }),
  userDisplayName: userDisplayNameSchema,
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
