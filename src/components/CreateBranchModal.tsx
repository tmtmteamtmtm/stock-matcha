"use client";

import { useState } from "react";

type Branch = {
  id: number;
  name: string;
  isMain: boolean;
  products?: { id: number; name: string }[]; // ใส่ products ถ้าต้องการ
};

type Props = {
  onClose: () => void;
  onCreate: (branch: Branch) => void;
};

export default function CreateBranchModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [productNames, setProductNames] = useState(["item1", "item2"]);  // Default products
  const [isMain, setIsMain] = useState(false); // Checkbox for "isMain"
  const [error, setError] = useState<string | null>(null); // สำหรับแสดงข้อความเตือน

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ตรวจสอบว่าชื่อไม่เป็นค่าว่าง
    if (name.trim() === "") {
      alert("กรุณากรอกชื่อสาขาก่อนบันทึก");
      return;
    }

    try {
      // ตรวจสอบว่ามีสาขาหลักอยู่แล้วหรือไม่
      if (isMain) {
        const res = await fetch("/api/branches");
        const branches = await res.json();

        const existingMainBranch = branches.find((branch: { isMain: boolean }) => branch.isMain);

        if (existingMainBranch) {
          alert(`ไม่สามารถตั้งสาขาหลักได้ เพราะมีสาขา "${existingMainBranch.name}" เป็นหลักแล้ว`);
          return;
        }
      }

      // ส่งข้อมูลไปที่ API เพื่อสร้างสาขา
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, products: productNames, isMain }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create branch");
      }

      const data = await res.json();
      onCreate(data); // ส่งข้อมูล branch กลับไปที่ parent
      onClose();
      setName(""); // รีเซ็ตชื่อ
      setProductNames(["item1", "item2"]); // รีเซ็ตชื่อสินค้า

      window.location.reload(); // รีเฟรชหน้าเพื่อลบข้อมูลเดิม
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
        {/* ปุ่ม Checkbox สำหรับเลือก "สาขาหลัก" */}
        <div
          role="button"
          className="flex items-center w-30 rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
        >
          <label
            htmlFor="check-vertical-list-group4"
            className="flex w-full cursor-pointer items-center px-3 py-2"
          >
            <div className="inline-flex items-center">
              <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group4">
                <input
                  type="checkbox"
                  id="check-vertical-list-group4"
                  className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                  checked={isMain}
                  onChange={(e) => { setIsMain(e.target.checked); }}
                />
                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                </span>
              </label>
              <label
                className="cursor-pointer ml-2 text-slate-600 text-sm"
                htmlFor="check-vertical-list-group4"
              >
                สาขาหลัก
              </label>
            </div>
          </label>
        </div>
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
