"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="animate-gradient-mesh flex-grow flex flex-col items-center justify-center px-4 py-20 w-full">
        <div className="max-w-md w-full rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-10 text-center">
          <Logo variant="full" size="md" className="mx-auto mb-8" />
          <p className="text-gray-600 mb-6">
            This reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-gradient-mesh flex-grow flex flex-col items-center justify-center px-4 py-20 w-full">
      <div className="max-w-md w-full rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-10">
        <div className="flex justify-center mb-8">
          <Logo variant="full" size="md" />
        </div>

        {done ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-3">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Password updated
              </span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Your password has been changed. You can now sign in with your new
              password.
            </p>
            <button
              onClick={() => router.push("/signin")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity"
            >
              Sign in
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-center mb-1">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Set a new password
              </span>
            </h1>
            <p className="text-center text-sm text-gray-500 mb-8">
              Choose a strong password for your account
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-password"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  New password
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="reset-confirm"
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  Confirm new password
                </label>
                <input
                  id="reset-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity disabled:opacity-60"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Update password
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
