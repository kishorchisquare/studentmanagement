"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, schoolName })
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
    <main className="shell">
      <header className="brand">
        <h1>Create Account</h1>
        <span className="chip">SQLite • JWT</span>
      </header>

      <section className="split">
        <div className="card">
          <h2 className="title">Register</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                minLength={6}
                required
              />
            </label>
            <label>
              School
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Green Valley High"
                required
              />
            </label>
            {error ? <p className="error">{error}</p> : null}
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="muted">Already registered?</span>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => router.push("/login")}
            >
              Back to login
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="title">What you get</h2>
          <p className="muted">
            Register to manage students securely. After login you can view the
            full roster.
          </p>
          <div className="row" style={{ marginTop: 16 }}>
            <span className="pill">JWT access</span>
            <span className="pill">SQLite storage</span>
            <span className="pill">Secure passwords</span>
          </div>
        </div>
      </section>
    </main>
  );
}
