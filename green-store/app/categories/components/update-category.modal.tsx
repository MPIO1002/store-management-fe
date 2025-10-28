"use client";

import React, { useEffect, useState } from "react";
import { updateCategory } from "@/services/category.service";

type Category = { categoryId: number; categoryName: string };

type Props = {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onUpdated?: (cat: any) => void;
};

export default function UpdateCategoryModal({ open, category, onClose, onUpdated }: Props) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(category?.categoryName ?? "");
    setError(null);
  }, [category]);

  if (!open || !category) return null;
  const id = category.categoryId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Vui lòng nhập tên loại sản phẩm");
      return;
    }
    try {
      setSaving(true);
      const payload = { name: name.trim(), categoryName: name.trim() };
      const updated = await updateCategory(id, payload as any);
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      console.error(err);
      setError((err as any)?.message ?? "Lỗi khi cập nhật loại sản phẩm");
    } finally {
      setSaving(false);
    }
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
          <button type="button" className="px-3 py-2 rounded-md bg-gray-100" onClick={onClose} disabled={saving}>
            Hủy
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
