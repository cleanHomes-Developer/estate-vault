import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/assets
 * 
 * Fetch all assets for the authenticated user.
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

    // Fetch user's assets
    const assets = await prisma.asset.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        label: true,
        category: true,
        riskLevel: true,
        createdAt: true,
        updatedAt: true,
        beneficiaryKeys: {
          select: {
            beneficiary: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Assets fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/assets
 * 
 * Create a new asset for the authenticated user.
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
    const {
      label,
      category,
      encryptedData,
      encryptedKey,
      keySalt,
      riskLevel,
      notes,
    } = body;

    if (!label || !category || !encryptedData || !encryptedKey || !keySalt) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create asset
    const asset = await prisma.asset.create({
      data: {
        userId: session.user.id,
        workspaceId: session.user.workspaceId,
        label,
        category,
        encryptedData,
        encryptedKey,
        keySalt,
        riskLevel: riskLevel || "UNKNOWN",
        notes: notes || null,
      },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error("Asset creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
