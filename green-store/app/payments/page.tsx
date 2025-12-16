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
  
  // Customer lookup states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [isLookingUpCustomer, setIsLookingUpCustomer] = useState(false);
  const [hasSearchedCustomer, setHasSearchedCustomer] = useState(false);
  
  // Promotion code states
  const [availablePromotions, setAvailablePromotions] = useState<any[]>([]);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string>("");
  const [appliedPromotion, setAppliedPromotion] = useState<any>(null);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
  
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
  const discount = appliedPromotion ? (appliedPromotion.discountType === "Percentage" ? subtotal * (appliedPromotion.discountValue / 100) : appliedPromotion.discountValue) : 0;
  const total = subtotal - discount;

  // Auto-fetch promotions when subtotal changes
  React.useEffect(() => {
    const fetchPromotions = async () => {
      if (subtotal === 0) {
        setAvailablePromotions([]);
        setAppliedPromotion(null);
        setSelectedPromotionId("");
        return;
      }

      try {
        setIsLoadingPromotions(true);
        const response = await apis.promotions.getAllPromotions({ minOrderAmount: subtotal });
        const rawData: any = response?.data;
        const promotions: any[] = rawData?.data ?? rawData;

        setAvailablePromotions(promotions || []);
        
        // Remove applied promotion if it's no longer valid
        if (appliedPromotion && !promotions?.find((p: any) => p.promoId === appliedPromotion.promoId)) {
          setAppliedPromotion(null);
          setSelectedPromotionId("");
          toast.info("Mã khuyến mãi không còn hợp lệ với đơn hàng hiện tại");
        }
      } catch (err: any) {
        console.error(err);
        setAvailablePromotions([]);
      } finally {
        setIsLoadingPromotions(false);
      }
    };

    fetchPromotions();
  }, [subtotal]);

  // Lookup customer by phone
  const lookupCustomer = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setIsLookingUpCustomer(true);
      const response = await apis.customers.getCustomerByPhone({ phone: phoneNumber });
      const rawData: any = response?.data;
      const customerData: any = rawData?.data ?? rawData;

      if (customerData && customerData.customerId) {
        setCustomer(customerData);
        toast.success(`Tìm thấy khách hàng: ${customerData.name}`);
      } else {
        setCustomer(null);
        toast.warning("Chưa có đăng ký thành viên");
      }
    } catch (err: any) {
      console.error(err);
      setCustomer(null);
      toast.warning("Chưa có đăng ký thành viên");
    } finally {
      setIsLookingUpCustomer(false);
      setHasSearchedCustomer(true);
    }
  };

  // Apply selected promotion
  const applyPromotion = () => {
    if (!selectedPromotionId) {
      toast.error("Vui lòng chọn mã khuyến mãi");
      return;
    }

    const promotion = availablePromotions.find((p: any) => p.promoId.toString() === selectedPromotionId);
    if (promotion) {
      setAppliedPromotion(promotion);
      toast.success(`Áp dụng mã khuyến mãi: ${promotion.description}`);
    }
  };

  // Remove applied promotion
  const removePromotion = () => {
    setAppliedPromotion(null);
    setSelectedPromotionId("");
    toast.info("Đã xóa mã khuyến mãi");
  };

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

    if (!user?.userId) {
      toast.error("Vui lòng đăng nhập để thực hiện thanh toán");
      return;
    }

    try {
      const orderData = {
        paymentMethod,
        totalAmount: total,
        discountAmount: discount,
        date: new Date().toISOString(),
        orderStatus: OrderStatus.NUMBER_0, // Pending
        userId: user.userId,
        customerId: customer?.customerId ?? null,
        promotionId: appliedPromotion?.promoId ?? null,
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
        setCustomer(null);
        setPhoneNumber("");
        setHasSearchedCustomer(false);
        setAppliedPromotion(null);
        setSelectedPromotionId("");
        setAvailablePromotions([]);
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

          {/* Customer Lookup Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Thông tin khách hàng</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (e.target.value === "") {
                    setHasSearchedCustomer(false);
                    setCustomer(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    lookupCustomer();
                  }
                }}
                placeholder="Nhập số điện thoại khách hàng..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={lookupCustomer}
                disabled={isLookingUpCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLookingUpCustomer ? "Đang tìm..." : "Tìm kiếm"}
              </button>
            </div>
            {customer ? (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 font-medium">✓ Khách hàng: {customer.name}</p>
                <p className="text-sm text-green-600">Email: {customer.email || "N/A"}</p>
              </div>
            ) : hasSearchedCustomer && phoneNumber && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-700 text-sm">⚠ Chưa có đăng ký thành viên</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-6">
            <h2 className="text-lg font-medium mb-4">Tổng đơn hàng</h2>

            {/* Cart Items Summary */}
            {cartItems.length > 0 && (
              <div className="mb-4 pb-4 border-b max-h-60 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sản phẩm ({cartItems.length})</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between items-start text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate">{item.productName}</p>
                        <p className="text-gray-500 text-xs">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <p className="text-gray-900 font-medium ml-2">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promotion Code Section */}
            <div className="mb-4 pb-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Mã khuyến mãi</h3>
                {isLoadingPromotions && (
                  <span className="text-xs text-blue-600">Đang tải...</span>
                )}
              </div>
              {availablePromotions.length > 0 && !appliedPromotion && (
                <div className="space-y-2">
                  <select
                    value={selectedPromotionId}
                    onChange={(e) => setSelectedPromotionId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Chọn mã khuyến mãi --</option>
                    {availablePromotions.map((promo: any) => (
                      <option key={promo.promoId} value={promo.promoId}>
                        {promo.promoCode} - {promo.description} ({promo.discountType === "Percentage" 
                          ? `${promo.discountValue}%` 
                          : formatCurrency(promo.discountValue)})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={applyPromotion}
                    disabled={!selectedPromotionId}
                    className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Áp dụng
                  </button>
                </div>
              )}
              {availablePromotions.length === 0 && subtotal > 0 && !isLoadingPromotions && (
                <p className="text-xs text-gray-500">Không có mã khuyến mãi phù hợp</p>
              )}
              {subtotal === 0 && (
                <p className="text-xs text-gray-500">Thêm sản phẩm để xem mã khuyến mãi</p>
              )}
              {appliedPromotion && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm text-green-700 font-medium">✓ {appliedPromotion.promoCode}</p>
                    <button
                      onClick={removePromotion}
                      className="text-red-600 hover:text-red-700 text-xs"
                    >
                      Xóa
                    </button>
                  </div>
                  <p className="text-xs text-green-600">{appliedPromotion.description}</p>
                  <p className="text-xs text-green-600">
                    Giảm: {appliedPromotion.discountType === "Percentage" 
                      ? `${appliedPromotion.discountValue}%` 
                      : formatCurrency(appliedPromotion.discountValue)}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
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
