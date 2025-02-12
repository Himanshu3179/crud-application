import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import authOption from "@/lib/auth";


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { title, completed } = body;

    if (!id) throw new Error("Todo ID is required");


    const todo = await db.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updatedTodo = await db.todo.update({
      where: { id },
      data: { title, completed },
    });

    return NextResponse.json(
      { todo: updatedTodo, message: "Todo updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error updating todo" },
      { status: 400 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) throw new Error("Todo ID is required");

    const todo = await db.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await db.todo.delete({ where: { id } });

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error deleting todo" },
      { status: 400 }
    );
  }
}
