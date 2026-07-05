import { BaseError } from './base-error';

interface Success<T> {
  isSuccess: true;
  value: T;
  message?: never;
  error?: never;
}

interface Failure {
  isSuccess: false;
  message: string;
  error?: BaseError;
  value?: never;
}

export type BaseResponse<T> = Success<T> | Failure;
