import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Applications - GigBoard",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // My applications as a musician
  const { data: myApplications } = await supabase
    .from("applications")
    .select(
      "id, status, message, created_at, gigs(id, title, gig_date, venue, city, status, budget)"
    )
    .eq("musician_id", user!.id)
    .order("created_at", { ascending: false });

  // Applications to my gigs (as a poster)
  const { data: myGigs } = await supabase
    .from("gigs")
    .select("id, title, gig_date")
    .eq("posted_by", user!.id)
    .order("gig_date", { ascending: false });

  const gigIds = myGigs?.map((g) => g.id) || [];
  const { data: incomingApplications } =
    gigIds.length > 0
      ? await supabase
          .from("applications")
          .select(
            "id, status, message, created_at, gig_id, gigs(id, title, gig_date), users!applications_musician_id_fkey(full_name, avatar_url)"
          )
          .in("gig_id", gigIds)
          .order("created_at", { ascending: false })
      : { data: [] };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Applications</h1>

      {/* My Applications */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900">
          My Applications
        </h2>
        {myApplications && myApplications.length > 0 ? (
          <div className="mt-3 space-y-3">
            {myApplications.map((app: any) => (
              <Link
                key={app.id}
                href={`/gigs/${app.gigs?.id}`}
                className="block rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {app.gigs?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {app.gigs?.gig_date && formatDate(app.gigs.gig_date)}
                      {app.gigs?.city && ` \u2022 ${app.gigs.city}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.gigs?.budget && (
                      <span className="text-sm font-semibold text-green-600">
                        ${app.gigs.budget}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColors[app.status]
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() +
                        app.status.slice(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-gray-500">
            You haven&apos;t applied to any gigs yet.{" "}
            <Link
              href="/gigs"
              className="text-primary hover:text-primary-dark"
            >
              Browse gigs
            </Link>
          </p>
        )}
      </div>

      {/* Incoming Applications */}
      {incomingApplications && incomingApplications.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">
            Applicants to My Gigs
          </h2>
          <div className="mt-3 space-y-3">
            {incomingApplications.map((app: any) => (
              <Link
                key={app.id}
                href={`/gigs/${app.gig_id}`}
                className="block rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">
                      {app.gigs?.title}
                    </p>
                    <h3 className="font-medium text-gray-900">
                      {app.users?.full_name}
                    </h3>
                    {app.message && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                        {app.message}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[app.status]
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() +
                      app.status.slice(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
