"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ApplicationStatus } from "@/types";

interface Applicant {
  id: string;
  musician_id: string;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
  users: {
    full_name: string;
    avatar_url: string | null;
  };
}

const statusColors: Record<ApplicationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-600",
};

export function ApplicantsList({
  applications,
}: {
  applications: Applicant[];
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const updateStatus = async (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    setUpdating(applicationId);
    await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);
    setUpdating(null);
    router.refresh();
  };

  return (
    <div className="mt-4 space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="rounded-md border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {app.users?.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {app.users?.full_name}
                </p>
                <p className="text-xs text-gray-500">
                  Applied {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                statusColors[app.status]
              }`}
            >
              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
            </span>
          </div>

          {app.message && (
            <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded p-3">
              {app.message}
            </p>
          )}

          {app.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => updateStatus(app.id, "accepted")}
                disabled={updating === app.id}
                className="rounded-md bg-green-600 px-3 py-1 text-sm text-white font-medium hover:bg-green-700 disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus(app.id, "rejected")}
                disabled={updating === app.id}
                className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-700 font-medium hover:bg-red-50 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
