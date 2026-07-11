import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import {
  ButtonComponent,
  DropdownListComponent,
  InputFieldComponent,
  SkeletonComponent,
} from '@Dato88/homeapp-lib';
import { HouseholdStore } from '../../../household/+state/household.store';
import { FinanceStore } from '../../../finance/+state/finance.store';
import { ViewportService } from '../../../shared/services/viewport/viewport.service';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { TabBarComponent, TabItem } from '../../../shared/ui/tab-bar/tab-bar.component';
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
  MONTH_LABELS_FULL,
  UpdateBudgetCellRequest,
  UpdateBudgetRowRequest,
} from '../../+state/models';
import { BudgetUiStore, BudgetViewMode } from './+store/budget-ui.store';
import { DropdownData } from '../../../shared/models/dropdown-data.model';

@Component({
  selector: 'home-budget-view',
  imports: [
    DecimalPipe,
    ButtonComponent,
    DropdownListComponent,
    InputFieldComponent,
    SkeletonComponent,
    PageHeaderComponent,
    TabBarComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
  ],
  providers: [BudgetUiStore],
  templateUrl: './budget-view.component.html',
  styleUrl: './budget-view.component.scss',
})
export class BudgetViewComponent {
  readonly store = inject(BudgetStore);
  readonly uiStore = inject(BudgetUiStore);
  readonly householdStore = inject(HouseholdStore);
  readonly financeStore = inject(FinanceStore);
  readonly viewport = inject(ViewportService);

  readonly selectedYear = signal(String(new Date().getFullYear()));
  readonly monthLabels = MONTH_LABELS;
  readonly months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
  readonly monthIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

  readonly selectedHouseholdIdValue = computed(() =>
    this.financeStore.selectedHouseholdId() ? String(this.financeStore.selectedHouseholdId()) : ''
  );

  readonly budgetTabs: TabItem<BudgetViewMode>[] = [
    { id: 'editor', label: 'Budgetplan' },
    { id: 'eva', label: 'Einnahme/Ausgabe' },
  ];

  readonly newGroupTitle = signal('');
  readonly newGroupType = signal('');
  readonly newGroupTargetPercent = signal('');
  readonly newRowTitle = signal('');
  readonly newRowGroupId = signal('');
  readonly newRowCategoryId = signal('');

  private readonly deleteGroupDialog =
    viewChild.required<ConfirmDialogComponent<BudgetGroupDto>>('deleteGroupDialog');
  private readonly deleteRowDialog =
    viewChild.required<ConfirmDialogComponent<BudgetRowDto>>('deleteRowDialog');

  readonly householdOptions = computed<DropdownData[]>(() =>
    this.householdStore.householdEntities().map((household) => ({
      value: String(household.householdId),
      name: household.name,
      trackBy: household.householdId,
    }))
  );

  readonly groupTypeOptions = computed<DropdownData[]>(() =>
    [BudgetGroupType.Income, BudgetGroupType.Expense].map((type) => ({
      value: String(type),
      name: BUDGET_GROUP_TYPE_LABELS[type],
      trackBy: type,
    }))
  );

  readonly groupOptions = computed<DropdownData[]>(() => {
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

  readonly categoryOptions = computed<DropdownData[]>(() => {
    const householdId = Number(this.financeStore.selectedHouseholdId());

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

  readonly sortedGroups = computed(() => {
    const budget = this.budget();

    if (!budget) {
      return [];
    }

    return budget.budgetGroups.slice().sort((a, b) => a.index - b.index);
  });

  readonly selectedMonthLabel = computed(() => {
    const month = this.uiStore.selectedMonth();
    const year = this.selectedYear();
    return `${MONTH_LABELS_FULL[month - 1]} ${year}`;
  });

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
      const householdId = Number(this.financeStore.selectedHouseholdId());
      const year = Number(this.selectedYear());

      if (householdId && !Number.isNaN(householdId) && year && !Number.isNaN(year)) {
        this.store.setSelection({ householdId, year });
        this.financeStore.setSelectedHouseholdId(householdId);
      } else {
        this.store.setSelection(undefined);
      }
    });
  }

  setSelectedHouseholdId(householdId: string): void {
    this.financeStore.setSelectedHouseholdId(householdId ? Number(householdId) : undefined);
  }

  applySelection(): void {
    const householdId = Number(this.financeStore.selectedHouseholdId());
    const year = Number(this.selectedYear());

    if (householdId && !Number.isNaN(householdId) && year && !Number.isNaN(year)) {
      this.store.setSelection({ householdId, year });
    }
  }

  createBudget(): void {
    const householdId = Number(this.financeStore.selectedHouseholdId());
    const year = Number(this.selectedYear());

    if (householdId && !Number.isNaN(householdId) && year && !Number.isNaN(year)) {
      this.store.createBudget({ householdId, year });
    }
  }

  createGroup(): void {
    const budget = this.budget();
    const title = this.newGroupTitle().trim();
    const groupType = Number(this.newGroupType());

    if (!budget || !title || !groupType || Number.isNaN(groupType)) {
      return;
    }

    const request: CreateBudgetGroupRequest = {
      budgetId: budget.budgetId,
      index: budget.budgetGroups.length + 1,
      title,
      budgetGroupType: groupType as BudgetGroupType,
      targetPercent: this.newGroupTargetPercent() ? Number(this.newGroupTargetPercent()) : null,
    };

    this.store.createGroup(request);
    this.newGroupTitle.set('');
    this.newGroupType.set('');
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

  confirmDeleteGroup(group: BudgetGroupDto): void {
    this.deleteGroupDialog().open(group);
  }

  confirmDeleteRow(row: BudgetRowDto): void {
    this.deleteRowDialog().open(row);
  }

  onDeleteGroupConfirmed(group: BudgetGroupDto | undefined): void {
    if (group) {
      this.store.deleteGroup(group.budgetGroupId);
    }
  }

  onDeleteRowConfirmed(row: BudgetRowDto | undefined): void {
    if (row) {
      this.store.deleteRow(row.budgetRowId);
    }
  }

  groupTypeLabel(group: BudgetGroupDto): string {
    return BUDGET_GROUP_TYPE_LABELS[group.budgetGroupType] ?? 'Unbekannt';
  }

  isIncomeGroup(group: { budgetGroupType: BudgetGroupType }): boolean {
    return group.budgetGroupType === BudgetGroupType.Income;
  }

  monthLabel(month: number): string {
    return MONTH_LABELS[month - 1] ?? String(month);
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
    if (categoryId == null || categoryId === 0) {
      return '';
    }

    const value = String(categoryId);
    return this.categoryOptions().some((option) => option.value === value) ? value : '';
  }

  yearDiff(soll: number, ist: number): number {
    return ist - soll;
  }

  reloadBudget(): void {
    this.store.budgetResource.reload();
    this.store.evaResource.reload();
  }
}
