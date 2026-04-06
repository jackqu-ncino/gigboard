import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Musician Profile - GigBoard",
};

export default async function MusicianDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase
    .from("users")
    .select("id, full_name, email, avatar_url")
    .eq("id", id)
    .single();

  if (!userData) return notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", id)
    .single();

  if (!profile || !profile.is_published) return notFound();

  const [{ data: instruments }, { data: genres }] = await Promise.all([
    supabase
      .from("profile_instruments")
      .select("instrument_id, instruments(name)")
      .eq("profile_id", profile.id),
    supabase
      .from("profile_genres")
      .select("genre_id, genres(name)")
      .eq("profile_id", profile.id),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {userData.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userData.full_name}
            </h1>
            <p className="capitalize text-gray-500">{profile.experience}</p>
            {(profile.city || profile.state) && (
              <p className="text-sm text-gray-500">
                {[profile.city, profile.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>

        {profile.bio && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500">About</h2>
            <p className="mt-1 text-gray-900 whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Availability</h2>
            <p className="mt-1 text-gray-900">
              {profile.availability || "Not specified"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Rate</h2>
            <p className="mt-1 text-gray-900">
              {profile.rate_min || profile.rate_max
                ? `$${profile.rate_min || "?"} - $${profile.rate_max || "?"} / hr`
                : "Negotiable"}
            </p>
          </div>
        </div>

        {instruments && instruments.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500">Instruments</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {instruments.map((pi: any) => (
                <span
                  key={pi.instrument_id}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {pi.instruments?.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {genres && genres.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500">Genres</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {genres.map((pg: any) => (
                <span
                  key={pg.genre_id}
                  className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700"
                >
                  {pg.genres?.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
