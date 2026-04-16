import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/salt
 *
 * Returns the user's SRP salt and vault key salt for client-side derivation.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    // In production: look up user by email and return their salts
    // For demo, return placeholder salts
    return NextResponse.json({
      srpSalt: "demo-srp-salt",
      vaultKeySalt: "demo-vault-salt",
      encryptedVaultKey: "demo-encrypted-vault-key",
    });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
