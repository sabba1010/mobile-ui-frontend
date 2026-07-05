"use client";
import { ShieldCheck, Plus } from "lucide-react";

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Role Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage admin accounts and permissions</p>
        </div>
        <button className="h-10 bg-slate-900 text-white font-bold px-4 rounded-xl shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2">
          <Plus size={16} /> Add Admin
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Created At</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5 font-bold text-slate-900">+233 55 123 4567</td>
                <td className="px-4 py-3.5">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-lg">super_admin</span>
                </td>
                <td className="px-4 py-3.5 text-slate-500 text-xs font-medium">2026-06-30</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700">active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
