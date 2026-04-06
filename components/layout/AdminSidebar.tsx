"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/gigs", label: "Gig Postings" },
  { href: "/admin/profiles", label: "Musician Profiles" },
  { href: "/admin/applications", label: "Applications" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile horizontal nav */}
      <div className="overflow-x-auto border-b border-gray-200 bg-amber-50/30 px-4 py-2 lg:hidden">
        <div className="flex gap-2">
          {adminNavItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-amber-200 text-amber-900"
                    : "bg-white text-gray-700 hover:bg-amber-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/dashboard"
            className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-amber-50/30 lg:block">
        <div className="p-4">
          <div className="rounded-md bg-amber-100 px-3 py-1.5 text-center text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Admin Panel
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-4 pb-4">
          {adminNavItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-100 text-amber-900"
                    : "text-gray-700 hover:bg-amber-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <hr className="my-2 border-gray-200" />
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            Back to Dashboard
          </Link>
        </nav>
      </aside>
    </>
  );
}
