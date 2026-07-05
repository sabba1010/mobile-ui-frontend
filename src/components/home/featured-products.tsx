"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Show active products only, up to 2
          const activeProds = data.products.filter((p: any) => p.active !== false);
          setProducts(activeProds.slice(0, 2));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch featured products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-4 space-y-4">
      {loading ? (
        <div className="text-center text-xs text-slate-400 py-6">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
          Loading featured products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-xs text-slate-500 py-6">
          No investment plans available at the moment.
        </div>
      ) : (
        products.map((product) => (
          <Card key={product._id} className="border-0 shadow-md shadow-slate-200/50 rounded-[20px] overflow-hidden">
            <div className="flex">
              {/* Image Section */}
              <div className="w-2/5 relative h-36 bg-slate-100">
                <img 
                  src={product.image || "https://images.unsplash.com/photo-1596766487920-56d11a2fdfcf?q=80&w=200&auto=format&fit=crop"} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <Zap size={10} />
                  {product.name}
                </div>
              </div>
              
              {/* Content Section */}
              <div className="w-3/5 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">Investment Plan {product.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Price:</span>
                      <span className="font-bold text-primary">GHS {(product.price || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Daily:</span>
                      <span className="font-bold text-emerald-600">GHS {(product.daily || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Total:</span>
                      <span className="font-bold text-slate-700">GHS {(product.total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Link href={`/products/${product._id}`} className="mt-2">
                  <Button size="sm" className="w-full h-8 rounded-lg text-xs shadow-sm">
                    Invest Now
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
