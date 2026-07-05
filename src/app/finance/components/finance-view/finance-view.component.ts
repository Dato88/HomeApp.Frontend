import { Component, inject } from '@angular/core';
import { FinanceStore } from '../../+state/finance.store';
import { FinanceUiStore } from './+store/finance-ui.store';
import { FinanceTabHeaderComponent } from '../finance-tab-header/finance-tab-header.component';
import { AccountsViewComponent } from '../accounts-view/accounts-view.component';
import { TransactionsViewComponent } from '../transactions-view/transactions-view.component';
import { CategoriesViewComponent } from '../categories-view/categories-view.component';

@Component({
  selector: 'home-finance-view',
  imports: [
    FinanceTabHeaderComponent,
    AccountsViewComponent,
    TransactionsViewComponent,
    CategoriesViewComponent,
  ],
  providers: [FinanceUiStore],
  templateUrl: './finance-view.component.html',
  styleUrl: './finance-view.component.scss',
})
export class FinanceViewComponent {
  readonly store = inject(FinanceStore);
  readonly uiStore = inject(FinanceUiStore);
}
