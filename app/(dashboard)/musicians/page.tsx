import { createClient } from "@/lib/supabase/server";
import { ProfileCard } from "@/components/profile/ProfileCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Musicians - GigBoard",
};

export default async function BrowseMusiciansPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "*, users!profiles_user_id_fkey(id, full_name, avatar_url, email, is_premium, premium_until), profile_instruments(instrument_id, instruments(id, name, slug, created_at)), profile_genres(genre_id, genres(id, name, slug, created_at))"
    )
    .eq("is_published", true)
    .order("updated_at", { ascending: false })
    .limit(50);

  // Sort premium profiles first
  let filteredProfiles = (profiles || []).sort((a: any, b: any) => {
    const aPremium = a.users?.is_premium && (!a.users.premium_until || new Date(a.users.premium_until) > new Date());
    const bPremium = b.users?.is_premium && (!b.users.premium_until || new Date(b.users.premium_until) > new Date());
    if (aPremium && !bPremium) return -1;
    if (!aPremium && bPremium) return 1;
    return 0;
  });

  // Filter by instrument
  if (params.instrument) {
    filteredProfiles = filteredProfiles.filter((p: any) =>
      p.profile_instruments?.some(
        (pi: any) => pi.instrument_id === params.instrument
      )
    );
  }

  // Filter by genre
  if (params.genre) {
    filteredProfiles = filteredProfiles.filter((p: any) =>
      p.profile_genres?.some((pg: any) => pg.genre_id === params.genre)
    );
  }

  // Filter by city
  if (params.city) {
    filteredProfiles = filteredProfiles.filter((p: any) =>
      p.city?.toLowerCase().includes(params.city!.toLowerCase())
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Find Musicians</h1>
      <p className="mt-1 text-gray-600">
        Browse musician profiles to find the right fit for your gig.
      </p>

      <div className="mt-6">
        {filteredProfiles.length > 0 ? (
          <div className="space-y-3">
            {filteredProfiles.map((profile: any) => (
              <ProfileCard
                key={profile.id}
                id={profile.id}
                userId={profile.user_id}
                fullName={profile.users?.full_name || "Unknown"}
                avatarUrl={profile.users?.avatar_url}
                bio={profile.bio}
                experience={profile.experience}
                city={profile.city}
                state={profile.state}
                rateMin={profile.rate_min}
                rateMax={profile.rate_max}
                instruments={
                  profile.profile_instruments?.map(
                    (pi: any) => pi.instruments
                  ) || []
                }
                genres={
                  profile.profile_genres?.map((pg: any) => pg.genres) || []
                }
                isPremium={
                  profile.users?.is_premium &&
                  (!profile.users.premium_until ||
                    new Date(profile.users.premium_until) > new Date())
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No musician profiles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
