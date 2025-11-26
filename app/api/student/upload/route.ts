export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/Note";
import { createClient } from "@supabase/supabase-js";
import { connectionToDb } from "@/lib/mongodb";
import { getTokenPayload } from "@/lib/getTokenPayload";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const user = await getTokenPayload();
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

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 5MB allowed." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed." },
        { status: 400 }
      );
    }

    await connectionToDb();

    // ✅ DUPLICATE CHECK (same user + same academic info + same title)
    const alreadyExists = await Note.findOne({
      title,
      university,
      course,
      year,
      semester,
      userId: user.userId,
    });

    if (alreadyExists) {
      return NextResponse.json(
        { error: "This note already exists." },
        { status: 409 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replace(/\s+/g, "_");
    const filePath = `${user.userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("noteswaleybhai")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("noteswaleybhai")
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    const { data: signedData, error: signedError } = await supabase.storage
      .from("noteswaleybhai")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    if (signedError) {
      return NextResponse.json(
        { error: "Signed URL generation failed" },
        { status: 500 }
      );
    }

    const supabaseSignedUrl = signedData.signedUrl;

    const note = await Note.create({
      title,
      description,
      university,
      course,
      year,
      semester,
      userId: user.userId,
      fileUrl,
      supabaseSignedUrl,
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
