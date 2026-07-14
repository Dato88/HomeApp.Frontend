import { DecimalPipe } from '@angular/common';
import {
  Component,
  ResourceRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ButtonComponent,
  DialogComponent,
  DropdownListComponent,
  GridCellTemplateDirective,
  GridColumnComponent,
  GridComponent,
  SkeletonComponent,
} from '@Dato88/homeapp-lib';
import { map } from 'rxjs';
import {
  SetTransactionCategoryRequest,
  TransactionDto,
  TransactionFilter,
  TransactionListResponse,
} from '../../../+state/models';
import { TransactionService } from '../../../services/transaction.service';
import { CheckboxComponent } from '../../../../shared/ui/checkbox/checkbox.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { DropdownData } from '../../../../shared/models/dropdown-data.model';

/** Max des Transaktionsfilters, sicher unter dem 500er-Limit des Batch-Endpoints. */
const PAGE_SIZE = 200;

/**
 * Dialog „Kategorie per Empfänger zuweisen": lädt alle Buchungen der
 * Gegenkonto-IBAN einer Buchung und weist einer Auswahl davon eine Kategorie zu.
 * Lädt über eine eigene Resource statt der Store-Resource — der Entity-Sync
 * würde sonst das Haupt-Grid mit den Dialog-Daten überschreiben. Der
 * Schreibzugriff bleibt beim Aufrufer: `assign` liefert den fertigen Request.
 */
@Component({
  selector: 'home-recipient-bulk-category-dialog',
  imports: [
    DecimalPipe,
    ButtonComponent,
    DialogComponent,
    DropdownListComponent,
    GridCellTemplateDirective,
    GridColumnComponent,
    GridComponent,
    SkeletonComponent,
    CheckboxComponent,
    EmptyStateComponent,
  ],
  templateUrl: './recipient-bulk-category-dialog.component.html',
  styleUrl: './recipient-bulk-category-dialog.component.scss',
})
export class RecipientBulkCategoryDialogComponent {
  readonly #transactionService = inject(TransactionService);
  private readonly dialog = viewChild.required(DialogComponent);

  readonly categoryOptions = input.required<DropdownData[]>();
  readonly assign = output<SetTransactionCategoryRequest>();

  readonly sourceTransaction = signal<TransactionDto | null>(null);
  readonly selectedIds = signal<ReadonlySet<number>>(new Set<number>());
  readonly categoryId = signal('');

  readonly #filter = signal<TransactionFilter | undefined>(undefined);

  readonly transactionsResource = rxResource({
    params: () => this.#filter(),
    stream: ({ params }) =>
      this.#transactionService.getTransactions(params).pipe(
        map((result) => {
          // Der Service mappt HTTP-Fehler in failed Results; anders als im Store
          // gibt es hier keinen globalen Fehlerkanal, also in error() heben.
          if (!result.isSuccess) {
            throw new Error(result.message || 'Buchungen konnten nicht geladen werden');
          }

          return result.value;
        })
      ),
  }) as ResourceRef<TransactionListResponse>;

  readonly transactions = computed(() =>
    this.transactionsResource.hasValue() ? this.transactionsResource.value().transactions : []
  );

  readonly totalCount = computed(() =>
    this.transactionsResource.hasValue() ? this.transactionsResource.value().totalCount : 0
  );

  readonly hasMoreThanLoaded = computed(() => this.totalCount() > this.transactions().length);

  readonly selectedCount = computed(() => this.selectedIds().size);

  readonly allSelected = computed(() => {
    const transactions = this.transactions();
    const selected = this.selectedIds();

    return (
      transactions.length > 0 &&
      transactions.every((transaction) => selected.has(transaction.transactionId))
    );
  });

  readonly #categoryNameById = computed(
    () => new Map(this.categoryOptions().map((option) => [option.value, option.name]))
  );

  /** Öffnen lädt asynchron; bis die Daten da sind, ist die Vorauswahl aufgeschoben. */
  #seedPending = false;

  constructor() {
    effect(() => {
      const transactions = this.transactions();

      if (!this.#seedPending || !transactions.length) {
        return;
      }

      this.#seedPending = false;
      untracked(() => this.#seedSelection(this.categoryId()));
    });
  }

  open(transaction: TransactionDto): void {
    if (!transaction.paymentPartnerId) {
      return;
    }

    this.sourceTransaction.set(transaction);
    this.selectedIds.set(new Set([transaction.transactionId]));
    this.categoryId.set(this.#categoryValue(transaction.categoryId));
    this.#seedPending = true;
    // Frisches Filter-Objekt: der Referenzwechsel lädt auch beim erneuten
    // Öffnen mit demselben Partner garantiert neu.
    this.#filter.set({
      accountId: transaction.accountId,
      paymentPartnerId: transaction.paymentPartnerId,
      page: 1,
      pageSize: PAGE_SIZE,
    });
    this.dialog().open();
  }

  close(): void {
    this.dialog().close();
  }

  protected onClosed(): void {
    this.#seedPending = false;
    this.#filter.set(undefined);
    this.sourceTransaction.set(null);
    this.selectedIds.set(new Set<number>());
  }

  onCategoryChange(categoryValue: string): void {
    this.categoryId.set(categoryValue);
    this.#seedSelection(categoryValue);
  }

  categoryName(categoryId: number | null): string {
    if (categoryId == null || categoryId === 0) {
      return 'Ohne Kategorie';
    }

    return this.#categoryNameById().get(String(categoryId)) ?? '—';
  }

  isSelected(transaction: TransactionDto): boolean {
    return this.selectedIds().has(transaction.transactionId);
  }

  toggleSelection(transaction: TransactionDto, checked: boolean): void {
    this.selectedIds.update((current) => {
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
      this.selectedIds.set(new Set<number>());
      return;
    }

    this.selectedIds.set(
      new Set(this.transactions().map((transaction) => transaction.transactionId))
    );
  }

  selectUncategorized(): void {
    this.selectedIds.set(
      new Set(
        this.transactions()
          .filter((transaction) => transaction.categoryId == null)
          .map((transaction) => transaction.transactionId)
      )
    );
  }

  submit(): void {
    const transactionIds = [...this.selectedIds()];

    if (!transactionIds.length) {
      return;
    }

    this.assign.emit({
      transactionIds,
      categoryId: this.categoryId() ? Number(this.categoryId()) : null,
    });
    this.close();
  }

  /**
   * Vorauswahl: die Quell-Buchung plus alle Buchungen, die bereits der
   * gewählten Kategorie angehören. Ersetzt die bisherige Auswahl — beim
   * Kategoriewechsel sollen genau die Mitglieder der Kategorie markiert sein.
   */
  #seedSelection(categoryValue: string): void {
    const next = new Set<number>();
    const source = this.sourceTransaction();

    if (source) {
      next.add(source.transactionId);
    }

    if (categoryValue) {
      for (const transaction of this.transactions()) {
        if (String(transaction.categoryId) === categoryValue) {
          next.add(transaction.transactionId);
        }
      }
    }

    this.selectedIds.set(next);
  }

  /** Nur Kategorien anbieten, die es in den Optionen gibt (fremder Haushalt → ''). */
  #categoryValue(categoryId: number | null): string {
    if (categoryId == null || categoryId === 0) {
      return '';
    }

    const value = String(categoryId);
    return this.categoryOptions().some((option) => option.value === value) ? value : '';
  }
}
