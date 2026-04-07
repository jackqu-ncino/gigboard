import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Profiles - GigBoard Admin",
};

export default async function AdminProfilesPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "*, users!profiles_user_id_fkey(full_name, email, is_premium, premium_until)"
    )
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">
        Manage Musician Profiles
      </h1>
      <p className="mt-1 text-gray-600">
        View and manage all musician profiles.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Musician
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Experience
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Published
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Premium
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles?.map((profile: any) => (
              <tr key={profile.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <p className="font-medium text-gray-900">
                    {profile.users?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.users?.email}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 capitalize">
                  {profile.experience}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {[profile.city, profile.state].filter(Boolean).join(", ") ||
                    "-"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      profile.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {profile.is_published ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {profile.users?.is_premium ? (
                    <div>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
                        Premium
                      </span>
                      {profile.users.premium_until && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          Until {new Date(profile.users.premium_until).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/musicians/${profile.user_id}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!profiles?.length && (
          <p className="p-6 text-center text-gray-400">No profiles found.</p>
        )}
      </div>
    </div>
  );
}
