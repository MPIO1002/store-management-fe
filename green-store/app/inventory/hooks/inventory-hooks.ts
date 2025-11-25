import { InventoryRequest } from "@/app/lib/api";
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
            apis.products.getAllProducts({ pageNumber: 1, pageSize: 9999 }),
        select: (response: any) => {
            const payload = response?.data;
            const body = payload?.data ?? payload;
            const arr: any[] = Array.isArray(body) ? body : (body?.items ?? []);
            return arr;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetAllInventoryQuery = (params?: any) => {
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

            if (params?.productName) {
                const q = params.productName.toLowerCase();
                arr = arr.filter((inv) => (inv.productName ?? "").toLowerCase().includes(q));
            }

            const pageNumber = body?.pageNumber ?? params?.pageNumber ?? 1;
            const pageSize = body?.pageSize ?? params?.pageSize ?? (arr.length || 10);
            const totalItems = body?.totalItems ?? arr.length;
            const totalPages = body?.totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));

            if (!body?.items && params?.pageNumber && params?.pageSize) {
                const start = (params.pageNumber - 1) * params.pageSize;
                arr = arr.slice(start, start + params.pageSize);
            }

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
