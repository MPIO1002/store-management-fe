"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { SupplierDto } from "@/app/lib/api";
import { useCreateSupplierMutation } from "../hooks/supplier-hooks";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateSupplierModal({ open, onClose }: Props) {
  const { register, handleSubmit, reset } = useForm<SupplierDto>({
    defaultValues: { name: "", phone: "", email: "", address: "" },
  });

  const { mutate, isPending } = useCreateSupplierMutation();

  if (!open) return null;

  function onSubmit(values: SupplierDto) {
    // trim values
    const payload: any = {
      name: values.name?.trim(),
      phone: values.phone?.toString().trim() || null,
      email: values.email?.toString().trim() || null,
      address: values.address?.toString().trim() || null,
    };

    mutate(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (err: any) => {
        console.error(err);
        alert((err as any)?.message ?? "Lỗi khi tạo nhà cung cấp");
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Tạo nhà cung cấp mới</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input className="w-full border-gray-300 rounded px-3 py-2 mb-2" {...register("name", { required: true })} autoFocus />

        <label className="block mb-2 text-sm font-medium text-gray-700">SĐT</label>
        <input className="w-full border-gray-300 rounded px-3 py-2 mb-2" {...register("phone")} />

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input className="w-full border-gray-300 rounded px-3 py-2 mb-2" {...register("email")} />

        <label className="block mb-2 text-sm font-medium text-gray-700">Địa chỉ</label>
        <input className="w-full border-gray-300 rounded px-3 py-2 mb-4" {...register("address")} />

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
