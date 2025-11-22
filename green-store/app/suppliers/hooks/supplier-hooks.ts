import { SupplierApiFilterSuppliersRequest, SupplierDto } from "@/app/lib/api";
import { apis } from "@/app/lib/api/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const supplierKeys = {
    all: ["suppliers"] as const,
    lists: () => [...supplierKeys.all, "list"] as const,
    list: (params?: any) => [...supplierKeys.lists(), { params }] as const,
    details: () => [...supplierKeys.all, "detail"] as const,
    detail: (id: number) => [...supplierKeys.details(), id] as const,
};

export const useGetAllSupplierQuery = (params?: SupplierApiFilterSuppliersRequest) => {
    return useQuery({
        queryKey: supplierKeys.list(params),
        // pass query params via Axios `options.params` so server-side paging/filtering works
        queryFn: () =>
            apis.suppliers.filterSuppliers({ pageNumber: params?.pageNumber, pageSize: params?.pageSize, name: params?.name, phone: params?.phone }),
        // support the API paginated wrapper: { status, message, data: { items: [], pageNumber, ... } }
        select: (response: any) => {
            const payload = response?.data;
            // the actual list may be at payload.data.items (API wrapper), or at payload if it's a plain array
            const body = payload?.data ?? payload;

            // normalize to an array
            let arr: any[] = Array.isArray(body) ? body : (body?.items ?? []);

            // client-side filtering fallback if API doesn't filter by name
            if (params?.name) {
                const q = params.name.toLowerCase();
                arr = arr.filter((s) => (s.name ?? "").toLowerCase().includes(q));
            }

            // determine metadata using server values if present, otherwise derive from params/arr
            const pageNumber = body?.pageNumber ?? params?.pageNumber ?? 1;
            const pageSize = body?.pageSize ?? params?.pageSize ?? (arr.length || 10);
            const totalItems = body?.totalItems ?? arr.length;
            const totalPages = body?.totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize));

            // client-side pagination fallback when server didn't paginate
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

export const useGetSupplierQuery = (id: number | null) => {
    return useQuery({
        queryKey: supplierKeys.detail(id as number),
        queryFn: () => apis.suppliers.getSupplierById({ id: id as number }),
        select: (response: any) => response.data,
        enabled: !!id,
    });
};

export const useCreateSupplierMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SupplierDto) => apis.suppliers.createSupplier({ supplierDto: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.details() });
        },
    });
};

export const useUpdateSupplierMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: SupplierDto }) =>
            apis.suppliers.updateSupplier({ id: id, supplierDto: data }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.detail(variables.id) });
        },
    });
};

export const useDeleteSupplierMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apis.suppliers.deleteSupplier({ id: id }),
        onSuccess: (_, variable) => {
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.detail(variable) });
        },
    });
};
