"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code") || params.get("v");
      if (code) {
        setInviteCode(code.toUpperCase());
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Clean phone number and prepend +233 if needed
      const cleanPhone = phoneNumber.replace(/\s/g, '');
      const fullPhone = cleanPhone.startsWith('+233') ? cleanPhone : "+233" + cleanPhone;

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: fullPhone,
          password,
          inviteCode: inviteCode || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Automatically redirect to login page after successful registration
      router.push("/login");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-widest">PAISON VIP</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Create Account</h2>
          <p className="text-sm text-slate-500 mb-6">Join us and start earning</p>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Phone Number</label>
              <div className="flex">
                <div className="flex items-center bg-slate-100 border border-r-0 border-slate-200 rounded-l-2xl px-3 shrink-0">
                  <span className="text-sm font-bold text-slate-600">+233</span>
                </div>
                <input type="tel" placeholder="55 123 4567" required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-r-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Create a password" required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Confirm Password</label>
              <div className="relative">
                <input type={showPw2 ? "text" : "password"} placeholder="Confirm your password" required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => setShowPw2(!showPw2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw2 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Invitation Code <span className="text-slate-400 font-normal">(optional)</span></label>
              <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="e.g. UJGIDZ"
                maxLength={8}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm uppercase tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Register Now <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
