import { computed, inject, isDevMode } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { map, catchError, of } from 'rxjs';
import { AuthService } from './services/auth.service';

const authDevtools = isDevMode()
  ? withDevtools('auth')
  : signalStoreFeature(withState({}));

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    _authService: inject(AuthService),
    authStatusResource: rxResource({
      stream: () =>
        inject(AuthService)
          .checkStatus()
          .pipe(
            map((status) => status.authenticated),
            catchError(() => of(false))
          ),
    }),
  })),
  withComputed((store) => ({
    isAuthenticated: computed(() =>
      store.authStatusResource.hasValue() ? store.authStatusResource.value() === true : false
    ),
    shouldLoadSessionData: computed(() => {
      if (!store.authStatusResource.hasValue()) {
        return true;
      }

      return store.authStatusResource.value() === true;
    }),
  })),
  withMethods((store) => ({
    login(): void {
      store._authService.login();
    },
    logout(): void {
      store._authService.logout();
    },
    reloadStatus(): void {
      store.authStatusResource.reload();
    },
  })),
  authDevtools
);
