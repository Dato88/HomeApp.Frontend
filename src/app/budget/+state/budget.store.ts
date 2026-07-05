import { inject, isDevMode } from '@angular/core';
import { signalStore, signalStoreFeature, withProps, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withErrorHandling } from '../../+store/features/with-error.feature';
import { BudgetService } from '../services/budget.service';
import { BudgetSelection } from './models';
import { withBudgetQueries } from './features/with-budget-queries.feature';
import { withBudgetCommands } from './features/with-budget-commands.feature';

const budgetStoreFeatures = [
  withState({
    isSaving: false,
    selection: undefined as BudgetSelection | undefined,
  }),
  withProps(() => ({ _budgetService: inject(BudgetService) })),
  withErrorHandling(),
  withBudgetQueries(),
  withBudgetCommands(),
] as const;

const devtoolsFeature = isDevMode()
  ? withDevtools('budget')
  : signalStoreFeature(withState({}));

export const BudgetStore = signalStore(
  { providedIn: 'root' },
  ...budgetStoreFeatures,
  devtoolsFeature
);
