import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - GigBoard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { count: openGigs } = await supabase
    .from("gigs")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  const { count: myGigs } = await supabase
    .from("gigs")
    .select("*", { count: "exact", head: true })
    .eq("posted_by", user!.id);

  const { count: myApplications } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("musician_id", user!.id);

  const { data: recentGigs } = await supabase
    .from("gigs")
    .select("id, title, gig_date, city, state, budget, status")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {userData?.full_name || "there"}!
      </h1>
      <p className="mt-1 text-gray-600">
        Here&apos;s what&apos;s happening on GigBoard.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Open Gigs</p>
          <p className="mt-1 text-3xl font-bold text-primary">{openGigs || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">My Posted Gigs</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{myGigs || 0}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">My Applications</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {myApplications || 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/gigs/new"
          className="rounded-md bg-primary px-4 py-2 text-sm text-white font-medium hover:bg-primary-dark"
        >
          Post a Gig
        </Link>
        <Link
          href="/gigs"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50"
        >
          Browse Gigs
        </Link>
        <Link
          href="/profile"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50"
        >
          My Profile
        </Link>
      </div>

      {/* Recent Gigs */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Open Gigs
        </h2>
        {recentGigs && recentGigs.length > 0 ? (
          <div className="mt-3 space-y-3">
            {recentGigs.map((gig) => (
              <Link
                key={gig.id}
                href={`/gigs/${gig.id}`}
                className="block rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{gig.title}</h3>
                  {gig.budget && (
                    <span className="text-sm font-semibold text-green-600">
                      ${gig.budget}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {gig.gig_date}
                  {gig.city && ` \u2022 ${gig.city}`}
                  {gig.state && `, ${gig.state}`}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-gray-500">
            No open gigs yet. Be the first to{" "}
            <Link href="/gigs/new" className="text-primary hover:text-primary-dark">
              post one
            </Link>
            !
          </p>
        )}
      </div>
    </div>
  );
}
