"use client";
import { useEffect, useState } from "react";

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

interface TodoForm {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [form, setForm] = useState<TodoForm>({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    category: "",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditId(null);
    setForm({
      id: "",
      title: "",
      description: "",
      dueDate: "",
      category: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditId(todo._id);

    const formattedDate = todo.date
      ? new Date(todo.date).toISOString().slice(0, 10)
      : "";

    setForm({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      dueDate: formattedDate,
      category: todo.category,
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm({
      id: "",
      title: "",
      description: "",
      dueDate: "",
      category: "",
    });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.dueDate || !form.category)
      return;

    const payload = {
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      category: form.category,
    };

    if (editId) {
      await fetch(`/api/student/todo/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/student/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    closeModal();
    loadTodos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      const res = await fetch(`/api/student/todo/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete.");
        return;
      }

      loadTodos();
    } catch (e) {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Todo List
          </h1>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add Todo
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-white/80 dark:bg-gray-900 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 border rounded-lg shadow-xl w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {editId ? "Edit Todo" : "Add New Todo"}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full border px-3 py-2 rounded-md"
                />

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={3}
                  className="w-full border px-3 py-2 rounded-md"
                />

                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="">Select Category</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Non-Urgent">Non-Urgent</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 border rounded-lg shadow">
            <p className="text-gray-500 text-lg">No todos found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo._id}
                className="bg-white dark:bg-gray-900 rounded-lg border shadow-sm p-5"
              >
                <h3 className="font-semibold text-lg">{todo.title}</h3>
                <p className="text-sm text-gray-600">{todo.description}</p>

                <div className="text-sm mt-2">
                  Due:{" "}
                  {new Date(todo.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <div className="mt-2 text-xs">{todo.category}</div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEditModal(todo)}
                    className="px-3 py-1 bg-gray-200 dark:bg-green-700 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
