"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateCategoryMutation } from "../hooks/category-hooks";
import { CategoryRequest } from "@/app/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateCategoryModal({ open, onClose }: Props) {
  const { mutate, isPending } = useCreateCategoryMutation();

  const defaultValues: CategoryRequest = { categoryName: "" };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryRequest>({ defaultValues });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  if (!open) return null;

  const onSubmit = (data: CategoryRequest) => {
    const payload: CategoryRequest = { ...data, categoryName: (data.categoryName ?? "").trim() };
    if (!payload.categoryName) return;

    mutate(payload, {
      onSuccess: () => onClose(),
      onError: (err: any) => console.log(err?.message || "Đã có lỗi xảy ra"),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Tạo loại sản phẩm mới</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input
          {...register("categoryName", { required: "Vui lòng nhập tên loại sản phẩm" })}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          disabled={isPending}
          autoFocus
        />
        {errors.categoryName && (
          <div className="text-sm text-red-600 mb-2">{errors.categoryName.message}</div>
        )}

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
