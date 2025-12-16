import { CustomerApiFilterCustomerRequest, CustomerCreateRequest } from "@/app/lib/api";
import { apis } from "@/app/lib/api/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const customerKeys = {
    all: ["customers"] as const,
    lists: () => [...customerKeys.all, "list"] as const,
    list: (params?: any) => [...customerKeys.lists(), { params }] as const,
    details: () => [...customerKeys.all, "detail"] as const,
    detail: (id: number) => [...customerKeys.details(), id] as const,
};

export const useFilterCustomerQuery = (params?: CustomerApiFilterCustomerRequest) => {
    return useQuery({
        queryKey: customerKeys.list(params),
        queryFn: () =>
            apis.customers.filterCustomer({
                fullName: params?.fullName,
                email: params?.email,
                phoneNumber: params?.phoneNumber,
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

export const useGetCustomerQuery = (id: number | null) => {
    return useQuery({
        queryKey: customerKeys.detail(id as number),
        queryFn: () => apis.customers.getCustomerById({ id: id as number }),
        select: (response) => response.data,
        enabled: !!id,
    });
};

export const useCreateCustomerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CustomerCreateRequest) =>
            apis.customers.createCustomer({ customerCreateRequest: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
        },
    });
};

export const useUpdateCustomerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CustomerCreateRequest }) =>
            apis.customers.updateCustomer({ id: id, customerCreateRequest: data }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) });
        },
    });
};

export const useDeleteCustomerMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apis.customers.deleteCustomer({ id: id }),
        onSuccess: (_, variable) => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(variable) });
        },
    });
};
