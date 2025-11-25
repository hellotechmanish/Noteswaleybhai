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
    id: "",
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
    setForm({ id: "", title: "", description: "", dueDate: "", category: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditId(todo._id);
    const dateValue = todo?.dueDate
      ? new Date(todo.dueDate).toISOString().slice(0, 10)
      : "";
    setForm({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      dueDate: dateValue,
      category: todo.category,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setForm({ id: "", title: "", description: "", dueDate: "", category: "" });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900  p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Todo List
          </h1>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add Todo
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white/80 dark:bg-gray-900 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 border-2 rounded-lg shadow-xl w-full max-w-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {editId ? "Edit Todo" : "Add New Todo"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                    className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    rows={3}
                    className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    onClick={(e: any) => e.target.showPicker?.()}
                    className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Non-Urgent">Non-Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
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
        )}

        {/* Todo List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 border-2 rounded-lg shadow">
            <p className="text-gray-500 text-lg">No todos found.</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Add Todo" to create your first task!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo:any) => {
              const realDate = todo.dueDate || todo.date;

              return (
                <div
                  key={todo._id}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {todo.title}
                      </h3>

                      <p className="text-gray-700 dark:text-gray-200 mt-1 text-sm">
                        {todo.description}
                      </p>

                      <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                          <span className="font-medium">Due:</span>

                          <span>
                            {realDate
                              ? new Date(realDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "No date"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            todo.category === "Urgent"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {todo.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(todo)}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition text-sm"
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
