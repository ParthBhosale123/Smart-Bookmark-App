"use client";

import { Bookmark } from "@/types/bookmark";

export default function BookmarkCard({
  bookmark,
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
}: {
  bookmark: Bookmark;
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
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
      {editingId === bookmark.id ? (
        <div className="space-y-3">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-semibold"
            placeholder="Title"
          />

          <input
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-sm"
            placeholder="URL"
          />

          <div className="flex gap-2">
            <button
              onClick={() => saveEdit(bookmark.id)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Save
            </button>

            <button
              onClick={cancelEdit}
              className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 mb-3">
            {/* Favicon */}
            <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {getFaviconUrl(bookmark.url) ? (
                <img
                  src={getFaviconUrl(bookmark.url)!}
                  alt="favicon"
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-xl">🔖</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                {bookmark.title}
              </h3>

              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline block truncate"
                title={bookmark.url}
              >
                {bookmark.url.length > 50
                  ? bookmark.url.substring(0, 50) + "..."
                  : bookmark.url}
              </a>

              <p className="text-xs text-gray-500 mt-2">
                Added: {formatDate(bookmark.created_at)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => startEdit(bookmark)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Edit
            </button>

            <button
              onClick={() => openDeleteModal(bookmark)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
