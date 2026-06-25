import { inject, isDevMode } from '@angular/core';
import {
  signalStore,
  signalStoreFeature,
  withProps,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { UserStoreService } from './services/user-store.service';

const userStoreFeatures = [
  withProps(() => ({
    _userStoreService: inject(UserStoreService),
    userResource: inject(UserStoreService).getUserResource(),
  })),
] as const;

const userDevtools = isDevMode()
  ? withDevtools('user')
  : signalStoreFeature(withState({}));

export const UserStore = signalStore(
  { providedIn: 'root' },
  ...userStoreFeatures,
  userDevtools
);
