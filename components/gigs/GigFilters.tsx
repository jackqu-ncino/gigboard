"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Instrument, Genre } from "@/types";

export function GigFilters() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [selectedInstrument, setSelectedInstrument] = useState(
    searchParams.get("instrument") || ""
  );
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genre") || ""
  );
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [budgetMin, setBudgetMin] = useState(
    searchParams.get("budgetMin") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    async function load() {
      const [{ data: inst }, { data: gen }] = await Promise.all([
        supabase.from("instruments").select("*").order("name"),
        supabase.from("genres").select("*").order("name"),
      ]);
      if (inst) setInstruments(inst);
      if (gen) setGenres(gen);
    }
    load();
  }, [supabase]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedInstrument) params.set("instrument", selectedInstrument);
    if (selectedGenre) params.set("genre", selectedGenre);
    if (city) params.set("city", city);
    if (budgetMin) params.set("budgetMin", budgetMin);
    if (sortBy !== "newest") params.set("sort", sortBy);
    router.push(`/gigs?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedInstrument("");
    setSelectedGenre("");
    setCity("");
    setBudgetMin("");
    setSortBy("newest");
    router.push("/gigs");
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">Filters</h3>
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500">
            Instrument
          </label>
          <select
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">All</option>
            {instruments.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">All</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Any city"
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500">
            Min Budget ($)
          </label>
          <input
            type="number"
            min="0"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            placeholder="Any"
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="soonest">Soonest Date</option>
            <option value="budget">Highest Budget</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={applyFilters}
            className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm text-white font-medium hover:bg-primary-dark"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 font-medium hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
