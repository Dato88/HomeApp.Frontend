import { TransactionSource } from './transaction-source.enum';

export interface TransactionDto {
  transactionId: number;
  accountId: number;
  /** ISO date string (yyyy-MM-dd). */
  bookingDate: string;
  /** ISO date string (yyyy-MM-dd). */
  valueDate: string | null;
  /** Signed amount: negative = expense, positive = income. */
  amount: number;
  counterpartyName: string | null;
  counterpartyIban: string | null;
  purpose: string | null;
  bankReference: string | null;
  categoryId: number | null;
  source: TransactionSource;
}

export interface TransactionListResponse {
  totalCount: number;
  transactions: TransactionDto[];
}

export interface ImportTransactionsResponse {
  imported: number;
  skippedDuplicates: number;
  failed: number;
  errors: string[];
}
