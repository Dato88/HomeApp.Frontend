import { BudgetGroupType } from './budget.enums';

export interface CreateBudgetGroupRequest {
  budgetId: number;
  index: number;
  title: string;
  budgetGroupType: BudgetGroupType;
  targetPercent?: number | null;
}

export interface UpdateBudgetGroupRequest {
  budgetGroupId: number;
  index: number;
  title: string;
  budgetGroupType: BudgetGroupType;
  targetPercent?: number | null;
}

export interface CreateBudgetRowRequest {
  budgetGroupId: number;
  index: number;
  title: string;
  categoryId?: number | null;
}

export interface UpdateBudgetRowRequest {
  budgetRowId: number;
  index: number;
  title: string;
  categoryId?: number | null;
}

export interface CreateBudgetCellRequest {
  budgetRowId: number;
  month: number;
  amount: number;
}

export interface UpdateBudgetCellRequest {
  budgetCellId: number;
  amount: number;
}

export interface BudgetSelection {
  householdId: number;
  year: number;
}
