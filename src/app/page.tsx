// src/app/page.tsx
"use client";

import { useState } from "react";
import StockTable from "../components/StockTable";
import BranchMenu from "../components/BranchMenu";
import CreateBranchModal from "../components/CreateBranchModal";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Button, Menu } from "@headlessui/react";

type Branch = {
  id: number;
  name: string;
};

export default function Home() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleBranchCreated = (branch: Branch) => {
    setBranches((prev) => [...prev, branch]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex w-full justify-between items-center max-w-3xl">
        <Button
          as="div"
          className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-blue-300 ring-inset hover:bg-blue-700"
          onClick={() => setShowCreateModal(true)}
        >
          สร้างสาขา
          <PlusIcon aria-hidden="true" className="-mr-1 size-5 text-white" />
        </Button>
        <BranchMenu setSelectedBranch={setSelectedBranch} />
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
        />
      )}
    </div>
  );
}
