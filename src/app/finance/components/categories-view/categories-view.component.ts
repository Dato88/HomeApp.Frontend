import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  ButtonComponent,
  DialogComponent,
  DropdownListComponent,
  GridCellTemplateDirective,
  GridColumnComponent,
  GridComponent,
  InputFieldComponent,
  SkeletonComponent,
} from '@Dato88/homeapp-lib';
import { FinanceStore } from '../../+state/finance.store';
import { HouseholdStore } from '../../../household/+state/household.store';
import {
  CATEGORY_TYPE_LABELS,
  CategoryDto,
  CategoryGroupDto,
  CategoryType,
  CreateCategoryGroupRequest,
  CreateCategoryRequest,
  UpdateCategoryGroupRequest,
  UpdateCategoryRequest,
} from '../../+state/models';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { DropdownData } from '../../../shared/models/dropdown-data.model';

@Component({
  selector: 'home-categories-view',
  imports: [
    DecimalPipe,
    ButtonComponent,
    DialogComponent,
    DropdownListComponent,
    GridCellTemplateDirective,
    GridColumnComponent,
    GridComponent,
    InputFieldComponent,
    SkeletonComponent,
    ConfirmDialogComponent,
    EmptyStateComponent,
  ],
  templateUrl: './categories-view.component.html',
  styleUrl: './categories-view.component.scss',
})
export class CategoriesViewComponent {
  readonly store = inject(FinanceStore);
  readonly householdStore = inject(HouseholdStore);

  readonly formDialog = viewChild.required<DialogComponent>('formDialog');
  readonly groupFormDialog = viewChild.required<DialogComponent>('groupFormDialog');

  readonly editingCategory = signal<CategoryDto | null>(null);
  readonly name = signal('');
  readonly categoryType = signal(String(CategoryType.Expense));
  readonly categoryGroupId = signal('');

  readonly editingGroup = signal<CategoryGroupDto | null>(null);
  readonly groupName = signal('');
  readonly groupType = signal(String(CategoryType.Expense));
  readonly groupTargetPercent = signal('');

  private readonly submitted = signal(false);
  private readonly groupSubmitted = signal(false);

  readonly showNameError = computed(() => this.submitted() && !this.name().trim());
  readonly showGroupNameError = computed(() => this.groupSubmitted() && !this.groupName().trim());

  readonly householdOptions = computed<DropdownData[]>(() =>
    this.householdStore.householdEntities().map((household) => ({
      value: String(household.householdId),
      name: household.name,
      trackBy: household.householdId,
    }))
  );

  readonly categoryTypeOptions = computed<DropdownData[]>(() =>
    [CategoryType.Income, CategoryType.Expense].map((type) => ({
      value: String(type),
      name: CATEGORY_TYPE_LABELS[type],
      trackBy: type,
    }))
  );

  /** Nur Gruppen mit passendem Typ – eine Ausgaben-Kategorie gehört nicht in eine Einnahmen-Gruppe. */
  readonly categoryGroupOptions = computed<DropdownData[]>(() => {
    const type = Number(this.categoryType()) as CategoryType;

    return this.store
      .categoryGroupEntities()
      .filter((group) => group.categoryGroupType === type)
      .map((group) => ({
        value: String(group.categoryGroupId),
        name: group.name,
        trackBy: group.categoryGroupId,
      }));
  });

  readonly selectedHouseholdIdValue = computed(() =>
    this.store.selectedHouseholdId() ? String(this.store.selectedHouseholdId()) : ''
  );

  readonly incomeCategories = computed(() =>
    this.store
      .categoryEntities()
      .filter((category) => category.categoryType === CategoryType.Income)
  );

  readonly expenseCategories = computed(() =>
    this.store
      .categoryEntities()
      .filter((category) => category.categoryType === CategoryType.Expense)
  );

  readonly categoryGroups = computed(() => this.store.categoryGroupEntities());

  setSelectedHouseholdId(householdId: string): void {
    this.store.setSelectedHouseholdId(householdId ? Number(householdId) : undefined);
  }

  openCreate(): void {
    if (!this.store.selectedHouseholdId()) {
      return;
    }

    this.editingCategory.set(null);
    this.submitted.set(false);
    this.name.set('');
    this.categoryType.set(String(CategoryType.Expense));
    this.categoryGroupId.set('');
    this.formDialog().open();
  }

  openEdit(category: CategoryDto): void {
    this.editingCategory.set(category);
    this.submitted.set(false);
    this.name.set(category.name);
    this.categoryType.set(String(category.categoryType));
    this.categoryGroupId.set(
      category.categoryGroupId != null ? String(category.categoryGroupId) : ''
    );
    this.formDialog().open();
  }

  closeFormDialog(): void {
    this.formDialog().close();
  }

  onFormDialogClosed(): void {
    this.editingCategory.set(null);
    this.submitted.set(false);
  }

  submitCategory(): void {
    this.submitted.set(true);
    const trimmedName = this.name().trim();
    const householdId = Number(this.store.selectedHouseholdId());
    const categoryType = Number(this.categoryType()) as CategoryType;

    if (!trimmedName || !householdId || Number.isNaN(householdId)) {
      return;
    }

    // Nach einem Typwechsel kann noch eine Gruppe des alten Typs selektiert sein.
    const groupValue = this.categoryGroupId();
    const categoryGroupId = this.categoryGroupOptions().some(
      (option) => option.value === groupValue
    )
      ? Number(groupValue)
      : null;

    const editing = this.editingCategory();

    if (editing) {
      const request: UpdateCategoryRequest = {
        categoryId: editing.categoryId,
        name: trimmedName,
        categoryType,
        categoryGroupId,
      };
      this.store.updateCategory(request);
    } else {
      const request: CreateCategoryRequest = {
        householdId,
        name: trimmedName,
        categoryType,
        categoryGroupId,
      };
      this.store.createCategory(request);
    }

    this.closeFormDialog();
  }

  deleteCategory(category: CategoryDto): void {
    this.store.deleteCategory(category.categoryId);
  }

  openCreateGroup(): void {
    if (!this.store.selectedHouseholdId()) {
      return;
    }

    this.editingGroup.set(null);
    this.groupSubmitted.set(false);
    this.groupName.set('');
    this.groupType.set(String(CategoryType.Expense));
    this.groupTargetPercent.set('');
    this.groupFormDialog().open();
  }

  openEditGroup(group: CategoryGroupDto): void {
    this.editingGroup.set(group);
    this.groupSubmitted.set(false);
    this.groupName.set(group.name);
    this.groupType.set(String(group.categoryGroupType));
    this.groupTargetPercent.set(group.targetPercent != null ? String(group.targetPercent) : '');
    this.groupFormDialog().open();
  }

  closeGroupFormDialog(): void {
    this.groupFormDialog().close();
  }

  onGroupFormDialogClosed(): void {
    this.editingGroup.set(null);
    this.groupSubmitted.set(false);
  }

  submitGroup(): void {
    this.groupSubmitted.set(true);
    const trimmedName = this.groupName().trim();
    const householdId = Number(this.store.selectedHouseholdId());
    const categoryGroupType = Number(this.groupType()) as CategoryType;

    if (!trimmedName || !householdId || Number.isNaN(householdId)) {
      return;
    }

    const percentValue = this.groupTargetPercent().trim();
    const parsedPercent = percentValue ? Number(percentValue.replace(',', '.')) : null;
    const targetPercent =
      parsedPercent != null && !Number.isNaN(parsedPercent) ? parsedPercent : null;

    const editing = this.editingGroup();

    if (editing) {
      const request: UpdateCategoryGroupRequest = {
        categoryGroupId: editing.categoryGroupId,
        name: trimmedName,
        categoryGroupType,
        targetPercent,
      };
      this.store.updateCategoryGroup(request);
    } else {
      const request: CreateCategoryGroupRequest = {
        householdId,
        name: trimmedName,
        categoryGroupType,
        targetPercent,
      };
      this.store.createCategoryGroup(request);
    }

    this.closeGroupFormDialog();
  }

  deleteGroup(group: CategoryGroupDto): void {
    this.store.deleteCategoryGroup(group.categoryGroupId);
  }

  groupNameOf(category: CategoryDto): string {
    if (category.categoryGroupId == null) {
      return '—';
    }

    return (
      this.store
        .categoryGroupEntities()
        .find((group) => group.categoryGroupId === category.categoryGroupId)?.name ??
      `#${category.categoryGroupId}`
    );
  }

  categoriesInGroup(group: CategoryGroupDto): number {
    return this.store
      .categoryEntities()
      .filter((category) => category.categoryGroupId === group.categoryGroupId).length;
  }
}
