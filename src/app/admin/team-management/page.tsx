"use client";

import { useState, useEffect } from "react";
import { Users, Search, Ban, CheckCircle, Eye, ShieldAlert, X, AlertTriangle, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function TeamManagementPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paying, setPaying] = useState(false);
  
  // Modals state
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [banReason, setBanReason] = useState("");

  const handlePayWeeklySalaries = async () => {
    if (!window.confirm("Are you sure you want to distribute weekly wages to all qualified team leaders now?")) {
      return;
    }

    setPaying(true);
    try {
      const token = localStorage.getItem("vip_token");
      const res = await fetch(`${API_URL}/api/user/admin/pay-weekly-incentives`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Weekly salaries paid successfully!");
        fetchTeams(); // Refresh stats
      } else {
        toast.error(data.message || "Failed to distribute salaries.");
      }
    } catch (err) {
      toast.error("Network error while distributing salaries.");
    } finally {
      setPaying(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/admin/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTeams(data.teams || []);
        }
      }
    } catch (err) {
      console.error("Failed to load admin teams stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(t => 
    (t.inviteCode && t.inviteCode.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (t.phone && t.phone.includes(searchTerm))
  );

  const openBanModal = (team: any) => {
    setSelectedTeam(team);
    setBanReason("");
    setBanModalOpen(true);
  };

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banReason.trim() || !selectedTeam) return;

    try {
      const token = localStorage.getItem("vip_token");
      const res = await fetch(`${API_URL}/api/user/update/${selectedTeam.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "suspended" })
      });

      if (res.ok) {
        toast.success(`Team ${selectedTeam.inviteCode} banned successfully.`);
        fetchTeams();
      } else {
        toast.error("Failed to suspend team owner.");
      }
    } catch (err) {
      toast.error("Error connecting to server.");
    } finally {
      setBanModalOpen(false);
    }
  };

  const handleUnban = async (teamId: string, inviteCode: string) => {
    try {
      const token = localStorage.getItem("vip_token");
      const res = await fetch(`${API_URL}/api/user/update/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "active" })
      });

      if (res.ok) {
        toast.success(`Team ${inviteCode} activated successfully.`);
        fetchTeams();
      } else {
        toast.error("Failed to activate team owner.");
      }
    } catch (err) {
      toast.error("Error connecting to server.");
    }
  };

  const openDetailsModal = (team: any) => {
    setSelectedTeam(team);
    setDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 text-sm">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
        Loading team structures...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor teams by Invitation Code and manage their members.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePayWeeklySalaries}
            disabled={paying}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 shadow-md shadow-emerald-500/25 active:scale-95 disabled:opacity-75 shrink-0"
          >
            {paying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Pay Weekly Salaries"
            )}
          </button>
          
          <div className="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="Search code or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Teams</p>
            <p className="text-slate-900 font-black text-2xl leading-none">{teams.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
            <Activity size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Members</p>
            <p className="text-slate-900 font-black text-2xl leading-none">
              {teams.reduce((acc, t) => acc + (t.activeMembers || 0), 0)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <ShieldAlert size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Banned Teams</p>
            <p className="text-slate-900 font-black text-2xl leading-none">
              {teams.filter(t => t.status === "Banned").length}
            </p>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Team Info (Invite Code)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Team Size</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No teams found matching "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 shadow-inner">
                          {team.inviteCode.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-wide">{team.inviteCode}</p>
                          <p className="text-xs text-slate-500 font-medium">{team.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-800">{team.teamSize} Total</span>
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-max">
                          {team.activeMembers} Active
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-indigo-700">GHS {team.commission.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      {team.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                          <Ban size={12} /> Banned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openDetailsModal(team)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Team Details"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {team.status === "Active" ? (
                          <button 
                            onClick={() => openBanModal(team)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Ban Team"
                          >
                            <Ban size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUnban(team.id, team.inviteCode)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Unban Team"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── BAN MODAL ── */}
      <AnimatePresence>
        {banModalOpen && selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBanModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/50">
                <div className="flex items-center gap-3 text-red-600">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Ban Team</h3>
                </div>
                <button onClick={() => setBanModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleBan} className="p-6">
                <p className="text-slate-600 text-sm mb-5">
                  You are about to suspend the team owner with invite code <strong className="text-slate-900">{selectedTeam.inviteCode}</strong>.
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Ban *</label>
                  <textarea 
                    required
                    rows={4}
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="e.g. Suspicious referral activity..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  ></textarea>
                </div>
                
                <div className="flex gap-3">
                  <button type="button" onClick={() => setBanModalOpen(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={!banReason.trim()} className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    Confirm Ban
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DETAILS MODAL ── */}
      <AnimatePresence>
        {detailsModalOpen && selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-200">
                    {selectedTeam.inviteCode.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Team {selectedTeam.inviteCode}</h3>
                    <p className="text-slate-500 text-xs font-semibold">{selectedTeam.phone}</p>
                  </div>
                </div>
                <button onClick={() => setDetailsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 shadow-sm">
                  <X size={20} />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Status Alert if Banned */}
                {selectedTeam.status === "Banned" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                    <ShieldAlert size={20} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-bold text-sm">Account Banned</p>
                      <p className="text-red-600 text-xs mt-1 leading-relaxed">
                        <span className="font-semibold">Reason:</span> {selectedTeam.banReason || "Suspended by admin."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Team Breakdown */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users size={16} className="text-indigo-500" /> Member Hierarchy Overview
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center shadow-sm">
                      <p className="text-slate-500 text-xs font-bold uppercase mb-1">Level 1</p>
                      <p className="text-2xl font-black text-indigo-700">{selectedTeam.teamDetails.level1}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Direct Referrals</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center shadow-sm">
                      <p className="text-slate-500 text-xs font-bold uppercase mb-1">Level 2</p>
                      <p className="text-2xl font-black text-indigo-600">{selectedTeam.teamDetails.level2}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Indirect (L1)</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center shadow-sm">
                      <p className="text-slate-500 text-xs font-bold uppercase mb-1">Level 3</p>
                      <p className="text-2xl font-black text-violet-500">{selectedTeam.teamDetails.level3}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Indirect (L2)</p>
                    </div>
                  </div>
                </div>

                {/* Team Members List */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-t border-slate-100 pt-5">
                    <Activity size={16} className="text-emerald-500" /> Recent Member Contributions (Top 10)
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">Member Phone</th>
                          <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">Level</th>
                          <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">VIP Plan</th>
                          <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase text-right">Contribution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedTeam.members && selectedTeam.members.length > 0 ? (
                          selectedTeam.members.map((member: any, index: number) => (
                            <tr key={index} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3">
                                <span className="font-semibold text-slate-700 text-sm">{member.phone}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  member.level === 1 ? 'bg-indigo-50 text-indigo-700' :
                                  member.level === 2 ? 'bg-violet-50 text-violet-700' :
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  Level {member.level}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm font-bold text-indigo-600">{member.plan}</span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="text-sm font-black text-slate-900">+ GHS {member.contribution.toFixed(2)}</span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-slate-500 text-sm">
                              No member details available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Summary Info */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Total Team Size</span>
                    <span className="text-sm font-black text-slate-900">{selectedTeam.teamSize} Members</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Active Members</span>
                    <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{selectedTeam.activeMembers} Valid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Total Commissions</span>
                    <span className="text-sm font-black text-indigo-700">GHS {selectedTeam.commission.toLocaleString()}</span>
                  </div>
                </div>
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
