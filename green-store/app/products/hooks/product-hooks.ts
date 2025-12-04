import { ProductApiCreateProductRequest, ProductApiFilterProductsRequest, ProductApiUpdateProductRequest } from "@/app/lib/api";
import { apis } from "@/app/lib/api/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (params?: any) => [...productKeys.lists(), { params }] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: number) => [...productKeys.details(), id] as const,
};

export const useFilterProductQuery = (params?: ProductApiFilterProductsRequest) => {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => apis.products.filterProducts(params),
        select: (response: any) => {
            const payload = response?.data;
            const body = payload?.data ?? payload;

            let arr: any[] = Array.isArray(body) ? body : (body?.items ?? []);

            const pageNumber = body?.pageNumber ?? params?.pageNumber ?? 1;
            const pageSize = body?.pageSize ?? params?.pageSize ?? (arr.length || 10);
            const totalItems = body?.totalItems ?? arr.length;
            const totalPages = body?.totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));

            return {
                items: arr,
                meta: {
                    pageNumber,
                    pageSize,
                    totalItems,
                    totalPages,
                    hasNextPage: body?.hasNextPage ?? pageNumber < totalPages,
                    hasPreviousPage: body?.hasPreviousPage ?? pageNumber > 1,
                },
            };
        },
        staleTime: 1 * 60 * 1000,
    });
};

export const useGetProductQuery = (id: number | null) => {
    return useQuery({
        queryKey: productKeys.detail(id as number),
        queryFn: () => apis.products.getProductById({ id: id as number }),
        select: (response) => response.data,
        enabled: !!id,
    });
};

export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProductApiCreateProductRequest) =>
            apis.products.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.details() });
        },
    });
};

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProductApiUpdateProductRequest) =>
            apis.products.updateProduct(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
        },
    });
};

export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apis.products.deleteProduct({ id }),
        onSuccess: (_, variable) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(variable) });
        },
    });
};
