import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
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
  CategoryType,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../../+state/models';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

interface DropdownOption {
  value: string;
  name: string;
  trackBy: number;
}

@Component({
  selector: 'home-categories-view',
  imports: [
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

  readonly selectedHouseholdId = signal('');
  readonly editingCategory = signal<CategoryDto | null>(null);
  readonly name = signal('');
  readonly categoryType = signal(String(CategoryType.Expense));

  private readonly submitted = signal(false);

  readonly showNameError = computed(() => this.submitted() && !this.name().trim());

  readonly householdOptions = computed<DropdownOption[]>(() =>
    this.householdStore.householdEntities().map((household) => ({
      value: String(household.householdId),
      name: household.name,
      trackBy: household.householdId,
    }))
  );

  readonly categoryTypeOptions = computed<DropdownOption[]>(() =>
    [CategoryType.Income, CategoryType.Expense].map((type) => ({
      value: String(type),
      name: CATEGORY_TYPE_LABELS[type],
      trackBy: type,
    }))
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

  constructor() {
    effect(() => {
      const householdId = Number(this.selectedHouseholdId());
      this.store.setCategoryHouseholdId(
        householdId && !Number.isNaN(householdId) ? householdId : undefined
      );
    });
  }

  onHouseholdChange(householdId: string): void {
    this.selectedHouseholdId.set(householdId);
  }

  openCreate(): void {
    if (!this.selectedHouseholdId()) {
      return;
    }

    this.editingCategory.set(null);
    this.submitted.set(false);
    this.name.set('');
    this.categoryType.set(String(CategoryType.Expense));
    this.formDialog().open();
  }

  openEdit(category: CategoryDto): void {
    this.editingCategory.set(category);
    this.submitted.set(false);
    this.name.set(category.name);
    this.categoryType.set(String(category.categoryType));
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
    const householdId = Number(this.selectedHouseholdId());
    const categoryType = Number(this.categoryType()) as CategoryType;

    if (!trimmedName || !householdId || Number.isNaN(householdId)) {
      return;
    }

    const editing = this.editingCategory();

    if (editing) {
      const request: UpdateCategoryRequest = {
        categoryId: editing.categoryId,
        name: trimmedName,
        categoryType,
      };
      this.store.updateCategory(request);
    } else {
      const request: CreateCategoryRequest = {
        householdId,
        name: trimmedName,
        categoryType,
      };
      this.store.createCategory(request);
    }

    this.closeFormDialog();
  }

  deleteCategory(category: CategoryDto): void {
    this.store.deleteCategory(category.categoryId);
  }

  categoryTypeLabel(category: CategoryDto): string {
    return CATEGORY_TYPE_LABELS[category.categoryType] ?? 'Unbekannt';
  }
}
