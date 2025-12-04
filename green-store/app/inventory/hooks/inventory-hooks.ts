import { InventoryApiFilterInventoriesRequest, InventoryRequest } from "@/app/lib/api";
import { apis } from "@/app/lib/api/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const inventoryKeys = {
    all: ["inventories"] as const,
    lists: () => [...inventoryKeys.all, "list"] as const,
    list: (params?: any) => [...inventoryKeys.lists(), { params }] as const,
    details: () => [...inventoryKeys.all, "detail"] as const,
    detail: (id: number) => [...inventoryKeys.details(), id] as const,
};

export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
};

export const useGetAllProducts = () => {
    return useQuery({
        queryKey: productKeys.lists(),
        queryFn: () =>
            apis.products.filterProducts({ pageNumber: 1, pageSize: 9999 }),
        select: (response: any) => {
            const payload = response?.data;
            // Handle nested structure: response.data.data.items or response.data.items
            const body = payload?.data ?? payload;
            const arr: any[] = Array.isArray(body) ? body : (body?.items ?? []);
            return arr;
        },
        staleTime: 0, // Always refetch to get latest products
    });
};

// Search products by name - calls API directly for accurate results
export const useSearchProducts = (searchTerm: string) => {
    return useQuery({
        queryKey: [...productKeys.lists(), "search", searchTerm],
        queryFn: () =>
            apis.products.filterProducts({ 
                productName: searchTerm || undefined,
                pageNumber: 1, 
                pageSize: 50 
            }),
        select: (response: any) => {
            const payload = response?.data;
            const body = payload?.data ?? payload;
            const arr: any[] = Array.isArray(body) ? body : (body?.items ?? []);
            return arr;
        },
        enabled: !!searchTerm && searchTerm.length > 0,
        staleTime: 0,
    });
};

export const useFilterInventoryQuery = (params?: InventoryApiFilterInventoriesRequest) => {
    return useQuery({
        queryKey: inventoryKeys.list(params),
        queryFn: () =>
            apis.inventory.filterInventories({
                productName: params?.productName,
                pageNumber: params?.pageNumber,
                pageSize: params?.pageSize,
            }),
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

export const useGetInventoryQuery = (id: number | null) => {
    return useQuery({
        queryKey: inventoryKeys.detail(id as number),
        queryFn: () => apis.inventory.getInventoryById({ id: id as number }),
        select: (response) => response.data,
        enabled: !!id,
    });
};

export const useCreateInventoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: InventoryRequest) =>
            apis.inventory.createInventory({ inventoryRequest: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.details() });
        },
    });
};

export const useUpdateInventoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: InventoryRequest }) =>
            apis.inventory.updateInventory({ id: id, inventoryRequest: data }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(variables.id) });
        },
    });
};

export const useDeleteInventoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apis.inventory.deleteInventory({ id: id }),
        onSuccess: (_, variable) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(variable) });
        },
    });
};
