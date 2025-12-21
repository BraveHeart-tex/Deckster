// biome-ignore lint/style/useNodejsImportProtocol: the node: protocol is not supported in our setup
import { createHash } from 'crypto';

export const generateAvatarUrl = (userId: string): string => {
  const hash = createHash('sha256').update(userId).digest('hex');
  return `https://robohash.org/${hash}?size=40x40&set=set2&bgset=bg1`;
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
