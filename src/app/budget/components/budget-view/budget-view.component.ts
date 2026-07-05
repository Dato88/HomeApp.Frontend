import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  ButtonComponent,
  DropdownListComponent,
  InputFieldComponent,
  SkeletonComponent,
} from '@Dato88/homeapp-lib';
import { HouseholdStore } from '../../../household/+state/household.store';
import { FinanceStore } from '../../../finance/+state/finance.store';
import { BudgetStore } from '../../+state/budget.store';
import {
  BUDGET_GROUP_TYPE_LABELS,
  BudgetCellDto,
  BudgetGroupDto,
  BudgetGroupType,
  BudgetResponse,
  BudgetRowDto,
  CreateBudgetCellRequest,
  CreateBudgetGroupRequest,
  CreateBudgetRowRequest,
  MONTH_LABELS,
  UpdateBudgetCellRequest,
  UpdateBudgetGroupRequest,
  UpdateBudgetRowRequest,
} from '../../+state/models';
import { BudgetUiStore } from './+store/budget-ui.store';

interface DropdownOption {
  value: string;
  name: string;
  trackBy: number;
}

@Component({
  selector: 'home-budget-view',
  imports: [DecimalPipe, ButtonComponent, DropdownListComponent, InputFieldComponent, SkeletonComponent],
  providers: [BudgetUiStore],
  templateUrl: './budget-view.component.html',
  styleUrl: './budget-view.component.scss',
})
export class BudgetViewComponent {
  readonly store = inject(BudgetStore);
  readonly uiStore = inject(BudgetUiStore);
  readonly householdStore = inject(HouseholdStore);
  readonly financeStore = inject(FinanceStore);

  readonly selectedHouseholdId = signal('');
  readonly selectedYear = signal(String(new Date().getFullYear()));
  readonly monthLabels = MONTH_LABELS;

  readonly newGroupTitle = signal('');
  readonly newGroupType = signal(String(BudgetGroupType.Expense));
  readonly newGroupTargetPercent = signal('');
  readonly newRowTitle = signal('');
  readonly newRowGroupId = signal('');
  readonly newRowCategoryId = signal('');

  readonly householdOptions = computed<DropdownOption[]>(() =>
    this.householdStore.householdEntities().map((household) => ({
      value: String(household.householdId),
      name: household.name,
      trackBy: household.householdId,
    }))
  );

  readonly groupTypeOptions = computed<DropdownOption[]>(() =>
    [BudgetGroupType.Income, BudgetGroupType.Expense].map((type) => ({
      value: String(type),
      name: BUDGET_GROUP_TYPE_LABELS[type],
      trackBy: type,
    }))
  );

  readonly groupOptions = computed<DropdownOption[]>(() => {
    const budget = this.budget();

    if (!budget) {
      return [];
    }

    return budget.budgetGroups
      .slice()
      .sort((a, b) => a.index - b.index)
      .map((group) => ({
        value: String(group.budgetGroupId),
        name: group.title,
        trackBy: group.budgetGroupId,
      }));
  });

  readonly categoryOptions = computed<DropdownOption[]>(() => {
    const householdId = Number(this.selectedHouseholdId());

    return this.financeStore
      .categoryEntities()
      .filter((category) => category.householdId === householdId)
      .map((category) => ({
        value: String(category.categoryId),
        name: category.name,
        trackBy: category.categoryId,
      }));
  });

  readonly budget = computed<BudgetResponse | null>(() =>
    this.store.budgetResource.hasValue() ? this.store.budgetResource.value() : null
  );

  readonly eva = computed(() =>
    this.store.evaResource.hasValue() ? this.store.evaResource.value() : null
  );

  readonly usedCategoryIds = computed(() => {
    const budget = this.budget();

    if (!budget) {
      return new Set<number>();
    }

    return new Set(
      budget.budgetRows
        .map((row) => row.categoryId)
        .filter((categoryId): categoryId is number => categoryId != null)
    );
  });

  constructor() {
    effect(() => {
      const householdId = Number(this.selectedHouseholdId());
      const year = Number(this.selectedYear());

      if (householdId && !Number.isNaN(householdId) && year && !Number.isNaN(year)) {
        this.store.setSelection({ householdId, year });
        this.financeStore.setCategoryHouseholdId(householdId);
      } else {
        this.store.setSelection(undefined);
      }
    });
  }

  applySelection(): void {
    const householdId = Number(this.selectedHouseholdId());
    const year = Number(this.selectedYear());

    if (householdId && !Number.isNaN(householdId) && year && !Number.isNaN(year)) {
      this.store.setSelection({ householdId, year });
    }
  }

  createBudget(): void {
    const householdId = Number(this.selectedHouseholdId());
    const year = Number(this.selectedYear());

    if (householdId && !Number.isNaN(householdId) && year && !Number.isNaN(year)) {
      this.store.createBudget({ householdId, year });
    }
  }

  createGroup(): void {
    const budget = this.budget();
    const title = this.newGroupTitle().trim();

    if (!budget || !title) {
      return;
    }

    const request: CreateBudgetGroupRequest = {
      budgetId: budget.budgetId,
      index: budget.budgetGroups.length + 1,
      title,
      budgetGroupType: Number(this.newGroupType()) as BudgetGroupType,
      targetPercent: this.newGroupTargetPercent()
        ? Number(this.newGroupTargetPercent())
        : null,
    };

    this.store.createGroup(request);
    this.newGroupTitle.set('');
    this.newGroupTargetPercent.set('');
  }

  createRow(): void {
    const budget = this.budget();
    const title = this.newRowTitle().trim();
    const budgetGroupId = Number(this.newRowGroupId());

    if (!budget || !title || Number.isNaN(budgetGroupId)) {
      return;
    }

    const categoryId = this.newRowCategoryId() ? Number(this.newRowCategoryId()) : null;
    const rowsInGroup = budget.budgetRows.filter((row) => row.budgetGroupId === budgetGroupId);

    const request: CreateBudgetRowRequest = {
      budgetGroupId,
      index: rowsInGroup.length + 1,
      title,
      categoryId,
    };

    this.store.createRow(request);
    this.newRowTitle.set('');
    this.newRowCategoryId.set('');
  }

  rowsForGroup(groupId: number): BudgetRowDto[] {
    const budget = this.budget();

    if (!budget) {
      return [];
    }

    return budget.budgetRows
      .filter((row) => row.budgetGroupId === groupId)
      .slice()
      .sort((a, b) => a.index - b.index);
  }

  cellForRow(rowId: number, month: number): BudgetCellDto | undefined {
    return this.budget()?.budgetCells.find(
      (cell) => cell.budgetRowId === rowId && cell.month === month
    );
  }

  rowYearTotal(rowId: number): number {
    const budget = this.budget();

    if (!budget) {
      return 0;
    }

    return budget.budgetCells
      .filter((cell) => cell.budgetRowId === rowId)
      .reduce((sum, cell) => sum + cell.amount, 0);
  }

  updateCellAmount(cell: BudgetCellDto, amount: string): void {
    const parsed = Number(amount.replace(',', '.'));

    if (Number.isNaN(parsed)) {
      return;
    }

    const request: UpdateBudgetCellRequest = {
      budgetCellId: cell.budgetCellId,
      amount: parsed,
    };

    this.store.updateCell(request);
  }

  createOrUpdateCell(rowId: number, month: number, amount: string): void {
    const parsed = Number(amount.replace(',', '.'));

    if (Number.isNaN(parsed)) {
      return;
    }

    const existing = this.cellForRow(rowId, month);

    if (existing) {
      this.updateCellAmount(existing, amount);
      return;
    }

    const request: CreateBudgetCellRequest = {
      budgetRowId: rowId,
      month,
      amount: parsed,
    };

    this.store.createCell(request);
  }

  updateRowCategory(row: BudgetRowDto, categoryId: string): void {
    const request: UpdateBudgetRowRequest = {
      budgetRowId: row.budgetRowId,
      index: row.index,
      title: row.title,
      categoryId: categoryId ? Number(categoryId) : null,
    };

    this.store.updateRow(request);
  }

  deleteGroup(group: BudgetGroupDto): void {
    this.store.deleteGroup(group.budgetGroupId);
  }

  deleteRow(row: BudgetRowDto): void {
    this.store.deleteRow(row.budgetRowId);
  }

  groupTypeLabel(group: BudgetGroupDto): string {
    return BUDGET_GROUP_TYPE_LABELS[group.budgetGroupType] ?? 'Unknown';
  }

  categoryName(categoryId: number | null): string {
    if (categoryId == null) {
      return '—';
    }

    return (
      this.financeStore.categoryEntities().find((category) => category.categoryId === categoryId)
        ?.name ?? `#${categoryId}`
    );
  }

  sumArray(values: number[] | undefined): number {
    return values?.reduce((sum, value) => sum + value, 0) ?? 0;
  }

  categoryValue(categoryId: number | null): string {
    return categoryId != null ? String(categoryId) : '';
  }
}
