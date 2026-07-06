import { Component, output, signal } from '@angular/core';
import { form, required, schema } from '@angular/forms/signals';
import { ButtonComponent, InputFieldComponent } from '@Dato88/homeapp-lib';

interface HouseholdFormModel {
  name: string;
}

@Component({
  selector: 'home-household-create-form',
  imports: [InputFieldComponent, ButtonComponent],
  template: `
    <form class="household-create-form card" (submit)="submitForm($event)" novalidate>
      <lib-input-field
        label="Neuer Haushalt"
        placeholder="Name"
        [required]="true"
        effectStyle="box"
        [value]="householdForm.name().value()"
        (valueChange)="householdForm.name().value.set($event)"
        [validationState]="
          householdForm.name().invalid() && householdForm.name().touched() ? 'error' : null
        "
        [errorMessage]="
          householdForm.name().invalid() && householdForm.name().touched()
            ? 'Name ist erforderlich'
            : ''
        "
        [attr.aria-invalid]="householdForm.name().invalid() && householdForm.name().touched()" />
      <lib-button [type]="'submit'" [label]="'Haushalt anlegen'"></lib-button>
    </form>
  `,
  styles: `
    .household-create-form {
      display: flex;
      flex-wrap: wrap;
      gap: var(--app-space-2);
      align-items: flex-end;
      margin-bottom: var(--app-space-4);
    }
  `,
})
export class HouseholdCreateFormComponent {
  readonly create = output<string>();

  private readonly householdModel = signal<HouseholdFormModel>({ name: '' });

  readonly householdForm = form(
    this.householdModel,
    schema((path) => {
      required(path.name);
    })
  );

  submitForm(event: Event): void {
    event.preventDefault();
    this.householdForm().markAsTouched();

    if (this.householdForm().invalid()) {
      return;
    }

    this.create.emit(this.householdForm().value().name.trim());
    this.householdForm().reset({ name: '' });
  }
}
