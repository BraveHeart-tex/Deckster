import z from 'zod';

import { isValidRoomCode, sanitizeRoomCode } from '@/shared/generateRoomCode';

const USER_DISPLAY_NAME_MIN_LENGTH = 2;
const USER_DISPLAY_NAME_MAX_LENGTH = 50;

export const userDisplayNameSchema = z
  .string()
  .transform((value) => value.trim())
  .refine(
    (value) =>
      value.length > 0 ||
      (value.length >= USER_DISPLAY_NAME_MIN_LENGTH &&
        value.length <= USER_DISPLAY_NAME_MAX_LENGTH),
    {
      message: `Your display name must be between ${USER_DISPLAY_NAME_MIN_LENGTH} and ${USER_DISPLAY_NAME_MAX_LENGTH} characters`,
    }
  );

export const roomCodeSchema = z
  .string()
  .min(1, { message: 'Room code is required.' })
  .transform(sanitizeRoomCode)
  .refine(isValidRoomCode, {
    message:
      'Invalid room code. Please enter the 6-character code exactly as provided',
  });
