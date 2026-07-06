import { Component, input, output, signal, viewChild } from '@angular/core';
import { email, form, required, schema } from '@angular/forms/signals';
import { ButtonComponent, InputFieldComponent } from '@Dato88/homeapp-lib';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { HouseholdMemberDto, HouseholdResponse } from '../../+state/models';

interface InviteFormModel {
  email: string;
}

interface RemoveMemberContext {
  personId: number;
  email: string;
  name: string;
}

@Component({
  selector: 'home-household-card',
  imports: [InputFieldComponent, ButtonComponent, ConfirmDialogComponent],
  templateUrl: './household-card.component.html',
  styleUrl: './household-card.component.scss',
})
export class HouseholdCardComponent {
  readonly household = input.required<HouseholdResponse>();

  readonly rename = output<string>();
  readonly deleteHousehold = output<number>();
  readonly invite = output<string>();
  readonly removeMember = output<number>();

  readonly isRenaming = signal(false);
  readonly renameValue = signal('');
  readonly removeConfirmMessage = signal('');

  private readonly removeMemberDialog =
    viewChild.required<ConfirmDialogComponent<RemoveMemberContext>>('removeMemberDialog');

  private readonly inviteModel = signal<InviteFormModel>({ email: '' });

  readonly inviteForm = form(
    this.inviteModel,
    schema((path) => {
      required(path.email);
      email(path.email);
    })
  );

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
    this.inviteForm().markAsTouched();

    if (this.inviteForm().invalid()) {
      return;
    }

    const emailValue = this.inviteForm().value().email.trim();
    this.invite.emit(emailValue);
    this.inviteForm().reset({ email: '' });
  }

  confirmRemoveMember(member: HouseholdMemberDto): void {
    const name = `${member.firstName} ${member.lastName}`.trim();
    this.removeConfirmMessage.set(`${member.email} aus „${this.household().name}" entfernen?`);
    this.removeMemberDialog().open({ personId: member.personId, email: member.email, name });
  }

  onRemoveMemberConfirmed(context: RemoveMemberContext | undefined): void {
    if (context) {
      this.removeMember.emit(context.personId);
    }
  }
}
