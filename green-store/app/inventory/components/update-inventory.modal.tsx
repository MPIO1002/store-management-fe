"use client";

import { useEffect } from "react";
import { useUpdateInventoryMutation, useGetInventoryQuery, useGetAllProducts } from "../hooks/inventory-hooks";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { InventoryRequest } from "@/app/lib/api";

const updateInventorySchema = z.object({
  productId: z.number().min(1, "Vui lòng chọn sản phẩm"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn 0"),
});

type UpdateInventoryData = z.infer<typeof updateInventorySchema>;

type Props = {
  open: boolean;
  id: number | undefined;
  onClose: () => void;
};

export default function UpdateInventoryModal({ open, id, onClose }: Props) {
  const { data: response, isLoading: isLoadingModel, isError } = useGetInventoryQuery(
    id as any
  );
  const { data: products = [] } = useGetAllProducts();

  const inventory = {
    productId: response?.data?.productId || 0,
    quantity: response?.data?.quantity || 0,
  };

  const { register, handleSubmit, formState, reset } = useForm<UpdateInventoryData>({
    resolver: zodResolver(updateInventorySchema),
    defaultValues: inventory,
  });

  useEffect(() => {
    reset(inventory);
  }, [reset, response]);

  const { mutate, isPending } = useUpdateInventoryMutation();

  if (!open || !id) return null;
  if (isLoadingModel) return null;
  if (isError) return null;

  const onSubmit = handleSubmit((data) => {
    const payload: InventoryRequest = {
      productId: data.productId || 0,
      quantity: data.quantity || 0,
    };
    mutate(
      { id: id as number, data: payload },
      {
        onSuccess: () => {
          toast.success("Cập nhật kho thành công", { description: "Success" });
          onClose();
        },
        onError: () => {
          toast.error("Cập nhật kho thất bại", { description: "Error" });
        },
      }
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={onSubmit}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Cập nhật kho</h2>

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
