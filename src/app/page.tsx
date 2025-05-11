"use client";

import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Home() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
            สต็อกสินค้า
            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          <div className="py-1">
            <MenuItem>
              <button
                onClick={() => setSelectedBranch("สาขาที่ 1")}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
              >
                สาขาที่ 1
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => setSelectedBranch("สาขาที่ 2")}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
              >
                สาขาที่ 2
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => setSelectedBranch("สาขาที่ 3")}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
              >
                สาขาที่ 3
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>

      {selectedBranch && (
        <div className="w-full max-w-4xl bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">
            สต็อกสินค้า {selectedBranch}
          </h1>
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">สินค้า</th>
                <th className="border px-4 py-2">จำนวน</th>
                <th className="border px-4 py-2">ราคา</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">สินค้า 1</td>
                <td className="border px-4 py-2">10</td>
                <td className="border px-4 py-2">100</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">สินค้า 2</td>
                <td className="border px-4 py-2">20</td>
                <td className="border px-4 py-2">200</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">สินค้า 3</td>
                <td className="border px-4 py-2">30</td>
                <td className="border px-4 py-2">300</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
