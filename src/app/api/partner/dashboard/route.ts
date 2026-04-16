import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/partner/dashboard
 * 
 * Fetch partner dashboard statistics.
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

    // Count clients (users in partner workspace)
    const clientCount = await prisma.user.count({
      where: { workspaceId: session.user.workspaceId },
    });

    // Calculate total assets across all clients
    const totalAssets = await prisma.asset.count({
      where: { workspace: { partnerProfile: { id: partnerProfile.id } } },
    });

    // Calculate total beneficiaries
    const totalBeneficiaries = await prisma.beneficiary.count({
      where: { workspace: { partnerProfile: { id: partnerProfile.id } } },
    });

    // Calculate revenue (simplified: clients * base fee)
    const monthlyRevenue = clientCount * 29; // Base plan price
    const totalRevenue = monthlyRevenue * 12; // Annual estimate

    return NextResponse.json({
      firmName: partnerProfile.firmName,
      clientCount,
      totalAssets,
      totalBeneficiaries,
      monthlyRevenue,
      totalRevenue,
      revenueSharePct: partnerProfile.revenueSharePct,
      approved: partnerProfile.approved,
    });
  } catch (error) {
    console.error("Partner dashboard error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
