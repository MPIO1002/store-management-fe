"use client";

import { useForm } from "react-hook-form";
import { useCreateCategoryMutation } from "../hooks/category-hooks";
import { CategoryRequest } from "@/app/lib/api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trimAll } from "@/app/lib/api/utils/object-utils";

const createCategorySchema = z.object({
  categoryName: z.string().min(1, "Vui lòng nhập tên loại sản phẩm")
});

type CreateCategoryData = z.infer<typeof createCategorySchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

const defaultValues = { categoryName: "" };

export default function CreateCategoryModal({ open, onClose }: Props) {
  const { mutate, isPending } = useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    formState,
  } = useForm<CreateCategoryData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: defaultValues
  });

  if (!open) return null;

  const onSubmit = (data: CategoryRequest) => {
    trimAll(data);
    if (!data.categoryName) return;

    mutate(data, {
      onSuccess: () => {
        toast.success("Tạo loại sản phẩm thành công", { description: "Success" });
        onClose();
      },
      onError: (err: any) => {
        toast.error("Đã có lỗi xảy ra", { description: "Failed" })
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Tạo loại sản phẩm mới</h2>

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
