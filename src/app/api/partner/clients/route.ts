import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/partner/clients
 * 
 * Fetch all clients for the partner.
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

    // Get partner profile
    const partnerProfile = await prisma.partnerProfile.findUnique({
      where: { workspaceId: session.user.workspaceId },
    });

    if (!partnerProfile) {
      return NextResponse.json(
        { message: "Partner profile not found" },
        { status: 404 }
      );
    }

    // Fetch all clients (users in partner workspace)
    const clients = await prisma.user.findMany({
      where: { workspaceId: session.user.workspaceId },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
        assets: {
          select: { id: true },
        },
        beneficiaries: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Enrich with counts
    const clientsWithStats = clients.map((client) => ({
      id: client.id,
      email: client.email,
      name: client.displayName || "Unnamed",
      assetCount: client.assets.length,
      beneficiaryCount: client.beneficiaries.length,
      joinedAt: client.createdAt,
    }));

    return NextResponse.json({ clients: clientsWithStats });
  } catch (error) {
    console.error("Partner clients fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
