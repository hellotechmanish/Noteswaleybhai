import { NextResponse } from "next/server";
import { connectionToDb } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { getTokenPayload } from "@/lib/getTokenPayload";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectionToDb();
    const user = await getTokenPayload();

    if (!user?.userId) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const todos = await Todo.find({
      userId: new mongoose.Types.ObjectId(user.userId),
    }).sort({
      createdAt: -1,
    });
    console.log("todos", todos);

    return NextResponse.json({
      status: 200,
      todos,
      message: "fetch all the date",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "internal server error",
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectionToDb();
    const user = await getTokenPayload();

    const body = await req.json();

    const todo = await Todo.create({
      title: body.title,
      description: body.description,
      date: body.dueDate,
      category: body.category,
      userId: user.userId,
    });

    return NextResponse.json({
      status: 200,
      todo,
      message: "Data created successfully",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
    });
  }
}
