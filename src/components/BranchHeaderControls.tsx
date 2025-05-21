// src/app/components/BranchHeaderControls.tsx
import { TrashIcon } from "@heroicons/react/20/solid";

type BranchHeaderControlsProps = {
  isMain: boolean;
  branchName: string;
  onToggleMain: (checked: boolean) => void;
  onDeleteBranch: () => void;
};

export default function BranchHeaderControls({
  isMain,
  branchName,
  onToggleMain,
  onDeleteBranch,
}: BranchHeaderControlsProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">

        <div className="text-2xl font-bold text-gray-700">
          สาขา: {branchName}
        </div>
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-1">
            <TrashIcon className="text-red-600 hover:underline h-4 w-4 cursor-pointer" />
            <label
              className="text-xs text-red-600 hover:underline cursor-pointer"
              onClick={onDeleteBranch}
            >
              ลบสาขานี้
            </label>
          </div>
        </div>
      </div>
      <div
          role="button"
          className="flex w-30 items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
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
                  onChange={(e) => { onToggleMain(e.target.checked); }}
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
    </div>
  );
}
