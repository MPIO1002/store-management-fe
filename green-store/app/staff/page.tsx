"use client";

import { useState } from "react";
import TableProp from "@/components/table-prop";
import SearchInput from "@/components/search-input";
import Button from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { useDeleteUserMutation, useFilterUserQuery } from "./hooks/staff-hooks";
import { UserResponse } from "../lib/api";
import Pagination from "@/components/pagination";
import { PaginationData } from "../lib/api/schema/pagination";
import CreateUserModal from "./components/create-staff.modal";

export default function UserPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useFilterUserQuery({ fullName: query, pageNumber: page, pageSize: pageSize });
  const paginateData = data?.data as PaginationData;

  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
  const [deleting, setDeleting] = useState(false);

  const { mutateAsync: deleteUserAsync } = useDeleteUserMutation();

  const columns = [
    { header: "HỌ TÊN", accessor: "fullName" },
    { header: "USERNAME", accessor: "username" },
    { header: "VAI TRÒ", accessor: "role" },
    {
      header: "HÀNH ĐỘNG",
      render: (row: UserResponse) => (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => {
              setEditingUser(row);
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
        <h1 className="text-2xl font-semibold">Nhân viên</h1>
      </header>

      <div className="bg-[#fffff] p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <SearchInput
              onSearch={(v) => setQuery(v)}
              placeholder="Tìm theo tên nhân viên..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                if (selectedKeys.length === 0) return;
                const ok = confirm(`Xác nhận xóa ${selectedKeys.length} mục?`);
                if (!ok) return;
                try {
                  setDeleting(true);
                  await Promise.all(selectedKeys.map((id) => deleteUserAsync(id as number)));
                  setSelectedKeys([]);
                } catch (err) {
                  console.error(err);
                  // optional: show a user-facing message
                  alert((err as any)?.message ?? "Lỗi khi xóa");
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
            </Button>

            <Button variant="primary" onClick={() => setShowCreate(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <span className="ml-2">Thêm</span>
            </Button>
          </div>
        </div>

        {showCreate && (
          <CreateUserModal
            open={showCreate}
            onClose={() => setShowCreate(false)} />
        )}

        {/* {showUpdate && (
          <UpdateUserModal
            open={showUpdate}
            id={editingUser?.userId}
            onClose={() => {
              setShowUpdate(false);
              setEditingUser(null);
            }}
          />
        )} */}

        <TableProp
          columns={columns}
          data={data?.data?.items || []}
          loading={isLoading}
          error={isError}
          skeletonRows={5}
          rowKey={(r) => r.userId ?? ""}
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
