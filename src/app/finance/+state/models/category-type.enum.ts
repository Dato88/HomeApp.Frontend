export enum CategoryType {
  Unknown = 0,
  Income = 1,
  Expense = 2,
}

export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  [CategoryType.Unknown]: 'Unbekannt',
  [CategoryType.Income]: 'Einnahme',
  [CategoryType.Expense]: 'Ausgabe',
};
