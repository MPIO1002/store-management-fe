"use client";

import { useForm } from "react-hook-form";
import { useCreateUserMutation } from "../hooks/staff-hooks";
import { UserCreateRequest } from "@/app/lib/api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { trimAll } from "@/app/lib/api/utils/object-utils";
import { Role } from "@/app/lib/api/schema/role";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const createUserSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên tài khoản"),
  fullName: z.string().min(1, "Vui lòng nhập đầy đủ họ tên"),
  password: z.string().min(6, "Mật khẩu phải có tối thiểu 6 kí tự"),
  role: z.enum(Role, "Vui lòng chọn vai trò"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không trùng khớp",
  path: ["confirmPassword"]
});

type CreateUserData = z.infer<typeof createUserSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

const defaultValues = {
  username: "",
  fullName: "",
  password: "",
  confirmPassword: "",
  role: Role.Staff
};

export default function CreateUserModal({ open, onClose }: Props) {
  const { mutate, isPending } = useCreateUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState,
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: defaultValues
  });

  if (!open) return null;

  const onSubmit = (data: UserCreateRequest) => {
    trimAll(data);
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

        <label className="block mb-2 text-sm font-medium text-gray-700">Mật khẩu</label>
        <div className="relative">
          <input
            {...register("password")}
            className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.password ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
            type={showPassword ? "text" : "password"}
            disabled={isPending} />
          <button type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 end-0 flex mb-1.5 items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden hover:text-green-600 dark:text-neutral-600">
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}></FontAwesomeIcon>
          </button>
        </div>
        {formState.errors?.password && (
          <div className="text-sm text-red-600 mb-2">{formState.errors?.password?.message}</div>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
        <div className="relative">
          <input
            {...register("confirmPassword")}
            className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.confirmPassword ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
            type={showConfirmPassword ? "text" : "password"}
            disabled={isPending} />
          <button type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 end-0 flex mb-1.5 items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-hidden hover:text-green-600 dark:text-neutral-600">
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye}></FontAwesomeIcon>
          </button>
        </div>
        {formState.errors?.confirmPassword && (
          <div className="text-sm text-red-600 mb-2">{formState.errors?.confirmPassword?.message}</div>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700">Vai trò</label>
        <select
          {...register("role")}
          className={`w-full border border-gray-300 rounded px-3 py-2 mb-2 ${formState.errors?.role ? 'border-red-600 focus:ring-red-500' : 'border-gray-300'}`}
          disabled={isPending}>
          {Object.entries(Role).map(([key, value]) => (
            <option key={value as string} value={value as string}>
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
