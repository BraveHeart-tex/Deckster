export const MAX_ROOM_NAME_LENGTH = 255;
export const MIN_ROOM_NAME_LENGTH = 2;
export const ROOM_NAME_INPUT_ID = 'roomName';
export const ROOM_ID_INPUT_ID = 'roomId';
export const ROOM_CODE_LENGTH = 10;
// TODO: Update regex to properly match the room code format
export const ROOM_CODE_REGEX = /^[A-Z2-9]{10}$/;

export const MOCK_ROOM_CODE = '3PZ7K8QB';
export const MOCK_ROOM_URL = `https://example.com/room/${MOCK_ROOM_CODE}`;
