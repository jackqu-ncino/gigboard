"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ApplyButton({ gigId }: { gigId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleApply = async () => {
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Please log in to apply");
      setLoading(false);
      return;
    }

    const { error: applyError } = await supabase
      .from("applications")
      .insert({
        gig_id: gigId,
        musician_id: user.id,
        message: message || null,
      });

    if (applyError) {
      setError(
        applyError.code === "23505"
          ? "You've already applied to this gig"
          : applyError.message
      );
      setLoading(false);
      return;
    }

    setShowModal(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full rounded-md bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Apply to This Gig
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Apply to Gig
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Introduce yourself to the gig poster. Tell them why you&apos;re a
              good fit.
            </p>

            {error && (
              <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Hi! I'd be a great fit for this gig because..."
              className="mt-4 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={loading}
                className="rounded-md bg-primary px-4 py-2 text-sm text-white font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
