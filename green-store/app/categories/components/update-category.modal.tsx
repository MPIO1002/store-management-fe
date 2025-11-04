"use client";

import React, { useEffect, useState } from "react";
import { useUpdateCategoryMutation, useGetCategoryQuery } from "../hooks/category-hooks";

type Category = { categoryId: number; categoryName: string };

type Props = {
  open: boolean;
  id: number | null;
  onClose: () => void;
};

export default function UpdateCategoryModal({ open, id, onClose }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: category, isLoading, isError } = useGetCategoryQuery(id ?? undefined);
  const { mutate, isPending } = useUpdateCategoryMutation();

  useEffect(() => {
    if (category && open) setName((category as Category).categoryName);
    setError(null);
  }, [category, open]);

  if (!open || !id) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-lg shadow p-6">Đang tải...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-lg shadow p-6 text-red-600">
          Không thể tải dữ liệu loại sản phẩm.
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Vui lòng nhập tên loại sản phẩm");
      return;
    }

    mutate(
      { id: id!, data: { categoryName: trimmed } },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          console.error(err);
          setError(err?.message ?? "Lỗi khi cập nhật loại sản phẩm");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Cập nhật loại sản phẩm</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          autoFocus
        />

        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-gray-300"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-600 text-white disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
