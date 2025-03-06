import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { initialNavbarState } from './models/navbar.state';
import { NavbarStoreService } from './services/navbar-store.service';

export const NavbarStore = signalStore(
  { providedIn: 'root' },
  withState(initialNavbarState),
  withProps(() => ({
    _navbarStoreService: inject(NavbarStoreService),
  })),
  withMethods((store) => {
    return {
      async _getNavbarItems() {
        patchState(store, { isLoading: true });
        try {
          const result = await firstValueFrom(store._navbarStoreService.getNavbarItems());

          patchState(store, { navbarListItems: result });
        } catch (error) {
          console.error('Error fetching navbarListItems:', error);
        } finally {
          patchState(store, { isLoading: false });
        }
      },
    };
  }),
  withHooks({
    onInit({ _getNavbarItems }) {
      _getNavbarItems();
    },
    onDestroy() {
      console.log('NavbarStore destroyed');
    },
  })
);
