"use client";

import { useState } from "react";

interface UpgradeButtonProps {
  type: "featured_gig" | "premium_profile";
  gigId?: string;
  label: string;
  description: string;
  className?: string;
}

export function UpgradeButton({
  type,
  gigId,
  label,
  description,
  className = "",
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, gigId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`group relative overflow-hidden rounded-lg px-5 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${className}`}
    >
      <span className="block">{loading ? "Redirecting..." : label}</span>
      <span className="block text-xs font-normal opacity-80">{description}</span>
    </button>
  );
}
