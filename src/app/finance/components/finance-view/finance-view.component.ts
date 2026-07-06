import { Component, effect, inject } from '@angular/core';
import { FinanceStore } from '../../+state/finance.store';
import { FinanceTab, FinanceUiStore } from './+store/finance-ui.store';
import { AccountsViewComponent } from '../accounts-view/accounts-view.component';
import { TransactionsViewComponent } from '../transactions-view/transactions-view.component';
import { CategoriesViewComponent } from '../categories-view/categories-view.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { TabBarComponent, TabItem } from '../../../shared/ui/tab-bar/tab-bar.component';

const TRANSACTIONS_PAGE_SIZE = 50;

@Component({
  selector: 'home-finance-view',
  imports: [
    AccountsViewComponent,
    TransactionsViewComponent,
    CategoriesViewComponent,
    PageHeaderComponent,
    TabBarComponent,
  ],
  providers: [FinanceUiStore],
  templateUrl: './finance-view.component.html',
  styleUrl: './finance-view.component.scss',
})
export class FinanceViewComponent {
  readonly store = inject(FinanceStore);
  readonly uiStore = inject(FinanceUiStore);

  readonly tabs: TabItem<FinanceTab>[] = [
    { id: 'accounts', label: 'Konten' },
    { id: 'transactions', label: 'Buchungen' },
    { id: 'categories', label: 'Kategorien' },
  ];

  constructor() {
    this.hydrateUiFromDomainStore();

    effect(() => {
      const accountId = this.uiStore.transactionsAccountId();
      const id = Number(accountId);

      if (!accountId || Number.isNaN(id)) {
        return;
      }

      this.store.setTransactionFilter({
        accountId: id,
        from: this.uiStore.transactionsFromDate() || null,
        to: this.uiStore.transactionsToDate() || null,
        uncategorized: this.uiStore.transactionsUncategorizedOnly() ? true : undefined,
        page: this.uiStore.transactionsPageIndex() + 1,
        pageSize: TRANSACTIONS_PAGE_SIZE,
      });
    });

    effect(() => {
      const householdId = this.uiStore.categoriesHouseholdId();
      const id = Number(householdId);

      if (!householdId || Number.isNaN(id)) {
        return;
      }

      this.store.setCategoryHouseholdId(id);
    });
  }

  private hydrateUiFromDomainStore(): void {
    const filter = this.store.transactionFilter();

    if (filter?.accountId) {
      this.uiStore.hydrateFromDomain({
        transactionsAccountId: String(filter.accountId),
        transactionsFromDate: filter.from ?? '',
        transactionsToDate: filter.to ?? '',
        transactionsUncategorizedOnly: filter.uncategorized ?? false,
        transactionsPageIndex: (filter.page ?? 1) - 1,
      });
    }

    const householdId = this.store.selectedCategoryHouseholdId();

    if (householdId != null) {
      this.uiStore.hydrateFromDomain({ categoriesHouseholdId: String(householdId) });
    }
  }
}
