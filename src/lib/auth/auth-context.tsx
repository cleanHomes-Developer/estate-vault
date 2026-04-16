"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  email: string;
  displayName?: string;
  mfaEnabled: boolean;
  mfaType?: "TOTP" | "WEBAUTHN";
}

interface VaultState {
  isUnlocked: boolean;
  vaultKey: Uint8Array | null;
  masterKey: Uint8Array | null;
}

interface AuthContextType {
  user: User | null;
  vault: VaultState;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<string>;
  logout: () => Promise<void>;
  unlockVault: (password: string) => Promise<void>;
  lockVault: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vault, setVault] = useState<VaultState>({
    isUnlocked: false,
    vaultKey: null,
    masterKey: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch {
        // No session
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const { createVault: createVaultCrypto, generateSRPCredentials, generateRecoveryKey } =
      await import("@/lib/crypto/vault");

    // 1. Create vault (derive master key, generate vault key)
    const vaultData = await createVaultCrypto(password);

    // 2. Generate SRP credentials (password never sent to server)
    const srpCreds = await generateSRPCredentials(password);

    // 3. Generate recovery key
    const recovery = await generateRecoveryKey(vaultData.vaultKey);

    // 4. Send registration data to server
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        displayName,
        srpSalt: srpCreds.srpSalt,
        srpVerifier: srpCreds.srpVerifier,
        encryptedVaultKey: vaultData.encryptedVaultKey,
        vaultKeySalt: vaultData.vaultKeySalt,
        encryptedVaultKeyRecovery: recovery.encryptedVaultKeyRecovery,
        recoveryKeySalt: recovery.recoveryKeySalt,
        recoveryKeyHash: recovery.recoveryKeyHash,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await res.json();
    setUser(data.user);
    setVault({
      isUnlocked: true,
      vaultKey: vaultData.vaultKey,
      masterKey: vaultData.masterKey,
    });

    // Return recovery key for the ceremony
    return recovery.recoveryKey;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // 1. Get user's salt from server
    const saltRes = await fetch("/api/auth/salt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!saltRes.ok) {
      throw new Error("Invalid email or password");
    }

    const { srpSalt: _srpSalt2, vaultKeySalt, encryptedVaultKey } = await saltRes.json();

    // 2. Generate SRP credentials client-side
    const { generateSRPCredentials } = await import("@/lib/crypto/vault");
    const srpCreds = await generateSRPCredentials(password);

    // 3. Verify with server (SRP-6a simplified)
    const verifyRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        srpVerifier: srpCreds.srpVerifier,
      }),
    });

    if (!verifyRes.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await verifyRes.json();

    // 4. Unlock vault client-side
    const { unlockVault: unlockVaultCrypto } = await import("@/lib/crypto/vault");
    const { masterKey, vaultKey } = await unlockVaultCrypto(
      password,
      vaultKeySalt,
      encryptedVaultKey
    );

    setUser(data.user);
    setVault({ isUnlocked: true, vaultKey, masterKey });
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best effort
    }

    // Securely zero vault keys
    if (vault.vaultKey) {
      import("@/lib/crypto/vault").then(({ secureZero }) => {
        if (vault.vaultKey) secureZero(vault.vaultKey);
        if (vault.masterKey) secureZero(vault.masterKey);
      });
    }

    setUser(null);
    setVault({ isUnlocked: false, vaultKey: null, masterKey: null });
  }, [vault]);

  const unlockVault = useCallback(async (password: string) => {
    if (!user) throw new Error("Not authenticated");

    const saltRes = await fetch("/api/auth/salt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    });

    const { vaultKeySalt, encryptedVaultKey } = await saltRes.json();

    const { unlockVault: unlockVaultCrypto } = await import("@/lib/crypto/vault");
    const { masterKey, vaultKey } = await unlockVaultCrypto(
      password,
      vaultKeySalt,
      encryptedVaultKey
    );

    setVault({ isUnlocked: true, vaultKey, masterKey });
  }, [user]);

  const lockVault = useCallback(() => {
    if (vault.vaultKey) {
      import("@/lib/crypto/vault").then(({ secureZero }) => {
        if (vault.vaultKey) secureZero(vault.vaultKey);
        if (vault.masterKey) secureZero(vault.masterKey);
      });
    }
    setVault({ isUnlocked: false, vaultKey: null, masterKey: null });
  }, [vault]);

  return (
    <AuthContext.Provider
      value={{
        user,
        vault,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        unlockVault,
        lockVault,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
