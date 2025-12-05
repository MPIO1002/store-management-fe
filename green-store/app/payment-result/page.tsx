"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Button from "@/components/button";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  const isSuccess = status === "success";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div
        className={`bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center transform transition-all duration-500 ease-out ${
          mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Icon */}
        <div className="mb-6">
          {isSuccess ? (
            <div
              className={`mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center transform transition-all duration-700 delay-200 ${
                mounted ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              <svg
                className={`w-10 h-10 text-green-600 transition-all duration-500 delay-500 ${
                  mounted ? "opacity-100 stroke-dashoffset-0" : "opacity-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  strokeDasharray: 50,
                  strokeDashoffset: mounted ? 0 : 50,
                  transition: "stroke-dashoffset 0.6s ease-out 0.5s",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div
              className={`mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center transform transition-all duration-700 delay-200 ${
                mounted ? "scale-100" : "scale-0"
              }`}
            >
              <svg
                className={`w-10 h-10 text-red-600 transition-all duration-300 delay-500 ${
                  mounted ? "opacity-100 animate-shake" : "opacity-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-bold mb-2 transition-all duration-500 delay-300 ${
            isSuccess ? "text-green-600" : "text-red-600"
          } ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
        </h1>

        {/* Description */}
        <p
          className={`text-gray-600 mb-2 transition-all duration-500 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {isSuccess
            ? "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xử lý thành công."
            : "Rất tiếc, đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."}
        </p>

        {/* Order ID */}
        {orderId && (
          <p
            className={`text-gray-500 mb-6 transition-all duration-500 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            Mã đơn hàng: <span className="font-semibold">#{orderId}</span>
          </p>
        )}

        {/* Button */}
        <Button
          variant="primary"
          size="lg"
          className={`w-full mt-4 transition-all duration-500 delay-600 hover:scale-105 active:scale-95 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          onClick={() => router.push("/payments")}
        >
          Quay về trang thanh toán
        </Button>
      </div>

      {/* Background confetti effect for success */}
      {isSuccess && mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#22c55e", "#16a34a", "#86efac", "#4ade80"][
                  i % 4
                ],
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
