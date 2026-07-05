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
  isOwner: boolean;
  sharedHouseholdIds: number[];
}
