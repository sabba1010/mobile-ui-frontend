"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Clean phone number and prepend +233 if needed
      const cleanPhone = phoneNumber.replace(/\s/g, '');
      const fullPhone = cleanPhone.startsWith('+233') ? cleanPhone : "+233" + cleanPhone;

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhone, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("vip_token", data.token);
      localStorage.setItem("vip_role", data.user.role);

      if (data.user.role === 'admin' || data.user.role === 'super_admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-indigo-900 uppercase tracking-widest">PAISON VIP</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-violet-200/40 border border-violet-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Phone Number</label>
              <div className="flex">
                <div className="flex items-center bg-violet-50 border border-r-0 border-violet-200 rounded-l-2xl px-3 shrink-0">
                  <span className="text-sm font-bold text-indigo-700">+233</span>
                </div>
                <input type="tel" placeholder="55 123 4567" required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 h-12 px-4 bg-violet-50/50 border border-violet-200 rounded-r-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:z-10" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Enter your password" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-4 pr-12 bg-violet-50/50 border border-violet-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/30 hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">Register now</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
