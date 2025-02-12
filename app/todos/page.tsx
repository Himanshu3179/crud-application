import { getTodos } from "@/app/todos/todoService";
import TodoList from "@/components/todo/TodoList";
import TodoForm from "@/components/form/TodoForm";
import { getUser, isAuthenticated } from "../actions";
import { redirect } from "next/navigation";
import UserDropdown from "@/components/UserDropdown";

export default async function TodosPage() {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect("/");
  }
  const user = await getUser();

  const todos = await getTodos();

  return (
    <div className="bg-[#1e1e1e] w-screen h-screen flex justify-center items-center ">
      <div className="relative max-w-xl w-full h-full text-white shadow-lg border rounded-lg flex flex-col">
        <UserDropdown name={user || "User"} />
        <h1 className="text-3xl font-bold text-center mt-10">Todo</h1>
        <div className="px-6 mt-10">
          <TodoForm />
        </div>
        <div className="flex-1 overflow-auto">
          <TodoList initialTodos={todos} />
        </div>
      </div>
    </div>
  );
}
