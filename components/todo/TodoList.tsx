"use client";

import { useEffect, useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";
import { Todo } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Check, Pen, Trash } from "lucide-react";

interface TodoListProps {
  initialTodos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ initialTodos }) => {
  const { todos, setTodos, deleteTodo } = useTodoStore();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos, setTodos]);

  const toggleComplete = async (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updatedTodos);

    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todos.find((todo) => todo.id === id)?.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
    } catch (error) {
      setTodos(todos);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const previousTodos = [...todos];
    setTodos(todos.filter((todo) => todo.id !== id));

    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      setTodos(previousTodos);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditText(title);
  };

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: editText } : todo
    );

    setTodos(updatedTodos);
    setEditingId(null);

    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
    } catch (error) {
      setTodos(todos);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <ul className="space-y-2">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-center rounded-lg text-white transition-all w-full"
            >
              <div className="flex justify-between w-full hover:bg-[#2d2d2d] p-3  transition-all">
                <div className="flex items-center space-x-3 w-full">
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-7 h-7 flex items-center justify-center rounded-full border-2 transition-all ${
                      todo.completed
                        ? "border-yellow-400 bg-yellow-400"
                        : "border-gray-500"
                    }`}
                  >
                    {todo.completed && (
                      <Check size={20} className="text-black" />
                    )}
                  </button>

                  {editingId === todo.id ? (
                    <div className="flex items-center w-full">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && saveEdit(todo.id)
                        }
                        autoFocus
                        className="bg-transparent text-white outline-none w-full resize-none overflow-hidden"
                        rows={1}
                      />
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="ml-3 text-green-400 hover:text-green-600 transition-all"
                      >
                        <Check size={24} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`transition-all break-words w-full  max-w-sm ${
                        todo.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.title}
                    </span>
                  )}
                </div>

                <div className="flex space-x-3">
                  {editingId !== todo.id && (
                    <button
                      onClick={() => handleEdit(todo.id, todo.title)}
                      className="text-blue-500 hover:text-blue-700 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Pen size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:text-red-700 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">
            No todos yet. Start by adding one! 🚀
          </p>
        )}
      </ul>
    </div>
  );
};

export default TodoList;
