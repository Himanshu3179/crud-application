import authOption from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";

export async function getTodos() {
  try {
    const session = await getServerSession(authOption);
    if (!session) {
      throw new Error("Unauthorized");
    }
    const todos = await db.todo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return todos;
  } catch (error: any) {
    throw new Error(error.message || "Error fetching todos");
  }
}
