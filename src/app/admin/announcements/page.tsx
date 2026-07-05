"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Send } from "lucide-react";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", message: "" });
  const [showForm, setShowForm] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/announcements/all`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setItems(data.announcements);
        }
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Announcement posted successfully!");
        setForm({ title: "", message: "" });
        setShowForm(false);
        fetchAnnouncements();
      } else {
        toast.error(data.message || "Failed to post announcement");
      }
    } catch (err) {
      console.error("Post error:", err);
      toast.error("Network error while posting announcement");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/announcements/${id}/toggle`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          data.announcement.published 
            ? "Announcement published!" 
            : "Announcement set to draft."
        );
        fetchAnnouncements();
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const token = localStorage.getItem("vip_token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Announcement deleted successfully!");
        fetchAnnouncements();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete announcement");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Announcements</h1>
          <p className="text-sm text-slate-500 mt-0.5">{items.length} total</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-primary/20">
          <Plus size={16} /> New
        </button>
      </div>

      {showForm && (
        <form onSubmit={handlePost} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 shadow-sm">
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Announcement title" required
            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Message content..." required rows={3}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-10 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600">Cancel</button>
            <button type="submit" className="flex-1 h-10 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Send size={14} /> Post
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-sm text-slate-400">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
            Loading announcements...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-400">No announcements created yet</div>
        ) : (
          items.map((a) => (
            <div key={a._id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">{a.title}</h3>
                  <button 
                    onClick={() => handleTogglePublish(a._id)}
                    type="button"
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer hover:opacity-85 transition-opacity ${a.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {a.published ? "Published" : "Draft"} (Toggle)
                  </button>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{a.message}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
              <button onClick={() => handleDelete(a._id)} className="w-8 h-8 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
