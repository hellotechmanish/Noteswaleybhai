"use client";

import { useEffect, useState } from "react";

interface Todo {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch all todos
  const loadTodos = async () => {
    try {
      const res = await fetch("/api/student/todo"); // your API
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // create or update
  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.dueDate || !form.category)
      return;

    if (editId) {
      await fetch(`/api/student/todo/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch("/api/student/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ title: "", description: "", dueDate: "", category: "" });
    loadTodos();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/student/todo/${id}`, {
      method: "DELETE",
    });
    loadTodos();
  };

  const handleEdit = (todo: Todo) => {
    setEditId(todo._id);
    setForm({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate.slice(0, 10),
      category: todo.category,
    });
  };

  return (
    <div className="min-h-screen mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Todo List</h1>

      {/* form */}
      <div className="bg-white p-5 rounded-md shadow mb-8">
        <div className="mb-4">
          <label className="text-sm text-gray-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select</option>
            <option value="Urgent">Urgent</option>
            <option value="Non-Urgent">Non-Urgent</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 rounded-md text-white py-2 hover:bg-blue-700"
        >
          {editId ? "Update Todo" : "Add Todo"}
        </button>
      </div>

      {/* list */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-600">No todos found.</p>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="bg-white p-4 rounded-md shadow flex justify-between items-start"
            >
              <div>
                <h2 className="font-semibold text-gray-800">{todo.title}</h2>
                <p className="text-gray-600 text-sm">{todo.description}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Date: {todo.dueDate.slice(0, 10)}
                </p>
                <p className="text-gray-500 text-sm">
                  Category: {todo.category}
                </p>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
