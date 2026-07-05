"use client";
import { Image, Plus } from "lucide-react";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Banner Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage homepage carousel and promo banners</p>
        </div>
        <button className="h-10 bg-primary text-white font-bold px-4 rounded-xl shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Image size={32} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No banners found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">Upload your first promotional banner to display it on the user dashboard.</p>
      </div>
    </div>
  );
}
