"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useUpdateCategoryMutation,
  useGetCategoryQuery,
} from "../hooks/category-hooks";

type Category = { categoryId: number; categoryName: string };

type FormValues = {
  categoryName: string;
};

type Props = {
  open: boolean;
  id: number | null;
  onClose: () => void;
};

export default function UpdateCategoryModal({ open, id, onClose }: Props) {
  const { data: category, isLoading, isError } = useGetCategoryQuery(id, {
    enabled: !!id,
    queryKey: []
  });
  const { mutate, isPending } = useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { categoryName: "" },
  });

  // Reset dữ liệu khi mở modal và category có sẵn
  useEffect(() => {
    if (open && category) {
      reset({ categoryName: (category as Category).categoryName });
    }
  }, [category, open, reset]);

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

  const onSubmit = (data: FormValues) => {
    const trimmed = data.categoryName.trim();
    if (!trimmed) return;

    mutate(
      { id: id!, data: { categoryName: trimmed } },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          console.error(err);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Cập nhật loại sản phẩm</h2>

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
