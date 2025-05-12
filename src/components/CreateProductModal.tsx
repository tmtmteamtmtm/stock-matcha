import { useState } from "react";

type CreateProductModalProps = {
  onClose: () => void;
  onCreate: (product: { id: number; name: string; quantity: number }) => void;
  branchId: number;
};

export default function CreateProductModal({
  onClose,
  onCreate,
  branchId,
}: CreateProductModalProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newProduct = { name, quantity, branchId };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const data = await res.json();
      onCreate(data); // ได้ product ที่มี id
      onClose();
    } catch (err) {
      console.error("Create product failed:", err);
      alert("Failed to create product. Please try again.");
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h3 className="text-lg font-semibold mb-4">เพิ่มสินค้าใหม่</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">ชื่อสินค้า</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="ชื่อสินค้า"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">จำนวน</label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="จำนวน"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              เพิ่มสินค้า
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
