"use client";

import { OrderResponse, OrderItemResponse } from "@/app/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
  open: boolean;
  order: OrderResponse | null;
  onClose: () => void;
};

// Status badge color mapping
const getStatusColor = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case "paid":
    case "đã thanh toán":
      return "bg-green-100 text-green-800";
    case "pending":
    case "chờ xử lý":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
    case "đã hủy":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Translate status to Vietnamese
const getStatusLabel = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "Đã thanh toán";
    case "pending":
      return "Chờ xử lý";
    case "cancelled":
      return "Đã hủy";
    default:
      return status || "N/A";
  }
};

export default function OrderDetailModal({ open, order, onClose }: Props) {
  if (!open || !order) return null;

  const formatCurrency = (amount: number | undefined) => {
    return (amount ?? 0).toLocaleString("vi-VN") + " đ";
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chi tiết đơn hàng #{order.id}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Khách hàng</p>
            <p className="font-medium">{order.customerName || "Khách lẻ"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nhân viên</p>
            <p className="font-medium">{order.employeeName || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ngày đặt</p>
            <p className="font-medium">{formatDate(order.orderDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trạng thái</p>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Sản phẩm</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">
                    Sản phẩm
                  </th>
                  <th className="text-right px-4 py-2 text-sm font-medium text-gray-600">
                    Đơn giá
                  </th>
                  <th className="text-center px-4 py-2 text-sm font-medium text-gray-600">
                    SL
                  </th>
                  <th className="text-right px-4 py-2 text-sm font-medium text-gray-600">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.listItem && order.listItem.length > 0 ? (
                  order.listItem.map((item: OrderItemResponse, index: number) => (
                    <tr key={item.id || index}>
                      <td className="px-4 py-3 text-sm">
                        {item.productName || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium">
                        {formatCurrency(item.subTotal)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                      Không có sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giảm giá:</span>
                  <span className="text-red-600">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
