import { customAlphabet } from 'nanoid';

const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const ROOM_CODE_DEFAULT_SIZE = 6;
const ROOM_CODE_REGEX = new RegExp(
  `^[${ROOM_CODE_ALPHABET}]{${ROOM_CODE_DEFAULT_SIZE}}$`
);

export const generateRoomCode = (): string => {
  return customAlphabet(ROOM_CODE_ALPHABET, ROOM_CODE_DEFAULT_SIZE)();
};

export const sanitizeRoomCode = (code: string): string =>
  code.trim().toUpperCase();

export const isValidRoomCode = (code: string): boolean =>
  ROOM_CODE_REGEX.test(sanitizeRoomCode(code));
