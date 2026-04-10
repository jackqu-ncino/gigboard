"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gigs", label: "Browse Gigs" },
  { href: "/musicians", label: "Find Musicians" },
  { href: "/gigs/new", label: "Post a Gig" },
  { href: "/profile", label: "My Profile" },
  { href: "/applications", label: "Applications" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-primary">
          {APP_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 lg:flex">
          {loading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href="/gigs"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Browse Gigs
              </Link>
              <Link
                href="/musicians"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Musicians
              </Link>
              {user.is_admin && (
                <Link
                  href="/admin"
                  className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                >
                  Admin
                </Link>
              )}
              <a
                href="/auth/signout"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </a>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-primary px-4 py-2 text-sm text-white font-medium hover:bg-primary-dark"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile hamburger button */}
        {!loading && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col items-center justify-center gap-1.5 p-2 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                "block h-0.5 w-6 bg-gray-700 transition-all duration-200",
                mobileOpen && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-gray-700 transition-opacity duration-200",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-gray-700 transition-all duration-200",
                mobileOpen && "-translate-y-2 -rotate-45"
              )}
            />
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-gray-200 bg-white px-4 pb-4 pt-2 lg:hidden">
          {user ? (
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {user.is_admin && (
                <>
                  <hr className="my-1 border-gray-200" />
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname.startsWith("/admin")
                        ? "bg-amber-100 text-amber-800"
                        : "text-amber-600 hover:bg-amber-50"
                    )}
                  >
                    Admin Panel
                  </Link>
                </>
              )}
              <hr className="my-1 border-gray-200" />
              <a
                href="/auth/signout"
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                Sign Out
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="rounded-md bg-primary px-4 py-2.5 text-center text-sm text-white font-medium hover:bg-primary-dark"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
