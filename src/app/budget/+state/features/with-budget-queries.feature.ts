import { ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { patchState, signalStoreFeature, type, withMethods, withProps } from '@ngrx/signals';
import { of } from 'rxjs';
import { BudgetService } from '../../services/budget.service';
import { BudgetResponse, BudgetSelection, EvaResponse } from '../models';

export interface BudgetQueryState {
  selection: BudgetSelection | undefined;
}

export function withBudgetQueries() {
  return signalStoreFeature(
    {
      props: type<{ _budgetService: BudgetService }>(),
      state: type<BudgetQueryState>(),
    },
    withProps((store) => ({
      budgetResource: rxResource({
        params: () => store.selection(),
        stream: ({ params }) => {
          if (!params) {
            return of(null);
          }

          return store._budgetService.getBudget(params.householdId, params.year);
        },
      }) as ResourceRef<BudgetResponse | null>,
      evaResource: rxResource({
        params: () => store.selection(),
        stream: ({ params }) => {
          if (!params) {
            return of(null);
          }

          return store._budgetService.getEva(params.householdId, params.year);
        },
      }) as ResourceRef<EvaResponse | null>,
    })),
    withMethods((store) => ({
      setSelection(selection: BudgetSelection | undefined): void {
        patchState(store, { selection });
      },
    }))
  );
}
