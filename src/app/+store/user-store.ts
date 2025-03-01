import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { initialUserState } from './models/user.state';
import { UserStoreService } from './services/user-store.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialUserState),
  withProps(() => ({
    _userStoreService: inject(UserStoreService),
  })),
  withMethods((store) => {
    return {
      async _getUser() {
        patchState(store, { isLoading: true });
        try {
          const getUserResult = await firstValueFrom(store._userStoreService.getUser());

          patchState(store, { user: getUserResult });
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          patchState(store, { isLoading: false });
          console.log('UserStore finally', store.user());
        }
      },
    };
  }),
  withHooks({
    onInit({ _getUser }) {
      _getUser();
      console.log('UserStore initialisiert');
    },
    onDestroy() {
      console.log('user on destroy');
    },
  })
);
