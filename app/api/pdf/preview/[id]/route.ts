import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
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
    const note = await Note.findOne({ _id: params.id, status: "approved" });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const supabase = createClient();

    // Get signed URL for PDF (expires in 1 hour for preview)
    const { data, error: urlError } = await supabase.storage
      .from("notes-pdfs")
      .createSignedUrl(note.pdfPath, 3600);

    if (urlError) {
      throw urlError;
    }

    // Fetch and return PDF
    const pdfResponse = await fetch(data.signedUrl);
    const buffer = await pdfResponse.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json(
      { error: "Failed to load preview" },
      { status: 500 }
    );
  }
}
