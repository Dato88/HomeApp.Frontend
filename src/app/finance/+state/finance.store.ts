import { inject, isDevMode } from '@angular/core';
import { signalStore, signalStoreFeature, withProps, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withErrorHandling } from '../../+store/features/with-error.feature';
import { AccountService } from '../services/account.service';
import { CategoryGroupService } from '../services/category-group.service';
import { CategoryService } from '../services/category.service';
import { ReportService } from '../services/report.service';
import { TransactionService } from '../services/transaction.service';
import { accountEntities } from './configs/account.config';
import { categoryEntities } from './configs/category.config';
import { categoryGroupEntities } from './configs/category-group.config';
import { transactionEntities } from './configs/transaction.config';
import { withFinanceQueries } from './features/with-finance-queries.feature';
import { withFinanceEntitySync } from './features/with-finance-entity-sync.feature';
import { withFinanceCommands } from './features/with-finance-commands.feature';

const financeStoreFeatures = [
  withState({
    isSaving: false,
    selectedAccountId: '' as string,
    selectedHouseholdId: undefined as number | undefined,
    transactionFilter: undefined as import('./models').TransactionFilter | undefined,
    evaReportFilter: undefined as import('./models').EvaReportFilter | undefined,
    lastImportResult: null as import('./models').ImportTransactionsResponse | null,
  }),
  withProps(() => ({
    _accountService: inject(AccountService),
    _categoryService: inject(CategoryService),
    _categoryGroupService: inject(CategoryGroupService),
    _reportService: inject(ReportService),
    _transactionService: inject(TransactionService),
  })),
  withEntities(accountEntities),
  withEntities(categoryEntities),
  withEntities(categoryGroupEntities),
  withEntities(transactionEntities),
  withErrorHandling(),
  withFinanceQueries(),
  withFinanceEntitySync(),
  withFinanceCommands(),
] as const;

const devtoolsFeature = isDevMode() ? withDevtools('finance') : signalStoreFeature(withState({}));

export const FinanceStore = signalStore(
  { providedIn: 'root' },
  ...financeStoreFeatures,
  devtoolsFeature
);
