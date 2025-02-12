import { create } from "zustand";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updatedTodo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],

  setTodos: (todos) => set({ todos }),

  addTodo: (todo) =>
    set((state) => ({
      todos: [todo, ...state.todos],
    })),

  updateTodo: (id, updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      ),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));
