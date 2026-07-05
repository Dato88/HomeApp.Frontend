export enum BudgetGroupType {
  Unknown = 0,
  Income = 1,
  Expense = 2,
}

export const BUDGET_GROUP_TYPE_LABELS: Record<BudgetGroupType, string> = {
  [BudgetGroupType.Unknown]: 'Unknown',
  [BudgetGroupType.Income]: 'Income',
  [BudgetGroupType.Expense]: 'Expense',
};

export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;
