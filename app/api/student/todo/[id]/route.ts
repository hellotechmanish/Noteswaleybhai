import { NextResponse } from "next/server";
import { connectionToDb } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { getTokenPayload } from "@/lib/getTokenPayload";
import { id } from "date-fns/locale";

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
  context: { params: Promise<{ id: string }> }
) {
  await connectionToDb();
  const user = await getTokenPayload();
  const { id } = await context.params;

  console.log("id", id);

  const data = await req.json();

  const updated = await Todo.findOneAndUpdate(
    { _id: id, userId: user.userId },
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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  console.log("id", id);

  await connectionToDb();
  const user = await getTokenPayload();

  await Todo.findOneAndDelete({
    _id: id,
    userId: user.userId,
  });

  return NextResponse.json({ message: "Deleted" });
}
