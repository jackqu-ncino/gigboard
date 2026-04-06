import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Gigs - GigBoard Admin",
};

export default async function AdminGigsPage() {
  const supabase = await createClient();

  const { data: gigs } = await supabase
    .from("gigs")
    .select("*, users!gigs_posted_by_fkey(full_name)")
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    filled: "bg-blue-100 text-blue-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900">Manage Gig Postings</h1>
      <p className="mt-1 text-gray-600">View and manage all gig postings.</p>

      <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Posted By
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Budget
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {gigs?.map((gig: any) => (
              <tr key={gig.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {gig.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {gig.users?.full_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(gig.gig_date)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {gig.budget ? formatCurrency(gig.budget) : "-"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[gig.status]
                    }`}
                  >
                    {gig.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/admin/gigs/${gig.id}`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!gigs?.length && (
          <p className="p-6 text-center text-gray-400">No gigs found.</p>
        )}
      </div>
    </div>
  );
}
