"use client";

import { useMemo } from "react";
import { useGetRevenueQuery, useGetTopSellerProductQuery } from "./hooks/statistic-hooks";

function MiniBar({ values = [4, 6, 8, 5, 7] }: { values?: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {values.map((v, i) => (
        <div key={i} className="bg-green-600" style={{ width: 6, height: `${(v / max) * 100}%`, borderRadius: 3 }} />
      ))}
    </div>
  );
}

export default function Home() {
  const now = new Date();
  
  // Query dữ liệu cả năm cho chart
  const { data: yearRevenueData, isLoading: yearLoading, refetch: refetchYear } = useGetRevenueQuery({
    year: now.getFullYear(),
  });
  
  // Query dữ liệu hôm nay
  const { data: todayRevenueData, isLoading: todayLoading, refetch: refetchToday } = useGetRevenueQuery({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
  
  const { data: topSellerData, isLoading: topSellerLoading, refetch: refetchTopSeller } = useGetTopSellerProductQuery(5);

  const handleRefresh = () => {
    refetchYear();
    refetchToday();
    refetchTopSeller();
  };
  
  const revenueLoading = yearLoading || todayLoading;

  // Tính tổng doanh thu trong năm
  const totalRevenue = useMemo(() => {
    if (!yearRevenueData?.data) return 0;
    return yearRevenueData.data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  }, [yearRevenueData]);

  // Tính tổng đơn hàng (tổng số sản phẩm bán ra trong năm)
  const totalOrders = useMemo(() => {
    if (!yearRevenueData?.data) return 0;
    return yearRevenueData.data.reduce((sum, item) => sum + (item.totalSold || 0), 0);
  }, [yearRevenueData]);

  // Lấy doanh thu hôm nay từ query riêng
  const todayRevenue = useMemo(() => {
    if (!todayRevenueData?.data || todayRevenueData.data.length === 0) return 0;
    // API trả về dữ liệu hôm nay với day parameter
    return todayRevenueData.data[0]?.revenue || 0;
  }, [todayRevenueData]);

  // Chuẩn bị dữ liệu cho chart (từ dữ liệu năm - theo tháng)
  const chartData = useMemo(() => {
    if (!yearRevenueData?.data) return [];
    return yearRevenueData.data
      .map((item) => {
        // paymentDate format: "2025-12" hoặc "2025-01"
        const monthNum = item.paymentDate ? parseInt(item.paymentDate.split('-')[1]) : 0;
        return {
          month: monthNum,
          revenue: item.revenue || 0,
          label: item.paymentDate || '',
        };
      })
      .sort((a, b) => a.month - b.month);
  }, [yearRevenueData]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " đ";
  };

  const kpis = [
    { label: "Doanh thu (Hôm nay)", value: formatCurrency(todayRevenue), diff: "+8%" },
    { label: "Tổng đơn hàng (Năm)", value: totalOrders.toString(), diff: "+3%" },
    { label: "Doanh thu (Năm)", value: formatCurrency(totalRevenue), diff: "+12%" },
    { label: "Sản phẩm bán chạy", value: topSellerData?.data?.length?.toString() || "0", diff: "+5%" },
  ];

  return (
    <div className="mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Bảng thống kê</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          disabled={revenueLoading || topSellerLoading}
        >
          <svg
            className={`w-4 h-4 ${revenueLoading || topSellerLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Làm mới
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
            <div className="text-sm text-gray-500">{k.label}</div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold">{revenueLoading ? "..." : k.value}</div>
                <div className="text-xs text-green-600">{k.diff}</div>
              </div>
              <MiniBar />
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Doanh thu theo tháng (Năm {now.getFullYear()})</h2>
          {revenueLoading ? (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="text-gray-400">Đang tải...</div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="w-full h-48 flex items-center justify-center">
              <div className="text-gray-400">Không có dữ liệu</div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-b from-white to-green-50 rounded p-4">
              <svg width="100%" height="100%" viewBox="0 0 600 150" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="0" x2="600" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="37.5" x2="600" y2="37.5" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="112.5" x2="600" y2="112.5" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="150" x2="600" y2="150" stroke="#e5e7eb" strokeWidth="1" />

                {/* Revenue line */}
                <polyline
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3"
                  points={chartData
                    .map((item, index) => {
                      const x = (index / (chartData.length - 1 || 1)) * 600;
                      const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
                      const y = 150 - (item.revenue / maxRevenue) * 140;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {/* Data points */}
                {chartData.map((item, index) => {
                  const x = (index / (chartData.length - 1 || 1)) * 600;
                  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);
                  const y = 150 - (item.revenue / maxRevenue) * 140;
                  return (
                    <circle key={index} cx={x} cy={y} r="4" fill="#16a34a" />
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Top sản phẩm bán chạy</h2>
          {topSellerLoading ? (
            <div className="text-gray-400 text-center py-4">Đang tải...</div>
          ) : !topSellerData?.data || topSellerData.data.length === 0 ? (
            <div className="text-gray-400 text-center py-4">Không có dữ liệu</div>
          ) : (
            <ul className="space-y-3">
              {topSellerData.data.map((product, index) => (
                <li key={product.productId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center font-bold text-green-600">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{product.productName || "N/A"}</div>
                      <div className="text-xs text-gray-500">{product.totalSold || 0} bán</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

