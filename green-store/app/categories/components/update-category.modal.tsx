"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateCategoryMutation, useGetCategoryQuery } from "../hooks/category-hooks";
import { CategoryRequest } from "@/app/lib/api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trimAll } from "@/app/lib/api/utils/object-utils";

const updateCategorySchema = z.object({
  categoryName: z.string().min(1, "Vui lòng nhập tên loại sản phẩm")
});

type UpdateCategoryData = z.infer<typeof updateCategorySchema>;

type Props = {
  open: boolean;
  id: number | undefined;
  onClose: () => void;
};

const defaultValue = { categoryName: "" };

export default function UpdateCategoryModal({ open, id, onClose }: Props) {
  if (!open || !id) return null;

  const { data: category, isLoading, isError } = useGetCategoryQuery(id);
  const { mutate, isPending } = useUpdateCategoryMutation();

  const initialData = category?.data as UpdateCategoryData ?? defaultValue;

  const {
    register,
    handleSubmit,
    reset,
    formState
  } = useForm<UpdateCategoryData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
    console.log(initialData)
  }, [reset, category]);

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

  const onSubmit = (data: CategoryRequest) => {
    trimAll(data);
    if (!data.categoryName) return;

    mutate(
      { id: id!, data: data },
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
      <form onSubmit={handleSubmit(onSubmit)} className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Cập nhật loại sản phẩm</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input
          {...register("categoryName")}
          className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.categoryName ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          disabled={isPending}
          autoFocus
        />
        {formState.errors?.categoryName && (
          <div className="text-sm text-red-600 mb-2">{formState.errors?.categoryName?.message}</div>
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
