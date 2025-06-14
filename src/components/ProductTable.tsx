import { useState, useEffect, useMemo } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

type Product = {
  id: number;
  name: string;
  quantity: number;
  usedQty?: number;
};

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
};

export default function ProductTable({ products, onEdit }: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const [usedQuantities, setUsedQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false); // <=== เพิ่ม

  useEffect(() => {
    setUsedQuantities((prev) => {
      const updated = { ...prev };
      products.forEach((p) => {
        if (!(p.id in updated)) {
          updated[p.id] = p.usedQty ?? 0;
        }
      });
      return updated;
    });
  }, [products]);

  const currentProducts = useMemo(() => {
    return products.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [currentPage, products]);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const updateUsedQtyAPI = async (productId: number, usedQty: number) => {
    const res = await fetch("/api/products/update-used-qty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, usedQty }),
    });
    if (!res.ok) throw new Error("Failed to update usedQty");
  };

  const changeUsedQuantity = async (id: number, delta: number, max: number) => {
    if (loading) return;

    let currentUsed = usedQuantities[id] ?? 0;
    let newVal = currentUsed + delta;

    if (newVal > max) newVal = max;
    if (newVal < 0) newVal = 0;

    if (newVal === currentUsed) return;

    setUsedQuantities((prev) => ({ ...prev, [id]: newVal }));
    setLoading(true);

    // รีเซ็ต fade และ message ก่อนเริ่ม
    setIsFading(false);
    setMessage(null);

    try {
      await updateUsedQtyAPI(id, newVal);
      setMessage("อัปเดตสำเร็จ");

      // เริ่ม fade หลัง 2 วินาที
      setTimeout(() => {
        setIsFading(true);
      }, 2000);

      // ซ่อน message หลัง fade 0.5 วินาที
      setTimeout(() => {
        setMessage(null);
        setIsFading(false);
      }, 2500);

    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการอัปเดต");
      setTimeout(() => {
        setIsFading(true);
      }, 2000);
      setTimeout(() => {
        setMessage(null);
        setIsFading(false);
      }, 2500);
      setUsedQuantities((prev) => ({ ...prev, [id]: currentUsed }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <span className="text-sm text-gray-500 justify-end flex mb-2">
          จำนวนสินค้า {products.length} รายการ
        </span>
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="text-left">
              <th className="py-2 px-1 w-2"></th>
              <th className="py-2 px-2 max-w-[200px]">ชื่อสินค้า</th>
              <th className="py-2 px-2 w-18">จำนวนทั้งหมด</th>
              <th className="py-2 px-2 w-28 text-center">จำนวนที่ใช้</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-2 px-1">
                  <button
                    className="text-blue-500 text-xs hover:underline"
                    onClick={() => onEdit(product)}
                    disabled={loading}
                  >
                    แก้ไข
                  </button>
                </td>
                <td
                  className="py-2 px-2 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={product.name}
                >
                  {product.name}
                </td>
                <td className="py-2 px-2">{product.quantity}</td>
                <td className="py-2 px-2">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() =>
                        changeUsedQuantity(product.id, 1, product.quantity)
                      }
                      className="text-green-600 hover:text-green-800"
                      disabled={loading}
                      aria-label={`เพิ่มจำนวนที่ใช้ของ ${product.name}`}
                    >
                      <ChevronUpIcon className="h-5 w-5" />
                    </button>
                    <span className="text-base">
                      {usedQuantities[product.id] ?? 0}
                    </span>
                    <button
                      onClick={() =>
                        changeUsedQuantity(product.id, -1, product.quantity)
                      }
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                      aria-label={`ลดจำนวนที่ใช้ของ ${product.name}`}
                    >
                      <ChevronDownIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-4 text-sm">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1 || loading}
          className="px-2 py-1 rounded border disabled:opacity-50"
        >
          ก่อนหน้า
        </button>
        <span>
          หน้า {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || loading}
          className="px-2 py-1 rounded border disabled:opacity-50"
        >
          ถัดไป
        </button>
      </div>

      {/* Message with fade */}
      {message && (
        <div
          className="mt-2 text-center text-sm text-green-600 transition-opacity duration-500"
          style={{ opacity: isFading ? 0 : 1 }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
