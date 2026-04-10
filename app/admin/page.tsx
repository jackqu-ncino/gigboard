import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - GigBoard",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalProfiles },
    { count: publishedProfiles },
    { count: totalGigs },
    { count: openGigs },
    { count: filledGigs },
    { count: totalApplications },
    { count: pendingApplications },
    { count: featuredGigs },
    { count: premiumUsers },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("gigs").select("*", { count: "exact", head: true }),
    supabase
      .from("gigs")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("gigs")
      .select("*", { count: "exact", head: true })
      .eq("status", "filled"),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("gigs")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_premium", true),
  ]);

  // Recent activity
  const { data: recentUsers } = await supabase
    .from("users")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentGigs } = await supabase
    .from("gigs")
    .select("id, title, status, created_at, users!gigs_posted_by_fkey(full_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers || 0,
      href: "/admin/users",
      color: "text-blue-600",
    },
    {
      label: "Musician Profiles",
      value: `${publishedProfiles || 0} / ${totalProfiles || 0}`,
      sub: "published / total",
      href: "/admin/profiles",
      color: "text-purple-600",
    },
    {
      label: "Open Gigs",
      value: openGigs || 0,
      sub: `${totalGigs || 0} total, ${filledGigs || 0} filled`,
      href: "/admin/gigs",
      color: "text-green-600",
    },
    {
      label: "Pending Applications",
      value: pendingApplications || 0,
      sub: `${totalApplications || 0} total`,
      href: "/admin/applications",
      color: "text-amber-600",
    },
    {
      label: "Featured Gigs",
      value: featuredGigs || 0,
      sub: "paid featured listings",
      href: "/admin/gigs",
      color: "text-amber-500",
    },
    {
      label: "Premium Users",
      value: premiumUsers || 0,
      sub: "paid premium profiles",
      href: "/admin/profiles",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-1 text-gray-600">
        Overview of your GigBoard platform.
      </p>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            {stat.sub && (
              <p className="mt-0.5 text-xs text-gray-400">{stat.sub}</p>
            )}
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Signups</h2>
            <Link
              href="/admin/users"
              className="text-xs text-primary hover:text-primary-dark"
            >
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {recentUsers?.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{u.full_name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 capitalize">
                  {u.role}
                </span>
              </div>
            ))}
            {!recentUsers?.length && (
              <p className="text-sm text-gray-400">No users yet</p>
            )}
          </div>
        </div>

        {/* Recent Gigs */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Gigs</h2>
            <Link
              href="/admin/gigs"
              className="text-xs text-primary hover:text-primary-dark"
            >
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {recentGigs?.map((g: any) => (
              <div
                key={g.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{g.title}</p>
                  <p className="text-xs text-gray-500">
                    by {g.users?.full_name}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    g.status === "open"
                      ? "bg-green-100 text-green-700"
                      : g.status === "filled"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {g.status}
                </span>
              </div>
            ))}
            {!recentGigs?.length && (
              <p className="text-sm text-gray-400">No gigs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
