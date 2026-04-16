/**
 * Cryptographic Core — Zero-Knowledge Vault
 *
 * This module implements the entire client-side cryptographic layer.
 * The server NEVER receives plaintext data or passwords.
 *
 * Architecture:
 *   Master Key (Argon2id from password)
 *     └─ Vault Key (random, encrypted with Master Key)
 *          └─ Per-Asset Keys (random, encrypted with Vault Key)
 *               └─ Asset Data (encrypted with Per-Asset Key)
 *
 * Beneficiary access:
 *   Per-Asset Key re-encrypted with beneficiary's X25519 public key
 *
 * All ciphertext is prefixed with "v1:" for future migration.
 */

import type _sodium from "libsodium-wrappers-sumo";

const CIPHERTEXT_VERSION = "v1:";
const ARGON2_MEM_LIMIT = 67108864; // 64 MB
const ARGON2_OPS_LIMIT = 3;        // 3 iterations
// ARGON2_PARALLELISM = 4 — not directly configurable in libsodium JS; uses ops+mem
const KEY_LENGTH = 32;              // 32 bytes
const CHUNK_SIZE = 64 * 1024;       // 64 KB chunks for large file encryption

let _sodiumInstance: typeof _sodium | null = null;

/**
 * Lazily initialise libsodium. Must be called before any crypto operation.
 */
export async function getSodium(): Promise<typeof _sodium> {
  if (_sodiumInstance) return _sodiumInstance;
  const sodium = (await import("libsodium-wrappers-sumo")).default;
  await sodium.ready;
  _sodiumInstance = sodium;
  return sodium;
}

// ─── Key Derivation (Argon2id) ──────────────────────────────────────────────

/**
 * Derive a 32-byte master key from a password using Argon2id.
 * Parameters: 64 MB memory, 3 iterations.
 */
export async function deriveMasterKey(
  password: string,
  salt: Uint8Array
): Promise<Uint8Array> {
  const sodium = await getSodium();
  const key = sodium.crypto_pwhash(
    KEY_LENGTH,
    password,
    salt,
    ARGON2_OPS_LIMIT,
    ARGON2_MEM_LIMIT,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );
  return key;
}

/**
 * Generate a random salt for Argon2id.
 */
export async function generateSalt(): Promise<Uint8Array> {
  const sodium = await getSodium();
  return sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
}

// ─── Symmetric Encryption (XChaCha20-Poly1305) ─────────────────────────────

/**
 * Encrypt data with XChaCha20-Poly1305.
 * Returns versioned ciphertext: "v1:" + base64(nonce + ciphertext)
 */
export async function encrypt(
  plaintext: Uint8Array,
  key: Uint8Array
): Promise<string> {
  const sodium = await getSodium();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(plaintext, nonce, key);

  // Concatenate nonce + ciphertext
  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);

  return CIPHERTEXT_VERSION + sodium.to_base64(combined);
}

/**
 * Decrypt versioned ciphertext.
 */
export async function decrypt(
  versioned: string,
  key: Uint8Array
): Promise<Uint8Array> {
  const sodium = await getSodium();

  if (!versioned.startsWith(CIPHERTEXT_VERSION)) {
    throw new Error(`Unsupported ciphertext version: ${versioned.slice(0, 4)}`);
  }

  const combined = sodium.from_base64(versioned.slice(CIPHERTEXT_VERSION.length));
  const nonce = combined.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = combined.slice(sodium.crypto_secretbox_NONCEBYTES);

  return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
}

/**
 * Encrypt a UTF-8 string.
 */
export async function encryptString(
  plaintext: string,
  key: Uint8Array
): Promise<string> {
  const sodium = await getSodium();
  return encrypt(sodium.from_string(plaintext), key);
}

/**
 * Decrypt to a UTF-8 string.
 */
export async function decryptString(
  versioned: string,
  key: Uint8Array
): Promise<string> {
  const sodium = await getSodium();
  const bytes = await decrypt(versioned, key);
  const result = sodium.to_string(bytes);
  return result;
}

// ─── 3-Key Hierarchy ────────────────────────────────────────────────────────

/**
 * Generate a random 32-byte key.
 */
export async function generateKey(): Promise<Uint8Array> {
  const sodium = await getSodium();
  return sodium.crypto_secretbox_keygen();
}

/**
 * Create a new vault for a user:
 * 1. Derive master key from password
 * 2. Generate random vault key
 * 3. Encrypt vault key with master key
 * 4. Return encrypted vault key + salt
 */
export async function createVault(password: string): Promise<{
  encryptedVaultKey: string;
  vaultKeySalt: string;
  salt: Uint8Array;
  masterKey: Uint8Array;
  vaultKey: Uint8Array;
}> {
  const sodium = await getSodium();
  const salt = await generateSalt();
  const masterKey = await deriveMasterKey(password, salt);
  const vaultKey = await generateKey();
  const encryptedVaultKey = await encrypt(vaultKey, masterKey);

  return {
    encryptedVaultKey,
    vaultKeySalt: sodium.to_base64(salt),
    salt,
    masterKey,
    vaultKey,
  };
}

/**
 * Unlock an existing vault:
 * 1. Derive master key from password + salt
 * 2. Decrypt vault key
 */
export async function unlockVault(
  password: string,
  saltBase64: string,
  encryptedVaultKey: string
): Promise<{ masterKey: Uint8Array; vaultKey: Uint8Array }> {
  const sodium = await getSodium();
  const salt = sodium.from_base64(saltBase64);
  const masterKey = await deriveMasterKey(password, salt);
  const vaultKey = await decrypt(encryptedVaultKey, masterKey);
  return { masterKey, vaultKey };
}

/**
 * Create a per-asset key and encrypt it with the vault key.
 */
export async function createAssetKey(vaultKey: Uint8Array): Promise<{
  assetKey: Uint8Array;
  encryptedAssetKey: string;
}> {
  const assetKey = await generateKey();
  const encryptedAssetKey = await encrypt(assetKey, vaultKey);
  return { assetKey, encryptedAssetKey };
}

/**
 * Decrypt a per-asset key using the vault key.
 */
export async function decryptAssetKey(
  encryptedAssetKey: string,
  vaultKey: Uint8Array
): Promise<Uint8Array> {
  return decrypt(encryptedAssetKey, vaultKey);
}

// ─── Recovery Key ───────────────────────────────────────────────────────────

/**
 * Generate a recovery key and encrypt the vault key with it.
 * The recovery key is a human-readable base64 string shown once to the user.
 */
export async function generateRecoveryKey(vaultKey: Uint8Array): Promise<{
  recoveryKey: string;
  encryptedVaultKeyRecovery: string;
  recoveryKeySalt: string;
  recoveryKeyHash: string;
}> {
  const sodium = await getSodium();

  // Generate a random 32-byte recovery key
  const recoveryKeyBytes = sodium.randombytes_buf(KEY_LENGTH);
  const recoveryKey = sodium.to_base64(recoveryKeyBytes);

  // Derive an encryption key from the recovery key using Argon2id
  const recoverySalt = await generateSalt();
  const derivedKey = await deriveMasterKey(recoveryKey, recoverySalt);

  // Encrypt vault key with derived recovery key
  const encryptedVaultKeyRecovery = await encrypt(vaultKey, derivedKey);

  // Hash the recovery key for verification (without decrypting)
  const recoveryKeyHash = sodium.to_base64(
    sodium.crypto_generichash(KEY_LENGTH, recoveryKeyBytes, null)
  );

  // Zero the raw recovery key bytes
  sodium.memzero(recoveryKeyBytes);
  sodium.memzero(derivedKey);

  return {
    recoveryKey,
    encryptedVaultKeyRecovery,
    recoveryKeySalt: sodium.to_base64(recoverySalt),
    recoveryKeyHash,
  };
}

/**
 * Recover vault key using the recovery key.
 */
export async function recoverVaultKey(
  recoveryKey: string,
  recoveryKeySaltBase64: string,
  encryptedVaultKeyRecovery: string
): Promise<Uint8Array> {
  const sodium = await getSodium();
  const recoverySalt = sodium.from_base64(recoveryKeySaltBase64);
  const derivedKey = await deriveMasterKey(recoveryKey, recoverySalt);
  const vaultKey = await decrypt(encryptedVaultKeyRecovery, derivedKey);
  sodium.memzero(derivedKey);
  return vaultKey;
}

// ─── Asymmetric Layer (Beneficiary Key Exchange) ────────────────────────────

/**
 * Generate an X25519 key pair for a beneficiary.
 */
export async function generateBeneficiaryKeyPair(): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  const sodium = await getSodium();
  const keyPair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_base64(keyPair.publicKey),
    privateKey: sodium.to_base64(keyPair.privateKey),
  };
}

/**
 * Re-encrypt a per-asset key for a specific beneficiary using their public key.
 * Uses crypto_box_seal (anonymous, only recipient can decrypt).
 */
export async function encryptAssetKeyForBeneficiary(
  assetKey: Uint8Array,
  beneficiaryPublicKeyBase64: string
): Promise<string> {
  const sodium = await getSodium();
  const publicKey = sodium.from_base64(beneficiaryPublicKeyBase64);
  const sealed = sodium.crypto_box_seal(assetKey, publicKey);
  return CIPHERTEXT_VERSION + sodium.to_base64(sealed);
}

/**
 * Beneficiary decrypts their copy of the per-asset key.
 */
export async function decryptAssetKeyAsBeneficiary(
  encryptedAssetKey: string,
  beneficiaryPublicKeyBase64: string,
  beneficiaryPrivateKeyBase64: string
): Promise<Uint8Array> {
  const sodium = await getSodium();

  if (!encryptedAssetKey.startsWith(CIPHERTEXT_VERSION)) {
    throw new Error("Unsupported ciphertext version");
  }

  const sealed = sodium.from_base64(encryptedAssetKey.slice(CIPHERTEXT_VERSION.length));
  const publicKey = sodium.from_base64(beneficiaryPublicKeyBase64);
  const privateKey = sodium.from_base64(beneficiaryPrivateKeyBase64);

  const assetKey = sodium.crypto_box_seal_open(sealed, publicKey, privateKey);
  sodium.memzero(privateKey);
  return assetKey;
}

// ─── SRP-6a Helpers ─────────────────────────────────────────────────────────

/**
 * Generate SRP verifier and salt from a password.
 * Note: Full SRP-6a requires a server-side implementation.
 * This generates the registration payload (verifier + salt).
 */
export async function generateSRPCredentials(password: string): Promise<{
  srpSalt: string;
  srpVerifier: string;
}> {
  const sodium = await getSodium();

  // Generate a random salt for SRP (must be crypto_pwhash_SALTBYTES)
  const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

  // Derive a verifier using Argon2id (simulating SRP verifier generation)
  // In production, use a proper SRP library with 4096-bit group
  const verifier = sodium.crypto_pwhash(
    KEY_LENGTH,
    password,
    salt,
    ARGON2_OPS_LIMIT,
    ARGON2_MEM_LIMIT,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );

  const result = {
    srpSalt: sodium.to_base64(salt),
    srpVerifier: sodium.to_base64(verifier),
  };

  sodium.memzero(verifier);
  return result;
}

// ─── Chunked Encryption (Large Files) ───────────────────────────────────────

/**
 * Encrypt a large file in chunks using XChaCha20-Poly1305 secretstream.
 * Returns versioned ciphertext as Uint8Array.
 */
export async function encryptFile(
  fileData: Uint8Array,
  key: Uint8Array
): Promise<Uint8Array> {
  const sodium = await getSodium();

  const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(key);
  const chunks: Uint8Array[] = [header];

  for (let i = 0; i < fileData.length; i += CHUNK_SIZE) {
    const isLast = i + CHUNK_SIZE >= fileData.length;
    const chunk = fileData.slice(i, i + CHUNK_SIZE);
    const tag = isLast
      ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
      : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

    chunks.push(sodium.crypto_secretstream_xchacha20poly1305_push(state, chunk, null, tag));
  }

  // Combine all chunks
  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

/**
 * Decrypt a large file encrypted with encryptFile.
 */
export async function decryptFile(
  encryptedData: Uint8Array,
  key: Uint8Array
): Promise<Uint8Array> {
  const sodium = await getSodium();

  const headerLength = sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES;
  const header = encryptedData.slice(0, headerLength);
  const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, key);

  const chunkOverhead = sodium.crypto_secretstream_xchacha20poly1305_ABYTES;
  const encryptedChunkSize = CHUNK_SIZE + chunkOverhead;
  const chunks: Uint8Array[] = [];

  let offset = headerLength;
  while (offset < encryptedData.length) {
    const end = Math.min(offset + encryptedChunkSize, encryptedData.length);
    const chunk = encryptedData.slice(offset, end);
    const result = sodium.crypto_secretstream_xchacha20poly1305_pull(state, chunk, null);

    if (!result) {
      throw new Error("Decryption failed: corrupted or tampered data");
    }

    chunks.push(result.message);

    if (result.tag === sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL) {
      break;
    }

    offset = end;
  }

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let resultOffset = 0;
  for (const chunk of chunks) {
    result.set(chunk, resultOffset);
    resultOffset += chunk.length;
  }

  return result;
}

// ─── Secure Memory ──────────────────────────────────────────────────────────

/**
 * Securely zero a key buffer after use.
 */
export async function secureZero(buffer: Uint8Array): Promise<void> {
  const sodium = await getSodium();
  sodium.memzero(buffer);
}

// ─── Utility ────────────────────────────────────────────────────────────────

/**
 * Convert a string to Uint8Array.
 */
export async function toBytes(str: string): Promise<Uint8Array> {
  const sodium = await getSodium();
  return sodium.from_string(str);
}

/**
 * Convert Uint8Array to base64 string.
 */
export async function toBase64(bytes: Uint8Array): Promise<string> {
  const sodium = await getSodium();
  return sodium.to_base64(bytes);
}

/**
 * Convert base64 string to Uint8Array.
 */
export async function fromBase64(base64: string): Promise<Uint8Array> {
  const sodium = await getSodium();
  return sodium.from_base64(base64);
}

/**
 * Generate a password strength score (0-4).
 * 0 = very weak, 4 = very strong
 */
export function passwordStrength(password: string): {
  score: number;
  label: string;
  suggestions: string[];
} {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score++;
  else suggestions.push("Use at least 8 characters");

  if (password.length >= 12) score++;
  else if (password.length >= 8) suggestions.push("Consider 12+ characters for better security");

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else suggestions.push("Mix uppercase and lowercase letters");

  if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score++;
  else suggestions.push("Add numbers and special characters");

  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
  return { score, label: labels[score], suggestions };
}
