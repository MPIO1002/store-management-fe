"use client";

import { useForm } from "react-hook-form";
import { useGetUserQuery, useUpdateUserMutation } from "../hooks/staff-hooks";
import { UserUpdateRequest } from "@/app/lib/api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trimAll } from "@/app/lib/api/utils/object-utils";
import { Role } from "@/app/lib/api/schema/role";
import { useEffect } from "react";

const updateUserSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên tài khoản"),
  fullName: z.string().min(1, "Vui lòng nhập đầy đủ họ tên"),
  role: z.enum(Role, "Vui lòng chọn vai trò")
})

type UpdateUserData = z.infer<typeof updateUserSchema>;

type Props = {
  open: boolean;
  id: number | undefined
  onClose: () => void;
};

const defaultValues = {
  username: "",
  fullName: "",
  role: Role.Staff
};

export default function UpdateUserModal({ open, id, onClose }: Props) {
  if (!open || !id) return null;

  const { data, isLoading, isError } = useGetUserQuery(id);

  const getRole = (role: string | null | undefined) => {
    switch (role) {
      case "admin":
        return Role.Admin;

      default:
        return Role.Staff;
    }
  }

  const initialValues = data?.data ? {
    ...data?.data,
    username: data?.data?.username ?? "",
    fullName: data?.data?.fullName ?? "",
    role: getRole(data?.data?.role)
  } : defaultValues;

  const { mutate, isPending } = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState,
    reset
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    reset(initialValues)
  }, [reset, data])

  if (isLoading) return null;
  if (isError) return null;

  const onSubmit = (data: UserUpdateRequest) => {
    trimAll(data);
    mutate({ id: id, data: data }, {
      onSuccess: () => {
        toast.success("Cập nhật loại sản phẩm thành công", { description: "Success" });
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
        <h2 className="text-lg font-semibold mb-4">Tạo nhân viên mới</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Họ Tên</label>
        <input
          {...register("fullName")}
          className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.fullName ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          disabled={isPending}
          placeholder="あなたのなめあ"
          autoFocus />
        {formState.errors?.fullName && (
          <div className="text-sm text-red-600 mb-2">{formState.errors?.fullName?.message}</div>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Tên tài khoản</label>
        <input
          {...register("username")}
          className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.username ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          disabled={isPending} />
        {formState.errors?.username && (
          <div className="text-sm text-red-600 mb-2">{formState.errors?.username?.message}</div>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Vai trò</label>
        <select
          {...register("role")}
          className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.role ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          disabled={isPending}>
          {Object.entries(Role).map(([key, value]) => (
            <option key={value} value={value}>
              {key}
            </option>
          ))}
        </select>
        {formState.errors?.role && (
          <div className="text-sm text-red-600 mb-2">{formState.errors?.role?.message}</div>
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
