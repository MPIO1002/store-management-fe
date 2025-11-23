export interface PaginationData {
    pageNumber?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
}