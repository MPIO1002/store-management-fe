"use client";

import { useForm } from "react-hook-form";
import { CustomerCreateRequest } from "@/app/lib/api";
import { useCreateCustomerMutation } from "../hooks/customer-hooks";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createCustomerSchema = z.object({
  name: z.string().min(1, "Tên khách hàng là bắt buộc"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional(),
});

type CreateCustomerData = z.infer<typeof createCustomerSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

const defaultValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

export default function CreateCustomerModal({ open, onClose }: Props) {
  const { register, handleSubmit, formState, reset } = useForm<CreateCustomerData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useCreateCustomerMutation();

  if (!open) return null;

  const onSubmit = handleSubmit((values: any) => {
    const payload: CustomerCreateRequest = {
      name: values.name,
      phone: values.phone || undefined,
      email: values.email || undefined,
      address: values.address || undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Tạo khách hàng thành công", { description: "Success" });
        reset(defaultValues);
        onClose();
      },
      onError: (err: any) => {
        console.error(err);
        const errorMessage = err?.response?.data?.message || err?.message || "Có lỗi xảy ra";
        toast.error("Tạo khách hàng thất bại", { description: errorMessage });
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
        <h2 className="text-lg font-semibold mb-4">Thêm khách hàng</h2>

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
            className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            disabled={isPending}
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
