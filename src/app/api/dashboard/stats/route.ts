import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/dashboard/stats
 * 
 * Fetch dashboard statistics for the authenticated user.
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

    const userId = session.user.id;

    // Count assets
    const assetCount = await prisma.asset.count({
      where: { userId },
    });

    // Count beneficiaries
    const beneficiaryCount = await prisma.beneficiary.count({
      where: { userId },
    });

    // Get check-in status
    const checkIn = await prisma.checkIn.findFirst({
      where: { userId },
    });

    // Count unverified beneficiaries
    const unverifiedBeneficiaries = await prisma.beneficiary.count({
      where: { userId, verified: false },
    });

    // Calculate health score (0-100)
    let healthScore = 50; // Base score
    if (assetCount > 0) healthScore += 15;
    if (beneficiaryCount > 0) healthScore += 15;
    if (beneficiaryCount > 0 && unverifiedBeneficiaries === 0) healthScore += 10;
    if (checkIn && checkIn.status === "ACTIVE") healthScore += 10;

    // Get recent assets
    const recentAssets = await prisma.asset.findMany({
      where: { userId },
      select: {
        id: true,
        label: true,
        category: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Get recent activity (audit logs)
    const recentActivity = await prisma.auditLog.findMany({
      where: { userId },
      select: {
        id: true,
        event: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      healthScore: Math.min(100, healthScore),
      assetCount,
      beneficiaryCount,
      unverifiedBeneficiaries,
      checkInStatus: checkIn?.status || "INACTIVE",
      nextCheckIn: checkIn?.nextCheckIn || null,
      recentAssets,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
