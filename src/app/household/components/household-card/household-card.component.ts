import { Component, input, output, signal } from '@angular/core';
import { ButtonComponent, InputFieldComponent } from '@Dato88/homeapp-lib';
import { HouseholdResponse } from '../../+state/models';

@Component({
  selector: 'home-household-card',
  imports: [InputFieldComponent, ButtonComponent],
  template: `
    <article class="household-card">
      <header class="household-card-header">
        @if (isRenaming()) {
          <form class="rename-form" (submit)="submitRename($event)" novalidate>
            <lib-input-field
              label="Household name"
              effectStyle="box"
              [required]="true"
              [value]="renameValue()"
              (valueChange)="renameValue.set($event)" />
            <lib-button [type]="'submit'" [label]="'Save'"></lib-button>
            <lib-button [label]="'Cancel'" (clicked)="isRenaming.set(false)"></lib-button>
          </form>
        } @else {
          <h2 class="household-name">{{ household().name }}</h2>
          <div class="household-actions">
            <lib-button
              [label]="'Rename'"
              [ariaLabel]="'Rename household ' + household().name"
              (clicked)="startRename()"></lib-button>
            <lib-button
              [label]="'Delete'"
              [ariaLabel]="'Delete household ' + household().name"
              (clicked)="deleteHousehold.emit(household().householdId)"></lib-button>
          </div>
        }
      </header>

      <h3 class="members-heading">Members</h3>
      <ul class="member-list" role="list">
        @for (member of household().members; track member.personId) {
          <li class="member-list-item">
            <span class="member-name">{{ member.firstName }} {{ member.lastName }}</span>
            <span class="member-email">{{ member.email }}</span>
            <button
              type="button"
              class="remove-member-button"
              [disabled]="household().members.length <= 1"
              [attr.aria-label]="'Remove member ' + member.email"
              (click)="removeMember.emit(member.personId)">
              Remove
            </button>
          </li>
        }
      </ul>

      <form class="invite-form" (submit)="submitInvite($event)" novalidate>
        <lib-input-field
          label="Invite by email"
          type="email"
          placeholder="partner@example.com"
          effectStyle="box"
          [value]="inviteEmail()"
          (valueChange)="inviteEmail.set($event)" />
        <lib-button [type]="'submit'" [label]="'Invite'"></lib-button>
      </form>
    </article>
  `,
  styles: `
    .household-card {
      border: 1px solid #676767;
      border-radius: 0.25rem;
      padding: 1rem;
      width: 100%;
      box-sizing: border-box;
      display: grid;
      gap: 0.5rem;
    }

    .household-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .household-name {
      margin: 0;
      font-size: 1.2rem;
    }

    .household-actions,
    .rename-form,
    .invite-form {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .members-heading {
      margin: 0;
      font-size: 1rem;
    }

    .member-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.25rem;
    }

    .member-list-item {
      display: grid;
      grid-template-columns: 1fr 1fr max-content;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid #d3d3d3;
      border-radius: 0.25rem;
      padding: 0.25rem 0.5rem;
    }

    .remove-member-button {
      border: none;
      border-radius: 0.25rem;
      background-color: red;
      color: white;
      padding: 0.4rem 1rem;
      cursor: pointer;

      &:disabled {
        background-color: #d3d3d3;
        cursor: not-allowed;
      }
    }
  `,
})
export class HouseholdCardComponent {
  readonly household = input.required<HouseholdResponse>();

  readonly rename = output<string>();
  readonly deleteHousehold = output<number>();
  readonly invite = output<string>();
  readonly removeMember = output<number>();

  readonly isRenaming = signal(false);
  readonly renameValue = signal('');
  readonly inviteEmail = signal('');

  startRename(): void {
    this.renameValue.set(this.household().name);
    this.isRenaming.set(true);
  }

  submitRename(event: Event): void {
    event.preventDefault();
    const name = this.renameValue().trim();

    if (!name) {
      return;
    }

    this.rename.emit(name);
    this.isRenaming.set(false);
  }

  submitInvite(event: Event): void {
    event.preventDefault();
    const email = this.inviteEmail().trim();

    if (!email) {
      return;
    }

    this.invite.emit(email);
    this.inviteEmail.set('');
  }
}
