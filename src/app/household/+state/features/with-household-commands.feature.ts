import { inject, ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe, tap } from 'rxjs';
import { Result } from '../../../core/models';
import { ToastService } from '../../../shared/ui/toast/toast.service';
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
    withMethods((store, toast = inject(ToastService)) => {
      const handleResult = (
        result: Result<number>,
        fallbackMessage: string,
        successMessage?: string
      ): void => {
        if (result.isSuccess) {
          store.householdsResource.reload();

          if (successMessage) {
            toast.success(successMessage);
          }
        } else {
          patchState(store, { error: result.message ?? fallbackMessage });
        }
      };

      const command = <TRequest>(
        execute: (request: TRequest) => ReturnType<HouseholdService['createHousehold']>,
        fallbackMessage: string,
        successMessage?: string
      ) =>
        rxMethod<TRequest>(
          pipe(
            tap(() => patchState(store, { isSaving: true, error: null })),
            exhaustMap((request) =>
              execute(request).pipe(
                tapResponse({
                  next: (result) => handleResult(result, fallbackMessage, successMessage),
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
          'Haushalt konnte nicht angelegt werden',
          'Haushalt angelegt'
        ),
        renameHousehold: command<RenameHouseholdRequest>(
          (request) => store._householdService.renameHousehold(request),
          'Haushalt konnte nicht umbenannt werden',
          'Haushalt umbenannt'
        ),
        deleteHousehold: command<number>(
          (householdId) => store._householdService.deleteHousehold(householdId),
          'Haushalt konnte nicht gelöscht werden',
          'Haushalt gelöscht'
        ),
        addMember: command<AddHouseholdMemberRequest>(
          (request) => store._householdService.addMember(request),
          'Mitglied konnte nicht eingeladen werden',
          'Mitglied eingeladen'
        ),
        removeMember: command<RemoveHouseholdMemberRequest>(
          (request) => store._householdService.removeMember(request),
          'Mitglied konnte nicht entfernt werden',
          'Mitglied entfernt'
        ),
      };
    })
  );
}
