export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";

// Sample gigs shown when no real gigs exist yet
const sampleGigs = [
  {
    title: "Bass Player Needed for Wedding Reception",
    date: "Jun 15, 2026",
    city: "Austin",
    state: "TX",
    budget: 400,
    instruments: ["Bass"],
    genre: "Wedding/Event",
  },
  {
    title: "Full Band for Birthday Party",
    date: "Jul 4, 2026",
    city: "Nashville",
    state: "TN",
    budget: 800,
    instruments: ["Guitar", "Bass", "Drums", "Vocals"],
    genre: "Cover Band",
  },
  {
    title: "Jazz Trio for Restaurant Opening",
    date: "Jun 22, 2026",
    city: "Chicago",
    state: "IL",
    budget: 600,
    instruments: ["Saxophone", "Keyboard/Piano", "Bass"],
    genre: "Jazz",
  },
  {
    title: "Drummer Needed for Rock Gig",
    date: "Jun 8, 2026",
    city: "Denver",
    state: "CO",
    budget: 200,
    instruments: ["Drums"],
    genre: "Rock",
  },
  {
    title: "Acoustic Guitarist for Corporate Event",
    date: "Jul 10, 2026",
    city: "San Francisco",
    state: "CA",
    budget: 350,
    instruments: ["Guitar"],
    genre: "Contemporary",
  },
  {
    title: "Country Band for Barn Dance",
    date: "Aug 1, 2026",
    city: "Dallas",
    state: "TX",
    budget: 1000,
    instruments: ["Fiddle", "Guitar", "Bass", "Vocals"],
    genre: "Country",
  },
];

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: openGigCount },
    { count: musicianCount },
    { data: instruments },
  ] = await Promise.all([
    supabase
      .from("gigs")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("instruments").select("id, name, slug").order("name"),
  ]);

  // Fetch open gigs with genres and instruments
  const { data: gigs } = await supabase
    .from("gigs")
    .select(
      "id, title, gig_date, city, state, budget, musicians_needed, status, is_featured, gig_instruments(instrument_id, instruments(name)), gig_genres(genre_id, genres(id, name))"
    )
    .eq("status", "open")
    .order("is_featured", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(50);

  // Group gigs by genre — each gig only appears under its first genre to avoid duplicates
  const gigsByGenre: Record<string, { genreName: string; gigs: any[] }> = {};
  const assignedGigs = new Set<string>();

  for (const gig of gigs || []) {
    const gigGenres = (gig as any).gig_genres || [];
    // Register all genres so they exist (for counting)
    for (const gg of gigGenres) {
      const genreName = gg.genres?.name;
      const genreId = gg.genres?.id;
      if (!genreName || !genreId) continue;
      if (!gigsByGenre[genreId]) {
        gigsByGenre[genreId] = { genreName, gigs: [] };
      }
    }
    // Assign gig to its first genre only
    const firstGenre = gigGenres[0];
    if (firstGenre?.genres?.id && !assignedGigs.has(gig.id)) {
      gigsByGenre[firstGenre.genres.id].gigs.push(gig);
      assignedGigs.add(gig.id);
    }
  }

  // Sort genres by gig count, filter empty, take top 6
  const topGenres = Object.entries(gigsByGenre)
    .filter(([, { gigs }]) => gigs.length > 0)
    .sort(([, a], [, b]) => b.gigs.length - a.gigs.length)
    .slice(0, 6);

  const hasRealGigs = topGenres.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-bold text-primary">
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-4">
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
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-indigo-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Find Musicians.{" "}
              <span className="text-primary">Book Gigs.</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600">
              GigBoard connects musicians with gig opportunities. Post a gig,
              find the perfect musician, and make great music together.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-md bg-primary px-6 py-3 text-base text-white font-medium hover:bg-primary-dark sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                href="/gigs"
                className="w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-base text-gray-700 font-medium hover:bg-gray-50 sm:w-auto"
              >
                Browse All Gigs
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-gray-200 bg-white py-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {openGigCount || 0}
              </p>
              <p className="text-sm text-gray-500">Open Gigs</p>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {musicianCount || 0}
              </p>
              <p className="text-sm text-gray-500">Musicians</p>
            </div>
            <div className="hidden h-8 w-px bg-gray-200 sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {instruments?.length || 0}
              </p>
              <p className="text-sm text-gray-500">Instruments</p>
            </div>
          </div>
        </section>

        {/* Gigs by Category */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {hasRealGigs
                  ? "Open Gigs by Category"
                  : "What Kind of Gigs Get Posted?"}
              </h2>
              <p className="mt-2 text-gray-600">
                {hasRealGigs
                  ? "Browse opportunities across genres and styles"
                  : "Here\u2019s a taste of what you\u2019ll find on GigBoard"}
              </p>
            </div>

            {hasRealGigs ? (
              <div className="mt-10 space-y-10">
                {topGenres.map(([genreId, { genreName, gigs: genreGigs }]) => (
                  <div key={genreId}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {genreName}
                      </h3>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {genreGigs.length} gig
                        {genreGigs.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
                      {genreGigs.slice(0, 6).map((gig: any) => (
                        <Link
                          key={gig.id}
                          href={`/gigs/${gig.id}`}
                          className={`min-w-[280px] max-w-[320px] shrink-0 snap-start rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow ${
                            gig.is_featured
                              ? "bg-amber-50 border-2 border-amber-300 ring-1 ring-amber-200"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          {gig.is_featured && (
                            <span className="mb-2 inline-block rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">
                              Featured
                            </span>
                          )}
                          <h4 className="font-semibold text-gray-900 truncate">
                            {gig.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatDate(gig.gig_date)}
                            {gig.city && ` \u2022 ${gig.city}`}
                            {gig.state && `, ${gig.state}`}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            {gig.budget ? (
                              <span className="text-sm font-semibold text-green-600">
                                {formatCurrency(gig.budget)}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Negotiable
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {gig.musicians_needed} needed
                            </span>
                          </div>
                          {(gig as any).gig_instruments?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {(gig as any).gig_instruments
                                .slice(0, 3)
                                .map((gi: any, i: number) => (
                                  <span
                                    key={i}
                                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                                  >
                                    {gi.instruments?.name}
                                  </span>
                                ))}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link
                    href="/gigs"
                    className="inline-block rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Browse All Gigs
                  </Link>
                </div>
              </div>
            ) : (
              /* Empty state: sample gigs */
              <div className="mt-10">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sampleGigs.map((gig, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4 opacity-80"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          {gig.genre}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-700">
                        {gig.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-400">
                        {gig.date} &bull; {gig.city}, {gig.state}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-600/70">
                          {formatCurrency(gig.budget)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {gig.instruments.map((inst, j) => (
                          <span
                            key={j}
                            className="rounded-full bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary/60"
                          >
                            {inst}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <p className="text-gray-600 font-medium">
                    Be the first to post a gig on GigBoard!
                  </p>
                  <Link
                    href="/signup"
                    className="mt-4 inline-block rounded-md bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark"
                  >
                    Post Your First Gig
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Browse by Instrument */}
        {instruments && instruments.length > 0 && (
          <section className="border-t border-gray-200 bg-gray-50 py-16">
            <div className="mx-auto max-w-5xl px-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Browse by Instrument
                </h2>
                <p className="mt-2 text-gray-600">
                  Find gigs that match your skills
                </p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {instruments.map((inst) => (
                  <Link
                    key={inst.id}
                    href={`/gigs?instrument=${inst.id}`}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-primary hover:text-primary hover:shadow transition-all"
                  >
                    {inst.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              How It Works
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Post a Gig
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Need a musician? Post your gig with the date, budget, and
                  what instruments you need.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Get Matched
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Musicians with matching skills and genres see your gig
                  highlighted. They can apply directly.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Book & Play
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Review applicants, accept the best fit, and make great music
                  together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Musicians / For Gig Posters */}
        <section className="bg-gray-50 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  For Musicians
                </h2>
                <ul className="mt-6 space-y-4 text-gray-600">
                  <li className="flex gap-3">
                    <span className="shrink-0 text-primary font-bold">
                      &bull;
                    </span>
                    Create a profile showcasing your instruments and genres
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-primary font-bold">
                      &bull;
                    </span>
                    Browse open gigs matched to your skills
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-primary font-bold">
                      &bull;
                    </span>
                    Apply with a personal message and get booked
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 inline-block rounded-md bg-primary px-5 py-2 text-sm text-white font-medium hover:bg-primary-dark"
                >
                  Join as a Musician
                </Link>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  For Gig Posters
                </h2>
                <ul className="mt-6 space-y-4 text-gray-600">
                  <li className="flex gap-3">
                    <span className="shrink-0 text-accent font-bold">
                      &bull;
                    </span>
                    Post gigs with your budget, date, and needs
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-accent font-bold">
                      &bull;
                    </span>
                    Browse musician profiles to find the perfect fit
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 text-accent font-bold">
                      &bull;
                    </span>
                    Review applications and accept the best candidates
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="mt-8 inline-block rounded-md border border-gray-300 bg-white px-5 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50"
                >
                  Post a Gig
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to Get Started?
            </h2>
            <p className="mt-3 text-primary-light">
              Join GigBoard today and connect with musicians and gig
              opportunities in your area.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="w-full rounded-md bg-white px-6 py-3 text-base text-primary font-semibold hover:bg-gray-100 sm:w-auto"
              >
                Join as a Musician
              </Link>
              <Link
                href="/signup"
                className="w-full rounded-md border-2 border-white/40 px-6 py-3 text-base text-white font-semibold hover:bg-white/10 sm:w-auto"
              >
                Post a Gig
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
