import { NextResponse } from "next/server";
import University from "@/models/University";
import { connectionToDb } from "@/lib/mongodb";

// CREATE UNIVERSITY
export async function POST(req: Request) {
  try {
    await connectionToDb();
    const body = await req.json();

    const university = await University.create({
      name: body.name,
      courses: [],
    });

    return NextResponse.json({ message: "University created", university });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

// GET ALL UNIVERSITIES
export async function GET() {
  try {
    await connectionToDb();
    const universities = await University.find();
    return NextResponse.json({ universities });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
