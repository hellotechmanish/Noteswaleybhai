import { NextResponse } from "next/server";
import University from "@/models/University";
import { connectionToDb } from "@/lib/mongodb";

// GET SINGLE UNIVERSITY
export async function GET(req: Request, { params }: any) {
  try {
    await connectionToDb();
    const uni = await University.findById(params.id);
    return NextResponse.json({ university: uni });
  } catch (err) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// UPDATE UNIVERSITY
export async function PUT(req: Request, { params }: any) {
  try {
    await connectionToDb();
    const body = await req.json();

    const updated = await University.findByIdAndUpdate(
      params.id,
      { name: body.name },
      { new: true }
    );

    return NextResponse.json({ message: "Updated", university: updated });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

// DELETE UNIVERSITY
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectionToDb();
    await University.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "University deleted" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
