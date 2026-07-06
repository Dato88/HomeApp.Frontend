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
  [AccountType.Unknown]: 'Unbekannt',
  [AccountType.Checking]: 'Girokonto',
  [AccountType.Savings]: 'Sparkonto',
  [AccountType.CreditCard]: 'Kreditkarte',
  [AccountType.Depot]: 'Depot',
  [AccountType.Cash]: 'Bargeld',
  [AccountType.Other]: 'Sonstiges',
};
