import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AdminUserForm } from "@/components/admin/AdminUserForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit User - GigBoard Admin",
};

export default async function AdminEditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (!user) return notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
      <p className="mt-1 text-gray-600">
        Manage user account for {user.full_name}.
      </p>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <AdminUserForm user={user} />
      </div>
    </div>
  );
}
