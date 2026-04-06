import { GigForm } from "@/components/gigs/GigForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Gig - GigBoard",
};

export default function NewGigPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Post a New Gig</h1>
      <p className="mt-1 text-gray-600">
        Describe your gig and the musicians you need.
      </p>
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <GigForm />
      </div>
    </div>
  );
}
