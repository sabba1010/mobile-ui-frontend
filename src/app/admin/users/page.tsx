"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, X } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    balance: 0,
    plan: "None",
    referrals: 0,
    status: "active"
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("vip_token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/user/all`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formattedUsers = users.map(u => ({
    id: u._id,
    phone: u.phoneNumber || "",
    joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-CA') : "",
    joinedFull: u.createdAt ? new Date(u.createdAt).toLocaleString('en-US') : "",
    plan: u.plan || "None",
    balance: u.balance || 0,
    referrals: u.referrals || 0,
    status: u.status || "active"
  }));

  const filtered = formattedUsers.filter(u => 
    u.phone.toLowerCase().includes(search.toLowerCase()) || 
    u.plan.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenEditModal = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      balance: user.balance,
      plan: user.plan,
      referrals: user.referrals,
      status: user.status
    });
    setModalOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const res = await fetch(`${API_URL}/api/user/update/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("User updated successfully!");
        // Update local state
        setUsers(users.map(u => u._id === selectedUser.id ? { ...u, ...editForm } : u));
        setModalOpen(false);
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Network error while updating user");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">{loading ? "..." : users.length} total members</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by phone or plan..."
          className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Referrals</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                    className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{user.phone}</p>
                      <p className="text-xs text-slate-500">Joined {user.joined}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg">{user.plan}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">GHS {user.balance.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{user.referrals}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 ${
                        user.status === "active" ? "bg-emerald-100 text-emerald-700" :
                        user.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                      }`}>
                        {user.status === "active" ? <CheckCircle size={11} /> : user.status === "pending" ? <Clock size={11} /> : <XCircle size={11} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button 
                        onClick={() => handleOpenEditModal(user)}
                        className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl relative border border-slate-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">User Control Details</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Join Date</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.joinedFull}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Plan</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.plan}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Balance</p>
                  <p className="text-sm font-semibold text-slate-800">GHS {selectedUser.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Referrals</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.referrals}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Status Control</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Blocked</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={updating}
                className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
