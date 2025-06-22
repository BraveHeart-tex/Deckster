import { ROOM_CODE_REGEX } from '@/constants/room.constants';

export const normalizeRoomCode = (input: string): string =>
  input.replace(/\s+/g, '').toUpperCase();

export const isValidRoomCode = (input: string): boolean =>
  ROOM_CODE_REGEX.test(normalizeRoomCode(input));
