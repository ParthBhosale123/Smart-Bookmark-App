"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "My Bookmarks", path: "/bookmarks" },
    { name: "Add Bookmark", path: "/add-bookmark" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">Smart Bookmark</h1>

      <nav className="space-y-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-2 rounded-lg ${
              pathname === item.path
                ? "bg-green-500 text-black font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
