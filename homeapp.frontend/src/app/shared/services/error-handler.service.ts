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

    if (error.status === 401) {
      return this.handleUnauthorized(error);
    }

    return '';
  };

  private handleUnauthorized = (error: HttpErrorResponse) => {
    if (
      this.#router.url === '/authentication' ||
      this.#router.url.startsWith('/authentication/resetpassword')
    ) {
      return error.error.errorMessage;
    } else {
      this.#router.navigate(['/authentication']);
      return error.message;
    }
  };

  private handleNotFound = (error: HttpErrorResponse): string => {
    this.#router.navigate(['/404']);

    return error.message;
  };

  private handleBadRequest = (error: HttpErrorResponse): string => {
    if (this.#router.url === '/registration') {
      let message = '';
      const values: any = Object.values(error?.error?.errors);

      values.map((m: string) => {
        message += m + '<br>';
      });
      return message.slice(0, -4);
    }

    return error.error ? error.error : error?.message;
  };
}
