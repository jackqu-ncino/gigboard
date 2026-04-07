import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { GigStatus } from "@/types";

interface GigCardProps {
  id: string;
  title: string;
  gigDate: string;
  city: string | null;
  state: string | null;
  budget: number | null;
  musiciansNeeded: number;
  status: GigStatus;
  instruments: { name: string }[];
  genres: { name: string }[];
  postedBy: string;
  isMatch?: boolean;
  isFeatured?: boolean;
}

const statusColors: Record<GigStatus, string> = {
  open: "bg-green-100 text-green-700",
  filled: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export function GigCard({
  id,
  title,
  gigDate,
  city,
  state,
  budget,
  musiciansNeeded,
  status,
  instruments,
  genres,
  postedBy,
  isMatch,
  isFeatured,
}: GigCardProps) {
  return (
    <Link
      href={`/gigs/${id}`}
      className={`block rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${
        isFeatured
          ? "bg-amber-50 border-2 border-amber-300 ring-1 ring-amber-200"
          : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isFeatured && (
              <span className="shrink-0 rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">
                Featured
              </span>
            )}
            <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
            {isMatch && (
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Good Match
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(gigDate)}
            {city && ` \u2022 ${city}`}
            {state && `, ${state}`}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {musiciansNeeded} musician{musiciansNeeded > 1 ? "s" : ""} needed
            {" \u2022 "}Posted by {postedBy}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {budget && (
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(budget)}
            </span>
          )}
        </div>
      </div>

      {instruments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {instruments.map((inst, i) => (
            <span
              key={i}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {inst.name}
            </span>
          ))}
        </div>
      )}

      {genres.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {genres.map((genre, i) => (
            <span
              key={i}
              className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
