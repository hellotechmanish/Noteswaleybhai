import { getTokenPayload } from "@/lib/getTokenPayload";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectionToDb } from "@/lib/mongodb"; // ✅ FIXED

export async function GET() {
  try {
    await connectionToDb();

    const user = await getTokenPayload();
    console.log("user", user);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 }
      );
    }

    const userobjId = new mongoose.Types.ObjectId(user.userId);
    console.log("userobjId", userobjId);

    const userData = await User.findOne(userobjId);
    // .populate({
    //   path: "notes",
    //   select:
    //     "title university course year semester status views downloads earnedAmount createdAt uploadedBy",
    //   options: { sort: { createdAt: -1 } },
    // });
    // console.log("userData notes", userData);


    return NextResponse.json({
      success: true,
      data: userData?.notes || [],
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
