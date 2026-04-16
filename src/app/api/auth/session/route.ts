import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/auth/session
 *
 * Check if the user has a valid session.
 * Validates the session token against the database.
 */
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null });
    }

    // Look up session in database
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            mfaEnabled: true,
          },
        },
      },
    });

    // Check if session exists and is not expired
    if (!session || session.expiresAt < new Date()) {
      // Delete expired session
      if (session) {
        await prisma.session.delete({
          where: { token: sessionToken },
        });
      }
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null });
  } finally {
    await prisma.$disconnect();
  }
}
