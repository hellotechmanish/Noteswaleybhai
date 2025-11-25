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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fetch all todos
  const loadTodos = async () => {
    try {
      const res = await fetch("/api/student/todo");
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

  const openAddModal = () => {
    setEditId(null);
    setForm({ title: "", description: "", dueDate: "", category: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditId(todo._id);
    setForm({
      title: todo.title,
      description: todo.description,
      dueDate: todo?.dueDate?.slice(0, 10),
      category: todo.category,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm({ title: "", description: "", dueDate: "", category: "" });
  };

  // create or update
  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.dueDate || !form.category)
      return;

    console.log("form", form);

    if (editId) {
      await fetch(`/api/student/todo/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/student/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    closeModal();
    loadTodos();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      await fetch(`/api/student/todo/${id}`, {
        method: "DELETE",
      });
      loadTodos();
    }
  };

  return (
    <div className="min-h-screen mx-auto max-w-3xl px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Todo List</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add Todo
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Todo" : "Add New Todo"}
              </h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Non-Urgent">Non-Urgent</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Todo List */}
      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading...</p>
      ) : todos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-2">No todos found.</p>
          <p className="text-gray-500 text-sm">
            Click "Add Todo" to create your first task!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="bg-white p-4 rounded-md shadow hover:shadow-md transition flex justify-between items-start"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 text-lg">
                  {todo.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{todo.description}</p>
                <div className="flex gap-4 mt-2">
                  <p className="text-gray-500 text-sm">
                    📅 {todo.dueDate?.slice(0, 10)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      todo.category === "Urgent"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {todo.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => openEditModal(todo)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
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
