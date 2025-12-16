"use client";

import { useGetInventoryQuery } from "../hooks/inventory-hooks";

type Props = {
  open: boolean;
  id: number | undefined;
  onClose: () => void;
};

export default function InventoryDetailModal({ open, id, onClose }: Props) {
  const { data: response, isLoading: isLoadingModel, isError } = useGetInventoryQuery(
    id as any
  );

  if (!open || !id) return null;
  if (isLoadingModel) return null;
  if (isError) return null;

  const inventory = response?.data;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    // Parse UTC time from API and convert to Vietnam timezone (UTC+7)
    const date = new Date(dateString);
    const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    
    const day = String(vietnamDate.getUTCDate()).padStart(2, '0');
    const month = String(vietnamDate.getUTCMonth() + 1).padStart(2, '0');
    const year = vietnamDate.getUTCFullYear();
    const hours = String(vietnamDate.getUTCHours()).padStart(2, '0');
    const minutes = String(vietnamDate.getUTCMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Chi tiết kho</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tên sản phẩm
            </label>
            <div className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700">
              {inventory?.productName || "N/A"}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Số lượng
            </label>
            <div className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700">
              {inventory?.quantity ?? 0}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Thời gian nhập hàng
            </label>
            <div className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700">
              {formatDate(inventory?.updatedAt)}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
