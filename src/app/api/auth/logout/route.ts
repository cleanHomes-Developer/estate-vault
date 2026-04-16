import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * POST /api/auth/logout
 *
 * Destroy the session and clear the cookie.
 * Deletes the session from the database.
 */
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;

    if (sessionToken) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { token: sessionToken },
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("session");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ success: true });
    response.cookies.delete("session");
    return response;
  } finally {
    await prisma.$disconnect();
  }
}
