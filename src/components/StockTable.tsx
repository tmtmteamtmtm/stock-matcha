// src/app/components/StockTable.tsx
"use client";

import { useEffect, useState } from "react";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";

type Product = {
  id: number;
  name: string;
  quantity: number;
};

export default function StockTable({
  branchId,
  branchName,
}: {
  branchId: number;
  branchName: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);

  const handleSave = async (updated: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCreate = (newProduct: {
    id: number;
    name: string;
    quantity: number;
  }) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`/api/products?branchId=${branchId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete all products");

      // รีเฟรชรายการสินค้าหลังจากลบ
      setProducts([]);
    } catch (err) {
      console.error("Delete all products failed", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?branchId=${branchId}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [branchId]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        สินค้าของ {branchName}
      </h2>

      <div className="text-sm mb-4 flex flex-col sm:flex-row sm:justify-between gap-2">
        <button
          onClick={() => setShowCreateProductModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full sm:w-auto"
        >
          เพิ่มสินค้า
        </button>

        <button
          onClick={() => {
            const confirmed = window.confirm(
              "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าทั้งหมด?"
            );
            if (confirmed) {
              handleDeleteAll();
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto"
        >
          ลบสินค้าทั้งหมด
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">กำลังโหลดข้อมูลสินค้า...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">ไม่มีสินค้าในสาขานี้</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">แก้ไข/ลบ</th>
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">ชื่อสินค้า</th>
                <th className="py-2 px-4">จำนวน</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={product.id} className="border-t">
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setEditingProduct(product)}
                    >
                      แก้ไข
                    </button>
                  </td>
                  <td className="py-2 px-4">{i + 1}</td>
                  <td
                    className="py-2 px-4 max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis"
                    title={product.name}
                  >
                    {product.name}
                  </td>
                  <td className="py-2 px-4">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateProductModal && (
        <CreateProductModal
          onClose={() => setShowCreateProductModal(false)}
          onCreate={handleCreate}
          branchId={branchId}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
