"use client";

import React, { useState } from "react";
import TableProp from "@/components/table-prop";
import SearchInput from "@/components/search-input";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import CreateProductModal from "./components/create-product.modal";
import UpdateProductModal from "./components/update-product.modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {
  useFilterProductQuery,
  useDeleteProductMutation,
} from "./hooks/product-hooks";
import { useGetAllCategoryQuery } from "../categories/hooks/category-hooks";
import { useGetAllSupplierQuery } from "../suppliers/hooks/supplier-hooks";
import { ProductResponse } from "../lib/api";
import { toast } from "sonner";
import ConfirmModal from "@/components/confirm-alert";

export default function ProductPage() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | undefined>(undefined);

  // Fetch categories and suppliers for filter dropdowns
  const { data: categoryData } = useGetAllCategoryQuery({ pageNumber: 1, pageSize: 100 });
  const { data: supplierData } = useGetAllSupplierQuery({ pageNumber: 1, pageSize: 100 });

  const categories = (categoryData?.data?.items ?? []) as any[];
  const suppliers = (supplierData?.items ?? []) as any[];

  const { data, isLoading, isError } = useFilterProductQuery({
    productName: query,
    categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
    supplierIds: selectedSupplierId ? [selectedSupplierId] : undefined,
    pageNumber,
    pageSize,
  });
  const { mutateAsync: deleteProductAsync, isPending: isDeleting } = useDeleteProductMutation();

  const columns = [
    {
      header: "ẢNH",
      render: (row: ProductResponse) => (
        <div className="w-12 h-12">
          {row.imageUrl ? (
            <img
              src={row.imageUrl}
              alt={row.productName || ""}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
              N/A
            </div>
          )}
        </div>
      ),
    },
    { header: "TÊN SẢN PHẨM", accessor: "productName" },
    { header: "DANH MỤC", accessor: "categoryName" },
    { header: "BARCODE", accessor: "barcode" },
    {
      header: "GIÁ",
      render: (row: ProductResponse) => (
        <span>{row.price?.toLocaleString("vi-VN")} đ</span>
      ),
    },
    { header: "ĐƠN VỊ", accessor: "unit" },
    {
      header: "HÀNH ĐỘNG",
      render: (row: ProductResponse) => (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setEditingProduct(row);
              setShowUpdate(true);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    if (selectedKeys.length === 0) return;
    try {
      await Promise.all(selectedKeys.map((id) => deleteProductAsync(id as number)));
      toast.success("Xóa sản phẩm thành công", { description: "Success" });
      setSelectedKeys([]);
      setConfirmDeleteOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa", { description: "Error" });
    }
  };

  return (
    <div className="mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Sản phẩm</h1>
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
              placeholder="Tìm theo tên sản phẩm..."
              className="w-full md:w-64"
            />

            {/* Category Filter */}
            <select
              value={selectedCategoryId ?? ""}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined);
                setPageNumber(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat: any) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            {/* Supplier Filter */}
            <select
              value={selectedSupplierId ?? ""}
              onChange={(e) => {
                setSelectedSupplierId(e.target.value ? Number(e.target.value) : undefined);
                setPageNumber(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả nhà cung cấp</option>
              {suppliers.map((sup: any) => (
                <option key={sup.supplierId} value={sup.supplierId}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={isDeleting || selectedKeys.length === 0}
              aria-disabled={isDeleting || selectedKeys.length === 0}
              title={selectedKeys.length === 0 ? "Chọn mục để xóa" : `Xóa ${selectedKeys.length} mục`}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Xóa ({selectedKeys.length})</span>
            </Button>

            <Button variant="primary" onClick={() => setShowCreate(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <span className="ml-2">Thêm</span>
            </Button>
          </div>
        </div>

        {confirmDeleteOpen && (
          <ConfirmModal
            open={confirmDeleteOpen}
            message={`Xác nhận xóa ${selectedKeys.length} sản phẩm?`}
            title="Xác nhận xóa"
            disabled={isDeleting}
            onConfirm={handleDelete}
            onCancel={() => setConfirmDeleteOpen(false)}
          />
        )}

        {showCreate && (
          <CreateProductModal
            open={showCreate}
            onClose={() => setShowCreate(false)}
          />
        )}

        {showUpdate && (
          <UpdateProductModal
            open={showUpdate}
            id={editingProduct?.productId}
            onClose={() => {
              setShowUpdate(false);
              setEditingProduct(null);
            }}
          />
        )}

        <TableProp
          columns={columns}
          data={data?.items ?? []}
          loading={isLoading}
          error={isError}
          skeletonRows={5}
          rowKey={(r: any) => r.productId}
          selectable={true}
          onSelectionChange={(sel) => setSelectedKeys(sel)}
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
