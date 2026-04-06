import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { GigForm } from "@/components/gigs/GigForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Gig - GigBoard",
};

export default async function EditGigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: gig } = await supabase
    .from("gigs")
    .select("*")
    .eq("id", id)
    .single();

  if (!gig) return notFound();
  if (gig.posted_by !== user!.id) redirect("/gigs");

  const [{ data: instruments }, { data: genres }] = await Promise.all([
    supabase
      .from("gig_instruments")
      .select("instrument_id")
      .eq("gig_id", id),
    supabase.from("gig_genres").select("genre_id").eq("gig_id", id),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Edit Gig</h1>
      <p className="mt-1 text-gray-600">Update your gig posting details.</p>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <GigForm
          gig={gig}
          selectedInstrumentIds={
            instruments?.map((i) => i.instrument_id) || []
          }
          selectedGenreIds={genres?.map((g) => g.genre_id) || []}
        />
      </div>
    </div>
  );
}
