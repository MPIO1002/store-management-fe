"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { InventoryRequest } from "@/app/lib/api";
import { useCreateInventoryMutation, useSearchProducts, useGetAllSuppliers } from "../hooks/inventory-hooks";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createInventorySchema = z.object({
  productId: z.number().min(1, "Vui lòng chọn sản phẩm"),
  quantity: z.number().min(0, "Số lượng phải lớn hơn 0"),
  supplierId: z.number().min(1, "Vui lòng chọn nhà cung cấp"),
});

type CreateInventoryData = z.infer<typeof createInventorySchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

const defaultValues = {
  productId: 0,
  quantity: 0,
  supplierId: 0,
};

export default function CreateInventoryModal({ open, onClose }: Props) {
  // Autocomplete state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use API search instead of client-side filter
  const { data: products = [], isLoading: isSearching } = useSearchProducts(debouncedSearch);
  const { data: suppliers = [] } = useGetAllSuppliers();

  const { register, handleSubmit, formState, reset, setValue } = useForm<CreateInventoryData>({
    resolver: zodResolver(createInventorySchema),
    defaultValues: defaultValues,
  });

  const { mutate, isPending } = useCreateInventoryMutation();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setDebouncedSearch("");
      setSelectedProduct(null);
      setShowSuggestions(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setSearchTerm(product.productName);
    setValue("productId", product.productId);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    
    // Clear selection if user modifies the input
    if (selectedProduct && value !== selectedProduct.productName) {
      setSelectedProduct(null);
      setValue("productId", 0);
    }
  };

  const onSubmit = handleSubmit((values: any) => {
    const payload: InventoryRequest = {
      productId: values.productId || 0,
      quantity: values.quantity || 0,
      supplierId: values.supplierId || 0,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Tạo kho thành công", { description: "Success" });
        reset(defaultValues);
        setSearchTerm("");
        setSelectedProduct(null);
        onClose();
      },
      onError: (err: any) => {
        console.error(err);
        const errorMessage = err?.response?.data?.message || err?.message || "Có lỗi xảy ra";
        toast.error("Tạo kho thất bại", { description: errorMessage });
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
        <h2 className="text-lg font-semibold mb-4">Nhập hàng</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Chọn sản phẩm <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Nhập tên hoặc barcode sản phẩm..."
            className={`w-full border rounded px-3 py-2 mb-1 ${
              formState.errors?.productId
                ? "border-red-600 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } focus:outline-none focus:ring-2`}
            autoComplete="off"
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && searchTerm && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {isSearching ? (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Đang tìm kiếm...
                </div>
              ) : products.length > 0 ? (
                products.map((product: any) => (
                  <div
                    key={product.productId}
                    onClick={() => handleSelectProduct(product)}
                    className={`px-3 py-2 cursor-pointer hover:bg-blue-50 flex justify-between items-center ${
                      selectedProduct?.productId === product.productId ? "bg-blue-100" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium text-gray-900">{product.productName}</div>
                      {product.barcode && (
                        <div className="text-xs text-gray-500">Barcode: {product.barcode}</div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.price?.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Không tìm thấy sản phẩm
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Hidden input for form validation */}
        <input type="hidden" {...register("productId", { valueAsNumber: true })} />
        
        {selectedProduct && (
          <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            Đã chọn: <strong>{selectedProduct.productName}</strong>
          </div>
        )}
        
        {!!formState.errors?.productId && !selectedProduct && (
          <p className="text-xs text-red-600 mb-2">{formState.errors?.productId?.message}</p>
        )}

        <label className="block mb-2 text-sm font-medium text-gray-700 mt-3">
          Số lượng <span className="text-red-500">*</span>
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

        <label className="block mb-2 text-sm font-medium text-gray-700 mt-3">
          Nhà cung cấp <span className="text-red-500">*</span>
        </label>
        <select
          className={`w-full border rounded px-3 py-2 mb-1 ${
            formState.errors?.supplierId
              ? "border-red-600 focus:ring-red-500"
              : "border-gray-300"
          }`}
          {...register("supplierId", { valueAsNumber: true })}
        >
          <option value={0}>-- Chọn nhà cung cấp --</option>
          {suppliers.map((supplier: any) => (
            <option key={supplier.supplierId} value={supplier.supplierId}>
              {supplier.name}
            </option>
          ))}
        </select>
        {!!formState.errors?.supplierId && (
          <p className="text-xs text-red-600 mb-2">{formState.errors?.supplierId?.message}</p>
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
