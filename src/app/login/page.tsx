"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        // Fetch user role and redirect
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        const role = session?.user?.role;
        
        switch (role) {
          case "admin":
          case "admin_manager":
            router.push("/admin");
            break;
          case "teacher":
            router.push("/teacher");
            break;
          case "student":
            router.push("/student");
            break;
          case "parent":
            router.push("/parent");
            break;
          default:
            router.push("/login");
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2744] to-[#1a4a7a] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1 className="font-[Sora] text-2xl font-bold text-white">Institution Management</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] focus:outline-none transition-colors text-sm"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d9488] focus:outline-none transition-colors text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0d9488] hover:bg-[#14b8a6] text-white font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-[#475569]"><span className="font-bold">Admin:</span> admin / admin123</div>
              <div className="text-[#475569]"><span className="font-bold">Teacher:</span> teacher1 / teacher123</div>
              <div className="text-[#475569]"><span className="font-bold">Student:</span> student1 / student123</div>
              <div className="text-[#475569]"><span className="font-bold">Parent:</span> parent1 / parent123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
