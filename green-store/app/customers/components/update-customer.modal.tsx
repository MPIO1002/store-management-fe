"use client";

import { useEffect } from "react";
import { useUpdateCustomerMutation, useGetCustomerQuery } from "../hooks/customer-hooks";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CustomerCreateRequest } from "@/app/lib/api";

const updateCustomerSchema = z.object({
  name: z.string().min(1, "Tên khách hàng là bắt buộc"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional(),
});

type UpdateCustomerData = z.infer<typeof updateCustomerSchema>;

type Props = {
  open: boolean;
  id: number | undefined;
  onClose: () => void;
};

export default function UpdateCustomerModal({ open, id, onClose }: Props) {
  const { data: response, isLoading: isLoadingModel, isError } = useGetCustomerQuery(
    id as any
  );

  const customer = {
    name: response?.data?.name || "",
    phone: response?.data?.phone || "",
    email: response?.data?.email || "",
    address: response?.data?.address || "",
  };

  const { register, handleSubmit, formState, reset } = useForm<UpdateCustomerData>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: customer,
  });

  useEffect(() => {
    reset(customer);
  }, [reset, response]);

  const { mutate, isPending } = useUpdateCustomerMutation();

  if (!open || !id) return null;
  if (isLoadingModel) return null;
  if (isError) return null;

  const onSubmit = handleSubmit((data) => {
    const payload: CustomerCreateRequest = {
      name: data.name,
      phone: data.phone || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
    };
    mutate(
      { id: id as number, data: payload },
      {
        onSuccess: () => {
          toast.success("Cập nhật khách hàng thành công", { description: "Success" });
          onClose();
        },
        onError: (err: any) => {
          console.error(err);
          const errorMessage = err?.response?.data?.message || "Cập nhật thất bại";
          toast.error("Cập nhật khách hàng thất bại", { description: errorMessage });
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
        <h2 className="text-lg font-semibold mb-4">Cập nhật khách hàng</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tên khách hàng <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`w-full border rounded px-3 py-2 mb-1 ${
            formState.errors?.name
              ? "border-red-600 focus:ring-red-500"
              : "border-gray-300"
          }`}
          {...register("name")}
        />
        {!!formState.errors?.name && (
          <p className="text-xs text-red-600 mb-2">{formState.errors?.name?.message}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700 mt-3">
          Số điện thoại
        </label>
        <input
          type="text"
          className={`w-full border rounded px-3 py-2 mb-1 ${
            formState.errors?.phone
              ? "border-red-600 focus:ring-red-500"
              : "border-gray-300"
          }`}
          {...register("phone")}
        />
        {!!formState.errors?.phone && (
          <p className="text-xs text-red-600 mb-2">{formState.errors?.phone?.message}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700 mt-3">
          Email
        </label>
        <input
          type="email"
          className={`w-full border rounded px-3 py-2 mb-1 ${
            formState.errors?.email
              ? "border-red-600 focus:ring-red-500"
              : "border-gray-300"
          }`}
          {...register("email")}
        />
        {!!formState.errors?.email && (
          <p className="text-xs text-red-600 mb-2">{formState.errors?.email?.message}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700 mt-3">
          Địa chỉ
        </label>
        <textarea
          className={`w-full border rounded px-3 py-2 mb-4 ${
            formState.errors?.address
              ? "border-red-600 focus:ring-red-500"
              : "border-gray-300"
          }`}
          rows={3}
          {...register("address")}
        />
        {!!formState.errors?.address && (
          <p className="text-xs text-red-600">{formState.errors?.address?.message}</p>
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
