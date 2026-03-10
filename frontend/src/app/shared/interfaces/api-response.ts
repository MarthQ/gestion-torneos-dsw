interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: PaginationMeta;
}

interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type PaginatedApiResponse<T> = Required<ApiResponse<T[]>>;
