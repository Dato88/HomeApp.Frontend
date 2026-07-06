export enum BudgetGroupType {
  Unknown = 0,
  Income = 1,
  Expense = 2,
}

export const BUDGET_GROUP_TYPE_LABELS: Record<BudgetGroupType, string> = {
  [BudgetGroupType.Unknown]: 'Unbekannt',
  [BudgetGroupType.Income]: 'Einnahmen',
  [BudgetGroupType.Expense]: 'Ausgaben',
};

export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
] as const;

export const MONTH_LABELS_FULL = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const;
