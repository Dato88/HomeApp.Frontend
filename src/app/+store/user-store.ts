import { inject, isDevMode } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  signalStore,
  signalStoreFeature,
  withProps,
  withState,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { map } from 'rxjs';
import { AuthStore } from '../core/auth/auth-store';
import { UserStoreService } from './services/user-store.service';
import { PersonDto } from './models/person/person-dto';

const userStoreFeatures = [
  withProps(() => {
    const userStoreService = inject(UserStoreService);
    const authStore = inject(AuthStore);

    return {
      _userStoreService: userStoreService,
      userResource: rxResource({
        params: () => (authStore.shouldLoadSessionData() ? true : undefined),
        stream: () =>
          userStoreService.getUser().pipe(
            map((result) => (result.isSuccess ? result.value : (null as PersonDto | null)))
          ),
      }),
    };
  }),
] as const;

const userDevtools = isDevMode()
  ? withDevtools('user')
  : signalStoreFeature(withState({}));

export const UserStore = signalStore(
  { providedIn: 'root' },
  ...userStoreFeatures,
  userDevtools
);
