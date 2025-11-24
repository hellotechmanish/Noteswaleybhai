import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
import Payment from "@/models/Payment";
import { createClient } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await dbConnect();

    const payment = await Payment.findOne({
      userId: payload.userId,
      noteId: params.id,
      type: "view",
      status: "completed",
      accessExpires: { $gt: new Date() },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Access denied. Purchase required." },
        { status: 403 }
      );
    }

    const note = await Note.findById(params.id);

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const supabase = createClient();

    // Get signed URL
    const { data, error: urlError } = await supabase.storage
      .from("notes-pdfs")
      .createSignedUrl(note.pdfPath, 3600);

    if (urlError) {
      throw urlError;
    }

    const pdfResponse = await fetch(data.signedUrl);
    const buffer = await pdfResponse.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("View error:", error);
    return NextResponse.json({ error: "Failed to load PDF" }, { status: 500 });
  }
}
