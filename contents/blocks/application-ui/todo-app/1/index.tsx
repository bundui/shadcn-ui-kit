"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

const initialTodos: Todo[] = [
  { id: 1, title: "Reply to the onboarding feedback email", done: true },
  { id: 2, title: "Draft the Q3 roadmap summary", done: false },
  { id: 3, title: "Book a room for Thursday's retro", done: true },
  { id: 4, title: "Review the pricing page copy", done: false },
  { id: 5, title: "Pick up groceries on the way home", done: false },
];

export default function TodoApp1() {
  const [todos, setTodos] = useState(initialTodos);
  const [draft, setDraft] = useState("");

  const remaining = todos.filter((todo) => !todo.done).length;

  function addTodo() {
    const title = draft.trim();
    if (!title) return;
    setTodos((prev) => [...prev, { id: Date.now(), title, done: false }]);
    setDraft("");
  }

  function toggleTodo(id: number, done: boolean) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done } : todo)),
    );
  }

  function removeTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4">
        <h2 className="text-lg font-semibold">Your todos</h2>

        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            addTodo();
          }}
        >
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a new task"
            aria-label="New task"
          />
          <Button type="submit" size="icon" disabled={!draft.trim()}>
            <PlusIcon />
            <span className="sr-only">Add task</span>
          </Button>
        </form>

        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-xl border py-2 pr-2 pl-4"
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.done}
                onCheckedChange={(checked) =>
                  toggleTodo(todo.id, checked === true)
                }
              />
              <Label
                htmlFor={`todo-${todo.id}`}
                className={cn(
                  "flex-1 cursor-pointer leading-snug font-normal",
                  todo.done && "text-muted-foreground line-through",
                )}
              >
                {todo.title}
              </Label>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                onClick={() => removeTodo(todo.id)}
              >
                <XIcon />
                <span className="sr-only">Delete task</span>
              </Button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            {remaining === 0
              ? "All done for today"
              : `${remaining} ${remaining === 1 ? "task" : "tasks"} remaining`}
          </p>
          <p className="text-muted-foreground text-sm italic">
            &ldquo;Small steps every day add up to big results.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
