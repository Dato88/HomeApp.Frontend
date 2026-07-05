import { ResourceRef } from '@angular/core';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe, tap } from 'rxjs';
import { Result } from '../../../core/models';
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
    withMethods((store) => {
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
        fallbackMessage: string
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
                    handleIdResult(result, 'Failed to create budget');

                    if (result.isSuccess) {
                      reload();
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
          'Failed to delete budget'
        ),
        createGroup: command<CreateBudgetGroupRequest>(
          (request) => store._budgetService.createGroup(request),
          'Failed to create budget group'
        ),
        updateGroup: command<UpdateBudgetGroupRequest>(
          (request) => store._budgetService.updateGroup(request),
          'Failed to update budget group'
        ),
        deleteGroup: command<number>(
          (budgetGroupId) => store._budgetService.deleteGroup(budgetGroupId),
          'Failed to delete budget group'
        ),
        createRow: command<CreateBudgetRowRequest>(
          (request) => store._budgetService.createRow(request),
          'Failed to create budget row'
        ),
        updateRow: command<UpdateBudgetRowRequest>(
          (request) => store._budgetService.updateRow(request),
          'Failed to update budget row'
        ),
        deleteRow: command<number>(
          (budgetRowId) => store._budgetService.deleteRow(budgetRowId),
          'Failed to delete budget row'
        ),
        createCell: command<CreateBudgetCellRequest>(
          (request) => store._budgetService.createCell(request),
          'Failed to create budget cell'
        ),
        updateCell: command<UpdateBudgetCellRequest>(
          (request) => store._budgetService.updateCell(request),
          'Failed to update budget cell'
        ),
        deleteCell: command<number>(
          (budgetCellId) => store._budgetService.deleteCell(budgetCellId),
          'Failed to delete budget cell'
        ),
      };
    })
  );
}
