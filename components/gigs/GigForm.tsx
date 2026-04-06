"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Gig, Instrument, Genre } from "@/types";

interface GigFormProps {
  gig?: Gig | null;
  selectedInstrumentIds?: string[];
  selectedGenreIds?: string[];
}

export function GigForm({
  gig,
  selectedInstrumentIds = [],
  selectedGenreIds = [],
}: GigFormProps) {
  const [title, setTitle] = useState(gig?.title || "");
  const [description, setDescription] = useState(gig?.description || "");
  const [venue, setVenue] = useState(gig?.venue || "");
  const [city, setCity] = useState(gig?.city || "");
  const [state, setState] = useState(gig?.state || "");
  const [gigDate, setGigDate] = useState(gig?.gig_date || "");
  const [startTime, setStartTime] = useState(gig?.start_time || "");
  const [endTime, setEndTime] = useState(gig?.end_time || "");
  const [budget, setBudget] = useState(gig?.budget?.toString() || "");
  const [musiciansNeeded, setMusiciansNeeded] = useState(
    gig?.musicians_needed?.toString() || "1"
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

    const gigData = {
      posted_by: user.id,
      title,
      description: description || null,
      venue: venue || null,
      city: city || null,
      state: state || null,
      gig_date: gigDate,
      start_time: startTime || null,
      end_time: endTime || null,
      budget: budget ? parseFloat(budget) : null,
      musicians_needed: parseInt(musiciansNeeded) || 1,
    };

    let gigId = gig?.id;

    if (gig) {
      const { error: updateError } = await supabase
        .from("gigs")
        .update(gigData)
        .eq("id", gig.id);
      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("gigs")
        .insert(gigData)
        .select("id")
        .single();
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      gigId = data.id;
    }

    // Update instruments
    await supabase
      .from("gig_instruments")
      .delete()
      .eq("gig_id", gigId!);
    if (instrumentIds.length > 0) {
      await supabase.from("gig_instruments").insert(
        instrumentIds.map((instrument_id) => ({
          gig_id: gigId!,
          instrument_id,
        }))
      );
    }

    // Update genres
    await supabase.from("gig_genres").delete().eq("gig_id", gigId!);
    if (genreIds.length > 0) {
      await supabase.from("gig_genres").insert(
        genreIds.map((genre_id) => ({
          gig_id: gigId!,
          genre_id,
        }))
      );
    }

    setLoading(false);
    router.push(`/gigs/${gigId}`);
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
        <label className="block text-sm font-medium text-gray-700">
          Gig Title *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Bass player needed for birthday party"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the gig, what you're looking for, any special requirements..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Venue
          </label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Venue name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date *
          </label>
          <input
            type="date"
            required
            value={gigDate}
            onChange={(e) => setGigDate(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Budget ($)
          </label>
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., 500"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Musicians Needed
          </label>
          <input
            type="number"
            min="1"
            value={musiciansNeeded}
            onChange={(e) => setMusiciansNeeded(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Instruments needed */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instruments / Roles Needed
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
          Music Style / Genre
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

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-6 py-2 text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Saving..." : gig ? "Update Gig" : "Post Gig"}
      </button>
    </form>
  );
}
