"use client";

import { useEffect } from "react";
import { useUpdateSupplierMutation, useGetSupplierQuery } from "../hooks/supplier-hooks";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SupplierDto } from "@/app/lib/api";

const updateSupplierSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhà cung cấp"),
  phone: z.string().regex(/^0\d{9}$/, {
    message: "Vui lòng nhập số điện thoại hợp lệ",
  }),
  email: z.email("Vui lòng nhập email hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ")
})

type UpdateSupplierData = z.infer<typeof updateSupplierSchema>;

type Props = {
  open: boolean;
  id: number | undefined;
  onClose: () => void;
};

export default function UpdateSupplierModal({ open, id, onClose }: Props) {
  const { data: response, isLoading: isLoadingModel, isError } = useGetSupplierQuery(id as any);

  const supplier = {
    name: response?.data?.name || "",
    phone: response?.data?.phone || "",
    email: response?.data?.email || "",
    address: response?.data?.address || ""
  };

  const { register, handleSubmit, formState, reset } = useForm<UpdateSupplierData>({
    resolver: zodResolver(updateSupplierSchema),
    defaultValues: supplier,
  });

  useEffect(() => {
    reset(supplier);
  }, [reset, response]);

  const { mutate, isPending } = useUpdateSupplierMutation();

  if (!open || !id) return null;
  if (isLoadingModel) return null;
  if (isError) return null;

  const onSubmit = handleSubmit((data) => {
    const payload: SupplierDto  = {
      name: data.name?.trim(),
      phone: data.phone?.toString().trim() || null,
      email: data.email?.toString().trim() || null,
      address: data.address?.toString().trim() || null,
    }
    mutate({ id: id as number, data: payload }, {
      onSuccess: () => {
        toast.success("Cập nhật nhà cung cấp thành công", { description: "Success" });
        onClose();
      },
      onError: () => {
        toast.error("Cập nhật nhà cung cấp thất bại", { description: "Error" });
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={onSubmit} className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Cập nhật nhà cung cấp</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input
          className={`w-full border rounded px-3 py-2 mb-2 ${formState.errors?.name ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          {...register("name")}
          autoFocus
        />
        {!!formState.errors?.name && (
          <p className="text-xs text-red-600">{formState.errors?.name?.message}</p>
        )}
        <label className="block mb-2 text-sm font-medium text-gray-700">SĐT</label>
        <input className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.phone ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          {...register("phone")} />
        {!!formState.errors?.phone && (
          <p className="text-xs text-red-600">{formState.errors?.phone?.message}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.email ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          {...register("email")} />
        {!!formState.errors?.email && (
          <p className="text-xs text-red-600">{formState.errors?.email?.message}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Địa chỉ</label>
        <input className={`w-full border border-gray-300 rounded px-3 py-2 mb-4 ${formState.errors?.address ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          {...register("address")} />
        {!!formState.errors?.address && (
          <p className="text-xs text-red-600">{formState.errors?.address?.message}</p>
        )}

        <div className="flex justify-end gap-2">
          <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white" disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
