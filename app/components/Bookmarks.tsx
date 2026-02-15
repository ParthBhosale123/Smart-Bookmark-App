"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function Bookmarks({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setBookmarks(data);
  };

  // Add bookmark
  const addBookmark = async () => {
    if (!title || !url) return alert("Please enter title and URL");

    const { error } = await supabase.from("bookmarks").insert([
      {
        user_id: userId,
        title,
        url,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      setTitle("");
      setUrl("");
    }
  };

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) alert(error.message);
  };

  // Realtime subscription
  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => {
          fetchBookmarks();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mt-6 w-full max-w-md bg-gray-900 p-6 rounded-xl shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">Your Bookmarks</h2>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <button
          onClick={addBookmark}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
        >
          Add Bookmark
        </button>
      </div>

      <ul className="space-y-3">
        {bookmarks.map((bm) => (
          <li
            key={bm.id}
            className="flex justify-between items-center bg-gray-800 p-3 rounded"
          >
            <div>
              <a
                href={bm.url}
                target="_blank"
                className="font-semibold text-blue-400 hover:underline"
              >
                {bm.title}
              </a>
              <p className="text-sm text-gray-400">{bm.url}</p>
            </div>

            <button
              onClick={() => deleteBookmark(bm.id)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
