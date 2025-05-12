// src/app/components/BranchMenu.tsx
"use client";

import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type Branch = {
  id: number;
  name: string;
};

export default function BranchMenu({
  setSelectedBranch,
}: {
  setSelectedBranch: (branch: Branch) => void;
}) {
  const [branches, setBranches] = useState<Branch[]>([]);

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
  }, []);

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
          {branches.map((branch) => (
            <MenuItem key={branch.id}>
              <button
                onClick={() => setSelectedBranch(branch)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {branch.name}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
    
  );
}
