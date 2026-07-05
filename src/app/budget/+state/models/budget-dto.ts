import { BudgetGroupType } from './budget.enums';

export interface BudgetCellDto {
  budgetCellId: number;
  budgetRowId: number;
  month: number;
  amount: number;
}

export interface BudgetRowDto {
  budgetRowId: number;
  budgetGroupId: number;
  index: number;
  title: string;
  categoryId: number | null;
}

export interface BudgetGroupDto {
  budgetGroupId: number;
  budgetId: number;
  index: number;
  title: string;
  budgetGroupType: BudgetGroupType;
  targetPercent: number | null;
}

export interface BudgetResponse {
  budgetId: number;
  year: number;
  budgetCells: BudgetCellDto[];
  budgetGroups: BudgetGroupDto[];
  budgetRows: BudgetRowDto[];
}

export interface EvaRowDto {
  budgetRowId: number;
  index: number;
  title: string;
  categoryId: number | null;
  categoryName: string | null;
  soll: number[];
  ist: number[];
  diff: number[];
  yearSoll: number;
  yearIst: number;
}

export interface EvaGroupDto {
  budgetGroupId: number;
  index: number;
  title: string;
  budgetGroupType: BudgetGroupType;
  targetPercent: number | null;
  plannedPercentOfIncome: number | null;
  actualPercentOfIncome: number | null;
  rows: EvaRowDto[];
  soll: number[];
  ist: number[];
  diff: number[];
  yearSoll: number;
  yearIst: number;
}

export interface EvaTotalsDto {
  incomeSoll: number[];
  incomeIst: number[];
  expenseSoll: number[];
  expenseIst: number[];
  diffSoll: number[];
  diffIst: number[];
  yearIncomeSoll: number;
  yearIncomeIst: number;
  yearExpenseSoll: number;
  yearExpenseIst: number;
  yearDiffSoll: number;
  yearDiffIst: number;
}

export interface EvaResponse {
  budgetId: number;
  householdId: number;
  year: number;
  groups: EvaGroupDto[];
  totals: EvaTotalsDto;
  unassignedIst: number[];
  unassignedTransactionCount: number;
}
