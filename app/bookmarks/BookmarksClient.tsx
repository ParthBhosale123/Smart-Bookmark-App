"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";
import { Bookmark } from "@/types/bookmark";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import BookmarksGrid from "./components/BookmarksGrid";
import Pagination from "./components/Pagination";

function BookmarksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [highlightId, setHighlightId] = useState<string | null>(null);

  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookmarks, setTotalBookmarks] = useState(0);

  const pageSize = 9;
  const totalPages = Math.ceil(totalBookmarks / pageSize);

  // Check session once
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;

      if (!currentUser) {
        router.push("/");
        return;
      }

      setUser(currentUser);
    };

    checkSession();
  }, [router]);

  // Fetch bookmarks + realtime
  useEffect(() => {
    if (!user?.id) return;

    const fetchBookmarks = async () => {
      setLoading(true);

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("bookmarks")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        toast.error("Failed to fetch bookmarks");
        console.error("Fetch Error:", error);
      } else {
        setBookmarks(data || []);
        setTotalBookmarks(count || 0);
      }

      setLoading(false);
    };

    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentPage]);

  // Highlight new bookmark
  useEffect(() => {
    const newId = searchParams.get("new");

    if (newId) {
      setHighlightId(newId);

      const timer = setTimeout(() => {
        setHighlightId(null);
        router.replace("/bookmarks");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  // Delete Modal Open
  const openDeleteModal = (bookmark: Bookmark) => {
    setDeleteId(bookmark.id);
    setDeleteTitle(bookmark.title);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setDeleteTitle("");
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete bookmark");
      console.error("Delete Error:", error);
    } else {
      toast.success("Bookmark deleted successfully");

      setBookmarks((prev) => prev.filter((b) => b.id !== deleteId));
      setTotalBookmarks((prev) => prev - 1);

      if (bookmarks.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }

    setDeleteId(null);
    setDeleteTitle("");
  };

  // Edit Start
  const startEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  // Save Edit
  const saveEdit = async (id: string) => {
    if (!editTitle.trim() || !editUrl.trim()) {
      toast.error("Title and URL cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("bookmarks")
      .update({ title: editTitle.trim(), url: editUrl.trim() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update bookmark");
      console.error("Update Error:", error);
      return;
    }

    toast.success("Bookmark updated successfully");

    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, title: editTitle, url: editUrl } : b,
      ),
    );

    cancelEdit();
  };

  // Date Format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Favicon
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <DashboardLayout onLogout={logout}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Bookmarks</h1>
            <p className="text-gray-600 mt-1">
              {totalBookmarks} bookmark{totalBookmarks !== 1 ? "s" : ""} saved
            </p>
          </div>

          <button
            onClick={() => router.push("/add-bookmark")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 justify-center"
          >
            + Add Bookmark
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Grid */}
        {!loading && bookmarks.length > 0 && (
          <>
            <BookmarksGrid
              bookmarks={bookmarks}
              editingId={editingId}
              editTitle={editTitle}
              editUrl={editUrl}
              setEditTitle={setEditTitle}
              setEditUrl={setEditUrl}
              startEdit={startEdit}
              cancelEdit={cancelEdit}
              saveEdit={saveEdit}
              openDeleteModal={openDeleteModal}
              formatDate={formatDate}
              getFaviconUrl={getFaviconUrl}
              highlightId={highlightId}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage((prev) => prev - 1)}
              onNext={() => setCurrentPage((prev) => prev + 1)}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && bookmarks.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start organizing your favorite links
            </p>
            <button
              onClick={() => router.push("/add-bookmark")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Add Your First Bookmark
            </button>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title={deleteTitle}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}

export default function BookmarksClient() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <BookmarksContent />
    </Suspense>
  );
}
