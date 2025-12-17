import { NextResponse } from "next/server";
import University from "@/models/University";
import { connectionToDb } from "@/lib/mongodb";

// ADD COURSE
export async function POST(req: Request, { params }: any) {
  try {
    await connectionToDb();
    const body = await req.json();

    const uni = await University.findById(params.id);
    if (!uni) return NextResponse.json({ error: "Not found" }, { status: 404 });

    uni.courses.push({
      name: body.name,
      semesters: []
    });

    await uni.save();

    return NextResponse.json({ message: "Course added", courses: uni.courses });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

// GET ALL COURSES
export async function GET(req: Request, { params }: any) {
  try {
    await connectionToDb();
    const uni = await University.findById(params.id);
    return NextResponse.json({ courses: uni.courses });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
