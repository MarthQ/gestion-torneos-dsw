interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: { total: number; page: number; pageSize: number; totalPages: number };
}
