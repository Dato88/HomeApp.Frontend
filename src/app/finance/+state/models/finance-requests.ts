import { AccountType } from './account-type.enum';
import { CategoryType } from './category-type.enum';

export interface CreateAccountRequest {
  name: string;
  iban?: string | null;
  bic?: string | null;
  accountType: AccountType;
  currencyCode?: string | null;
  description?: string | null;
  /** Optional immediate share into these households. */
  householdIds?: number[];
}

/** PATCH is a full replace: always send every field. */
export interface UpdateAccountRequest {
  accountId: number;
  name: string;
  iban?: string | null;
  bic?: string | null;
  accountType: AccountType;
  currencyCode?: string | null;
  description?: string | null;
  isActive: boolean;
  /** Nur zulässig, wenn isActive=false; sonst null senden. */
  deactivatedFrom?: string | null;
}

export interface ShareAccountRequest {
  accountId: number;
  householdId: number;
}

export interface CreateCategoryRequest {
  householdId: number;
  name: string;
  categoryType: CategoryType;
  categoryGroupId?: number | null;
}

/** PATCH is a full replace: always send every field. */
export interface UpdateCategoryRequest {
  categoryId: number;
  name: string;
  categoryType: CategoryType;
  categoryGroupId?: number | null;
}

export interface CreateCategoryGroupRequest {
  householdId: number;
  name: string;
  categoryGroupType: CategoryType;
  targetPercent?: number | null;
}

/** PATCH is a full replace: always send every field. */
export interface UpdateCategoryGroupRequest {
  categoryGroupId: number;
  name: string;
  categoryGroupType: CategoryType;
  targetPercent?: number | null;
}

export interface CreateTransactionRequest {
  accountId: number;
  /** ISO date string (yyyy-MM-dd). */
  bookingDate: string;
  /** ISO date string (yyyy-MM-dd). */
  valueDate?: string | null;
  /** Signed amount: negative = expense, positive = income. */
  amount: number;
  paymentPartnerName?: string | null;
  paymentPartnerIban?: string | null;
  purpose?: string | null;
  categoryId?: number | null;
}

/** PATCH is a full replace: always send every field. */
export interface UpdateTransactionRequest {
  transactionId: number;
  bookingDate: string;
  valueDate?: string | null;
  amount: number;
  paymentPartnerName?: string | null;
  paymentPartnerIban?: string | null;
  purpose?: string | null;
}

/** All-or-nothing: das Backend weist die Kategorie allen IDs zu oder keiner (max. 500). */
export interface SetTransactionCategoryRequest {
  transactionIds: number[];
  categoryId: number | null;
}

export interface TransactionFilter {
  accountId: number;
  /** ISO date string (yyyy-MM-dd). */
  from?: string | null;
  /** ISO date string (yyyy-MM-dd). */
  to?: string | null;
  categoryId?: number | null;
  uncategorized?: boolean;
  /** Exakte, normalisierte Gegenkonto-IBAN; Spezialfall. Für „per Empfänger" paymentPartnerId nutzen. */
  paymentPartnerIban?: string | null;
  /** Filter auf den aufgelösten Zahlungspartner; vom Backend empfohlen. */
  paymentPartnerId?: number | null;
  /** 1-based page index. */
  page: number;
  /** Max 200. */
  pageSize: number;
}

export interface ImportTransactionsRequest {
  accountId: number;
  file: File;
  /** Optional format hint; backend auto-detects when omitted. */
  format?: string | null;
}

export interface RenamePaymentPartnerRequest {
  paymentPartnerId: number;
  displayName: string;
}

export interface MergePaymentPartnersRequest {
  targetPaymentPartnerId: number;
  sourcePaymentPartnerId: number;
}
