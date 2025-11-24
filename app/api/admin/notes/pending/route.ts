import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";

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
    const notes = await Note.find({ status: "pending" })
      .sort({ createdAt: 1 })
      .populate("userId", "name email");

    return NextResponse.json(notes || []);
  } catch (error) {
    console.error("Error fetching pending notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
