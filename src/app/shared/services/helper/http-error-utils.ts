import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseError } from '../../_interfaces/base-error';
import { BaseResponse } from '../../_interfaces/base-response';

/**
 * Handles HTTP errors with a custom fallback value.
 * @param defaultValue - Fallback for the `data` field.
 */
export function handleHttpError<T>(
  defaultValue: T
): (error: HttpErrorResponse) => Observable<BaseResponse<T>> {
  return (err: HttpErrorResponse) => {
    return of(createBaseErrorResponse<T>(defaultValue, err));
  };
}

/**
 * Handles HTTP errors for array responses, providing an empty array as fallback.
 */
export function handleHttpErrorArray<T>(): (
  error: HttpErrorResponse
) => Observable<BaseResponse<T[]>> {
  return (err: HttpErrorResponse) => {
    return of(createBaseErrorResponse<T[]>([], err));
  };
}

/**
 * Shortcut for handling HTTP errors with `null` as fallback.
 */
export function handleHttpErrorNull<T>(): (
  error: HttpErrorResponse
) => Observable<BaseResponse<T>> {
  return handleHttpError<T>(null as unknown as T);
}

/**
 * Creates a standardized BaseResponse<T> from a HttpErrorResponse.
 */
function createBaseErrorResponse<T>(defaultValue: T, err: HttpErrorResponse): BaseResponse<T> {
  const fallbackMessage = 'An unknown error occurred.';
  const error: BaseError = {
    code: err.error?.code ?? 'Unknown',
    message: err.error?.description ?? fallbackMessage,
  };

  return {
    isSuccess: false,
    value: defaultValue,
    message: error.message,
    errors: [error],
  };
}
