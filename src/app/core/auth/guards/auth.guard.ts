import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  return authService.checkStatus().pipe(
    map((status) => {
      if (status.authenticated) {
        return true;
      }

      authService.login();
      return false;
    }),
    catchError(() => {
      authService.login();
      return of(false);
    })
  );
};
