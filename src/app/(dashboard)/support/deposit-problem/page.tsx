"use client";

import { ArrowLeft, UploadCloud, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function DepositProblemPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    userWallet: "",
    platformWallet: "",
    amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("vip_token");
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const res = await fetch(`${API_URL}/api/user/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          userWallet: formData.userWallet,
          platformWallet: formData.platformWallet,
          amount: Number(formData.amount)
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Deposit problem ticket submitted successfully!");
        router.back();
      } else {
        toast.error(data.message || "Failed to submit support ticket");
      }
    } catch (err) {
      console.error("Ticket submission error:", err);
      toast.error("Network error while submitting support ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Report Deposit Problem</h1>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Payment Time */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <span className="text-red-500">*</span> Payment time
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full h-12 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-600 transition-all appearance-none"
                    placeholder="Select date"
                  />
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <input 
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full h-12 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-600 transition-all appearance-none"
                    placeholder="Select time"
                  />
                  <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Your wallet */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <span className="text-red-500">*</span> Your wallet for transferring funds
              </label>
              <input 
                type="text"
                required
                value={formData.userWallet}
                onChange={(e) => setFormData({...formData, userWallet: e.target.value})}
                placeholder="Please enter your wallet account number"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-600 transition-all"
              />
            </div>

            {/* Platform's wallet */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <span className="text-red-500">*</span> Platform's receiving wallet account
              </label>
              <input 
                type="text"
                required
                value={formData.platformWallet}
                onChange={(e) => setFormData({...formData, platformWallet: e.target.value})}
                placeholder="Please enter platform receiving wallet number"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-600 transition-all"
              />
            </div>

            {/* Deposit amount */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <span className="text-red-500">*</span> Deposit amount
              </label>
              <input 
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="Please enter the deposit amount"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-600 transition-all"
              />
            </div>

            {/* Screenshot Notice */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                Transaction Screenshot
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50 relative overflow-hidden">
                <UploadCloud size={28} className="text-slate-400 animate-pulse" />
                <p className="text-xs text-slate-500 font-medium">Auto-capturing transaction ledger reference</p>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={submitting}
              className="w-full h-12 mt-4 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-75 flex items-center justify-center"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Submit Report"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
