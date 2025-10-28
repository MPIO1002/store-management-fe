"use client";

import React, { useEffect, useMemo, useState } from "react";
import TableProp from "@/components/table-prop";
import CreateCategoryModal from "./components/create-category.modal";
import UpdateCategoryModal from "./components/update-category.modal";
import SearchInput from "@/components/search-input";
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { useGetAllCategoryQuery } from "./hooks/category-hooks";

type ApiCategory = { categoryId: number; categoryName: string };

export default function Page() {
  const { data, isLoading, isError } = useGetAllCategoryQuery();

  const [query, setQuery] = useState("");
  // const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
  // const [deleting, setDeleting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  // const [showUpdate, setShowUpdate] = useState(false);
  // const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  // const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const columns = [
    { header: "TÊN", accessor: "categoryName" },
    {
      header: "HÀNH ĐỘNG",
      render: (row: ApiCategory) => (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              // setEditingCategory(row);
              // setShowUpdate(true);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Loại sản phẩm</h1>
      </header>

      <div className="bg-[#fffff] p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <SearchInput
              value={query}
              onChange={(v) => setQuery(v)}
              placeholder="Tìm theo tên danh mục..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* <Button
              variant="secondary"
              onClick={async () => {
                if (selectedKeys.length === 0) return;
                const ok = confirm(`Xác nhận xóa ${selectedKeys.length} mục?`);
                if (!ok) return;
                try {
                  setDeleting(true);
                  await Promise.all(selectedKeys.map((id) => deleteCategory(id)));
                  setData((prev) => prev.filter((d) => !selectedKeys.includes(d.categoryId)));
                  setSelectedKeys([]);
                } catch (err) {
                  console.error(err);
                  setError((err as any)?.message ?? true);
                } finally {
                  setDeleting(false);
                }
              }}
              disabled={deleting || selectedKeys.length === 0}
              aria-disabled={deleting || selectedKeys.length === 0}
              title={selectedKeys.length === 0 ? "Chọn mục để xóa" : `Xóa ${selectedKeys.length} mục`}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Xóa ({selectedKeys.length})</span>
            </Button> */}

            <Button variant="primary" onClick={() => setShowCreate(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <span className="ml-2">Thêm</span>
            </Button>
          </div>
        </div>

        <CreateCategoryModal
          open={showCreate}
          onClose={() => setShowCreate(false)}/>

        {/* <UpdateCategoryModal
          open={showUpdate}
          category={editingCategory}
          onClose={() => {
            setShowUpdate(false);
            setEditingCategory(null);
          }}
          onUpdated={(updated) => {
            const id = updated.categoryId ?? updated.id;
            setData((prev) => prev.map((d) => (d.categoryId === id ? {
              categoryId: updated.categoryId ?? updated.id ?? d.categoryId,
              categoryName: updated.categoryName ?? updated.name ?? d.categoryName,
            } : d)));
          }}
        /> */}

        <TableProp
          columns={columns}
          data={data || []}
          loading={isLoading}
          error={isError}
          skeletonRows={5}
          rowKey={(r) => r.categoryId}
          selectable={true}
          // onSelectionChange={(sel) => setSelectedKeys(sel)}
        />
      </div>
    </div>
  );
}
