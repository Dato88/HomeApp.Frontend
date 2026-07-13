import { CategoryType } from './category-type.enum';

/**
 * E+A-Report (Einnahmen/Ausgaben), rein aus Transaktionen berechnet.
 * Alle `ist`-Arrays haben 12 Monatswerte, Index 0 = Januar.
 * Gruppierte Werte sind positiv dargestellt (vom Gruppentyp geflippt).
 */
export interface EvaReportCategoryDto {
  categoryId: number;
  householdId: number;
  name: string;
  categoryType: CategoryType;
  ist: number[];
  yearIst: number;
}

export interface EvaReportGroupDto {
  categoryGroupId: number;
  householdId: number;
  name: string;
  categoryGroupType: CategoryType;
  targetPercent: number | null;
  actualPercentOfIncome: number | null;
  categories: EvaReportCategoryDto[];
  ist: number[];
  yearIst: number;
}

export interface EvaReportTotalsDto {
  incomeIst: number[];
  expenseIst: number[];
  diffIst: number[];
  yearIncomeIst: number;
  yearExpenseIst: number;
  yearDiffIst: number;
}

export interface EvaReportResponse {
  year: number;
  householdIds: number[];
  groups: EvaReportGroupDto[];
  ungroupedCategories: EvaReportCategoryDto[];
  totals: EvaReportTotalsDto;
  /** Signiert: unkategorisierte Buchungen + Kategorien nicht angefragter Haushalte. */
  unassignedIst: number[];
  unassignedTransactionCount: number;
}

export interface EvaReportFilter {
  householdIds: number[];
  year: number;
}
