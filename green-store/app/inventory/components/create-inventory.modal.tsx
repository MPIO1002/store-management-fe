"use client";

import { useForm } from "react-hook-form";
import { InventoryRequest } from "@/app/lib/api";
import { useCreateInventoryMutation, useGetAllProducts } from "../hooks/inventory-hooks";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createInventorySchema = z.object({
  productId: z.number().min(1, "Vui lòng chọn sản phẩm"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn 0"),
});

type CreateInventoryData = z.infer<typeof createInventorySchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

const defaultValues = {
  productId: 0,
  quantity: 0,
};

export default function CreateInventoryModal({ open, onClose }: Props) {
  const { data: products = [] } = useGetAllProducts();
  
  const { register, handleSubmit, formState, reset } = useForm<CreateInventoryData>({
    resolver: zodResolver(createInventorySchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useCreateInventoryMutation();

  if (!open) return null;

  const onSubmit = handleSubmit((values: any) => {
    const payload: InventoryRequest = {
      productId: values.productId || 0,
      quantity: values.quantity || 0,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Tạo kho thành công", { description: "Success" });
        reset(defaultValues);
        onClose();
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("Tạo kho thất bại", { description: "Error" });
      },
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={onSubmit}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Tạo kho mới</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Chọn sản phẩm
        </label>
        <select
          className={`w-full border rounded px-3 py-2 mb-2 ${
            formState.errors?.productId
              ? "border-red-600 focus:ring-red-500"
              : "border-gray-300"
          }`}
          {...register("productId", { valueAsNumber: true })}
        >
          <option value={0}>-- Chọn sản phẩm --</option>
          {products.map((product: any) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
        {!!formState.errors?.productId && (
          <p className="text-xs text-red-600">{formState.errors?.productId?.message}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Số lượng
        </label>
        <input
          type="number"
          className={`w-full border rounded px-3 py-2 mb-4 ${
            formState.errors?.quantity
              ? "border-red-600 focus:ring-red-500"
              : "border-gray-300"
          }`}
          {...register("quantity", { valueAsNumber: true })}
        />
        {!!formState.errors?.quantity && (
          <p className="text-xs text-red-600">{formState.errors?.quantity?.message}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-md bg-gray-100"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-600 text-white"
            disabled={isPending}
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
