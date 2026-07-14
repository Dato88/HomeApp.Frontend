import { AccountType } from './account-type.enum';

export interface AccountDto {
  accountId: number;
  personId: number;
  name: string;
  iban: string | null;
  bic: string | null;
  accountType: AccountType;
  currencyCode: string;
  description: string | null;
  isActive: boolean;
  /** ISO date string (yyyy-MM-dd); nur gesetzt, wenn isActive=false. */
  deactivatedFrom: string | null;
  isOwner: boolean;
  sharedHouseholdIds: number[];
}
