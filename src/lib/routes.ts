export const ROUTES = {
  HOME: '/',
  ROOM: (roomCode: string) => `/rooms/${roomCode}`,
  SIGN_IN: '/sign-in',
  ROOM_PASSWORD: (roomCode: string) => `/rooms/${roomCode}/password`,
};
