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
    this.store.categoryEntities().filter((category) => category.categoryType === CategoryType.Income)
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
    this.name.set('');
    this.categoryType.set(String(CategoryType.Expense));
    this.formDialog().open();
  }

  openEdit(category: CategoryDto): void {
    this.editingCategory.set(category);
    this.name.set(category.name);
    this.categoryType.set(String(category.categoryType));
    this.formDialog().open();
  }

  closeFormDialog(): void {
    this.formDialog().close();
    this.editingCategory.set(null);
  }

  submitCategory(): void {
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
    return CATEGORY_TYPE_LABELS[category.categoryType] ?? 'Unknown';
  }
}
