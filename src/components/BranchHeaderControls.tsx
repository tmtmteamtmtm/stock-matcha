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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-slate-300 checked:bg-slate-800"
                checked={isMain}
                onChange={(e) => onToggleMain(e.target.checked)}
              />
              <span className="text-sm text-slate-600">สาขาหลัก</span>
            </label>
          </div>
        </label>
      </div>
    </div>
  );
}
