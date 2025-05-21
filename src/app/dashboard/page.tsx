// src/app/page.tsx
// หน้า Home
"use client";

import { useState } from "react";
import StockTable from "@/components/StockTable";
import BranchMenu from "@/components/BranchMenu";
import CreateBranchModal from "@/components/CreateBranchModal";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Button, Menu } from "@headlessui/react";

type Branch = {
  id: number;
  name: string;
  isMain: boolean;
  products?: { id: number; name: string }[];
};

export default function Home() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleBranchCreated = (branch: Branch) => {
    setBranches((prev) => [...prev, branch]);
    setSelectedBranch(branch); // ✅ เลือกสาขาที่เพิ่งสร้าง
    setReloadKey((prev) => prev + 1); // ✅ บังคับ BranchMenu reload
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-700 p-6 gap-8 sm:p-20">
      <div className="text-sm mb-4 flex flex-row gap-4 justify-end">
        <Button
          as="div"
          className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-blue-300 ring-inset hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
        >
          สร้างสาขา
          <PlusIcon aria-hidden="true" className="-mr-1 size-5 text-white" />
        </Button>
        <BranchMenu
          setSelectedBranch={setSelectedBranch}
          reloadKey={reloadKey}
        />
      </div>

      {showCreateModal && (
        <CreateBranchModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleBranchCreated}
        />
      )}

      {selectedBranch && (
        <StockTable
          branchId={selectedBranch.id}
          branchName={selectedBranch.name}
          isMain={selectedBranch.isMain}
          setReloadKey={setReloadKey} // ✅ ส่งเข้าไป
        />
      )}
    </div>
  );
}
