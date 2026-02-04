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
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="shell">
      <header className="brand">
        <h1>Student Management</h1>
        <span className="chip">JWT • App Router</span>
      </header>

      <section className="split">
        <div className="card">
          <h2 className="title">Welcome Back</h2>
          <p className="muted">
            Use your student email and password to access the dashboard.
          </p>
        </div>

        <div className="card">
          <h2 className="title">Login</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="muted">No account yet?</span>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => router.push("/register")}
            >
              Create account
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
