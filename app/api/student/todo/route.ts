import { connectionToDb } from "@/lib/mongodb";

export default async function GET() {
  try {
    await connectionToDb();
    const todo = await todo.find();
  } catch (error) {}
}
