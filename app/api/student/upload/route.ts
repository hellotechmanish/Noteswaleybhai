export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import Note from "@/models/Note";
import { createClient } from "@supabase/supabase-js";
import { connectionToDb } from "@/lib/mongodb";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${payload.userId}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("noteswaleybhai")
      .upload(filePath, buffer, { contentType: "application/pdf" });

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Public URL
    const { data: publicUrlData } = supabase.storage
      .from("noteswaleybhai")
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    // Signed URL (1 week)
    const { data: signedUrlData } = await supabase.storage
      .from("noteswaleybhai")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    await connectionToDb();

    const note = await Note.create({
      title,
      description,

      university,
      course,
      year,
      semester,

      userId: payload.userId,

      fileUrl,
      supabaseSignedUrl: signedUrlData?.signedUrl,

      status: "pending",
    });

    return NextResponse.json(
      { message: "Uploaded successfully!", note },
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
