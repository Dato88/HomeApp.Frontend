import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ButtonComponent, InputFieldComponent, SkeletonComponent } from '@Dato88/homeapp-lib';
import { FinanceStore } from '../../+state/finance.store';
import {
  CategoryType,
  EvaReportCategoryDto,
  EvaReportGroupDto,
  EvaReportResponse,
} from '../../+state/models';
import { HouseholdStore } from '../../../household/+state/household.store';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';

export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
] as const;

@Component({
  selector: 'home-report-view',
  imports: [
    DecimalPipe,
    ButtonComponent,
    InputFieldComponent,
    SkeletonComponent,
    CheckboxComponent,
    EmptyStateComponent,
  ],
  templateUrl: './report-view.component.html',
  styleUrl: './report-view.component.scss',
})
export class ReportViewComponent {
  readonly store = inject(FinanceStore);
  readonly householdStore = inject(HouseholdStore);

  readonly monthLabels = MONTH_LABELS;

  readonly year = signal(String(new Date().getFullYear()));

  /** null = noch nicht initialisiert; wird beim ersten Laden auf alle Haushalte gesetzt. */
  private readonly selectedIds = signal<number[] | null>(null);

  readonly households = computed(() => this.householdStore.householdEntities());

  readonly selectedHouseholdIds = computed(() => this.selectedIds() ?? []);

  readonly report = computed<EvaReportResponse | null>(() =>
    this.store.evaReportResource.hasValue() ? this.store.evaReportResource.value() : null
  );

  readonly incomeGroups = computed(() =>
    (this.report()?.groups ?? []).filter((group) => group.categoryGroupType === CategoryType.Income)
  );

  readonly expenseGroups = computed(() =>
    (this.report()?.groups ?? []).filter((group) => group.categoryGroupType !== CategoryType.Income)
  );

  readonly ungroupedIncome = computed(() =>
    (this.report()?.ungroupedCategories ?? []).filter(
      (category) => category.categoryType === CategoryType.Income
    )
  );

  readonly ungroupedExpense = computed(() =>
    (this.report()?.ungroupedCategories ?? []).filter(
      (category) => category.categoryType !== CategoryType.Income
    )
  );

  readonly hasAnyRows = computed(() => {
    const report = this.report();

    return (
      !!report &&
      (report.groups.length > 0 ||
        report.ungroupedCategories.length > 0 ||
        report.unassignedTransactionCount > 0)
    );
  });

  readonly hasUnassigned = computed(() => (this.report()?.unassignedTransactionCount ?? 0) > 0);

  constructor() {
    // Beim ersten Eintreffen der Haushalte alle vorauswählen.
    effect(() => {
      const households = this.households();

      if (this.selectedIds() === null && households.length) {
        this.selectedIds.set(households.map((household) => household.householdId));
      }
    });

    effect(() => {
      const householdIds = this.selectedIds();
      const year = Number(this.year());

      if (householdIds?.length && year && !Number.isNaN(year)) {
        this.store.setEvaReportFilter({ householdIds, year });
      } else {
        this.store.setEvaReportFilter(undefined);
      }
    });
  }

  isHouseholdSelected(householdId: number): boolean {
    return this.selectedHouseholdIds().includes(householdId);
  }

  toggleHousehold(householdId: number, checked: boolean): void {
    this.selectedIds.update((current) => {
      const ids = (current ?? []).filter((id) => id !== householdId);
      return checked ? [...ids, householdId] : ids;
    });
  }

  previousYear(): void {
    this.year.update((year) => String((Number(year) || new Date().getFullYear()) - 1));
  }

  nextYear(): void {
    this.year.update((year) => String((Number(year) || new Date().getFullYear()) + 1));
  }

  setYear(value: string): void {
    this.year.set(value);
  }

  /** Ausgaben-Gruppen: über dem Ziel liegt schlecht (rot), darunter gut (grün). */
  percentState(group: EvaReportGroupDto): 'over' | 'under' | null {
    if (group.targetPercent == null || group.actualPercentOfIncome == null) {
      return null;
    }

    if (group.categoryGroupType === CategoryType.Income) {
      return null;
    }

    return group.actualPercentOfIncome > group.targetPercent ? 'over' : 'under';
  }

  trackGroup(group: EvaReportGroupDto): string {
    return `${group.householdId}-${group.categoryGroupId}`;
  }

  trackCategory(category: EvaReportCategoryDto): string {
    return `${category.householdId}-${category.categoryId}`;
  }
}
