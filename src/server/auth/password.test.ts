import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password hashing', () => {
  it('stores a salted scrypt hash and verifies only the matching password', async () => {
    const encoded = await hashPassword('Vanguard.Test-Passphrase-123!');
    expect(encoded).not.toContain('Vanguard.Test-Passphrase-123!');
    expect(encoded.split(':')).toHaveLength(3);
    await expect(verifyPassword('Vanguard.Test-Passphrase-123!', encoded)).resolves.toBe(true);
    await expect(verifyPassword('another-password', encoded)).resolves.toBe(false);
  });

  it('rejects malformed stored hashes safely', async () => {
    await expect(verifyPassword('password', 'not-a-hash')).resolves.toBe(false);
  });
});
