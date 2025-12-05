"use client";

import React, { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarcode,
  faTrash,
  faPlus,
  faMinus,
  faCreditCard,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import BarcodeScanner from "./components/barcode-scanner";
import { useCreateOrderMutation, useCreateVnpayOrderMutation } from "./hooks/payment-hooks";
import { apis } from "../lib/api/apis";
import { PaymentMethod, OrderStatus } from "../lib/api";
import { useAuth } from "../lib/auth/auth-context";

// Cart item type
type CartItem = {
  productId: number;
  productName: string;
  barcode: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export default function PaymentPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  
  // Lấy thông tin user từ auth context
  const { user } = useAuth();
  
  // Ref để lưu cartItems cho callback
  const cartItemsRef = useRef<CartItem[]>([]);
  cartItemsRef.current = cartItems;
  
  // Ref để tránh xử lý barcode nhiều lần
  const processingBarcodeRef = useRef<string | null>(null);

  const { mutateAsync: createOrder, isPending: isPendingOrder } = useCreateOrderMutation();
  const { mutateAsync: createVnpayOrder, isPending: isPendingVnpay } = useCreateVnpayOrderMutation();
  const isPending = isPendingOrder || isPendingVnpay;

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  // Add product by barcode - sử dụng ref để tránh dependency
  const addProductByBarcode = useCallback(async (barcode: string) => {
    if (!barcode.trim()) {
      toast.error("Vui lòng nhập mã barcode");
      return;
    }

    // Tránh xử lý cùng 1 barcode nhiều lần
    if (processingBarcodeRef.current === barcode) {
      return;
    }
    processingBarcodeRef.current = barcode;

    // Check if product already in cart - sử dụng ref
    const currentCart = cartItemsRef.current;
    const existingItem = currentCart.find((item) => item.barcode === barcode);
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === existingItem.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success(`Đã thêm số lượng: ${existingItem.productName}`);
      setManualBarcode("");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await apis.products.getProductByBarcode({ barcode });
      const rawData: any = response?.data;
      const product: any = rawData?.data ?? rawData;

      if (!product || !product.productId) {
        toast.error("Không tìm thấy sản phẩm với barcode này");
        return;
      }

      const newItem: CartItem = {
        productId: product.productId,
        productName: product.productName || "N/A",
        barcode: product.barcode || barcode,
        price: product.price || 0,
        quantity: 1,
        imageUrl: product.imageUrl,
      };

      setCartItems((prev) => [...prev, newItem]);
      toast.success(`Đã thêm: ${newItem.productName}`);
      setManualBarcode("");
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || "Không tìm thấy sản phẩm";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      // Reset ref sau khi xử lý xong để có thể quét lại
      setTimeout(() => {
        processingBarcodeRef.current = null;
      }, 1000);
    }
  }, []); // Không có dependency

  // Handle barcode scan
  const handleScanSuccess = useCallback((barcode: string) => {
    setShowScanner(false);
    addProductByBarcode(barcode);
  }, [addProductByBarcode]);

  // Update quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Handle checkout
  const handleCheckout = async (paymentMethod: PaymentMethod) => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    try {
      const orderData = {
        paymentMethod,
        totalAmount: total,
        discountAmount: 0,
        date: new Date().toISOString(),
        orderStatus: OrderStatus.NUMBER_0, // Pending
        userId: user?.userId,
        customerId: null,
        promotionId: null,
        listItems: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // Tiền mặt - tạo đơn hàng bình thường
      if (paymentMethod === PaymentMethod.NUMBER_0) {
        await createOrder(orderData);
        toast.success("Thanh toán thành công!");
        clearCart();
      } 
      // Chuyển khoản - dùng VNPay
      else {
        const response = await createVnpayOrder(orderData);
        const rawData: any = response?.data;
        const redirectUrl = rawData?.data?.redirectUrl ?? rawData?.redirectUrl;
        
        if (redirectUrl) {
          // Redirect sang trang thanh toán VNPay
          window.location.href = redirectUrl;
        } else {
          toast.error("Không lấy được đường dẫn thanh toán VNPay");
        }
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || "Thanh toán thất bại";
      toast.error(errorMessage);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Thanh toán</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Scanner & Cart */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scanner Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Quét sản phẩm</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowScanner(true)}
                className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FontAwesomeIcon icon={faBarcode} className="w-5 h-5" />
                <span>Mở Camera Quét</span>
              </button>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addProductByBarcode(manualBarcode);
                    }
                  }}
                  placeholder="Nhập mã barcode thủ công..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => addProductByBarcode(manualBarcode)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                Giỏ hàng ({cartItems.length} sản phẩm)
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FontAwesomeIcon icon={faBarcode} className="w-12 h-12 mb-3 opacity-30" />
                <p>Chưa có sản phẩm nào</p>
                <p className="text-sm">Quét barcode để thêm sản phẩm</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400">
                          N/A
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Barcode: {item.barcode}
                      </p>
                      <p className="text-green-600 font-medium">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-6">
            <h2 className="text-lg font-medium mb-4">Tổng đơn hàng</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleCheckout(PaymentMethod.NUMBER_0)}
                disabled={isPending || cartItems.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FontAwesomeIcon icon={faMoneyBill} />
                <span>{isPending ? "Đang xử lý..." : "Thanh toán tiền mặt"}</span>
              </button>

              <button
                onClick={() => handleCheckout(PaymentMethod.NUMBER_1)}
                disabled={isPending || cartItems.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FontAwesomeIcon icon={faCreditCard} />
                <span>{isPending ? "Đang xử lý..." : "Thanh toán thẻ"}</span>
              </button>
            </div>

            {/* Quick info */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-1">Hướng dẫn:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Nhấn "Mở Camera Quét" để quét barcode</li>
                <li>Hoặc nhập barcode thủ công</li>
                <li>Điều chỉnh số lượng bằng nút +/-</li>
                <li>Chọn phương thức thanh toán</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
