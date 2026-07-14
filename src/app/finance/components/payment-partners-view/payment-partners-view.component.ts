import { Component, computed, inject, signal, viewChild } from '@angular/core';
import {
  ButtonComponent,
  DialogComponent,
  GridCellTemplateDirective,
  GridColumnComponent,
  GridComponent,
  InputFieldComponent,
  SkeletonComponent,
} from '@Dato88/homeapp-lib';
import { FinanceStore } from '../../+state/finance.store';
import { MergePaymentPartnersRequest, PaymentPartnerDto } from '../../+state/models';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { DropdownData } from '../../../shared/models/dropdown-data.model';
import { MergePaymentPartnerDialogComponent } from './merge-payment-partner-dialog/merge-payment-partner-dialog.component';

@Component({
  selector: 'home-payment-partners-view',
  imports: [
    ButtonComponent,
    DialogComponent,
    GridCellTemplateDirective,
    GridColumnComponent,
    GridComponent,
    InputFieldComponent,
    SkeletonComponent,
    EmptyStateComponent,
    MergePaymentPartnerDialogComponent,
  ],
  templateUrl: './payment-partners-view.component.html',
  styleUrl: './payment-partners-view.component.scss',
})
export class PaymentPartnersViewComponent {
  readonly store = inject(FinanceStore);

  readonly renameDialog = viewChild.required<DialogComponent>('renameDialog');
  readonly mergeDialog = viewChild.required<MergePaymentPartnerDialogComponent>('mergeDialog');

  readonly renamingPartner = signal<PaymentPartnerDto | null>(null);
  readonly displayName = signal('');
  readonly mergingPartnerId = signal<number | null>(null);

  private readonly submitted = signal(false);

  readonly showNameError = computed(() => this.submitted() && !this.displayName().trim());

  readonly canMerge = computed(() => this.store.paymentPartnerEntities().length > 1);

  readonly mergeTargetOptions = computed<DropdownData[]>(() =>
    this.store
      .paymentPartnerEntities()
      .filter((partner) => partner.paymentPartnerId !== this.mergingPartnerId())
      .map((partner) => ({
        value: String(partner.paymentPartnerId),
        name: partner.displayName,
        trackBy: partner.paymentPartnerId,
      }))
  );

  linkedAccountName(partner: PaymentPartnerDto): string | null {
    if (partner.linkedAccountId == null) {
      return null;
    }

    const account = this.store
      .accountEntities()
      .find((item) => item.accountId === partner.linkedAccountId);

    return account?.name ?? 'Eigenkonto';
  }

  openRename(partner: PaymentPartnerDto): void {
    this.renamingPartner.set(partner);
    this.submitted.set(false);
    this.displayName.set(partner.displayName);
    this.renameDialog().open();
  }

  closeRenameDialog(): void {
    this.renameDialog().close();
  }

  onRenameDialogClosed(): void {
    this.renamingPartner.set(null);
    this.submitted.set(false);
  }

  submitRename(): void {
    this.submitted.set(true);
    const partner = this.renamingPartner();
    const trimmedName = this.displayName().trim();

    if (!partner || !trimmedName) {
      return;
    }

    this.store.renamePaymentPartner({
      paymentPartnerId: partner.paymentPartnerId,
      displayName: trimmedName,
    });
    this.closeRenameDialog();
  }

  openMerge(partner: PaymentPartnerDto): void {
    this.mergingPartnerId.set(partner.paymentPartnerId);
    this.mergeDialog().open(partner);
  }

  onMerged(request: MergePaymentPartnersRequest): void {
    this.store.mergePaymentPartners(request);
  }
}
