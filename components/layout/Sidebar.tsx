"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gigs", label: "Browse Gigs" },
  { href: "/musicians", label: "Find Musicians" },
  { href: "/gigs/new", label: "Post a Gig" },
  { href: "/profile", label: "My Profile" },
  { href: "/applications", label: "Applications" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-primary/10 text-primary"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {item.label}
          </Link>
        ))}
        {user?.is_admin && (
          <>
            <hr className="my-2 border-gray-200" />
            <Link
              href="/admin"
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-amber-100 text-amber-800"
                  : "text-amber-600 hover:bg-amber-50"
              )}
            >
              Admin Panel
            </Link>
          </>
        )}
        <hr className="my-2 border-gray-200" />
        <button
          type="button"
          onClick={() => signOut()}
          className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
