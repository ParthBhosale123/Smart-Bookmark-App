"use client";

import { Bookmark } from "@/types/bookmark";
import BookmarkCard from "./BookmarkCard";

export default function BookmarksGrid({
  bookmarks,
  editingId,
  editTitle,
  editUrl,
  setEditTitle,
  setEditUrl,
  startEdit,
  cancelEdit,
  saveEdit,
  openDeleteModal,
  formatDate,
  getFaviconUrl,
  highlightId,
}: {
  bookmarks: Bookmark[];
  editingId: string | null;
  editTitle: string;
  editUrl: string;
  setEditTitle: (val: string) => void;
  setEditUrl: (val: string) => void;
  startEdit: (bookmark: Bookmark) => void;
  cancelEdit: () => void;
  saveEdit: (id: string) => void;
  openDeleteModal: (bookmark: Bookmark) => void;
  formatDate: (date: string) => string;
  getFaviconUrl: (url: string) => string | null;
  highlightId: string | null;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
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
      ))}
    </div>
  );
}
