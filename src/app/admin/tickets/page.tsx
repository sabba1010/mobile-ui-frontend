"use client";

import { useEffect, useState } from "react";
import { HeadphonesIcon, Calendar, Clock, Landmark, CheckCircle, Clock3 } from "lucide-react";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/admin/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTickets(data.tickets || []);
        }
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolve = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "pending" ? "resolved" : "pending";
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user/admin/ticket/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Ticket status marked as ${nextStatus}!`);
        fetchTickets();
      } else {
        toast.error(data.message || "Failed to update ticket");
      }
    } catch (err) {
      toast.error("Network error while updating ticket");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-2" />
        Loading support tickets...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Support Tickets</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage and resolve user deposit issues</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HeadphonesIcon size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Inbox Zero!</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">You have no pending support tickets to review at this time.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Time of Payment</th>
                  <th className="p-4">Send & Receive Wallets</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-slate-50/20">
                    <td className="p-4 font-bold text-slate-800">
                      {ticket.userPhone}
                    </td>
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Calendar size={13} />
                        {ticket.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={13} />
                        {ticket.time}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-600">From: <strong className="text-slate-700">{ticket.userWallet}</strong></div>
                      <div className="text-slate-500 text-xs mt-0.5">To: {ticket.platformWallet}</div>
                    </td>
                    <td className="p-4 text-right font-black text-emerald-600">
                      GHS {ticket.amount}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${ticket.status === 'resolved' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {ticket.status === 'resolved' ? (
                          <>
                            <CheckCircle size={12} /> Resolved
                          </>
                        ) : (
                          <>
                            <Clock3 size={12} /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleResolve(ticket._id, ticket.status)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border shadow-sm transition-all ${ticket.status === 'resolved' ? "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200" : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"}`}
                      >
                        {ticket.status === 'resolved' ? "Reopen" : "Mark Resolved"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
