import { inject, isDevMode } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  signalStore,
  signalStoreFeature,
  withProps,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuthStore } from '../core/auth/auth-store';
import { NavbarStoreService } from './services/navbar-store.service';

const navbarStoreFeatures = [
  withProps(() => {
    const navbarStoreService = inject(NavbarStoreService);
    const authStore = inject(AuthStore);

    return {
      _navbarStoreService: navbarStoreService,
      navbarResource: rxResource({
        params: () => (authStore.isAuthenticated() ? true : undefined),
        stream: () => navbarStoreService.getNavbarItems(),
      }),
    };
  }),
] as const;

const navbarDevtools = isDevMode()
  ? withDevtools('navbar')
  : signalStoreFeature(withState({}));

export const NavbarStore = signalStore(
  { providedIn: 'root' },
  ...navbarStoreFeatures,
  navbarDevtools
);
