import { OrderApiFilterOrdersRequest } from "@/app/lib/api";
import { apis } from "@/app/lib/api/apis";
import { useQuery } from "@tanstack/react-query";

export const orderKeys = {
    all: ["orders"] as const,
    lists: () => [...orderKeys.all, "list"] as const,
    list: (params?: any) => [...orderKeys.lists(), { params }] as const,
    details: () => [...orderKeys.all, "detail"] as const,
    detail: (id: number) => [...orderKeys.details(), id] as const,
};

export const useFilterOrderQuery = (params?: OrderApiFilterOrdersRequest) => {
    return useQuery({
        queryKey: orderKeys.list(params),
        queryFn: () => apis.orders.filterOrders(params),
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
