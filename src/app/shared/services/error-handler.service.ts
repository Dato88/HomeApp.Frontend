import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerService implements HttpInterceptor {
  readonly #router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handleError = (error: HttpErrorResponse): string => {
    if (error.status === 404) {
      return this.handleNotFound(error);
    }

    if (error.status === 400) {
      return this.handleBadRequest(error);
    }

    return error.error ? error.error : error?.message;
  };

  private handleNotFound = (error: HttpErrorResponse): string => {
    this.#router.navigate(['/404']);

    return error.message;
  };

  private handleBadRequest = (error: HttpErrorResponse): string => {
    return error.error ? error.error : error?.message;
  };
}
