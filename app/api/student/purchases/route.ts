import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import Payment from "@/models/Payment";
import { connectionToDb } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectionToDb();
    const payments = await Payment.find({
      userId: payload.userId,
      status: "completed",
      type: "view",
    }).select("noteId");

    const purchases = payments?.map((p: any) => p.noteId) || [];

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchases" },
      { status: 500 }
    );
  }
}
