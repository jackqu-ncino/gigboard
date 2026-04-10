"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { GigStatus } from "@/types";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user: caller },
  } = await supabase.auth.getUser();

  if (!caller) return false;

  const { data } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", caller.id)
    .single();

  return data?.is_admin === true;
}

export async function updateGig(
  gigId: string,
  data: {
    title: string;
    status: GigStatus;
    budget: number | null;
    musicians_needed: number;
    is_featured: boolean;
    featured_until: string | null;
  }
) {
  if (!(await verifyAdmin())) {
    return { error: "Not authorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("gigs").update(data).eq("id", gigId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteGig(gigId: string) {
  if (!(await verifyAdmin())) {
    return { error: "Not authorized" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("gigs").delete().eq("id", gigId);

  if (error) return { error: error.message };
  return { success: true };
}
