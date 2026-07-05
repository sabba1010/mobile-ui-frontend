"use client";

import { useState, useEffect } from "react";
import { Users, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Package, DollarSign, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    dailyIncome: 0,
    activePlans: 0,
    netRevenue: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("vip_token");
        if (!token) return;

        const headers = { "Authorization": `Bearer ${token}` };

        // 1. Fetch Stats & Transactions
        const statsRes = await fetch(`${API_URL}/api/user/stats`, { headers });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.stats);
            setRecentTransactions(statsData.recentTransactions || []);
          }
        }

        // 2. Fetch Users
        const usersRes = await fetch(`${API_URL}/api/user/all`, { headers });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsGrid = [
    { label: "Total Users", value: loading ? "..." : stats.totalUsers.toLocaleString(), change: "+100%", icon: Users, color: "bg-blue-50 text-primary" },
    { label: "Total Deposits", value: loading ? "..." : `GHS ${stats.totalDeposits.toLocaleString()}`, change: "+8%", icon: ArrowDownToLine, color: "bg-emerald-50 text-emerald-600" },
    { label: "Withdrawals", value: loading ? "..." : `GHS ${stats.totalWithdrawals.toLocaleString()}`, change: "+5%", icon: ArrowUpFromLine, color: "bg-rose-50 text-rose-500" },
    { label: "Daily Income", value: loading ? "..." : `GHS ${stats.dailyIncome.toLocaleString()}`, change: "+22%", icon: TrendingUp, color: "bg-violet-50 text-violet-600" },
    { label: "Active Plans", value: loading ? "..." : stats.activePlans.toLocaleString(), change: "+18%", icon: Package, color: "bg-amber-50 text-amber-600" },
    { label: "Net Revenue", value: loading ? "..." : `GHS ${stats.netRevenue.toLocaleString()}`, change: "+15%", icon: DollarSign, color: "bg-indigo-50 text-indigo-600" },
  ];

  const recentUsersList = users.slice(0, 4).map(u => {
    let formattedPhone = u.phoneNumber || "";
    if (formattedPhone.length >= 9) {
      formattedPhone = formattedPhone.substring(0, 6) + " *** " + formattedPhone.substring(formattedPhone.length - 4);
    }
    return {
      id: u._id,
      phone: formattedPhone,
      joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-CA') : "",
      plan: u.plan || "None",
      status: u.status || "active"
    };
  });

  const formattedTransactions = recentTransactions.slice(0, 4).map(t => {
    let formattedPhone = t.userPhone || "";
    if (formattedPhone.length >= 9) {
      formattedPhone = formattedPhone.substring(0, 6) + " *** " + formattedPhone.substring(formattedPhone.length - 4);
    }
    return {
      id: t._id,
      user: formattedPhone,
      type: t.type,
      amount: Math.abs(t.amount),
      date: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-CA') : "",
      status: t.status || "completed"
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Platform analytics and quick stats</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statsGrid.map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</p>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">{stat.change} this month</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Recent Users</h3>
            <Link href="/admin/users" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-6 text-sm text-slate-400">Loading recent users...</div>
            ) : recentUsersList.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400">No users registered yet</div>
            ) : (
              recentUsersList.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <Users size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{u.phone}</p>
                    <p className="text-xs text-slate-500">{u.plan} · {u.joined}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    u.status === "active" ? "bg-emerald-100 text-emerald-700" :
                    u.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  }`}>
                    {u.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            <Link href="/admin/transactions" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-6 text-sm text-slate-400">Loading recent transactions...</div>
            ) : formattedTransactions.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400">No transactions recorded yet</div>
            ) : (
              formattedTransactions.map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    t.type === "deposit" || t.type === "income" ? "bg-emerald-100" : "bg-rose-100"
                  }`}>
                    {t.type === "deposit" || t.type === "income"
                      ? <ArrowDownToLine size={16} className="text-emerald-600" />
                      : <ArrowUpFromLine size={16} className="text-rose-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{t.user}</p>
                    <p className="text-xs text-slate-500 capitalize">{t.type} · {t.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${
                      t.type === "deposit" || t.type === "income" ? "text-emerald-600" : "text-rose-500"
                    }`}>
                      {t.type === "deposit" || t.type === "income" ? "+" : "-"}GHS {t.amount}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      t.status === "approved" || t.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                      t.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>{t.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Product", href: "/admin/products", color: "bg-blue-50 text-primary border-blue-100" },
            { label: "New Announcement", href: "/admin/announcements", color: "bg-amber-50 text-amber-600 border-amber-100" },
            { label: "Review Deposits", href: "/admin/deposits", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
            { label: "Review Withdrawals", href: "/admin/withdrawals", color: "bg-rose-50 text-rose-500 border-rose-100" },
          ].map((a) => (
            <Link key={a.label} href={a.href}>
              <div className={`border rounded-2xl px-4 py-3.5 text-center font-semibold text-sm hover:shadow-md transition-all ${a.color}`}>
                {a.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
