import { type } from '@ngrx/signals';
import { entityConfig } from '@ngrx/signals/entities';
import { AccountDto } from '../models';

export const accountEntities = entityConfig({
  entity: type<AccountDto>(),
  collection: 'account',
  selectId: (account) => account.accountId,
});
