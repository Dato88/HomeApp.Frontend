import { type } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { TransactionDto } from '../models';

export const transactionEntities = entityConfig({
  entity: type<TransactionDto>(),
  collection: 'transaction',
  selectId: (transaction) => transaction.transactionId,
});
