"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTodoStore } from "@/store/useTodoStore";
import { Plus } from "lucide-react";

const todoSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
});

const TodoForm = () => {
  const { addTodo, deleteTodo } = useTodoStore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof todoSchema>) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    const tempTodo = { id: tempId, title: values.title, completed: false };

    addTodo(tempTodo); // ✅ Optimistic UI Update
    form.reset();
    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const newTodo = await response.json();
      deleteTodo(tempId);
      addTodo(newTodo.todo);
    } catch (error) {
      deleteTodo(tempId);
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex gap-3 mb-6 items-center"
    >
      {/* ✅ Rounded Input Field */}
      <input
        placeholder="Enter todo title..."
        {...form.register("title")}
        className="w-full p-4 rounded-lg bg-[#2d2d2d] border-none text-white h-12 focus:ring-yellow-400         
        focus:ring-0 focus:outline-none
      "
      />

      {/* ✅ Circle Button with Perfect Centering */}
      <Button
        type="submit"
        className="bg-yellow-400 p-4 text-black rounded-lg flex items-center justify-center h-12"
      >
        <Plus size={24} />
      </Button>
    </form>
  );
};

export default TodoForm;
