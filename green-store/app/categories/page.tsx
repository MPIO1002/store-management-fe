"use client";

import { useState } from "react";
import TableProp from "@/components/table-prop";
import CreateCategoryModal from "./components/create-category.modal";
import UpdateCategoryModal from "./components/update-category.modal";
import SearchInput from "@/components/search-input";
import Button from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { useDeleteCategoryMutation, useFilterCategoryQuery } from "./hooks/category-hooks";
import { CategoryResponse } from "../lib/api";
import Pagination from "@/components/pagination";
import { PaginationData } from "../lib/api/schema/pagination";
import { toast } from "sonner";

export default function CategoryPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useFilterCategoryQuery({ categoryName: query, pageNumber: page, pageSize: pageSize });
  const paginateData = data?.data as PaginationData;

  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);

  const { mutateAsync: deleteCategoryAsync } = useDeleteCategoryMutation();

  const handleDelete = async () => {
    if (selectedKeys.length === 0) return;
    try {
      await Promise.all(selectedKeys.map((id) => deleteCategoryAsync(id as number)));
      toast.success("Xóa loại sản phẩm thành công", { description: "Success" });
      setSelectedKeys([]);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa", { description: "Error" });
    }
  };

  const columns = [
    { header: "TÊN", accessor: "categoryName" },
    {
      header: "HÀNH ĐỘNG",
      render: (row: CategoryResponse) => (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setEditingCategory(row);
              setShowUpdate(true);
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
              onSearch={(v) => {
                setQuery(v);
                setPage(1); // Reset về trang 1 khi search
              }}
              placeholder="Tìm theo tên danh mục..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleDelete}
              disabled={selectedKeys.length === 0}
              aria-disabled={selectedKeys.length === 0}>
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Xóa ({selectedKeys.length})</span>
            </Button>

            <Button variant="primary" onClick={() => setShowCreate(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <span className="ml-2">Thêm</span>
            </Button>
          </div>
        </div>

        {showCreate && (
          <CreateCategoryModal
            open={showCreate}
            onClose={() => setShowCreate(false)} />
        )}

        {showUpdate && (
          <UpdateCategoryModal
            open={showUpdate}
            id={editingCategory?.categoryId}
            onClose={() => {
              setShowUpdate(false);
              setEditingCategory(null);
            }}
          />
        )}

        <TableProp
          columns={columns}
          data={data?.data?.items || []}
          loading={isLoading}
          error={isError}
          skeletonRows={5}
          rowKey={(r) => r.categoryId ?? ""}
          selectable={true}
          onSelectionChange={(sel) => setSelectedKeys(sel)}
        />

        <Pagination pageNumber={paginateData?.pageNumber ?? 0}
          pageSize={paginateData?.pageSize ?? 0}
          totalItems={paginateData?.totalItems ?? 0}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => setPageSize(s)}>

        </Pagination>
      </div>
    </div>
  );
}
