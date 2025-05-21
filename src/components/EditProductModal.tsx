// src/app/components/EditProductModal.tsx
"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/20/solid";

type EditProductModalProps = {
  product: {
    id: number;
    name: string;
    quantity: number;
  };
  onClose: () => void;
  onSave: (updated: { id: number; name: string; quantity: number }) => void;
  onDelete: (id: number) => void;
};

export default function EditProductModal({
  product,
  onClose,
  onSave,
  onDelete,
}: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(product.quantity.toString());

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all duration-300 ease-in-out scale-95 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">แก้ไขสินค้า</h3>
          <TrashIcon
            className="text-red-600 hover:underline h-5 w-5 cursor-pointer"
            onClick={() => setShowConfirmDelete(true)}
          />

          {showConfirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm animate-fadeIn">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ยืนยันการลบ
                </h3>
                <p className="text-gray-600 mb-6">
                  คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า?
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => {
                      onDelete(product.id);
                      onClose(); // ปิด modal แก้ไข
                      setShowConfirmDelete(false); // ปิด modal ยืนยัน
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ชื่อสินค้า
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="ชื่อสินค้า"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              จำนวน
            </label>
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="จำนวน"
              value={quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setQuantity(val);
                }
              }}
            />
          </div>
          <div className="flex justify-end mt-6">
            <div className="space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-gray-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  onSave({ id: product.id, name, quantity: Number(quantity) });
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
