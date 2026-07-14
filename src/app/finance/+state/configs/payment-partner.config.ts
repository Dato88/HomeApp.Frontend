import { type } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { PaymentPartnerDto } from '../models';

export const paymentPartnerEntities = entityConfig({
  entity: type<PaymentPartnerDto>(),
  collection: 'paymentPartner',
  selectId: (partner) => partner.paymentPartnerId,
});
