import { NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";


const todoSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  completed: z.boolean().optional(),
});


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, completed } = todoSchema.parse(body);

    const userId = session.user.id;

    const newTodo = await db.todo.create({
      data: { title, completed: completed ?? false, userId },
    });

    return NextResponse.json(
      { todo: newTodo, message: "Todo created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error creating todo" },
      { status: 400 }
    );
  }
}


export async function GET() {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log("hello", session.user);
    const todos = await db.todo.findMany({
      where: { userId: session.user.name },
    });

    return NextResponse.json({ todos }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching todos" },
      { status: 500 }
    );
  }
}
