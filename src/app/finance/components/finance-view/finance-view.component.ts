import { Component, inject } from '@angular/core';
import { FinanceStore } from '../../+state/finance.store';
import { FinanceTab, FinanceUiStore } from './+store/finance-ui.store';
import { AccountsViewComponent } from '../accounts-view/accounts-view.component';
import { TransactionsViewComponent } from '../transactions-view/transactions-view.component';
import { CategoriesViewComponent } from '../categories-view/categories-view.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { TabBarComponent, TabItem } from '../../../shared/ui/tab-bar/tab-bar.component';

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
}
