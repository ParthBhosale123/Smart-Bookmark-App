"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

export default function AddBookmarkPage() {
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ title: "", url: "" });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;

      if (!currentUser) {
        window.location.href = "/";
        return;
      }

      setUser(currentUser);
    };

    checkSession();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const validateForm = () => {
    const newErrors = { title: "", url: "" };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!url.trim()) {
      newErrors.url = "URL is required";
      isValid = false;
    } else if (!/^https?:\/\/.+/.test(url)) {
      newErrors.url =
        "Please enter a valid URL (must start with http:// or https://)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const addBookmark = async () => {
    setErrors({ title: "", url: "" });

    if (!validateForm()) return;

    if (!user?.id) {
      toast.error("User session not found. Please login again.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("bookmarks").insert([
      {
        title: title.trim(),
        url: url.trim(),
        user_id: user.id,
      },
    ]);

    if (error) {
      console.log("Supabase Insert Error:", error);

      // Duplicate bookmark error (unique constraint violation)
      if (error.code === "23505") {
        toast.error("This bookmark already exists!");
      } else {
        toast.error("Failed to add bookmark!");
      }
    } else {
      toast.success("Bookmark added successfully!");
      setTitle("");
      setUrl("");
      setErrors({ title: "", url: "" });
    }

    setLoading(false);
  };

  return (
    <DashboardLayout onLogout={logout}>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Bookmark</h1>

      <div className="bg-white p-6 rounded-2xl shadow border max-w-xl">
        <label className="block font-semibold text-gray-700 mb-2">
          Bookmark Title
        </label>

        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: "" });
          }}
          placeholder="e.g. Google Drive"
          className={`w-full p-3 border rounded-xl mb-1 focus:outline-none focus:ring-2 text-gray-800 ${
            errors.title
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-blue-500"
          }`}
        />

        {errors.title && (
          <p className="text-red-600 text-sm mb-4">{errors.title}</p>
        )}

        <label className="block font-semibold text-gray-700 mb-2 mt-4">
          Bookmark URL
        </label>

        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (errors.url) setErrors({ ...errors, url: "" });
          }}
          placeholder="https://example.com"
          className={`w-full p-3 border rounded-xl mb-1 focus:outline-none focus:ring-2 text-gray-800 ${
            errors.url
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-blue-500"
          }`}
        />

        {errors.url && (
          <p className="text-red-600 text-sm mb-4">{errors.url}</p>
        )}

        <button
          onClick={addBookmark}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 mt-4"
        >
          {loading ? "Adding..." : "Add Bookmark"}
        </button>
      </div>
    </DashboardLayout>
  );
}
