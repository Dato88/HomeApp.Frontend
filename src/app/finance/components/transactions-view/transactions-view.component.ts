import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import {
  ButtonComponent,
  DialogComponent,
  DropdownListComponent,
  GridCellTemplateDirective,
  GridColumnComponent,
  GridComponent,
  GridPaginationComponent,
  InputFieldComponent,
  SkeletonComponent,
} from '@Dato88/homeapp-lib';
import { FinanceStore } from '../../+state/finance.store';
import {
  AccountDto,
  CreateTransactionRequest,
  SetTransactionCategoryRequest,
  TransactionDto,
  UpdateTransactionRequest,
} from '../../+state/models';
import { HouseholdStore } from '../../../household/+state/household.store';

interface DropdownOption {
  value: string;
  name: string;
  trackBy: number;
}

@Component({
  selector: 'home-transactions-view',
  imports: [
    DecimalPipe,
    ButtonComponent,
    DialogComponent,
    DropdownListComponent,
    GridCellTemplateDirective,
    GridColumnComponent,
    GridComponent,
    GridPaginationComponent,
    InputFieldComponent,
    SkeletonComponent,
  ],
  templateUrl: './transactions-view.component.html',
  styleUrl: './transactions-view.component.scss',
})
export class TransactionsViewComponent {
  readonly store = inject(FinanceStore);
  readonly householdStore = inject(HouseholdStore);

  readonly formDialog = viewChild.required<DialogComponent>('formDialog');

  readonly selectedAccountId = signal('');
  readonly fromDate = signal('');
  readonly toDate = signal('');
  readonly uncategorizedOnly = signal(false);
  readonly pageIndex = signal(0);
  readonly pageSize = 50;

  readonly editingTransaction = signal<TransactionDto | null>(null);
  readonly bookingDate = signal('');
  readonly amount = signal('');
  readonly counterpartyName = signal('');
  readonly purpose = signal('');
  readonly categoryId = signal('');

  readonly importFile = signal<File | null>(null);

  readonly accountOptions = computed<DropdownOption[]>(() =>
    this.store.accountEntities().map((account) => ({
      value: String(account.accountId),
      name: `${account.name}${account.iban ? ` (${account.iban})` : ''}`,
      trackBy: account.accountId,
    }))
  );

  readonly categoryOptions = computed<DropdownOption[]>(() => {
    const accountId = Number(this.selectedAccountId());
    const account = this.store.accountEntities().find((item) => item.accountId === accountId);

    if (!account) {
      return [];
    }

    return this.store
      .categoryEntities()
      .filter((category) => account.sharedHouseholdIds.includes(category.householdId))
      .map((category) => ({
        value: String(category.categoryId),
        name: category.name,
        trackBy: category.categoryId,
      }));
  });

  readonly selectedAccount = computed<AccountDto | undefined>(() => {
    const accountId = Number(this.selectedAccountId());

    return this.store.accountEntities().find((account) => account.accountId === accountId);
  });

  readonly canWrite = computed(() => this.selectedAccount()?.isOwner ?? false);

  readonly totalCount = computed(
    () =>
      (this.store.transactionsResource.hasValue()
        ? this.store.transactionsResource.value()?.totalCount
        : 0) ?? 0
  );

  constructor() {
    effect(() => {
      const accountId = Number(this.selectedAccountId());

      if (!accountId || Number.isNaN(accountId)) {
        this.store.setTransactionFilter(undefined);
        return;
      }

      this.store.setTransactionFilter({
        accountId,
        from: this.fromDate() || null,
        to: this.toDate() || null,
        uncategorized: this.uncategorizedOnly() ? true : undefined,
        page: this.pageIndex() + 1,
        pageSize: this.pageSize,
      });
    });

    effect(() => {
      const account = this.selectedAccount();

      if (account?.sharedHouseholdIds.length) {
        this.store.setCategoryHouseholdId(account.sharedHouseholdIds[0]);
      }
    });
  }

  onAccountChange(accountId: string): void {
    this.selectedAccountId.set(accountId);
    this.pageIndex.set(0);
  }

  applyFilters(): void {
    this.pageIndex.set(0);
  }

  onPageChange(pageIndex: number): void {
    this.pageIndex.set(pageIndex);
  }

  openCreate(): void {
    if (!this.canWrite()) {
      return;
    }

    this.editingTransaction.set(null);
    this.bookingDate.set(new Date().toISOString().slice(0, 10));
    this.amount.set('');
    this.counterpartyName.set('');
    this.purpose.set('');
    this.categoryId.set('');
    this.formDialog().open();
  }

  openEdit(transaction: TransactionDto): void {
    if (!this.canWrite()) {
      return;
    }

    this.editingTransaction.set(transaction);
    this.bookingDate.set(transaction.bookingDate);
    this.amount.set(String(transaction.amount));
    this.counterpartyName.set(transaction.counterpartyName ?? '');
    this.purpose.set(transaction.purpose ?? '');
    this.categoryId.set(transaction.categoryId != null ? String(transaction.categoryId) : '');
    this.formDialog().open();
  }

  closeFormDialog(): void {
    this.formDialog().close();
    this.editingTransaction.set(null);
  }

  submitTransaction(): void {
    const accountId = Number(this.selectedAccountId());
    const parsedAmount = Number(this.amount().replace(',', '.'));

    if (!accountId || Number.isNaN(parsedAmount) || !this.bookingDate()) {
      return;
    }

    const editing = this.editingTransaction();
    const category = this.categoryId() ? Number(this.categoryId()) : null;

    if (editing) {
      const request: UpdateTransactionRequest = {
        transactionId: editing.transactionId,
        bookingDate: this.bookingDate(),
        valueDate: editing.valueDate,
        amount: parsedAmount,
        counterpartyName: this.counterpartyName().trim() || null,
        purpose: this.purpose().trim() || null,
      };
      this.store.updateTransaction(request);

      if (category !== editing.categoryId) {
        this.store.setTransactionCategory({
          transactionId: editing.transactionId,
          categoryId: category,
        });
      }
    } else {
      const request: CreateTransactionRequest = {
        accountId,
        bookingDate: this.bookingDate(),
        amount: parsedAmount,
        counterpartyName: this.counterpartyName().trim() || null,
        purpose: this.purpose().trim() || null,
        categoryId: category,
      };
      this.store.createTransaction(request);
    }

    this.closeFormDialog();
  }

  deleteTransaction(transaction: TransactionDto): void {
    if (this.canWrite()) {
      this.store.deleteTransaction(transaction.transactionId);
    }
  }

  setCategory(transaction: TransactionDto, categoryId: string): void {
    this.store.setTransactionCategory({
      transactionId: transaction.transactionId,
      categoryId: categoryId ? Number(categoryId) : null,
    });
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.importFile.set(file);
  }

  submitImport(): void {
    const accountId = Number(this.selectedAccountId());
    const file = this.importFile();

    if (!this.canWrite() || !accountId || !file) {
      return;
    }

    this.store.importTransactions({ accountId, file });
    this.importFile.set(null);
  }

  categoryValue(categoryId: number | null): string {
    return categoryId != null ? String(categoryId) : '';
  }
}
