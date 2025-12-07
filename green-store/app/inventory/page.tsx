"use client";

import React, { useState } from "react";
import TableProp from "@/components/table-prop";
import SearchInput from "@/components/search-input";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import CreateInventoryModal from "./components/create-inventory.modal";
import UpdateInventoryModal from "./components/update-inventory.modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {
  useFilterInventoryQuery,
  useDeleteInventoryMutation,
} from "./hooks/inventory-hooks";
import { InventoryResponse } from "../lib/api";
import { toast } from "sonner";
import ConfirmModal from "@/components/confirm-alert";

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editingInventory, setEditingInventory] = useState<InventoryResponse | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useFilterInventoryQuery({
    productName: query,
    pageNumber,
    pageSize,
  });
  const { mutateAsync: deleteInventoryAsync, isPending: isDeleting } =
    useDeleteInventoryMutation();

  const columns = [
    {
      header: "TÊN SẢN PHẨM",
      // Use productName directly from API response
      accessor: "productName",
    },
    { header: "SỐ LƯỢNG", accessor: "quantity" },
    {
      header: "HÀNH ĐỘNG",
      render: (row: InventoryResponse) => (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setEditingInventory(row);
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
      await Promise.all(selectedKeys.map((id) => deleteInventoryAsync(id as number)));
      toast.success("Xóa kho thành công", { description: "Success" });
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
        <h1 className="text-2xl font-semibold">Kho</h1>
      </header>

      <div className="bg-[#fffff] p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <SearchInput
              value={query}
              onSearch={(v: string) => {
                setQuery(v);
                setPageNumber(1); // Reset về trang 1 khi search
              }}
              placeholder="Tìm theo tên sản phẩm..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmDeleteOpen(true);
              }}
              disabled={isDeleting || selectedKeys.length === 0}
              aria-disabled={isDeleting || selectedKeys.length === 0}
              title={
                selectedKeys.length === 0 ? "Chọn mục để xóa" : `Xóa ${selectedKeys.length} mục`
              }
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
            message={`Xác nhận xóa ${selectedKeys.length} mục?`}
            title="Xác nhận xóa"
            disabled={isDeleting}
            onConfirm={() => {
              handleDelete();
            }}
            onCancel={() => setConfirmDeleteOpen(false)}
          />
        )}

        {showCreate && (
          <CreateInventoryModal
            open={showCreate}
            onClose={() => setShowCreate(false)}
          />
        )}

        <TableProp
          columns={columns}
          data={data?.items ?? []}
          loading={isLoading}
          error={isError}
          skeletonRows={5}
          rowKey={(r: any) => r.inventoryId ?? r.productId}
          selectable={true}
          onSelectionChange={(sel) => setSelectedKeys(sel)}
        />

        {showUpdate && (
          <UpdateInventoryModal
            open={showUpdate}
            id={editingInventory?.inventoryId}
            onClose={() => {
              setShowUpdate(false);
              setEditingInventory(null);
            }}
          />
        )}

        {/* Pagination controls */}
        <Pagination
          pageNumber={data?.meta?.pageNumber ?? pageNumber}
          pageSize={data?.meta?.pageSize ?? pageSize}
          totalItems={data?.meta?.totalItems ?? (data?.items?.length ?? 0)}
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
