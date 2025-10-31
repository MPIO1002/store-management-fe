"use client";

import React, { useEffect, useState } from "react";
import { useUpdateCategoryMutation } from "../hooks/category-hooks";

type Category = { categoryId: number; categoryName: string };

type Props = {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onUpdated?: (cat: any) => void;
};

export default function UpdateCategoryModal({ open, category, onClose, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useUpdateCategoryMutation();

  useEffect(() => {
    setName(category?.categoryName ?? "");
    setError(null);
  }, [category]);

  if (!open || !category) return null;
  const id = category.categoryId;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Vui lòng nhập tên loại sản phẩm");
      return;
    }

    // mirror CreateCategoryModal behaviour: call mutate and close modal immediately
    mutate({ id, data: { categoryName: name.trim() } }, {
      onError: (err: any) => {
        console.log(err?.message || "Đã có lỗi xảy ra");
        setError((err as any)?.message ?? "Lỗi khi cập nhật loại sản phẩm");
      },
      onSuccess: (res: any) => {
        try {
          onUpdated?.(res?.data ?? res);
        } catch (_) {}
      }
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
  <h2 className="text-lg font-semibold mb-4">Cập nhật loại sản phẩm</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        {error ? <div className="text-sm text-red-600 mb-2">{error}</div> : null}

        <div className="flex justify-end gap-2">
          <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
