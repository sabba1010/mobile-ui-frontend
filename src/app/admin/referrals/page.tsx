"use client";

import { useState, useEffect } from "react";
import { Search, Users, GitBranch, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function AdminReferralsPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalRewardsPaid: 0,
    pendingInvites: 0
  });
  const [referrals, setReferrals] = useState<any[]>([]);

  const fetchReferralsData = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/admin/referrals`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setReferrals(data.referrals || []);
        }
      } else {
        toast.error("Failed to load referral logs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while loading referrals");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReferral = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this referral and pay the inviter a GHS 30 commission?")) {
      return;
    }

    try {
      const token = localStorage.getItem("vip_token");
      const res = await fetch(`${API_URL}/api/user/admin/referrals/approve/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Referral approved successfully!");
        fetchReferralsData(); // Refresh stats & list
      } else {
        toast.error(data.message || "Failed to approve referral");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while approving referral");
    }
  };

  useEffect(() => {
    fetchReferralsData();
  }, []);

  const filtered = referrals.filter(r => 
    (r.inviter && r.inviter.includes(search)) || 
    (r.invitee && r.invitee.includes(search))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 text-sm">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
        Loading referral tree...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Referral System</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track user invitations and commission rewards</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
            <GitBranch size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Referrals</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalReferrals.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Rewards Paid</p>
            <p className="text-2xl font-black text-slate-900">GHS {stats.totalRewardsPaid.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Pending Invites</p>
            <p className="text-2xl font-black text-slate-900">{stats.pendingInvites.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search by Inviter or Invitee phone..."
          className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" 
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Inviter</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Invitee</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Reward (GHS)</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                    No referral connections found
                  </td>
                </tr>
              ) : (
                filtered.map((ref, idx) => (
                  <motion.tr key={ref.id || idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                    className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{ref.inviter}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{ref.invitee}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs font-medium">{ref.date}</td>
                    <td className="px-4 py-3.5 font-black text-slate-900">
                      {ref.reward > 0 ? `+${ref.reward}` : "-"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        ref.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        <span className="capitalize">{ref.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium">
                      {ref.status === "pending" && (
                        <button
                          onClick={() => handleApproveReferral(ref.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
