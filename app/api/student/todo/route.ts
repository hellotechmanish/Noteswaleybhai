import { NextResponse } from "next/server";
import { connectionToDb } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { getTokenPayload } from "@/lib/getTokenPayload";

export async function GET() {
  await connectionToDb();
  const user = await getTokenPayload();

  const todos = await Todo.find({ userId: user.userId }).sort({
    createdAt: -1,
  });
  return NextResponse.json({ todos });
}

export async function POST(req: Request) {
  await connectionToDb();
  const user = await getTokenPayload();

  const body = await req.json();

  const todo = await Todo.create({
    title: body.title,
    description: body.description,
    date: body.date,
    category: body.category,
    userId: user.userId,
  });

  return NextResponse.json({ todo });
}
