"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon, Package, CheckCircle, Ban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    badge: "",
    price: "",
    days: "720",
    daily: "",
    total: "",
    active: true,
    image: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-calculate total income
  useEffect(() => {
    const dailyVal = Number(form.daily);
    const daysVal = Number(form.days);
    if (!isNaN(dailyVal) && !isNaN(daysVal) && dailyVal > 0 && daysVal > 0) {
      setForm(prev => ({ ...prev, total: (dailyVal * daysVal).toString() }));
    }
  }, [form.daily, form.days]);

  const filteredProducts = products.filter(p => 
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.badge || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      badge: "",
      price: "",
      days: "720",
      daily: "",
      total: "",
      active: true,
      image: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      badge: product.badge || "",
      price: product.price?.toString() || "",
      days: product.days?.toString() || "720",
      daily: product.daily?.toString() || "",
      total: product.total?.toString() || "",
      active: product.active !== false,
      image: product.image || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("vip_token");
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        const res = await fetch(`${API_URL}/api/products/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("Product deleted successfully");
          setProducts(products.filter(p => p._id !== id));
        } else {
          toast.error(data.message || "Failed to delete product");
        }
      } catch (err) {
        console.error("Delete product error:", err);
        toast.error("Network error while deleting product");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file is too large! Please choose an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("vip_token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const payload = {
        name: form.name,
        badge: form.badge,
        price: Number(form.price),
        days: Number(form.days),
        daily: Number(form.daily),
        total: Number(form.total),
        active: form.active,
        image: form.image
      };

      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(editingProduct ? "Product updated successfully!" : "Product created successfully!");
        fetchProducts();
        setIsModalOpen(false);
      } else {
        toast.error(data.message || "Failed to save product");
      }
    } catch (err) {
      console.error("Save product error:", err);
      toast.error("Network error while saving product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">VIP Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage investment plans, pricing, and product images.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-500/20 shrink-0"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Income Structure</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mb-2" />
                      <p className="text-sm text-slate-400">Loading VIP products...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package size={48} className="text-slate-300 mb-3" />
                      <p className="text-slate-500">No products found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base">{p.name}</p>
                          {p.badge && (
                            <span className="inline-block bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Price</p>
                      <p className="font-black text-indigo-700 text-base">GHS {(p.price || 0).toLocaleString()}</p>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Daily</p>
                          <p className="font-bold text-emerald-600">GHS {(p.daily || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Total ({p.days || 0}d)</p>
                          <p className="font-bold text-emerald-600">GHS {(p.total || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {p.active !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                          <Ban size={12} /> Inactive
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(p)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
              
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    {editingProduct ? <Edit2 size={20} /> : <Plus size={20} />}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1.5 shadow-sm border border-slate-200">
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer group relative overflow-hidden h-40"
                  >
                    {form.image ? (
                      <>
                        <img src={form.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-bold">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-3 group-hover:scale-110 transition-transform">
                          <ImageIcon size={24} className="text-indigo-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Click to upload image</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. VIP 1" 
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Badge Text</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Starter" 
                      value={form.badge} 
                      onChange={e => setForm({ ...form, badge: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price (GHS)</label>
                    <input 
                      type="number" 
                      placeholder="80" 
                      value={form.price} 
                      onChange={e => setForm({ ...form, price: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Duration (Days)</label>
                    <input 
                      type="number" 
                      placeholder="720" 
                      value={form.days} 
                      onChange={e => setForm({ ...form, days: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Daily Income (GHS)</label>
                    <input 
                      type="number" 
                      placeholder="20" 
                      value={form.daily} 
                      onChange={e => setForm({ ...form, daily: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      required 
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Total Income (GHS)</label>
                    <input 
                      type="number" 
                      placeholder="14400" 
                      value={form.total} 
                      onChange={e => setForm({ ...form, total: e.target.value })} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      required 
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={form.active} 
                        onChange={e => setForm({ ...form, active: e.target.checked })} 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700">Product is Active</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-1 ml-14">Active products are visible and purchasable by users.</p>
                </div>

              </form>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-75"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
