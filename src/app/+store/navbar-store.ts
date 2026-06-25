import { inject, isDevMode } from '@angular/core';
import {
  signalStore,
  signalStoreFeature,
  withProps,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { NavbarStoreService } from './services/navbar-store.service';

const navbarStoreFeatures = [
  withProps(() => ({
    _navbarStoreService: inject(NavbarStoreService),
    navbarResource: inject(NavbarStoreService).getNavbarResource(),
  })),
] as const;

const navbarDevtools = isDevMode()
  ? withDevtools('navbar')
  : signalStoreFeature(withState({}));

export const NavbarStore = signalStore(
  { providedIn: 'root' },
  ...navbarStoreFeatures,
  navbarDevtools
);
