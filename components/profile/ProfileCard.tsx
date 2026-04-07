import Link from "next/link";
import type { Instrument, Genre } from "@/types";

interface ProfileCardProps {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  experience: string;
  city: string | null;
  state: string | null;
  rateMin: number | null;
  rateMax: number | null;
  instruments: Instrument[];
  genres: Genre[];
  isPremium?: boolean;
}

export function ProfileCard({
  userId,
  fullName,
  bio,
  experience,
  city,
  state,
  rateMin,
  rateMax,
  instruments,
  genres,
  isPremium,
}: ProfileCardProps) {
  return (
    <Link
      href={`/musicians/${userId}`}
      className={`block rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${
        isPremium
          ? "bg-purple-50 border-2 border-purple-300 ring-1 ring-purple-200"
          : "bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center ${
          isPremium ? "bg-purple-100 ring-2 ring-purple-300" : "bg-primary/10"
        }`}>
          <span className={`text-lg font-semibold ${isPremium ? "text-purple-700" : "text-primary"}`}>
            {fullName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{fullName}</h3>
            {isPremium && (
              <span className="shrink-0 rounded-full bg-purple-200 px-2 py-0.5 text-xs font-bold text-purple-800">
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 capitalize">{experience}</p>
          {(city || state) && (
            <p className="text-sm text-gray-500">
              {[city, state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
        {(rateMin || rateMax) && (
          <div className="text-right text-sm">
            <span className="font-semibold text-green-600">
              {rateMin && rateMax
                ? `$${rateMin}-$${rateMax}/hr`
                : rateMin
                ? `From $${rateMin}/hr`
                : `Up to $${rateMax}/hr`}
            </span>
          </div>
        )}
      </div>

      {bio && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{bio}</p>
      )}

      {instruments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {instruments.map((inst) => (
            <span
              key={inst.id}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {inst.name}
            </span>
          ))}
        </div>
      )}

      {genres.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {genres.map((genre) => (
            <span
              key={genre.id}
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
