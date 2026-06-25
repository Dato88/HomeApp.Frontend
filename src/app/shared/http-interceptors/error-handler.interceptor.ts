import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

function handleError(error: HttpErrorResponse, router: Router): string {
  if (error.status === 404) {
    router.navigate(['/404']);
    return error.message;
  }

  if (error.status === 400) {
    return error.error ? error.error : error?.message;
  }

  return error.error ? error.error : error?.message;
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
