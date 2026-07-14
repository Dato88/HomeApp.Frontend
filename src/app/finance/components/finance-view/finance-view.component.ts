import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinanceStore } from '../../+state/finance.store';
import { FinanceTab, FinanceUiStore } from './+store/finance-ui.store';
import { AccountsViewComponent } from '../accounts-view/accounts-view.component';
import { TransactionsViewComponent } from '../transactions-view/transactions-view.component';
import { CategoriesViewComponent } from '../categories-view/categories-view.component';
import { PaymentPartnersViewComponent } from '../payment-partners-view/payment-partners-view.component';
import { ReportViewComponent } from '../report-view/report-view.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { TabBarComponent, TabItem } from '../../../shared/ui/tab-bar/tab-bar.component';

@Component({
  selector: 'home-finance-view',
  imports: [
    AccountsViewComponent,
    TransactionsViewComponent,
    CategoriesViewComponent,
    PaymentPartnersViewComponent,
    ReportViewComponent,
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
    { id: 'paymentPartners', label: 'Zahlungspartner' },
    { id: 'report', label: 'Auswertung' },
  ];

  constructor() {
    // Deep-Link von der Dashboard-Kachel: /finance?tab=report
    const tab = inject(ActivatedRoute).snapshot.queryParamMap.get('tab');

    if (tab && this.tabs.some((item) => item.id === tab)) {
      this.uiStore.setActiveTab(tab as FinanceTab);
    }
  }
}
