"use client";

import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type Branch = {
  id: number;
  name: string;
  isMain: boolean;
};

export default function BranchMenu({
  setSelectedBranch,
  reloadKey, // 👈 เพิ่มตรงนี้
}: {
  setSelectedBranch: (branch: Branch) => void;
  reloadKey: number; // 👈 และตรงนี้
}) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/branches");
        if (res.ok) {
          const data: Branch[] = await res.json();
          setBranches(data);
        } else {
          console.error("Failed to fetch branches");
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, [reloadKey]);

  // useEffect(() => {
  //   branches.forEach((branch) => {
  //     console.log(`Branch Name: ${branch.name}, isMain: ${branch.isMain}`);
  //   });
  // }, [branches]);

  // สร้าง array ใหม่และ sort ให้ isMain อยู่บนสุด

  const filteredBranches = [...branches]
  .sort((a, b) => {
    if (a.isMain === b.isMain) {
      return a.name.localeCompare(b.name, "th", { numeric: true });
    }
    return Number(b.isMain) - Number(a.isMain);
  })
  .filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
          เลือกสาขา
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-900"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5"
      >
        <div className="py-1">
          <input
            type="text"
            placeholder="ค้นหาสาขา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2"
          />

          {filteredBranches.map((branch) => (
            <MenuItem key={branch.id}>
              <button
                onClick={() => setSelectedBranch(branch)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {branch.name}
                {branch.isMain && (
                  <span className="ml-2 text-sm text-green-500">(หลัก)</span>
                )}
              </button>
            </MenuItem>
          ))}

          {filteredBranches.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500">ไม่พบสาขา</div>
          )}
        </div>
      </MenuItems>
    </Menu>
  );
}
