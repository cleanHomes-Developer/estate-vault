import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/session
 *
 * Check if the user has a valid session.
 */
export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  // In production: validate session token against database
  // For demo, return null (no persistent sessions without DB)
  return NextResponse.json({ user: null });
}
