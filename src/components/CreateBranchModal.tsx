// src/app/components/CreateBranchModal.tsx
"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (branch: { id: number; name: string }) => void;
};

export default function CreateBranchModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create branch");
      }

      const data = await res.json();
      onCreate(data); // ส่ง branch ใหม่กลับไปที่ parent
      onClose();
      setName("");

      window.location.reload();
    } catch (err) {
      console.error("Create branch failed:", err);
      alert("Failed to create branch. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all duration-300 ease-in-out scale-95 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4">สร้างสาขาใหม่</h3>
        <input
          type="text"
          placeholder="ชื่อสาขา"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            สร้าง
          </button>
        </div>
      </div>
    </div>
  );
}
