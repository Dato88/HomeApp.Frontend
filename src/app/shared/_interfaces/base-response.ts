import { BaseError } from './base-error';

export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: BaseError[];
}
