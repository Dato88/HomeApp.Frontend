export enum AccountType {
  Unknown = 0,
  Checking = 1,
  Savings = 2,
  CreditCard = 3,
  Depot = 4,
  Cash = 5,
  Other = 6,
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.Unknown]: 'Unknown',
  [AccountType.Checking]: 'Checking',
  [AccountType.Savings]: 'Savings',
  [AccountType.CreditCard]: 'Credit card',
  [AccountType.Depot]: 'Depot',
  [AccountType.Cash]: 'Cash',
  [AccountType.Other]: 'Other',
};
