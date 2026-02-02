"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/dashboard" },
  { name: "Profile", href: "/dashboard/profile" },
  { name: "Gallery", href: "/dashboard/gallery" },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
     <Link href="/dashboard" className="font-black text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x"
>
         UNILAG M.P.A
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-medium",
                pathname === item.href
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {item.name}
            </Link>
          ))}
          <LogoutButton />
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-gray-700"
            >
              {item.name}
            </Link>
          ))}
          <LogoutButton />
        </div>
      )}
    </nav>
  );
}
