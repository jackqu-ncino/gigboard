"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/types";

export async function updateUser(
  userId: string,
  data: {
    full_name: string;
    role: UserRole;
    is_active: boolean;
    is_admin: boolean;
  }
) {
  // Verify the caller is an admin
  const supabase = await createClient();
  const {
    data: { user: caller },
  } = await supabase.auth.getUser();

  if (!caller) {
    return { error: "Not authenticated" };
  }

  const { data: callerData } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", caller.id)
    .single();

  if (!callerData?.is_admin) {
    return { error: "Not authorized" };
  }

  // Use admin client to bypass RLS
  const admin = createAdminClient();
  const { error } = await admin
    .from("users")
    .update({
      full_name: data.full_name,
      role: data.role,
      is_active: data.is_active,
      is_admin: data.is_admin,
    })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
