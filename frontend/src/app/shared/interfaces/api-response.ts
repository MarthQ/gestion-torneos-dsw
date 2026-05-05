export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type PaginatedApiResponse<T> = Required<ApiResponse<T[]>>;
