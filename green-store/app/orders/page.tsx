"use client";

import React, { useState } from "react";
import TableProp from "@/components/table-prop";
import SearchInput from "@/components/search-input";
import Pagination from "@/components/pagination";
import OrderDetailModal from "./components/order-detail.modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useFilterOrderQuery } from "./hooks/order-hooks";
import { OrderResponse } from "../lib/api";

// Status badge color mapping
const getStatusColor = (status: string | null | undefined) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "hoàn thành":
      return "bg-green-100 text-green-800";
    case "pending":
    case "chờ xử lý":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
    case "đã hủy":
      return "bg-red-100 text-red-800";
    case "processing":
    case "đang xử lý":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrderPage() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  const { data, isLoading, isError } = useFilterOrderQuery({
    customerName: query || undefined,
    status: selectedStatus || undefined,
    pageNumber,
    pageSize,
  });

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

  const columns = [
    {
      header: "MÃ ĐƠN",
      render: (row: OrderResponse) => (
        <span className="font-medium">#{row.id}</span>
      ),
    },
    {
      header: "KHÁCH HÀNG",
      render: (row: OrderResponse) => (
        <span>{row.customerName || "Khách lẻ"}</span>
      ),
    },
    {
      header: "NHÂN VIÊN",
      accessor: "employeeName",
    },
    {
      header: "NGÀY ĐẶT",
      render: (row: OrderResponse) => (
        <span>{formatDate(row.orderDate)}</span>
      ),
    },
    {
      header: "TỔNG TIỀN",
      render: (row: OrderResponse) => (
        <span className="font-medium text-green-600">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
    },
    {
      header: "TRẠNG THÁI",
      render: (row: OrderResponse) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(
            row.status
          )}`}
        >
          {row.status || "N/A"}
        </span>
      ),
    },
    {
      header: "HÀNH ĐỘNG",
      render: (row: OrderResponse) => (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => {
              setSelectedOrder(row);
              setShowDetail(true);
            }}
            title="Xem chi tiết"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      ),
    },
  ];

  // Status options for filter
  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "Pending", label: "Chờ xử lý" },
    { value: "Processing", label: "Đang xử lý" },
    { value: "Completed", label: "Hoàn thành" },
    { value: "Cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Đơn hàng</h1>
      </header>

      <div className="bg-[#fffff] p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0 flex flex-wrap items-center gap-3">
            <SearchInput
              value={query}
              onSearch={(v) => {
                setQuery(v);
                setPageNumber(1);
              }}
              placeholder="Tìm theo tên khách hàng..."
              className="w-full md:w-64"
            />

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPageNumber(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showDetail && (
          <OrderDetailModal
            open={showDetail}
            order={selectedOrder}
            onClose={() => {
              setShowDetail(false);
              setSelectedOrder(null);
            }}
          />
        )}

        <TableProp
          columns={columns}
          data={data?.items ?? []}
          loading={isLoading}
          error={isError}
          skeletonRows={5}
          rowKey={(r: any) => r.id}
          selectable={false}
        />

        <Pagination
          pageNumber={data?.meta?.pageNumber ?? pageNumber}
          pageSize={data?.meta?.pageSize ?? pageSize}
          totalItems={data?.meta?.totalItems ?? 0}
          onPageChange={(p) => setPageNumber(p)}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPageNumber(1);
          }}
        />
      </div>
    </div>
  );
}
