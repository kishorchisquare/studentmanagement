"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

type Student = {
  id: number;
  name: string;
  email: string;
  schoolName?: string | null;
  role?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const tokenType = localStorage.getItem("jwtType") || "Bearer";
    const storedEmail = localStorage.getItem("userEmail");
    setUserEmail(storedEmail);
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
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-200 min-h-screen flex">
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-all duration-300 ease-in-out shrink-0">
        <div className="p-5 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">school</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">SMP-Students</span>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          <button className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-md font-medium w-full">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-full">
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span className="text-sm">Students</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-full">
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span className="text-sm">Reports</span>
          </button>
          <div className="pt-4 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            System
          </div>
          <button className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-full">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="text-sm">Settings</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-full">
            <span className="material-symbols-outlined text-[20px]">security</span>
            <span className="text-sm">Access Control</span>
          </button>
        </nav>
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            className="flex items-center gap-3 px-3 py-2 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-sm"
            onClick={() => document.documentElement.classList.toggle("dark")}
            type="button"
          >
            <span className="material-symbols-outlined dark:hidden">dark_mode</span>
            <span className="material-symbols-outlined hidden dark:block">light_mode</span>
            Switch Mode
          </button>
          <button
            className="mt-2 flex items-center gap-3 px-3 py-2 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-sm"
            onClick={handleLogout}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none focus:ring-1 focus:ring-primary/50 rounded-md text-sm placeholder-slate-400"
                placeholder="Search records, students, or faculty..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1 rounded-md transition-colors group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">
                  {students[0]?.name || "Signed In"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tighter">
                  {students[0]?.role || "USER"}
                  {userEmail ? ` • ${userEmail}` : ""}
                </p>
              </div>
              <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700"></div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </header>

        <div className="p-5 space-y-5 overflow-y-auto flex-1 flex flex-col">
          {/* <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined bg-white/20 p-1 rounded-md">
                info
              </span>
              <p className="text-sm font-medium">
                Welcome back! Your campus operations are running smoothly.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs bg-white text-indigo-600 px-3 py-1 rounded-md font-bold hover:bg-indigo-50 transition-colors">
                Review Enrollment
              </button>
              <button className="text-xs bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1 rounded-md font-bold transition-colors">
                Dismiss
              </button>
            </div>
          </div> */}

          <div className="grid grid-cols-12 gap-5 shrink-0">
            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Total Students
                </h3>
                <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +12%
                </span>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-display font-bold leading-none">
                  {students.length}
                </span>
                <span className="text-slate-400 text-xs mb-1">Enrolled</span>
              </div>
              <div className="h-16 w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-end px-2 py-1 gap-1">
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[40%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[60%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[50%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[80%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[70%]"></div>
                <div className="flex-1 bg-primary/40 rounded-t-sm h-[90%]"></div>
                <div className="flex-1 bg-primary rounded-t-sm h-[100%]"></div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Active Sessions
                </h3>
                <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +24%
                </span>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-display font-bold leading-none">
                  {students.length}
                </span>
                <span className="text-slate-400 text-xs mb-1">Real-time</span>
              </div>
              <div className="h-16 w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-end px-2 py-1 gap-1">
                <div className="flex-1 bg-purple-500/20 rounded-t-sm h-[30%]"></div>
                <div className="flex-1 bg-purple-500/20 rounded-t-sm h-[40%]"></div>
                <div className="flex-1 bg-purple-500/20 rounded-t-sm h-[70%]"></div>
                <div className="flex-1 bg-purple-500/20 rounded-t-sm h-[50%]"></div>
                <div className="flex-1 bg-purple-500/20 rounded-t-sm h-[60%]"></div>
                <div className="flex-1 bg-purple-500/40 rounded-t-sm h-[80%]"></div>
                <div className="flex-1 bg-purple-500 rounded-t-sm h-[95%]"></div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-3">
              <details className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm" open>
                <summary className="flex items-center justify-between p-3 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      my_location
                    </span>
                    <span className="text-sm font-bold">Coverage</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform text-[18px]">
                    expand_more
                  </span>
                </summary>
                <div className="px-3 pb-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    View all students within your designated access scope and regional
                    boundaries.
                  </p>
                  <button className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 hover:underline">
                    Set Boundaries{" "}
                    <span className="material-symbols-outlined text-[12px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </details>
              <details className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between p-3 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500 text-[20px]">
                      verified_user
                    </span>
                    <span className="text-sm font-bold">Security</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform text-[18px]">
                    expand_more
                  </span>
                </summary>
                <div className="px-3 pb-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    Enterprise-grade JWT access plus granular role-based filtering for
                    maximum data safety.
                  </p>
                  <button className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 hover:underline">
                    Manage Keys{" "}
                    <span className="material-symbols-outlined text-[12px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </details>
              <details className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between p-3 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-500 text-[20px]">
                      apartment
                    </span>
                    <span className="text-sm font-bold">Multi-Campus Support</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform text-[18px]">
                    expand_more
                  </span>
                </summary>
                <div className="px-3 pb-3 border-t border-slate-100 dark:border-slate-800 pt-2">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    Admins can switch between campuses or view an aggregated dashboard for
                    all sites.
                  </p>
                  <button className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 hover:underline">
                    Switch Campus{" "}
                    <span className="material-symbols-outlined text-[12px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </details>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-base">Student Records</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Database oversight for all registered students.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
                    filter_alt
                  </span>
                  <select className="pl-8 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold focus:ring-1 focus:ring-primary appearance-none cursor-pointer">
                    <option>All Campuses</option>
                    <option>North Campus</option>
                    <option>Main Campus</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">sort</span>
                  Sort
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-bold hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Student
                </button>
              </div>
            </div>
            <div className="overflow-auto flex-1">
              {loading ? (
                <p className="p-6 text-sm text-slate-500">Loading students...</p>
              ) : error ? (
                <p className="p-6 text-sm text-red-500">{error}</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-3 font-bold border-b border-slate-200 dark:border-slate-800">
                        ID
                      </th>
                      <th className="px-6 py-3 font-bold border-b border-slate-200 dark:border-slate-800">
                        Student Name
                      </th>
                      <th className="px-6 py-3 font-bold border-b border-slate-200 dark:border-slate-800">
                        Email Address
                      </th>
                      <th className="px-6 py-3 font-bold border-b border-slate-200 dark:border-slate-800">
                        Campus
                      </th>
                      <th className="px-6 py-3 font-bold border-b border-slate-200 dark:border-slate-800">
                        Role
                      </th>
                      <th className="px-6 py-3 font-bold text-right border-b border-slate-200 dark:border-slate-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {students.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-3 text-[11px] font-mono text-slate-400">
                          #{student.id.toString().padStart(3, "0")}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-sm font-semibold">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-xs text-slate-600 dark:text-slate-400">
                          {student.email}
                        </td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-[10px] font-bold">
                            {student.schoolName || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-xs">
                          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                            {student.role || "USER"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-all">
                              <span className="material-symbols-outlined text-[18px]">
                                edit
                              </span>
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-all">
                              <span className="material-symbols-outlined text-[18px]">
                                visibility
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Showing <span className="text-slate-900 dark:text-slate-200">
                  {students.length}
                </span>{" "}
                students
              </p>
              <div className="flex items-center gap-1">
                <button className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
                  <span className="material-symbols-outlined text-[16px]">
                    chevron_left
                  </span>
                </button>
                <button className="w-7 h-7 bg-primary text-white rounded-md text-xs font-bold">
                  1
                </button>
                <button className="w-7 h-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-xs font-bold transition-colors">
                  2
                </button>
                <button className="w-7 h-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-xs font-bold transition-colors">
                  3
                </button>
                <button className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
