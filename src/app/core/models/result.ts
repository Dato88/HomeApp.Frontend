import { BaseResponse } from '../../shared/_interfaces/base-response';

/**
 * Backend `Result<T>` wrapper from SharedKernel: `{ value, isSuccess, error }`.
 * Alias of the existing `BaseResponse<T>` so old and new features share one type.
 */
export type Result<T> = BaseResponse<T>;
