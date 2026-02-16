"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "My Bookmarks", path: "/bookmarks" },
    { name: "Add Bookmark", path: "/add-bookmark" },
  ];

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-screen w-56 bg-white shadow-lg border-r transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        <div className="p-5 border-b">
          <h1 className="text-xl font-bold text-gray-800">Smart Bookmark</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your links</p>
        </div>

        <nav className="p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block px-4 py-3 rounded-lg font-medium transition 
              ${
                pathname === link.path
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-4 flex justify-between items-center sticky top-0 z-30">
          <button
            className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => setIsOpen(true)}
          >
            Menu
          </button>

          <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
            Dashboard
          </h2>

          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar p-6 max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
