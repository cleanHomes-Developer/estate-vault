import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Destroy the session and clear the cookie.
 */
export async function POST(_request: NextRequest) {
  // In production: delete session from database
  const response = NextResponse.json({ success: true });
  response.cookies.delete("session");
  return response;
}
