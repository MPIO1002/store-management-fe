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
import CreateUserModal from "./components/create-staff.modal";
import UpdateUserModal from "./components/update-staff.modal";
import { toast } from "sonner";
import ConfirmModal from "@/components/confirm-alert";

// Danh sách vai trò
const ROLES = [
  { value: "", label: "Tất cả vai trò" },
  { value: "Admin", label: "Admin" },
  { value: "Staff", label: "Staff" },
];

export default function UserPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data, isLoading, isError } = useFilterUserQuery({ 
    fullName: query, 
    role: roleFilter || undefined,
    pageNumber: page, 
    pageSize: pageSize 
  });

  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutateAsync: deleteUserAsync, isPending: isDeleting } = useDeleteUserMutation();

  const handleDelete = async () => {
    if (selectedKeys.length === 0) return;
    try {
      await Promise.all(selectedKeys.map((id) => deleteUserAsync(id as number)));
      toast.success("Xóa nhân viên thành công", { description: "Success" });
      setSelectedKeys([]);
      setConfirmDeleteOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa", { description: "Error" });
    }
  };

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
          <div className="flex flex-1 min-w-0 gap-3">
            <SearchInput
              onSearch={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="Tìm theo tên nhân viên..."
              className="flex-1"
            />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
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
            message={`Xác nhận xóa ${selectedKeys.length} nhân viên?`}
            title="Xác nhận xóa"
            disabled={isDeleting}
            onConfirm={handleDelete}
            onCancel={() => setConfirmDeleteOpen(false)}
          />
        )}

        {showCreate && (
          <CreateUserModal
            open={showCreate}
            onClose={() => setShowCreate(false)} />
        )}

        {showUpdate && (
          <UpdateUserModal
            open={showUpdate}
            id={editingUser?.userId}
            onClose={() => {
              setShowUpdate(false);
              setEditingUser(null);
            }}
          />
        )}

        <TableProp
          columns={columns}
          data={data?.items || []}
          loading={isLoading}
          error={isError}
          skeletonRows={5}
          rowKey={(r) => r.userId ?? ""}
          selectable={true}
          onSelectionChange={(sel) => setSelectedKeys(sel)}
        />

        <Pagination 
          pageNumber={data?.meta?.pageNumber ?? 1}
          pageSize={data?.meta?.pageSize ?? 10}
          totalItems={data?.meta?.totalItems ?? 0}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => setPageSize(s)}
        />
      </div>
    </div>
  );
}
