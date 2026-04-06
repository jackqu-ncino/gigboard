"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { EXPERIENCE_LEVELS } from "@/lib/constants";
import type {
  Profile,
  Instrument,
  Genre,
  ExperienceLevel,
} from "@/types";

interface ProfileFormProps {
  profile?: Profile | null;
  selectedInstrumentIds?: string[];
  selectedGenreIds?: string[];
}

export function ProfileForm({
  profile,
  selectedInstrumentIds = [],
  selectedGenreIds = [],
}: ProfileFormProps) {
  const [bio, setBio] = useState(profile?.bio || "");
  const [experience, setExperience] = useState<ExperienceLevel>(
    profile?.experience || "intermediate"
  );
  const [city, setCity] = useState(profile?.city || "");
  const [state, setState] = useState(profile?.state || "");
  const [availability, setAvailability] = useState(
    profile?.availability || ""
  );
  const [rateMin, setRateMin] = useState(profile?.rate_min?.toString() || "");
  const [rateMax, setRateMax] = useState(profile?.rate_max?.toString() || "");
  const [isPublished, setIsPublished] = useState(
    profile?.is_published || false
  );
  const [instrumentIds, setInstrumentIds] =
    useState<string[]>(selectedInstrumentIds);
  const [genreIds, setGenreIds] = useState<string[]>(selectedGenreIds);

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadReferenceData() {
      const [{ data: inst }, { data: gen }] = await Promise.all([
        supabase.from("instruments").select("*").order("name"),
        supabase.from("genres").select("*").order("name"),
      ]);
      if (inst) setInstruments(inst);
      if (gen) setGenres(gen);
    }
    loadReferenceData();
  }, [supabase]);

  const toggleInstrument = (id: string) => {
    setInstrumentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleGenre = (id: string) => {
    setGenreIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const profileData = {
      user_id: user.id,
      bio: bio || null,
      experience,
      city: city || null,
      state: state || null,
      availability: availability || null,
      rate_min: rateMin ? parseFloat(rateMin) : null,
      rate_max: rateMax ? parseFloat(rateMax) : null,
      is_published: isPublished,
    };

    let profileId = profile?.id;

    if (profile) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", profile.id);
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("profiles")
        .insert(profileData)
        .select("id")
        .single();
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      profileId = data.id;
    }

    // Update instruments
    await supabase
      .from("profile_instruments")
      .delete()
      .eq("profile_id", profileId!);
    if (instrumentIds.length > 0) {
      await supabase.from("profile_instruments").insert(
        instrumentIds.map((instrument_id) => ({
          profile_id: profileId!,
          instrument_id,
        }))
      );
    }

    // Update genres
    await supabase
      .from("profile_genres")
      .delete()
      .eq("profile_id", profileId!);
    if (genreIds.length > 0) {
      await supabase.from("profile_genres").insert(
        genreIds.map((genre_id) => ({
          profile_id: profileId!,
          genre_id,
        }))
      );
    }

    setLoading(false);
    router.push("/profile");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Tell us about yourself as a musician..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <select
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value as ExperienceLevel)
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="e.g., Weekends, Evenings, Flexible"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Min Rate ($/hr)
          </label>
          <input
            type="number"
            min="0"
            value={rateMin}
            onChange={(e) => setRateMin(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Rate ($/hr)
          </label>
          <input
            type="number"
            min="0"
            value={rateMax}
            onChange={(e) => setRateMax(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Instruments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instruments / Skills
        </label>
        <div className="flex flex-wrap gap-2">
          {instruments.map((inst) => (
            <button
              key={inst.id}
              type="button"
              onClick={() => toggleInstrument(inst.id)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                instrumentIds.includes(inst.id)
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {inst.name}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genres
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggleGenre(genre.id)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                genreIds.includes(genre.id)
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Publish toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full" />
        </label>
        <span className="text-sm text-gray-700">
          Make my profile visible to gig posters
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-6 py-2 text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : profile
          ? "Update Profile"
          : "Create Profile"}
      </button>
    </form>
  );
}
