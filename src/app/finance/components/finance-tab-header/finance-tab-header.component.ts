import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '@Dato88/homeapp-lib';
import { FinanceTab } from '../finance-view/+store/finance-ui.store';

@Component({
  selector: 'home-finance-tab-header',
  imports: [ButtonComponent],
  template: `
    <nav class="finance-tabs" aria-label="Finance sections">
      @for (tab of tabs; track tab.id) {
        <lib-button
          [label]="tab.label"
          [ariaLabel]="tab.label"
          [class.active-tab]="activeTab() === tab.id"
          (clicked)="selectTab.emit(tab.id)"></lib-button>
      }
    </nav>
  `,
  styles: `
    .finance-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    :host ::ng-deep .active-tab button {
      background-color: #676767;
      color: #fff;
    }
  `,
})
export class FinanceTabHeaderComponent {
  readonly activeTab = input.required<FinanceTab>();
  readonly selectTab = output<FinanceTab>();

  readonly tabs: { id: FinanceTab; label: string }[] = [
    { id: 'accounts', label: 'Accounts' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'categories', label: 'Categories' },
  ];
}
