"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GIG_STATUSES } from "@/lib/constants";
import type { Gig, GigStatus } from "@/types";

export function AdminGigForm({ gig }: { gig: Gig }) {
  const [title, setTitle] = useState(gig.title);
  const [status, setStatus] = useState<GigStatus>(gig.status);
  const [budget, setBudget] = useState(gig.budget?.toString() || "");
  const [musiciansNeeded, setMusiciansNeeded] = useState(
    gig.musicians_needed.toString()
  );
  const [isFeatured, setIsFeatured] = useState(gig.is_featured);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("gigs")
      .update({
        title,
        status,
        budget: budget ? parseFloat(budget) : null,
        musicians_needed: parseInt(musiciansNeeded) || 1,
        is_featured: isFeatured,
        featured_until: isFeatured && !gig.is_featured
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : isFeatured
          ? gig.featured_until
          : null,
      })
      .eq("id", gig.id);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Gig updated successfully.");
    }
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from("gigs").delete().eq("id", gig.id);
    if (error) {
      setMessage(`Error: ${error.message}`);
      setLoading(false);
    } else {
      router.push("/admin/gigs");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`rounded-md p-3 text-sm ${
            message.startsWith("Error")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as GigStatus)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {GIG_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Budget ($)
          </label>
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
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

      <div className="flex items-center gap-3 rounded-md bg-amber-50 border border-amber-200 p-3">
        <input
          type="checkbox"
          id="is_featured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="is_featured" className="text-sm">
          <span className="font-medium text-amber-900">Featured Gig</span>
          <span className="block text-xs text-amber-700">
            Highlighted with a badge and shown at the top of search results
          </span>
          {gig.featured_until && gig.is_featured && (
            <span className="block text-xs text-amber-600 mt-0.5">
              Expires: {new Date(gig.featured_until).toLocaleDateString()}
            </span>
          )}
        </label>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm text-white font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>

        {!showDelete ? (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Delete Gig
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600">Are you sure?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              No
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
