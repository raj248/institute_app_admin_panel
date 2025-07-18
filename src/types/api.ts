// src/types/api.ts

export interface APIResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}
