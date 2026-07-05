import { ErrorType } from './base-error-type.enum';

export interface BaseError {
  code: string;
  description: string;
  type: ErrorType;
}
