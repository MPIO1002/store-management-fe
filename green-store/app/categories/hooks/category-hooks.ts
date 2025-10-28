import { CategoryApiCreateCategoryRequest, CategoryRequest } from "@/app/lib/api";
import { apis } from "@/app/lib/api/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    list: (params?: any) => [...categoryKeys.lists(), { params }] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: number) => [...categoryKeys.details(), id] as const,
}

export const useGetAllCategoryQuery = (params?: any) => {
    return useQuery({
        queryKey: categoryKeys.list(params),
        queryFn: () => apis.categories.getCategories(),
        select: (response) => response.data,
        staleTime: 1 * 60 * 1000 // refetch every 1 min
    })
}

export const useGetCategoryQuery = (id: any) => {
    return useQuery({
        queryKey: categoryKeys.detail(id),
        queryFn: () => apis.categories.getCategoryById({ id: id }),
        select: (response) => response.data,
        enabled: !!id // only run if id is provided
    });
}

export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CategoryRequest) => 
            apis.categories.createCategory({ categoryRequest: data }),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: categoryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: categoryKeys.details() }) // refetch list
        }
    })
}

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: CategoryRequest }) =>
            apis.categories.updateCategory({ id: id, categoryRequest: data }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries( { queryKey: categoryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) })
        }
    });
}

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apis.categories.deleteCategory({ id: id }),
        onSuccess: (_, variable) => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
            queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variable) })
        }
    })
}