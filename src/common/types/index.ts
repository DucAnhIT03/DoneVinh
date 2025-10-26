// Common types used across the application
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}



