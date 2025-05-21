// src/app/components/ProductActions.tsx
type ProductActionsProps = {
  onCreate: () => void;
  onDeleteAll: () => void;
};

export default function ProductActions({ onCreate, onDeleteAll }: ProductActionsProps) {
  return (
    <div className="text-sm mb-4 flex sm:flex-row sm:justify-between gap-2">
      <button
        onClick={onCreate}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full sm:w-auto"
      >
        เพิ่มสินค้า
      </button>

      <button
        onClick={() => {
          const confirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าทั้งหมด?");
          if (confirmed) onDeleteAll();
        }}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto"
      >
        ลบสินค้าทั้งหมด
      </button>
    </div>
  );
}
