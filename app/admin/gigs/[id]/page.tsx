import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AdminGigForm } from "@/components/admin/AdminGigForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Gig - GigBoard Admin",
};

export default async function AdminEditGigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: gig } = await supabase
    .from("gigs")
    .select("*, users!gigs_posted_by_fkey(full_name)")
    .eq("id", id)
    .single();

  if (!gig) return notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Edit Gig</h1>
      <p className="mt-1 text-gray-600">
        Admin edit for: {gig.title}
      </p>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <AdminGigForm gig={gig} />
      </div>
    </div>
  );
}
