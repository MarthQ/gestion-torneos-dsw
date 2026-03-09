interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}
