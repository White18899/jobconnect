/**
 * JobConnect / JobWay Password Service
 * Uses native Web Crypto PBKDF2-SHA256 for secure, zero-dependency password hashing.
 * Fully compatible with Cloudflare Workers edge runtime.
 */

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const salt = Array.from(saltBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hash = Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return { hash, salt };
}

export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  if (!password || !storedHash || !storedSalt) return false;

  try {
    const enc = new TextEncoder();
    const saltMatch = storedSalt.match(/.{1,2}/g);
    if (!saltMatch) return false;

    const saltBytes = new Uint8Array(saltMatch.map(byte => parseInt(byte, 16)));

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );

    const computedHash = Array.from(new Uint8Array(derivedBits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison
    if (computedHash.length !== storedHash.length) return false;
    let diff = 0;
    for (let i = 0; i < computedHash.length; i++) {
      diff |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return diff === 0;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}
