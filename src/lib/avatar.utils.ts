export const generateAvatarUrl = (userId: string): string => {
  return `https://robohash.org/${userId}?size=40x40`;
};
