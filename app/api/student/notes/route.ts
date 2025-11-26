import { getTokenPayload } from "@/lib/getTokenPayload";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionToDb } from "@/lib/mongodb"; // ✅ FIXED
import Note from "@/models/Note";

export async function GET() {
  try {
    await connectionToDb();

    const user = await getTokenPayload();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    console.log("user", user);

    const userobjId = new mongoose.Types.ObjectId(user.userId);
    console.log("userobjId", userobjId);

    const notes = await Note.find({ userId: userobjId }).sort({
      createdAt: -1,
    });

    console.log("notes", notes);

    return NextResponse.json({
      success: true,
      data: notes || [],
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
