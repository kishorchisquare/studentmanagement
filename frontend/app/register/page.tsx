"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

type School = {
  id: number;
  name: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsError, setSchoolsError] = useState<string | null>(null);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSchools = async () => {
    setSchoolsLoading(true);
    setSchoolsError(null);
    try {
      const res = await fetch(`${API_BASE}/schools`);
      if (!res.ok) {
        throw new Error("Failed to load schools");
      }
      const data = (await res.json()) as School[];
      setSchools(data);
    } catch (err) {
      setSchoolsError(err instanceof Error ? err.message : "Failed to load schools");
    } finally {
      setSchoolsLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!schoolId && !schoolName.trim()) {
      setError("Select a school or enter a new school name");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          schoolId: schoolId ? Number(schoolId) : undefined,
          schoolName: schoolName.trim() || undefined
        })
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Registration failed");
      }
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-500 via-teal-500 to-slate-900 p-8 text-white md:p-10">
            <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-2.5 backdrop-blur">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <span className="font-display text-xl font-bold tracking-tight">SMP - Students</span>
              </div>
              <h1 className="mt-10 text-3xl font-semibold leading-tight">
                Create a secure campus profile.
              </h1>
              <p className="mt-4 text-sm text-indigo-100/80">
                Join the portal to manage student data, access analytics, and stay compliant.
              </p>
            </div>
            <div className="relative z-10 mt-10 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-indigo-100/70">
                Built-in safeguards
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <span>Enforced permissions</span>
                <span>Campus-level segmentation</span>
                <span>Role-aware dashboards</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col justify-center p-8 md:p-10">
            <div className="mb-8">
              <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-semibold dark:bg-slate-800">
                <button
                  className="rounded-full px-5 py-2 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => router.push("/login")}
                  type="button"
                >
                  Login
                </button>
                <button className="rounded-full bg-white px-5 py-2 shadow-sm dark:bg-slate-700">
                  Register
                </button>
              </div>
              
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-slate-500">Full name</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="Jane Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Email address</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="jane@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Password</label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="At least 6 characters"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">School name</label>
                <div className="mt-2 grid gap-3">
                  <div className="relative">
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800"
                      value={schoolId}
                      onChange={(e) => {
                        setSchoolId(e.target.value);
                        if (e.target.value) {
                          setSchoolName("");
                        }
                      }}
                    >
                      <option value="">Select an existing school</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                    {schoolsLoading ? (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                        Loading...
                      </span>
                    ) : null}
                  </div>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Or enter a new school name"
                    type="text"
                    value={schoolName}
                    onChange={(e) => {
                      setSchoolName(e.target.value);
                      if (e.target.value) {
                        setSchoolId("");
                      }
                    }}
                  />
                  {schoolsError ? (
                    <p className="text-xs text-amber-500">{schoolsError}</p>
                  ) : null}
                </div>
              </div>

              {error ? <p className="text-xs text-red-500">{error}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
                  type="submit"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  {loading ? "Creating..." : "Create account"}
                </button>
                <button
                  className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  type="button"
                  onClick={() => router.push("/login")}
                >
                  Back to login
                </button>
              </div>
            </form>

            <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200/70 dark:bg-slate-800"></span>
              Account assurance
              <span className="h-px flex-1 bg-slate-200/70 dark:bg-slate-800"></span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                Scoped Access
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                Compliance Ready
              </span>
              <span className="rounded-full bg-teal-100 px-3 py-1 font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                Secured
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
