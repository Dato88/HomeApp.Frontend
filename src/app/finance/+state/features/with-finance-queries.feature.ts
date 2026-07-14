import { ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { patchState, signalStoreFeature, type, withMethods, withProps } from '@ngrx/signals';
import { map, of } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { CategoryGroupService } from '../../services/category-group.service';
import { CategoryService } from '../../services/category.service';
import { PaymentPartnerService } from '../../services/payment-partner.service';
import { ReportService } from '../../services/report.service';
import { TransactionService } from '../../services/transaction.service';
import {
  AccountDto,
  CategoryDto,
  CategoryGroupDto,
  EvaReportFilter,
  EvaReportResponse,
  PaymentPartnerDto,
  TransactionFilter,
  TransactionListResponse,
} from '../models';

export interface FinanceQueryState {
  selectedAccountId: string;
  selectedHouseholdId: number | undefined;
  transactionFilter: TransactionFilter | undefined;
  evaReportFilter: EvaReportFilter | undefined;
}

export function withFinanceQueries() {
  return signalStoreFeature(
    {
      props: type<{
        _accountService: AccountService;
        _categoryService: CategoryService;
        _categoryGroupService: CategoryGroupService;
        _paymentPartnerService: PaymentPartnerService;
        _reportService: ReportService;
        _transactionService: TransactionService;
      }>(),
      state: type<FinanceQueryState>(),
    },
    withProps((store) => ({
      accountsResource: rxResource({
        stream: () =>
          store._accountService
            .getAccounts()
            .pipe(map((result) => (result.isSuccess ? result.value : []))),
      }) as ResourceRef<AccountDto[]>,
      categoriesResource: rxResource({
        params: () => {
          const householdId = store.selectedHouseholdId();
          return householdId ? { householdId } : undefined;
        },
        stream: ({ params }) =>
          store._categoryService
            .getCategories(params.householdId)
            .pipe(map((result) => (result.isSuccess ? result.value : []))),
      }) as ResourceRef<CategoryDto[]>,
      categoryGroupsResource: rxResource({
        params: () => {
          const householdId = store.selectedHouseholdId();
          return householdId ? { householdId } : undefined;
        },
        stream: ({ params }) =>
          store._categoryGroupService
            .getCategoryGroups(params.householdId)
            .pipe(map((result) => (result.isSuccess ? result.value : []))),
      }) as ResourceRef<CategoryGroupDto[]>,
      paymentPartnersResource: rxResource({
        stream: () =>
          store._paymentPartnerService
            .getPaymentPartners()
            .pipe(map((result) => (result.isSuccess ? result.value : []))),
      }) as ResourceRef<PaymentPartnerDto[]>,
      transactionsResource: rxResource({
        params: () => store.transactionFilter(),
        stream: ({ params }) => {
          if (!params) {
            return of({ totalCount: 0, transactions: [] } satisfies TransactionListResponse);
          }

          return store._transactionService
            .getTransactions(params)
            .pipe(
              map((result) =>
                result.isSuccess ? result.value : { totalCount: 0, transactions: [] }
              )
            );
        },
      }) as ResourceRef<TransactionListResponse>,
      evaReportResource: rxResource({
        params: () => {
          const filter = store.evaReportFilter();
          return filter?.householdIds.length ? filter : undefined;
        },
        stream: ({ params }) =>
          store._reportService
            .getEvaReport(params)
            .pipe(map((result) => (result.isSuccess ? result.value : null))),
      }) as ResourceRef<EvaReportResponse | null>,
    })),
    withMethods((store) => ({
      setSelectedAccountId(accountId: string): void {
        patchState(store, { selectedAccountId: accountId });
      },
      setSelectedHouseholdId(householdId: number | undefined): void {
        patchState(store, { selectedHouseholdId: householdId });
      },
      setTransactionFilter(filter: TransactionFilter | undefined): void {
        patchState(store, { transactionFilter: filter });
      },
      setEvaReportFilter(filter: EvaReportFilter | undefined): void {
        patchState(store, { evaReportFilter: filter });
      },
    }))
  );
}
