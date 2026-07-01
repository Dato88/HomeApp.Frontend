import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

function formatErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 401) {
    return error.message;
  }

  if (error.status === 404) {
    return error.message;
  }

  if (error.status === 400) {
    const payload = error.error;
    if (typeof payload === 'string') {
      return payload;
    }
    if (payload?.description) {
      return payload.description;
    }
    if (payload?.message) {
      return payload.message;
    }
  }

  const payload = error.error;
  if (typeof payload === 'string') {
    return payload;
  }
  if (payload?.description) {
    return payload.description;
  }
  if (payload?.message) {
    return payload.message;
  }

  return error.message || 'An unknown error occurred.';
}

function handleError(error: HttpErrorResponse, router: Router): string {
  if (error.status === 404 && !error.url?.includes('/auth/')) {
    router.navigate(['/404']);
  }

  return formatErrorMessage(error);
}

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = handleError(error, router);
      return throwError(() => new Error(errorMessage));
    })
  );
};
