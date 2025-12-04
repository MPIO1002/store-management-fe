"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProductMutation, useGetProductQuery } from "../hooks/product-hooks";
import { useGetAllCategoryQuery } from "@/app/categories/hooks/category-hooks";
import { useGetAllSupplierQuery } from "@/app/suppliers/hooks/supplier-hooks";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trimAll } from "@/app/lib/api/utils/object-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons";

type UpdateProductData = {
  productName: string;
  categoryId: string;
  supplierId: string;
  price: string;
  unit: string;
};

const updateProductSchema = z.object({
  productName: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  categoryId: z.string(),
  supplierId: z.string(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Giá phải lớn hơn hoặc bằng 0",
  }),
  unit: z.string(),
});

type Props = {
  open: boolean;
  id: number | undefined;
  onClose: () => void;
};

const defaultValues: UpdateProductData = {
  productName: "",
  categoryId: "",
  supplierId: "",
  price: "0",
  unit: "",
};

export default function UpdateProductModal({ open, id, onClose }: Props) {
  if (!open || !id) return null;

  const { data: product, isLoading, isError } = useGetProductQuery(id);
  const { mutate, isPending } = useUpdateProductMutation();
  const { data: categoryData } = useGetAllCategoryQuery({ pageNumber: 1, pageSize: 100 });
  const { data: supplierData } = useGetAllSupplierQuery({ pageNumber: 1, pageSize: 100 });

  const categories = (categoryData?.data?.items ?? []) as any[];
  const suppliers = (supplierData?.items ?? []) as any[];

  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productData = product?.data as any;

  const {
    register,
    handleSubmit,
    reset,
    formState,
  } = useForm<UpdateProductData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues,
  });

  // Find categoryId and supplierId from names
  useEffect(() => {
    if (productData) {
      // Find category by name
      const category = categories.find(
        (c) => c.categoryName === productData.categoryName
      );
      const supplier = suppliers.find(
        (s) => s.name === productData.supplierName
      );

      reset({
        productName: productData.productName || "",
        categoryId: category?.categoryId?.toString() || "",
        supplierId: supplier?.supplierId?.toString() || "",
        price: productData.price?.toString() || "0",
        unit: productData.unit || "",
      });

      if (productData.imageUrl) {
        setExistingImageUrl(productData.imageUrl);
        setImagePreview(productData.imageUrl);
      }
    }
  }, [productData, categories, suppliers, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setExistingImageUrl(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-lg shadow p-6">Đang tải...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="bg-white rounded-lg shadow p-6 text-red-600">
          Không thể tải dữ liệu sản phẩm.
        </div>
      </div>
    );
  }

  const onSubmit = async (values: UpdateProductData) => {
    trimAll(values);

    // Remove thousand separators (dot or comma) if user input contains them
    const cleanPrice = values.price.replace(/[.,]/g, "");
    const priceNumber = Number(cleanPrice);

    if (isNaN(priceNumber) || priceNumber < 0) {
      toast.error("Giá không hợp lệ", { description: "Vui lòng nhập số hợp lệ" });
      return;
    }

    mutate(
      {
        id: id!,
        productName: values.productName,
        categoryId: values.categoryId ? Number(values.categoryId) : undefined,
        supplierId: values.supplierId ? Number(values.supplierId) : undefined,
        barcode: productData?.barcode || undefined,
        price: priceNumber,
        unit: values.unit || undefined,
        imageUrl: imageFile ? undefined : existingImageUrl || undefined,
        imageFile: imageFile || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật sản phẩm thành công", { description: "Success" });
          onClose();
        },
        onError: (err: any) => {
          console.error(err);
          const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Có lỗi xảy ra";
          toast.error("Cập nhật sản phẩm thất bại", { description: errorMessage });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-4">Cập nhật sản phẩm</h2>

        {/* Product Name */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tên sản phẩm <span className="text-red-500">*</span>
        </label>
        <input
          {...register("productName")}
          className={`w-full border rounded px-3 py-2 mb-1 ${
            formState.errors?.productName ? "border-red-600" : "border-gray-300"
          }`}
          autoFocus
        />
        {formState.errors?.productName && (
          <p className="text-xs text-red-600 mb-2">{formState.errors.productName.message}</p>
        )}

        {/* Category */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Danh mục</label>
        <select
          {...register("categoryId")}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        {/* Supplier */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Nhà cung cấp</label>
        <select
          {...register("supplierId")}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
        >
          <option value="">-- Chọn nhà cung cấp --</option>
          {suppliers.map((sup) => (
            <option key={sup.supplierId} value={sup.supplierId}>
              {sup.name}
            </option>
          ))}
        </select>

        {/* Barcode - Read only */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Barcode</label>
        <input
          value={productData?.barcode || ""}
          readOnly
          className="w-full border border-gray-200 rounded px-3 py-2 mb-2 bg-gray-50 text-gray-500 cursor-not-allowed"
        />

        {/* Price */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Giá <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          {...register("price")}
          className={`w-full border rounded px-3 py-2 mb-1 ${
            formState.errors?.price ? "border-red-600" : "border-gray-300"
          }`}
        />
        {formState.errors?.price && (
          <p className="text-xs text-red-600 mb-2">{formState.errors.price.message}</p>
        )}

        {/* Unit */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Đơn vị</label>
        <input
          {...register("unit")}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          placeholder="VD: kg, cái, hộp..."
        />

        {/* Image Upload */}
        <label className="block mb-2 text-sm font-medium text-gray-700">Ảnh sản phẩm</label>
        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faXmark} size="sm" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded hover:border-green-500 hover:bg-green-50 transition"
            >
              <FontAwesomeIcon icon={faImage} className="text-gray-400" />
              <span className="text-sm text-gray-600">Chọn ảnh</span>
            </button>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
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
            className="px-4 py-2 rounded-md bg-green-600 text-white disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
