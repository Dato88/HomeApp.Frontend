import { Component, inject, viewChild } from '@angular/core';
import { SkeletonComponent } from '@Dato88/homeapp-lib';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { HouseholdStore } from '../../+state/household.store';
import { HouseholdCardComponent } from '../household-card/household-card.component';
import { HouseholdCreateFormComponent } from '../household-create-form/household-create-form.component';

@Component({
  selector: 'home-households-view',
  imports: [
    SkeletonComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
    HouseholdCardComponent,
    HouseholdCreateFormComponent,
  ],
  templateUrl: './households-view.component.html',
  styleUrl: './households-view.component.scss',
})
export class HouseholdsViewComponent {
  readonly store = inject(HouseholdStore);

  private readonly deleteDialog =
    viewChild.required<ConfirmDialogComponent<number>>('deleteDialog');

  createHousehold(name: string): void {
    this.store.createHousehold({ name });
  }

  renameHousehold(householdId: number, name: string): void {
    this.store.renameHousehold({ householdId, name });
  }

  inviteMember(householdId: number, email: string): void {
    this.store.addMember({ householdId, email });
  }

  removeMember(householdId: number, personId: number): void {
    this.store.removeMember({ householdId, personId });
  }

  requestDelete(householdId: number): void {
    this.deleteDialog().open(householdId);
  }

  confirmDelete(householdId: number | undefined): void {
    if (householdId !== undefined) {
      this.store.deleteHousehold(householdId);
    }
  }
}
