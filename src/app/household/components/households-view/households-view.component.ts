import { Component, inject, signal, viewChild } from '@angular/core';
import { ButtonComponent, DialogComponent, SkeletonComponent } from '@Dato88/homeapp-lib';
import { HouseholdStore } from '../../+state/household.store';
import { HouseholdCardComponent } from '../household-card/household-card.component';
import { HouseholdCreateFormComponent } from '../household-create-form/household-create-form.component';

@Component({
  selector: 'home-households-view',
  imports: [
    ButtonComponent,
    DialogComponent,
    SkeletonComponent,
    HouseholdCardComponent,
    HouseholdCreateFormComponent,
  ],
  templateUrl: './households-view.component.html',
  styleUrl: './households-view.component.scss',
})
export class HouseholdsViewComponent {
  readonly store = inject(HouseholdStore);

  readonly deleteDialog = viewChild.required<DialogComponent>('deleteDialog');
  readonly pendingDeleteId = signal<number | null>(null);

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
    this.pendingDeleteId.set(householdId);
    this.deleteDialog().open();
  }

  confirmDelete(): void {
    const householdId = this.pendingDeleteId();

    if (householdId !== null) {
      this.store.deleteHousehold(householdId);
    }

    this.pendingDeleteId.set(null);
    this.deleteDialog().close();
  }

  cancelDelete(): void {
    this.pendingDeleteId.set(null);
    this.deleteDialog().close();
  }
}
