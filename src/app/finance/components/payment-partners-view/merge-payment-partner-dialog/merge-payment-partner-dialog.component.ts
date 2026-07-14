import { Component, input, output, signal, viewChild } from '@angular/core';
import { ButtonComponent, DialogComponent, DropdownListComponent } from '@Dato88/homeapp-lib';
import { MergePaymentPartnersRequest, PaymentPartnerDto } from '../../../+state/models';
import { DropdownData } from '../../../../shared/models/dropdown-data.model';

/**
 * Dialog „Zahlungspartner zusammenführen": wählt einen Ziel-Partner, in den der
 * geöffnete Source-Partner aufgeht. Schreibzugriff bleibt beim Aufrufer: `merged`
 * liefert den fertigen Request, der Host ruft den Store auf.
 */
@Component({
  selector: 'home-merge-payment-partner-dialog',
  imports: [ButtonComponent, DialogComponent, DropdownListComponent],
  templateUrl: './merge-payment-partner-dialog.component.html',
  styleUrl: './merge-payment-partner-dialog.component.scss',
})
export class MergePaymentPartnerDialogComponent {
  private readonly dialog = viewChild.required(DialogComponent);

  readonly targetOptions = input.required<DropdownData[]>();
  readonly merged = output<MergePaymentPartnersRequest>();

  readonly sourcePartner = signal<PaymentPartnerDto | null>(null);
  readonly targetId = signal('');

  open(partner: PaymentPartnerDto): void {
    this.sourcePartner.set(partner);
    this.targetId.set('');
    this.dialog().open();
  }

  close(): void {
    this.dialog().close();
  }

  protected onClosed(): void {
    this.sourcePartner.set(null);
    this.targetId.set('');
  }

  submit(): void {
    const source = this.sourcePartner();
    const targetId = this.targetId();

    if (!source || !targetId) {
      return;
    }

    this.merged.emit({
      sourcePaymentPartnerId: source.paymentPartnerId,
      targetPaymentPartnerId: Number(targetId),
    });
    this.close();
  }
}
