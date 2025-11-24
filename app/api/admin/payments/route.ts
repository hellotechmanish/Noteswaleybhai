import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await dbConnect();
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("userId", "name email")
      .populate("noteId", "title");

    // Calculate stats
    const stats = {
      totalRevenue: payments.reduce(
        (sum, p) => (p.status === "completed" ? sum + p.amount : sum),
        0
      ),
      completedPayments: payments.filter((p) => p.status === "completed")
        .length,
      pendingPayments: payments.filter((p) => p.status === "pending").length,
    };

    return NextResponse.json({ payments, stats });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
