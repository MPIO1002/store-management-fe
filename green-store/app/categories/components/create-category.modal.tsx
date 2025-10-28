"use client";

import React, { useState } from "react";
import { useCreateCategoryMutation } from "../hooks/category-hooks";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateCategoryModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useCreateCategoryMutation();

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Vui lòng nhập tên loại sản phẩm");
      return;
    }

    mutate({ categoryName: name.trim() }, {
      onError: (err: any) => {
        console.log(err?.message || "Đã có lỗi xảy ra");
      }
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">Tạo loại sản phẩm mới</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        {error ? <div className="text-sm text-red-600 mb-2">{error}</div> : null}

        <div className="flex justify-end gap-2">
          <button type="button" className="px-3 py-2 rounded-md bg-gray-100" onClick={onClose} disabled={isPending}>
            Hủy
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
