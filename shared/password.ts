const encoder = new TextEncoder();

const CONFIG = {
  SALT_LENGTH: 16, // 16 bytes = 128 bits
  ITERATIONS: 100_000, // Adjustable: tradeoff between perf and security
  KEY_LENGTH: 32, // 32 bytes = 256-bit derived key
  HASH: 'SHA-256' as const,
};

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)));
}

/**
 * Hashes a password using PBKDF2 with a random salt.
 * Returns a string formatted as: {saltHex}${hashHex}
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(CONFIG.SALT_LENGTH));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: CONFIG.ITERATIONS,
      hash: CONFIG.HASH,
    },
    keyMaterial,
    CONFIG.KEY_LENGTH * 8
  );

  const hashHex = bytesToHex(new Uint8Array(derivedBits));
  const saltHex = bytesToHex(salt);

  return `${saltHex}$${hashHex}`;
}

/**
 * Verifies a password against a stored hash.
 * Stored format must be: {saltHex}${hashHex}
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split('$');
  if (!saltHex || !hashHex) return false;

  const salt = hexToBytes(saltHex);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: CONFIG.ITERATIONS,
      hash: CONFIG.HASH,
    },
    keyMaterial,
    CONFIG.KEY_LENGTH * 8
  );

  const derivedHex = bytesToHex(new Uint8Array(derivedBits));

  return timingSafeEqual(derivedHex, hashHex);
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
