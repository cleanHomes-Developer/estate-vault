import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/auth/salt
 *
 * Returns the user's SRP salt and vault key salt for client-side derivation.
 * These are public values used to derive the master key from the password.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    // Look up user by email in database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        srpSalt: true,
        vaultKeySalt: true,
        encryptedVaultKey: true,
      },
    });

    if (!user) {
      // Don't reveal whether email exists (security best practice)
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      srpSalt: user.srpSalt,
      vaultKeySalt: user.vaultKeySalt,
      encryptedVaultKey: user.encryptedVaultKey,
    });
  } catch (error) {
    console.error("Salt retrieval error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
