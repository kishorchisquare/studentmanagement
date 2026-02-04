"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

type Student = {
  id: number;
  name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const tokenType = localStorage.getItem("jwtType") || "Bearer";
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/students`, {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("jwt");
          localStorage.removeItem("jwtType");
          router.push("/login");
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load students");
        }
        const data = (await res.json()) as Student[];
        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwtType");
    router.push("/login");
  };

  return (
    <main className="shell">
      <header className="brand">
        <div>
          <h1>Student Dashboard</h1>
          <p className="muted">All registered students (secured by JWT).</p>
        </div>
        <div className="row">
          <span className="pill">{students.length} total</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="card">
        {loading ? (
          <p className="muted">Loading students...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
