import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/login
 *
 * SRP-6a verification. Client sends verifier, server compares.
 * Password never transmitted.
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

    // In production: look up user by email, compare SRP verifier
    // For now, return mock success
    const user = {
      id: crypto.randomUUID(),
      email,
      displayName: null,
      mfaEnabled: false,
    };

    const sessionToken = crypto.randomUUID();

    const response = NextResponse.json({ user, sessionToken });

    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
