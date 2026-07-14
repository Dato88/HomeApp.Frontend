import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import {
  ButtonComponent,
  DialogComponent,
  DropdownComboboxComponent,
  DropdownListComponent,
  GridCellTemplateDirective,
  GridColumnComponent,
  GridComponent,
  GridPaginationComponent,
  GridRowDetailsTemplateDirective,
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
import { RecipientBulkCategoryDialogComponent } from './recipient-bulk-category-dialog/recipient-bulk-category-dialog.component';
import { HouseholdStore } from '../../../household/+state/household.store';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { FileUploadComponent } from '../../../shared/ui/file-upload/file-upload.component';
import { ViewportService } from '../../../shared/services/viewport/viewport.service';
import {
  DropdownData,
  GRID_ROW_HEIGHT_WITH_DROPDOWN,
} from '../../../shared/models/dropdown-data.model';
import { formatIban, IbanFormatPipe } from '../../../shared/pipes/iban-format.pipe';

@Component({
  selector: 'home-transactions-view',
  imports: [
    DecimalPipe,
    ButtonComponent,
    DialogComponent,
    DropdownComboboxComponent,
    DropdownListComponent,
    GridCellTemplateDirective,
    GridColumnComponent,
    GridComponent,
    GridPaginationComponent,
    GridRowDetailsTemplateDirective,
    InputFieldComponent,
    SkeletonComponent,
    CheckboxComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
    FileUploadComponent,
    IbanFormatPipe,
    RecipientBulkCategoryDialogComponent,
  ],
  templateUrl: './transactions-view.component.html',
  styleUrl: './transactions-view.component.scss',
})
export class TransactionsViewComponent {
  readonly store = inject(FinanceStore);
  readonly householdStore = inject(HouseholdStore);
  readonly viewport = inject(ViewportService);

  readonly formDialog = viewChild.required<DialogComponent>('formDialog');

  private readonly fileUpload = viewChild(FileUploadComponent);

  readonly fromDate = signal('');
  readonly toDate = signal('');
  readonly uncategorizedOnly = signal(false);
  readonly selectedPaymentPartnerId = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = 50;

  readonly gridRowHeight = GRID_ROW_HEIGHT_WITH_DROPDOWN;

  /** Inline-Style schlägt lib-grid td { overflow: hidden } und fixe Zeilenhöhe. */
  readonly categoryCellStyle = {
    overflow: 'visible',
    verticalAlign: 'middle',
    maxHeight: 'none',
  };

  readonly editingTransaction = signal<TransactionDto | null>(null);
  readonly bookingDate = signal('');
  readonly amount = signal('');
  readonly paymentPartnerName = signal('');
  readonly purpose = signal('');
  readonly categoryId = signal('');

  readonly importFile = signal<File | null>(null);

  readonly bulkCategoryDialog = viewChild.required<DialogComponent>('bulkCategoryDialog');
  readonly ibanDialog = viewChild.required<DialogComponent>('ibanDialog');
  readonly recipientDialog =
    viewChild.required<RecipientBulkCategoryDialogComponent>('recipientDialog');

  readonly selectedTransactionIds = signal<ReadonlySet<number>>(new Set<number>());
  readonly bulkCategoryId = signal('');
  readonly selectedIbans = signal<ReadonlySet<string>>(new Set<string>());

  private readonly expandedTransactionId = signal<number | null>(null);
  private readonly submitted = signal(false);

  readonly isDetailsExpanded = (transaction: TransactionDto): boolean =>
    transaction.transactionId === this.expandedTransactionId();

  readonly showDateError = computed(() => this.submitted() && !this.bookingDate());
  readonly showAmountError = computed(() => {
    if (!this.submitted()) {
      return false;
    }

    const value = this.amount().trim();
    return !value || Number.isNaN(Number(value.replace(',', '.')));
  });

  readonly accountOptions = computed<DropdownData[]>(() =>
    this.store.accountEntities().map((account) => ({
      value: String(account.accountId),
      name: `${account.name}${account.iban ? ` (${formatIban(account.iban)})` : ''}`,
      trackBy: account.accountId,
    }))
  );

  readonly householdOptions = computed<DropdownData[]>(() => {
    const accountId = Number(this.store.selectedAccountId());
    const account = this.store.accountEntities().find((item) => item.accountId === accountId);

    if (!account || !account.sharedHouseholdIds.length) {
      return [];
    }

    return this.householdStore
      .householdEntities()
      .filter((household) => account.sharedHouseholdIds.includes(household.householdId))
      .map((household) => ({
        value: String(household.householdId),
        name: household.name,
        trackBy: household.householdId,
      }));
  });

  readonly selectedHouseholdIdValue = computed(() =>
    this.store.selectedHouseholdId() ? String(this.store.selectedHouseholdId()) : ''
  );

  readonly categoryOptions = computed<DropdownData[]>(() =>
    this.store.categoryEntities().map((category) => ({
      value: String(category.categoryId),
      name: category.name,
      trackBy: category.categoryId,
    }))
  );

  readonly paymentPartnerFilterOptions = computed<DropdownData[]>(() =>
    this.store.paymentPartnerEntities().map((partner) => ({
      value: String(partner.paymentPartnerId),
      name: partner.displayName,
      trackBy: partner.paymentPartnerId,
    }))
  );

  readonly selectedAccount = computed<AccountDto | undefined>(() => {
    const accountId = Number(this.store.selectedAccountId());

    return this.store.accountEntities().find((account) => account.accountId === accountId);
  });

  readonly canWrite = computed(() => this.selectedAccount()?.isOwner ?? false);

  readonly totalCount = computed(
    () =>
      (this.store.transactionsResource.hasValue()
        ? this.store.transactionsResource.value()?.totalCount
        : 0) ?? 0
  );

  readonly selectedCount = computed(() => this.selectedTransactionIds().size);

  readonly allOnPageSelected = computed(() => {
    const transactions = this.store.transactionEntities();
    const selected = this.selectedTransactionIds();

    return (
      transactions.length > 0 &&
      transactions.every((transaction) => selected.has(transaction.transactionId))
    );
  });

  /**
   * Kandidaten für die IBAN-Auswahl: eindeutige Gegenkonto-IBANs der aktuell
   * geladenen Seite. Wiederkehrende Buchungen (Miete, Abos, Gehalt) teilen sich
   * eine IBAN und lassen sich so in einem Rutsch auswählen.
   */
  readonly ibanCandidates = computed(() => {
    const byIban = new Map<string, { iban: string; name: string; count: number }>();

    for (const transaction of this.store.transactionEntities()) {
      const iban = transaction.paymentPartnerIban;

      if (!iban) {
        continue;
      }

      const existing = byIban.get(iban);

      if (existing) {
        existing.count += 1;
      } else {
        byIban.set(iban, {
          iban,
          name: transaction.paymentPartnerName ?? '—',
          count: 1,
        });
      }
    }

    return [...byIban.values()].sort((a, b) => b.count - a.count);
  });

  readonly selectedIbanCount = computed(() => this.selectedIbans().size);

  constructor() {
    effect(() => {
      const accountId = Number(this.store.selectedAccountId());

      if (!accountId || Number.isNaN(accountId)) {
        this.store.setTransactionFilter(undefined);
        return;
      }

      this.store.setTransactionFilter({
        accountId,
        from: this.fromDate() || null,
        to: this.toDate() || null,
        uncategorized: this.uncategorizedOnly() ? true : undefined,
        paymentPartnerId: this.selectedPaymentPartnerId()
          ? Number(this.selectedPaymentPartnerId())
          : null,
        page: this.pageIndex() + 1,
        pageSize: this.pageSize,
      });
    });

    effect(() => {
      const account = this.selectedAccount();

      if (account?.sharedHouseholdIds.length) {
        this.store.setSelectedHouseholdId(account.sharedHouseholdIds[0]);
      }
    });
  }

  setSelectedHouseholdId(householdId: string): void {
    this.store.setSelectedHouseholdId(householdId ? Number(householdId) : undefined);
  }

  onAccountFilterChange(): void {
    this.pageIndex.set(0);
    this.expandedTransactionId.set(null);
    this.clearSelection();
  }

  applyFilters(): void {
    this.pageIndex.set(0);
    this.clearSelection();
  }

  onPageChange(pageIndex: number): void {
    this.pageIndex.set(pageIndex);
    this.expandedTransactionId.set(null);
    this.clearSelection();
  }

  isTransactionSelected(transaction: TransactionDto): boolean {
    return this.selectedTransactionIds().has(transaction.transactionId);
  }

  toggleTransactionSelection(transaction: TransactionDto, checked: boolean): void {
    this.selectedTransactionIds.update((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(transaction.transactionId);
      } else {
        next.delete(transaction.transactionId);
      }

      return next;
    });
  }

  toggleSelectAll(checked: boolean): void {
    if (!checked) {
      this.clearSelection();
      return;
    }

    this.selectedTransactionIds.set(
      new Set(this.store.transactionEntities().map((transaction) => transaction.transactionId))
    );
  }

  clearSelection(): void {
    this.selectedTransactionIds.set(new Set<number>());
  }

  openBulkCategoryDialog(): void {
    if (!this.selectedCount()) {
      return;
    }

    this.bulkCategoryId.set('');
    this.bulkCategoryDialog().open();
  }

  closeBulkCategoryDialog(): void {
    this.bulkCategoryDialog().close();
  }

  submitBulkCategory(): void {
    const transactionIds = [...this.selectedTransactionIds()];

    if (!transactionIds.length) {
      return;
    }

    this.store.setTransactionCategory({
      transactionIds,
      categoryId: this.bulkCategoryId() ? Number(this.bulkCategoryId()) : null,
    });
    this.closeBulkCategoryDialog();
    this.clearSelection();
  }

  openIbanDialog(): void {
    this.selectedIbans.set(new Set<string>());
    this.ibanDialog().open();
  }

  closeIbanDialog(): void {
    this.ibanDialog().close();
  }

  isIbanSelected(iban: string): boolean {
    return this.selectedIbans().has(iban);
  }

  toggleIbanSelection(iban: string, checked: boolean): void {
    this.selectedIbans.update((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(iban);
      } else {
        next.delete(iban);
      }

      return next;
    });
  }

  /** Alle geladenen Buchungen der gewählten IBANs in die Auswahl übernehmen. */
  applyIbanSelection(): void {
    const ibans = this.selectedIbans();

    if (!ibans.size) {
      return;
    }

    this.selectedTransactionIds.update((current) => {
      const next = new Set(current);

      for (const transaction of this.store.transactionEntities()) {
        if (transaction.paymentPartnerIban && ibans.has(transaction.paymentPartnerIban)) {
          next.add(transaction.transactionId);
        }
      }

      return next;
    });

    this.closeIbanDialog();
  }

  openRecipientDialog(transaction: TransactionDto): void {
    this.recipientDialog().open(transaction);
  }

  assignRecipientCategory(request: SetTransactionCategoryRequest): void {
    this.store.setTransactionCategory(request);
  }

  toggleDetails(transaction: TransactionDto): void {
    this.expandedTransactionId.update((current) =>
      current === transaction.transactionId ? null : transaction.transactionId
    );
  }

  openCreate(): void {
    if (!this.canWrite()) {
      return;
    }

    this.editingTransaction.set(null);
    this.submitted.set(false);
    this.bookingDate.set(new Date().toISOString().slice(0, 10));
    this.amount.set('');
    this.paymentPartnerName.set('');
    this.purpose.set('');
    this.categoryId.set('');
    this.formDialog().open();
  }

  openEdit(transaction: TransactionDto): void {
    if (!this.canWrite()) {
      return;
    }

    this.editingTransaction.set(transaction);
    this.submitted.set(false);
    this.bookingDate.set(transaction.bookingDate);
    this.amount.set(String(transaction.amount));
    this.paymentPartnerName.set(transaction.paymentPartnerName ?? '');
    this.purpose.set(transaction.purpose ?? '');
    this.categoryId.set(transaction.categoryId != null ? String(transaction.categoryId) : '');
    this.formDialog().open();
  }

  closeFormDialog(): void {
    this.formDialog().close();
  }

  onFormDialogClosed(): void {
    this.editingTransaction.set(null);
    this.submitted.set(false);
  }

  submitTransaction(): void {
    this.submitted.set(true);
    const accountId = Number(this.store.selectedAccountId());
    const parsedAmount = Number(this.amount().replace(',', '.'));

    if (!accountId || Number.isNaN(parsedAmount) || !this.amount().trim() || !this.bookingDate()) {
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
        paymentPartnerName: this.paymentPartnerName().trim() || null,
        purpose: this.purpose().trim() || null,
      };
      this.store.updateTransaction(request);

      if (category !== editing.categoryId) {
        this.store.setTransactionCategory({
          transactionIds: [editing.transactionId],
          categoryId: category,
        });
      }
    } else {
      const request: CreateTransactionRequest = {
        accountId,
        bookingDate: this.bookingDate(),
        amount: parsedAmount,
        paymentPartnerName: this.paymentPartnerName().trim() || null,
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
      transactionIds: [transaction.transactionId],
      categoryId: categoryId ? Number(categoryId) : null,
    });
  }

  onImportFileSelected(file: File | undefined): void {
    this.importFile.set(file ?? null);
  }

  submitImport(): void {
    const accountId = Number(this.store.selectedAccountId());
    const file = this.importFile();

    if (!this.canWrite() || !accountId || !file) {
      return;
    }

    this.store.importTransactions({ accountId, file });
    this.fileUpload()?.clear();
  }

  categoryValue(categoryId: number | null): string {
    if (categoryId == null || categoryId === 0) {
      return '';
    }

    const value = String(categoryId);
    return this.categoryOptions().some((option) => option.value === value) ? value : '';
  }
}
