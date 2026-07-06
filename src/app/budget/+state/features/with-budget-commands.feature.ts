import { inject, ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe, tap } from 'rxjs';
import { Result } from '../../../core/models';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import { BudgetService } from '../../services/budget.service';
import {
  BudgetResponse,
  CreateBudgetCellRequest,
  CreateBudgetGroupRequest,
  CreateBudgetRowRequest,
  EvaResponse,
  UpdateBudgetCellRequest,
  UpdateBudgetGroupRequest,
  UpdateBudgetRowRequest,
} from '../models';

export interface BudgetCommandState {
  isSaving: boolean;
  error: string | null;
}

export function withBudgetCommands() {
  return signalStoreFeature(
    {
      props: type<{
        _budgetService: BudgetService;
        budgetResource: ResourceRef<BudgetResponse | null>;
        evaResource: ResourceRef<EvaResponse | null>;
      }>(),
      methods: type<{ _handleError: (error: unknown) => void }>(),
      state: type<BudgetCommandState & { selection: { householdId: number; year: number } | undefined }>(),
    },
    withMethods((store, toast = inject(ToastService)) => {
      const handleIdResult = (result: Result<number>, fallbackMessage: string): void => {
        if (result.isSuccess) {
          return;
        }

        patchState(store, { error: result.message ?? fallbackMessage });
      };

      const reload = (): void => {
        store.budgetResource.reload();
        store.evaResource.reload();
      };

      const command = <TRequest>(
        execute: (request: TRequest) => ReturnType<BudgetService['createGroup']>,
        fallbackMessage: string,
        successMessage?: string
      ) =>
        rxMethod<TRequest>(
          pipe(
            tap(() => patchState(store, { isSaving: true, error: null })),
            exhaustMap((request) =>
              execute(request).pipe(
                tapResponse({
                  next: (result) => {
                    handleIdResult(result, fallbackMessage);

                    if (result.isSuccess) {
                      reload();

                      if (successMessage) {
                        toast.success(successMessage);
                      }
                    }
                  },
                  error: (err) => store._handleError(err),
                  finalize: () => patchState(store, { isSaving: false }),
                })
              )
            )
          )
        );

      return {
        createBudget: rxMethod<{ householdId: number; year: number }>(
          pipe(
            tap(() => patchState(store, { isSaving: true, error: null })),
            exhaustMap(({ householdId, year }) =>
              store._budgetService.createBudget(householdId, year).pipe(
                tapResponse({
                  next: (result) => {
                    handleIdResult(result, 'Budget konnte nicht angelegt werden');

                    if (result.isSuccess) {
                      reload();
                      toast.success('Budget angelegt');
                    }
                  },
                  error: (err) => store._handleError(err),
                  finalize: () => patchState(store, { isSaving: false }),
                })
              )
            )
          )
        ),
        deleteBudget: command<number>(
          (budgetId) => store._budgetService.deleteBudget(budgetId),
          'Budget konnte nicht gelöscht werden',
          'Budget gelöscht'
        ),
        createGroup: command<CreateBudgetGroupRequest>(
          (request) => store._budgetService.createGroup(request),
          'Gruppe konnte nicht angelegt werden',
          'Gruppe angelegt'
        ),
        updateGroup: command<UpdateBudgetGroupRequest>(
          (request) => store._budgetService.updateGroup(request),
          'Gruppe konnte nicht gespeichert werden',
          'Gruppe gespeichert'
        ),
        deleteGroup: command<number>(
          (budgetGroupId) => store._budgetService.deleteGroup(budgetGroupId),
          'Gruppe konnte nicht gelöscht werden',
          'Gruppe gelöscht'
        ),
        createRow: command<CreateBudgetRowRequest>(
          (request) => store._budgetService.createRow(request),
          'Zeile konnte nicht angelegt werden',
          'Zeile angelegt'
        ),
        updateRow: command<UpdateBudgetRowRequest>(
          (request) => store._budgetService.updateRow(request),
          'Zeile konnte nicht gespeichert werden',
          'Zeile gespeichert'
        ),
        deleteRow: command<number>(
          (budgetRowId) => store._budgetService.deleteRow(budgetRowId),
          'Zeile konnte nicht gelöscht werden',
          'Zeile gelöscht'
        ),
        createCell: command<CreateBudgetCellRequest>(
          (request) => store._budgetService.createCell(request),
          'Betrag konnte nicht gespeichert werden',
          'Betrag gespeichert'
        ),
        updateCell: command<UpdateBudgetCellRequest>(
          (request) => store._budgetService.updateCell(request),
          'Betrag konnte nicht gespeichert werden',
          'Betrag gespeichert'
        ),
        deleteCell: command<number>(
          (budgetCellId) => store._budgetService.deleteCell(budgetCellId),
          'Zelle konnte nicht gelöscht werden',
          'Zelle gelöscht'
        ),
      };
    })
  );
}
