import { BaseError } from './base-error';

export interface BaseResponse<T> {
  isSuccess: boolean;
  value: T;
  message?: string;
  errors?: BaseError[];
}
