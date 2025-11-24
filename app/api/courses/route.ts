import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get("universityId");

    if (!universityId) {
      return NextResponse.json(
        { error: "University ID required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const courses = await Course.find({ universityId }).sort({ name: 1 });
    return NextResponse.json(courses || []);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
