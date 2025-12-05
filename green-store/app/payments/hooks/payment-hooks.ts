import { OrderRequest } from "@/app/lib/api";
import { apis } from "@/app/lib/api/apis";
import { useMutation, useQuery } from "@tanstack/react-query";

export const paymentKeys = {
    all: ["payments"] as const,
    productByBarcode: (barcode: string) => [...paymentKeys.all, "barcode", barcode] as const,
};

// Get product by barcode
export const useGetProductByBarcode = (barcode: string) => {
    return useQuery({
        queryKey: paymentKeys.productByBarcode(barcode),
        queryFn: () => apis.products.getProductByBarcode({ barcode }),
        select: (response: any) => {
            const payload = response?.data;
            return payload?.data ?? payload;
        },
        enabled: !!barcode && barcode.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};

// Create order mutation
export const useCreateOrderMutation = () => {
    return useMutation({
        mutationFn: (data: OrderRequest) => apis.orders.createOrder({ orderRequest: data }),
    });
};

// Create VNPay order mutation
export const useCreateVnpayOrderMutation = () => {
    return useMutation({
        mutationFn: (data: OrderRequest) => apis.orders.createVnpayOrder({ orderRequest: data }),
    });
};
