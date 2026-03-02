"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Wrong password");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-0 px-4 relative overflow-hidden">
      <GradientBlob variant="a" size={300} className="-top-20 -left-20" />
      <GradientBlob variant="b" size={250} className="-bottom-20 -right-20" />

      <div className="w-full max-w-sm relative z-10">
        <div className="glass-strong p-8 animate-scale-in">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl grad-a flex items-center justify-center mx-auto mb-5 neon-a">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-xl font-bold text-t1 text-center mb-1">
            Notes &rarr; Tasks
          </h1>
          <p className="text-sm text-t3 text-center mb-6">
            Enter password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full rounded-[12px] border border-glass-border bg-glass px-4 py-3 text-[16px] sm:text-sm text-t1 placeholder:text-t3 backdrop-blur-xl focus:border-accent focus:shadow-[0_0_0_2px_rgba(124,58,237,0.25)] transition-all duration-200"
            />

            {error && (
              <p className="text-danger text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full py-3 grad-a text-white rounded-2xl text-sm font-bold neon-a disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px]"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
