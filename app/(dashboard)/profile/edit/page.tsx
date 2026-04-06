import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile - GigBoard",
};

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  let selectedInstrumentIds: string[] = [];
  let selectedGenreIds: string[] = [];

  if (profile) {
    const [{ data: instruments }, { data: genres }] = await Promise.all([
      supabase
        .from("profile_instruments")
        .select("instrument_id")
        .eq("profile_id", profile.id),
      supabase
        .from("profile_genres")
        .select("genre_id")
        .eq("profile_id", profile.id),
    ]);
    selectedInstrumentIds =
      instruments?.map((i) => i.instrument_id) || [];
    selectedGenreIds = genres?.map((g) => g.genre_id) || [];
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">
        {profile ? "Edit Profile" : "Create Profile"}
      </h1>
      <p className="mt-1 text-gray-600">
        {profile
          ? "Update your musician profile information."
          : "Set up your musician profile to get discovered."}
      </p>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <ProfileForm
          profile={profile}
          selectedInstrumentIds={selectedInstrumentIds}
          selectedGenreIds={selectedGenreIds}
        />
      </div>
    </div>
  );
}
