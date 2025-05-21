// src/app/components/StockTable.tsx
"use client";
import { useEffect, useState } from "react";
import BranchHeaderControls from "./BranchHeaderControls";
import ProductActions from "./ProductActions";
import ProductTable from "./ProductTable";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";

type Product = {
  id: number;
  name: string;
  quantity: number;
};

type Branch = {
  id: number;
  name: string;
  isMain: boolean;
};

export default function StockTable({
  branchId,
  branchName,
  isMain: initialIsMain,
  setReloadKey,
}: {
  branchId: number;
  branchName: string;
  isMain: boolean;
  setReloadKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [isMain, setIsMain] = useState(initialIsMain ?? false);

  // ฟังก์ชันจัดการการดึงข้อมูลผลิตภัณฑ์
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

  // ฟังก์ชันจัดการการบันทึกผลิตภัณฑ์
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

  // ฟังก์ชันจัดการการลบผลิตภัณฑ์
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

  // ฟังก์ชันจัดการการลบสินค้าทั้งหมด
  const handleDeleteAll = async () => {
    try {
      const res = await fetch(`/api/products?branchId=${branchId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete all products");

      setProducts([]);
    } catch (err) {
      console.error("Delete all products failed", err);
    }
  };

  // ฟังก์ชันจัดการการลบสาขา
  const handleDeleteBranch = async () => {
    if (isMain) {
      alert("ไม่สามารถลบสาขาหลักได้ กรุณาเปลี่ยนสาขาหลักก่อนลบ");
      return;
    }

    const confirmed = window.confirm(`ลบสาขา "${branchName}" และสินค้าทั้งหมด?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/branches?id=${branchId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete branch");

      alert("ลบสาขาสำเร็จ กรุณาเลือกสาขาใหม่หรือรีเฟรชหน้า");
      window.location.reload();
    } catch (err) {
      console.error("Delete branch failed", err);
      alert("ลบสาขาไม่สำเร็จ");
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนสถานะสาขาหลัก
  const handleToggleIsMain = async (checked: boolean) => {
    try {
      if (checked) {
        const res = await fetch("/api/branches");
        const branches: Branch[] = await res.json();
        const otherMain = branches.find((b) => b.isMain && b.id !== branchId);
        if (otherMain) {
          alert(`มีสาขาหลักอยู่แล้ว: ${otherMain.name}`);
          return;
        }
      }

      // อัปเดตสถานะใน local ก่อน
      setIsMain(checked);

      const res = await fetch("/api/branches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: branchId, isMain: checked }),
      });

      if (!res.ok) throw new Error("Failed to update isMain");

      // ✅ trigger reloadKey ให้ BranchMenu ดึงข้อมูลใหม่
      setReloadKey((prev) => prev + 1);

    } catch (err) {
      console.error("Failed to toggle main branch:", err);
      alert("เกิดข้อผิดพลาดในการอัปเดตสาขาหลัก");
    }
  };


  // ฟังก์ชันดึงข้อมูลสาขา
  const fetchBranch = async () => {
    try {
      const res = await fetch(`/api/branches?id=${branchId}`);
      const data: Branch[] = await res.json();

      const currentBranch = data.find((branch) => branch.id === branchId);
      if (currentBranch) {
        setIsMain(currentBranch.isMain);
      }
    } catch (err) {
      console.error("Failed to fetch branch:", err);
    }
  };

  // ฟังก์ชันจัดการการสร้างสินค้า
  const handleCreate = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  useEffect(() => {
    fetchBranch();
  }, [branchId]);

  useEffect(() => {
    fetchProducts();
  }, [branchId]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-4 sm:p-6 mx-auto">
      <BranchHeaderControls
        isMain={isMain}
        branchName={branchName}
        onToggleMain={handleToggleIsMain}
        onDeleteBranch={handleDeleteBranch}
      />
      <ProductActions onCreate={() => setShowCreateProductModal(true)} onDeleteAll={handleDeleteAll} />
      {loading ? (
        <p className="text-gray-500">กำลังโหลดข้อมูลสินค้า...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">ไม่มีสินค้าในสาขานี้</p>
      ) : (
        <ProductTable products={products} onEdit={setEditingProduct} />
      )}

      {showCreateProductModal && (
        <CreateProductModal onClose={() => setShowCreateProductModal(false)} onCreate={handleCreate} branchId={branchId} />
      )}

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}
