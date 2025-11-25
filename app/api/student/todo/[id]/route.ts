import { NextResponse } from "next/server";
import { connectionToDb } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { getTokenPayload } from "@/lib/getTokenPayload";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectionToDb();
  const user = await getTokenPayload();

  const todo = await Todo.findOne({
    _id: params.id,
    userId: user.userId,
  });

  return NextResponse.json({ todo });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectionToDb();
  const user = await getTokenPayload();

  const data = await req.json();

  const updated = await Todo.findOneAndUpdate(
    { _id: params.id, userId: user.userId },
    {
      title: data.title,
      description: data.description,
      date: data.date,
      category: data.category,
    },
    { new: true }
  );

  return NextResponse.json({ updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectionToDb();
  const user = await getTokenPayload();

  await Todo.findOneAndDelete({
    _id: params.id,
    userId: user.userId,
  });

  return NextResponse.json({ message: "Deleted" });
}
