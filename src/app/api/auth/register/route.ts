import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/register
 *
 * Receives SRP verifier + salt and encrypted vault key from client.
 * The server NEVER receives the plaintext password.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      displayName,
      srpSalt,
      srpVerifier,
      encryptedVaultKey,
      vaultKeySalt,
      _encryptedVaultKeyRecovery,
      _recoveryKeySalt,
      _recoveryKeyHash,
    } = body;

    // Validate required fields
    if (!email || !srpSalt || !srpVerifier || !encryptedVaultKey || !vaultKeySalt) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production: save to database via Prisma
    // For now, return a mock user (database integration in deployment)
    const user = {
      id: crypto.randomUUID(),
      email,
      displayName: displayName || null,
      mfaEnabled: false,
    };

    // Create session token
    const sessionToken = crypto.randomUUID();

    const response = NextResponse.json({ user, sessionToken }, { status: 201 });

    // Set session cookie
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
