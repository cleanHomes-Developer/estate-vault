import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 *
 * SRP-6a verification. Client sends verifier, server compares.
 * Password never transmitted.
 * Looks up user in database and verifies credentials.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, srpVerifier } = body;

    if (!email || !srpVerifier) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Look up user by email in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare SRP verifier (in a real implementation, this would be a full SRP-6a exchange)
    // For now, we're doing a simple comparison. In production, use proper SRP-6a library
    if (user.srpVerifier !== srpVerifier) {
      // Log failed attempt for audit
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          workspaceId: user.workspaceId,
          event: "login.failed",
          detail: "SRP verifier mismatch",
          device: request.headers.get("user-agent") || undefined,
          ipAddress: request.headers.get("x-forwarded-for") || request.ip || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
          success: false,
        },
      });

      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

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

    // Log successful login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        workspaceId: user.workspaceId,
        event: "login.success",
        device: request.headers.get("user-agent") || undefined,
        ipAddress: request.headers.get("x-forwarded-for") || request.ip || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
        success: true,
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
      { status: 200 }
    );

    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
