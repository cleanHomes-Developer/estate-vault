/**
 * API Route Tests
 *
 * Tests all auth API endpoints for correct responses,
 * error handling, validation, and cookie management.
 *
 * Since Next.js API routes use NextRequest/NextResponse,
 * we test them by starting the dev server and making HTTP requests.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";

const BASE_URL = "http://localhost:3001";
let serverProcess: ReturnType<typeof import("child_process").spawn> | null = null;

async function waitForServer(url: string, maxWait = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    try {
      const res = await fetch(url);
      if (res.status) return true;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

beforeAll(async () => {
  const { spawn } = await import("child_process");
  serverProcess = spawn("npx", ["next", "dev", "-p", "3001"], {
    cwd: process.cwd(),
    stdio: "pipe",
    env: { ...process.env, NODE_ENV: "development" },
  });
  const ready = await waitForServer(BASE_URL);
  if (!ready) throw new Error("Dev server failed to start");
}, 60000);

afterAll(() => {
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
});

describe("POST /api/auth/register", () => {
  it("should register a new user with valid data", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        displayName: "Test User",
        srpSalt: "dGVzdC1zYWx0",
        srpVerifier: "dGVzdC12ZXJpZmllcg==",
        encryptedVaultKey: "v1:dGVzdC1lbmNyeXB0ZWQ=",
        vaultKeySalt: "dGVzdC12YXVsdC1zYWx0",
        encryptedVaultKeyRecovery: "v1:cmVjb3Zlcnk=",
        recoveryKeySalt: "cmVjb3Zlcnktc2FsdA==",
        recoveryKeyHash: "aGFzaA==",
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe("test@example.com");
    expect(data.sessionToken).toBeTruthy();
    // Check cookie was set
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("session=");
  });

  it("should return 400 for missing email", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        srpSalt: "dGVzdC1zYWx0",
        srpVerifier: "dGVzdC12ZXJpZmllcg==",
        encryptedVaultKey: "v1:dGVzdC1lbmNyeXB0ZWQ=",
        vaultKeySalt: "dGVzdC12YXVsdC1zYWx0",
      }),
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 for missing srpSalt", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        srpVerifier: "dGVzdC12ZXJpZmllcg==",
        encryptedVaultKey: "v1:dGVzdC1lbmNyeXB0ZWQ=",
        vaultKeySalt: "dGVzdC12YXVsdC1zYWx0",
      }),
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 for missing encryptedVaultKey", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        srpSalt: "dGVzdC1zYWx0",
        srpVerifier: "dGVzdC12ZXJpZmllcg==",
        vaultKeySalt: "dGVzdC12YXVsdC1zYWx0",
      }),
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 for empty body", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("should handle malformed JSON gracefully", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    expect(res.status).toBe(500);
  });
});

describe("POST /api/auth/login", () => {
  it("should login with valid credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        srpVerifier: "dGVzdC12ZXJpZmllcg==",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user).toBeDefined();
    expect(data.sessionToken).toBeTruthy();
  });

  it("should return 400 for missing email", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        srpVerifier: "dGVzdC12ZXJpZmllcg==",
      }),
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 for missing srpVerifier", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
      }),
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 for empty body", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/salt", () => {
  it("should return salt data for valid email", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/salt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.srpSalt).toBeTruthy();
    expect(data.vaultKeySalt).toBeTruthy();
    expect(data.encryptedVaultKey).toBeTruthy();
  });

  it("should return 400 for missing email", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/salt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/session", () => {
  it("should return null user when no session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/session`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user).toBeNull();
  });
});

describe("POST /api/auth/logout", () => {
  it("should return success and clear cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    // Check cookie is cleared
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("session=");
  });
});

describe("HTTP Method Validation", () => {
  it("should reject GET requests to register endpoint", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`);
    expect(res.status).toBe(405);
  });

  it("should reject GET requests to login endpoint", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`);
    expect(res.status).toBe(405);
  });

  it("should reject GET requests to salt endpoint", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/salt`);
    expect(res.status).toBe(405);
  });

  it("should reject GET requests to logout endpoint", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/logout`);
    expect(res.status).toBe(405);
  });
});
