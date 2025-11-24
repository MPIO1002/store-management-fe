import { UserCreateRequest, UsersApiFilterUsersRequest, UsersApiGetAllUsersRequest, UserUpdateRequest } from "@/app/lib/api";
import { apis } from "@/app/lib/api/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (params?: any) => [...userKeys.lists(), { params }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
}

export const useFilterUserQuery = (params?: UsersApiFilterUsersRequest) => {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: () => apis.users.filterUsers(params),
        select: (response) => response.data,
        staleTime: 1 * 60 * 1000 // refetch every 1 min
    })
}

export const useGetAllUserQuery = (params?: UsersApiGetAllUsersRequest) => {
    return useQuery({
        queryKey: userKeys.list(params),
        queryFn: () => apis.users.getAllUsers(params),
        select: (response) => response.data,
        staleTime: 1 * 60 * 1000 // refetch every 1 min
    })
}

export const useGetUserQuery = (id: number) => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => apis.users.getUserById({ id: id }),
        select: (response) => response.data,
        enabled: !!id,
    });
};

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UserCreateRequest) =>
            apis.users.createUser({ userCreateRequest: data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            queryClient.invalidateQueries({ queryKey: userKeys.details() }) // refetch list
        }
    })
}

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: UserUpdateRequest }) =>
            apis.users.updateUser({ id: id, userUpdateRequest: data }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
        }
    });
}

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => apis.users.deleteUser({ id: id }),
        onSuccess: (_, variable) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(variable) })
        }
    })
}