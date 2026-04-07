import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UpgradeButton } from "@/components/upgrade/UpgradeButton";
import { PRICING } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - GigBoard",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Your Musician Profile
        </h1>
        <p className="mt-2 text-gray-600">
          Set up your profile to start applying for gigs and get discovered by
          gig posters.
        </p>
        <Link
          href="/profile/edit"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-white font-medium hover:bg-primary-dark"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  const [{ data: profileInstruments }, { data: profileGenres }] =
    await Promise.all([
      supabase
        .from("profile_instruments")
        .select("instrument_id, instruments(name)")
        .eq("profile_id", profile.id),
      supabase
        .from("profile_genres")
        .select("genre_id, genres(name)")
        .eq("profile_id", profile.id),
    ]);

  const { data: userData } = await supabase
    .from("users")
    .select("full_name, email, avatar_url, is_premium, premium_until")
    .eq("id", user!.id)
    .single();

  const isPremiumActive =
    userData?.is_premium &&
    (!userData.premium_until ||
      new Date(userData.premium_until) > new Date());

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Link
          href="/profile/edit"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Edit Profile
        </Link>
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {userData?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {userData?.full_name}
            </h2>
            <p className="text-sm text-gray-500">{userData?.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  profile.is_published
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {profile.is_published ? "Published" : "Hidden"}
              </span>
              {isPremiumActive && (
                <span className="inline-block rounded-full bg-purple-200 px-2 py-0.5 text-xs font-bold text-purple-800">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-4">
          {profile.bio && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
              <p className="mt-1 text-gray-900">{profile.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Experience</h3>
              <p className="mt-1 capitalize text-gray-900">
                {profile.experience}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-gray-900">
                {[profile.city, profile.state].filter(Boolean).join(", ") ||
                  "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Availability
              </h3>
              <p className="mt-1 text-gray-900">
                {profile.availability || "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rate</h3>
              <p className="mt-1 text-gray-900">
                {profile.rate_min || profile.rate_max
                  ? `$${profile.rate_min || "?"} - $${
                      profile.rate_max || "?"
                    } / hr`
                  : "Not set"}
              </p>
            </div>
          </div>

          {/* Instruments */}
          {profileInstruments && profileInstruments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Instruments</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {profileInstruments.map((pi: any) => (
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

          {/* Genres */}
          {profileGenres && profileGenres.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Genres</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {profileGenres.map((pg: any) => (
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

      {/* Premium upgrade CTA */}
      {!isPremiumActive && (
        <div className="mt-6 rounded-lg bg-purple-50 border border-purple-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-purple-900">
            Go Premium
          </h3>
          <p className="mt-1 text-sm text-purple-700">
            Stand out from the crowd with a Premium profile. Get a verified badge, priority placement in musician search results, and a highlighted profile card.
          </p>
          <div className="mt-4">
            <UpgradeButton
              type="premium_profile"
              label={`Upgrade for ${PRICING.PREMIUM_PROFILE.label}`}
              description={PRICING.PREMIUM_PROFILE.description}
              className="bg-purple-600 text-white hover:bg-purple-700"
            />
          </div>
        </div>
      )}

      {isPremiumActive && userData?.premium_until && (
        <div className="mt-6 rounded-lg bg-purple-50 border border-purple-200 p-4 shadow-sm">
          <p className="text-sm text-purple-700">
            Your Premium profile is active until{" "}
            <strong>
              {new Date(userData.premium_until).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
