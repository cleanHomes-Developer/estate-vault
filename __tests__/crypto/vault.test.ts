/**
 * Cryptographic Core Tests
 *
 * Tests for the zero-knowledge vault encryption system.
 * Covers: key derivation, symmetric encryption, 3-key hierarchy,
 * recovery key, beneficiary key exchange, chunked file encryption.
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
  generateSRPCredentials,
} from "../../src/lib/crypto/vault";

describe("Cryptographic Core", () => {
  beforeAll(async () => {
    await getSodium();
  });

  describe("Argon2id Key Derivation", () => {
    it("should derive a 32-byte key from a password and salt", async () => {
      const salt = await generateSalt();
      const key = await deriveMasterKey("test-password-123!", salt);
      expect(key).toBeInstanceOf(Uint8Array);
      expect(key.length).toBe(32);
    });

    it("should produce deterministic output for same password + salt", async () => {
      const salt = await generateSalt();
      const key1 = await deriveMasterKey("same-password", salt);
      const key2 = await deriveMasterKey("same-password", salt);
      expect(Buffer.from(key1).toString("hex")).toBe(Buffer.from(key2).toString("hex"));
    });

    it("should produce different output for different passwords", async () => {
      const salt = await generateSalt();
      const key1 = await deriveMasterKey("password-one", salt);
      const key2 = await deriveMasterKey("password-two", salt);
      expect(Buffer.from(key1).toString("hex")).not.toBe(Buffer.from(key2).toString("hex"));
    });

    it("should produce different output for different salts", async () => {
      const salt1 = await generateSalt();
      const salt2 = await generateSalt();
      const key1 = await deriveMasterKey("same-password", salt1);
      const key2 = await deriveMasterKey("same-password", salt2);
      expect(Buffer.from(key1).toString("hex")).not.toBe(Buffer.from(key2).toString("hex"));
    });
  });

  describe("XChaCha20-Poly1305 Encryption", () => {
    it("should encrypt and decrypt data correctly", async () => {
      const key = await generateKey();
      const sodium = await getSodium();
      const plaintext = sodium.from_string("Hello, vault!");
      const ciphertext = await encrypt(plaintext, key);
      const decrypted = await decrypt(ciphertext, key);
      expect(sodium.to_string(decrypted)).toBe("Hello, vault!");
    });

    it("should prefix ciphertext with v1:", async () => {
      const key = await generateKey();
      const sodium = await getSodium();
      const ciphertext = await encrypt(sodium.from_string("test"), key);
      expect(ciphertext.startsWith("v1:")).toBe(true);
    });

    it("should fail decryption with wrong key", async () => {
      const key1 = await generateKey();
      const key2 = await generateKey();
      const sodium = await getSodium();
      const ciphertext = await encrypt(sodium.from_string("secret"), key1);
      await expect(decrypt(ciphertext, key2)).rejects.toThrow();
    });

    it("should encrypt and decrypt strings", async () => {
      const key = await generateKey();
      const ciphertext = await encryptString("Test string 123", key);
      const decrypted = await decryptString(ciphertext, key);
      expect(decrypted).toBe("Test string 123");
    });

    it("should produce different ciphertext for same plaintext (random nonce)", async () => {
      const key = await generateKey();
      const sodium = await getSodium();
      const plaintext = sodium.from_string("same data");
      const ct1 = await encrypt(plaintext, key);
      const ct2 = await encrypt(plaintext, key);
      expect(ct1).not.toBe(ct2);
    });
  });

  describe("3-Key Hierarchy", () => {
    it("should create and unlock a vault", async () => {
      const password = "strong-password-123!";
      const vault = await createVault(password);

      expect(vault.encryptedVaultKey).toBeTruthy();
      expect(vault.vaultKeySalt).toBeTruthy();
      expect(vault.vaultKey.length).toBe(32);

      const unlocked = await unlockVault(
        password,
        vault.vaultKeySalt,
        vault.encryptedVaultKey
      );

      expect(Buffer.from(unlocked.vaultKey).toString("hex")).toBe(
        Buffer.from(vault.vaultKey).toString("hex")
      );
    });

    it("should fail to unlock vault with wrong password", async () => {
      const vault = await createVault("correct-password");
      await expect(
        unlockVault("wrong-password", vault.vaultKeySalt, vault.encryptedVaultKey)
      ).rejects.toThrow();
    });

    it("should create and decrypt per-asset keys", async () => {
      const vault = await createVault("password");
      const { assetKey, encryptedAssetKey } = await createAssetKey(vault.vaultKey);

      const decryptedAssetKey = await decryptAssetKey(encryptedAssetKey, vault.vaultKey);
      expect(Buffer.from(decryptedAssetKey).toString("hex")).toBe(
        Buffer.from(assetKey).toString("hex")
      );
    });

    it("should encrypt and decrypt asset data end-to-end", async () => {
      const vault = await createVault("password");
      const { assetKey } = await createAssetKey(vault.vaultKey);

      const sensitiveData = JSON.stringify({
        seedPhrase: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      });

      const encrypted = await encryptString(sensitiveData, assetKey);
      const decrypted = await decryptString(encrypted, assetKey);
      expect(JSON.parse(decrypted).seedPhrase).toContain("abandon");
    });
  });

  describe("Recovery Key", () => {
    it("should generate a recovery key and recover the vault key", async () => {
      const vault = await createVault("password");
      const recovery = await generateRecoveryKey(vault.vaultKey);

      expect(recovery.recoveryKey).toBeTruthy();
      expect(recovery.encryptedVaultKeyRecovery).toBeTruthy();
      expect(recovery.recoveryKeySalt).toBeTruthy();
      expect(recovery.recoveryKeyHash).toBeTruthy();

      const recoveredVaultKey = await recoverVaultKey(
        recovery.recoveryKey,
        recovery.recoveryKeySalt,
        recovery.encryptedVaultKeyRecovery
      );

      expect(Buffer.from(recoveredVaultKey).toString("hex")).toBe(
        Buffer.from(vault.vaultKey).toString("hex")
      );
    });

    it("should fail recovery with wrong recovery key", async () => {
      const vault = await createVault("password");
      const recovery = await generateRecoveryKey(vault.vaultKey);

      await expect(
        recoverVaultKey(
          "wrong-recovery-key",
          recovery.recoveryKeySalt,
          recovery.encryptedVaultKeyRecovery
        )
      ).rejects.toThrow();
    });
  });

  describe("Beneficiary Key Exchange", () => {
    it("should generate a key pair", async () => {
      const keyPair = await generateBeneficiaryKeyPair();
      expect(keyPair.publicKey).toBeTruthy();
      expect(keyPair.privateKey).toBeTruthy();
    });

    it("should encrypt and decrypt asset key for beneficiary", async () => {
      const vault = await createVault("password");
      const { assetKey } = await createAssetKey(vault.vaultKey);
      const beneficiary = await generateBeneficiaryKeyPair();

      const encryptedForBeneficiary = await encryptAssetKeyForBeneficiary(
        assetKey,
        beneficiary.publicKey
      );

      const decryptedAssetKey = await decryptAssetKeyAsBeneficiary(
        encryptedForBeneficiary,
        beneficiary.publicKey,
        beneficiary.privateKey
      );

      expect(Buffer.from(decryptedAssetKey).toString("hex")).toBe(
        Buffer.from(assetKey).toString("hex")
      );
    });

    it("should not allow one beneficiary to decrypt another's key", async () => {
      const vault = await createVault("password");
      const { assetKey } = await createAssetKey(vault.vaultKey);
      const beneficiary1 = await generateBeneficiaryKeyPair();
      const beneficiary2 = await generateBeneficiaryKeyPair();

      const encryptedForBen1 = await encryptAssetKeyForBeneficiary(
        assetKey,
        beneficiary1.publicKey
      );

      await expect(
        decryptAssetKeyAsBeneficiary(
          encryptedForBen1,
          beneficiary2.publicKey,
          beneficiary2.privateKey
        )
      ).rejects.toThrow();
    });
  });

  describe("Chunked File Encryption", () => {
    it("should encrypt and decrypt small files", async () => {
      const key = await generateKey();
      const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
      const encrypted = await encryptFile(data, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(Array.from(decrypted)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should encrypt and decrypt large files (multi-chunk)", async () => {
      const key = await generateKey();
      // Create a 200KB file (larger than 64KB chunk size)
      const data = new Uint8Array(200 * 1024);
      for (let i = 0; i < data.length; i++) {
        data[i] = i % 256;
      }
      const encrypted = await encryptFile(data, key);
      const decrypted = await decryptFile(encrypted, key);
      expect(decrypted.length).toBe(data.length);
      expect(decrypted[0]).toBe(0);
      expect(decrypted[255]).toBe(255);
      expect(decrypted[256]).toBe(0);
    });

    it("should fail decryption with wrong key", async () => {
      const key1 = await generateKey();
      const key2 = await generateKey();
      const data = new Uint8Array([1, 2, 3]);
      const encrypted = await encryptFile(data, key1);
      await expect(decryptFile(encrypted, key2)).rejects.toThrow();
    });
  });

  describe("SRP Credentials", () => {
    it("should generate SRP salt and verifier", async () => {
      const creds = await generateSRPCredentials("password");
      expect(creds.srpSalt).toBeTruthy();
      expect(creds.srpVerifier).toBeTruthy();
    });

    it("should produce different verifiers for different passwords", async () => {
      const creds1 = await generateSRPCredentials("password1");
      const creds2 = await generateSRPCredentials("password2");
      expect(creds1.srpVerifier).not.toBe(creds2.srpVerifier);
    });
  });

  describe("Secure Memory", () => {
    it("should zero a buffer", async () => {
      const sodium = await getSodium();
      const buffer = sodium.from_string("sensitive-data");
      await secureZero(buffer);
      expect(buffer.every((b) => b === 0)).toBe(true);
    });
  });

  describe("Password Strength", () => {
    it("should score weak passwords low", () => {
      const result = passwordStrength("abc");
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.label).toBe("Very weak");
    });

    it("should score strong passwords high", () => {
      const result = passwordStrength("MyStr0ng!P@ssw0rd");
      expect(result.score).toBeGreaterThanOrEqual(3);
    });

    it("should provide suggestions for weak passwords", () => {
      const result = passwordStrength("short");
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });
});
