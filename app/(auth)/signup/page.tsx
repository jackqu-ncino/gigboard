import { SignupForm } from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - GigBoard",
};

export default function SignupPage() {
  return (
    <>
      <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
        Create Account
      </h2>
      <SignupForm />
    </>
  );
}
