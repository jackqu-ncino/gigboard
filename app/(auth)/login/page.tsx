import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - GigBoard",
};

export default function LoginPage() {
  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
        Sign In
      </h2>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
