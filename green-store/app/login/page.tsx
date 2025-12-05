"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faSpinner, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { apis } from "../lib/api/apis";
import { useAuth } from "../lib/auth/auth-context";

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await apis.auth.login({
        loginRequest: {
          username: data.username,
          password: data.password,
        },
      });

      const rawData: any = response?.data;
      const authData = rawData?.data ?? rawData;

      console.log("Login response:", authData);

      if (authData?.token) {
        // Try to get userId from response first, then from JWT
        let userId = authData.userId;
        
        if (!userId) {
          // Fallback: Decode JWT to get userId
          try {
            const tokenPayload = JSON.parse(atob(authData.token.split('.')[1]));
            console.log("JWT payload:", tokenPayload);
            userId = tokenPayload.nameid || tokenPayload.sub || tokenPayload.userId || tokenPayload.UserId;
          } catch (e) {
            console.error("Error decoding JWT:", e);
          }
        }

        login({
          userId: parseInt(userId) || 0,
          username: authData.username || data.username,
          role: authData.role || "user",
          token: authData.token,
        });

        toast.success("Đăng nhập thành công!");
        router.push("/");
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không đúng";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <FontAwesomeIcon icon={faLeaf} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Green Store</h1>
          <p className="text-gray-500 mt-1">Đăng nhập để tiếp tục</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              {...register("username")}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên đăng nhập"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors pr-12 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
