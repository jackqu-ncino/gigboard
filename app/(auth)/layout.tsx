export const dynamic = "force-dynamic";

import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">{APP_NAME}</h1>
          <p className="mt-2 text-gray-600">
            Connect musicians with gig opportunities
          </p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-md">{children}</div>
      </div>
    </div>
  );
}
