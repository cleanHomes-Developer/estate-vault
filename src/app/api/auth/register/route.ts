import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 *
 * Receives SRP verifier + salt and encrypted vault key from client.
 * The server NEVER receives the plaintext password.
 * Stores user in SQLite database with Prisma ORM.
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
      encryptedVaultKeyRecovery,
      recoveryKeySalt,
      recoveryKeyHash,
    } = body;

    // Validate required fields
    if (!email || !srpSalt || !srpVerifier || !encryptedVaultKey || !vaultKeySalt) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Create personal workspace for the user
    const workspace = await prisma.workspace.create({
      data: {
        name: "Personal",
        type: "PERSONAL",
      },
    });

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        displayName: displayName || null,
        srpSalt,
        srpVerifier,
        encryptedVaultKey,
        vaultKeySalt,
        encryptedVaultKeyRecovery: encryptedVaultKeyRecovery || null,
        recoveryKeySalt: recoveryKeySalt || null,
        recoveryKeyHash: recoveryKeyHash || null,
        workspaceId: workspace.id,
      },
    });

    // Create session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Store session in database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        device: request.headers.get("user-agent") || undefined,
        ipAddress: request.headers.get("x-forwarded-for") || request.ip || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
        expiresAt,
      },
    });

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          mfaEnabled: user.mfaEnabled,
        },
        sessionToken,
      },
      { status: 201 }
    );

    // Set session cookie
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
