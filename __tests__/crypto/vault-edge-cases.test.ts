/**
 * Cryptographic Core — Edge Case & Stress Tests
 *
 * Tests boundary conditions, error handling, tamper detection,
 * empty inputs, large inputs, concurrent operations, and key isolation.
 */

import {
  getSodium,
  deriveMasterKey,
  generateSalt,
  encrypt,
  decrypt,
  encryptString,
  decryptString,
  generateKey,
  createVault,
  unlockVault,
  createAssetKey,
  decryptAssetKey,
  generateRecoveryKey,
  recoverVaultKey,
  generateBeneficiaryKeyPair,
  encryptAssetKeyForBeneficiary,
  decryptAssetKeyAsBeneficiary,
  encryptFile,
  decryptFile,
  secureZero,
  passwordStrength,
  toBytes,
  toBase64,
  fromBase64,
} from "../../src/lib/crypto/vault";

describe("Cryptographic Edge Cases", () => {
  beforeAll(async () => {
    await getSodium();
  });

  // ─── Empty & Boundary Inputs ─────────────────────────────────────────────

  describe("Empty and Boundary Inputs", () => {
    it("should encrypt and decrypt an empty string", async () => {
      const key = await generateKey();
      const encrypted = await encryptString("", key);
      const decrypted = await decryptString(encrypted, key);
      expect(decrypted).toBe("");
    });

    it("should encrypt and decrypt an empty Uint8Array", async () => {
      const key = await generateKey();
      const sodium = await getSodium();
      const empty = new Uint8Array(0);
      const encrypted = await encrypt(empty, key);
      const decrypted = await decrypt(encrypted, key);
      expect(decrypted.length).toBe(0);
    });

    it("should encrypt and decrypt a single byte", async () => {
      const key = await generateKey();
      const sodium = await getSodium();
      const single = new Uint8Array([42]);
      const encrypted = await encrypt(single, key);
      const decrypted = await decrypt(encrypted, key);
      expect(Array.from(decrypted)).toEqual([42]);
    });

    it("should handle very long strings (1MB)", async () => {
      const key = await generateKey();
      const longString = "A".repeat(1024 * 1024);
      const encrypted = await encryptString(longString, key);
      const decrypted = await decryptString(encrypted, key);
      expect(decrypted.length).toBe(1024 * 1024);
      expect(decrypted).toBe(longString);
    });

    it("should handle unicode strings correctly", async () => {
      const key = await generateKey();
      const unicode = "こんにちは世界 🔐🗝️ مرحبا Привет";
      const encrypted = await encryptString(unicode, key);
      const decrypted = await decryptString(encrypted, key);
      expect(decrypted).toBe(unicode);
    });

    it("should handle strings with null bytes", async () => {
      const key = await generateKey();
      const withNulls = "hello\x00world\x00test";
      const encrypted = await encryptString(withNulls, key);
      const decrypted = await decryptString(encrypted, key);
      expect(decrypted).toBe(withNulls);
    });

    it("should handle special characters in passwords", async () => {
      const specialPasswords = [
        "p@$$w0rd!#%^&*()",
        "パスワード123",
        "🔑🔒🔓",
        "a".repeat(256),
        " ",
        "\t\n\r",
      ];
      for (const pw of specialPasswords) {
        const vault = await createVault(pw);
        const unlocked = await unlockVault(pw, vault.vaultKeySalt, vault.encryptedVaultKey);
        expect(Buffer.from(unlocked.vaultKey).toString("hex")).toBe(
          Buffer.from(vault.vaultKey).toString("hex")
        );
      }
    });
  });

  // ─── Tamper Detection ────────────────────────────────────────────────────

  describe("Tamper Detection", () => {
    it("should detect tampered ciphertext (flipped bit)", async () => {
      const key = await generateKey();
      const encrypted = await encryptString("sensitive data", key);
      // Flip a bit in the base64 payload
      const parts = encrypted.split(":");
      const payload = parts[1];
      const bytes = Buffer.from(payload, "base64");
      bytes[bytes.length - 1] ^= 0x01; // flip last bit
      const tampered = "v1:" + bytes.toString("base64");
      await expect(decryptString(tampered, key)).rejects.toThrow();
    });

    it("should detect truncated ciphertext", async () => {
      const key = await generateKey();
      const encrypted = await encryptString("test data", key);
      const truncated = encrypted.slice(0, encrypted.length - 10);
      await expect(decryptString(truncated, key)).rejects.toThrow();
    });

    it("should reject ciphertext with wrong version prefix", async () => {
      const key = await generateKey();
      const encrypted = await encryptString("test", key);
      const wrongVersion = "v2:" + encrypted.slice(3);
      await expect(decryptString(wrongVersion, key)).rejects.toThrow(/Unsupported ciphertext version/);
    });

    it("should reject ciphertext with no version prefix", async () => {
      const key = await generateKey();
      await expect(decryptString("not-valid-ciphertext", key)).rejects.toThrow();
    });

    it("should detect tampered file encryption (flipped byte in header)", async () => {
      const key = await generateKey();
      const data = new Uint8Array([1, 2, 3, 4, 5]);
      const encrypted = await encryptFile(data, key);
      // Tamper with the header
      const tampered = new Uint8Array(encrypted);
      tampered[0] ^= 0xFF;
      await expect(decryptFile(tampered, key)).rejects.toThrow();
    });

    it("should detect tampered file encryption (flipped byte in body)", async () => {
      const key = await generateKey();
      const data = new Uint8Array(1000);
      data.fill(42);
      const encrypted = await encryptFile(data, key);
      const tampered = new Uint8Array(encrypted);
      tampered[encrypted.length - 1] ^= 0x01;
      await expect(decryptFile(tampered, key)).rejects.toThrow();
    });
  });

  // ─── Key Isolation ───────────────────────────────────────────────────────

  describe("Key Isolation", () => {
    it("should not allow vault key to decrypt another vault's assets", async () => {
      const vault1 = await createVault("password1");
      const vault2 = await createVault("password2");
      const { encryptedAssetKey } = await createAssetKey(vault1.vaultKey);
      // Try to decrypt with vault2's key
      await expect(decryptAssetKey(encryptedAssetKey, vault2.vaultKey)).rejects.toThrow();
    });

    it("should produce unique vault keys for same password", async () => {
      const vault1 = await createVault("same-password");
      const vault2 = await createVault("same-password");
      // Different salts should produce different vault keys
      expect(Buffer.from(vault1.vaultKey).toString("hex")).not.toBe(
        Buffer.from(vault2.vaultKey).toString("hex")
      );
    });

    it("should produce unique asset keys each time", async () => {
      const vault = await createVault("password");
      const asset1 = await createAssetKey(vault.vaultKey);
      const asset2 = await createAssetKey(vault.vaultKey);
      expect(Buffer.from(asset1.assetKey).toString("hex")).not.toBe(
        Buffer.from(asset2.assetKey).toString("hex")
      );
    });

    it("should not allow cross-beneficiary decryption", async () => {
      const vault = await createVault("password");
      const { assetKey: asset1Key } = await createAssetKey(vault.vaultKey);
      const { assetKey: asset2Key } = await createAssetKey(vault.vaultKey);
      const ben1 = await generateBeneficiaryKeyPair();
      const ben2 = await generateBeneficiaryKeyPair();

      const enc1 = await encryptAssetKeyForBeneficiary(asset1Key, ben1.publicKey);
      const enc2 = await encryptAssetKeyForBeneficiary(asset2Key, ben2.publicKey);

      // ben1 cannot decrypt ben2's asset
      await expect(
        decryptAssetKeyAsBeneficiary(enc2, ben1.publicKey, ben1.privateKey)
      ).rejects.toThrow();

      // ben2 cannot decrypt ben1's asset
      await expect(
        decryptAssetKeyAsBeneficiary(enc1, ben2.publicKey, ben2.privateKey)
      ).rejects.toThrow();
    });
  });

  // ─── Recovery Key Edge Cases ─────────────────────────────────────────────

  describe("Recovery Key Edge Cases", () => {
    it("should generate unique recovery keys each time", async () => {
      const vault = await createVault("password");
      const r1 = await generateRecoveryKey(vault.vaultKey);
      const r2 = await generateRecoveryKey(vault.vaultKey);
      expect(r1.recoveryKey).not.toBe(r2.recoveryKey);
      expect(r1.recoveryKeyHash).not.toBe(r2.recoveryKeyHash);
    });

    it("should recover vault key and then decrypt assets", async () => {
      const vault = await createVault("password");
      const { assetKey, encryptedAssetKey } = await createAssetKey(vault.vaultKey);
      const encrypted = await encryptString("my secret seed phrase", assetKey);

      const recovery = await generateRecoveryKey(vault.vaultKey);
      const recoveredVaultKey = await recoverVaultKey(
        recovery.recoveryKey,
        recovery.recoveryKeySalt,
        recovery.encryptedVaultKeyRecovery
      );

      const recoveredAssetKey = await decryptAssetKey(encryptedAssetKey, recoveredVaultKey);
      const decrypted = await decryptString(encrypted, recoveredAssetKey);
      expect(decrypted).toBe("my secret seed phrase");
    });

    it("should fail recovery with partial recovery key", async () => {
      const vault = await createVault("password");
      const recovery = await generateRecoveryKey(vault.vaultKey);
      const partial = recovery.recoveryKey.slice(0, recovery.recoveryKey.length - 5);
      await expect(
        recoverVaultKey(partial, recovery.recoveryKeySalt, recovery.encryptedVaultKeyRecovery)
      ).rejects.toThrow();
    });
  });

  // ─── Chunked File Encryption Edge Cases ──────────────────────────────────

  describe("Chunked File Encryption Edge Cases", () => {
    it("should handle file exactly at chunk boundary (64KB)", async () => {
      const key = await generateKey();
      const data = new Uint8Array(64 * 1024);
      data.fill(0xAB);
      const encrypted = await encryptFile(data, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(decrypted.length).toBe(64 * 1024);
      expect(decrypted[0]).toBe(0xAB);
      expect(decrypted[decrypted.length - 1]).toBe(0xAB);
    });

    it("should handle file one byte over chunk boundary", async () => {
      const key = await generateKey();
      const data = new Uint8Array(64 * 1024 + 1);
      data.fill(0xCD);
      const encrypted = await encryptFile(data, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(decrypted.length).toBe(64 * 1024 + 1);
    });

    it("should handle file one byte under chunk boundary", async () => {
      const key = await generateKey();
      const data = new Uint8Array(64 * 1024 - 1);
      data.fill(0xEF);
      const encrypted = await encryptFile(data, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(decrypted.length).toBe(64 * 1024 - 1);
    });

    it("should handle empty file", async () => {
      const key = await generateKey();
      const data = new Uint8Array(0);
      const encrypted = await encryptFile(data, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(decrypted.length).toBe(0);
    });

    it("should handle multi-megabyte file (500KB)", async () => {
      const key = await generateKey();
      const data = new Uint8Array(500 * 1024);
      for (let i = 0; i < data.length; i++) data[i] = i % 256;
      const encrypted = await encryptFile(data, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(decrypted.length).toBe(data.length);
      // Verify data integrity
      for (let i = 0; i < 100; i++) {
        const idx = Math.floor(Math.random() * data.length);
        expect(decrypted[idx]).toBe(data[idx]);
      }
    });
  });

  // ─── Concurrent Operations ───────────────────────────────────────────────

  describe("Concurrent Operations", () => {
    it("should handle multiple simultaneous encryptions", async () => {
      const key = await generateKey();
      const promises = Array.from({ length: 10 }, (_, i) =>
        encryptString(`message-${i}`, key)
      );
      const results = await Promise.all(promises);
      // All should be unique (random nonces)
      const unique = new Set(results);
      expect(unique.size).toBe(10);
    });

    it("should handle multiple simultaneous vault creations", async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        createVault(`password-${i}`)
      );
      const vaults = await Promise.all(promises);
      // All vault keys should be unique
      const keys = vaults.map((v) => Buffer.from(v.vaultKey).toString("hex"));
      expect(new Set(keys).size).toBe(5);
    });

    it("should handle encrypt-then-decrypt in parallel", async () => {
      const key = await generateKey();
      const messages = Array.from({ length: 20 }, (_, i) => `parallel-msg-${i}`);
      const encrypted = await Promise.all(messages.map((m) => encryptString(m, key)));
      const decrypted = await Promise.all(encrypted.map((e) => decryptString(e, key)));
      expect(decrypted).toEqual(messages);
    });
  });

  // ─── Password Strength Edge Cases ────────────────────────────────────────

  describe("Password Strength Edge Cases", () => {
    it("should score empty password as very weak", () => {
      const result = passwordStrength("");
      expect(result.score).toBe(0);
      expect(result.label).toBe("Very weak");
    });

    it("should score single character as very weak", () => {
      const result = passwordStrength("a");
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it("should score all-lowercase 12+ chars as fair", () => {
      const result = passwordStrength("abcdefghijklmnop");
      expect(result.score).toBe(2); // length >=8, length >=12, no mixed case, no special
    });

    it("should score maximum complexity password as very strong", () => {
      const result = passwordStrength("MyStr0ng!P@ssw0rd#2024");
      expect(result.score).toBe(4);
      expect(result.label).toBe("Very strong");
    });

    it("should provide suggestions for each weakness", () => {
      const result = passwordStrength("short");
      expect(result.suggestions).toContain("Use at least 8 characters");
    });

    it("should handle extremely long passwords", () => {
      const longPw = "Aa1!".repeat(100);
      const result = passwordStrength(longPw);
      expect(result.score).toBe(4);
    });
  });

  // ─── Utility Functions ───────────────────────────────────────────────────

  describe("Utility Functions", () => {
    it("toBytes should convert string to Uint8Array", async () => {
      const bytes = await toBytes("hello");
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(5);
    });

    it("toBase64 and fromBase64 should roundtrip", async () => {
      const sodium = await getSodium();
      const original = sodium.randombytes_buf(32);
      const b64 = await toBase64(original);
      const recovered = await fromBase64(b64);
      expect(Buffer.from(recovered).toString("hex")).toBe(
        Buffer.from(original).toString("hex")
      );
    });

    it("secureZero should zero all bytes", async () => {
      const sodium = await getSodium();
      const buf = sodium.randombytes_buf(64);
      expect(buf.some((b) => b !== 0)).toBe(true);
      await secureZero(buf);
      expect(buf.every((b) => b === 0)).toBe(true);
    });

    it("generateSalt should produce correct length", async () => {
      const sodium = await getSodium();
      const salt = await generateSalt();
      expect(salt.length).toBe(sodium.crypto_pwhash_SALTBYTES);
    });

    it("generateKey should produce 32-byte key", async () => {
      const key = await generateKey();
      expect(key.length).toBe(32);
    });
  });
});
