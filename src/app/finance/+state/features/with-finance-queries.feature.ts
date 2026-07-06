import { ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { patchState, signalStoreFeature, type, withMethods, withProps } from '@ngrx/signals';
import { map, of } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/category.service';
import { TransactionService } from '../../services/transaction.service';
import {
  AccountDto,
  CategoryDto,
  TransactionFilter,
  TransactionListResponse,
} from '../models';

export interface FinanceQueryState {
  selectedCategoryHouseholdId: number | undefined;
  transactionFilter: TransactionFilter | undefined;
}

export function withFinanceQueries() {
  return signalStoreFeature(
    {
      props: type<{
        _accountService: AccountService;
        _categoryService: CategoryService;
        _transactionService: TransactionService;
      }>(),
      state: type<FinanceQueryState>(),
    },
    withProps((store) => {
      const accountsResource = rxResource({
        stream: () =>
          store._accountService
            .getAccounts()
            .pipe(map((result) => (result.isSuccess ? result.value : []))),
      }) as ResourceRef<AccountDto[]>;

      return {
        accountsResource,
        categoriesResource: rxResource({
          params: () => {
            const householdId = store.selectedCategoryHouseholdId();

            if (householdId) {
              return { householdId };
            }

            const filter = store.transactionFilter();
            if (filter?.accountId && accountsResource.hasValue()) {
              const account = accountsResource
                .value()
                .find((item: AccountDto) => item.accountId === filter.accountId);
              const fallbackHouseholdId = account?.sharedHouseholdIds[0];

              if (fallbackHouseholdId) {
                return { householdId: fallbackHouseholdId };
              }
            }

            return undefined;
          },
          stream: ({ params }) =>
            store._categoryService
              .getCategories(params.householdId)
              .pipe(map((result) => (result.isSuccess ? result.value : []))),
        }) as ResourceRef<CategoryDto[]>,
        transactionsResource: rxResource({
          params: () => store.transactionFilter(),
          stream: ({ params }) => {
            if (!params) {
              return of({ totalCount: 0, transactions: [] } satisfies TransactionListResponse);
            }

            return store._transactionService.getTransactions(params).pipe(
              map((result) =>
                result.isSuccess ? result.value : { totalCount: 0, transactions: [] }
              )
            );
          },
        }) as ResourceRef<TransactionListResponse>,
      };
    }),
    withMethods((store) => ({
      setCategoryHouseholdId(householdId: number | undefined): void {
        patchState(store, { selectedCategoryHouseholdId: householdId });
      },
      setTransactionFilter(filter: TransactionFilter | undefined): void {
        patchState(store, { transactionFilter: filter });
      },
    }))
  );
}
