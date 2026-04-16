import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/beneficiaries
 * 
 * Fetch all beneficiaries for the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user from session
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's beneficiaries
    const beneficiaries = await prisma.beneficiary.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        relation: true,
        phone: true,
        verified: true,
        verifiedAt: true,
        createdAt: true,
        assetKeys: {
          select: {
            asset: {
              select: {
                id: true,
                label: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ beneficiaries });
  } catch (error) {
    console.error("Beneficiaries fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/beneficiaries
 * 
 * Create a new beneficiary for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user from session
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, relation, phone, publicKey } = body;

    if (!name || !email || !relation || !publicKey) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create beneficiary
    const beneficiary = await prisma.beneficiary.create({
      data: {
        userId: session.user.id,
        workspaceId: session.user.workspaceId,
        name,
        email,
        relation,
        phone: phone || null,
        publicKey,
      },
    });

    return NextResponse.json({ beneficiary }, { status: 201 });
  } catch (error) {
    console.error("Beneficiary creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
