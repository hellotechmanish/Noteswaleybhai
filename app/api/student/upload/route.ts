export const runtime = "nodejs"; // Important: Enables Buffer & Node APIs

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import Note from "@/lib/models/Note";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);

    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const formData = await request.formData();

    // Debug print
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const university = formData.get("university") as string;
    const course = formData.get("course") as string;
    const year = formData.get("year") as string;
    const semester = formData.get("semester") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    if (!university || !course || !year || !semester || !title || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json(
        { error: "File too large. Max 5MB allowed." },
        { status: 400 }
      );

    if (file.type !== "application/pdf")
      return NextResponse.json(
        { error: "Only PDF files allowed." },
        { status: 400 }
      );

    // Convert file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${payload.userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("noteswaleybhai")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload the PDF" },
        { status: 500 }
      );
    }

    await dbConnect();

    const note = await Note.create({
      userId: payload.userId,
      university,
      course,
      year,
      semester,
      title,
      description,
      pdfPath: filePath,
      fileSize: file.size,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Notes uploaded successfully. Awaiting admin approval.",
        note,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
