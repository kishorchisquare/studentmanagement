"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Login failed");
      }
      const data = (await res.json()) as { token: string; tokenType: string };
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("jwtType", data.tokenType || "Bearer");
      localStorage.setItem("userEmail", username);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>

      <button
        className="fixed right-6 top-6 z-20 rounded-full border border-slate-200/70 bg-white/90 p-2 text-slate-600 shadow-lg backdrop-blur transition-all hover:scale-105 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-300"
        onClick={() => document.documentElement.classList.toggle("dark")}
        type="button"
      >
        <span className="material-symbols-outlined block dark:hidden">dark_mode</span>
        <span className="material-symbols-outlined hidden dark:block">light_mode</span>
      </button>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-2xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/90 md:grid-cols-2">
          <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-500 via-indigo-500 to-slate-900 p-8 text-white md:p-10">
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <span className="font-display text-xl font-bold tracking-tight">SMP - Students</span>
              </div>
              <h1 className="mt-10 text-3xl font-semibold leading-tight">
                Welcome back to the student hub.
              </h1>
              <p className="mt-4 text-sm text-indigo-100/80">
                Manage records, track performance, and access secure campus tools from one
                workspace.
              </p>
            </div>
            <div className="relative z-10 mt-10 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-indigo-100/70">
                Live Access Levels
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-amber-300"></span>
                  Superadmin dashboards
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-indigo-200"></span>
                  Admin oversight
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-slate-200"></span>
                  Student portal
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-center p-8 md:p-10">
            <div className="mb-8">
              <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-semibold dark:bg-slate-800">
                <button className="rounded-full bg-white px-5 py-2 shadow-sm dark:bg-slate-700">
                  Login
                </button>
                <button
                  className="rounded-full px-5 py-2 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => router.push("/register")}
                  type="button"
                >
                  Register
                </button>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Use your campus email and password to continue.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-slate-500">Email address</label>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                    mail
                  </span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="you@example.com"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500">Password</label>
                  <button className="text-xs font-semibold text-primary" type="button">
                    Forgot?
                  </button>
                </div>
                <div className="relative mt-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                    lock
                  </span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="********"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error ? <p className="text-xs text-red-500">{error}</p> : null}

              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="flex items-center gap-2">
                  <input
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    type="checkbox"
                  />
                  Keep me signed in
                </label>
                {/* <span className="text-slate-400">Secure session</span> */}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
                  type="submit"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  {loading ? "Signing in..." : "Sign in"}
                </button>
                <button
                  className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  type="button"
                  onClick={() => router.push("/register")}
                >
                  Create account
                </button>
              </div>
            </form>

            <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200/70 dark:bg-slate-800"></span>
              Support and privacy
              <span className="h-px flex-1 bg-slate-200/70 dark:bg-slate-800"></span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <button className="flex items-center gap-1.5 hover:text-primary" type="button">
                <span className="material-symbols-outlined text-base">help</span>
                Support center
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary" type="button">
                <span className="material-symbols-outlined text-base">security</span>
                Privacy policy
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
