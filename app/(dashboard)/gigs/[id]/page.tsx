import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { ApplyButton } from "@/components/applications/ApplyButton";
import { ApplicantsList } from "@/components/applications/ApplicantsList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gig Details - GigBoard",
};

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: gig } = await supabase
    .from("gigs")
    .select("*")
    .eq("id", id)
    .single();

  if (!gig) return notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: gigInstruments },
    { data: gigGenres },
    { data: poster },
  ] = await Promise.all([
    supabase
      .from("gig_instruments")
      .select("instrument_id, quantity, instruments(name)")
      .eq("gig_id", id),
    supabase
      .from("gig_genres")
      .select("genre_id, genres(name)")
      .eq("gig_id", id),
    supabase
      .from("users")
      .select("id, full_name, avatar_url")
      .eq("id", gig.posted_by)
      .single(),
  ]);

  // Only fetch application data for logged-in users
  let applications: any[] | null = null;
  let myApplication: any = null;

  if (user) {
    const [{ data: apps }, { data: myApp }] = await Promise.all([
      supabase
        .from("applications")
        .select("id, musician_id, message, status, created_at, users!applications_musician_id_fkey(full_name, avatar_url)")
        .eq("gig_id", id),
      supabase
        .from("applications")
        .select("id, status")
        .eq("gig_id", id)
        .eq("musician_id", user.id)
        .maybeSingle(),
    ]);
    applications = apps;
    myApplication = myApp;
  }

  const isOwner = user?.id === gig.posted_by;

  const statusColors: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    filled: "bg-blue-100 text-blue-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{gig.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Posted by {poster?.full_name || "Unknown"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                statusColors[gig.status]
              }`}
            >
              {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
            </span>
            {isOwner && (
              <Link
                href={`/gigs/${id}/edit`}
                className="text-sm text-primary hover:text-primary-dark"
              >
                Edit Gig
              </Link>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p className="mt-1 text-gray-900">{formatDate(gig.gig_date)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Time</h3>
            <p className="mt-1 text-gray-900">
              {gig.start_time && gig.end_time
                ? `${formatTime(gig.start_time)} - ${formatTime(gig.end_time)}`
                : gig.start_time
                ? `Starts at ${formatTime(gig.start_time)}`
                : "TBD"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1 text-gray-900">
              {gig.venue && <span className="font-medium">{gig.venue}</span>}
              {gig.venue && (gig.city || gig.state) && <br />}
              {[gig.city, gig.state].filter(Boolean).join(", ") || "TBD"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Budget</h3>
            <p className="mt-1 text-lg font-semibold text-green-600">
              {gig.budget ? formatCurrency(gig.budget) : "Negotiable"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Musicians Needed
            </h3>
            <p className="mt-1 text-gray-900">{gig.musicians_needed}</p>
          </div>
        </div>

        {gig.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-gray-900 whitespace-pre-line">
              {gig.description}
            </p>
          </div>
        )}

        {/* Instruments */}
        {gigInstruments && gigInstruments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">
              Instruments Needed
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {gigInstruments.map((gi: any) => (
                <span
                  key={gi.instrument_id}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {gi.instruments?.name}
                  {gi.quantity > 1 && ` (x${gi.quantity})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Genres */}
        {gigGenres && gigGenres.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">Genre / Style</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {gigGenres.map((gg: any) => (
                <span
                  key={gg.genre_id}
                  className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700"
                >
                  {gg.genres?.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apply / Status section */}
        {!isOwner && gig.status === "open" && (
          <div className="mt-8 border-t pt-6">
            {!user ? (
              <div className="text-center">
                <p className="text-gray-600">
                  Interested in this gig?
                </p>
                <Link
                  href={`/signup`}
                  className="mt-3 inline-block w-full rounded-md bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Sign Up to Apply
                </Link>
                <p className="mt-2 text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href={`/login?redirect=/gigs/${id}`} className="text-primary hover:text-primary-dark font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            ) : myApplication ? (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  You&apos;ve already applied to this gig.
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    myApplication.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : myApplication.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {myApplication.status.charAt(0).toUpperCase() +
                    myApplication.status.slice(1)}
                </span>
              </div>
            ) : (
              <ApplyButton gigId={id} />
            )}
          </div>
        )}

        {/* Applicants (for gig owner) */}
        {isOwner && applications && applications.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Applicants ({applications.length})
            </h3>
            <ApplicantsList applications={applications as any} />
          </div>
        )}
      </div>
    </div>
  );
}
