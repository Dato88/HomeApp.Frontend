import { ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe, tap } from 'rxjs';
import { Result } from '../../../core/models';
import { HouseholdService } from '../../services/household.service';
import {
  AddHouseholdMemberRequest,
  CreateHouseholdRequest,
  HouseholdResponse,
  RemoveHouseholdMemberRequest,
  RenameHouseholdRequest,
} from '../models';

export function withHouseholdCommands() {
  return signalStoreFeature(
    {
      props: type<{
        _householdService: HouseholdService;
        householdsResource: ResourceRef<HouseholdResponse[]>;
      }>(),
      methods: type<{ _handleError: (error: unknown) => void }>(),
      state: type<{ isSaving: boolean; error: string | null }>(),
    },
    withMethods((store) => {
      const handleResult = (result: Result<number>, fallbackMessage: string): void => {
        if (result.isSuccess) {
          store.householdsResource.reload();
        } else {
          patchState(store, { error: result.message ?? fallbackMessage });
        }
      };

      const command = <TRequest>(
        execute: (request: TRequest) => ReturnType<HouseholdService['createHousehold']>,
        fallbackMessage: string
      ) =>
        rxMethod<TRequest>(
          pipe(
            tap(() => patchState(store, { isSaving: true, error: null })),
            exhaustMap((request) =>
              execute(request).pipe(
                tapResponse({
                  next: (result) => handleResult(result, fallbackMessage),
                  error: (err) => store._handleError(err),
                  finalize: () => patchState(store, { isSaving: false }),
                })
              )
            )
          )
        );

      return {
        createHousehold: command<CreateHouseholdRequest>(
          (request) => store._householdService.createHousehold(request),
          'Failed to create household'
        ),
        renameHousehold: command<RenameHouseholdRequest>(
          (request) => store._householdService.renameHousehold(request),
          'Failed to rename household'
        ),
        deleteHousehold: command<number>(
          (householdId) => store._householdService.deleteHousehold(householdId),
          'Failed to delete household'
        ),
        addMember: command<AddHouseholdMemberRequest>(
          (request) => store._householdService.addMember(request),
          'Failed to add household member'
        ),
        removeMember: command<RemoveHouseholdMemberRequest>(
          (request) => store._householdService.removeMember(request),
          'Failed to remove household member'
        ),
      };
    })
  );
}
