import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Applications - GigBoard Admin",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
};

export default async function AdminApplicationsPage() {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from("applications")
    .select(
      "*, gigs(id, title, gig_date), users!applications_musician_id_fkey(full_name, email)"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">
        Manage Applications
      </h1>
      <p className="mt-1 text-gray-600">
        View all applications across the platform.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Musician
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Gig
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Applied
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications?.map((app: any) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <p className="font-medium text-gray-900">
                    {app.users?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">{app.users?.email}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {app.gigs?.title}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[app.status]
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/gigs/${app.gigs?.id}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    View Gig
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!applications?.length && (
          <p className="p-6 text-center text-gray-400">
            No applications found.
          </p>
        )}
      </div>
    </div>
  );
}
