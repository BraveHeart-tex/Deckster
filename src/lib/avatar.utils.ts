const AVATAR_COLOR_CLASSES = [
  'bg-rose-100 text-rose-700',
  'bg-orange-100 text-orange-700',
  'bg-amber-100 text-amber-700',
  'bg-lime-100 text-lime-700',
  'bg-emerald-100 text-emerald-700',
  'bg-teal-100 text-teal-700',
  'bg-cyan-100 text-cyan-700',
  'bg-sky-100 text-sky-700',
  'bg-indigo-100 text-indigo-700',
  'bg-fuchsia-100 text-fuchsia-700',
] as const;

export const getAvatarColorClass = (userId: string): string => {
  if (!userId) {
    return AVATAR_COLOR_CLASSES[0];
  }

  const hash = [...userId].reduce((accumulator, character) => {
    return accumulator + character.charCodeAt(0);
  }, 0);

  return AVATAR_COLOR_CLASSES[hash % AVATAR_COLOR_CLASSES.length];
};

export const getAvatarFallback = (username: string): string => {
  if (!username) {
    return '?';
  }

  const cleaned = username.trim();

  if (!cleaned) {
    return '?';
  }

  const words = cleaned.split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const [first, second] = words;

  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
};
