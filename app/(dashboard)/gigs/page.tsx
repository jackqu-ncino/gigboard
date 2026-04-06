import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { GigCard } from "@/components/gigs/GigCard";
import { GigFilters } from "@/components/gigs/GigFilters";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Gigs - GigBoard",
};

export default async function BrowseGigsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("gigs")
    .select(
      "*, users!gigs_posted_by_fkey(full_name), gig_instruments(instrument_id, instruments(name)), gig_genres(genre_id, genres(name))"
    )
    .eq("status", "open");

  // Apply city filter
  if (params.city) {
    query = query.ilike("city", `%${params.city}%`);
  }

  // Apply budget filter
  if (params.budgetMin) {
    query = query.gte("budget", parseFloat(params.budgetMin));
  }

  // Apply sort
  const sort = params.sort || "newest";
  if (sort === "soonest") {
    query = query.order("gig_date", { ascending: true });
  } else if (sort === "budget") {
    query = query.order("budget", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.limit(50);

  const { data: gigs } = await query;

  // Filter by instrument/genre in JS since it's a many-to-many
  let filteredGigs = gigs || [];
  if (params.instrument) {
    filteredGigs = filteredGigs.filter((gig: any) =>
      gig.gig_instruments?.some(
        (gi: any) => gi.instrument_id === params.instrument
      )
    );
  }
  if (params.genre) {
    filteredGigs = filteredGigs.filter((gig: any) =>
      gig.gig_genres?.some((gg: any) => gg.genre_id === params.genre)
    );
  }

  // Check for matching (if user has a profile)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let userInstrumentIds: string[] = [];
  let userGenreIds: string[] = [];

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      const [{ data: pi }, { data: pg }] = await Promise.all([
        supabase
          .from("profile_instruments")
          .select("instrument_id")
          .eq("profile_id", profile.id),
        supabase
          .from("profile_genres")
          .select("genre_id")
          .eq("profile_id", profile.id),
      ]);
      userInstrumentIds = pi?.map((i) => i.instrument_id) || [];
      userGenreIds = pg?.map((g) => g.genre_id) || [];
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Browse Gigs</h1>
        <Link
          href="/gigs/new"
          className="rounded-md bg-primary px-4 py-2 text-sm text-white font-medium hover:bg-primary-dark"
        >
          Post a Gig
        </Link>
      </div>

      <div className="mt-6 flex gap-6">
        {/* Sidebar filters */}
        <div className="hidden w-64 shrink-0 lg:block">
          <Suspense>
            <GigFilters />
          </Suspense>
        </div>

        {/* Gig list */}
        <div className="flex-1">
          {filteredGigs.length > 0 ? (
            <div className="space-y-3">
              {filteredGigs.map((gig: any) => {
                const gigInstIds =
                  gig.gig_instruments?.map(
                    (gi: any) => gi.instrument_id
                  ) || [];
                const gigGenreIds =
                  gig.gig_genres?.map((gg: any) => gg.genre_id) || [];
                const isMatch =
                  userInstrumentIds.some((id) => gigInstIds.includes(id)) ||
                  userGenreIds.some((id) => gigGenreIds.includes(id));

                return (
                  <GigCard
                    key={gig.id}
                    id={gig.id}
                    title={gig.title}
                    gigDate={gig.gig_date}
                    city={gig.city}
                    state={gig.state}
                    budget={gig.budget}
                    musiciansNeeded={gig.musicians_needed}
                    status={gig.status}
                    instruments={
                      gig.gig_instruments?.map((gi: any) => ({
                        name: gi.instruments?.name,
                      })) || []
                    }
                    genres={
                      gig.gig_genres?.map((gg: any) => ({
                        name: gg.genres?.name,
                      })) || []
                    }
                    postedBy={gig.users?.full_name || "Unknown"}
                    isMatch={isMatch}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No open gigs found matching your filters.
              </p>
              <Link
                href="/gigs"
                className="mt-2 inline-block text-sm text-primary hover:text-primary-dark"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
