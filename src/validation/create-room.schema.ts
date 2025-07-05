import { z } from 'zod';

export const createRoomSchema = z.object({
  roomName: z
    .string()
    .min(2, 'Room name must be at least 2 characters')
    .refine((value) => value.trim().length >= 2, {
      message:
        'Room name cannot be only whitespace and must be at least 2 characters',
    }),

  userDisplayName: z
    .string()
    .min(2, 'Your display must be at least 2 characters')
    .refine((value) => value.trim().length >= 2, {
      message:
        'Your display name cannot be only whitespace and must be at least 2 characters',
    }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
