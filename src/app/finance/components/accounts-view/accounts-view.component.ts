import { Component, computed, inject, signal, viewChild } from '@angular/core';
import {
  ButtonComponent,
  DialogComponent,
  DropdownListComponent,
  GridCellTemplateDirective,
  GridColumnComponent,
  GridComponent,
  GridRowDetailsTemplateDirective,
  InputFieldComponent,
  SkeletonComponent,
} from '@Dato88/homeapp-lib';
import { HouseholdStore } from '../../../household/+state/household.store';
import { FinanceStore } from '../../+state/finance.store';
import {
  ACCOUNT_TYPE_LABELS,
  AccountDto,
  AccountType,
  CreateAccountRequest,
  ShareAccountRequest,
  UpdateAccountRequest,
} from '../../+state/models';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { ViewportService } from '../../../shared/services/viewport/viewport.service';
import { DropdownData } from '../../../shared/models/dropdown-data.model';

@Component({
  selector: 'home-accounts-view',
  imports: [
    ButtonComponent,
    DialogComponent,
    DropdownListComponent,
    GridCellTemplateDirective,
    GridColumnComponent,
    GridComponent,
    GridRowDetailsTemplateDirective,
    InputFieldComponent,
    SkeletonComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
  ],
  templateUrl: './accounts-view.component.html',
  styleUrl: './accounts-view.component.scss',
})
export class AccountsViewComponent {
  readonly store = inject(FinanceStore);
  readonly householdStore = inject(HouseholdStore);
  readonly viewport = inject(ViewportService);

  readonly createDialog = viewChild.required<DialogComponent>('createDialog');
  readonly shareDialog = viewChild.required<DialogComponent>('shareDialog');

  readonly editingAccount = signal<AccountDto | null>(null);
  readonly shareAccountId = signal<number | null>(null);
  readonly shareHouseholdId = signal('');

  readonly name = signal('');
  readonly iban = signal('');
  readonly bic = signal('');
  readonly currencyCode = signal('EUR');
  readonly description = signal('');
  readonly accountType = signal(String(AccountType.Checking));
  readonly createHouseholdIds = signal('');

  private readonly submitted = signal(false);
  private readonly expandedAccountId = signal<number | null>(null);

  readonly isDetailsExpanded = (account: AccountDto): boolean =>
    account.accountId === this.expandedAccountId();

  readonly showNameError = computed(() => this.submitted() && !this.name().trim());

  readonly accountTypeOptions = computed<DropdownData[]>(() =>
    Object.entries(ACCOUNT_TYPE_LABELS)
      .filter(([value]) => Number(value) !== AccountType.Unknown)
      .map(([value, label]) => ({
        value,
        name: label,
        trackBy: Number(value),
      }))
  );

  readonly householdOptions = computed<DropdownData[]>(() =>
    this.householdStore.householdEntities().map((household) => ({
      value: String(household.householdId),
      name: household.name,
      trackBy: household.householdId,
    }))
  );

  openCreate(): void {
    this.editingAccount.set(null);
    this.submitted.set(false);
    this.name.set('');
    this.iban.set('');
    this.bic.set('');
    this.currencyCode.set('EUR');
    this.description.set('');
    this.accountType.set(String(AccountType.Checking));
    this.createHouseholdIds.set('');
    this.createDialog().open();
  }

  openEdit(account: AccountDto): void {
    if (!account.isOwner) {
      return;
    }

    this.editingAccount.set(account);
    this.submitted.set(false);
    this.name.set(account.name);
    this.iban.set(account.iban ?? '');
    this.bic.set(account.bic ?? '');
    this.currencyCode.set(account.currencyCode);
    this.description.set(account.description ?? '');
    this.accountType.set(String(account.accountType));
    this.createDialog().open();
  }

  closeCreateDialog(): void {
    this.createDialog().close();
  }

  onCreateDialogClosed(): void {
    this.editingAccount.set(null);
    this.submitted.set(false);
  }

  submitAccount(): void {
    this.submitted.set(true);
    const trimmedName = this.name().trim();

    if (!trimmedName) {
      return;
    }

    const accountType = Number(this.accountType()) as AccountType;
    const editing = this.editingAccount();

    if (editing) {
      const request: UpdateAccountRequest = {
        accountId: editing.accountId,
        name: trimmedName,
        iban: this.iban().trim() || null,
        bic: this.bic().trim() || null,
        accountType,
        currencyCode: this.currencyCode().trim() || 'EUR',
        description: this.description().trim() || null,
        isActive: editing.isActive,
      };
      this.store.updateAccount(request);
    } else {
      const householdIds = this.createHouseholdIds()
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .map(Number)
        .filter((id) => !Number.isNaN(id));

      const request: CreateAccountRequest = {
        name: trimmedName,
        iban: this.iban().trim() || null,
        bic: this.bic().trim() || null,
        accountType,
        currencyCode: this.currencyCode().trim() || 'EUR',
        description: this.description().trim() || null,
        householdIds: householdIds.length ? householdIds : undefined,
      };
      this.store.createAccount(request);
    }

    this.closeCreateDialog();
  }

  deleteAccount(account: AccountDto): void {
    if (account.isOwner) {
      this.store.deleteAccount(account.accountId);
    }
  }

  openShare(accountId: number): void {
    this.shareAccountId.set(accountId);
    this.shareHouseholdId.set('');
    this.shareDialog().open();
  }

  closeShareDialog(): void {
    this.shareDialog().close();
    this.shareAccountId.set(null);
  }

  submitShare(): void {
    const accountId = this.shareAccountId();
    const householdId = Number(this.shareHouseholdId());

    if (accountId == null || Number.isNaN(householdId)) {
      return;
    }

    const request: ShareAccountRequest = { accountId, householdId };
    this.store.shareAccount(request);
    this.closeShareDialog();
  }

  unshare(account: AccountDto, householdId: number): void {
    if (!account.isOwner) {
      return;
    }

    this.store.unshareAccount({ accountId: account.accountId, householdId });
  }

  accountTypeLabel(account: AccountDto): string {
    return ACCOUNT_TYPE_LABELS[account.accountType] ?? 'Unbekannt';
  }

  sharedHouseholdNames(account: AccountDto): string {
    const households = this.householdStore.householdEntities();
    return account.sharedHouseholdIds
      .map((id) => households.find((household) => household.householdId === id)?.name ?? `#${id}`)
      .join(', ');
  }

  toggleDetails(account: AccountDto): void {
    this.expandedAccountId.update((current) =>
      current === account.accountId ? null : account.accountId
    );
  }
}
