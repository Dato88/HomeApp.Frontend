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
import { PersonDto } from './models/person/person-dto';
import { BaseResponse } from '../shared/_interfaces/base-response';

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
          const getUserResult: BaseResponse<PersonDto> = await firstValueFrom(
            store._userStoreService.getUser()
          );

          if (getUserResult.isSuccess) {
            patchState(store, { user: getUserResult.value });
          } else {
            console.error('Error loading user:', getUserResult.message);
          }
        } catch (error) {
          console.error('Unexpected error fetching user:', error);
        } finally {
          patchState(store, { isLoading: false });
        }
      },
    };
  }),
  withHooks({
    onInit({ _getUser }) {
      _getUser();
    },
    onDestroy() {
      console.log('user on destroy');
    },
  })
);
