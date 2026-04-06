"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { USER_ROLES } from "@/lib/constants";
import Link from "next/link";
import type { UserRole } from "@/types";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("musician");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // If email confirmation is disabled, redirect immediately
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1000);
  };

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-center">
        <p className="text-green-800 font-medium">Account created!</p>
        <p className="mt-1 text-sm text-green-700">
          Check your email to confirm your account, or you&apos;ll be redirected
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-semibold text-gray-900"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-900"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-900"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900">
          I am a...
        </label>
        <div className="mt-2 flex gap-3">
          {USER_ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value as UserRole)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                role === r.value
                  ? "border-primary bg-primary text-white"
                  : "border-gray-400 bg-white text-gray-900 hover:bg-gray-50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
