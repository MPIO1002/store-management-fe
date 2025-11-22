"use client";

import React, { useEffect, useState } from "react";
import { useUpdateSupplierMutation, useGetSupplierQuery } from "../hooks/supplier-hooks";
import { SupplierDto } from "@/app/lib/api";

type Supplier = { supplierId?: number; name: string; phone?: string | null; email?: string | null; address?: string | null };

type Props = {
  open: boolean;
  id: number | null;
  onClose: () => void;
};

export default function UpdateSupplierModal({ open, id, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useUpdateSupplierMutation();
  const _supQuery = useGetSupplierQuery(id as any) as any;
  const supplier = _supQuery?.data as Supplier | undefined;
  const isLoading = _supQuery?.isLoading;
  const isError = _supQuery?.isError;

  useEffect(() => {
    setName(supplier?.name ?? "");
    setPhone(supplier?.phone ?? undefined);
    setEmail(supplier?.email ?? undefined);
    setAddress(supplier?.address ?? undefined);
    setError(null);
  }, [supplier]);

  if (!open || !id) return null;
  if (isLoading) return null;
  if (isError) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Vui lòng nhập tên nhà cung cấp");
      return;
    }

    const payload: SupplierDto = {
      name: name.trim(),
      phone: phone?.toString().trim() || null,
      email: email?.toString().trim() || null,
      address: address?.toString().trim() || null,
    } as any;

    mutate({ id: id!, data: payload }, {
      onError: (err: any) => {
        console.error(err?.message || "Đã có lỗi xảy ra");
        setError((err as any)?.message ?? "Lỗi khi cập nhật nhà cung cấp");
      },
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Cập nhật nhà cung cấp</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">SĐT</label>
        <input className="w-full border border-gray-300 rounded px-3 py-2 mb-2" value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} />

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input className="w-full border border-gray-300 rounded px-3 py-2 mb-2" value={email ?? ""} onChange={(e) => setEmail(e.target.value)} />

        <label className="block mb-2 text-sm font-medium text-gray-700">Địa chỉ</label>
        <input className="w-full border border-gray-300 rounded px-3 py-2 mb-4" value={address ?? ""} onChange={(e) => setAddress(e.target.value)} />

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
